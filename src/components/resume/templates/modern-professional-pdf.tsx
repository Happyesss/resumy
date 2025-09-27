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

const modernProfessionalStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 18,
    lineHeight: 1.3,
    color: '#1f2937',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  nameAccent: {
    color: '#2563eb',
  },
  targetRole: {
    fontSize: 11,
    color: '#4b5563',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  contactItem: {
    width: '23%',
    minWidth: 80,
    marginBottom: 2,
  },
  contactLabel: {
    fontSize: 7,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 9,
    color: '#1f2937',
    fontFamily: 'Helvetica-Bold',
  },
  linkValue: {
    fontSize: 9,
    color: '#2563eb',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionLine: {
    height: 1,
    backgroundColor: '#2563eb',
    marginBottom: 6,
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
    paddingRight: 10,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#2563eb',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  entryLocation: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: -8, // reduce margin below location in experience
  },
  dateTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    paddingBottom: -5,
    borderRadius: 10,
    fontSize: 8,
    color: '#374151',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  gpaText: {
    fontSize: 8,
    color: '#4b5563',
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
  bulletPoint: {
    width: 4,
    height: 4,
    backgroundColor: '#2563eb',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#374151',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillCategory: {
    backgroundColor: '#f9fafb',
    padding: 6,
    borderRadius: 6,
    width: '48%',
    marginBottom: 4,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  skillTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  skillTag: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingTop: 1,
    paddingBottom: 0,
    fontSize: 8,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 1.2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  projectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 2,
  },
  techTag: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontSize: 8,
    paddingHorizontal: 6,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 1,
    lineHeight: 1.2,
  },
  projectUrl: {
    fontSize: 8,
    color: '#2563eb',
    marginTop: 2,
    marginBottom: -6
  },
});

interface ModernProfessionalPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const ModernProfessionalPDF = memo(function ModernProfessionalPDF({ resume, variant = 'base' }: ModernProfessionalPDFProps) {
  
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
      <View style={modernProfessionalStyles.contactGrid}>
        {contactItems.map((item, index) => (
          <View key={index} style={modernProfessionalStyles.contactItem}>
            <Text style={modernProfessionalStyles.contactLabel}>
              {item.label}
            </Text>
            <Text style={item.label === 'Links' ? modernProfessionalStyles.linkValue : modernProfessionalStyles.contactValue}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <View>
        <View>
          <Text style={modernProfessionalStyles.sectionTitle}>Professional Experience</Text>
          <View style={modernProfessionalStyles.sectionLine} />
        </View>
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={modernProfessionalStyles.entryContainer}>
            <View style={modernProfessionalStyles.entryHeader}>
              <View style={modernProfessionalStyles.entryLeft}>
                <Text style={modernProfessionalStyles.entryTitle}>{exp.position}</Text>
                <Text style={modernProfessionalStyles.entrySubtitle}>{exp.company}</Text>
                {exp.location && (
                  <Text style={modernProfessionalStyles.entryLocation}>{exp.location}</Text>
                )}
              </View>
              <View style={modernProfessionalStyles.entryRight}>
                <Text style={modernProfessionalStyles.dateTag}>{exp.date}</Text>
              </View>
            </View>
            {exp.description && exp.description.length > 0 && (
              <View style={modernProfessionalStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={modernProfessionalStyles.bulletItem}>
                    <View style={modernProfessionalStyles.bulletPoint} />
                    <Text style={modernProfessionalStyles.bulletText}>
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
        <View>
          <Text style={modernProfessionalStyles.sectionTitle}>Education</Text>
          <View style={modernProfessionalStyles.sectionLine} />
        </View>
        {resume.education.map((edu, index) => (
          <View key={index} style={modernProfessionalStyles.entryContainer}>
            <View style={modernProfessionalStyles.entryHeader}>
              <View style={modernProfessionalStyles.entryLeft}>
                <Text style={modernProfessionalStyles.entryTitle}>{edu.school}</Text>
                <Text style={modernProfessionalStyles.entrySubtitle}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </Text>
                {edu.location && (
                  <Text style={modernProfessionalStyles.entryLocation}>{edu.location}</Text>
                )}
              </View>
              <View style={modernProfessionalStyles.entryRight}>
                <Text style={modernProfessionalStyles.dateTag}>{edu.date}</Text>
                {edu.gpa && (
                  <Text style={modernProfessionalStyles.gpaText}>GPA: {edu.gpa}</Text>
                )}
              </View>
            </View>
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={modernProfessionalStyles.bulletList}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={modernProfessionalStyles.bulletItem}>
                    <View style={modernProfessionalStyles.bulletPoint} />
                    <Text style={modernProfessionalStyles.bulletText}>
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

  const renderProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return null;

    return (
      <View>
        <View>
          <Text style={modernProfessionalStyles.sectionTitle}>Key Projects</Text>
          <View style={modernProfessionalStyles.sectionLine} />
        </View>
        {resume.projects.map((project, index) => (
          <View key={index} style={modernProfessionalStyles.entryContainer}>
            <View style={modernProfessionalStyles.projectHeader}>
              <View style={modernProfessionalStyles.entryLeft}>
                <Text style={modernProfessionalStyles.entryTitle}>{project.name}</Text>
                {project.technologies && project.technologies.length > 0 && (
                  <View style={modernProfessionalStyles.projectTags}>
                    {project.technologies.map((tech, techIndex) => (
                      <Text key={techIndex} style={modernProfessionalStyles.techTag}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
                {project.url && (
                  <Text style={modernProfessionalStyles.projectUrl}>
                    {project.url.replace('https://', '').replace('http://', '')}
                  </Text>
                )}
              </View>
              <View style={modernProfessionalStyles.entryRight}>
                {project.date && (
                  <Text style={modernProfessionalStyles.dateTag}>{project.date}</Text>
                )}
              </View>
            </View>
            {project.description && project.description.length > 0 && (
              <View style={modernProfessionalStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={modernProfessionalStyles.bulletItem}>
                    <View style={modernProfessionalStyles.bulletPoint} />
                    <Text style={modernProfessionalStyles.bulletText}>
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
        <View>
          <Text style={modernProfessionalStyles.sectionTitle}>Technical Skills</Text>
          <View style={modernProfessionalStyles.sectionLine} />
        </View>
        <View style={modernProfessionalStyles.skillsGrid}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={modernProfessionalStyles.skillCategory}>
              <Text style={modernProfessionalStyles.skillCategoryTitle}>
                {skillCategory.category}
              </Text>
              <View style={modernProfessionalStyles.skillTagsContainer}>
                {skillCategory.items.map((skill, skillIndex) => (
                  <Text key={skillIndex} style={modernProfessionalStyles.skillTag}>
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



  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={modernProfessionalStyles.page}>
        {/* Header */}
        <View style={modernProfessionalStyles.header}>
          <Text style={modernProfessionalStyles.name}>
            {resume.first_name} <Text style={modernProfessionalStyles.nameAccent}>{resume.last_name}</Text>
          </Text>
          {renderContactInfo()}
        </View>

        {/* Professional Summary */}
        {resume.professional_summary && (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#1f2937' }}>
              {parseMarkdownText(resume.professional_summary)}
            </Text>
          </View>
        )}
        {renderExperience()}

        {/* Education */}
        {renderEducation()}

        {/* Projects */}
        {renderProjects()}

        {/* Technical Skills */}
        {renderTechnicalSkills()}
      </PDFPage>
    </PDFDocument>
  );
});
