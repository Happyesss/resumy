import { TemplatesGallery } from "@/components/templates/templates-gallery";
import { Metadata } from "next";

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
    <main className="min-h-screen bg-black relative">
      {/* Top radial glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px]"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% -10%, rgba(255,255,255,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TemplatesGallery />
      </div>
    </main>
  );
}
