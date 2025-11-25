'use server';
import { generateObject, LanguageModelV1 } from 'ai';
import { z } from 'zod';
import { RESUME_FORMATTER_SYSTEM_MESSAGE, TEXT_IMPORT_SYSTEM_MESSAGE } from "@/lib/prompts";
import { initializeAIClient, type AIConfig } from '@/utils/ai-tools';
import { sanitizeUnknownStrings } from '@/lib/utils';
import { textImportSchema } from '@/lib/zod-schemas';

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
function cleanAllStrings(obj: any): any {
  if (typeof obj === 'string') {
    return cleanExtraSpaces(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanAllStrings(item));
  }
  if (obj && typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = cleanAllStrings(obj[key]);
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
      
      // Fallback to generateText
      const { generateText } = await import('ai');
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
        throw new Error(`Failed to parse AI response as JSON: ${text}`);
      }
    }
    // Re-throw if it's not a JSON parsing error
    throw error;
  }
}

// TEXT RESUME -> PROFILE
export async function formatProfileWithAI(
  userMessages: string,
  config?: AIConfig
) {
    try {
      const aiClient = initializeAIClient(config);
      
      const { object } = await safeGenerateObject({
        model: aiClient as LanguageModelV1,
        schema: z.object({
          content: textImportSchema
        }),
        prompt: `Parse this resume completely and extract all information:

${userMessages}

Extract:
- All projects (name, descriptions, tech stack, dates, URLs)
- All education (schools, degrees, dates, achievements)
- All skills (grouped by category)
- All work experience (companies, roles, dates, responsibilities)

Return valid JSON matching the schema.`,
        system: `You are an expert resume parser. Parse the resume text and extract ALL sections into the provided JSON schema.

IMPORTANT RULES:
1. Extract EVERYTHING you find - do not skip any sections
2. Look for: PROJECTS, EDUCATION, SKILLS, WORK EXPERIENCE (any case, any format)
3. Bullet points may use: •, –, -, or no bullets at all
4. Return empty arrays [] ONLY if a section is truly absent
5. Preserve exact text - don't summarize or rephrase

SCHEMA:
- education: [{school, degree, field, date, location, achievements[]}]
- skills: [{category, items[]}]
- projects: [{name, description[], technologies[], date, url, github_url}]
- work_experience: [{company, position, date, location, description[], technologies[]}]`,
      });
  
      // If the AI missed sections or returned empty arrays, try to manually parse them as fallback
      const hasEducation = object.content.education && Array.isArray(object.content.education) && object.content.education.length > 0;
      const hasSkills = object.content.skills && Array.isArray(object.content.skills) && object.content.skills.length > 0;
      const hasProjects = object.content.projects && Array.isArray(object.content.projects) && object.content.projects.length > 0;
      
      // Extract LinkedIn and GitHub URLs if not already extracted by AI
      if (!object.content.linkedin_url || !object.content.github_url) {
        const linkedinMatch = userMessages.match(/linkedin\.com\/in\/([^\s•]+)/i);
        const githubMatch = userMessages.match(/github\.com\/([^\s•]+)/i);
        
        if (linkedinMatch && !object.content.linkedin_url) {
          object.content.linkedin_url = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
        }
        if (githubMatch && !object.content.github_url) {
          object.content.github_url = `https://github.com/${githubMatch[1]}`;
        }
      }
      
      if (!hasEducation || !hasSkills || !hasProjects) {
        // Manual fallback parsing for missing sections
        const fallbackResult = parseResumeManually(userMessages);
        
        // Merge AI result with manual parsing - only use fallback if AI returned empty
        object.content = {
          ...object.content,
          education: hasEducation ? object.content.education : (fallbackResult.education.length > 0 ? fallbackResult.education : object.content.education),
          skills: hasSkills ? object.content.skills : (fallbackResult.skills.length > 0 ? fallbackResult.skills : object.content.skills),
          projects: hasProjects ? object.content.projects : (fallbackResult.projects.length > 0 ? fallbackResult.projects : object.content.projects),
        };
      }
      
      // Clean all extra spaces from the result before returning
      const cleanedContent = cleanAllStrings(object.content);
      return sanitizeUnknownStrings(cleanedContent);
    } catch (error) {
      throw error;
    }
}

// Manual fallback parsing function
function parseResumeManually(text: string) {
  const result = {
    education: [] as any[],
    skills: [] as any[],
    projects: [] as any[]
  };
  
  try {
    // Normalize text: add newlines at logical breakpoints for single-line resumes
    const normalizedText = normalizeResumeText(text);
    
    // Split text into sections by finding uppercase headers
    const sections = findSections(normalizedText);
    
    // Parse Education section
    if (sections.education) {
      result.education = parseEducationSection(sections.education);
    }
    
    // Parse Skills section
    if (sections.skills) {
      result.skills = parseSkillsSection(sections.skills);
    }
    
    // Parse Projects section
    if (sections.projects) {
      result.projects = parseProjectsSection(sections.projects);
    }
    
  } catch (error) {
    // Silently handle parsing errors
  }
  
  return result;
}

// Normalize resume text by adding newlines at logical breakpoints
function normalizeResumeText(text: string): string {
  let normalized = text;
  
  // Step 1: Add newlines before major section headers
  normalized = normalized.replace(/\s{2,}(PROJECTS?|EDUCATION|SKILLS?|EXPERIENCE|WORK\s+HISTORY)\b/gi, '\n\n$1\n');
  
  // Step 2: Add newlines before bullet points with various styles
  normalized = normalized.replace(/\s{2,}(•|–|—|-)\s+/g, '\n$1 ');
  
  // Step 3: Handle project names embedded at end of bullet points
  // Pattern: "...text.  ProjectName – " or "...text.  ProjectName -"
  normalized = normalized.replace(/([.!?])\s{2,}([A-Z][A-Za-z0-9.]+(?:\s+[A-Za-z0-9.]+)*)\s+([-–—])\s+/g, '$1\n\n$2 $3 ');
  
  // Step 4: Add newlines before "Tools:" lines
  normalized = normalized.replace(/\s{2,}(Tools?:)/gi, '\n$1');
  
  // Step 5: Add newlines before dates that appear after project/job titles
  // Pattern: "Title  Aug 2022 - Aug 2026" or "Title  Currently Working"
  normalized = normalized.replace(/([A-Za-z])\s{3,}((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Currently)\s+(?:Working|\d{4}))/gi, '$1\n$2');
  
  // Step 6: Add newlines before URLs that appear after dates
  // Pattern: "Aug 2024 - Feb 2025   assignme.live"
  normalized = normalized.replace(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}|Currently Working|\d{4}\s*[-–—]\s*\d{4})\s{2,}([a-z0-9-]+\.[a-z]{2,})/gi, '$1\n$2');
  
  // Step 7: Add newlines before school/institution names
  normalized = normalized.replace(/\s{2,}((?:[A-Z][a-z]+\s+)*(?:Academy|Institute|University|College|School|Convent))/gi, '\n$1');
  
  // Step 8: Add newlines before standalone dates (like "2021–2022")
  normalized = normalized.replace(/\s{2,}(\d{4}\s*[-–—]\s*\d{2,4})/g, '\n$1');
  
  // Step 9: Add newlines before skill categories (e.g., "Frontend:", "Languages:")
  normalized = normalized.replace(/\s{2,}([A-Za-z\s&]+\s*:)(?=\s+[A-Z])/g, '\n$1');
  
  // Step 10: Clean up multiple consecutive newlines
  normalized = normalized.replace(/\n{3,}/g, '\n\n');
  
  // Step 11: Trim whitespace from each line
  normalized = normalized.split('\n').map(line => line.trim()).join('\n');
  
  return normalized;
}

// Helper to find sections in the text
function findSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Match section headers - must be uppercase and at line boundaries
  const sectionRegex = /(^|\n)(PROJECTS?|EDUCATION|SKILLS?|EXPERIENCE|WORK\s+HISTORY)(?=\s|$)/gi;
  const matches: Array<{ key: string; header: string; headerStart: number; headerEnd: number }> = [];

  let match: RegExpExecArray | null;
  while ((match = sectionRegex.exec(text)) !== null) {
    const headerRaw = match[2].toLowerCase();
    let key: string | null = null;
    if (headerRaw.startsWith('project')) key = 'projects';
    else if (headerRaw.startsWith('education')) key = 'education';
    else if (headerRaw.startsWith('skill')) key = 'skills';
    else if (headerRaw.startsWith('experience') || headerRaw.startsWith('work')) key = 'experience';

    if (!key) continue;

    const precedingLength = match[1] ? match[1].length : 0;
    const headerStart = match.index + precedingLength;
    const headerEnd = match.index + match[0].length;

    matches.push({ key, header: match[2], headerStart, headerEnd });
  }

  matches.sort((a, b) => a.headerStart - b.headerStart);

  // Deduplicate sections - keep only first occurrence of each key
  const seenKeys = new Set<string>();
  const uniqueMatches = matches.filter(m => {
    if (seenKeys.has(m.key)) return false;
    seenKeys.add(m.key);
    return true;
  });

  for (let i = 0; i < uniqueMatches.length; i++) {
    const current = uniqueMatches[i];
    const next = uniqueMatches[i + 1];
    const startPos = current.headerEnd;
    const endPos = next ? next.headerStart : text.length;
    const sectionText = text.substring(startPos, endPos).trim();
    if (sectionText.length > 0) {
      sections[current.key] = sectionText;
    }
  }

  return sections;
}

// Parse education section
function parseEducationSection(text: string): any[] {
  const education: any[] = [];
  const lines = text.split('\n').filter(line => line.trim()).map(line => line.trim());
  
  let currentEdu: any = null;
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Skip if line is too short or is a bullet point
    if (line.length < 3 || line.startsWith('•') || line.startsWith('–') || line.startsWith('—')) {
      i++;
      continue;
    }
    
    // Check if this is a school/institution name
    // Match the full institution name including phrases like "of Technical Education"
    const schoolMatch = line.match(/^((?:[A-Z][A-Za-z]+\s+)*(?:and\s+)?(?:[A-Z][A-Za-z]+\s+)*(?:Academy|Institute|University|College|School|Convent)(?:\s+of\s+[A-Z][A-Za-z\s]+?)?(?=\s+(?:B\.?Tech|Bachelor|B\.?Sc|Master|Senior|M\.?Tech|XII)|$))/i);
    if (schoolMatch) {
      if (currentEdu) {
        education.push(currentEdu);
      }
      
      const schoolName = schoolMatch[1].trim();
      const remainingText = line.substring(schoolMatch[1].length).trim();
      
      currentEdu = {
        school: schoolName,
        degree: remainingText || '',
        field: '',
        date: '',
        location: '',
        achievements: []
      };
      i++;
      continue;
    }
    
    // Check if this is a degree line (when not already set)
    if (currentEdu && !currentEdu.degree && /(B\.?Tech|Bachelor|B\.?Sc|Master|M\.?Tech|M\.?Sc|PhD|Diploma|Senior Secondary|XII|Computer Science|Information Technology|Engineering|Artificial Intelligence|Physics|Chemistry|Mathematics|PCM)/i.test(line)) {
      currentEdu.degree = line;
      i++;
      continue;
    }
    
    // Check if this is a date line
    if (currentEdu && /\d{4}/.test(line) && !currentEdu.date && line.length < 30) {
      currentEdu.date = line;
      i++;
      continue;
    }
    
    i++;
  }
  
  if (currentEdu) {
    education.push(currentEdu);
  }
  
  return education;
}

// Parse skills section
function parseSkillsSection(text: string): any[] {
  const skills: any[] = [];
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

// Parse projects section
function parseProjectsSection(text: string): any[] {
  const projects: any[] = [];
  const lines = text.split('\n').filter(line => line.trim()).map(line => line.trim());
  
  let currentProject: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.length < 3) continue;
    
    const isDescriptionLine = line.startsWith('•') || line.startsWith('–') || line.startsWith('—') || line.startsWith('-');
    const isToolsLine = /^Tools?:/i.test(line);
    const isDateLine = /^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}|Currently Working|\d{4}\s*[-–—]\s*\d{4})$/i.test(line);
    const isUrlLine = /^([a-z0-9-]+\.[a-z]{2,}(?:[^\s]*)?)$/i.test(line);
    
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
      
      // Line contains project indicators (dash with keywords or capitalized)
      const hasProjectIndicators = 
        line.match(/[-–—].*(?:builder|tool|platform|app|system|website|project|automation|resources)/i) ||
        (line.length > 5 && line.length < 100 && /^[A-Z]/.test(line));
      
      const isLikelyProjectTitle = (nextIsBullet || nextIsDate || nextIsUrl || nextIsTools) && hasProjectIndicators;
      
      if (isLikelyProjectTitle) {
        if (currentProject && currentProject.name) {
          projects.push(currentProject);
        }
        
        // Extract URL and date from the title line if present
        let projectName = line;
        let date = '';
        let url = '';
        
        const urlMatch = line.match(/(https?:\/\/[^\s]+|(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:[^\s]*)?)/i);
        if (urlMatch) {
          url = urlMatch[1];
          projectName = line.replace(urlMatch[0], '').trim();
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
          technologies: [],
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