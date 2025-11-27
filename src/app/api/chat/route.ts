import { checkRateLimit } from '@/lib/rateLimiter';
import { tools } from '@/lib/tools';
import { Job, Resume } from '@/lib/types';
import { initializeAIClient, type AIConfig } from '@/utils/ai-tools';
import { getAuthenticatedUser } from '@/utils/auth';
import { LanguageModelV1, smoothStream, streamText, ToolInvocation } from 'ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}

interface ChatRequest {
  messages: Message[];
  resume: Resume;
  target_role: string;
  config?: AIConfig;
  job?: Job;
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    
    // Console log the entire request to see what's being sent
    console.log('=== FULL CHAT REQUEST ===');
    console.log('Request body keys:', Object.keys(requestBody));
    console.log('Messages count:', requestBody.messages?.length || 0);
    console.log('Target role:', requestBody.target_role);
    console.log('Config:', JSON.stringify(requestBody.config, null, 2));
    console.log('Job:', requestBody.job ? 'Job object present' : 'No job');
    console.log('Resume present:', !!requestBody.resume);
    
    if (requestBody.resume) {
      // Remove document_settings from the resume object as it's no longer supported
      if (requestBody.resume.document_settings) {
        console.log('Removing document_settings from resume object');
        delete requestBody.resume.document_settings;
      }
      
      console.log('Resume keys:', Object.keys(requestBody.resume));
      console.log('Resume first_name:', requestBody.resume.first_name);
      console.log('Resume last_name:', requestBody.resume.last_name);
      console.log('Resume target_role:', requestBody.resume.target_role);
      console.log('Work experience count:', requestBody.resume.work_experience?.length || 0);
      console.log('Education count:', requestBody.resume.education?.length || 0);
      console.log('Skills count:', requestBody.resume.skills?.length || 0);
      console.log('Projects count:', requestBody.resume.projects?.length || 0);
    }
    
    console.log('Full request body:', JSON.stringify(requestBody, null, 2));
    console.log('=== END CHAT REQUEST ===');

    const { messages, target_role, config, job, resume }: ChatRequest = requestBody;

    // Get user ID for rate limiting
    const user = await getAuthenticatedUser();

    // Apply rate limiting for all users
    try {
      await checkRateLimit(user.id);
    } catch (error) {
      // Add type checking for error
      const message = error instanceof Error ? error.message : 'Rate limit exceeded';
      const match = message.match(/(\d+) seconds/);
      const retryAfter = match ? parseInt(match[1], 10) : 60;
      
      return new Response(
        JSON.stringify({ 
          error: message, // Use validated message
          expirationTimestamp: Date.now() + retryAfter * 1000
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    // Initialize the AI client using the provided config
    const aiClient = initializeAIClient(config);

    // Build and send the AI call.
    const result = streamText({
      model: aiClient as LanguageModelV1,
      system: `
      You are Resumy, an expert technical resume consultant 
      specializing in computer science and software 
      engineering careers. Your expertise spans resume 
      optimization, technical writing, and industry best 
      practices for tech job applications.

      WORKFLOW INSTRUCTIONS:
      When the user asks to improve a specific section (e.g., "Improve the work experience section"):
      1. FIRST: Call 'getResume' with the relevant section (e.g., ['work_experience'])
      2. THEN: Call the appropriate improvement tool for EACH entry in that section
      
      For example, if improving work experience:
      - Step 1: getResume(['work_experience'])
      - Step 2: suggest_work_experience_improvement for index 0
      - Step 3: suggest_work_experience_improvement for index 1 (if exists)
      - And so on for each entry

      TOOL USAGE INSTRUCTIONS:
      1. For work experience improvements:
         - Use 'suggest_work_experience_improvement' with 'index' and 'improved_experience' fields
         - Always include company, position, date, and description
         - Enhance bullet points with strong action verbs, metrics, and technical keywords
         - Use **bold** formatting for important keywords, technologies, and achievements
      
      2. For project improvements:
         - Use 'suggest_project_improvement' with 'index' and 'improved_project' fields
         - Always include name and description
         - Highlight technical achievements and impact
      
      3. For skill improvements:
         - Use 'suggest_skill_improvement' with 'index' and 'improved_skill' fields
         - Only use for adding new or removing existing skills
      
      4. For education improvements:
         - Use 'suggest_education_improvement' with 'index' and 'improved_education' fields
         - Always include school, degree, field, and date
      
      5. For viewing resume sections:
         - Use 'getResume' with 'sections' array
         - Valid sections: 'all', 'personal_info', 'work_experience', 'education', 'skills', 'projects'

      6. For multiple section updates:
         - Use 'modifyWholeResume' when changing multiple sections at once

      IMPORTANT: Always read the current content first using getResume before suggesting improvements.
      
      Aim to use a maximum of 5 tools in one go, then confirm with the user if they would like you to continue.
      The target role is ${target_role}. The job is ${job ? JSON.stringify(job) : 'No job specified'}.
      Current resume summary: ${resume ? `${resume.first_name} ${resume.last_name} - ${resume.target_role}` : 'No resume data'}.
      `,
      messages,
      maxSteps: 5,
      tools,
      experimental_transform: smoothStream(),
    });

    return result.toDataStreamResponse({
      sendUsage: false,
      getErrorMessage: error => {
        if (!error) return 'Unknown error occurred';
        if (error instanceof Error) return error.message;
        return JSON.stringify(error);
      },
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
