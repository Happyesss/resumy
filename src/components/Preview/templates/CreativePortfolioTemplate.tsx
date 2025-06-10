import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink, Github } from 'lucide-react';
import { ResumeData } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const CreativePortfolioTemplate: React.FC<TemplateProps> = ({ data }) => {
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
      className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 overflow-hidden"
      style={{ 
        width: '210mm',
        height: '297mm',
        maxWidth: '210mm',
        maxHeight: '297mm',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Header with gradient background */}
      <header 
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        style={{
          padding: '15mm 15mm 10mm 15mm',
          flexShrink: 0
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-2" style={{ fontSize: '28px', lineHeight: '1.2' }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            
            <div className="grid grid-cols-2 gap-2 text-sm opacity-90 max-w-md" style={{ fontSize: '10px' }}>
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{personalInfo.phone}</span>
                </div>
              )}
              {(personalInfo.city || personalInfo.state) && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{personalInfo.city}{personalInfo.city && personalInfo.state && ', '}{personalInfo.state}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedIn && (
                <div className="flex items-center gap-1 col-span-2">
                  <Linkedin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{personalInfo.linkedIn}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div 
        style={{ 
          padding: '10mm 15mm 15mm 15mm',
          height: 'calc(100% - 80mm)', // Adjust based on header height
          overflow: 'hidden'
        }}
      >
        {/* Professional Summary */}
        {summary && (
          <section className="mb-4\" style={{ flexShrink: 0 }}>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
              <h2 className="text-lg font-semibold text-purple-600 mb-2" style={{ fontSize: '14px' }}>
                Creative Vision
              </h2>
              <p className="text-gray-700 leading-relaxed break-words" style={{ 
                fontSize: '11px', 
                lineHeight: '1.5'
              }}>
                {summary.length > 200 ? summary.substring(0, 200) + '...' : summary}
              </p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-3 gap-4" style={{ height: 'calc(100% - 80px)', overflow: 'hidden' }}>
          {/* Main Content Column */}
          <div className="col-span-2 space-y-4" style={{ overflow: 'hidden' }}>
            {/* Work Experience - Limited to 2 entries */}
            {workExperience.length > 0 && (
              <section style={{ flexShrink: 0 }}>
                <h2 className="text-lg font-semibold text-purple-600 mb-3" style={{ fontSize: '14px' }}>
                  Experience Journey
                </h2>
                <div className="space-y-3">
                  {workExperience.slice(0, 2).map((exp) => (
                    <div key={exp.id} className="bg-white rounded-lg shadow-md p-4 relative" style={{ minHeight: '100px', maxHeight: '120px' }}>
                      <div className="absolute -left-1 top-4 w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate" style={{ fontSize: '12px' }}>
                            {exp.position}
                          </h3>
                          <p className="text-purple-600 font-medium truncate" style={{ fontSize: '11px' }}>
                            {exp.company}
                          </p>
                          {exp.location && (
                            <p className="text-gray-600 truncate" style={{ fontSize: '9px' }}>
                              {exp.location}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium" style={{ fontSize: '8px' }}>
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      {exp.description.length > 0 && (
                        <ul className="text-gray-700 space-y-1" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                          {exp.description.slice(0, 2).map((desc, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-500 mr-2 mt-0.5 flex-shrink-0">▸</span>
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

            {/* Projects - Limited to 1 entry */}
            {projects.length > 0 && (
              <section style={{ flexShrink: 0 }}>
                <h2 className="text-lg font-semibold text-purple-600 mb-3" style={{ fontSize: '14px' }}>
                  Featured Projects
                </h2>
                <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-pink-500" style={{ minHeight: '100px', maxHeight: '120px' }}>
                  {projects.slice(0, 1).map((project) => (
                    <div key={project.id}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-900 flex-1 min-w-0 truncate" style={{ fontSize: '12px' }}>
                          {project.name}
                        </h3>
                        <span className="text-gray-500 flex-shrink-0" style={{ fontSize: '8px' }}>
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2 break-words" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                        {project.description.length > 100 ? 
                          project.description.substring(0, 100) + '...' : 
                          project.description
                        }
                      </p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.technologies.slice(0, 4).map((tech, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-medium flex-shrink-0"
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

          {/* Sidebar Column */}
          <div className="space-y-4" style={{ overflow: 'hidden' }}>
            {/* Skills - Limited to 3 categories */}
            {Object.keys(skillsByCategory).length > 0 && (
              <section style={{ flexShrink: 0 }}>
                <h2 className="text-lg font-semibold text-purple-600 mb-3" style={{ fontSize: '14px' }}>
                  Creative Toolkit
                </h2>
                <div className="bg-white rounded-lg shadow-md p-4" style={{ maxHeight: '180px', overflow: 'hidden' }}>
                  <div className="space-y-3">
                    {Object.entries(skillsByCategory).slice(0, 3).map(([category, categorySkills]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-900 mb-1 text-pink-600 truncate" style={{ fontSize: '10px' }}>
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {categorySkills.slice(0, 5).map((skill) => (
                            <span
                              key={skill.id}
                              className="inline-block px-2 py-0.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded border border-purple-200 flex-shrink-0"
                              style={{ fontSize: '8px' }}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Education - Limited to 1 entry */}
            {education.length > 0 && (
              <section style={{ flexShrink: 0 }}>
                <h2 className="text-lg font-semibold text-purple-600 mb-3" style={{ fontSize: '14px' }}>
                  Education
                </h2>
                <div className="bg-white rounded-lg shadow-md p-4" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                  {education.slice(0, 1).map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-gray-900 break-words" style={{ fontSize: '10px' }}>
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-purple-600 font-medium break-words" style={{ fontSize: '9px' }}>
                        {edu.institution}
                      </p>
                      <p className="text-gray-600" style={{ fontSize: '8px' }}>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications - Limited to 1 entry */}
            {certifications.length > 0 && (
              <section style={{ flexShrink: 0 }}>
                <h2 className="text-lg font-semibold text-purple-600 mb-3" style={{ fontSize: '14px' }}>
                  Certifications
                </h2>
                <div className="bg-white rounded-lg shadow-md p-4" style={{ maxHeight: '80px', overflow: 'hidden' }}>
                  {certifications.slice(0, 1).map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-semibold text-gray-900 break-words" style={{ fontSize: '10px' }}>
                        {cert.name}
                      </h3>
                      <p className="text-purple-600 break-words" style={{ fontSize: '9px' }}>
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
    </div>
  );
};