/**
 * Advanced Schema.org structured data for better search engine understanding
 * Includes multiple schema types to maximize SEO potential
 */

import Script from 'next/script';

export function AdvancedSeoSchema() {
  const baseUrl = 'https://resumy.live';
  
  return (
    <>
      {/* Enhanced Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Resumy",
            "alternateName": "Resumy Resume Builder",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`,
              "width": 512,
              "height": 512,
              "caption": "Resumy - Free AI Resume Builder Logo"
            },
            "description": "Resumy is the leading free AI-powered resume builder that helps professionals create ATS-optimized resumes quickly and easily. Trusted by thousands of job seekers across all industries including technology, healthcare, finance, marketing, and more.",
            "foundingDate": "2024",
            "areaServed": {
              "@type": "GeoShape",
              "addressCountry": ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL", "SE", "NO", "DK", "FI"]
            },
            "serviceArea": {
              "@type": "GeoShape", 
              "addressCountry": "Worldwide"
            },
            "knowsAbout": [
              "Resume Writing",
              "Career Development",
              "Job Search Optimization",
              "ATS Systems",
              "Professional Resume Design",
              "AI Resume Building",
              "Career Coaching",
              "Interview Preparation"
            ],
            "sameAs": [
              "https://twitter.com/resumy",
              "https://linkedin.com/company/resumy"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })
        }}
      />

      {/* WebApplication Schema */}
      <Script
        id="webapp-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Resumy - Free AI Resume Builder",
            "url": baseUrl,
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "Resume Builder Software",
            "operatingSystem": "Web Browser",
            "description": "Free AI-powered resume builder that creates professional, ATS-optimized resumes in minutes. Features include resume templates, AI writing assistance, keyword optimization, and real-time resume analysis. Perfect for software engineers, healthcare professionals, finance experts, marketing professionals, and job seekers at all career levels.",
            "featureList": [
              "Free Resume Builder",
              "ATS-Optimized Templates", 
              "AI Writing Assistance",
              "Keyword Optimization",
              "Resume Analysis",
              "Multiple Download Formats",
              "Industry-Specific Templates",
              "Real-time Editing",
              "Professional Formatting",
              "Career Level Customization"
            ],
            "screenshot": `${baseUrl}/images/Dashboard.png`,
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2024-12-01",
            "author": {
              "@type": "Organization",
              "name": "Resumy"
            },
            "publisher": {
              "@type": "Organization", 
              "name": "Resumy",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
              }
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "validFrom": "2024-01-01",
              "description": "Free forever plan with unlimited resume creation"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "2500",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* Service Schema */}
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Resume Building Service",
            "description": "Professional resume creation and optimization service powered by AI technology. We help job seekers create ATS-friendly resumes that get results.",
            "provider": {
              "@type": "Organization",
              "name": "Resumy"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Worldwide"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Resume Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Free Resume Builder",
                    "description": "Create unlimited professional resumes for free"
                  },
                  "price": "0",
                  "priceCurrency": "USD"
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Resume Analysis",
                    "description": "Get AI-powered feedback on your resume"
                  },
                  "price": "0",
                  "priceCurrency": "USD"
                }
              ]
            },
            "serviceType": "Resume Writing and Career Services",
            "category": "Professional Services"
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is Resumy really free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Resumy is completely free to use. You can create unlimited resumes, use all templates, and access AI features without any cost. There are no hidden fees or subscription requirements."
                }
              },
              {
                "@type": "Question",
                "name": "Are Resumy resumes ATS-friendly?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "All Resumy resume templates are designed to be ATS (Applicant Tracking System) compliant. Our resumes use proper formatting, standard fonts, and clear section headers that ATS systems can easily parse."
                }
              },
              {
                "@type": "Question",
                "name": "What industries does Resumy support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Resumy supports all industries including technology, healthcare, finance, marketing, education, engineering, sales, consulting, and more. We offer industry-specific templates and keyword suggestions."
                }
              },
              {
                "@type": "Question",
                "name": "Can I download my resume in different formats?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can download your resume as a PDF, which is the most commonly accepted format by employers and ATS systems."
                }
              },
              {
                "@type": "Question",
                "name": "How does the AI resume builder work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI analyzes your information and provides suggestions for resume content, keyword optimization, and formatting improvements. It helps you create compelling bullet points and ensures your resume is optimized for your target job."
                }
              }
            ]
          })
        }}
      />

      {/* BreadcrumbList Schema for Homepage */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Resume Builder",
                "item": `${baseUrl}/#resume-builder`
              }
            ]
          })
        }}
      />
    </>
  );
}