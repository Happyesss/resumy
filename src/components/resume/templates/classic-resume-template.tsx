'use client';

import { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ClassicResumeTemplateProps {
  resume: Resume;
  className?: string;
}

export function ClassicResumeTemplate({ resume, className }: ClassicResumeTemplateProps) {
  return (
    <div className={cn("w-full max-w-[8.5in] mx-auto bg-white text-black p-8 font-serif text-base", className)}>
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider">
          {resume.first_name} {resume.last_name}
        </h1>
        <div className="flex justify-center items-center gap-4 text-sm mt-2 flex-wrap">
          {resume.phone_number && (
            <span>{resume.phone_number}</span>
          )}
          {resume.email && (
            <span>{resume.email}</span>
          )}
          {resume.linkedin_url && (
            <span>{resume.linkedin_url.replace('https://', '').replace('http://', '')}</span>
          )}
          {resume.github_url && (
            <span>{resume.github_url.replace('https://', '').replace('http://', '')}</span>
          )}
        </div>
        {resume.location && (
          <div className="text-sm mt-1">
            {resume.location}
          </div>
        )}
      </div>

      {/* Education Section */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3 uppercase">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-lg">{edu.school}</div>
                  <div className="italic text-gray-700">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  {edu.location && <div className="text-sm text-gray-600">{edu.location}</div>}
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>{edu.date}</div>
                  {edu.gpa && <div>GPA: {edu.gpa}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}



      {/* Experience Section */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3 uppercase">Experience</h2>
          {resume.work_experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-lg">{exp.company}</div>
                  <div className="italic text-gray-700">{exp.position}</div>
                  {exp.location && <div className="text-sm text-gray-600">{exp.location}</div>}
                </div>
                <div className="text-right text-sm text-gray-600">
                  {exp.date}
                </div>
              </div>
              {exp.description && exp.description.length > 0 && (
                <ul className="mt-2 space-y-1 ml-4">
                  {exp.description.map((desc, descIndex) => (
                    <li key={descIndex} className="text-base relative">
                      <span className="absolute -left-4">•</span>
                      {desc.replace(/^[-•*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="text-base mt-2">
                  <span className="font-semibold">Technologies:</span> {exp.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3 uppercase">Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-lg">
                    {project.name}
                    {project.technologies && project.technologies.length > 0 && (
                      <span className="font-normal text-sm text-gray-600 ml-2">
                        | {project.technologies.join(', ')}
                      </span>
                    )}
                  </div>
                  {project.url && (
                    <div className="text-sm text-gray-600">
                      <a href={project.url} className="underline">
                        {project.url.replace('https://', '').replace('http://', '')}
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  {project.date}
                </div>
              </div>
              {project.description && project.description.length > 0 && (
                <ul className="mt-2 space-y-1 ml-4">
                  {project.description.map((desc, descIndex) => (
                    <li key={descIndex} className="text-base relative">
                      <span className="absolute -left-4">•</span>
                      {desc.replace(/^[-•*]\s*/, '')}
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
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3 uppercase">Skills</h2>
          <div className="grid grid-cols-1 gap-2">
            {resume.skills.map((skillCategory, index) => (
              <div key={index} className="flex">
                <span className="font-bold text-gray-800 w-32 flex-shrink-0">{skillCategory.category}:</span>
                <span className="text-gray-700">{skillCategory.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leadership / Extracurricular Section */}
      {resume.education && resume.education.some(edu => edu.achievements && edu.achievements.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3 uppercase">Leadership / Extracurricular</h2>
          {resume.education.map((edu, index) => (
            edu.achievements && edu.achievements.length > 0 && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-bold text-lg">Activities at {edu.school}</div>
                    <div className="italic text-gray-700">Student Leadership</div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {edu.date}
                  </div>
                </div>
                <ul className="mt-2 space-y-1 ml-4">
                  {edu.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="text-base relative">
                      <span className="absolute -left-4">•</span>
                      {achievement.replace(/^[-•*]\s*/, '')}
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
