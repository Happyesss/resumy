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
    <div className="flex flex-col sm:mr-4 relative h-full max-h-full  ">
      <div className="flex-1 flex flex-col overflow-scroll">
        <ScrollArea className="flex-1 sm:pr-2" ref={scrollAreaRef}>
          <div className="relative pb-12">
            <div className={cn(
              "sticky top-0 z-20 backdrop-blur-sm",
              resume.is_base_resume
                ? "bg-purple-50/80"
                : "bg-pink-100/90 shadow-sm shadow-pink-200/50"
            )}>
              <div className="flex flex-col gap-4">
                <ResumeEditorActions
                  onResumeChange={onResumeChange}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>


            {/* Tailored Job Accordion */}
            <Accordion type="single" collapsible defaultValue="basic" className="mt-6">
              <TailoredJobAccordion
                resume={resume}
                job={job}
                isLoading={isLoadingJob}
              />
            </Accordion>

            {/* Tabs */}  
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
              <ResumeEditorTabs />

              {/* Basic Info Form */}
              <TabsContent value="basic">
                <BasicInfoForm
                  profile={profile}
                />
              </TabsContent>

              {/* Summary Form */}
              <TabsContent value="summary">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <SummaryForm
                    summary={resume.professional_summary || ''}
                    onChange={(value: string) => onResumeChange('professional_summary', value)}
                    userEmail={profile.email}
                  />
                </Suspense>
              </TabsContent>

              {/* Work Experience Form */}
              <TabsContent value="work">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <WorkExperienceForm
                    experiences={resume.work_experience}
                    onChange={(experiences) => onResumeChange('work_experience', experiences)}
                    profile={profile}
                    targetRole={resume.target_role}
                  />
                </Suspense>
              </TabsContent>

              {/* Projects Form */}
              <TabsContent value="projects">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <ProjectsForm
                    projects={resume.projects}
                    onChange={(projects) => onResumeChange('projects', projects)}
                    profile={profile}
                  />
                </Suspense>
              </TabsContent>

              {/* Education Form */}
              <TabsContent value="education">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <EducationForm
                    education={resume.education}
                    onChange={(education) => onResumeChange('education', education)}
                    profile={profile}
                  />
                </Suspense>
              </TabsContent>

              {/* Skills Form */}
              <TabsContent value="skills">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <SkillsForm
                    skills={resume.skills}
                    onChange={(skills) => onResumeChange('skills', skills)}
                    profile={profile}
                  />
                </Suspense>
              </TabsContent>

              {/* Cold Mail Form */}
              <TabsContent value="cold-mail">
                <ColdMailPanel
                  resume={resume}
                  job={job}
                  userEmail={profile.email}
                />
              </TabsContent>

              {/* Templates Form */}
              <TabsContent value="templates">
                <TemplatesPanel
                  resume={resume}
                  onTemplateSelect={(templateId) => {
                    // Handle template selection logic here
                    console.log('Selected template:', templateId);
                    // Update the resume template field
                    onResumeChange('template', templateId as Resume['template']);
                  }}
                />
              </TabsContent>

              {/* Document Settings removed */}

              {/* Cover Letter Form */}
              <TabsContent value="cover-letter">
                <CoverLetterPanel
                  resume={resume}
                  job={job}
                  userEmail={profile.email}
                />
              </TabsContent>


              {/* Resume Score Form */}
              <TabsContent value="resume-score">
                <ResumeScorePanel
                  resume={resume}
                  userEmail={profile.email}
                  // job={job}
                />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      <div className={cn(
        "absolute w-full bottom-0 rounded-lg border`", 
        resume.is_base_resume
          ? "bg-purple-50/50 border-purple-200/40"
          : "bg-pink-50/80 border-pink-300/50 shadow-sm shadow-pink-200/20"
      )}>
        <ChatBot 
          resume={resume} 
          onResumeChange={onResumeChange}
          job={job}
        />
      </div>
    </div>
  );
} 