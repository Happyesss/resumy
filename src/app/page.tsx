import { Hero } from "@/components/landing/Hero";
import { VideoShowcase } from "@/components/landing/VideoShowcase";
import { CompanyLogos } from "@/components/landing/CompanyLogos";
import { HowItWorks } from "@/components/landing/HowItWorks";
import FeatureHighlights from "@/components/landing/FeatureHighlights";
import { KeepEverythingInPlace } from "@/components/landing/KeepEverythingInPlace";
import { Testimonials } from "@/components/landing/Testimonials";
import { About } from "@/components/landing/About";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/layout/footer";
import { NavLinks, MobileNavLinks } from "@/components/layout/nav-links";
import { Logo } from "@/components/ui/logo";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";

// Page-specific metadata that extends the base metadata from layout.tsx
export const metadata: Metadata = {
  title: "Resumy - Free AI Resume Builder | Create Professional Resumes Online in Minutes",
  description: "Create professional, ATS-optimized resumes for free with Resumy's AI-powered resume builder. Get hired faster with smart resume templates, keyword optimization, and expert guidance. Start building your perfect resume today!",
  keywords: [
    "free resume builder",
    "ai resume builder", 
    "professional resume",
    "create resume online",
    "resume maker free",
    "ATS resume builder",
    "resume templates",
    "job application resume",
    "resume generator",
    "online resume creator",
    "resume writing tool",
    "career builder",
    "resume optimization",
    "modern resume design"
  ],
  openGraph: {
    title: "Resumy - Free AI Resume Builder | Create Professional Resumes Online",
    description: "Create professional, ATS-optimized resumes for free with Resumy's AI-powered resume builder. Get hired faster with smart resume templates and expert guidance.",
    url: "https://resumy.live",
    type: "website",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Resumy - Free AI Resume Builder Homepage",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resumy - Free AI Resume Builder | Create Professional Resumes Online",
    description: "Create professional, ATS-optimized resumes for free with Resumy's AI-powered resume builder. Get hired faster with smart resume templates.",
    images: ["/og.webp"],
  },
  alternates: {
    canonical: "https://resumy.live",
  },
};

export default async function Page() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If user is authenticated, redirect to home page
  if (user) {
    redirect("/home");
  }
  
  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <Script
        id="schema-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Resumy",
            "applicationCategory": "BusinessApplication",
            "applicationSubCategory": "Resume Builder",
            "operatingSystem": "Web Browser",
            "url": "https://resumy.live",
            "description": "Resumy is a free AI resume builder that helps you create professional resumes quickly and easily. Build ATS-optimized resumes with AI assistance, get hired faster with our smart resume optimization tools.",
            "author": {
              "@type": "Organization",
              "name": "Resumy",
              "url": "https://resumy.live"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "featureList": [
              "AI-Powered Resume Building",
              "ATS Optimization",
              "Professional Templates",
              "Real-time Resume Analysis",
              "Keyword Optimization",
              "Multi-format Export"
            ],
            "softwareRequirements": "Web Browser",
            "browserRequirements": "Modern web browser with JavaScript enabled",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating", 
                  "ratingValue": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": "Sarah Johnson"
                },
                "reviewBody": "Resumy helped me create a professional resume in minutes. The AI suggestions were spot-on!"
              }
            ]
          })
        }}
      />

      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Resumy",
            "url": "https://resumy.live",
            "logo": "https://resumy.live/logo.png",
            "description": "Free AI-powered resume builder helping professionals create ATS-optimized resumes quickly and easily.",
            "foundingDate": "2024",
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
                  "text": "Yes, Resumy is completely free to use. You can create, edit, and download professional resumes without any cost."
                }
              },
              {
                "@type": "Question", 
                "name": "How does the AI resume builder work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI analyzes your job preferences and experience to suggest optimized content, keywords, and formatting that pass ATS systems and impress recruiters."
                }
              },
              {
                "@type": "Question",
                "name": "Are the resumes ATS-compatible?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all our resume templates are designed to be ATS (Applicant Tracking System) compatible, ensuring your resume gets past automated screening systems."
                }
              }
            ]
          })
        }}
      />
    
      <main aria-label="Resumy - Free AI Resume Builder homepage" className="bg-black ">
        {/* Enhanced Navigation */}
        <nav aria-label="Main navigation" className="bg-black border-b border-gray-800 fixed top-0 w-full z-[1000] transition-all duration-300 shadow-lg backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left - Logo */}
              <div className="flex items-center gap-2">
                <Logo />
              </div>
              
              {/* Middle - Navigation Links */}
              <div className="hidden md:flex flex-1 justify-center">
                <NavLinks />
              </div>
              
              {/* Right - Auth Buttons */}
              <div className="flex items-center gap-3">
                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                  <AuthDialog defaultTab="login">
                    <button className="px-4 py-2 text-sm font-medium text-white border border-white hover:bg-white hover:text-black transition-all duration-200 rounded-lg">
                      Login
                    </button>
                  </AuthDialog>
                  <AuthDialog defaultTab="signup">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                      Sign Up
                    </button>
                  </AuthDialog>
                </div>
                
                {/* Mobile Auth Buttons and Menu */}
                <div className="md:hidden flex items-center gap-2">
                  <AuthDialog defaultTab="login">
                    <button className="px-3 py-1.5 text-xs font-medium text-white border border-white hover:bg-white hover:text-black transition-all duration-200 rounded-md">
                      Login
                    </button>
                  </AuthDialog>
                  <AuthDialog defaultTab="signup">
                    <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-all duration-200">
                      Sign Up
                    </button>
                  </AuthDialog>
                  {/* Mobile Menu - moved here */}
                  <MobileNavLinks />
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Hero Section - Full width */}
        <Hero />
        
        {/* Main content */}
        <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-24 flex flex-col justify-center">
          {/* Other sections will go here if needed */}
        </div>
        
        {/* Video Showcase Section */}
        <section id="product-demo">
          <VideoShowcase />
        </section>

        {/* Company Logos Section
        <CompanyLogos /> */}

        {/* Feature Highlights Section */}
        <section id="features" aria-labelledby="features-heading">
          <FeatureHighlights />
        </section>

        {/* Keep Everything In Place Section */}
        <KeepEverythingInPlace />

        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Testimonials Section */}
        <Testimonials />

        {/* About Section */}
        <About />

        {/* Pricing Section */}
        <section id="pricing" aria-labelledby="pricing-heading">
          <Pricing />
        </section>
        
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}