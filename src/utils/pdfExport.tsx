import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';

// Define styles for PDF - A4 optimized with multi-page support
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: '15mm',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    width: '210mm',
    height: '297mm',
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
    flexShrink: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
    lineHeight: 1.2,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 9,
    color: '#6b7280',
  },
  contactItem: {
    marginRight: 12,
  },
  section: {
    marginBottom: 12,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summary: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 10,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
    breakInside: 'avoid',
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  company: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 8,
    color: '#6b7280',
  },
  date: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.3,
    marginTop: 2,
  },
  skillCategory: {
    marginBottom: 6,
    breakInside: 'avoid',
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  skillList: {
    fontSize: 9,
    color: '#374151',
  },
  educationItem: {
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
    breakInside: 'avoid',
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  institution: {
    fontSize: 9,
    color: '#2563EB',
  },
  projectItem: {
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
    breakInside: 'avoid',
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  projectDescription: {
    fontSize: 9,
    color: '#374151',
    marginTop: 2,
    lineHeight: 1.3,
  },
  technologies: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  certificationItem: {
    marginBottom: 6,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
    breakInside: 'avoid',
  },
  certificationName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  certificationIssuer: {
    fontSize: 8,
    color: '#2563EB',
  },
  pageBreak: {
    pageBreakBefore: 'always',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
  },
});

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
      <Page key="page-1\" size="A4\" style={styles.page}>
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

export const exportToPDF = async (resumeData: ResumeData): Promise<Blob> => {
  const doc = <PDFResume data={resumeData} />;
  const pdfBlob = await pdf(doc).toBlob();
  return pdfBlob;
};

export const downloadPDF = async (resumeData: ResumeData, filename?: string) => {
  try {
    const pdfBlob = await exportToPDF(resumeData);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Safe access to personalInfo with fallbacks
    const safePersonalInfo = resumeData.personalInfo || {};
    const firstName = safePersonalInfo.firstName || 'Resume';
    const lastName = safePersonalInfo.lastName || 'Export';
    link.download = filename || `${firstName}_${lastName}_Resume.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Batch export functionality for multiple resumes
export const batchExportPDFs = async (resumeDataList: ResumeData[], progressCallback?: (progress: number) => void) => {
  const results: { success: boolean; filename: string; error?: string }[] = [];
  
  for (let i = 0; i < resumeDataList.length; i++) {
    const resumeData = resumeDataList[i];
    
    try {
      // Safe access to personalInfo with fallbacks
      const safePersonalInfo = resumeData.personalInfo || {};
      const firstName = safePersonalInfo.firstName || 'Resume';
      const lastName = safePersonalInfo.lastName || 'Export';
      const filename = `${firstName}_${lastName}_Resume.pdf`;
      
      await downloadPDF(resumeData, filename);
      
      results.push({
        success: true,
        filename
      });
      
      // Update progress
      if (progressCallback) {
        progressCallback(((i + 1) / resumeDataList.length) * 100);
      }
      
      // Small delay to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      // Safe access to personalInfo with fallbacks
      const safePersonalInfo = resumeData.personalInfo || {};
      const firstName = safePersonalInfo.firstName || 'Resume';
      const lastName = safePersonalInfo.lastName || 'Export';
      
      results.push({
        success: false,
        filename: `${firstName}_${lastName}_Resume.pdf`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
};

// Validate PDF formatting and content integrity
export const validatePDFExport = async (resumeData: ResumeData): Promise<{
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}> => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Safe access to personalInfo
  const safePersonalInfo = resumeData.personalInfo || {};

  // Check for missing required fields
  if (!safePersonalInfo.firstName || !safePersonalInfo.lastName) {
    issues.push('Missing name information');
  }
  
  if (!safePersonalInfo.email || !safePersonalInfo.phone) {
    issues.push('Missing contact information');
  }

  // Check content length for optimal formatting
  if (resumeData.summary && resumeData.summary.length > 500) {
    recommendations.push('Consider shortening the professional summary for better formatting');
  }

  // Check work experience descriptions
  (resumeData.workExperience || []).forEach((exp, index) => {
    if (exp.description && exp.description.length > 6) {
      recommendations.push(`Work experience ${index + 1} has many bullet points - consider condensing for better layout`);
    }
    
    (exp.description || []).forEach((desc, descIndex) => {
      if (desc && desc.length > 150) {
        recommendations.push(`Work experience ${index + 1}, bullet point ${descIndex + 1} is very long - consider shortening`);
      }
    });
  });

  // Check skills organization
  const skillsByCategory = (resumeData.skills || []).reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = 0;
    acc[skill.category]++;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(skillsByCategory).length > 6) {
    recommendations.push('Consider consolidating skill categories for better organization');
  }

  // Check project descriptions
  (resumeData.projects || []).forEach((project, index) => {
    if (project.description && project.description.length > 200) {
      recommendations.push(`Project ${index + 1} description is long - consider shortening for better layout`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
};