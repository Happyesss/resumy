import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import styles from './pdfStyles';
import { ResumeData } from '../types/resume';

interface PDFResumeProps {
  data: ResumeData;
}

const PDFResume: React.FC<PDFResumeProps> = ({ data }) => {
  const { personalInfo, summary, workExperience, education, skills, projects, certifications } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSkillsByCategory = () => {
    return (skills || []).reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof skills>);
  };

  const skillsByCategory = getSkillsByCategory();

  // Split content across pages if needed
  const renderPages = () => {
    const pages = [];
    // First page content
    pages.push(
      <Page key="page-1" size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo?.firstName ?? ''} {personalInfo?.lastName ?? ''}
          </Text>
          <View style={styles.contactInfo}>
            {personalInfo?.email && (
              <Text style={styles.contactItem}>{personalInfo.email}</Text>
            )}
            {personalInfo?.phone && (
              <Text style={styles.contactItem}>{personalInfo.phone}</Text>
            )}
            {(personalInfo?.city || personalInfo?.state) && (
              <Text style={styles.contactItem}>
                {personalInfo?.city ?? ''}{personalInfo?.city && personalInfo?.state && ', '}{personalInfo?.state ?? ''}
              </Text>
            )}
            {personalInfo?.website && (
              <Text style={styles.contactItem}>{personalInfo.website}</Text>
            )}
            {personalInfo?.linkedIn && (
              <Text style={styles.contactItem}>{personalInfo.linkedIn}</Text>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{summary}</Text>
          </View>
        )}

        {/* Two-column layout for optimal space usage */}
        <View style={styles.twoColumnContainer}>
          {/* Left Column - Main Content */}
          <View style={styles.leftColumn}>
            {/* Work Experience - First 2 entries on page 1 */}
            {workExperience && workExperience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {workExperience.slice(0, 2).map((exp) => (
                  <View key={exp.id} style={styles.experienceItem}>
                    <Text style={styles.jobTitle}>{exp.position ?? ''}</Text>
                    <Text style={styles.company}>{exp.company ?? ''}</Text>
                    {exp.location && <Text style={styles.location}>{exp.location}</Text>}
                    <Text style={styles.date}>
                      {formatDate(exp.startDate ?? '')} - {exp.current ? 'Present' : formatDate(exp.endDate ?? '')}
                    </Text>
                    {(exp.description || []).slice(0, 4).map((desc, index) => (
                      <Text key={index} style={styles.description}>
                        • {desc ?? ''}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Projects - First 1-2 on page 1 */}
            {projects && projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notable Projects</Text>
                {projects.slice(0, 1).map((project) => (
                  <View key={project.id} style={styles.projectItem}>
                    <Text style={styles.projectName}>{project.name ?? ''}</Text>
                    <Text style={styles.date}>
                      {formatDate(project.startDate ?? '')} - {formatDate(project.endDate ?? '')}
                    </Text>
                    <Text style={styles.projectDescription}>
                      {project.description ?? ''}
                    </Text>
                    {project.technologies && project.technologies.length > 0 && (
                      <Text style={styles.technologies}>
                        Technologies: {project.technologies.join(', ')}
                      </Text>
                    )}
                    {(project.url || project.github) && (
                      <Text style={styles.technologies}>
                        {project.url && `Live: ${project.url}`}
                        {project.url && project.github && ' | '}
                        {project.github && `GitHub: ${project.github}`}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column - Supporting Information */}
          <View style={styles.rightColumn}>
            {/* Skills */}
            {Object.keys(skillsByCategory).length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Technical Skills</Text>
                {Object.entries(skillsByCategory).slice(0, 4).map(([category, categorySkills]) => (
                  <View key={category} style={styles.skillCategory}>
                    <Text style={styles.skillCategoryTitle}>{category ?? ''}</Text>
                    <Text style={styles.skillList}>
                      {(categorySkills || []).slice(0, 8).map(skill => skill?.name ?? '').filter(name => name).join(', ')}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={styles.educationItem}>
                    <Text style={styles.degree}>{edu.degree ?? ''} in {edu.field ?? ''}</Text>
                    <Text style={styles.institution}>{edu.institution ?? ''}</Text>
                    {edu.location && <Text style={styles.location}>{edu.location}</Text>}
                    <Text style={styles.date}>
                      {formatDate(edu.startDate ?? '')} - {formatDate(edu.endDate ?? '')}
                    </Text>
                    {(edu.gpa || edu.honors) && (
                      <Text style={styles.location}>
                        {edu.gpa && `GPA: ${edu.gpa}`}
                        {edu.gpa && edu.honors && ' • '}
                        {edu.honors ?? ''}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {certifications.slice(0, 4).map((cert) => (
                  <View key={cert.id} style={styles.certificationItem}>
                    <Text style={styles.certificationName}>{cert.name ?? ''}</Text>
                    <Text style={styles.certificationIssuer}>{cert.issuer ?? ''}</Text>
                    <Text style={styles.date}>{formatDate(cert.date ?? '')}</Text>
                    {cert.credentialId && (
                      <Text style={styles.location}>ID: {cert.credentialId}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    );

    // Second page if there's additional content
    const hasAdditionalContent = 
      (workExperience && workExperience.length > 2) || 
      (projects && projects.length > 1) || 
      (certifications && certifications.length > 4) ||
      Object.keys(skillsByCategory).length > 4;

    if (hasAdditionalContent) {
      pages.push(
        <Page key="page-2" size="A4" style={styles.page}>
          {/* Continued Work Experience */}
          {workExperience && workExperience.length > 2 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Experience (Continued)</Text>
              {workExperience.slice(2).map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <Text style={styles.jobTitle}>{exp.position ?? ''}</Text>
                  <Text style={styles.company}>{exp.company ?? ''}</Text>
                  {exp.location && <Text style={styles.location}>{exp.location}</Text>}
                  <Text style={styles.date}>
                    {formatDate(exp.startDate ?? '')} - {exp.current ? 'Present' : formatDate(exp.endDate ?? '')}
                  </Text>
                  {(exp.description || []).slice(0, 4).map((desc, index) => (
                    <Text key={index} style={styles.description}>
                      • {desc ?? ''}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Additional Projects */}
          {projects && projects.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Projects</Text>
              {projects.slice(1).map((project) => (
                <View key={project.id} style={styles.projectItem}>
                  <Text style={styles.projectName}>{project.name ?? ''}</Text>
                  <Text style={styles.date}>
                    {formatDate(project.startDate ?? '')} - {formatDate(project.endDate ?? '')}
                  </Text>
                  <Text style={styles.projectDescription}>
                    {project.description ?? ''}
                  </Text>
                  {project.technologies && project.technologies.length > 0 && (
                    <Text style={styles.technologies}>
                      Technologies: {project.technologies.join(', ')}
                    </Text>
                  )}
                  {(project.url || project.github) && (
                    <Text style={styles.technologies}>
                      {project.url && `Live: ${project.url}`}
                      {project.url && project.github && ' | '}
                      {project.github && `GitHub: ${project.github}`}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Additional Skills */}
          {Object.keys(skillsByCategory).length > 4 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Skills</Text>
              {Object.entries(skillsByCategory).slice(4).map(([category, categorySkills]) => (
                <View key={category} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>{category ?? ''}</Text>
                  <Text style={styles.skillList}>
                    {(categorySkills || []).map(skill => skill?.name ?? '').filter(name => name).join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Additional Certifications */}
          {certifications && certifications.length > 4 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Certifications</Text>
              {certifications.slice(4).map((cert) => (
                <View key={cert.id} style={styles.certificationItem}>
                  <Text style={styles.certificationName}>{cert.name ?? ''}</Text>
                  <Text style={styles.certificationIssuer}>{cert.issuer ?? ''}</Text>
                  <Text style={styles.date}>{formatDate(cert.date ?? '')}</Text>
                  {cert.credentialId && (
                    <Text style={styles.location}>ID: {cert.credentialId}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </Page>
      );
    }

    return pages;
  };

  return (
    <Document>
      {renderPages()}
    </Document>
  );
};

export default PDFResume;
