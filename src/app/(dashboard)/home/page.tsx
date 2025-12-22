import { ResumesSection } from "@/components/dashboard/resumes-section";
import { TemplateHandler } from "@/components/dashboard/template-handler";
import { WelcomeDialog } from "@/components/dashboard/welcome-dialog";
import { type SortDirection, type SortOption } from "@/components/resume/management/resume-sort-controls";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getResumeLimit } from "@/lib/constants";
import type { Resume } from "@/lib/types";
import { getDashboardData } from "@/utils/actions";
import { countResumes } from "@/utils/actions/resumes/actions";
import { createClient } from "@/utils/supabase/server";
import { Share2, User } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Your Resume Builder Workspace - Resumy",
  description: "Access your personal resume dashboard on Resumy. Manage your resumes, track progress, and create new professional resumes with AI assistance.",
  robots: {
    index: false,
    follow: false,
  },
};


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {

  const supabase = await createClient();


  const {
    data: { user },
  } = await supabase.auth.getUser()



  const userId = user?.id;
  void userId;

  const params = await searchParams;
  const isNewSignup = params?.type === 'signup' && params?.token_hash;
  const _shouldCreateBase = params?.createBase === 'true';
  const _templateId = params?.template;

  // Fetch dashboard data and handle authentication
  let data;
  try {
    data = await getDashboardData();
    if (!data.profile) {
      redirect("/");
    }
  } catch {
    redirect("/");
  }

  const { profile, displayName, baseResumes: unsortedBaseResumes, tailoredResumes: unsortedTailoredResumes } = data;

  // Get sort parameters for both sections
  const baseSort = (params.baseSort as SortOption) || 'createdAt';
  const baseDirection = (params.baseDirection as SortDirection) || 'asc';
  const tailoredSort = (params.tailoredSort as SortOption) || 'createdAt';
  const tailoredDirection = (params.tailoredDirection as SortDirection) || 'asc';

  // Sort function
  function sortResumes(resumes: Resume[], sort: SortOption, direction: SortDirection) {
    return [...resumes].sort((a, b) => {
      const modifier = direction === 'asc' ? 1 : -1;
      switch (sort) {
        case 'name':
          return modifier * a.name.localeCompare(b.name);
        case 'jobTitle':
          return modifier * ((a.target_role || '').localeCompare(b.target_role || '') || 0);
        case 'createdAt':
        default:
          return modifier * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      }
    });
  }


  // Sort both resume lists
  const baseResumes = sortResumes(unsortedBaseResumes, baseSort, baseDirection);
  const tailoredResumes = sortResumes(unsortedTailoredResumes, tailoredSort, tailoredDirection);

  // Count resumes for base and tailored sections
  const _baseResumesCount = await countResumes('base');
  const _tailoredResumesCount = await countResumes('tailored');
  const totalResumesCount = await countResumes('all');

  // Get the appropriate resume limit based on user's email
  const userResumeLimit = getResumeLimit(profile.email);
  
  // Limit users to total resumes (base + tailored combined)
  const canCreateBase = totalResumesCount < userResumeLimit;
  const canCreateTailored = totalResumesCount < userResumeLimit;


  // Display a friendly message if no profile exists
  if (!profile) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 bg-neutral-900 border-neutral-800">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mx-auto">
              <User className="w-6 h-6 text-neutral-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Profile Not Found</h2>
            <p className="text-sm text-neutral-400">
              We couldn&apos;t find your profile information. Please contact support for assistance.
            </p>
            <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100">
              Contact Support
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen relative pb-16 sm:pb-12 bg-black"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1.5px, transparent 1.5px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 -1.2rem',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Welcome Dialog for New Signups */}
      <WelcomeDialog isOpen={!!isNewSignup} />
      
      {/* Template Handler for Template-based Resume Creation */}
      <TemplateHandler profile={profile} />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Welcome Message */}
              <div
                className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
                style={{
                  WebkitBackdropFilter: 'blur(12px)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  Welcome back, <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">{displayName || profile.first_name || 'User'}</span>
                </h1>
                <p className="text-sm text-neutral-400 mt-1">
                  Manage and create your professional resumes
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                {/* Resume Count Badge - Desktop */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-xs text-neutral-400">Resumes</span>
                  <span className="text-sm font-medium text-white">{totalResumesCount}/{userResumeLimit}</span>
                </div>
                
                {/* Share Button - Desktop Only */}
                <Link
                  href="/resumes/share"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-200 group"
                  style={{
                    WebkitBackdropFilter: 'blur(12px)',
                    backdropFilter: 'blur(12px)',
                  }}
                  title="Share Resumes"
                >
                  <Share2 className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                    Share
                  </span>
                </Link>
              </div>
            </div>

            {/* Mobile Resume Count and Share Row */}
            <div className="flex sm:hidden items-center justify-between gap-3 mt-3">
              {/* Share Button with Text - Mobile */}
              <Link
                href="/resumes/share"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-200 group"
                style={{
                  WebkitBackdropFilter: 'blur(12px)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Share2 className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                  Share Your Resume
                </span>
              </Link>

              {/* Resume Count - Mobile */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md whitespace-nowrap">
                <span className="text-xs text-neutral-400">Total Resumes:</span>
                <span className="text-sm font-medium text-white">{totalResumesCount}/{userResumeLimit}</span>
              </div>
            </div>
          </div>

          {/* Resume Sections */}
          <div className="space-y-8 sm:space-y-10">
            {/* Base Resumes Section */}
            <ResumesSection
              type="base"
              resumes={baseResumes}
              profile={profile}
              sortParam="baseSort"
              directionParam="baseDirection"
              currentSort={baseSort}
              currentDirection={baseDirection}
              canCreateMore={canCreateBase}
              totalResumesCount={totalResumesCount}
              resumeLimit={userResumeLimit}
            />

            {/* Section Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800/50" />
              </div>
            </div>

            {/* Tailored Resumes Section */}
            <ResumesSection
              type="tailored"
              resumes={tailoredResumes}
              profile={profile}
              sortParam="tailoredSort"
              directionParam="tailoredDirection"
              currentSort={tailoredSort}
              currentDirection={tailoredDirection}
              baseResumes={baseResumes}
              canCreateMore={canCreateTailored}
              totalResumesCount={totalResumesCount}
              resumeLimit={userResumeLimit}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
