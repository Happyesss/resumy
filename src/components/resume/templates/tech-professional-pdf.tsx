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

const techProfessionalStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    lineHeight: 1.4,
    color: '#1a1a1a',
  },
  header: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: 20,
    marginHorizontal: -24,
    marginTop: -20,
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 1,
  },
  title: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    fontFamily: 'Helvetica-Bold',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  contactIcon: {
    width: 4,
    height: 4,
    backgroundColor: '#64748b',
    borderRadius: 2,
    marginRight: 6,
  },
  contactText: {
    fontSize: 9,
    color: '#e2e8f0',
  },
  linkText: {
    fontSize: 9,
    color: '#38bdf8',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginTop: 14,
    marginBottom: 6,
    paddingLeft: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  entryContainer: {
    marginBottom: 10,
    paddingLeft: 4,
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
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 1,
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#0ea5e9',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  entryLocation: {
    fontSize: 8,
    color: '#64748b',
  },
  dateChip: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  gpaText: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 3,
    height: 3,
    backgroundColor: '#0ea5e9',
    borderRadius: 1.5,
    marginRight: 8,
    marginTop: 5,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#374151',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillCategory: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 8,
    width: '48%',
    marginBottom: 6,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  skillTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  skillTag: {
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    fontSize: 7,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 2,
  },
  techChip: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    color: '#0f172a',
    fontSize: 7,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    textAlign: 'center',
  },
  projectUrl: {
    fontSize: 8,
    color: '#0ea5e9',
    marginTop: 2,
  },
});

interface TechProfessionalPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const TechProfessionalPDF = memo(function TechProfessionalPDF({ resume, variant = 'base' }: TechProfessionalPDFProps) {
  
  const renderContactInfo = () => {
    const contactItems = [
      { label: 'Email', value: resume.email },
      { label: 'Phone', value: resume.phone_number },
      { label: 'Location', value: resume.location },
    ].filter(item => item.value);

    const links = [
      resume.linkedin_url?.replace('https://', '').replace('http://', ''),
      resume.github_url?.replace('https://', '').replace('http://', ''),
    ].filter(Boolean);

    if (links.length > 0) {
      contactItems.push({ label: 'Links', value: links.join(' • ') });
    }

    return (
      <View style={techProfessionalStyles.contactGrid}>
        {contactItems.map((item, index) => (
          <View key={index} style={techProfessionalStyles.contactItem}>
            <View style={techProfessionalStyles.contactIcon} />
            <Text style={item.label === 'Links' ? techProfessionalStyles.linkText : techProfessionalStyles.contactText}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTechnicalSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View>
        <Text style={techProfessionalStyles.sectionTitle}>Technical Skills</Text>
        <View style={techProfessionalStyles.skillsContainer}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={techProfessionalStyles.skillCategory}>
              <Text style={techProfessionalStyles.skillCategoryTitle}>
                {skillCategory.category}
              </Text>
              <View style={techProfessionalStyles.skillTagsContainer}>
                {skillCategory.items.map((skill, skillIndex) => (
                  <Text key={skillIndex} style={techProfessionalStyles.skillTag}>
                    {skill}
                  </Text>
                ))}
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
        <Text style={techProfessionalStyles.sectionTitle}>Professional Experience</Text>
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={techProfessionalStyles.entryContainer}>
            <View style={techProfessionalStyles.entryHeader}>
              <View style={techProfessionalStyles.entryLeft}>
                <Text style={techProfessionalStyles.entryTitle}>{exp.position}</Text>
                <Text style={techProfessionalStyles.entrySubtitle}>{exp.company}</Text>
                {exp.location && (
                  <Text style={techProfessionalStyles.entryLocation}>{exp.location}</Text>
                )}
              </View>
              <View style={techProfessionalStyles.entryRight}>
                <Text style={techProfessionalStyles.dateChip}>{exp.date}</Text>
              </View>
            </View>
            {exp.description && exp.description.length > 0 && (
              <View style={techProfessionalStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={techProfessionalStyles.bulletItem}>
                    <View style={techProfessionalStyles.bulletPoint} />
                    <Text style={techProfessionalStyles.bulletText}>
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
        <Text style={techProfessionalStyles.sectionTitle}>Key Projects</Text>
        {resume.projects.map((project, index) => (
          <View key={index} style={techProfessionalStyles.entryContainer}>
            <View style={techProfessionalStyles.projectHeader}>
              <View style={techProfessionalStyles.entryLeft}>
                <Text style={techProfessionalStyles.entryTitle}>{project.name}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <View style={techProfessionalStyles.projectTags}>
                    {project.technologies.map((tech, techIndex) => (
                      <Text key={techIndex} style={techProfessionalStyles.techChip}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
                {project.url && (
                  <Text style={techProfessionalStyles.projectUrl}>
                    {project.url.replace('https://', '').replace('http://', '')}
                  </Text>
                )}
              </View>
              <View style={techProfessionalStyles.entryRight}>
                {project.date && (
                  <Text style={techProfessionalStyles.dateChip}>{project.date}</Text>
                )}
              </View>
            </View>
            {project.description && project.description.length > 0 && (
              <View style={techProfessionalStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={techProfessionalStyles.bulletItem}>
                    <View style={techProfessionalStyles.bulletPoint} />
                    <Text style={techProfessionalStyles.bulletText}>
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
        <Text style={techProfessionalStyles.sectionTitle}>Education</Text>
        {resume.education.map((edu, index) => (
          <View key={index} style={techProfessionalStyles.entryContainer}>
            <View style={techProfessionalStyles.entryHeader}>
              <View style={techProfessionalStyles.entryLeft}>
                <Text style={techProfessionalStyles.entryTitle}>{edu.school}</Text>
                <Text style={techProfessionalStyles.entrySubtitle}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </Text>
                {edu.location && (
                  <Text style={techProfessionalStyles.entryLocation}>{edu.location}</Text>
                )}
              </View>
              <View style={techProfessionalStyles.entryRight}>
                <Text style={techProfessionalStyles.dateChip}>{edu.date}</Text>
                {edu.gpa && (
                  <Text style={techProfessionalStyles.gpaText}>GPA: {edu.gpa}</Text>
                )}
              </View>
            </View>
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={techProfessionalStyles.bulletList}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={techProfessionalStyles.bulletItem}>
                    <View style={techProfessionalStyles.bulletPoint} />
                    <Text style={techProfessionalStyles.bulletText}>
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
      <PDFPage size="LETTER" style={techProfessionalStyles.page}>
        {/* Header */}
        <View style={techProfessionalStyles.header}>
          <Text style={techProfessionalStyles.name}>
            {resume.first_name} {resume.last_name}
          </Text>
          {resume.target_role && (
            <Text style={techProfessionalStyles.title}>{resume.target_role}</Text>
          )}
          {renderContactInfo()}
        </View>

        {/* Technical Skills */}
        {renderTechnicalSkills()}

        {/* Experience */}
        {renderExperience()}

        {/* Projects */}
        {renderProjects()}

        {/* Education */}
        {renderEducation()}
      </PDFPage>
    </PDFDocument>
  );
});
