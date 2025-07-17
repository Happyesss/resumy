'use client';

import { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MinimalCleanTemplateProps {
  resume: Resume;
  className?: string;
}

export function MinimalCleanTemplate({ resume, className }: MinimalCleanTemplateProps) {
  return (
    <div className={cn("w-full max-w-[8.5in] mx-auto bg-white text-gray-900 p-8 font-sans", className)}>
      {/* Header Section */}
      <div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            {resume.first_name} {resume.last_name}
          </h1>
          {resume.target_role && (
            <p className="text-base text-gray-600 mb-4 font-medium">
              {resume.target_role}
            </p>
          )}
          {/* Contact Info in Simple Line */}
          <div className="flex justify-center items-center flex-wrap gap-3 text-sm text-gray-600">
            {resume.email && (
              <span>{resume.email}</span>
            )}
            {resume.phone_number && (
              <>
                {resume.email && <span>•</span>}
                <span>{resume.phone_number}</span>
              </>
            )}
            {resume.location && (
              <>
                {(resume.email || resume.phone_number) && <span>•</span>}
                <span>{resume.location}</span>
              </>
            )}
            {resume.linkedin_url && (
              <>
                {(resume.email || resume.phone_number || resume.location) && <span>•</span>}
                <span>{resume.linkedin_url.replace('https://', '').replace('http://', '')}</span>
              </>
            )}
            {resume.github_url && (
              <>
                {(resume.email || resume.phone_number || resume.location || resume.linkedin_url) && <span>•</span>}
                <span>{resume.github_url.replace('https://', '').replace('http://', '')}</span>
              </>
            )}
            {resume.website && (
              <>
                {(resume.email || resume.phone_number || resume.location || resume.linkedin_url || resume.github_url) && <span>•</span>}
                <span>{resume.website.replace('https://', '').replace('http://', '')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">Professional Experience</h2>
          <div className="space-y-6">
            {resume.work_experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-base text-gray-700">
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className="text-sm text-gray-600">{exp.location}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm text-gray-600 font-medium">
                      {exp.date}
                    </span>
                  </div>
                </div>
                
                {exp.description && exp.description.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {exp.description.map((desc, descIndex) => (
                      <li key={descIndex} className="flex items-start text-sm text-gray-700 leading-relaxed">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{desc.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Technologies:</span> {exp.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">Projects</h2>
          <div className="space-y-5">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {project.name}
                    </h3>
                    {project.url && (
                      <a
                        href={project.url}
                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.url.replace('https://', '').replace('http://', '')}
                      </a>
                    )}
                  </div>
                  {project.date && (
                    <span className="text-sm text-gray-600 font-medium flex-shrink-0">
                      {project.date}
                    </span>
                  )}
                </div>
                
                {project.description && project.description.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {project.description.map((desc, descIndex) => (
                      <li key={descIndex} className="flex items-start text-sm text-gray-700 leading-relaxed">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{desc.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {edu.school}
                    </h3>
                    <p className="text-base text-gray-700">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                    {edu.location && (
                      <p className="text-sm text-gray-600">{edu.location}</p>
                    )}
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm text-gray-600 font-medium">
                      {edu.date}
                    </span>
                  </div>
                </div>
                
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {edu.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start text-sm text-gray-700 leading-relaxed">
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{achievement.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">Skills</h2>
          <div className="space-y-3">
            {resume.skills.map((skillCategory, index) => (
              <div key={index}>
                <div className="flex flex-wrap items-baseline">
                  <span className="text-sm font-semibold text-gray-900 mr-2">
                    {skillCategory.category}:
                  </span>
                  <span className="text-sm text-gray-700">
                    {skillCategory.items.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
