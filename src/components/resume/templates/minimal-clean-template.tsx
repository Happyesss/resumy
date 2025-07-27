'use client';

import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { memo } from 'react';

interface MinimalCleanTemplateProps {
  resume: Resume;
  className?: string;
}

export const MinimalCleanTemplate = memo(function MinimalCleanTemplate({ 
  resume, 
  className 
}: MinimalCleanTemplateProps) {

  const renderContactInfo = () => {
    const contactItems = [
      resume.email,
      resume.phone_number,
      resume.location,
      resume.linkedin_url?.replace('https://', '').replace('http://', ''),
      resume.github_url?.replace('https://', '').replace('http://', ''),
    ].filter(Boolean);

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="text-sm text-black">{item}</span>
            {index < contactItems.length - 1 && (
              <span className="text-black mx-3">•</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-base font-bold text-black mb-4 uppercase tracking-widest">
          Experience
        </h2>
        {resume.work_experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-4">
                <h3 className="text-base font-bold text-black">{exp.position}</h3>
                <p className="text-sm text-black italic">{exp.company}</p>
                {exp.location && (
                  <p className="text-sm text-gray-600">{exp.location}</p>
                )}
              </div>
              <div className="text-right min-w-[80px]">
                <p className="text-sm text-black font-bold">{exp.date}</p>
              </div>
            </div>
            {exp.description && exp.description.length > 0 && (
              <ul className="mt-3 space-y-1">
                {exp.description.map((desc, descIndex) => (
                  <li key={descIndex} className="flex items-start gap-3">
                    <span className="text-sm text-black mt-0.5 w-2">•</span>
                    <span className="text-sm text-black leading-relaxed flex-1">
                      {desc.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-base font-bold text-black mb-4 uppercase tracking-widest">
          Projects
        </h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-base font-bold text-black">{project.name}</h3>
                  {project.url && (
                    <span className="text-sm text-black underline">
                      {project.url.replace('https://', '').replace('http://', '')}
                    </span>
                  )}
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 italic mb-1">
                    {project.technologies.join(' • ')}
                  </p>
                )}
              </div>
              <div className="text-right min-w-[80px]">
                {project.date && (
                  <p className="text-sm text-black font-bold">{project.date}</p>
                )}
              </div>
            </div>
            {project.description && project.description.length > 0 && (
              <ul className="mt-3 space-y-1">
                {project.description.map((desc, descIndex) => (
                  <li key={descIndex} className="flex items-start gap-3">
                    <span className="text-sm text-black mt-0.5 w-2">•</span>
                    <span className="text-sm text-black leading-relaxed flex-1">
                      {desc.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-base font-bold text-black mb-4 uppercase tracking-widest">
          Education
        </h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-4">
                <h3 className="text-base font-bold text-black">{edu.school}</h3>
                <p className="text-sm text-black italic">
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </p>
                {edu.location && (
                  <p className="text-sm text-gray-600">{edu.location}</p>
                )}
                {edu.gpa && (
                  <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
              <div className="text-right min-w-[80px]">
                <p className="text-sm text-black font-bold">{edu.date}</p>
              </div>
            </div>
            {edu.achievements && edu.achievements.length > 0 && (
              <ul className="mt-3 space-y-1">
                {edu.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="flex items-start gap-3">
                    <span className="text-sm text-black mt-0.5 w-2">•</span>
                    <span className="text-sm text-black leading-relaxed flex-1">
                      {achievement.replace(/^[-•*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-base font-bold text-black mb-4 uppercase tracking-widest">
          Skills
        </h2>
        <div className="space-y-2">
          {resume.skills.map((skillCategory, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="text-sm font-bold text-black w-20 flex-shrink-0">
                {skillCategory.category}:
              </div>
              <div className="text-sm text-black flex-1 leading-relaxed">
                {skillCategory.items.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("max-w-4xl mx-auto bg-white p-8", className)}>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-black">
        <h1 className="text-4xl font-bold text-black mb-3 tracking-widest">
          {resume.first_name} {resume.last_name}
        </h1>
        {renderContactInfo()}
      </div>

      {/* Experience */}
      {renderExperience()}

      {/* Projects */}
      {renderProjects()}

      {/* Education */}
      {renderEducation()}

      {/* Skills */}
      {renderSkills()}
    </div>
  );
});
