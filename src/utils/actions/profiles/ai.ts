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
        console.error('JSON parsing failed in fallback:', parseError);
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
        prompt: `Extract ALL information from this resume text into structured JSON format.

CRITICAL: You MUST extract ALL sections present in the text. Do not skip any sections.

The resume contains these sections that you MUST extract:
1. PROJECTS section - extract ALL projects with names, descriptions, technologies
2. EDUCATION section - extract ALL educational institutions and degrees  
3. SKILLS section - extract ALL technical skills grouped by category
4. EXPERIENCE section - extract ALL work experience

For the following resume text, extract EVERYTHING:

${userMessages}

Return complete JSON with ALL sections populated. Never return empty arrays if data exists.`,
        system: `You are an expert resume parser. Extract ALL information from resume text into structured JSON.

MANDATORY EXTRACTION RULES:
1. ALWAYS extract education if ANY school/university/degree is mentioned
2. ALWAYS extract skills if ANY technical skills are mentioned  
3. ALWAYS extract projects if ANY projects are described
4. ALWAYS extract work experience if ANY jobs are mentioned

For each section:
- Education: school, degree, field, date, location, achievements
- Skills: group into categories like "Languages", "Frameworks", "Tools"
- Projects: name, description array, technologies, dates, URLs
- Work Experience: company, position, date, location, description array, technologies

Return JSON with all fields populated where data exists. Use empty arrays only when no data is found.`,
      });
  
      // If the AI missed sections, try to manually parse them as fallback
      if (!object.content.education || !object.content.skills || !object.content.projects) {
        // Manual fallback parsing for missing sections
        const fallbackResult = parseResumeManually(userMessages);
        
        // Merge AI result with manual parsing
        object.content = {
          ...object.content,
          education: object.content.education || fallbackResult.education,
          skills: object.content.skills || fallbackResult.skills,
          projects: object.content.projects || fallbackResult.projects,
        };
      }
      
      return sanitizeUnknownStrings(object.content);
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
    // Parse Education section
    const educationMatch = text.match(/EDUCATION\s*\n([\s\S]*?)(?=\n[A-Z]{2,}|\n\s*$)/i);
    if (educationMatch) {
      const educationText = educationMatch[1];
      
      // Look for school patterns
      const schoolPattern = /(.*?(?:Academy|Institute|University|College|School).*?)\n(.*?)\n(.*?)\n/g;
      let match;
      while ((match = schoolPattern.exec(educationText)) !== null) {
        result.education.push({
          school: match[1].trim(),
          degree: match[2].trim(),
          field: match[3].includes('–') ? match[3].split('–')[0].trim() : match[3].trim(),
          date: match[3].includes('–') ? match[3].split('–')[1].trim() : '',
          location: '',
          achievements: []
        });
      }
    }
    
    // Parse Skills section
    const skillsMatch = text.match(/SKILLS\s*\n([\s\S]*?)(?=\n[A-Z]{2,}|\n\s*$)/i);
    if (skillsMatch) {
      const skillsText = skillsMatch[1];
      
      // Look for skill categories
      const categoryPattern = /([^:]+):\s*([^\n]+)/g;
      let match;
      while ((match = categoryPattern.exec(skillsText)) !== null) {
        const category = match[1].trim();
        const items = match[2].split(',').map(item => item.trim().replace(/[&]/g, ''));
        
        result.skills.push({
          category: category,
          items: items.filter(item => item.length > 0)
        });
      }
    }
    
    // Parse Projects section
    const projectsMatch = text.match(/PROJECTS\s*\n([\s\S]*?)(?=\n[A-Z]{2,}|\n\s*$)/i);
    if (projectsMatch) {
      const projectsText = projectsMatch[1];
      
      // Split by project names (lines that don't start with •)
      const projectLines = projectsText.split('\n').filter(line => line.trim());
      let currentProject: any = null;
      
      for (const line of projectLines) {
        if (!line.startsWith('•') && !line.includes('React,') && line.length > 10) {
          // This is likely a project name
          if (currentProject) {
            result.projects.push(currentProject);
          }
          
          // Extract project name and technologies
          const techMatch = line.match(/(.*?)\s+(React,.*|HTML,.*|[A-Z][a-z]+,.*)/);
          if (techMatch) {
            currentProject = {
              name: techMatch[1].trim(),
              description: [],
              technologies: techMatch[2].split(',').map(t => t.trim()),
              date: '',
              url: undefined,
              github_url: undefined
            };
          } else {
            currentProject = {
              name: line.trim(),
              description: [],
              technologies: [],
              date: '',
              url: undefined,
              github_url: undefined
            };
          }
        } else if (line.startsWith('•') && currentProject) {
          // This is a description bullet point
          currentProject.description.push(line.substring(1).trim());
        }
      }
      
      // Don't forget the last project
      if (currentProject) {
        result.projects.push(currentProject);
      }
    }
    
  } catch (error) {
    // Silent fallback - manual parsing failed, return empty arrays
  }
  
  return result;
}