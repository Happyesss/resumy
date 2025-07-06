'use server';
import { generateObject, LanguageModelV1 } from 'ai';
import { z } from 'zod';
import { RESUME_FORMATTER_SYSTEM_MESSAGE, TEXT_IMPORT_SYSTEM_MESSAGE } from "@/lib/prompts";
import { initializeAIClient, type AIConfig } from '@/utils/ai-tools';
import { sanitizeUnknownStrings } from '@/lib/utils';

// TEXT RESUME -> PROFILE
export async function formatProfileWithAI(
  userMessages: string,
  config?: AIConfig
) {
    try {
      const aiClient = initializeAIClient(config);
      
      const { object } = await generateObject({
        model: aiClient as LanguageModelV1,
        schema: z.object({
          content: z.object({
            first_name: z.string().optional(),
            last_name: z.string().optional(),
            email: z.string().optional(),
            phone_number: z.string().optional(),
            location: z.string().optional(),
            website: z.string().optional(),
            linkedin_url: z.string().optional(),
            github_url: z.string().optional(),
            work_experience: z.array(z.object({
              company: z.string(),
              position: z.string(),
              date: z.string(),
              location: z.string().optional(),
              description: z.array(z.string()),
              technologies: z.array(z.string()).optional()
            })).optional(),
            education: z.array(z.object({
              school: z.string(),
              degree: z.string(),
              field: z.string().optional(),
              date: z.string().optional(),
              description: z.array(z.string()).optional(),
              location: z.string().optional(),
              gpa: z.string().optional(),
              achievements: z.array(z.string()).optional()
            })).default([]).optional(),
            skills: z.array(z.object({
              category: z.string(),
              items: z.array(z.string())
            })).optional(),
            projects: z.array(z.object({
              name: z.string(),
              description: z.array(z.string()),
              technologies: z.array(z.string()).optional(),
              date: z.string().optional(),
              url: z.string().optional(),
              github_url: z.string().optional()
            })).optional()
          })
        }),
        prompt: `You are an expert resume parser. Analyze this resume text and extract ALL information into the required structured format.

                CRITICAL REQUIREMENTS:
                1. Extract EVERY section present in the resume
                2. Pay special attention to EDUCATION - this is frequently missed
                3. Look for education under various headings: "Education", "Academic Background", "Qualifications", "Degrees"
                4. Education information may appear in different formats

                EDUCATION EXTRACTION RULES:
                - Always include education if ANY educational information is present
                - Look for: universities, colleges, schools, degrees, certifications
                - Extract: institution name, degree type, field of study, dates, GPA, achievements
                - Common patterns: "Bachelor of Science in Computer Science", "BS Computer Science", "University of XYZ"
                - Include relevant coursework, honors, thesis information in achievements array

                OTHER SECTIONS:
                - Personal info: name, contact details, location
                - Work experience: company, position, dates, responsibilities, technologies
                - Skills: technical skills grouped by category
                - Projects: personal/professional projects with descriptions and technologies

                Format all arrays properly. If information is unclear, include it rather than omit it.
                Return empty arrays [] for missing sections, never undefined.

                Resume Text:
                ${userMessages}`,
        system: TEXT_IMPORT_SYSTEM_MESSAGE.content as string,
      });
  
      return sanitizeUnknownStrings(object.content);
    } catch (error) {
      throw error;
    }
  }