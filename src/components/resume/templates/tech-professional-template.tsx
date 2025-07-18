'use client';

import { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TechProfessionalTemplateProps {
  resume: Resume;
  className?: string;
}

export function TechProfessionalTemplate({ resume, className }: TechProfessionalTemplateProps) {
  return (
    <div className={cn("w-full max-w-[8.5in] mx-auto bg-white text-gray-900 font-mono", className)}>
      {/* Header Section with Tech-Inspired Design */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 mb-6">
        <div className="border-l-4 border-green-400 pl-6">
          <h1 className="text-3xl font-bold mb-4 tracking-tight">
            {resume.first_name} {resume.last_name}
          </h1>
          
          {/* Contact Info in Terminal Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm font-mono">
            {resume.email && (
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <span className="text-gray-300">email:</span>
                <span className="ml-2 text-white">{resume.email}</span>
              </div>
            )}
            {resume.phone_number && (
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <span className="text-gray-300">phone:</span>
                <span className="ml-2 text-white">{resume.phone_number}</span>
              </div>
            )}
            {resume.location && (
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <span className="text-gray-300">location:</span>
                <span className="ml-2 text-white">{resume.location}</span>
              </div>
            )}
            {resume.linkedin_url && (
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <span className="text-gray-300">linkedin:</span>
                <span className="ml-2 text-blue-300">{resume.linkedin_url.replace('https://', '').replace('http://', '')}</span>
              </div>
            )}
            {resume.github_url && (
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <span className="text-gray-300">github:</span>
                <span className="ml-2 text-blue-300">{resume.github_url.replace('https://', '').replace('http://', '')}</span>
              </div>
            )}
            {resume.website && (
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <span className="text-gray-300">website:</span>
                <span className="ml-2 text-blue-300">{resume.website.replace('https://', '').replace('http://', '')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-8">
        {/* Skills Section - Prominent for Tech Roles */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-green-400 pb-2 font-mono">
              {'// '} Technical Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resume.skills.map((skillCategory, index) => (
                <div key={index} className="bg-gray-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <h3 className="text-base font-bold text-green-600 mb-3 font-mono">
                    {skillCategory.category.toUpperCase()}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <span key={skillIndex} className="text-xs bg-gray-900 text-green-400 px-3 py-1 rounded font-mono font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {resume.work_experience && resume.work_experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-green-400 pb-2 font-mono">
              {'// '} Experience
            </h2>
            <div className="space-y-8">
              {resume.work_experience.map((exp, index) => (
                <div key={index} className="relative">
                  {/* Terminal-like container */}
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    {/* Terminal header */}
                    <div className="bg-gray-800 px-4 py-2 flex items-center">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="ml-4 text-gray-300 text-sm font-mono">
                        {exp.company.toLowerCase().replace(/\s+/g, '-')}.terminal
                      </div>
                    </div>
                    
                    {/* Terminal content */}
                    <div className="p-4 text-green-400 font-mono">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="mb-1">
                            <span className="text-white">position:</span>
                            <span className="ml-2 text-blue-300 font-bold">{exp.position}</span>
                          </div>
                          <div className="mb-1">
                            <span className="text-white">company:</span>
                            <span className="ml-2 text-yellow-300 font-bold">{exp.company}</span>
                          </div>
                          {exp.location && (
                            <div className="mb-1">
                              <span className="text-white">location:</span>
                              <span className="ml-2 text-gray-300">{exp.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-800 px-3 py-1 rounded text-right">
                          <span className="text-gray-300 text-sm">
                            {exp.date}
                          </span>
                        </div>
                      </div>
                      
                      {exp.description && exp.description.length > 0 && (
                        <div className="mt-4">
                          <div className="text-white mb-2">achievements:</div>
                          <ul className="space-y-2">
                            {exp.description.map((desc, descIndex) => (
                              <li key={descIndex} className="flex items-start text-sm">
                                <span className="text-green-400 mr-3 mt-1">→</span>
                                <span className="text-gray-300 leading-relaxed">{desc.replace(/^[-•*]\s*/, '')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="mt-4">
                          <div className="text-white mb-2">tech_stack:</div>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <span key={techIndex} className="text-xs bg-green-600 text-gray-900 px-2 py-1 rounded font-bold">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-green-400 pb-2 font-mono">
              {'// '} Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {resume.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 font-mono">
                        {project.name}
                      </h3>
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-sm text-blue-600 hover:text-blue-800 underline font-mono"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.url.replace('https://', '').replace('http://', '')}
                        </a>
                      )}
                    </div>
                    {project.date && (
                      <span className="text-sm text-gray-600 font-mono bg-gray-200 px-2 py-1 rounded">
                        {project.date}
                      </span>
                    )}
                  </div>
                  
                  {project.description && project.description.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {project.description.map((desc, descIndex) => (
                        <li key={descIndex} className="flex items-start text-sm text-gray-700">
                          <span className="text-green-600 mr-3 mt-1 font-mono">{'>'}</span>
                          <span className="leading-relaxed">{desc.replace(/^[-•*]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded font-mono">
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
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-green-400 pb-2 font-mono">
              {'// '} Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 font-mono">
                        {edu.school}
                      </h3>
                      <p className="text-base font-semibold text-green-600 mb-1 font-mono">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      {edu.location && (
                        <p className="text-sm text-gray-600 font-mono">{edu.location}</p>
                      )}
                      {edu.gpa && (
                        <p className="text-sm text-gray-600 font-mono">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="bg-gray-900 text-green-400 px-3 py-1 rounded font-mono text-sm">
                      {edu.date}
                    </div>
                  </div>
                  
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="space-y-1 mt-3">
                      {edu.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start text-sm text-gray-700">
                          <span className="text-green-600 mr-3 mt-1 font-mono">{'>'}</span>
                          <span className="leading-relaxed">{achievement.replace(/^[-•*]\s*/, '')}</span>
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
  );
}
