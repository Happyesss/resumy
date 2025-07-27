'use client';

import { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ModernProfessionalTemplateProps {
  resume: Resume;
  className?: string;
}

export function ModernProfessionalTemplate({ resume, className }: ModernProfessionalTemplateProps) {
  return (
    <div className={cn("w-full max-w-[8.5in] mx-auto bg-white text-gray-900 p-8 font-sans", className)}>
      {/* Header Section */}
      <div className="mb-6">
        <div className="text-left border-l-4 border-blue-600 pl-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            {resume.first_name} {resume.last_name}
          </h1>
          
          {/* Contact Info in Modern Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm text-gray-600">
            {resume.email && (
              <div className="flex items-center">
                <span className="font-medium">Email:</span>
                <span className="ml-2">{resume.email}</span>
              </div>
            )}
            {resume.phone_number && (
              <div className="flex items-center">
                <span className="font-medium">Phone:</span>
                <span className="ml-2">{resume.phone_number}</span>
              </div>
            )}
            {resume.location && (
              <div className="flex items-center">
                <span className="font-medium">Location:</span>
                <span className="ml-2">{resume.location}</span>
              </div>
            )}
            {resume.linkedin_url && (
              <div className="flex items-center">
                <span className="font-medium">LinkedIn:</span>
                <span className="ml-2 text-blue-600">{resume.linkedin_url.replace('https://', '').replace('http://', '')}</span>
              </div>
            )}
            {resume.github_url && (
              <div className="flex items-center">
                <span className="font-medium">GitHub:</span>
                <span className="ml-2 text-blue-600">{resume.github_url.replace('https://', '').replace('http://', '')}</span>
              </div>
            )}
            {resume.website && (
              <div className="flex items-center">
                <span className="font-medium">Website:</span>
                <span className="ml-2 text-blue-600">{resume.website.replace('https://', '').replace('http://', '')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-blue-600 pb-2">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resume.work_experience.map((exp, index) => (
              <div key={index} className="relative pl-4 border-l-2 border-gray-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {exp.position}
                    </h3>
                    <p className="text-base font-medium text-blue-600 mb-1">
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className="text-sm text-gray-600">{exp.location}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 bg-gray-50 px-3 py-1 rounded-md">
                    <span className="text-sm text-gray-700 font-medium">
                      {exp.date}
                    </span>
                  </div>
                </div>
                
                {exp.description && exp.description.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {exp.description.map((desc, descIndex) => (
                      <li key={descIndex} className="flex items-start text-sm text-gray-700 leading-relaxed">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{desc.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )}
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-blue-600 pb-2">
            Key Projects
          </h2>
          <div className="space-y-5">
            {resume.projects.map((project, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
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
                    <span className="text-sm text-gray-600 font-medium bg-white px-2 py-1 rounded flex-shrink-0">
                      {project.date}
                    </span>
                  )}
                </div>
                
                {project.description && project.description.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {project.description.map((desc, descIndex) => (
                      <li key={descIndex} className="flex items-start text-sm text-gray-700 leading-relaxed">
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>{desc.replace(/^[-•*]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-900">Technologies:</span>
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                        {tech}
                      </span>
                    ))}
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
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-blue-600 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {edu.school}
                  </h3>
                  <p className="text-base font-medium text-blue-600 mb-1">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                  {edu.location && (
                    <p className="text-sm text-gray-600 mb-1">{edu.location}</p>
                  )}
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 font-medium">GPA: {edu.gpa}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 bg-white px-3 py-1 rounded-md">
                  <span className="text-sm text-gray-700 font-medium">
                    {edu.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-blue-600 pb-2">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resume.skills.map((skillCategory, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-base font-semibold text-blue-600 mb-3">
                  {skillCategory.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillCategory.items.map((skill, skillIndex) => (
                    <span key={skillIndex} className="text-sm bg-white text-gray-700 px-3 py-1 rounded-md border border-gray-200 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
