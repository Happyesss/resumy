import React from 'react';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { SummarySection } from './sections/SummarySection';
import { WorkExperienceSection } from './sections/WorkExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { ResumeData } from '../../types/resume';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onUpdateResume: (data: Partial<ResumeData>) => void;
}

const sectionComponents = {
  personalInfo: PersonalInfoSection,
  summary: SummarySection,
  workExperience: WorkExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
};

const defaultSectionOrder = [
  'personalInfo',
  'summary', 
  'workExperience',
  'education',
  'skills',
  'projects',
  'certifications'
];

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resumeData,
  onUpdateResume
}) => {

  const renderSection = (sectionId: string) => {
    const SectionComponent = sectionComponents[sectionId as keyof typeof sectionComponents];
    
    if (!SectionComponent) return null;

    return (
      <div key={sectionId} className="mb-6">
        <SectionComponent
          data={resumeData}
          onUpdate={onUpdateResume}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Build Your Resume</h1>
        <p className="text-gray-600">Fill in your information below</p>
      </div>
      <div>
        {defaultSectionOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  );
};