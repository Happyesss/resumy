/**
 * SEO-optimized content blocks for better ranking on "resume" and "resume builder" keywords
 * This component provides structured, keyword-rich content for search engines
 */

export function SeoContent() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Primary SEO Section - Resume Builder */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Best Free Resume Builder for 2025
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create professional, ATS-optimized resumes that get you hired. Our AI-powered resume builder 
              is trusted by thousands of professionals across all industries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Free Resume Builder
              </h3>
              <p className="text-gray-600">
                Build unlimited professional resumes completely free. No hidden costs, 
                no subscriptions, no watermarks. Create as many resumes as you need.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                ATS-Optimized Resumes
              </h3>
              <p className="text-gray-600">
                All our resume templates are designed to pass Applicant Tracking Systems (ATS). 
                Get your resume seen by hiring managers, not filtered out by software.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI Resume Assistance
              </h3>
              <p className="text-gray-600">
                Get intelligent suggestions for resume content, keyword optimization, 
                and formatting. Our AI helps you create compelling resumes that stand out.
              </p>
            </div>
          </div>
        </section>

        {/* Secondary SEO Section - Industry Focus */}
        <section className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
            Professional Resume Templates for Every Industry
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Tech Resume Builder",
                description: "Perfect for software engineers, developers, data scientists, and IT professionals."
              },
              {
                title: "Healthcare Resume Maker",
                description: "Specialized templates for nurses, doctors, medical professionals, and healthcare workers."
              },
              {
                title: "Finance Resume Creator",
                description: "Professional formats for accountants, financial analysts, and banking professionals."
              },
              {
                title: "Marketing Resume Builder",
                description: "Creative yet professional designs for marketing managers, digital marketers, and creative professionals."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tertiary SEO Section - Resume Tips */}
        <section>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
            How to Create the Perfect Resume in 2025
          </h2>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Resume Writing Best Practices
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Essential Resume Sections</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Professional summary or objective statement</li>
                    <li>• Work experience with quantified achievements</li>
                    <li>• Skills section with relevant keywords</li>
                    <li>• Education and certifications</li>
                    <li>• Optional: Projects, publications, volunteer work</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Resume Optimization Tips</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Use keywords from the job description</li>
                    <li>• Keep it to 1-2 pages maximum</li>
                    <li>• Use consistent formatting and fonts</li>
                    <li>• Include measurable results and achievements</li>
                    <li>• Tailor your resume for each application</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}