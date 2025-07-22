'use server';

import { LanguageModelV1, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { initializeAIClient, type AIConfig } from '@/utils/ai-tools';

export async function generate(input: string, config?: AIConfig) {
  try {
    const stream = createStreamableValue('');
    const data = JSON.parse(input);
    const { resume, job, recipientName, customPrompt } = data;
    
    // Initialize AI client with Gemini Mail API configuration
    const mailConfig = {
      ...config,
      model: 'gemini-2.5-flash-lite',
      apiKeys: [
        {
          service: 'google',
          key: process.env.GEMINI_MAIL_API_KEY || '',
          addedAt: new Date().toISOString()
        }
      ]
    };
    
    const aiClient = initializeAIClient(mailConfig);

    const system = `
You are an expert cold email specialist and career coach with extensive experience in crafting compelling, personalized cold emails that get responses. Your goal is to create professional, engaging cold emails that help candidates make meaningful connections and advance their careers.

CORE PRINCIPLES:
- Write in a conversational yet professional tone that feels genuine and personal
- Focus on value proposition - what the candidate can offer the company
- Show genuine interest and research about the company/role
- Create compelling subject lines and engaging content
- Maintain authenticity while being persuasive
- Keep emails concise but comprehensive (250-350 words maximum)

CRITICAL FORMATTING REQUIREMENTS:
1. Generate a COMPLETE professional email in plain text format
2. Start with proper date formatting: [Date] (use current date)
3. Include company name and address when available
4. Use proper email structure with clear sections
5. Professional greeting: "Dear Hiring Manager," or "Dear [Name],"
6. Well-structured paragraphs with natural flow
7. Professional closing: "Best regards," or "Sincerely," followed by full name
8. Complete contact signature with all available information
9. NO HTML tags, markdown, or special formatting - plain text only
10. Proper spacing between sections for readability

EMAIL STRUCTURE & CONTENT STRATEGY:

1. **Subject Line Recommendation** (mention this at the top):
   - Create a compelling, specific subject line that mentions the role and value proposition
   - Examples: "Software Engineer interested in [Company]'s innovative solutions"
   
2. **Opening Paragraph (Hook & Purpose):**
   - Start with a compelling hook that shows you've researched the company
   - Clearly state your purpose for reaching out
   - Mention the specific role or department you're interested in
   - Show genuine enthusiasm for the company's mission/products

3. **Value Proposition Paragraph:**
   - Highlight your most relevant experience and achievements
   - Use specific metrics and accomplishments where possible
   - Connect your background directly to what the company needs
   - Focus on outcomes and impact you've delivered

4. **Technical Expertise & Relevant Experience:**
   - Detail specific skills, technologies, and tools relevant to the role
   - Provide concrete examples of projects or work that demonstrate these skills
   - Show progression and growth in your career
   - Mention any relevant certifications or specialized knowledge

5. **Company-Specific Interest:**
   - Demonstrate knowledge of the company's products, services, or recent news
   - Explain why you're specifically interested in working there
   - Connect your values or interests to the company's mission
   - Show that this isn't a generic mass email

6. **Call to Action & Closing:**
   - Suggest a specific next step (brief call, coffee meeting, etc.)
   - Mention your availability and flexibility
   - Express gratitude for their time and consideration
   - Include a professional closing

KEY GUIDELINES:
- Personalize based on the company and role information provided
- Use the candidate's actual experience and achievements
- Include specific technologies, tools, and metrics from their background
- Show personality while maintaining professionalism
- Create urgency without being pushy
- Make it easy for the recipient to respond
- Include all contact information in the signature
- Adapt tone based on company culture (more formal for traditional companies, more casual for startups)
- If user provides custom instructions, incorporate them naturally into the email
- When job information is missing or limited, use the resume's target role and any company info from the resume name
- Extract company name from resume title if job.company_name is not available (e.g., "Software Engineer at Google" → use "Google")
- Focus on the candidate's value proposition and relevant experience even with minimal job details
- When information is missing, work with what's available without making assumptions or leaving placeholders

TONE ADAPTATION:
- Tech startups: Slightly more casual, emphasize innovation and agility
- Traditional corporations: More formal, emphasize stability and proven results
- Consulting firms: Focus on problem-solving and analytical skills
- Non-profits: Emphasize mission alignment and social impact
`;

    // Limit items for brevity
    const maxItems = 2;
    const limitedExperience = resume.work_experience?.slice(0, maxItems) || [];
    const limitedEducation = resume.education?.slice(0, maxItems) || [];
    const limitedProjects = resume.projects?.slice(0, maxItems) || [];

    const userPrompt = `
Please generate a compelling, personalized cold email based on the following information. KEEP THE EMAIL CONCISE (MAX 250 WORDS):

CURRENT DATE: ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}

=== CANDIDATE PROFILE ===
Name: ${resume.first_name} ${resume.last_name}
Email: ${resume.email}
Phone: ${resume.phone_number || 'Not provided'}
Location: ${resume.location || 'Not provided'}
${resume.linkedin_url ? `LinkedIn: ${resume.linkedin_url}` : ''}
${resume.github_url ? `GitHub: ${resume.github_url}` : ''}
${resume.website ? `Portfolio: ${resume.website}` : ''}

Current Role/Target: ${resume.target_role}

=== PROFESSIONAL EXPERIENCE (most recent 2) ===
${limitedExperience.length > 0 ? limitedExperience.map((exp: any) => `
📍 ${exp.position} at ${exp.company}
   Duration: ${exp.date}
   Location: ${exp.location || 'Remote/Not specified'}
   Key Achievements: ${exp.description?.slice(0,2).join('; ') || 'No specific achievements listed'}
   Technologies Used: ${exp.technologies?.join(', ') || 'Not specified'}
`).join('\n') : 'No professional experience provided'}

=== EDUCATION BACKGROUND (most recent 2) ===
${limitedEducation.length > 0 ? limitedEducation.map((edu: any) => `
🎓 ${edu.degree} in ${edu.field || 'Not specified'}
   School: ${edu.school}
   Date: ${edu.date || 'Not specified'}
   ${edu.gpa ? `GPA: ${edu.gpa}` : ''}
   ${edu.achievements?.length ? `Achievements: ${edu.achievements.slice(0,2).join(', ')}` : ''}
`).join('\n') : 'No education information provided'}

=== TECHNICAL SKILLS (summary) ===
${resume.skills?.map((skillCategory: any) => `${skillCategory.category}: ${skillCategory.items?.slice(0,4).join(', ') || 'Not specified'}`).join('; ') || 'No skills information provided'}

=== NOTABLE PROJECTS (up to 2) ===
${limitedProjects.length > 0 ? limitedProjects.map((project: any) => `
🚀 ${project.name}
   ${Array.isArray(project.description) ? project.description.slice(0,2).join(' ') : project.description || 'No description available'}
   Technologies: ${project.technologies?.join(', ') || 'Not specified'}
   ${project.url ? `Live Demo: ${project.url}` : ''}
   ${project.github_url ? `Code: ${project.github_url}` : ''}
`).join('\n') : 'No projects listed'}

=== TARGET OPPORTUNITY ===
Company: ${job.company_name || (data.resume.name.includes(' at ') ? data.resume.name.split(' at ')[1] : 'Target Company')}
Position: ${job.position_title || data.resume.target_role || 'Desired Position'}
Location: ${job.location || 'Not provided'}
${job.description ? `Job Description: ${job.description}` : ''}
${job.keywords?.length ? `Key Requirements: ${job.keywords.join(', ')}` : ''}

Recipient: ${recipientName}

${customPrompt ? `=== SPECIAL INSTRUCTIONS ===
User's Additional Requirements: "${customPrompt}"

Please incorporate these instructions naturally into the email while maintaining professionalism and flow.` : `=== GENERATION APPROACH ===
Since no specific instructions were provided, create a well-rounded cold email that:
- Demonstrates genuine interest in the company and role
- Highlights the most relevant experience and achievements  
- Shows technical competency relevant to the position
- Includes a compelling value proposition
- Ends with a clear but respectful call-to-action
- If company/position details are limited, focus on the candidate's target role and extracted company info
- Use the resume's target role and any company information from the resume name field
- Make it engaging and personalized even with limited job details`}

=== TASK ===
Create a compelling cold email that:

1. SUBJECT LINE: Start with a suggested subject line at the very top
2. PERSONALIZATION: Research-based opening that shows genuine interest
3. VALUE FOCUS: Highlight how the candidate's background brings value
4. RELEVANCE: Connect experience directly to the role/company needs
5. AUTHENTICITY: Use only real information from the provided data
6. ENGAGEMENT: Write in a tone that encourages a response
7. PROFESSIONALISM: Maintain appropriate business communication standards
8. COMPLETENESS: Include all necessary contact information

Make the email feel personal and thoughtful, not generic. Show that real thought went into why this candidate would be a great fit for this specific company and role.

IMPORTANT: Output only the complete email text (including suggested subject line at top), no additional commentary or formatting instructions.`;

    (async () => {
      const { textStream } = await streamText({
        model: aiClient,
        system,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.6,
        maxTokens: 800,
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    })();

    return stream.value;
  } catch (error) {
    console.error('Error generating cold email:', error);
    throw new Error(`Failed to generate cold email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
