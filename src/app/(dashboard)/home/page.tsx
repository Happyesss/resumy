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
      <main className="min-h-screen p-6 md:p-8 lg:p-10 relative flex items-center justify-center">
        <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl">
          <div className="text-center space-y-4">
            <User className="w-12 h-12 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800">Profile Not Found</h2>
            <p className="text-muted-foreground">
              We couldn&apos;t find your profile information. Please contact support for assistance.
            </p>
            <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              Contact Support
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (

    <main
      className="min-h-screen relative sm:pb-12 pb-40 bg-black"
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
        <div className="pl-2 sm:pl-0 sm:container sm:max-none  max-w-7xl mx-auto  lg:px-8 md:px-8 sm:px-6 pt-4 ">
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div
                className="p-3 sm:p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                style={{
                  WebkitBackdropFilter: 'blur(12px)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <h1 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Hi there, {displayName || profile.first_name || 'User'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Welcome to your resume dashboard
                </p>
              </div>

              {/* Share Management Button */}
              <Link
                href="/resumes/share"
                className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all group"
                style={{
                  WebkitBackdropFilter: 'blur(12px)',
                  backdropFilter: 'blur(12px)',
                }}
                title="Share Resumes"
              >
                <Share2 className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="hidden sm:inline text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                  Share Resumes
                </span>
              </Link>
            </div>

            {/* Resume Bookshelf */}
            <div className="">


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

              {/* Thin Divider */}
              <div className="relative py-2">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
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
      </div>
    </main>
  );
}
