'use client';

import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { memo } from 'react';

interface CreativeModernTemplateProps {
  resume: Resume;
  className?: string;
}

export const CreativeModernTemplate = memo(function CreativeModernTemplate({ 
  resume, 
  className 
}: CreativeModernTemplateProps) {

  const renderContactInfo = () => {
    const contactItems = [
      { label: 'Email', value: resume.email },
      { label: 'Phone', value: resume.phone_number },
      { label: 'Location', value: resume.location },
      { label: 'LinkedIn', value: resume.linkedin_url?.replace('https://', '').replace('http://', '') },
      { label: 'GitHub', value: resume.github_url?.replace('https://', '').replace('http://', '') },
    ].filter(item => item.value);

    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">
          Contact
        </h3>
        {contactItems.map((item, index) => (
          <div key={index} className="mb-2">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
              {item.label}
            </p>
            <p className={`text-sm font-bold ${item.label === 'LinkedIn' || item.label === 'GitHub' ? 'text-blue-300' : 'text-white'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderSkillsSection = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">
          Skills
        </h3>
        {resume.skills.map((skillCategory, index) => (
          <div key={index} className="mb-4">
            <h4 className="text-sm font-bold text-slate-200 mb-2">
              {skillCategory.category}
            </h4>
            {skillCategory.items.map((skill, skillIndex) => (
              <p key={skillIndex} className="text-sm text-slate-300 mb-1 pl-2">
                • {skill}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-red-500">
          Professional Experience
        </h2>
        {resume.work_experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-bold text-slate-800">{exp.position}</h3>
                <p className="text-base text-red-500 font-bold">{exp.company}</p>
                {exp.location && (
                  <p className="text-sm text-slate-600">{exp.location}</p>
                )}
              </div>
              <div className="text-right">
                <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-bold">
                  {exp.date}
                </span>
              </div>
            </div>
            {exp.description && exp.description.length > 0 && (
              <ul className="mt-3 space-y-2">
                {exp.description.map((desc, descIndex) => (
                  <li key={descIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-sm mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 leading-relaxed">
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
        <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-red-500">
          Key Projects
        </h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className="bg-slate-100 border border-slate-300 text-slate-800 text-xs px-2 py-1 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.url && (
                  <p className="text-sm text-red-500 mt-2">
                    {project.url.replace('https://', '').replace('http://', '')}
                  </p>
                )}
              </div>
              <div className="text-right">
                {project.date && (
                  <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-bold">
                    {project.date}
                  </span>
                )}
              </div>
            </div>
            {project.description && project.description.length > 0 && (
              <ul className="mt-3 space-y-2">
                {project.description.map((desc, descIndex) => (
                  <li key={descIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-sm mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 leading-relaxed">
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
        <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-red-500">
          Education
        </h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-bold text-slate-800">{edu.school}</h3>
                <p className="text-base text-red-500 font-bold">
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </p>
                {edu.location && (
                  <p className="text-sm text-slate-600">{edu.location}</p>
                )}
              </div>
              <div className="text-right">
                <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-bold">
                  {edu.date}
                </span>
                {edu.gpa && (
                  <p className="text-sm text-slate-600 mt-2">GPA: {edu.gpa}</p>
                )}
              </div>
            </div>
            {edu.achievements && edu.achievements.length > 0 && (
              <ul className="mt-3 space-y-2">
                {edu.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-sm mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-slate-700 leading-relaxed">
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

  return (
    <div className={cn("max-w-6xl mx-auto bg-white flex", className)}>
      {/* Sidebar */}
      <div className="w-2/5 bg-slate-600 text-white p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            {resume.first_name}
          </h1>
          <h1 className="text-2xl font-bold text-white mb-3">
            {resume.last_name}
          </h1>
          {resume.target_role && (
            <p className="text-sm text-slate-300 font-bold">{resume.target_role}</p>
          )}
        </div>

        {renderContactInfo()}
        {renderSkillsSection()}
      </div>

      {/* Main Content */}
      <div className="w-3/5 p-8">
        {renderExperience()}
        {renderProjects()}
        {renderEducation()}
      </div>
    </div>
  );
});
