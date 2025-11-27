'use client';

import { Profile, Resume } from "@/lib/types";
import { CreateBaseResumeDialog } from "./create-base-resume-dialog";
import { CreateTailoredResumeDialog } from "./create-tailored-resume-dialog";

interface CreateResumeDialogProps {
  children: React.ReactNode;
  type: 'base' | 'tailored';
  baseResumes?: Resume[];
  profile: Profile;
  totalResumesCount?: number;
}

export function CreateResumeDialog({ children, type, baseResumes, profile, totalResumesCount }: CreateResumeDialogProps) {
  if (type === 'base') {
    return <CreateBaseResumeDialog profile={profile} totalResumesCount={totalResumesCount}>{children}</CreateBaseResumeDialog>;
  }

  return (
    <CreateTailoredResumeDialog baseResumes={baseResumes} profile={profile} totalResumesCount={totalResumesCount}>
      {children}
    </CreateTailoredResumeDialog>
  );
} 