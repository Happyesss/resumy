import { redirect } from "next/navigation";
import { getResumeById } from "@/utils/actions/resumes/actions";
import { ResumeEditorClient } from "@/components/resume/editor/resume-editor-client";
import { Metadata } from "next";
import { Resume } from "@/lib/types";

// Helper function to normalize resume data
function normalizeResumeData(resume: Resume): Resume {
  return {
    ...resume,
    // Normalize work experience dates and ensure it exists
    work_experience: resume.work_experience?.map(exp => ({
      ...exp,
      date: exp.date || '',
      description: exp.description || [] // Ensure description array exists
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
  const { id } = await params;
  const result = await getResumeById(id);
  
  if (!result) {
    return {
      title: 'Resume Editor | Resumy',
      description: 'AI-powered resume editor',
    };
  }
  
  return {
    title: `${result.resume.name} | Resumy`,
    description: `Editing ${result.resume.name} - ${result.resume.target_role} resume`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResumeById(id);
  
  if (!result) {
    redirect("/");
  }
  
  const { resume: rawResume, profile } = result;
  const normalizedResume = normalizeResumeData(rawResume);
  
  return (
    <div 
      className="h-full flex flex-col "
      data-page-title={normalizedResume.name}
      data-resume-type={normalizedResume.is_base_resume ? "Base Resume" : "Tailored Resume"}
    >
      <ResumeEditorClient initialResume={normalizedResume} profile={profile} />
    </div>
  );
} 