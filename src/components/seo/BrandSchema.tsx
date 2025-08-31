import Script from 'next/script';

export function BrandSchema() {
  return (
    <>
      {/* Brand/Logo specific Schema - helps Google recognize your brand */}
      <Script
        id="brand-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Brand",
            "name": "Resumy",
            "url": "https://resumy.live",
            "logo": {
              "@type": "ImageObject",
              "url": "https://resumy.live/logo.png",
              "width": 512,
              "height": 512,
              "caption": "Resumy Brand Logo - Free AI Resume Builder",
              "representativeOfPage": true
            },
            "image": "https://resumy.live/logo.png",
            "description": "Resumy is a leading AI-powered resume builder that helps professionals create ATS-optimized resumes quickly and easily. The best free resume maker for tech professionals, healthcare workers, finance experts, marketing professionals, and job seekers across all industries.",
            "keywords": "free resume builder, AI resume maker, ATS optimized resume, professional resume templates, online CV creator, resume optimization tool, job search assistance, career development platform",
            "sameAs": [
              "https://twitter.com/resumy",
              "https://linkedin.com/company/resumy"
            ]
          })
        }}
      />
      
      {/* Enhanced SoftwareApplication Schema */}
      <Script
        id="business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Resumy - Free AI Resume Builder",
            "url": "https://resumy.live",
            "logo": "https://resumy.live/logo.png",
            "image": "https://resumy.live/logo.png",
            "description": "Free AI-powered resume builder helping professionals create ATS-optimized resumes quickly and easily. Build professional resumes with modern templates, AI assistance, keyword optimization, and expert guidance. Perfect for software engineers, data scientists, healthcare professionals, marketing experts, finance professionals, and career changers.",
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "Resume Builder",
            "operatingSystem": "Web",
            "keywords": [
              "free resume builder",
              "AI resume maker", 
              "ATS optimized resume",
              "professional resume templates",
              "online CV creator",
              "resume optimization",
              "job application tool",
              "career development",
              "professional resume service",
              "modern resume design"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Completely free AI-powered resume builder with no hidden fees"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Resumy",
              "logo": {
                "@type": "ImageObject",
                "url": "https://resumy.live/logo.png",
                "width": 512,
                "height": 512
              }
            },
            "featureList": [
              "AI-powered resume optimization",
              "ATS-friendly templates",
              "Professional resume designs",
              "Keyword optimization",
              "Free PDF download",
              "Multiple industry templates",
              "Real-time editing",
              "Career level customization"
            ],
            "audience": {
              "@type": "Audience",
              "audienceType": "Job Seekers, Professionals, Students, Career Changers, Software Engineers, Healthcare Workers, Marketing Professionals, Finance Experts"
            }
          })
        }}
      />
    </>
  );
}
