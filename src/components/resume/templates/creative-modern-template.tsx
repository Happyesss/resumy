'use client';

import { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CreativeModernTemplateProps {
  resume: Resume;
  className?: string;
}

export function CreativeModernTemplate({ resume, className }: CreativeModernTemplateProps) {
  return (
    <div className={cn("w-full max-w-[8.5in] mx-auto bg-white text-gray-900 font-sans", className)}>
      {/* Main Content Layout */}
      <div className="flex min-h-[11in]">
        {/* Left Sidebar */}
        <div className="w-[35%] bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 text-white p-8 flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <span className="text-2xl font-bold text-white">
                {resume.first_name?.[0]}{resume.last_name?.[0]}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              {resume.first_name} {resume.last_name}
            </h1>
            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">
              {resume.target_role || 'Professional'}
            </p>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/30 pb-2">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              {resume.email && (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">@</span>
                  </div>
                  <span className="text-indigo-50">{resume.email}</span>
                </div>
              )}
              {resume.phone_number && (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">📞</span>
                  </div>
                  <span className="text-indigo-50">{resume.phone_number}</span>
                </div>
              )}
              {resume.location && (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">📍</span>
                  </div>
                  <span className="text-indigo-50">{resume.location}</span>
                </div>
              )}
              {resume.linkedin_url && (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">💼</span>
                  </div>
                  <span className="text-indigo-50 text-xs break-all">
                    {resume.linkedin_url.replace('https://', '').replace('http://', '')}
                  </span>
                </div>
              )}
              {resume.github_url && (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">⚡</span>
                  </div>
                  <span className="text-indigo-50 text-xs break-all">
                    {resume.github_url.replace('https://', '').replace('http://', '')}
                  </span>
                </div>
              )}
              {resume.website && (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">🌐</span>
                  </div>
                  <span className="text-indigo-50 text-xs break-all">
                    {resume.website.replace('https://', '').replace('http://', '')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-8 flex-1">
              <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/30 pb-2">
                Skills
              </h3>
              <div className="space-y-4">
                {resume.skills.map((skillCategory, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-indigo-100 text-sm uppercase tracking-wide">
                      {skillCategory.category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="inline-flex items-center justify-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium"
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

          {/* Decorative Element */}
          <div className="mt-auto">
            <div className="h-1 bg-gradient-to-r from-white/40 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-12 bg-white text-[13px]">
          {/* Experience Section */}
          {resume.work_experience && resume.work_experience.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-5">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">💼</span>
                </div>
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                  Experience
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent ml-4"></div>
              </div>
              
              <div className="space-y-6">
                {resume.work_experience.map((exp, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
                    <div className="ml-5 pl-3 border-l-2 border-indigo-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-4">
                          <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">
                            {exp.position}
                          </h3>
                          <h4 className="text-xs font-semibold text-indigo-600 mb-1">
                            {exp.company}
                          </h4>
                          {exp.location && (
                            <p className="text-xs text-gray-600 mb-1">{exp.location}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-medium rounded-full">
                            {exp.date}
                          </span>
                        </div>
                      </div>
                      
                      {exp.description && exp.description.length > 0 && (
                        <ul className="space-y-1.5 mb-3">
                          {exp.description.map((desc, descIndex) => (
                            <li key={descIndex} className="flex items-start text-xs text-gray-700 leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mt-1.5 mr-2.5 flex-shrink-0"></span>
                              <span>{desc.replace(/^[-•*]\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {resume.projects && resume.projects.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-5">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">🚀</span>
                </div>
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                  Projects
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent ml-4"></div>
              </div>
              
              <div className="grid gap-4">
                {resume.projects.map((project, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 pr-4">
                        <h3 className="text-xs font-bold text-gray-900 mb-1 leading-tight">
                          {project.name}
                        </h3>
                        {project.url && (
                          <a
                            href={project.url}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline mb-2 block"
                          >
                            {project.url.replace('https://', '').replace('http://', '')}
                          </a>
                        )}
                      </div>
                      {project.date && (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium rounded-full flex-shrink-0">
                          {project.date}
                        </span>
                      )}
                    </div>
                    
                    {project.description && project.description.length > 0 && (
                      <ul className="space-y-1.5 mb-3">
                        {project.description.map((desc, descIndex) => (
                          <li key={descIndex} className="flex items-start text-xs text-gray-700 leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-1.5 mr-2.5 flex-shrink-0"></span>
                            <span>{desc.replace(/^[-•*]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center justify-center px-2 py-0.5 bg-white text-gray-700 text-xs rounded-md font-medium border border-gray-200"
                          >
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
              <div className="flex items-center mb-5">
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">🎓</span>
                </div>
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                  Education
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-pink-200 to-transparent ml-4"></div>
              </div>
              
              <div className="space-y-4">
                {resume.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 pr-4">
                        <h3 className="text-xs font-bold text-gray-900 mb-1 leading-tight">
                          {edu.school}
                        </h3>
                        <h4 className="text-xs font-semibold text-pink-600 mb-1">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h4>
                        {edu.location && (
                          <p className="text-xs text-gray-600">{edu.location}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gradient-to-r from-pink-100 to-red-100 text-pink-700 text-xs font-medium rounded-full mb-1">
                          {edu.date}
                        </span>
                        {edu.gpa && (
                          <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    </div>
                    
                    {edu.achievements && edu.achievements.length > 0 && (
                      <ul className="space-y-1.5">
                        {edu.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start text-xs text-gray-700 leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mt-1.5 mr-2.5 flex-shrink-0"></span>
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
        </div>
      </div>
    </div>
  );
}
