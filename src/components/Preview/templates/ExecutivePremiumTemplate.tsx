import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const ExecutivePremiumTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, workExperience, education, skills, projects, certifications } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSkillsByCategory = () => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof skills>);
  };

  const skillsByCategory = getSkillsByCategory();

  return (
    <div 
      className="bg-white text-gray-900 overflow-hidden"
      style={{ 
        width: '210mm',
        height: '297mm',
        maxWidth: '210mm',
        maxHeight: '297mm',
        padding: '15mm',
        fontSize: '11px',
        lineHeight: '1.4',
        fontFamily: 'Georgia, serif',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Executive Header */}
      <header className="border-b-4 border-gray-800 pb-4 mb-6" style={{ flexShrink: 0 }}>
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide" style={{ fontSize: '32px', lineHeight: '1.2' }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="w-16 h-1 bg-gray-800 mx-auto"></div>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-gray-700" style={{ fontSize: '10px' }}>
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-gray-600 flex-shrink-0" />
                <span className="truncate">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-gray-600 flex-shrink-0" />
                <span className="truncate">{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.state) && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gray-600 flex-shrink-0" />
                <span className="truncate">{personalInfo.city}{personalInfo.city && personalInfo.state && ', '}{personalInfo.state}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-gray-600 flex-shrink-0" />
                <span className="truncate">{personalInfo.website}</span>
              </div>
            )}
            {personalInfo.linkedIn && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-3 w-3 text-gray-600 flex-shrink-0" />
                <span className="truncate">{personalInfo.linkedIn}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ height: 'calc(100% - 120px)', overflow: 'hidden' }}>
        {/* Executive Summary */}
        {summary && (
          <section className="mb-6\" style={{ flexShrink: 0 }}>
            <h2 className="text-lg font-bold text-gray-900 mb-3 text-center" style={{ fontSize: '16px' }}>
              EXECUTIVE SUMMARY
            </h2>
            <div className="w-12 h-1 bg-gray-800 mx-auto mb-4"></div>
            <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto break-words" style={{ fontSize: '12px', lineHeight: '1.6' }}>
              {summary.length > 300 ? summary.substring(0, 300) + '...' : summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {workExperience.length > 0 && (
          <section className="mb-6" style={{ flexShrink: 0 }}>
            <h2 className="text-lg font-bold text-gray-900 mb-3 text-center" style={{ fontSize: '16px' }}>
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="w-12 h-1 bg-gray-800 mx-auto mb-4"></div>
            <div className="space-y-4">
              {workExperience.slice(0, 3).map((exp) => (
                <div key={exp.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 break-words" style={{ fontSize: '13px' }}>
                        {exp.position}
                      </h3>
                      <p className="text-base font-semibold text-gray-700 break-words" style={{ fontSize: '12px' }}>
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-gray-600 break-words" style={{ fontSize: '10px' }}>
                          {exp.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900" style={{ fontSize: '10px' }}>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="text-gray-700 space-y-1 pl-4" style={{ fontSize: '10px', lineHeight: '1.5' }}>
                      {exp.description.slice(0, 3).map((desc, index) => (
                        <li key={index} className="list-disc break-words">
                          {desc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {education.length > 0 && (
            <section className="mb-6\" style={{ flexShrink: 0 }}>
              <h2 className="text-base font-bold text-gray-900 mb-3 text-center" style={{ fontSize: '14px' }}>
                EDUCATION
              </h2>
              <div className="w-8 h-1 bg-gray-800 mx-auto mb-3"></div>
              <div className="space-y-3">
                {education.slice(0, 2).map((edu) => (
                  <div key={edu.id} className="text-center">
                    <h3 className="font-bold text-gray-900 break-words" style={{ fontSize: '11px' }}>
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="font-semibold text-gray-700 break-words" style={{ fontSize: '10px' }}>
                      {edu.institution}
                    </p>
                    {edu.location && (
                      <p className="text-gray-600 break-words" style={{ fontSize: '9px' }}>
                        {edu.location}
                      </p>
                    )}
                    <p className="text-gray-600" style={{ fontSize: '9px' }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    {(edu.gpa || edu.honors) && (
                      <p className="text-gray-600 break-words" style={{ fontSize: '9px' }}>
                        {edu.gpa && `GPA: ${edu.gpa}`}
                        {edu.gpa && edu.honors && ' • '}
                        {edu.honors}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Core Competencies */}
          {Object.keys(skillsByCategory).length > 0 && (
            <section className="mb-6" style={{ flexShrink: 0 }}>
              <h2 className="text-base font-bold text-gray-900 mb-3 text-center" style={{ fontSize: '14px' }}>
                CORE COMPETENCIES
              </h2>
              <div className="w-8 h-1 bg-gray-800 mx-auto mb-3"></div>
              <div className="space-y-3">
                {Object.entries(skillsByCategory).slice(0, 3).map(([category, categorySkills]) => (
                  <div key={category} className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1 break-words" style={{ fontSize: '10px' }}>
                      {category}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-1">
                      {categorySkills.slice(0, 6).map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-block px-2 py-0.5 bg-gray-100 text-gray-800 font-medium flex-shrink-0"
                          style={{ fontSize: '8px' }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Key Projects */}
        {projects.length > 0 && (
          <section className="mb-6" style={{ flexShrink: 0 }}>
            <h2 className="text-base font-bold text-gray-900 mb-3 text-center" style={{ fontSize: '14px' }}>
              KEY PROJECTS
            </h2>
            <div className="w-8 h-1 bg-gray-800 mx-auto mb-3"></div>
            <div className="space-y-3">
              {projects.slice(0, 2).map((project) => (
                <div key={project.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 flex-1 min-w-0 break-words" style={{ fontSize: '11px' }}>
                      {project.name}
                    </h3>
                    <span className="text-gray-600 flex-shrink-0" style={{ fontSize: '9px' }}>
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2 break-words" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                    {project.description.length > 120 ? 
                      project.description.substring(0, 120) + '...' : 
                      project.description
                    }
                  </p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 5).map((tech, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 flex-shrink-0"
                          style={{ fontSize: '8px' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Professional Certifications */}
        {certifications.length > 0 && (
          <section className="mb-4" style={{ flexShrink: 0 }}>
            <h2 className="text-base font-bold text-gray-900 mb-3 text-center" style={{ fontSize: '14px' }}>
              PROFESSIONAL CERTIFICATIONS
            </h2>
            <div className="w-8 h-1 bg-gray-800 mx-auto mb-3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications.slice(0, 4).map((cert) => (
                <div key={cert.id} className="text-center">
                  <h3 className="font-bold text-gray-900 break-words" style={{ fontSize: '10px' }}>
                    {cert.name}
                  </h3>
                  <p className="font-semibold text-gray-700 break-words" style={{ fontSize: '9px' }}>
                    {cert.issuer}
                  </p>
                  <p className="text-gray-600" style={{ fontSize: '8px' }}>
                    {formatDate(cert.date)}
                  </p>
                  {cert.credentialId && (
                    <p className="text-gray-600 break-words" style={{ fontSize: '7px' }}>
                      Credential ID: {cert.credentialId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};