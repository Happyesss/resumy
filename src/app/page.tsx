import { AuthDialog } from "@/components/auth/auth-dialog";
import { About } from "@/components/landing/About";
import FeatureHighlights from "@/components/landing/FeatureHighlights";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { KeepEverythingInPlace } from "@/components/landing/KeepEverythingInPlace";
import { Pricing } from "@/components/landing/Pricing";
import { ResumeTracking } from "@/components/landing/ResumeTracking";
import { Testimonials } from "@/components/landing/Testimonials";
import { VideoShowcase } from "@/components/landing/VideoShowcase";
import { Footer } from "@/components/layout/footer";
import { GitHubStarBadge } from "@/components/layout/github-star-badge";
import { MobileNavLinks, NavLinks } from "@/components/layout/nav-links";
import { AdvancedSeoSchema } from "@/components/seo/AdvancedSeoSchema";
import { BrandSchema } from "@/components/seo/BrandSchema";
import { NextGenSEOSuite } from "@/components/seo/NextGenSEOSuite";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Script from "next/script";

const GITHUB_REPO_URL = "https://github.com/Happyesss/resumyy";

function formatStarCount(stars: number) {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${stars}`;
}

// Page-specific metadata that extends the base metadata from layout.tsx
export const metadata: Metadata = {
  title: "Resumy - Free AI Resume Builder | Create Professional Resumes Online in Minutes",
  description: "Create professional, ATS-optimized resumes for free with Resumy's AI-powered resume builder. Get hired faster with smart resume templates, keyword optimization, AI assistance, and expert guidance. Build modern resumes that pass applicant tracking systems (ATS) and impress hiring managers. Perfect for software engineers, data scientists, marketing professionals, and all career levels. Start building your perfect resume today - no sign-up required!",
  keywords: [
    // Long tail keywords - 100 specific phrases
    "free AI powered resume builder online",
    "create professional resume in minutes",
    "ATS optimized resume builder free",
    "best free resume maker 2025",
    "AI resume builder that actually works",
    "professional resume templates free download",
    "how to build resume online for free",
    "automated resume builder with AI assistance",
    "free resume creator with ATS optimization",
    "best online resume builder for tech jobs",
    "AI resume maker for software engineers",
    "free professional resume builder no sign up",
    "create ATS friendly resume online free",
    "modern resume builder with AI features",
    "free resume builder for entry level jobs",
    "professional CV maker online free",
    "AI powered resume optimization tool",
    "free resume builder for career change",
    "online resume creator for students",
    "best free ATS resume builder",
    "AI resume builder for remote jobs",
    "professional resume maker for executives",
    "free resume builder with modern templates",
    "automated resume writing with AI",
    "best online CV builder free",
    "AI resume creator for job seekers",
    "free professional resume generator",
    "ATS compliant resume builder online",
    "modern resume maker with AI help",
    "free resume builder for graduates",
    "professional resume creator online free",
    "AI powered CV builder free",
    "best resume builder for tech professionals",
    "free online resume maker with templates",
    "AI resume optimization service free",
    "professional resume builder for healthcare",
    "free ATS resume checker and builder",
    "modern CV creator with AI features",
    "best free resume builder for managers",
    "AI powered resume writing assistant",
    "free professional CV maker online",
    "resume builder that passes ATS systems",
    "AI resume creator for marketing professionals",
    "free online resume builder for teachers",
    "professional resume maker for sales",
    "best AI resume builder for finance",
    "free resume creator with keyword optimization",
    "modern resume builder for startups",
    "AI powered professional resume maker",
    "free ATS friendly resume creator",
    "best online resume builder for nursing",
    "professional CV builder with AI assistance",
    "free resume maker for data scientists",
    "AI resume builder for consulting jobs",
    "modern professional resume creator free",
    "best free CV builder online",
    "AI powered resume template generator",
    "free resume builder for project managers",
    "professional resume maker for engineers",
    "ATS optimized CV builder free",
    "modern resume creator with AI help",
    "best free resume builder for developers",
    "AI resume optimization tool online",
    "free professional resume builder 2025",
    "online resume maker with AI features",
    "best ATS resume builder free",
    "professional CV creator online free",
    "AI powered resume builder for executives",
    "free modern resume maker online",
    "best online resume creator free",
    "AI resume builder for career changers",
    "professional resume generator free",
    "modern CV builder with templates",
    "free AI resume writing service",
    "best resume builder for remote work",
    "professional online CV maker free",
    "AI powered resume creator online",
    "free ATS resume builder tool",
    "modern professional resume maker",
    "best free online resume builder",
    "AI resume optimization platform",
    "professional resume builder online free",
    "free CV creator with AI assistance",
    "modern resume maker for professionals",
    "best AI powered resume builder",
    "free online professional resume creator",
    "ATS compliant CV builder online",
    "AI resume builder for tech industry",
    "professional resume maker free download",
    "modern online resume builder free",
    "best free AI resume creator",
    "professional CV builder online free",
    "free resume builder with AI optimization",
    "modern professional CV maker",
    "best online resume maker free",
    "AI powered professional resume creator",
    "free ATS optimized resume builder",
    "modern resume builder for job seekers",
    "professional online resume maker free",
    "best free CV creator online",
    "AI resume builder for all industries",
    "free professional resume template builder",
    "modern CV creator online free",
    "best AI resume optimization tool",
    "professional resume builder for free",
    "free online modern resume maker",
    
    // Additional 100+ Long-tail Keywords for Resume & Resume Builder
    "AI resume creator with templates",
    "best professional resume builder online",
    "create winning resume in 5 minutes",
    "professional resume builder that works",
    "free resume builder with spell check",
    "AI powered resume maker 2025",
    "modern resume templates for download",
    "executive level resume builder free",
    "ATS resume builder with keyword suggestions",
    "professional CV maker for job seekers",
    "resume builder with industry templates",
    "free AI resume writer online",
    "smart resume creator with optimization",
    "modern professional resume generator",
    "resume builder for college graduates",
    "AI resume assistant for career growth",
    "professional resume maker with examples",
    "free resume builder no watermark",
    "ATS friendly resume creator online",
    "resume builder with cover letter maker",
    "professional resume templates 2025",
    "AI powered CV builder online",
    "resume maker for job applications",
    "free professional resume editor",
    "modern resume builder for executives",
    "AI resume optimization software",
    "resume creator for remote workers",
    "professional resume builder with tips",
    "free ATS resume maker online",
    "resume builder for career switchers",
    "AI powered professional CV maker",
    "modern resume templates free download",
    "resume builder with real time preview",
    "professional resume creator 2025",
    "free resume maker with AI suggestions",
    "ATS optimized resume builder tool",
    "resume builder for tech professionals",
    "AI resume writer for job seekers",
    "professional resume maker online free",
    "modern CV builder with AI features",
    "resume creator with keyword optimization",
    "free professional resume generator 2025",
    "AI powered resume building platform",
    "resume builder for healthcare workers",
    "professional CV creator with templates",
    "modern resume maker for students",
    "AI resume builder for marketing jobs",
    "free resume creator with ATS scoring",
    "professional resume builder for nurses",
    "resume maker with industry expertise",
    "AI powered CV generator online",
    "modern resume builder for managers",
    "professional resume creator with AI",
    "free resume builder for internships",
    "ATS compliant resume maker online",
    "resume builder for finance professionals",
    "AI powered professional resume tool",
    "modern CV maker for job hunting",
    "resume creator for entry level jobs",
    "professional resume builder with guidance",
    "free AI resume maker 2025",
    "resume builder for software engineers",
    "modern professional CV creator",
    "AI resume writer with templates",
    "professional resume maker for sales",
    "free resume creator for graduates",
    "ATS optimized CV builder online",
    "resume builder for project managers",
    "AI powered resume creation tool",
    "modern resume maker with examples",
    "professional CV builder for executives",
    "free resume generator with AI help",
    "resume builder for data scientists",
    "AI resume creator for professionals",
    "modern CV maker with optimization",
    "professional resume builder platform",
    "free ATS resume creator 2025",
    "resume maker for consulting jobs",
    "AI powered CV building software",
    "modern professional resume tool",
    "resume builder for startup employees",
    "professional CV creator online free",
    "free resume maker with AI writing",
    "ATS friendly CV builder online",
    "resume creator for remote positions",
    "AI powered professional resume maker",
    "modern resume builder with AI guidance",
    "professional resume generator online",
    "free CV maker for job applications",
    "resume builder for academic positions",
    "AI resume writer for career change",
    "modern professional CV generator",
    "resume creator with expert templates",
    "professional resume maker 2025 edition",
    "free AI powered CV builder",
    "resume builder for government jobs",
    "modern CV creator with AI assistance",
    "professional resume tool for executives",
    "ATS resume builder with analytics",
    "free resume maker for professionals",
    "AI powered resume platform online",
    "modern professional resume creator",
    "resume builder for nonprofit jobs",
    "professional CV maker with AI features",
    "free resume generator for students",
    "AI resume creator for all industries",
    "modern resume builder for job seekers",
    "professional CV builder 2025 version",
    "resume maker with personalization",
    "free ATS friendly resume builder",
    "AI powered CV creation platform"
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

  let githubStars: number | null = null;
  try {
    const githubResponse = await fetch("https://api.github.com/repos/Happyesss/resumyy", {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "resumy-web",
      },
    });

    if (githubResponse.ok) {
      const repoData: { stargazers_count?: number } = await githubResponse.json();
      if (typeof repoData.stargazers_count === "number") {
        githubStars = repoData.stargazers_count;
      }
    }
  } catch {
    // Gracefully fall back to text-only CTA when GitHub API is unavailable.
  }

  const githubStarsValue = githubStars !== null ? formatStarCount(githubStars) : "0";
  const githubStarsLabel = githubStars !== null
    ? `${githubStarsValue} stars`
    : "Star on GitHub";
  
  // If user is authenticated, redirect to home page
  if (user) {
    redirect("/home");
  }
  
  return (
    <>
      {/* Brand Schema Component */}
      <BrandSchema />
      
      {/* Next-Generation AI Optimization Suite */}
      <NextGenSEOSuite />
      
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
            "logo": {
              "@type": "ImageObject",
              "url": "https://resumy.live/logo.png",
              "width": 512,
              "height": 512,
              "caption": "Resumy Logo"
            },
            "image": "https://resumy.live/logo.png",
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
            },
            "brand": {
              "@type": "Brand",
              "name": "Resumy",
              "logo": "https://resumy.live/logo.png"
            }
          })
        }}
      />

      {/* WebSite Schema */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Resumy",
            "url": "https://resumy.live",
            "description": "Free AI-powered resume builder helping professionals create ATS-optimized resumes quickly and easily.",
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
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://resumy.live/?search={search_term_string}",
              "query-input": "required name=search_term_string"
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
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left - Logo */}
              <div className="flex items-center gap-2">
                <Logo className="text-lg sm:text-xl" />
              </div>
              
              {/* Middle - Navigation Links */}
              <div className="hidden md:flex flex-1 justify-center">
                <NavLinks />
              </div>
              
              {/* Right - Auth Buttons */}
              <div className="flex items-center gap-3">
                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                  <GitHubStarBadge
                    href={GITHUB_REPO_URL}
                    starCount={githubStarsValue}
                    starLabel={githubStarsLabel}
                  />

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
                <div className="md:hidden flex items-center gap-1.5 sm:gap-2">
                  <GitHubStarBadge
                    href={GITHUB_REPO_URL}
                    starCount={githubStarsValue}
                    starLabel={githubStarsLabel}
                    compact
                    className="hidden min-[380px]:inline-flex shrink-0"
                  />

                  <AuthDialog defaultTab="login">
                    <button className="hidden min-[400px]:inline-flex shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-medium text-white border border-white hover:bg-white hover:text-black transition-all duration-200 rounded-md">
                      Login
                    </button>
                  </AuthDialog>
                  <AuthDialog defaultTab="signup">
                    <button className="inline-flex shrink-0 whitespace-nowrap px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-all duration-200">
                      Sign Up
                    </button>
                  </AuthDialog>
                  {/* Mobile Menu - moved here */}
                  <div className="shrink-0">
                    <MobileNavLinks />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Hero Section - Full width */}
        <Hero githubRepoUrl={GITHUB_REPO_URL} />
        
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

        {/* Resume Sharing & Tracking Section */}
        <ResumeTracking />

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
      
      {/* Advanced SEO Schema */}
      <AdvancedSeoSchema />
    </>
  );
}