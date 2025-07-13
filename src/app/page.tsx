import FeatureHighlights from "@/components/landing/FeatureHighlights";
import { Hero } from "@/components/landing/Hero";
import { VideoShowcase } from "@/components/landing/VideoShowcase";
import { FreeAnnouncement } from "@/components/landing/FreeAnnouncement";
import { FAQ } from "@/components/landing/FAQ";
import { NavLinks, MobileNavLinks } from "@/components/layout/nav-links";
import { Logo } from "@/components/ui/logo";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";

// Page-specific metadata that extends the base metadata from layout.tsx
export const metadata: Metadata = {
  title: "Resumy - AI Resume Builder for Tech Jobs",
  description: "Create ATS-optimized tech resumes in under 10 minutes. 3x your interview chances with AI-powered resume tailoring.",
  openGraph: {
    title: "Resumy - AI Resume Builder for Tech Jobs",
    description: "Create ATS-optimized tech resumes in under 10 minutes. 3x your interview chances with AI-powered resume tailoring.",
    url: "https://resumy.com",
  },
  twitter: {
    title: "Resumy - AI Resume Builder for Tech Jobs",
    description: "Create ATS-optimized tech resumes in under 10 minutes. 3x your interview chances with AI-powered resume tailoring.",
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
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Create ATS-optimized tech resumes in under 10 minutes. 3x your interview chances with AI-powered resume tailoring.",
            "operatingSystem": "Web",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "500"
            }
          })
        }}
      />
    
      <main aria-label="ResumeLM landing page" className="bg-black ">
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
        
        {/* Feature Highlights Section */}
        <section id="features" aria-labelledby="features-heading">
          <FeatureHighlights />
        </section>

        
        {/* About the Project Section */}
        <section id="pricing" aria-labelledby="about-project-heading">
          <FreeAnnouncement />
        </section>
        
        {/* FAQ Section */}
        <FAQ />
      </main>
    </>
  );
}