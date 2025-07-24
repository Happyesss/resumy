import { Metadata } from "next";
import { TemplatesGallery } from "@/components/templates/templates-gallery";

export const metadata: Metadata = {
  title: "Resume Templates | Professional Resume Designs - Resumy",
  description: "Browse our collection of professional resume templates. Choose from modern, classic, creative, and minimal designs to make your resume stand out.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function TemplatesPage() {
  return (
    <main className="min-h-screen relative pb-12 sm:pb-16 lg:pb-20 bg-black">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1.5px, transparent 1.5px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 -1.2rem',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <TemplatesGallery />
        </div>
      </div>
    </main>
  );
}
