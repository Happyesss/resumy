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
        <Text key={index} style={{ fontFamily: 'Times-Bold' }}>
          {boldText}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

const classicStyles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
    lineHeight: 1.2,
  },
  header: {
    textAlign: 'center',
    paddingBottom: 1,
    marginBottom: 0,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 3,
    textAlign: 'center',
  },
  contactItem: {
    marginHorizontal: 3,
  },
  location: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginTop: 5,
    marginBottom: 6,
  },
  entryContainer: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  entryLeft: {
    flex: 1,
  },
  entryRight: {
    textAlign: 'right',
    fontSize: 9,
    width: 120,
    color: '#000000',
    fontFamily: 'Times-Bold',
  },
  institution: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  degree: {
    fontStyle: 'italic',
    fontSize: 10,
    marginTop: 0,
  },
  company: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  position: {
    fontStyle: 'italic',
    fontSize: 10,
    marginTop: 0,
  },
  entryLocation: {
    fontSize: 9,
    marginTop: 0,
    fontFamily: 'Times-Roman',
  },
  bulletList: {
    marginTop: 2,
    marginLeft: 0,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 1,
    fontSize: 10,
  },
  bullet: {
    width: 8,
    fontSize: 10,
    paddingRight: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.3,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillsColumn: {
    width: '50%',
    paddingRight: 8,
  },
  skillCategory: {
    marginBottom: 3,
  },
  skillCategoryName: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  skillItems: {
    fontSize: 10,
    marginLeft: 0,
  },
  technicalSkill: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'flex-start',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  projectName: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  projectTech: {
    fontSize: 9,
    fontFamily: 'Times-Roman',
    fontWeight: 'normal',
  },
  link: {
    color: '#000000',
    textDecoration: 'underline',
    fontSize: 9,
  },
});

interface ClassicResumePDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const ClassicResumePDF = memo(function ClassicResumePDF({ resume, variant = 'base' }: ClassicResumePDFProps) {
  
  const renderContactInfo = () => {
    const contactItems = [
      resume.phone_number,
      resume.email,
      resume.linkedin_url?.replace('https://', '').replace('http://', ''),
      resume.github_url?.replace('https://', '').replace('http://', ''),
    ].filter(Boolean);

    return (
      <View style={classicStyles.contactInfo}>
        <Text>
          {contactItems.join('    ')}
        </Text>
      </View>
    );
  };

  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;

    return (
      <View>
        <Text style={classicStyles.sectionTitle}>Education</Text>
        {resume.education.map((edu, index) => (
          <View key={index} style={classicStyles.entryContainer}>
            <View style={classicStyles.entryHeader}>
              <View style={classicStyles.entryLeft}>
                <Text style={classicStyles.institution}>{edu.school}</Text>
                <Text style={classicStyles.degree}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </Text>
              </View>
              <View style={classicStyles.entryRight}>
                <Text>{edu.date}</Text>
                {edu.location && (
                  <Text style={classicStyles.entryLocation}>{edu.location}</Text>
                )}
                {edu.gpa && <Text>GPA: {edu.gpa}</Text>}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <View>
        <Text style={classicStyles.sectionTitle}>Experience</Text>
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={classicStyles.entryContainer}>
            <View style={classicStyles.entryHeader}>
              <View style={classicStyles.entryLeft}>
                <Text style={classicStyles.company}>{exp.company}</Text>
                <Text style={classicStyles.position}>{exp.position}</Text>
              </View>
              <View style={classicStyles.entryRight}>
                <Text>{exp.date}</Text>
                {exp.location && (
                  <Text style={classicStyles.entryLocation}>{exp.location}</Text>
                )}
              </View>
            </View>
            {exp.description && exp.description.length > 0 && (
              <View style={classicStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={classicStyles.bulletItem}>
                    <Text style={classicStyles.bullet}>• </Text>
                    <Text style={classicStyles.bulletText}>
                      {parseMarkdownText(desc)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {exp.technologies && exp.technologies.length > 0 && (
              <View style={classicStyles.bulletItem}>
                <Text style={classicStyles.bullet}></Text>
                <Text style={classicStyles.bulletText}>
                  <Text style={classicStyles.skillCategoryName}>Technologies: </Text>
                  {exp.technologies.join(', ')}
                </Text>
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
        <Text style={classicStyles.sectionTitle}>Projects</Text>
        {resume.projects.map((project, index) => (
          <View key={index} style={classicStyles.entryContainer}>
            <View style={classicStyles.projectHeader}>
              <View style={classicStyles.entryLeft}>
                <Text style={classicStyles.projectName}>
                  {project.name}
                  {project.technologies && project.technologies.length > 0 && (
                    <Text style={classicStyles.projectTech}>
                      {' ('}{project.technologies.join(', ')}{')'}
                    </Text>
                  )}
                </Text>
                {project.url && (
                  <Link src={project.url} style={classicStyles.link}>
                    {project.url.replace('https://', '').replace('http://', '')}
                  </Link>
                )}
              </View>
              <View style={classicStyles.entryRight}>
                {project.date && <Text>{project.date}</Text>}
              </View>
            </View>
            {project.description && project.description.length > 0 && (
              <View style={classicStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={classicStyles.bulletItem}>
                    <Text style={classicStyles.bullet}>• </Text>
                    <Text style={classicStyles.bulletText}>
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

  const renderTechnicalSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View>
        <Text style={classicStyles.sectionTitle}>Technical Skills</Text>
        <View style={classicStyles.skillsGrid}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={classicStyles.skillsColumn}>
              <View style={classicStyles.technicalSkill}>
                <Text style={classicStyles.skillCategoryName}>
                  {skillCategory.category}:{' '}
                </Text>
                <Text style={classicStyles.bulletText}>
                  {skillCategory.items.join(', ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAchievementsActivities = () => {
    // Check if any education entry has achievements
    const hasEducationAchievements = resume.education && resume.education.some(edu => 
      edu.achievements && edu.achievements.length > 0
    );

    if (!hasEducationAchievements) return null;

    return (
      <View>
        <Text style={classicStyles.sectionTitle}>Leadership / Extracurricular</Text>
        {resume.education.map((edu, index) => (
          edu.achievements && edu.achievements.length > 0 ? (
            <View key={index} style={classicStyles.entryContainer}>
              <View style={classicStyles.entryHeader}>
                <View style={classicStyles.entryLeft}>
                  <Text style={classicStyles.company}>Activities at {edu.school}</Text>
                  <Text style={classicStyles.position}>Student Leadership</Text>
                </View>
                <View style={classicStyles.entryRight}>
                  <Text>{edu.date}</Text>
                </View>
              </View>
              <View style={classicStyles.bulletList}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={classicStyles.bulletItem}>
                    <Text style={classicStyles.bullet}>• </Text>
                    <Text style={classicStyles.bulletText}>
                      {parseMarkdownText(achievement.replace(/^[-•*]\s*/, ''))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null
        ))}
      </View>
    );
  };

  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={classicStyles.page}>
        {/* Header */}
        <View style={classicStyles.header}>
          <Text style={classicStyles.name}>
            {resume.first_name} {resume.last_name}
          </Text>
          {renderContactInfo()}
          {resume.location && (
            <Text style={classicStyles.location}>{resume.location}</Text>
          )}
        </View>

        {/* Education */}
        {renderEducation()}

        {/* Experience */}
        {renderExperience()}

        {/* Projects */}
        {renderProjects()}

        {/* Technical Skills */}
        {renderTechnicalSkills()}

        {/* Achievements & Activities */}
        {renderAchievementsActivities()}

        {/* Leadership / Extracurricular section removed */}
      </PDFPage>
    </PDFDocument>
  );
});
