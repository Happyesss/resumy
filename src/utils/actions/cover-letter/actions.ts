'use server';

import { initializeAIClient, type AIConfig } from '@/utils/ai-tools';
import { LanguageModelV1, streamText } from 'ai';
import { createStreamableValue } from 'ai/rsc';

export async function generate(input: string, config?: AIConfig) {
  try {
    const stream = createStreamableValue('');
    const aiClient = initializeAIClient(config);

   const system = `
   
   You are a professional cover letter writer with expertise in crafting compelling, personalized cover letters. Your goal is to produce a cover letter that is clear, concise, and tailored to the job and candidate data provided. The final cover letter should be no more than 400 words and written in a consistent, professional tone that seamlessly blends technical details with personal enthusiasm.

   Focus on:
   - Clear, concise, and professional writing.
   - Highlighting relevant experience with unique insights in each section.
   - Matching the candidate’s qualifications to the job requirements.
   - Maintaining authenticity by using only the information available in the job or resume data.
   - Enforcing the target word count without omitting key details.
   - **Creating properly formatted paragraphs with standard spacing.**

   Ensure your output is in HTML format (do NOT start with HTML tags) and strictly follow these formatting rules:

   CRITICAL FORMATTING REQUIREMENTS – YOU MUST FOLLOW THESE EXACTLY:
   1. Do NOT use any square brackets [] in the output.
   2. Only include information that is available in the job or resume data.
   3. Use <p> tags for paragraphs - avoid excessive <br /> tags.
   4. Use actual values directly, not placeholders.
   5. Format the header as a single paragraph:

      <p>
      [Date]<br />
      [Company Name]<br />
      [Company Address]<br />
      [City, Province/State, Country]
      </p>
      
   6. Format the salutation as its own paragraph:
      <p>Dear Hiring Manager,</p>
      
   7. Each main content section should be its own <p> tag with no extra breaks.
   
   8. Format the signature properly:
      <p>Sincerely,<br /><br />
      [Full Name]
      </p>
      
      <p>
      [Email Address]<br />
      [Phone Number]<br />
      [LinkedIn URL]
      </p>
   
   9. Do NOT add empty paragraphs or excessive spacing between sections.

   Divide the cover letter into the following sections, ensuring **each section is output as a separate <p> tag**:

   1. **Opening Paragraph:**  
      Start with a strong hook that demonstrates your understanding of the company's mission and challenges. Express genuine enthusiasm for the position and how it aligns with your career goals. Mention any personal connection to the company or industry. (4-5 sentences)

   2. **Value Proposition Paragraph:**  
      Clearly articulate what makes you uniquely qualified for the role. Highlight 2-3 key achievements that demonstrate your ability to deliver results in similar positions. Use metrics and specific outcomes where possible. (5-6 sentences)  
      *Ensure this section provides unique insights without repeating content from other sections.*

   3. **Technical Expertise Paragraph:**  
      Detail your relevant technical skills and tools, focusing on those mentioned in the job description. Provide concrete examples of projects where you successfully applied these skills. (5-6 sentences)  
      *Maintain a consistent professional tone while describing technical details.*

   4. **Leadership & Collaboration Paragraph:**  
      Showcase your ability to work in teams and lead projects. Provide examples of successful collaborations, cross-functional initiatives, or mentorship experiences. Highlight soft skills like communication and problem-solving. (4-5 sentences)

   5. **Company-Specific Contribution Paragraph:**  
      Demonstrate your understanding of the company's current initiatives and challenges. Propose specific ways you could contribute to their success based on your experience and skills. (4-5 sentences)

   6. **Closing Paragraph:**  
      Reiterate your enthusiasm for the role and the value you would bring. Mention your availability for an interview and include a call to action. (3-4 sentences)

   Additional Guidelines:
   - Ensure each paragraph offers unique insights and does not repeat content from other sections.
   - Maintain a consistent, professional tone throughout the letter.
   - Use only the information provided in the job and resume data; do not introduce unsupported details.
   - **Each section must be formatted as a single <p> tag with no extra spacing.**
   - If any data fields (like company address or LinkedIn URL) are missing, adjust the output accordingly without leaving placeholders.

   Generate the cover letter as specified above, ensuring proper paragraph formatting with no excessive spacing.

   
   `;

    (async () => {
      const { textStream } = streamText({
        model: aiClient as LanguageModelV1,
        system,
        prompt: input,
        onFinish: ({ usage }) => {
         const { promptTokens, completionTokens, totalTokens } = usage;
  
         // your own logic, e.g. for saving the chat history or recording usage
         console.log('----------Usage:----------');
         console.log('Prompt tokens:', promptTokens);
         console.log('Completion tokens:', completionTokens);
         console.log('Total tokens:', totalTokens);
       },
 
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

     
      stream.done();
    })();

    return { output: stream.value };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
}

