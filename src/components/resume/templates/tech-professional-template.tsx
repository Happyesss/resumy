'use client';

import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { memo } from 'react';

interface TechProfessionalTemplateProps {
  resume: Resume;
  className?: string;
}

export const TechProfessionalTemplate = memo(function TechProfessionalTemplate({ 
  resume, 
  className 
}: TechProfessionalTemplateProps) {

  const renderContactInfo = () => {
    const contactItems = [
      { label: 'Email', value: resume.email },
      { label: 'Phone', value: resume.phone_number },
      { label: 'Location', value: resume.location },
    ].filter(item => item.value);

    const links = [
      resume.linkedin_url?.replace('https://', '').replace('http://', ''),
      resume.github_url?.replace('https://', '').replace('http://', ''),
    ].filter(Boolean);

    if (links.length > 0) {
      contactItems.push({ label: 'Links', value: links.join(' • ') });
    }

    return (
      <div className="flex flex-wrap gap-4">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <span className={`text-sm ${item.label === 'Links' ? 'text-sky-400' : 'text-slate-200'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderTechnicalSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-3 pl-3 border-l-4 border-sky-500">
          Technical Skills
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {resume.skills.map((skillCategory, index) => (
            <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {skillCategory.category}
              </h3>
              <div className="flex flex-wrap gap-1">
                {skillCategory.items.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex} 
                    className="bg-sky-500 text-white text-xs px-2 py-1 rounded-md font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-3 pl-3 border-l-4 border-sky-500">
          Professional Experience
        </h2>
        {resume.work_experience.map((exp, index) => (
          <div key={index} className="mb-4 pl-1">
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1 pr-3">
                <h3 className="text-sm font-bold text-slate-900">{exp.position}</h3>
                <p className="text-sm text-sky-500 font-bold">{exp.company}</p>
                {exp.location && (
                  <p className="text-xs text-slate-600">{exp.location}</p>
                )}
              </div>
              <div className="text-right">
                <span className="bg-sky-50 text-sky-700 text-xs px-2 py-1 rounded font-bold">
                  {exp.date}
                </span>
              </div>
            </div>
            {exp.description && exp.description.length > 0 && (
              <ul className="mt-2 space-y-1">
                {exp.description.map((desc, descIndex) => (
                  <li key={descIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
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
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-3 pl-3 border-l-4 border-sky-500">
          Key Projects
        </h2>
        {resume.projects.map((project, index) => (
          <div key={index} className="mb-4 pl-1">
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1 pr-3">
                <h3 className="text-sm font-bold text-slate-900">{project.name}</h3>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className="bg-slate-100 border border-slate-300 text-slate-900 text-xs px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.url && (
                  <p className="text-xs text-sky-500 mt-1">
                    {project.url.replace('https://', '').replace('http://', '')}
                  </p>
                )}
              </div>
              <div className="text-right">
                {project.date && (
                  <span className="bg-sky-50 text-sky-700 text-xs px-2 py-1 rounded font-bold">
                    {project.date}
                  </span>
                )}
              </div>
            </div>
            {project.description && project.description.length > 0 && (
              <ul className="mt-2 space-y-1">
                {project.description.map((desc, descIndex) => (
                  <li key={descIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
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
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-3 pl-3 border-l-4 border-sky-500">
          Education
        </h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-3 pl-1">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-3">
                <h3 className="text-sm font-bold text-slate-900">{edu.school}</h3>
                <p className="text-sm text-sky-500 font-bold">
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </p>
                {edu.location && (
                  <p className="text-xs text-slate-600">{edu.location}</p>
                )}
              </div>
              <div className="text-right">
                <span className="bg-sky-50 text-sky-700 text-xs px-2 py-1 rounded font-bold">
                  {edu.date}
                </span>
                {edu.gpa && (
                  <p className="text-xs text-slate-600 mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            </div>
            {edu.achievements && edu.achievements.length > 0 && (
              <ul className="mt-2 space-y-1">
                {edu.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
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
    <div className={cn("max-w-4xl mx-auto bg-white", className)}>
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 -mx-6 -mt-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
          {resume.first_name} {resume.last_name}
        </h1>
        {resume.target_role && (
          <p className="text-lg text-slate-400 font-bold mb-4">{resume.target_role}</p>
        )}
        {renderContactInfo()}
      </div>

      {/* Technical Skills */}
      {renderTechnicalSkills()}

      {/* Experience */}
      {renderExperience()}

      {/* Projects */}
      {renderProjects()}

      {/* Education */}
      {renderEducation()}
    </div>
  );
});
