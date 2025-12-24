'use client';

import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Job, Profile, Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Suspense, useRef, useState } from "react";
import ChatBot from "../../assistant/chatbot";
import { TailoredJobAccordion } from "../../management/cards/tailored-job-card";
import { ResumeEditorActions } from "../actions/resume-editor-actions";
import {
    EducationForm, ProjectsForm, SkillsForm, SummaryForm, WorkExperienceForm
} from '../dynamic-components';
import { BasicInfoForm } from "../forms/basic-info-form";
import { ResumeEditorTabs } from "../header/resume-editor-tabs";
import { ColdMailPanel } from "./cold-mail-panel";
import { CoverLetterPanel } from "./cover-letter-panel";
import ResumeScorePanel from "./resume-score-panel";
import { TemplatesPanel } from "./templates-panel";

// Loading skeleton component for consistent loading states
const FormSkeleton = () => (
  <div className="space-y-4 animate-pulse p-4">
    <div className="h-5 bg-zinc-800 rounded-lg w-1/4" />
    <div className="space-y-3">
      <div className="h-12 bg-zinc-800/80 rounded-xl" />
      <div className="h-12 bg-zinc-800/80 rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-zinc-800/80 rounded-xl" />
        <div className="h-12 bg-zinc-800/80 rounded-xl" />
      </div>
    </div>
  </div>
);

interface EditorPanelProps {
  resume: Resume;
  profile: Profile;
  job: Job | null;
  isLoadingJob: boolean;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
}

export function EditorPanel({
  resume,
  profile,
  job,
  isLoadingJob,
  onResumeChange,
}: EditorPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="flex flex-col mr-1 sm:mr-2 lg:mr-3 relative h-full max-h-full @container overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="relative pb-16 lg:pb-20">
            {/* Sticky header with actions */}
            <div className={cn(
              "sticky top-0 z-20",
              "bg-zinc-950/95 backdrop-blur-xl",
              "border-b border-zinc-800/50"
            )}>
              <ResumeEditorActions
                onResumeChange={onResumeChange}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* Content container with padding */}
            <div className="px-1 sm:px-1.5 lg:px-2 py-1.5 sm:py-2 lg:py-3 space-y-2 sm:space-y-2.5 lg:space-y-3">
              {/* Tailored Job Accordion */}
              <Accordion type="single" collapsible defaultValue="basic">
                <TailoredJobAccordion
                  resume={resume}
                  job={job}
                  isLoading={isLoadingJob}
                />
              </Accordion>

              {/* Tabs container */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <ResumeEditorTabs />

                {/* Tab content with smooth transitions */}
                <div className="mt-4">
                  {/* Basic Info Form */}
                  <TabsContent value="basic" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <BasicInfoForm profile={profile} />
                  </TabsContent>

                  {/* Summary Form */}
                  <TabsContent value="summary" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <Suspense fallback={<FormSkeleton />}>
                      <SummaryForm
                        summary={resume.professional_summary || ''}
                        onChange={(value: string) => onResumeChange('professional_summary', value)}
                        userEmail={profile.email}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Work Experience Form */}
                  <TabsContent value="work" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <Suspense fallback={<FormSkeleton />}>
                      <WorkExperienceForm
                        experiences={resume.work_experience}
                        onChange={(experiences) => onResumeChange('work_experience', experiences)}
                        profile={profile}
                        targetRole={resume.target_role}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Projects Form */}
                  <TabsContent value="projects" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <Suspense fallback={<FormSkeleton />}>
                      <ProjectsForm
                        projects={resume.projects}
                        onChange={(projects) => onResumeChange('projects', projects)}
                        profile={profile}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Education Form */}
                  <TabsContent value="education" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <Suspense fallback={<FormSkeleton />}>
                      <EducationForm
                        education={resume.education}
                        onChange={(education) => onResumeChange('education', education)}
                        profile={profile}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Skills Form */}
                  <TabsContent value="skills" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <Suspense fallback={<FormSkeleton />}>
                      <SkillsForm
                        skills={resume.skills}
                        onChange={(skills) => onResumeChange('skills', skills)}
                        profile={profile}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Cold Mail Form */}
                  <TabsContent value="cold-mail" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <ColdMailPanel
                      resume={resume}
                      job={job}
                      userEmail={profile.email}
                    />
                  </TabsContent>

                  {/* Templates Panel */}
                  <TabsContent value="templates" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <TemplatesPanel
                      resume={resume}
                      onTemplateSelect={(templateId) => {
                        onResumeChange('template', templateId as Resume['template']);
                      }}
                    />
                  </TabsContent>

                  {/* Cover Letter Panel */}
                  <TabsContent value="cover-letter" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <CoverLetterPanel
                      resume={resume}
                      job={job}
                      userEmail={profile.email}
                    />
                  </TabsContent>

                  {/* Resume Score Panel */}
                  <TabsContent value="resume-score" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                    <ResumeScorePanel
                      resume={resume}
                      userEmail={profile.email}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Fixed chatbot at bottom - removed wrapper, chatbot renders its own floating button */}
      <ChatBot 
        resume={resume} 
        onResumeChange={onResumeChange}
        job={job}
      />
    </div>
  );
} 