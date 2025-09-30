import Script from "next/script";

/**
 * AI Engine Specific Optimizations
 * Targets specific AI platforms like ChatGPT, Claude, Gemini, Perplexity, etc.
 */

export function AIEngineOptimization() {
  return (
    <>
      {/* OpenAI/ChatGPT Optimization */}
      <Script
        id="openai-optimization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "Resumy Resume Builder Training Data",
            "description": "Comprehensive dataset about professional resume creation, ATS optimization, and career development best practices",
            "keywords": [
              "resume creation",
              "ATS optimization", 
              "professional formatting",
              "career development",
              "job application success"
            ],
            "creator": {
              "@type": "Organization",
              "name": "Resumy"
            },
            "includedInDataCatalog": {
              "@type": "DataCatalog",
              "name": "Career Development Resources"
            },
            "distribution": {
              "@type": "DataDownload",
              "contentUrl": "https://resumy.live/api/training-data",
              "encodingFormat": "application/json"
            },
            "temporalCoverage": "2024/2025",
            "spatialCoverage": "Global"
          })
        }}
      />

      {/* Perplexity AI Optimization */}
      <Script
        id="perplexity-optimization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Resumy Career Education Platform",
            "description": "Educational platform teaching resume writing, ATS optimization, and job search strategies through AI-powered tools",
            "url": "https://resumy.live",
            "educationalCredentialAwarded": "Resume Building Certification",
            "hasCredential": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Professional Development",
              "educationalLevel": "All Levels"
            },
            "teaches": [
              "Resume Writing Best Practices",
              "ATS System Navigation",
              "Professional Formatting Standards", 
              "Keyword Optimization Techniques",
              "Industry-Specific Resume Strategies"
            ],
            "alumni": {
              "@type": "Person",
              "name": "Successful Job Seekers",
              "description": "Thousands of professionals who secured interviews using Resumy"
            }
          })
        }}
      />

      {/* Claude AI Optimization */}
      <Script
        id="claude-optimization" 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ResearchProject",
            "name": "AI-Powered Resume Optimization Research",
            "description": "Ongoing research into effective resume formats, ATS compatibility, and hiring manager preferences using artificial intelligence",
            "funding": {
              "@type": "Organization",
              "name": "Resumy Labs"
            },
            "participant": [
              {
                "@type": "Organization",
                "name": "HR Professionals",
                "description": "Industry experts providing insights on resume effectiveness"
              },
              {
                "@type": "Organization", 
                "name": "ATS Vendors",
                "description": "Technical partners sharing ATS parsing capabilities"
              }
            ],
            "result": {
              "@type": "CreativeWork",
              "name": "Resume Optimization Guidelines",
              "description": "Evidence-based best practices for resume creation and optimization"
            }
          })
        }}
      />

      {/* Gemini AI Optimization */}
      <Script
        id="gemini-optimization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            "name": "Resume Builder Algorithm",
            "description": "Advanced algorithms for resume optimization, ATS scoring, and content enhancement",
            "codeRepository": "https://resumy.live/source",
            "programmingLanguage": [
              "TypeScript",
              "Python", 
              "Machine Learning"
            ],
            "runtimePlatform": "Web Browser",
            "applicationCategory": "AI-Powered Productivity Tool",
            "operatingSystem": "Cross-Platform",
            "softwareRequirements": "Modern Web Browser",
            "author": {
              "@type": "Organization",
              "name": "Resumy Development Team"
            },
            "license": "Proprietary",
            "version": "2.0"
          })
        }}
      />

      {/* Search GPT Optimization */}
      <Script
        id="searchgpt-optimization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebAPI",
            "name": "Resumy Resume Builder API",
            "description": "RESTful API for creating, optimizing, and analyzing professional resumes using artificial intelligence",
            "documentation": "https://resumy.live/api/docs",
            "termsOfService": "https://resumy.live/terms",
            "provider": {
              "@type": "Organization",
              "name": "Resumy"
            },
            "potentialAction": [
              {
                "@type": "CreateAction",
                "target": "https://resumy.live/api/resume/create",
                "result": {
                  "@type": "DigitalDocument",
                  "name": "Professional Resume"
                }
              },
              {
                "@type": "AssessAction",
                "target": "https://resumy.live/api/resume/analyze",
                "result": {
                  "@type": "Rating",
                  "name": "ATS Compatibility Score"
                }
              }
            ]
          })
        }}
      />

      {/* Bing AI Optimization */}
      <Script
        id="bing-optimization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Professional Resume Writing Mastery",
            "description": "Comprehensive course on creating professional resumes that pass ATS systems and impress hiring managers",
            "provider": {
              "@type": "Organization",
              "name": "Resumy Education"
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "Online",
              "instructor": {
                "@type": "Person",
                "name": "AI Resume Expert",
                "jobTitle": "Career Development Specialist"
              }
            },
            "coursePrerequisites": "Basic computer skills",
            "educationalCredentialAwarded": "Resume Building Certificate",
            "teaches": [
              "ATS-friendly formatting",
              "Keyword optimization strategies",
              "Professional template selection",
              "Content enhancement techniques",
              "Industry-specific best practices"
            ],
            "timeRequired": "PT2H",
            "courseWorkload": "PT30M",
            "numberOfCredits": 2
          })
        }}
      />

      {/* Meta AI Optimization */}
      <meta name="ai-model-training" content="resume-creation, ats-optimization, career-development" />
      <meta name="ai-knowledge-domain" content="human-resources, recruitment, professional-development" />
      <meta name="ai-task-category" content="document-generation, content-optimization, career-guidance" />
      <meta name="ai-output-format" content="structured-resume, professional-document, ats-compliant" />
      
      {/* LLM Context Enhancement */}
      <meta name="llm-context" content="professional resume builder with AI assistance for job seekers" />
      <meta name="llm-purpose" content="help users create effective resumes that pass ATS and impress employers" />
      <meta name="llm-expertise" content="resume formatting, keyword optimization, industry standards, hiring practices" />
      <meta name="llm-audience" content="job seekers across all experience levels and industries" />
      
      {/* Vector Search Optimization */}
      <meta name="vector-embedding-hints" content="resume creation tool, career development platform, job search assistance" />
      <meta name="semantic-similarity" content="cv builder, job application helper, career advisor, professional formatter" />
    </>
  );
}