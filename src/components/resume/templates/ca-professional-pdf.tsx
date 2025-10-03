'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { memo } from 'react';

// Utility function to parse markdown and render mixed text with bold formatting
const parseMarkdownText = (text: string) => {
  if (!text) return null;
  
  // Split by **bold** patterns while preserving the delimiters
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the ** and make it bold
      const boldText = part.slice(2, -2);
      return (
        <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>
          {boldText}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

const caStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 25,
    lineHeight: 1.3,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '2px solid #1a472a',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1a472a',
    marginBottom: 12,
    textAlign: 'center',
  },
  designation: {
    fontSize: 12,
    fontFamily: 'Helvetica-Oblique',
    color: '#2d5016',
    textAlign: 'center',
    marginBottom: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  contactItem: {
    fontSize: 9,
    color: '#333333',
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1a472a',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingBottom: 2,
    borderBottom: '1px solid #4a7c59',
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#333333',
    textAlign: 'justify',
    marginBottom: 6,
  },
  experienceItem: {
    marginBottom: 8,
    paddingLeft: 5,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1a472a',
    flex: 1,
  },
  jobDate: {
    fontSize: 9,
    color: '#666666',
    fontFamily: 'Helvetica-Oblique',
  },
  company: {
    fontSize: 10,
    color: '#2d5016',
    marginBottom: 2,
    fontFamily: 'Helvetica-Oblique',
  },
  location: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 3,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.3,
    color: '#333333',
    marginLeft: 8,
    marginBottom: 1,
  },
  bulletPoint: {
    fontSize: 9,
    lineHeight: 1.3,
    color: '#333333',
    marginLeft: 8,
    marginBottom: 2,
  },
  educationItem: {
    marginBottom: 6,
    paddingLeft: 5,
  },
  degreeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  degree: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1a472a',
    flex: 1,
  },
  school: {
    fontSize: 10,
    color: '#2d5016',
    marginBottom: 1,
  },
  gpa: {
    fontSize: 9,
    color: '#666666',
    marginTop: 1,
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1a472a',
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 9,
    color: '#333333',
    lineHeight: 1.2,
    paddingLeft: 8,
  },
  projectItem: {
    marginBottom: 6,
    paddingLeft: 5,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  projectName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1a472a',
    flex: 1,
  },
  projectDate: {
    fontSize: 9,
    color: '#666666',
    fontFamily: 'Helvetica-Oblique',
  },
  projectDescription: {
    fontSize: 9,
    lineHeight: 1.3,
    color: '#333333',
    marginLeft: 8,
    marginBottom: 1,
  },
  certificationItem: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 3,
    paddingLeft: 5,
  },
  link: {
    color: '#1a472a',
    textDecoration: 'none',
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
  professionalHighlight: {
    backgroundColor: '#f8f9fa',
    padding: 6,
    marginBottom: 8,
    border: '1px solid #e9ecef',
    borderRadius: 3,
  },
  highlightText: {
    fontSize: 9,
    color: '#1a472a',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  // Table styles for education section
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f9f0',
    borderBottom: '1px solid #1a472a',
    paddingVertical: 4,
    paddingHorizontal: 3,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a472a',
    textAlign: 'center',
    paddingHorizontal: 2,
    borderRight: '0.5px solid #e0e0e0',
  },
  tableHeaderCellLast: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a472a',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #e0e0e0',
    paddingVertical: 3,
    paddingHorizontal: 3,
    minHeight: 20,
  },
  tableCell: {
    fontSize: 8,
    color: '#333333',
    paddingHorizontal: 2,
    textAlign: 'left',
    lineHeight: 1.2,
    borderRight: '0.5px solid #e0e0e0',
  },
  tableCellLast: {
    fontSize: 8,
    color: '#333333',
    paddingHorizontal: 2,
    textAlign: 'left',
    lineHeight: 1.2,
  },
});

interface CAPDFResumeProps {
  resume: Resume;
}

const CAPDFResume = memo(({ resume }: CAPDFResumeProps) => {
  const renderContactInfo = () => {
    const contactItems = [];
    
    if (resume.email) contactItems.push(resume.email);
    if (resume.phone_number) contactItems.push(resume.phone_number);
    if (resume.location) contactItems.push(resume.location);
    if (resume.linkedin_url) contactItems.push(resume.linkedin_url);
    if (resume.website) contactItems.push(resume.website);

    return (
      <View style={caStyles.contactInfo}>
        {contactItems.map((item, index) => (
          <Text key={index} style={caStyles.contactItem}>
            {item}
            {index < contactItems.length - 1 && ' | '}
          </Text>
        ))}
      </View>
    );
  };

  const renderProfessionalSummary = () => {
    if (!resume.professional_summary?.trim()) return null;

    return (
      <View style={caStyles.section}>
        <Text style={caStyles.summary}>
          {parseMarkdownText(resume.professional_summary)}
        </Text>
      </View>
    );
  };

  const renderWorkExperience = () => {
    if (!resume.work_experience?.length) return null;

    return (
      <View style={caStyles.section}>
        <Text style={caStyles.sectionTitle}>Professional Experience</Text>
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={caStyles.experienceItem}>
            <View style={caStyles.jobHeader}>
              <Text style={caStyles.jobTitle}>{exp.position}</Text>
              <Text style={caStyles.jobDate}>{exp.date}</Text>
            </View>
            <Text style={caStyles.company}>{exp.company}</Text>
            {exp.location && <Text style={caStyles.location}>{exp.location}</Text>}
            {exp.description?.map((desc, descIndex) => (
              <View key={descIndex} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={caStyles.bulletPoint}>• </Text>
                <View style={{ flex: 1 }}>
                  <Text style={caStyles.description}>
                    {parseMarkdownText(desc)}
                  </Text>
                </View>
              </View>
            ))}
            {exp.technologies && exp.technologies.length > 0 && (
              <Text style={[caStyles.description, { fontFamily: 'Helvetica-Oblique', marginTop: 2 }]}>
                Technologies: {exp.technologies.join(', ')}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!resume.education?.length) return null;

    return (
      <View style={caStyles.section}>
        <Text style={caStyles.sectionTitle}>Education & Qualifications</Text>
        
        {/* Table Header */}
        <View style={caStyles.tableHeader}>
          <Text style={[caStyles.tableHeaderCell, { flex: 2 }]}>Course</Text>
          <Text style={[caStyles.tableHeaderCell, { flex: 1.5 }]}>Year</Text>
          <Text style={[caStyles.tableHeaderCell, { flex: 2 }]}>Institution/Board</Text>
          <Text style={[caStyles.tableHeaderCellLast, { flex: 4.5 }]}>Remarks</Text>
        </View>
        
        {/* Table Rows */}
        {resume.education.map((edu, index) => (
          <View key={index} style={caStyles.tableRow}>
            <Text style={[caStyles.tableCell, { flex: 2 }]}>
              {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
            </Text>
            <Text style={[caStyles.tableCell, { flex: 1.5 }]}>
              {edu.date}
            </Text>
            <Text style={[caStyles.tableCell, { flex: 2 }]}>
              {edu.school}{edu.location ? `\u00A0\u00A0(${edu.location})` : ''}
            </Text>
            <Text style={[caStyles.tableCellLast, { flex: 4.5 }]}>
              {edu.gpa && `${typeof edu.gpa === 'number' ? edu.gpa.toFixed(0) : edu.gpa} `}
              {edu.achievements && edu.achievements.length > 0 && edu.achievements.join(', ')}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!resume.skills?.length) return null;

    return (
      <View style={caStyles.section}>
        <Text style={caStyles.sectionTitle}>Core Competencies</Text>
        {resume.skills.map((skill, index) => (
          <View key={index} style={caStyles.skillCategory}>
            <Text style={caStyles.skillItems}>
              <Text style={caStyles.skillCategoryTitle}>{skill.category}: </Text>
              {skill.items.join(' • ')}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!resume.projects?.length) return null;

    return (
      <View style={caStyles.section}>
        <Text style={caStyles.sectionTitle}>Key Projects & Achievements</Text>
        {resume.projects.map((project, index) => (
          <View key={index} style={caStyles.projectItem}>
            <View style={caStyles.projectHeader}>
              <Text style={caStyles.projectName}>{project.name}</Text>
              {project.date && <Text style={caStyles.projectDate}>{project.date}</Text>}
            </View>
            {project.description?.map((desc, descIndex) => (
              <View key={descIndex} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={caStyles.bulletPoint}>• </Text>
                <View style={{ flex: 1 }}>
                  <Text style={caStyles.projectDescription}>
                    {parseMarkdownText(desc)}
                  </Text>
                </View>
              </View>
            ))}
            {project.technologies && project.technologies.length > 0 && (
              <Text style={[caStyles.projectDescription, { fontFamily: 'Helvetica-Oblique', marginTop: 2 }]}>
                Tools/Software: {project.technologies.join(', ')}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderProfessionalHighlight = () => {
    // Remove this section as requested
    return null;
  };

  return (
    <PDFDocument>
      <PDFPage size="A4" style={caStyles.page}>
        {/* Header Section */}
        <View style={caStyles.header}>
          <Text style={caStyles.name}>
            {resume.first_name} {resume.last_name}
          </Text>
          {renderContactInfo()}
        </View>

        {/* Professional Summary */}
        {renderProfessionalSummary()}

        {/* Education */}
        {renderEducation()}

        {/* Work Experience */}
        {renderWorkExperience()}

        {/* Skills */}
        {renderSkills()}

        {/* Projects */}
        {renderProjects()}
      </PDFPage>
    </PDFDocument>
  );
});

CAPDFResume.displayName = 'CAPDFResume';

export { CAPDFResume };