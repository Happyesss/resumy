'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Page as PDFPage, StyleSheet, Text, View } from '@react-pdf/renderer';
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

const minimalCleanStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
    lineHeight: 1.5,
    color: '#000000',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  name: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 14,
    letterSpacing: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  contactItem: {
    fontSize: 9,
    color: '#000000',
  },
  contactSeparator: {
    fontSize: 9,
    color: '#000000',
    marginHorizontal: 6,
  },
  linkText: {
    fontSize: 9,
    color: '#000000',
    textDecoration: 'underline',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginTop: 6,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  entryContainer: {
    marginBottom: 12, 
  },
  projectEntryContainer: {
    marginBottom: 5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  entryLeft: {
    flex: 1,
    paddingRight: 12,
  },
  entryRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 1,
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#000000',
    marginBottom: 1,
    fontStyle: 'italic',
  },
  entryLocation: {
    fontSize: 9,
    color: '#666666',
    marginBottom: -5,
  },
  dateText: {
    fontSize: 9,
    color: '#000000',
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
  gpaText: {
    fontSize: 9,
    color: '#666666',
    marginTop: 2,
  },
  bulletList: {
    marginTop: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  bulletMarker: {
    fontSize: 8,
    color: '#000000',
    marginRight: 8,
    marginTop: 1,
    width: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#000000',
  },
  skillsGrid: {
    flexDirection: 'column',
    gap: 4,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  skillCategory: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    width: 80,
    marginRight: 12,
  },
  skillItems: {
    flex: 1,
    fontSize: 9,
    color: '#000000',
    lineHeight: 1.3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  projectUrl: {
    fontSize: 8,
    color: '#000000',
    textDecoration: 'underline',
    marginLeft: 8,
  },
  projectTech: {
    fontSize: 8,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: -5,
  },
});

interface MinimalCleanPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const MinimalCleanPDF = memo(function MinimalCleanPDF({ resume, variant: _variant = 'base' }: MinimalCleanPDFProps) {
  
  const renderContactInfo = () => {
    const contactItems = [
      resume.email,
      resume.phone_number,
      resume.location,
      resume.linkedin_url?.replace('https://', '').replace('http://', ''),
      resume.github_url?.replace('https://', '').replace('http://', ''),
    ].filter(Boolean);

    return (
      <View style={minimalCleanStyles.contactInfo}>
        {contactItems.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={minimalCleanStyles.contactItem}>{item}</Text>
            {index < contactItems.length - 1 && (
              <Text style={minimalCleanStyles.contactSeparator}>•</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <View>
        <Text style={minimalCleanStyles.sectionTitle}>Experience</Text>
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={minimalCleanStyles.entryContainer}>
            <View style={minimalCleanStyles.entryHeader}>
              <View style={minimalCleanStyles.entryLeft}>
                <Text style={minimalCleanStyles.entryTitle}>{exp.position}</Text>
                <Text style={minimalCleanStyles.entrySubtitle}>{exp.company}</Text>
                {exp.location && (
                  <Text style={minimalCleanStyles.entryLocation}>{exp.location}</Text>
                )}
              </View>
              <View style={minimalCleanStyles.entryRight}>
                <Text style={minimalCleanStyles.dateText}>{exp.date}</Text>
              </View>
            </View>
            {exp.description && exp.description.length > 0 && (
              <View style={minimalCleanStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={minimalCleanStyles.bulletItem}>
                    <Text style={minimalCleanStyles.bulletMarker}>•</Text>
                    <Text style={minimalCleanStyles.bulletText}>
                      {parseMarkdownText(desc)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return null;

    return (
      <View>
        <Text style={minimalCleanStyles.sectionTitle}>Projects</Text>
        {resume.projects.map((project, index) => (
          <View key={index} style={minimalCleanStyles.projectEntryContainer}>
            <View style={minimalCleanStyles.entryHeader}>
              <View style={minimalCleanStyles.entryLeft}>
                <View style={minimalCleanStyles.projectTitleRow}>
                  <Text style={minimalCleanStyles.entryTitle}>{project.name}</Text>
                  {project.url && (
                    <Text style={minimalCleanStyles.projectUrl}>
                      {project.url.replace('https://', '').replace('http://', '')}
                    </Text>
                  )}
                </View>
                {project.technologies && project.technologies.length > 0 && (
                  <Text style={minimalCleanStyles.projectTech}>
                    {project.technologies.join(' • ')}
                  </Text>
                )}
              </View>
              <View style={minimalCleanStyles.entryRight}>
                {project.date && (
                  <Text style={minimalCleanStyles.dateText}>{project.date}</Text>
                )}
              </View>
            </View>
            {project.description && project.description.length > 0 && (
              <View style={minimalCleanStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={minimalCleanStyles.bulletItem}>
                    <Text style={minimalCleanStyles.bulletMarker}>•</Text>
                    <Text style={minimalCleanStyles.bulletText}>
                      {parseMarkdownText(desc)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;

    return (
      <View>
        <Text style={minimalCleanStyles.sectionTitle}>Education</Text>
        {resume.education.map((edu, index) => (
          <View key={index} style={minimalCleanStyles.entryContainer}>
            <View style={minimalCleanStyles.entryHeader}>
              <View style={minimalCleanStyles.entryLeft}>
                <Text style={minimalCleanStyles.entryTitle}>{edu.school}</Text>
                <Text style={minimalCleanStyles.entrySubtitle}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </Text>
                {edu.location && (
                  <Text style={minimalCleanStyles.entryLocation}>{edu.location}</Text>
                )}
                {edu.gpa && (
                  <Text style={minimalCleanStyles.gpaText}>GPA: {edu.gpa}</Text>
                )}
              </View>
              <View style={minimalCleanStyles.entryRight}>
                <Text style={minimalCleanStyles.dateText}>{edu.date}</Text>
              </View>
            </View>
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={minimalCleanStyles.bulletList}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={minimalCleanStyles.bulletItem}>
                    <Text style={minimalCleanStyles.bulletMarker}>•</Text>
                    <Text style={minimalCleanStyles.bulletText}>
                      {parseMarkdownText(achievement.replace(/^[-•*]\s*/, ''))}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View>
        <Text style={minimalCleanStyles.sectionTitle}>Skills</Text>
        <View style={minimalCleanStyles.skillsGrid}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={minimalCleanStyles.skillRow}>
              <Text style={minimalCleanStyles.skillCategory}>
                {skillCategory.category}:
              </Text>
              <Text style={minimalCleanStyles.skillItems}>
                {skillCategory.items.join(', ')}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={minimalCleanStyles.page}>
        {/* Header */}
        <View style={minimalCleanStyles.header}>
          <Text style={minimalCleanStyles.name}>
            {resume.first_name} {resume.last_name}
          </Text>
          {renderContactInfo()}
        </View>

        {/* Experience */}
        {resume.professional_summary && (
          <View style={{ marginBottom: 8 }}>
            <Text style={minimalCleanStyles.sectionTitle}>Professional Summary</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
              {parseMarkdownText(resume.professional_summary)}
            </Text>
          </View>
        )}
        {renderExperience()}

        {/* Projects */}
        {renderProjects()}

        {/* Education */}
        {renderEducation()}

        {/* Skills */}
        {renderSkills()}
      </PDFPage>
    </PDFDocument>
  );
});
