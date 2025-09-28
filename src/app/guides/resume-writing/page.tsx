/**
 * Resume writing guide targeting the primary "resume" keyword
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "How to Write a Resume in 2025 | Complete Resume Writing Guide | Resumy",
  description: "Learn how to write a professional resume that gets you hired. Complete guide covering resume format, sections, content, keywords, and optimization tips. Includes resume examples and templates for all career levels and industries.",
  keywords: [
    "how to write a resume",
    "resume writing guide", 
    "resume format",
    "professional resume writing",
    "resume tips 2025",
    "resume examples",
    "resume sections",
    "resume writing tips",
    "good resume format",
    "resume structure",
    "effective resume writing",
    "resume best practices"
  ]
};

export default function ResumeWritingGuide() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How to Write a Resume That Gets You Hired in 2025
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Master the art of resume writing with our comprehensive guide. Learn how to create 
            a professional resume that stands out to employers and passes through ATS systems. 
            Complete with examples, templates, and expert tips.
          </p>
          <div className="mt-8 flex items-center text-sm text-gray-500">
            <span>Complete Guide</span>
            <span className="mx-2">•</span>
            <span>20+ Resume Examples</span>
            <span className="mx-2">•</span>
            <span>Updated for 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">

          <h2>What Makes a Great Resume in 2025?</h2>
          <p>
            A great resume in 2025 must accomplish three key objectives: pass through Applicant 
            Tracking Systems (ATS), grab a hiring manager's attention within 6 seconds, and 
            clearly demonstrate your value to potential employers. The modern resume is both 
            a marketing document and a professional summary that tells your career story.
          </p>

          <h2>Essential Resume Components</h2>
          
          <h3>1. Professional Header</h3>
          <p>Your resume header should include:</p>
          <ul>
            <li><strong>Full Name</strong> - Use your professional name</li>
            <li><strong>Phone Number</strong> - Professional voicemail recommended</li>
            <li><strong>Email Address</strong> - Professional email only</li>
            <li><strong>City, State</strong> - Full address not required</li>
            <li><strong>LinkedIn Profile</strong> - Ensure it matches your resume</li>
            <li><strong>Professional Website/Portfolio</strong> - If relevant to your field</li>
          </ul>

          <h3>2. Professional Summary</h3>
          <p>
            Replace outdated "objective statements" with a compelling professional summary. 
            This 2-4 sentence paragraph should highlight your experience level, key skills, 
            and what you bring to the role. Include relevant keywords from the job description.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary Example</h4>
            <p className="text-gray-700 italic">
              "Experienced software engineer with 5+ years developing scalable web applications 
              using React, Node.js, and Python. Proven track record of leading cross-functional 
              teams and delivering high-quality software solutions that increased user engagement 
              by 40%. Passionate about clean code, test-driven development, and mentoring junior developers."
            </p>
          </div>

          <h3>3. Work Experience Section</h3>
          <p>
            List your work experience in reverse chronological order. For each position, include:
          </p>
          <ul>
            <li><strong>Job Title</strong></li>
            <li><strong>Company Name</strong></li>
            <li><strong>Employment Dates</strong> (Month/Year format)</li>
            <li><strong>Location</strong> (City, State)</li>
            <li><strong>Bullet Points</strong> describing achievements and responsibilities</li>
          </ul>

          <h4>Writing Effective Bullet Points</h4>
          <p>Use the STAR method (Situation, Task, Action, Result) to create compelling bullet points:</p>
          
          <div className="bg-blue-50 p-6 rounded-lg my-6">
            <h5 className="font-semibold text-gray-900 mb-3">Good vs. Bad Resume Bullet Points</h5>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-red-700 mb-1">❌ Bad Example:</p>
                <p className="text-gray-700">• Responsible for social media marketing</p>
              </div>
              <div>
                <p className="font-medium text-green-700 mb-1">✅ Good Example:</p>
                <p className="text-gray-700">• Increased social media engagement by 150% over 6 months by implementing data-driven content strategy and launching targeted campaigns across Instagram, LinkedIn, and Twitter</p>
              </div>
            </div>
          </div>

          <h3>4. Skills Section</h3>
          <p>
            Include both hard skills (technical abilities) and soft skills (interpersonal abilities). 
            Prioritize skills mentioned in the job description you're targeting.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Hard Skills Examples</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Programming Languages (Python, JavaScript, Java)</li>
                <li>• Software Tools (Adobe Creative Suite, Salesforce)</li>
                <li>• Technical Skills (Data Analysis, SEO, Project Management)</li>
                <li>• Certifications (PMP, AWS, Google Analytics)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Soft Skills Examples</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Communication & Presentation</li>
                <li>• Leadership & Team Management</li>
                <li>• Problem-Solving & Critical Thinking</li>
                <li>• Adaptability & Time Management</li>
              </ul>
            </div>
          </div>

          <h3>5. Education Section</h3>
          <p>Include your educational background, focusing on:</p>
          <ul>
            <li><strong>Degree Type and Major</strong></li>
            <li><strong>Institution Name</strong></li>
            <li><strong>Graduation Year</strong></li>
            <li><strong>GPA</strong> (only if 3.5 or higher and recent graduate)</li>
            <li><strong>Relevant Coursework</strong> (for new graduates or career changers)</li>
            <li><strong>Academic Honors</strong> (Dean's List, Magna Cum Laude, etc.)</li>
          </ul>

          <h2>Resume Formatting Best Practices</h2>
          
          <h3>ATS-Friendly Formatting</h3>
          <ul>
            <li><strong>Use standard fonts:</strong> Arial, Calibri, Times New Roman, or Helvetica</li>
            <li><strong>Font size:</strong> 10-12pt for body text, 14-16pt for headings</li>
            <li><strong>Consistent formatting:</strong> Same style for all similar elements</li>
            <li><strong>Standard section headers:</strong> "Work Experience," "Education," "Skills"</li>
            <li><strong>Avoid graphics:</strong> No images, charts, or complex designs</li>
            <li><strong>Use bullet points:</strong> Easy for ATS to parse</li>
          </ul>

          <h3>Length Guidelines</h3>
          <ul>
            <li><strong>Entry Level (0-2 years):</strong> 1 page</li>
            <li><strong>Mid-Level (3-10 years):</strong> 1-2 pages</li>
            <li><strong>Senior Level (10+ years):</strong> 2 pages maximum</li>
            <li><strong>Executive/Academic:</strong> May extend beyond 2 pages if necessary</li>
          </ul>

          <h2>Industry-Specific Resume Tips</h2>
          
          <h3>Technology Resumes</h3>
          <ul>
            <li>Emphasize programming languages, frameworks, and tools</li>
            <li>Include links to GitHub, portfolio, or personal projects</li>
            <li>Highlight problem-solving and analytical skills</li>
            <li>Quantify impact with metrics (performance improvements, user growth)</li>
          </ul>

          <h3>Healthcare Resumes</h3>
          <ul>
            <li>List relevant licenses and certifications prominently</li>
            <li>Emphasize patient care experience and clinical skills</li>
            <li>Include continuing education and professional development</li>
            <li>Highlight compliance with healthcare regulations</li>
          </ul>

          <h3>Finance Resumes</h3>
          <ul>
            <li>Quantify financial impact and cost savings</li>
            <li>Highlight analytical and technical skills</li>
            <li>Include relevant financial software proficiency</li>
            <li>Emphasize attention to detail and accuracy</li>
          </ul>

          <h3>Marketing Resumes</h3>
          <ul>
            <li>Showcase campaign results and ROI metrics</li>
            <li>Highlight digital marketing tools and platforms</li>
            <li>Include creative projects and portfolio links</li>
            <li>Demonstrate understanding of analytics and data-driven decisions</li>
          </ul>

          <h2>Common Resume Mistakes to Avoid</h2>
          
          <div className="bg-red-50 p-6 rounded-lg my-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Top Resume Mistakes</h3>
            <ul className="text-red-700 space-y-2">
              <li>• Using an unprofessional email address</li>
              <li>• Including irrelevant work experience</li>
              <li>• Listing job duties instead of achievements</li>
              <li>• Using generic, one-size-fits-all resumes</li>
              <li>• Including personal information (age, photo, marital status)</li>
              <li>• Neglecting to proofread for spelling and grammar errors</li>
              <li>• Using passive language instead of action verbs</li>
              <li>• Exceeding appropriate length for experience level</li>
            </ul>
          </div>

          <h2>Resume Keywords and ATS Optimization</h2>
          <p>
            Modern resumes must be optimized for both ATS and human readers. Here's how to 
            incorporate keywords effectively:
          </p>
          
          <ol>
            <li><strong>Study the job description:</strong> Identify key skills, qualifications, and requirements</li>
            <li><strong>Use exact keyword matches:</strong> Include important terms as they appear in the job posting</li>
            <li><strong>Include variations:</strong> Use both "AI" and "Artificial Intelligence"</li>
            <li><strong>Natural integration:</strong> Work keywords into your experience descriptions organically</li>
            <li><strong>Skills section optimization:</strong> Include relevant technical and soft skills</li>
          </ol>

          <h2>Final Resume Checklist</h2>
          <div className="bg-green-50 p-6 rounded-lg my-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Before Submitting Your Resume</h3>
            <ul className="text-green-700 space-y-2">
              <li>☐ Contact information is current and professional</li>
              <li>☐ Professional summary targets the specific role</li>
              <li>☐ Work experience uses action verbs and quantified achievements</li>
              <li>☐ Skills section includes relevant keywords from job description</li>
              <li>☐ Education section is complete and accurate</li>
              <li>☐ Formatting is consistent and ATS-friendly</li>
              <li>☐ Resume is proofread for errors</li>
              <li>☐ File is saved as PDF or DOCX</li>
              <li>☐ Filename is professional (FirstName_LastName_Resume.pdf)</li>
            </ul>
          </div>

          <h2>Ready to Build Your Professional Resume?</h2>
          <p>
            Creating a professional resume doesn't have to be overwhelming. Use our free 
            AI-powered resume builder to create a polished, ATS-optimized resume in minutes. 
            Our platform guides you through each section and provides real-time suggestions 
            to help you create a resume that gets results.
          </p>

        </div>

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-blue-50 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Start Building Your Professional Resume Today
          </h3>
          <p className="text-gray-600 mb-6">
            Use our free resume builder with AI assistance, professional templates, and ATS optimization.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Build My Resume Free
          </button>
        </div>
      </article>
    </div>
  );
}