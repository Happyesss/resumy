import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const ModernProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
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
      className="bg-white text-gray-800 overflow-hidden"
      style={{ 
        width: '210mm',
        height: '297mm',
        maxWidth: '210mm',
        maxHeight: '297mm',
        padding: '15mm',
        fontSize: '11px',
        lineHeight: '1.4',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Header - Optimized for A4 */}
      <header className="mb-4 pb-3 border-b-2 border-blue-600" style={{ flexShrink: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontSize: '24px', lineHeight: '1.2' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600" style={{ fontSize: '10px' }}>
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.state) && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{personalInfo.city}{personalInfo.city && personalInfo.state && ', '}{personalInfo.state}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedIn && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              <span>{personalInfo.linkedIn}</span>
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-4" style={{ flexShrink: 0 }}>
          <h2 className="text-sm font-semibold text-blue-600 mb-2" style={{ fontSize: '12px' }}>
            Professional Summary
          </h2>
          <p className="text-gray-700" style={{ fontSize: '11px', lineHeight: '1.5' }}>
            {summary}
          </p>
        </section>
      )}

      {/* Two Column Layout for optimal A4 usage */}
      <div 
        className="grid grid-cols-3 gap-4"
        style={{ 
          height: 'calc(100% - 120px)', // Adjust based on header height
          overflow: 'hidden'
        }}
      >
        {/* Main Content - 2/3 width */}
        <div className="col-span-2 space-y-4" style={{ overflow: 'hidden' }}>
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section style={{ flexShrink: 0 }}>
              <h2 className="text-sm font-semibold text-blue-600 mb-3" style={{ fontSize: '12px' }}>
                Professional Experience
              </h2>
              <div className="space-y-3">
                {workExperience.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="border-l-2 border-blue-600 pl-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate" style={{ fontSize: '11px' }}>
                          {exp.position}
                        </h3>
                        <p className="text-blue-600 font-medium truncate" style={{ fontSize: '10px' }}>
                          {exp.company}
                        </p>
                        {exp.location && (
                          <p className="text-gray-600 truncate" style={{ fontSize: '9px' }}>
                            {exp.location}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-gray-600 ml-2 flex-shrink-0" style={{ fontSize: '9px' }}>
                        <p>
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      </div>
                    </div>
                    {exp.description.length > 0 && (
                      <ul className="text-gray-700 space-y-1" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                        {exp.description.slice(0, 3).map((desc, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2 mt-0.5 flex-shrink-0">•</span>
                            <span className="break-words">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section style={{ flexShrink: 0 }}>
              <h2 className="text-sm font-semibold text-blue-600 mb-3" style={{ fontSize: '12px' }}>
                Notable Projects
              </h2>
              <div className="space-y-3">
                {projects.slice(0, 2).map((project) => (
                  <div key={project.id} className="border-l-2 border-blue-600 pl-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 flex-1 min-w-0 truncate" style={{ fontSize: '11px' }}>
                        {project.name}
                      </h3>
                      <div className="text-right text-gray-600 ml-2 flex-shrink-0" style={{ fontSize: '9px' }}>
                        <p>{formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2 break-words" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                      {project.description.length > 120 ? 
                        project.description.substring(0, 120) + '...' : 
                        project.description
                      }
                    </p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 4).map((tech, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs flex-shrink-0"
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
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-4" style={{ overflow: 'hidden' }}>
          {/* Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <section style={{ flexShrink: 0 }}>
              <h2 className="text-sm font-semibold text-blue-600 mb-3" style={{ fontSize: '12px' }}>
                Technical Skills
              </h2>
              <div className="space-y-2">
                {Object.entries(skillsByCategory).slice(0, 4).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-medium text-gray-900 mb-1 truncate" style={{ fontSize: '10px' }}>
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {categorySkills.slice(0, 6).map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium flex-shrink-0"
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

          {/* Education */}
          {education.length > 0 && (
            <section style={{ flexShrink: 0 }}>
              <h2 className="text-sm font-semibold text-blue-600 mb-3" style={{ fontSize: '12px' }}>
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-blue-600 pl-3">
                    <h3 className="font-semibold text-gray-900 break-words" style={{ fontSize: '10px' }}>
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 break-words" style={{ fontSize: '9px' }}>
                      {edu.institution}
                    </p>
                    <p className="text-gray-600" style={{ fontSize: '8px' }}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    {(edu.gpa || edu.honors) && (
                      <p className="text-gray-600 break-words" style={{ fontSize: '8px' }}>
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

          {/* Certifications */}
          {certifications.length > 0 && (
            <section style={{ flexShrink: 0 }}>
              <h2 className="text-sm font-semibold text-blue-600 mb-3" style={{ fontSize: '12px' }}>
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="border-l-2 border-blue-600 pl-3">
                    <h3 className="font-semibold text-gray-900 break-words" style={{ fontSize: '10px' }}>
                      {cert.name}
                    </h3>
                    <p className="text-blue-600 break-words" style={{ fontSize: '9px' }}>
                      {cert.issuer}
                    </p>
                    <p className="text-gray-600" style={{ fontSize: '8px' }}>
                      {formatDate(cert.date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};