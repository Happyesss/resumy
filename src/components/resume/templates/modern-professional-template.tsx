'use client';

import { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ModernProfessionalTemplateProps {
  resume: Resume;
  className?: string;
}

export function ModernProfessionalTemplate({ resume, className }: ModernProfessionalTemplateProps) {
  return (
    <div className={cn(
      "w-full max-w-[8.5in] mx-auto bg-white text-gray-900 p-8 font-sans text-sm leading-relaxed",
      className
    )}>
      {/* Header Section */}
      <div className="border-b-2 border-blue-600 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-wide">
              {resume.first_name} <span className="font-semibold text-blue-600">{resume.last_name}</span>
            </h1>
            {resume.target_role && (
              <p className="text-lg text-gray-600 font-medium mb-4">
                {resume.target_role}
              </p>
            )}
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          {resume.email && (
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">Email</span>
              <span className="text-gray-900 font-medium">{resume.email}</span>
            </div>
          )}
          {resume.phone_number && (
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">Phone</span>
              <span className="text-gray-900 font-medium">{resume.phone_number}</span>
            </div>
          )}
          {resume.location && (
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">Location</span>
              <span className="text-gray-900 font-medium">{resume.location}</span>
            </div>
          )}
          {(resume.linkedin_url || resume.github_url) && (
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">Links</span>
              <div className="space-y-1">
                {resume.linkedin_url && (
                  <div className="text-blue-600 text-sm">
                    {resume.linkedin_url.replace('https://', '').replace('http://', '')}
                  </div>
                )}
                {resume.github_url && (
                  <div className="text-blue-600 text-sm">
                    {resume.github_url.replace('https://', '').replace('http://', '')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Experience Section */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            Professional Experience
          </h2>
          {resume.work_experience.map((exp, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <div className="text-blue-600 font-medium text-base">{exp.company}</div>
                  {exp.location && (
                    <div className="text-gray-500 text-sm">{exp.location}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {exp.date}
                  </div>
                </div>
              </div>
              {exp.description && exp.description.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {exp.description.map((desc, descIndex) => (
                    <li key={descIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">
                        {desc.replace(/^[-•*]\s*/, '')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            Education
          </h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
                  <div className="text-blue-600 font-medium">
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </div>
                  {edu.location && (
                    <div className="text-gray-500 text-sm">{edu.location}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {edu.date}
                  </div>
                  {edu.gpa && (
                    <div className="text-gray-600 text-sm mt-1">GPA: {edu.gpa}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            Key Projects
          </h2>
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.url && (
                    <div className="text-blue-600 text-sm mt-1">
                      <a href={project.url} className="hover:underline">
                        {project.url.replace('https://', '').replace('http://', '')}
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {project.date && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {project.date}
                    </div>
                  )}
                </div>
              </div>
              {project.description && project.description.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {project.description.map((desc, descIndex) => (
                    <li key={descIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">
                        {desc.replace(/^[-•*]\s*/, '')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills Section */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resume.skills.map((skillCategory, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">{skillCategory.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillCategory.items.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="bg-white border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leadership / Extracurricular Section */}
      {resume.education && resume.education.some(edu => edu.achievements && edu.achievements.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <div className="w-1 h-6 bg-blue-600 mr-3"></div>
            Leadership & Activities
          </h2>
          {resume.education.map((edu, index) => (
            edu.achievements && edu.achievements.length > 0 && (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Leadership Activities</h3>
                    <div className="text-blue-600 font-medium">{edu.school}</div>
                  </div>
                  <div className="text-right">
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {edu.date}
                    </div>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  {edu.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">
                        {achievement.replace(/^[-•*]\s*/, '')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
