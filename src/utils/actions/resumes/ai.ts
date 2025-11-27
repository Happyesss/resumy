'use server';

import { PROJECT_GENERATOR_MESSAGE, PROJECT_IMPROVER_MESSAGE, SUMMARY_IMPROVER_MESSAGE, TEXT_ANALYZER_SYSTEM_MESSAGE, WORK_EXPERIENCE_GENERATOR_MESSAGE, WORK_EXPERIENCE_IMPROVER_MESSAGE } from "@/lib/prompts";
import { Resume, WorkExperience } from "@/lib/types";
import { projectAnalysisSchema, textImportSchema, workExperienceBulletPointsSchema, workExperienceItemsSchema } from "@/lib/zod-schemas";
import { initializeAIClient, type AIConfig } from '@/utils/ai-tools';
import { generateObject, generateText } from "ai";
import { z } from "zod";

// Helper function to clean JSON responses that might be wrapped in markdown
function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks if present
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);
  if (match) {
    return match[1].trim();
  }
  return text.trim();
}

// Helper function to clean extra spaces from text
function cleanExtraSpaces(text: string): string {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\s{2,}/g, ' ')  // Replace multiple spaces with single space
    .trim();
}

// Recursively clean all string values in an object
function cleanAllStrings(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return cleanExtraSpaces(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanAllStrings(item));
  }
  if (obj && typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = cleanAllStrings((obj as Record<string, unknown>)[key]);
    }
    return cleaned;
  }
  return obj;
}

// Wrapper function for generateObject with fallback to generateText
async function safeGenerateObject(params: any) {
  try {
    return await generateObject(params);
  } catch (error) {
    // Check if it's a JSON parsing error or AI generation error
    if (error instanceof Error && (
      error.message.includes('JSON parsing failed') || 
      error.message.includes('not valid JSON') ||
      error.message.includes('No object generated') ||
      error.name === 'AI_NoObjectGeneratedError' ||
      error.name === 'AI_JSONParseError'
    )) {
      console.warn('generateObject failed due to JSON parsing/generation error, falling back to generateText:', error.message);
      
      // Fallback to generateText
      const { text } = await generateText({
        model: params.model,
        prompt: params.prompt + "\n\nIMPORTANT: Return your response as valid JSON only, without markdown code blocks.",
        system: params.system,
      });
      
      try {
        const cleanedText = cleanJsonResponse(text);
        const parsedObject = JSON.parse(cleanedText);
        return { object: parsedObject };
      } catch (parseError) {
        console.error('JSON parsing failed in fallback:', parseError);
        throw new Error(`Failed to parse AI response as JSON: ${text}`);
      }
    }
    // Re-throw if it's not a JSON parsing error
    throw error;
  }
}



// Base Resume Creation 
// TEXT CONTENT -> RESUME
export async function convertTextToResume(prompt: string, existingResume: Resume, targetRole: string, config?: AIConfig) {

  // Use config if provided, otherwise use gemini-2.0-flash for import resume functionality
  const importConfig = config || { model: 'gemini-2.0-flash', apiKeys: [] };
  const aiClient = initializeAIClient(importConfig);

  
  const { object } = await safeGenerateObject({
    model: aiClient,
    schema: z.object({
      content: textImportSchema
    }),
    prompt: `Parse this resume and extract ALL information into structured JSON.

RESUME TEXT:
${prompt}

Extract these sections:
- Personal info: first_name, last_name, email, phone_number, location, website, linkedin_url, github_url
- education: array of {school, degree, field, date, location, achievements, description}
- skills: array of {category, items} - group skills by their category labels (e.g., "Frontend:", "Backend:")
- projects: array of {name, description[], technologies[], date, url, github_url}
- work_experience: array of {company, position, date, location, description[], technologies[]}

IMPORTANT RULES:
1. ONLY extract what is ACTUALLY present in the resume text
2. DO NOT invent or hallucinate any data - if a section doesn't exist, return an empty array
3. For work_experience: ONLY include actual jobs with real company names and job titles from the text
4. A "PROFESSIONAL SUMMARY" is NOT work experience - it's just a summary
5. Projects are NOT work experience - keep them separate
6. Return empty arrays [] for any section not found in the resume`,
    system: `You are a precise resume parser. Extract ONLY what exists in the provided text.

CRITICAL:
- DO NOT make up or hallucinate any information
- DO NOT confuse "Professional Summary" with work experience
- DO NOT include projects as work experience  
- If there is no EXPERIENCE/WORK HISTORY section, return empty work_experience array
- Only include work_experience if you see actual job titles at real companies with dates`,
    
  });
  
  // Extract LinkedIn and GitHub URLs if not already extracted by AI
  if (!object.content.linkedin_url || !object.content.github_url) {
    const linkedinMatch = prompt.match(/linkedin\.com\/in\/([^\s•]+)/i);
    const githubMatch = prompt.match(/github\.com\/([^\s•]+)/i);
    
    if (linkedinMatch && !object.content.linkedin_url) {
      object.content.linkedin_url = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
    }
    if (githubMatch && !object.content.github_url) {
      object.content.github_url = `https://github.com/${githubMatch[1]}`;
    }
  }

  // Validate work experience - check if company names actually appear in the resume text
  if (object.content.work_experience && Array.isArray(object.content.work_experience)) {
    object.content.work_experience = object.content.work_experience.filter((exp: { company?: string }) => {
      // Check if the company name actually exists in the original text
      if (exp.company && typeof exp.company === 'string') {
        const companyExistsInText = prompt.toLowerCase().includes(exp.company.toLowerCase());
        if (!companyExistsInText) {
          return false;
        }
      }
      return true;
    });
  }

  // Ensure arrays are never undefined - defensive fallback
  const safeContent = {
    ...object.content,
    education: Array.isArray(object.content.education) ? object.content.education : [],
    skills: Array.isArray(object.content.skills) ? object.content.skills : [],
    projects: Array.isArray(object.content.projects) ? object.content.projects : [],
    work_experience: Array.isArray(object.content.work_experience) ? object.content.work_experience : [],
  };

  // If AI missed sections, try manual parsing as fallback
  const hasEducation = safeContent.education.length > 0;
  const hasSkills = safeContent.skills.length > 0;
  const hasProjects = safeContent.projects.length > 0;

  if (!hasEducation || !hasSkills || !hasProjects) {
    const fallbackResult = parseResumeManually(prompt);

    if (!hasEducation && fallbackResult.education.length > 0) {
      safeContent.education = fallbackResult.education;
    }
    if (!hasSkills && fallbackResult.skills.length > 0) {
      safeContent.skills = fallbackResult.skills;
    }
    if (!hasProjects && fallbackResult.projects.length > 0) {
      safeContent.projects = fallbackResult.projects;
    }
  }

  // Clean all extra spaces from the result
  const cleanedContent = cleanAllStrings(safeContent) as typeof safeContent;
  
  const updatedResume = {
    ...existingResume,
    ...(cleanedContent.first_name && { first_name: cleanedContent.first_name }),
    ...(cleanedContent.last_name && { last_name: cleanedContent.last_name }),
    ...(cleanedContent.email && { email: cleanedContent.email }),
    ...(cleanedContent.phone_number && { phone_number: cleanedContent.phone_number }),
    ...(cleanedContent.location && { location: cleanedContent.location }),
    ...(cleanedContent.website && { website: cleanedContent.website }),
    ...(cleanedContent.linkedin_url && { linkedin_url: cleanedContent.linkedin_url }),
    ...(cleanedContent.github_url && { github_url: cleanedContent.github_url }),
    
    work_experience: [...existingResume.work_experience, ...cleanedContent.work_experience],
    education: [...existingResume.education, ...cleanedContent.education],
    skills: [...existingResume.skills, ...cleanedContent.skills],
    projects: [...existingResume.projects, ...cleanedContent.projects],
  };

  return updatedResume;
}

// ============ MANUAL FALLBACK PARSING FUNCTIONS ============

// Manual fallback parsing function
function parseResumeManually(text: string) {
  const result = {
    education: [] as Array<{school: string; degree: string; field: string; date: string; location: string; achievements: string[]}>,
    skills: [] as Array<{category: string; items: string[]}>,
    projects: [] as Array<{name: string; description: string[]; technologies: string[]; date: string; url?: string; github_url?: string}>
  };
  
  try {
    const normalizedText = normalizeResumeText(text);
    
    // Try section-based parsing first
    const sections = findSections(normalizedText);
    
    if (sections.education) {
      result.education = parseEducationSection(sections.education);
    }
    if (sections.skills) {
      result.skills = parseSkillsSection(sections.skills);
    }
    if (sections.projects) {
      result.projects = parseProjectsSection(sections.projects);
    }
    
    // If section-based parsing failed, use pattern-based extraction on ENTIRE text
    // This handles non-standard formats where content doesn't follow headers
    
    // Extract skills from entire text if not found
    if (result.skills.length === 0) {
      result.skills = extractSkillsFromText(text);
    }
    
    // Extract education from entire text if not found
    if (result.education.length === 0) {
      result.education = extractEducationFromText(text);
    }
    
    // Extract projects from entire text if not found
    if (result.projects.length === 0) {
      result.projects = extractProjectsFromText(text);
    }
    
  } catch {
    // Silent fallback on parsing error
  }
  
  return result;
}

// Pattern-based extraction functions that work on entire text regardless of format

function extractSkillsFromText(text: string): Array<{category: string; items: string[]}> {
  const skills: Array<{category: string; items: string[]}> = [];
  
  // Pattern: "Category : item1, item2, item3" or "Category: item1, item2"
  const skillPatterns = [
    /(?:^|\s)(Frontend|Backend|DevOps\s*&?\s*Tools?|Frameworks?\s*&?\s*Libraries?|Languages?\s*&?\s*Databases?|Programming\s+Languages?|Soft\s+Skills?|(?:Technical\s+)?Skills?|Concepts?|Technologies?|Tools?)\s*:\s*([^•–\n]+)/gi,
  ];
  
  for (const pattern of skillPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const category = match[1].trim();
      const itemsText = match[2].trim();
      
      // Split by comma and clean up
      const items = itemsText
        .split(/,/)
        .map(item => item.trim().replace(/[•–—]/g, '').trim())
        .filter(item => item.length > 0 && item.length < 50 && !item.match(/^\d+$/));
      
      if (items.length > 0) {
        // Check if this category already exists
        const existingCategory = skills.find(s => s.category.toLowerCase() === category.toLowerCase());
        if (existingCategory) {
          existingCategory.items = [...new Set([...existingCategory.items, ...items])];
        } else {
          skills.push({ category, items });
        }
      }
    }
  }
  
  return skills;
}

function extractEducationFromText(text: string): Array<{school: string; degree: string; field: string; date: string; location: string; achievements: string[]}> {
  const education: Array<{school: string; degree: string; field: string; date: string; location: string; achievements: string[]}> = [];
  
  // Find school/institution names anywhere in text
  const schoolPattern = /((?:[A-Z][A-Za-z]+\s+)*(?:Academy|Institute|University|College|School|Convent)(?:\s+of\s+[A-Z][A-Za-z\s]+)?)/gi;
  let match;
  
  while ((match = schoolPattern.exec(text)) !== null) {
    const schoolName = match[1].trim();
    if (schoolName.length < 5) continue;
    
    // Look for degree near the school name (within ~200 chars)
    const contextStart = Math.max(0, match.index - 50);
    const contextEnd = Math.min(text.length, match.index + 300);
    const context = text.substring(contextStart, contextEnd);
    
    let degree = '';
    let date = '';
    
    // Find degree
    const degreeMatch = context.match(/(?:B\.?Tech|Bachelor|B\.?Sc|Master|M\.?Tech|M\.?Sc|PhD|Diploma|Senior\s+Secondary|XII|X|HSC|SSC)(?:\s+in\s+[A-Za-z\s&]+)?/i);
    if (degreeMatch) {
      degree = degreeMatch[0].trim();
    }
    
    // Find date
    const dateMatch = context.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|September|October|November|December|January|February|March|April|May|June|July|August)\s+\d{4}\s*[-–—]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|September|October|November|December|January|February|March|April|May|June|July|August)?\s*\d{4}|\d{4}\s*[-–—]\s*\d{4}|\d{4}\s*[-–—]\s*(?:Present|Current))/i);
    if (dateMatch) {
      date = dateMatch[1].trim();
    }
    
    // Avoid duplicates
    if (!education.find(e => e.school.toLowerCase() === schoolName.toLowerCase())) {
      education.push({
        school: schoolName,
        degree: degree,
        field: '',
        date: date,
        location: '',
        achievements: []
      });
    }
  }
  
  return education;
}

function extractProjectsFromText(text: string): Array<{name: string; description: string[]; technologies: string[]; date: string; url?: string; github_url?: string}> {
  const projects: Array<{name: string; description: string[]; technologies: string[]; date: string; url?: string; github_url?: string}> = [];
  
  // Pattern 1: "ProjectName (tech1, tech2)" or "ProjectName – description"
  // Pattern 2: "Tools: tech1, tech2" following a project description
  
  // Find project names with tech stack in parentheses
  const techStackPattern = /([A-Z][A-Za-z0-9\s-]+?)\s*\(\s*([A-Za-z0-9,\s.]+)\s*\)/g;
  let match;
  
  while ((match = techStackPattern.exec(text)) !== null) {
    const projectName = match[1].trim();
    const techStack = match[2].split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    // Filter out false positives (like degree names)
    if (projectName.match(/B\.?Tech|Bachelor|Master|M\.?Tech|Senior|XII|PCM|Physics/i)) continue;
    if (projectName.length < 3 || projectName.length > 50) continue;
    
    // Look for description bullets near this match
    const contextEnd = Math.min(text.length, match.index + 500);
    const context = text.substring(match.index, contextEnd);
    
    const descriptions: string[] = [];
    const bulletPattern = /[•–—-]\s*([^•–—\n]{20,})/g;
    let bulletMatch;
    while ((bulletMatch = bulletPattern.exec(context)) !== null) {
      const desc = bulletMatch[1].trim();
      if (desc.length > 20 && desc.length < 500) {
        descriptions.push(desc);
      }
      if (descriptions.length >= 4) break;
    }
    
    // Find URL near project
    let url = '';
    const urlMatch = context.match(/([a-z0-9-]+\.(?:live|com|io|dev|app|me|vercel\.app)(?:\/[^\s]*)?)/i);
    if (urlMatch) {
      url = urlMatch[1];
    }
    
    if (!projects.find(p => p.name.toLowerCase() === projectName.toLowerCase())) {
      projects.push({
        name: projectName,
        description: descriptions,
        technologies: techStack,
        date: '',
        url: url || undefined
      });
    }
  }
  
  // Pattern 2: Find "Tools: ..." lines and work backwards to find project name
  const toolsPattern = /Tools?:\s*([A-Za-z0-9,\s./]+?)(?=\n|Tools:|$)/gi;
  while ((match = toolsPattern.exec(text)) !== null) {
    const techStack = match[1].split(',').map(t => t.trim()).filter(t => t.length > 0 && t.length < 30);
    if (techStack.length === 0) continue;
    
    // Look backwards for a project name (capitalized phrase ending with dash or before bullets)
    const contextStart = Math.max(0, match.index - 400);
    const context = text.substring(contextStart, match.index);
    
    // Find the last capitalized phrase that could be a project name
    const projectNameMatch = context.match(/([A-Z][A-Za-z0-9\s-]+?)\s*[–—-]/g);
    if (projectNameMatch && projectNameMatch.length > 0) {
      const lastMatch = projectNameMatch[projectNameMatch.length - 1];
      const projectName = lastMatch.replace(/[–—-]\s*$/, '').trim();
      
      if (projectName.length > 3 && projectName.length < 50 && 
          !projectName.match(/B\.?Tech|Bachelor|Master|Frontend|Backend|Full\s*Stack/i) &&
          !projects.find(p => p.name.toLowerCase() === projectName.toLowerCase())) {
        
        // Find descriptions
        const descriptions: string[] = [];
        const bulletPattern = /[•–—-]\s*([^•–—\n]{20,})/g;
        let bulletMatch;
        while ((bulletMatch = bulletPattern.exec(context)) !== null) {
          const desc = bulletMatch[1].trim();
          if (desc.length > 20 && desc.length < 500) {
            descriptions.push(desc);
          }
        }
        
        projects.push({
          name: projectName,
          description: descriptions,
          technologies: techStack,
          date: '',
          url: undefined
        });
      }
    }
  }
  
  return projects;
}

function normalizeResumeText(text: string): string {
  let normalized = text;
  
  // Step 0: Handle cases where section headers appear with double spaces (e.g., "Skills  Projects  Education")
  // This happens when PDF text is poorly extracted
  normalized = normalized.replace(/\s{2,}(Projects?|Education|(?:Technical\s+|Key\s+)?Skills?|Experience|Work\s+History|Certifications?)\s{2,}/gi, '\n\n$1\n\n');
  
  // Add newlines before section headers including "Technical Skills"
  normalized = normalized.replace(/\s{2,}(PROJECTS?|EDUCATION|(?:TECHNICAL\s+|KEY\s+)?SKILLS?|EXPERIENCE|WORK\s+HISTORY|CERTIFICATIONS?)\b/gi, '\n\n$1\n');
  normalized = normalized.replace(/\s{2,}(•|–|—|-)\s+/g, '\n$1 ');
  normalized = normalized.replace(/([.!?])\s{2,}([A-Z][A-Za-z0-9.]+(?:\s+[A-Za-z0-9.]+)*)\s+([-–—])\s+/g, '$1\n\n$2 $3 ');
  normalized = normalized.replace(/\s{2,}(Tools?:)/gi, '\n$1');
  normalized = normalized.replace(/([A-Za-z])\s{3,}((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Currently)\s+(?:Working|\d{4}))/gi, '$1\n$2');
  normalized = normalized.replace(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}|Currently Working|\d{4}\s*[-–—]\s*\d{4})\s{2,}([a-z0-9-]+\.[a-z]{2,})/gi, '$1\n$2');
  normalized = normalized.replace(/\s{2,}((?:[A-Z][a-z]+\s+)*(?:Academy|Institute|University|College|School|Convent))/gi, '\n$1');
  normalized = normalized.replace(/\s{2,}(\d{4}\s*[-–—]\s*\d{2,4})/g, '\n$1');
  normalized = normalized.replace(/\s{2,}([A-Za-z\s&\/]+\s*:)(?=\s+[A-Z])/g, '\n$1');
  normalized = normalized.replace(/\n{3,}/g, '\n\n');
  normalized = normalized.split('\n').map(line => line.trim()).join('\n');
  return normalized;
}

function findSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  // Match section headers including "Technical Skills", "Key Skills", etc.
  const sectionRegex = /(^|\n)(PROJECTS?|EDUCATION|(?:TECHNICAL\s+|KEY\s+)?SKILLS?|EXPERIENCE|WORK\s+HISTORY)(?=\s|$)/gi;
  const matches: Array<{ key: string; header: string; headerStart: number; headerEnd: number }> = [];

  let match: RegExpExecArray | null;
  while ((match = sectionRegex.exec(text)) !== null) {
    const headerRaw = match[2].toLowerCase();
    let key: string | null = null;
    if (headerRaw.startsWith('project')) key = 'projects';
    else if (headerRaw.startsWith('education')) key = 'education';
    else if (headerRaw.includes('skill')) key = 'skills';
    else if (headerRaw.startsWith('experience') || headerRaw.startsWith('work')) key = 'experience';
    if (!key) continue;
    const precedingLength = match[1] ? match[1].length : 0;
    matches.push({ key, header: match[2], headerStart: match.index + precedingLength, headerEnd: match.index + match[0].length });
  }

  matches.sort((a, b) => a.headerStart - b.headerStart);
  const seenKeys = new Set<string>();
  const uniqueMatches = matches.filter(m => {
    if (seenKeys.has(m.key)) return false;
    seenKeys.add(m.key);
    return true;
  });

  for (let i = 0; i < uniqueMatches.length; i++) {
    const current = uniqueMatches[i];
    const next = uniqueMatches[i + 1];
    const sectionText = text.substring(current.headerEnd, next ? next.headerStart : text.length).trim();
    if (sectionText.length > 0) sections[current.key] = sectionText;
  }
  return sections;
}

function parseEducationSection(text: string): Array<{school: string; degree: string; field: string; date: string; location: string; achievements: string[]}> {
  const education: Array<{school: string; degree: string; field: string; date: string; location: string; achievements: string[]}> = [];
  const lines = text.split('\n').filter(line => line.trim()).map(line => line.trim());
  
  let currentEdu: {school: string; degree: string; field: string; date: string; location: string; achievements: string[]} | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length < 3 || line.startsWith('•') || line.startsWith('–')) continue;
    
    const schoolMatch = line.match(/^((?:[A-Z][A-Za-z]+\s+)*(?:and\s+)?(?:[A-Z][A-Za-z]+\s+)*(?:Academy|Institute|University|College|School|Convent)(?:\s+of\s+[A-Z][A-Za-z\s]+?)?)/i);
    if (schoolMatch) {
      if (currentEdu) education.push(currentEdu);
      const schoolName = schoolMatch[1].trim();
      const remainingText = line.substring(schoolMatch[1].length).trim();
      currentEdu = { school: schoolName, degree: remainingText || '', field: '', date: '', location: '', achievements: [] };
      continue;
    }
    
    if (currentEdu && !currentEdu.degree && /(B\.?Tech|Bachelor|B\.?Sc|Master|M\.?Tech|Senior Secondary|XII|Computer Science|Engineering|Artificial Intelligence)/i.test(line)) {
      currentEdu.degree = line;
      continue;
    }
    
    if (currentEdu && /\d{4}/.test(line) && !currentEdu.date && line.length < 30) {
      currentEdu.date = line;
    }
  }
  
  if (currentEdu) education.push(currentEdu);
  return education;
}

function parseSkillsSection(text: string): Array<{category: string; items: string[]}> {
  const skills: Array<{category: string; items: string[]}> = [];
  const lines = text.split('\n').filter(line => line.trim()).map(line => line.trim());
  
  for (const line of lines) {
    // Look for category: items pattern
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const category = match[1].trim();
      const itemsText = match[2].trim();
      
      // Split by comma and clean up
      const items = itemsText
        .split(',')
        .map(item => item.trim().replace(/[&•–]/g, '').trim())
        .filter(item => item.length > 0);
      
      if (items.length > 0) {
        skills.push({ category, items });
      }
    }
  }
  
  return skills;
}

function parseProjectsSection(text: string): Array<{name: string; description: string[]; technologies: string[]; date: string; url?: string; github_url?: string}> {
  const projects: Array<{name: string; description: string[]; technologies: string[]; date: string; url?: string; github_url?: string}> = [];
  const lines = text.split('\n').filter(line => line.trim()).map(line => line.trim());
  
  let currentProject: {name: string; description: string[]; technologies: string[]; date: string; url?: string; github_url?: string} | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.length < 3) continue;
    
    const isDescriptionLine = line.startsWith('•') || line.startsWith('–') || line.startsWith('—') || line.startsWith('-');
    const isToolsLine = /^Tools?:/i.test(line);
    const isDateLine = /^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}|Currently Working|\d{4}\s*[-–—]\s*\d{4})$/i.test(line);
    const isUrlLine = /^([a-z0-9-]+\.[a-z]{2,}(?:[^\s]*)?)$/i.test(line);
    
    // Check for tech stack in parentheses: "Forkit (Nextjs, Typescript, Postgres, Prisma)"
    const techStackMatch = line.match(/^([^(]+)\s*\(\s*([^)]+)\s*\)/);
    
    if (isToolsLine && currentProject) {
      const techMatch = line.match(/^Tools?:\s*(.+)$/i);
      if (techMatch) {
        const techs = techMatch[1].split(',').map(t => t.trim());
        currentProject.technologies = [...(currentProject.technologies || []), ...techs];
      }
    } else if (isDescriptionLine) {
      if (!currentProject) {
        continue;
      }
      const desc = line.replace(/^[•–—-]\s*/, '').trim();
      if (desc) {
        currentProject.description.push(desc);
      }
    } else if (isDateLine && currentProject && !currentProject.date) {
      currentProject.date = line;
    } else if (isUrlLine && currentProject && !currentProject.url) {
      currentProject.url = line;
    } else if (!isDescriptionLine && !isToolsLine && !isDateLine && !isUrlLine) {
      // Check if this could be a project title
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      const nextIsBullet = nextLine.startsWith('•') || nextLine.startsWith('–') || nextLine.startsWith('—') || nextLine.startsWith('-');
      const nextIsDate = /^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|Currently Working|\d{4}\s*[-–—])/i.test(nextLine);
      const nextIsUrl = /^[a-z0-9-]+\.[a-z]{2,}/i.test(nextLine);
      const nextIsTools = /^Tools?:/i.test(nextLine);
      
      // Line contains project indicators (dash with keywords or capitalized) or has tech stack
      const hasProjectIndicators = 
        techStackMatch ||
        line.match(/[-–—].*(?:builder|tool|platform|app|system|website|project|automation|resources|live|saver|sharing|management)/i) ||
        (line.length > 5 && line.length < 100 && /^[A-Z]/.test(line));
      
      const isLikelyProjectTitle = (nextIsBullet || nextIsDate || nextIsUrl || nextIsTools || techStackMatch) && hasProjectIndicators;
      
      if (isLikelyProjectTitle) {
        if (currentProject && currentProject.name) {
          projects.push(currentProject);
        }
        
        // Extract URL and date from the title line if present
        let projectName = line;
        let date = '';
        let url = '';
        let technologies: string[] = [];
        
        // Extract tech stack from parentheses
        if (techStackMatch) {
          projectName = techStackMatch[1].trim();
          technologies = techStackMatch[2].split(',').map(t => t.trim()).filter(t => t.length > 0);
        }
        
        const urlMatch = projectName.match(/(https?:\/\/[^\s]+|(?:www\.)?[a-z0-9-]+\.(?:live|com|io|dev|app|me|vercel\.app)(?:[^\s]*)?)/i);
        if (urlMatch) {
          url = urlMatch[1];
          projectName = projectName.replace(urlMatch[0], '').trim();
        }
        
        const dateMatch = projectName.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}|Currently Working|\d{4}\s*[-–—]\s*\d{4})/i);
        if (dateMatch) {
          date = dateMatch[1];
          projectName = projectName.replace(dateMatch[0], '').trim();
        }
        
        // Clean up project name - remove trailing dashes, normalize whitespace, and clean up dash spacing
        projectName = projectName
          .replace(/[•–—-]\s*$/, '') // Remove trailing dashes
          .replace(/\s*([-–—])\s*/g, ' $1 ') // Normalize spacing around dashes
          .replace(/\s+/g, ' ') // Collapse multiple spaces
          .trim();
        
        currentProject = {
          name: projectName,
          description: [],
          technologies: technologies,
          date: date,
          url: url || undefined,
          github_url: undefined
        };
      }
    }
  }
  
  if (currentProject && currentProject.name) {
    projects.push(currentProject);
  }
  
  return projects;
}


    // NEW WORK EXPERIENCE BULLET POINTS
    export async function generateWorkExperiencePoints(
      position: string,
      company: string,
      technologies: string[],
      targetRole: string,
      numPoints: number = 3,
      customPrompt: string = '',
      config?: AIConfig
    ) { 
      const aiClient = initializeAIClient(config);
  
      const { object } = await safeGenerateObject({
        model: aiClient,
        schema: z.object({
          content: workExperienceBulletPointsSchema
        }),
      prompt: `Position: ${position}
      Company: ${company}
      Technologies: ${technologies.join(', ')}
      Target Role: ${targetRole}
      Number of Points: ${numPoints}${customPrompt ? `\nCustom Focus: ${customPrompt}` : ''}\n\nIMPORTANT: Return your response as valid JSON only, without markdown code blocks.`,
        system: WORK_EXPERIENCE_GENERATOR_MESSAGE.content as string,
      });

      return object.content;
      }
    
      // WORK EXPERIENCE BULLET POINTS IMPROVEMENT
      export async function improveWorkExperience(point: string, customPrompt?: string, config?: AIConfig) {
          const aiClient = initializeAIClient(config);
          
          const { object } = await safeGenerateObject({
          model: aiClient,
          
          schema: z.object({
              content: z.string().describe("The improved work experience bullet point")
          }),
          prompt: `Please improve this work experience bullet point while maintaining its core message and truthfulness${customPrompt ? `. Additional requirements: ${customPrompt}` : ''}:\n\n"${point}"\n\nIMPORTANT: Return your response as valid JSON only, without markdown code blocks.`,
          system: WORK_EXPERIENCE_IMPROVER_MESSAGE.content as string,
          });
      
          return object.content;
      }
    
      // PROJECT BULLET POINTS IMPROVEMENT
      export async function improveProject(point: string, customPrompt?: string, config?: AIConfig) {
          
          const aiClient = initializeAIClient(config);

  
          const { object } = await safeGenerateObject({
          model: aiClient,
          schema: z.object({
              content: z.string().describe("The improved project bullet point")
          }),
          prompt: `Please improve this project bullet point while maintaining its core message and truthfulness${customPrompt ? `. Additional requirements: ${customPrompt}` : ''}:\n\n"${point}"\n\nIMPORTANT: Return your response as valid JSON only, without markdown code blocks.`,
          system: PROJECT_IMPROVER_MESSAGE.content as string,
          });
      
          return object.content;
      }

      // PROFESSIONAL SUMMARY IMPROVEMENT
      export async function improveSummary(summary: string, customPrompt?: string, config?: AIConfig) {
        const aiClient = initializeAIClient(config);

        // For summary we expect plain string back (not JSON object with property) for simplicity
        // Use safeGenerateObject to keep consistency & guardrails
        const { object } = await safeGenerateObject({
          model: aiClient,
          schema: z.object({ content: z.string().describe("Improved professional summary (single paragraph)") }),
          prompt: `Please improve the following professional resume summary${customPrompt ? ` with additional focus: ${customPrompt}` : ''} while strictly following the system rules. Return ONLY the improved summary text.\n\nOriginal Summary:\n"""${summary}"""`,
          system: SUMMARY_IMPROVER_MESSAGE.content as string,
        });

        return object.content;
      }
      
      // NEW PROJECT BULLET POINTS
      export async function generateProjectPoints(
          projectName: string,
          technologies: string[],
          targetRole: string,
          numPoints: number = 3,
          customPrompt: string = '',
          config?: AIConfig
      ) {
          const aiClient = initializeAIClient(config);
          
          const { object } = await safeGenerateObject({
          model: aiClient,
          schema: z.object({
              content: projectAnalysisSchema
          }),
          prompt: `Project Name: ${projectName}
      Technologies: ${technologies.join(', ')}
      Target Role: ${targetRole}
      Number of Points: ${numPoints}${customPrompt ? `\nCustom Focus: ${customPrompt}` : ''}\n\nIMPORTANT: Return your response as valid JSON only, without markdown code blocks.`,
          system: PROJECT_GENERATOR_MESSAGE.content as string,
          });
      
          return object.content;
      }
      
      // Text Import for profile
      export async function processTextImport(text: string, config?: AIConfig) {
          const aiClient = initializeAIClient(config);
          
          const { object } = await safeGenerateObject({
          model: aiClient,
          schema: z.object({
              content: textImportSchema
          }),
          prompt: `${text}\n\nIMPORTANT: Return your response as valid JSON only, without markdown code blocks.`,
          system: TEXT_ANALYZER_SYSTEM_MESSAGE.content as string,
          });
      
          return object.content;
      }
      
      // WORK EXPERIENCE MODIFICATION
      export async function modifyWorkExperience(
          experience: WorkExperience[],
          prompt: string,
          config?: AIConfig
      ) {
          const aiClient = initializeAIClient(config);
          
          const { object } = await safeGenerateObject({
          model: aiClient,
          schema: z.object({
              content: workExperienceItemsSchema
          }),
          prompt: `Please modify this work experience entry according to these instructions: ${prompt}\n\nCurrent work experience:\n${JSON.stringify(experience, null, 2)}\n\nIMPORTANT: Return your response as valid JSON only, without markdown code blocks.`,
          system: `You are a professional resume writer. Modify the given work experience based on the user's instructions. 
          Maintain professionalism and accuracy while implementing the requested changes. 
          Keep the same company and dates, but modify other fields as requested.
          Use strong action verbs and quantifiable achievements where possible.`,
          });
      
          return object.content;
      }
      
      // ADDING TEXT CONTENT TO RESUME
      export async function addTextToResume(prompt: string, existingResume: Resume, config?: AIConfig) {
          const aiClient = initializeAIClient(config);
  
          
          const { object } = await safeGenerateObject({
          model: aiClient,
          schema: z.object({
              content: textImportSchema
          }),
          prompt: `Extract relevant resume information from the following text, including basic information (name, contact details, etc) and professional experience. Format them according to the schema:\n\n${prompt}\n\nIMPORTANT: Return your response as valid JSON only, without markdown code blocks.`,
          system: TEXT_ANALYZER_SYSTEM_MESSAGE.content as string,
          });
          
          // Merge the AI-generated content with existing resume data
          const updatedResume = {
          ...existingResume,
          ...(object.content.first_name && { first_name: object.content.first_name }),
          ...(object.content.last_name && { last_name: object.content.last_name }),
          ...(object.content.email && { email: object.content.email }),
          ...(object.content.phone_number && { phone_number: object.content.phone_number }),
          ...(object.content.location && { location: object.content.location }),
          ...(object.content.website && { website: object.content.website }),
          ...(object.content.linkedin_url && { linkedin_url: object.content.linkedin_url }),
          ...(object.content.github_url && { github_url: object.content.github_url }),
          
          work_experience: [...existingResume.work_experience, ...(object.content.work_experience || [])],
          education: [...existingResume.education, ...(object.content.education || [])],
          skills: [...existingResume.skills, ...(object.content.skills || [])],
          projects: [...existingResume.projects, ...(object.content.projects || [])],
          };
          
          return updatedResume;
      }