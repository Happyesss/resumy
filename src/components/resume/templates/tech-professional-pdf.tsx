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
    paddingTop: 24,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    marginHorizontal: -24,
    marginTop: -20,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 18,
    letterSpacing: 1.2,
    position: 'relative',
    zIndex: 1,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 0,
    marginBottom: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    marginBottom: 0,
  },
  contactIcon: {
    width: 4,
    height: 4,
    backgroundColor: '#64748b',
    borderRadius: 2,
    marginRight: 6,
    marginTop: -3,
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
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 2,
    paddingLeft: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    position: 'relative',
  },
  sectionAccent: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#38bdf8',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  entryContainer: {
    marginBottom: 6,
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    marginBottom: -8,
  },
  dateChip: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#7dd3fc',
    minWidth: 0,
    alignSelf: 'flex-end',
    marginBottom: 2,
    lineHeight: 1.1,
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
    marginTop: 3,
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
    borderRadius: 12,
    padding: 10,
    width: '48%',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    position: 'relative',
  },
  skillCategoryAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#0ea5e9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    gap: 4,
  },
  skillTag: {
    backgroundColor: '#0ea5e9',
    color: '#ffffff',
    fontSize: 8,
    paddingHorizontal: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 1.2,
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
    gap: 4,
    marginTop: 3,
  },
  techChip: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    color: '#0f172a',
    fontSize: 8,
    paddingHorizontal: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 1.2,
  },
  projectUrl: {
    fontSize: 8,
    color: '#0ea5e9',
    marginTop: 2,
    marginBottom: -8,
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

    // Prepare links as objects with both url and display text
    const links: { url: string; text: string }[] = [];
    if (resume.linkedin_url) {
      links.push({ url: resume.linkedin_url, text: resume.linkedin_url.replace('https://', '').replace('http://', '') });
    }
    if (resume.github_url) {
      links.push({ url: resume.github_url, text: resume.github_url.replace('https://', '').replace('http://', '') });
    }

    return (
      <>
        <View style={techProfessionalStyles.contactGrid}>
          {contactItems.map((item, index) => (
            <View key={index} style={techProfessionalStyles.contactItem}>
              <View style={techProfessionalStyles.contactIcon} />
              <Text style={techProfessionalStyles.contactText}>
                {item.value}
              </Text>
            </View>
          ))}
          {links.length > 0 && links.map((link, idx) => (
            <View key={link.url} style={techProfessionalStyles.contactItem}>
              <View style={techProfessionalStyles.contactIcon} />
              <Link src={link.url} style={techProfessionalStyles.linkText}>
                {link.text}
              </Link>
            </View>
          ))}
        </View>
      </>
    );
  };

  const renderTechnicalSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View>
        <View style={techProfessionalStyles.sectionTitle}>
          <Text>Technical Skills</Text>
          <View style={techProfessionalStyles.sectionAccent} />
        </View>
        <View style={techProfessionalStyles.skillsContainer}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={techProfessionalStyles.skillCategory}>
              <View style={techProfessionalStyles.skillCategoryAccent} />
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
        <View style={techProfessionalStyles.sectionTitle}>
          <Text>Professional Experience</Text>
          <View style={techProfessionalStyles.sectionAccent} />
        </View>
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
        <View style={techProfessionalStyles.sectionTitle}>
          <Text>Key Projects</Text>
          <View style={techProfessionalStyles.sectionAccent} />
        </View>
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
        <View style={techProfessionalStyles.sectionTitle}>
          <Text>Education</Text>
          <View style={techProfessionalStyles.sectionAccent} />
        </View>
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
                {edu.achievements.map((achievement, achievementIndex) => (
                  <View key={achievementIndex} style={techProfessionalStyles.bulletItem}>
                    <View style={techProfessionalStyles.bulletPoint} />
                    <Text style={techProfessionalStyles.bulletText}>
                      {parseMarkdownText(achievement)}
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
          {renderContactInfo()}
        </View>

        {/* Technical Skills */}
        {renderTechnicalSkills()}

        {/* Experience */}
        {resume.professional_summary && (
          <View style={{ marginBottom: 10 }}>
            <Text style={techProfessionalStyles.sectionTitle}>Professional Summary</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.4, color: '#1f2937' }}>
              {resume.professional_summary}
            </Text>
          </View>
        )}
        {renderExperience()}

        {/* Projects */}
        {renderProjects()}

        {/* Education */}
        {renderEducation()}
      </PDFPage>
    </PDFDocument>
  );
});
