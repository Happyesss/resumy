'use client';

import { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CreativeMinimalTemplateProps {
  resume: Resume;
  className?: string;
}

export function CreativeMinimalTemplate({ resume, className }: CreativeMinimalTemplateProps) {
  return (
    <div className={cn("w-full max-w-[8.5in] mx-auto bg-white text-gray-900 p-8 font-sans", className)}>
      {/* Header Section */}
      <div className="relative mb-12">
        {/* Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600"></div>
        
        <div className="pt-6 text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-wide">
            {resume.first_name} <span className="font-bold">{resume.last_name}</span>
          </h1>
          
          {resume.target_role && (
            <p className="text-sm text-emerald-600 font-medium mb-4 uppercase tracking-wider">
              {resume.target_role}
            </p>
          )}
          
          {/* Contact Info in Clean Grid */}
          <div className="flex justify-center items-center flex-wrap gap-4 text-xs text-gray-600">
            {resume.email && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>{resume.email}</span>
              </div>
            )}
            {resume.phone_number && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <span>{resume.phone_number}</span>
              </div>
            )}
            {resume.location && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span>{resume.location}</span>
              </div>
            )}
            {resume.linkedin_url && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-xs">
                  {resume.linkedin_url.replace('https://', '').replace('http://', '')}
                </span>
              </div>
            )}
            {resume.github_url && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <span className="text-xs">
                  {resume.github_url.replace('https://', '').replace('http://', '')}
                </span>
              </div>
            )}
            {resume.website && (
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                <span className="text-xs">
                  {resume.website.replace('https://', '').replace('http://', '')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Skills and Education */}
        <div className="col-span-1 space-y-8">
          {/* Skills Section */}
          {resume.skills && resume.skills.length > 0 && (
            <div>
              <div className="relative mb-6">
                <h2 className="text-lg font-light text-gray-900 uppercase tracking-wider">
                  Expertise
                </h2>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              </div>
              
              <div className="space-y-6">
                {resume.skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                      {skillCategory.category}
                    </h3>
                    <div className="space-y-2">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <div key={skillIndex} className="relative">
                          <div className="flex items-center space-x-3">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 font-medium">
                              {skill}
                            </span>
                          </div>
                          {/* Skill level indicator - visual only */}
                          <div className="ml-4 mt-1 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                              style={{ width: `${75 + (skillIndex * 5) % 25}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {resume.education && resume.education.length > 0 && (
            <div>
              <div className="relative mb-6">
                <h2 className="text-lg font-light text-gray-900 uppercase tracking-wider">
                  Education
                </h2>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
              </div>
              
              <div className="space-y-4">
                {resume.education.map((edu, index) => (
                  <div key={index} className="group">
                    <div className="border-l-2 border-gray-100 group-hover:border-teal-300 pl-3 transition-colors duration-300">
                      <h3 className="font-semibold text-gray-900 text-xs mb-1">
                        {edu.school}
                      </h3>
                      <p className="text-xs text-teal-600 font-medium mb-1">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">{edu.date}</p>
                      {edu.location && (
                        <p className="text-xs text-gray-500">{edu.location}</p>
                      )}
                      {edu.gpa && (
                        <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
                      )}
                      
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {edu.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="text-xs text-gray-600 flex items-start">
                              <span className="w-1 h-1 bg-teal-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              <span>{achievement.replace(/^[-•*]\s*/, '')}</span>
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
        </div>

        {/* Right Column - Experience and Projects */}
        <div className="col-span-2 space-y-8">
          {/* Experience Section */}
          {resume.work_experience && resume.work_experience.length > 0 && (
            <div>
              <div className="relative mb-6">
                <h2 className="text-base font-light text-gray-900 uppercase tracking-wider">
                  Professional Experience
                </h2>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              </div>
              
              <div className="space-y-6">
                {resume.work_experience.map((exp, index) => (
                  <div key={index} className="group">
                    <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-lg border-l-4 border-emerald-400 group-hover:border-emerald-500 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-4">
                          <h3 className="text-base font-light text-gray-900 mb-1 leading-tight">
                            {exp.position}
                          </h3>
                          <h4 className="text-sm font-semibold text-emerald-600 mb-1">
                            {exp.company}
                          </h4>
                          {exp.location && (
                            <p className="text-xs text-gray-600">{exp.location}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            {exp.date}
                          </span>
                        </div>
                      </div>
                      
                      {exp.description && exp.description.length > 0 && (
                        <ul className="space-y-2 mb-3">
                          {exp.description.map((desc, descIndex) => (
                            <li key={descIndex} className="flex items-start text-xs text-gray-700 leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                              <span>{desc.replace(/^[-•*]\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {exp.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="inline-flex items-center justify-center px-2.5 py-1 bg-white text-gray-700 text-xs rounded-full font-medium border border-gray-200 shadow-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {resume.projects && resume.projects.length > 0 && (
            <div>
              <div className="relative mb-6">
                <h2 className="text-base font-light text-gray-900 uppercase tracking-wider">
                  Featured Projects
                </h2>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
              </div>
              
              <div className="grid gap-4">
                {resume.projects.map((project, index) => (
                  <div key={index} className="group">
                    <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-lg border-l-4 border-teal-400 group-hover:border-teal-500 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                            {project.name}
                          </h3>
                          {project.url && (
                            <a
                              href={project.url}
                              className="text-xs text-teal-600 hover:text-teal-700 font-medium underline decoration-2 underline-offset-2"
                            >
                              {project.url.replace('https://', '').replace('http://', '')}
                            </a>
                          )}
                        </div>
                        {project.date && (
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full flex-shrink-0">
                            {project.date}
                          </span>
                        )}
                      </div>
                      
                      {project.description && project.description.length > 0 && (
                        <ul className="space-y-2 mb-3">
                          {project.description.map((desc, descIndex) => (
                            <li key={descIndex} className="flex items-start text-xs text-gray-700 leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                              <span>{desc.replace(/^[-•*]\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="inline-flex items-center justify-center px-2.5 py-1 bg-white text-gray-700 text-xs rounded-full font-medium border border-gray-200 shadow-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <div className="w-full h-0.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-full"></div>
      </div>
    </div>
  );
}
