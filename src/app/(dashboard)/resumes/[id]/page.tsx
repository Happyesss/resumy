import { redirect } from "next/navigation";
import { getResumeById } from "@/utils/actions/resumes/actions";
import { ResumeEditorClient } from "@/components/resume/editor/resume-editor-client";
import { Metadata } from "next";
import { Resume } from "@/lib/types";

// Helper function to normalize resume data
function normalizeResumeData(resume: Resume): Resume {
  return {
    ...resume,
    // Normalize work experience dates
    work_experience: resume.work_experience?.map(exp => ({
      ...exp,
      date: exp.date || ''
    })) || [],
    // Normalize education dates
    education: resume.education?.map(edu => ({
      ...edu,
      date: edu.date || ''
    })) || [],
    // Normalize project dates
    projects: resume.projects?.map(project => ({
      ...project,
      date: project.date || ''
    })) || []
    // Document settings removed
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const { resume } = await getResumeById(id);
    return {
      title: `${resume.name} | ResumeLM`,
      description: `Editing ${resume.name} - ${resume.target_role} resume`,
    };
  } catch (error) {
    void error;
    return {
      title: 'Resume Editor | ResumeLM',
      description: 'AI-powered resume editor',
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  
  try {
    const { id } = await params;
    const { resume: rawResume, profile } = await getResumeById(id);
    const normalizedResume = normalizeResumeData(rawResume);
    const component = (
      <div 
        className="h-full flex flex-col "
        data-page-title={normalizedResume.name}
        data-resume-type={normalizedResume.is_base_resume ? "Base Resume" : "Tailored Resume"}
      >
        <ResumeEditorClient initialResume={normalizedResume} profile={profile} />
      </div>
    );
  
    
    return component;
  } catch (error) {
    console.timeEnd('🔍 [Page] Total Load Time');
    console.error('❌ [Error]:', error);
    if (error instanceof Error && error.message === 'User not authenticated') {
      redirect("/");
    }
    redirect("/");
  }
} 