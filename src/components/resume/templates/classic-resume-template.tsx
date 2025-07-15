'use client';

import { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ClassicResumeTemplateProps {
  resume: Resume;
  className?: string;
}

export function ClassicResumeTemplate({ resume, className }: ClassicResumeTemplateProps) {
  return (
    <div className={cn("w-full max-w-[8.5in] mx-auto bg-white text-black p-8 font-serif", className)}>
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider">
          {resume.first_name} {resume.last_name}
        </h1>
        <div className="flex justify-center items-center gap-4 text-sm mt-2 flex-wrap">
          {resume.phone_number && (
            <span>📞 {resume.phone_number}</span>
          )}
          {resume.email && (
            <span>✉ {resume.email}</span>
          )}
          {resume.linkedin_url && (
            <span>🔗 {resume.linkedin_url.replace('https://', '')}</span>
          )}
          {resume.github_url && (
            <span>🐱 {resume.github_url.replace('https://', '')}</span>
          )}
        </div>
        {resume.location && (
          <div className="text-sm mt-1 italic">
            {resume.location}
          </div>
        )}
      </div>

      {/* Education Section */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3">Education</h2>
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">{edu.school}</div>
                  <div className="italic">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  {edu.location && <div className="text-sm">{edu.location}</div>}
                </div>
                <div className="text-right text-sm">
                  <div>{edu.date}</div>
                  {edu.gpa && <div>GPA: {edu.gpa}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Relevant Coursework */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3">Relevant Coursework</h2>
          <div className="grid grid-cols-2 gap-x-8">
            {resume.skills.map((skillCategory, index) => (
              <div key={index} className="mb-2">
                <span className="font-semibold">• {skillCategory.category}:</span>
                <div className="ml-4">
                  {skillCategory.items.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3">Experience</h2>
          {resume.work_experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">{exp.company}</div>
                  <div className="italic">{exp.position}</div>
                  {exp.location && <div className="text-sm">{exp.location}</div>}
                </div>
                <div className="text-right text-sm">
                  {exp.date}
                </div>
              </div>
              {exp.description && exp.description.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {exp.description.map((desc, descIndex) => (
                    <li key={descIndex} className="text-sm">
                      • {desc}
                    </li>
                  ))}
                </ul>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="text-sm mt-2">
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
          <h2 className="text-xl font-bold border-b border-black mb-3">Projects</h2>
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">
                    {project.name}
                    {project.technologies && project.technologies.length > 0 && (
                      <span className="font-normal text-sm">
                        {' | '}{project.technologies.join(', ')}
                      </span>
                    )}
                  </div>
                  {project.url && (
                    <div className="text-sm">
                      <a href={project.url} className="underline">
                        {project.url.replace('https://', '')}
                      </a>
                    </div>
                  )}
                </div>
                <div className="text-right text-sm">
                  {project.date}
                </div>
              </div>
              {project.description && project.description.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {project.description.map((desc, descIndex) => (
                    <li key={descIndex} className="text-sm">
                      • {desc}
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
          <h2 className="text-xl font-bold border-b border-black mb-3">Technical Skills</h2>
          {resume.skills.map((skillCategory, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">{skillCategory.category}:</span>{' '}
              {skillCategory.items.join(', ')}
            </div>
          ))}
        </div>
      )}

      {/* Leadership / Extracurricular Section */}
      {resume.education && resume.education.some(edu => edu.achievements && edu.achievements.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-black mb-3">Leadership / Extracurricular</h2>
          {resume.education.map((edu, index) => (
            edu.achievements && edu.achievements.length > 0 && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">Activities at {edu.school}</div>
                    <div className="italic">Student Leadership</div>
                  </div>
                  <div className="text-right text-sm">
                    {edu.date}
                  </div>
                </div>
                <ul className="mt-2 space-y-1">
                  {edu.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="text-sm">
                      • {achievement}
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
