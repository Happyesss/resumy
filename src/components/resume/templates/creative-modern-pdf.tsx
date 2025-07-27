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

const creativeModernStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 0,
    lineHeight: 1.4,
    color: '#2d3748',
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#4a5568',
    color: '#ffffff',
    width: '35%',
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 20,
    minHeight: '100%',
  },
  mainContent: {
    width: '65%',
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  sidebarName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  sidebarTitle: {
    fontSize: 11,
    color: '#a0aec0',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  sidebarSection: {
    marginBottom: 18,
  },
  sidebarSectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#e2e8f0',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactItem: {
    marginBottom: 6,
  },
  contactLabel: {
    fontSize: 8,
    color: '#a0aec0',
    marginBottom: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 9,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
  },
  linkValue: {
    fontSize: 9,
    color: '#90cdf4',
  },
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  skillItem: {
    fontSize: 8,
    color: '#cbd5e1',
    marginBottom: 2,
    paddingLeft: 8,
  },
  mainSectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#2d3748',
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#e53e3e',
    paddingBottom: 4,
  },
  entryContainer: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  entryLeft: {
    flex: 1,
    paddingRight: 12,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#2d3748',
    marginBottom: 2,
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#e53e3e',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  entryLocation: {
    fontSize: 8,
    color: '#718096',
  },
  dateAccent: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  gpaText: {
    fontSize: 8,
    color: '#718096',
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
  bulletAccent: {
    width: 4,
    height: 4,
    backgroundColor: '#e53e3e',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#4a5568',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 3,
  },
  techBadge: {
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#2d3748',
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    textAlign: 'center',
  },
  projectUrl: {
    fontSize: 8,
    color: '#e53e3e',
    marginTop: 2,
  },
  educationAchievements: {
    marginTop: 4,
  },
});

interface CreativeModernPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const CreativeModernPDF = memo(function CreativeModernPDF({ resume, variant = 'base' }: CreativeModernPDFProps) {
  
  const renderContactInfo = () => {
    const contactItems = [
      { label: 'Email', value: resume.email },
      { label: 'Phone', value: resume.phone_number },
      { label: 'Location', value: resume.location },
      { label: 'LinkedIn', value: resume.linkedin_url?.replace('https://', '').replace('http://', '') },
      { label: 'GitHub', value: resume.github_url?.replace('https://', '').replace('http://', '') },
    ].filter(item => item.value);

    return (
      <View style={creativeModernStyles.sidebarSection}>
        <Text style={creativeModernStyles.sidebarSectionTitle}>Contact</Text>
        {contactItems.map((item, index) => (
          <View key={index} style={creativeModernStyles.contactItem}>
            <Text style={creativeModernStyles.contactLabel}>{item.label}</Text>
            <Text style={item.label === 'LinkedIn' || item.label === 'GitHub' ? creativeModernStyles.linkValue : creativeModernStyles.contactValue}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSkillsSection = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View style={creativeModernStyles.sidebarSection}>
        <Text style={creativeModernStyles.sidebarSectionTitle}>Skills</Text>
        {resume.skills.map((skillCategory, index) => (
          <View key={index} style={creativeModernStyles.skillCategory}>
            <Text style={creativeModernStyles.skillCategoryTitle}>
              {skillCategory.category}
            </Text>
            {skillCategory.items.map((skill, skillIndex) => (
              <Text key={skillIndex} style={creativeModernStyles.skillItem}>
                • {skill}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <View>
        <Text style={creativeModernStyles.mainSectionTitle}>Professional Experience</Text>
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={creativeModernStyles.entryContainer}>
            <View style={creativeModernStyles.entryHeader}>
              <View style={creativeModernStyles.entryLeft}>
                <Text style={creativeModernStyles.entryTitle}>{exp.position}</Text>
                <Text style={creativeModernStyles.entrySubtitle}>{exp.company}</Text>
                {exp.location && (
                  <Text style={creativeModernStyles.entryLocation}>{exp.location}</Text>
                )}
              </View>
              <View style={creativeModernStyles.entryRight}>
                <Text style={creativeModernStyles.dateAccent}>{exp.date}</Text>
              </View>
            </View>
            {exp.description && exp.description.length > 0 && (
              <View style={creativeModernStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={creativeModernStyles.bulletItem}>
                    <View style={creativeModernStyles.bulletAccent} />
                    <Text style={creativeModernStyles.bulletText}>
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
        <Text style={creativeModernStyles.mainSectionTitle}>Key Projects</Text>
        {resume.projects.map((project, index) => (
          <View key={index} style={creativeModernStyles.entryContainer}>
            <View style={creativeModernStyles.projectHeader}>
              <View style={creativeModernStyles.entryLeft}>
                <Text style={creativeModernStyles.entryTitle}>{project.name}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <View style={creativeModernStyles.projectTags}>
                    {project.technologies.map((tech, techIndex) => (
                      <Text key={techIndex} style={creativeModernStyles.techBadge}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
                {project.url && (
                  <Text style={creativeModernStyles.projectUrl}>
                    {project.url.replace('https://', '').replace('http://', '')}
                  </Text>
                )}
              </View>
              <View style={creativeModernStyles.entryRight}>
                {project.date && (
                  <Text style={creativeModernStyles.dateAccent}>{project.date}</Text>
                )}
              </View>
            </View>
            {project.description && project.description.length > 0 && (
              <View style={creativeModernStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={creativeModernStyles.bulletItem}>
                    <View style={creativeModernStyles.bulletAccent} />
                    <Text style={creativeModernStyles.bulletText}>
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
        <Text style={creativeModernStyles.mainSectionTitle}>Education</Text>
        {resume.education.map((edu, index) => (
          <View key={index} style={creativeModernStyles.entryContainer}>
            <View style={creativeModernStyles.entryHeader}>
              <View style={creativeModernStyles.entryLeft}>
                <Text style={creativeModernStyles.entryTitle}>{edu.school}</Text>
                <Text style={creativeModernStyles.entrySubtitle}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </Text>
                {edu.location && (
                  <Text style={creativeModernStyles.entryLocation}>{edu.location}</Text>
                )}
              </View>
              <View style={creativeModernStyles.entryRight}>
                <Text style={creativeModernStyles.dateAccent}>{edu.date}</Text>
                {edu.gpa && (
                  <Text style={creativeModernStyles.gpaText}>GPA: {edu.gpa}</Text>
                )}
              </View>
            </View>
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={creativeModernStyles.educationAchievements}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={creativeModernStyles.bulletItem}>
                    <View style={creativeModernStyles.bulletAccent} />
                    <Text style={creativeModernStyles.bulletText}>
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

  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={creativeModernStyles.page}>
        {/* Sidebar */}
        <View style={creativeModernStyles.sidebar}>
          <Text style={creativeModernStyles.sidebarName}>
            {resume.first_name}
          </Text>
          <Text style={creativeModernStyles.sidebarName}>
            {resume.last_name}
          </Text>
          {resume.target_role && (
            <Text style={creativeModernStyles.sidebarTitle}>{resume.target_role}</Text>
          )}
          
          {renderContactInfo()}
          {renderSkillsSection()}
        </View>

        {/* Main Content */}
        <View style={creativeModernStyles.mainContent}>
          {renderExperience()}
          {renderProjects()}
          {renderEducation()}
        </View>
      </PDFPage>
    </PDFDocument>
  );
});
