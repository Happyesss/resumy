'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { memo } from 'react';

const classicStyles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 5,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginTop: 15,
    marginBottom: 8,
  },
  entryContainer: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  entryLeft: {
    flex: 1,
  },
  entryRight: {
    textAlign: 'right',
    fontSize: 10,
  },
  institution: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  degree: {
    fontStyle: 'italic',
    fontSize: 11,
    marginTop: 1,
  },
  company: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  position: {
    fontStyle: 'italic',
    fontSize: 11,
    marginTop: 1,
  },
  entryLocation: {
    fontSize: 10,
    marginTop: 1,
  },
  bulletList: {
    marginTop: 5,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
    fontSize: 10,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillsColumn: {
    width: '50%',
    paddingRight: 10,
  },
  skillCategory: {
    marginBottom: 5,
  },
  skillCategoryName: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
  },
  skillItems: {
    fontSize: 10,
    marginLeft: 10,
  },
  technicalSkill: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  projectName: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  projectTech: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
  },
  link: {
    color: '#0000FF',
    textDecoration: 'underline',
    fontSize: 10,
  },
});

interface ClassicResumePDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const ClassicResumePDF = memo(function ClassicResumePDF({ resume, variant = 'base' }: ClassicResumePDFProps) {
  
  const renderContactInfo = () => {
    const contactItems = [
      resume.phone_number && `📞 ${resume.phone_number}`,
      resume.email && `✉ ${resume.email}`,
      resume.linkedin_url && `🔗 ${resume.linkedin_url.replace('https://', '')}`,
      resume.github_url && `🐱 ${resume.github_url.replace('https://', '')}`,
    ].filter(Boolean);

    return (
      <View style={classicStyles.contactInfo}>
        {contactItems.map((item, index) => (
          <Text key={index} style={classicStyles.contactItem}>
            {item}
            {index < contactItems.length - 1 && <Text>   </Text>}
          </Text>
        ))}
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
                {edu.location && (
                  <Text style={classicStyles.entryLocation}>{edu.location}</Text>
                )}
              </View>
              <View style={classicStyles.entryRight}>
                <Text>{edu.date}</Text>
                {edu.gpa && <Text>GPA: {edu.gpa}</Text>}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderRelevantCoursework = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View>
        <Text style={classicStyles.sectionTitle}>Relevant Coursework</Text>
        <View style={classicStyles.skillsGrid}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={classicStyles.skillsColumn}>
              <View style={classicStyles.skillCategory}>
                <View style={classicStyles.technicalSkill}>
                  <Text style={classicStyles.bullet}>• </Text>
                  <Text style={classicStyles.skillCategoryName}>
                    {skillCategory.category}:
                  </Text>
                </View>
                <Text style={classicStyles.skillItems}>
                  {skillCategory.items.join(', ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
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
                {exp.location && (
                  <Text style={classicStyles.entryLocation}>{exp.location}</Text>
                )}
              </View>
              <View style={classicStyles.entryRight}>
                <Text>{exp.date}</Text>
              </View>
            </View>
            {exp.description && exp.description.length > 0 && (
              <View style={classicStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={classicStyles.bulletItem}>
                    <Text style={classicStyles.bullet}>• </Text>
                    <Text style={classicStyles.bulletText}>{desc}</Text>
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
                      {' | '}{project.technologies.join(', ')}
                    </Text>
                  )}
                </Text>
                {project.url && (
                  <Link src={project.url} style={classicStyles.link}>
                    {project.url.replace('https://', '')}
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
                    <Text style={classicStyles.bulletText}>{desc}</Text>
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
        {resume.skills.map((skillCategory, index) => (
          <View key={index} style={classicStyles.technicalSkill}>
            <Text style={classicStyles.skillCategoryName}>
              {skillCategory.category}: 
            </Text>
            <Text style={classicStyles.bulletText}>
              {' '}{skillCategory.items.join(', ')}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderLeadership = () => {
    const hasAchievements = resume.education?.some(edu => edu.achievements && edu.achievements.length > 0);
    if (!hasAchievements) return null;

    return (
      <View>
        <Text style={classicStyles.sectionTitle}>Leadership / Extracurricular</Text>
        {resume.education.map((edu, index) => (
          edu.achievements && edu.achievements.length > 0 && (
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
                    <Text style={classicStyles.bulletText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )
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

        {/* Relevant Coursework */}
        {renderRelevantCoursework()}

        {/* Experience */}
        {renderExperience()}

        {/* Projects */}
        {renderProjects()}

        {/* Technical Skills */}
        {renderTechnicalSkills()}

        {/* Leadership */}
        {renderLeadership()}
      </PDFPage>
    </PDFDocument>
  );
});
