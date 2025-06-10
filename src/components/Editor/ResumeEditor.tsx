import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
  const [sectionOrder, setSectionOrder] = React.useState(defaultSectionOrder);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSectionOrder(items);
  };

  const renderSection = (sectionId: string, index: number) => {
    const SectionComponent = sectionComponents[sectionId as keyof typeof sectionComponents];
    
    if (!SectionComponent) return null;

    return (
      <Draggable key={sectionId} draggableId={sectionId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-6 transition-shadow duration-200 ${
              snapshot.isDragging ? 'shadow-lg' : ''
            }`}
          >
            <SectionComponent
              data={resumeData}
              onUpdate={onUpdateResume}
              isDragging={snapshot.isDragging}
            />
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Build Your Resume</h1>
        <p className="text-gray-600">Fill in your information and drag sections to reorder them</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="resume-sections">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-blue-50' : ''
              }`}
            >
              {sectionOrder.map((sectionId, index) => renderSection(sectionId, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};