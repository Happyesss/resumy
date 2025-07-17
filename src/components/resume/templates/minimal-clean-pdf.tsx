'use client';

import { memo } from 'react';
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';

// Helper function to parse markdown-style text and return plain text for PDF
const parseMarkdownText = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
};

const minimalCleanStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
    lineHeight: 1.3,
    color: '#111827'
  },
  
  // Header styles
  header: {
    marginBottom: 0,
    textAlign: 'center',
  },
  
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: '#111827',
    letterSpacing: 0.5,
  },
  
  targetRole: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 12,
    fontFamily: 'Helvetica',
  },
  
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 15,
  },
  
  contactItem: {
    marginHorizontal: 4,
  },
  
  contactSeparator: {
    marginHorizontal: 4,
  },
  
  // headerSeparator removed
  
  // Section styles
  section: {
    marginBottom: 10,
  },
  
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 8,
    borderBottom: '0.5pt solid #D1D5DB',
    paddingBottom: 2,
  },
  
  // Experience styles
  experienceItem: {
    marginBottom: 8,
  },
  
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  
  experienceLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  position: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#111827',
    marginBottom: 2,
  },
  
  company: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#111827',
    marginBottom: 1,
  },
  
  location: {
    fontSize: 9,
    color: '#4B5563',
  },
  
  date: {
    fontSize: 9,
    color: '#4B5563',
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },
  
  // Bullet points
  bulletList: {
    marginTop: 4,
    marginBottom: 6,
  },
  
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  
  bulletDot: {
    width: 2,
    height: 2,
    backgroundColor: '#9CA3AF',
    borderRadius: 1,
    marginTop: 4,
    marginRight: 8,
    flexShrink: 0,
  },
  
  bulletText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.3,
    flex: 1,
  },
  
  // Technologies
  technologies: {
    fontSize: 9,
    color: '#4B5563',
    marginTop: 4,
  },
  
  technologiesLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // Projects styles
  projectItem: {
    marginBottom: 6,
  },
  
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  
  projectLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  projectName: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#111827',
    marginBottom: 1,
  },
  
  projectUrl: {
    fontSize: 9,
    color: '#2563EB',
    textDecoration: 'underline',
  },
  
  // Education styles
  educationItem: {
    marginBottom: 5,
  },
  
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  
  educationLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  school: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#111827',
    marginBottom: 1,
  },
  
  degree: {
    fontSize: 11,
    color: '#111827',
    marginBottom: 1,
  },
  
  gpa: {
    fontSize: 9,
    color: '#4B5563',
  },
  
  // Skills styles
  skillsContainer: {
    flexDirection: 'column',
  },
  
  skillCategory: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  
  skillCategoryTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginRight: 4,
  },
  
  skillItems: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
  },
});

interface MinimalCleanPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const MinimalCleanPDF = memo(function MinimalCleanPDF({ resume, variant = 'base' }: MinimalCleanPDFProps) {
  
  const renderHeader = () => (
    <View style={minimalCleanStyles.header}>
      <Text style={minimalCleanStyles.name}>
        {resume.first_name} {resume.last_name}
      </Text>
      {resume.target_role && (
        <Text style={minimalCleanStyles.targetRole}>
          {resume.target_role}
        </Text>
      )}
      <View style={minimalCleanStyles.contactInfo}>
        {resume.email && (
          <Text style={minimalCleanStyles.contactItem}>{resume.email}</Text>
        )}
        {resume.phone_number && (
          <>
            {resume.email && <Text style={minimalCleanStyles.contactSeparator}>•</Text>}
            <Text style={minimalCleanStyles.contactItem}>{resume.phone_number}</Text>
          </>
        )}
        {resume.location && (
          <>
            {(resume.email || resume.phone_number) && <Text style={minimalCleanStyles.contactSeparator}>•</Text>}
            <Text style={minimalCleanStyles.contactItem}>{resume.location}</Text>
          </>
        )}
        {resume.linkedin_url && (
          <>
            {(resume.email || resume.phone_number || resume.location) && <Text style={minimalCleanStyles.contactSeparator}>•</Text>}
            <Text style={minimalCleanStyles.contactItem}>
              {resume.linkedin_url.replace('https://', '').replace('http://', '')}
            </Text>
          </>
        )}
        {resume.github_url && (
          <>
            {(resume.email || resume.phone_number || resume.location || resume.linkedin_url) && <Text style={minimalCleanStyles.contactSeparator}>•</Text>}
            <Text style={minimalCleanStyles.contactItem}>
              {resume.github_url.replace('https://', '').replace('http://', '')}
            </Text>
          </>
        )}
        {resume.website && (
          <>
            {(resume.email || resume.phone_number || resume.location || resume.linkedin_url || resume.github_url) && <Text style={minimalCleanStyles.contactSeparator}>•</Text>}
            <Text style={minimalCleanStyles.contactItem}>
              {resume.website.replace('https://', '').replace('http://', '')}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <View style={minimalCleanStyles.section}>
        <Text style={minimalCleanStyles.sectionTitle}>Professional Experience</Text>
        
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={minimalCleanStyles.experienceItem}>
            <View style={minimalCleanStyles.experienceHeader}>
              <View style={minimalCleanStyles.experienceLeft}>
                <Text style={minimalCleanStyles.position}>{exp.position}</Text>
                <Text style={minimalCleanStyles.company}>{exp.company}</Text>
                {exp.location && (
                  <Text style={minimalCleanStyles.location}>{exp.location}</Text>
                )}
              </View>
              <Text style={minimalCleanStyles.date}>{exp.date}</Text>
            </View>
            
            {exp.description && exp.description.length > 0 && (
              <View style={minimalCleanStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={minimalCleanStyles.bulletItem}>
                    <View style={minimalCleanStyles.bulletDot} />
                    <Text style={minimalCleanStyles.bulletText}>
                      {parseMarkdownText(desc.replace(/^[-•*]\s*/, ''))}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {exp.technologies && exp.technologies.length > 0 && (
              <Text style={minimalCleanStyles.technologies}>
                <Text style={minimalCleanStyles.technologiesLabel}>Technologies:</Text> {exp.technologies.join(', ')}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return null;

    return (
      <View style={minimalCleanStyles.section}>
        <Text style={minimalCleanStyles.sectionTitle}>Projects</Text>
        
        {resume.projects.map((project, index) => (
          <View key={index} style={minimalCleanStyles.projectItem}>
            <View style={minimalCleanStyles.projectHeader}>
              <View style={minimalCleanStyles.projectLeft}>
                <Text style={minimalCleanStyles.projectName}>{project.name}</Text>
                {project.url && (
                  <Text style={minimalCleanStyles.projectUrl}>
                    {project.url.replace('https://', '').replace('http://', '')}
                  </Text>
                )}
              </View>
              {project.date && (
                <Text style={minimalCleanStyles.date}>{project.date}</Text>
              )}
            </View>
            
            {project.description && project.description.length > 0 && (
              <View style={minimalCleanStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={minimalCleanStyles.bulletItem}>
                    <View style={minimalCleanStyles.bulletDot} />
                    <Text style={minimalCleanStyles.bulletText}>
                      {parseMarkdownText(desc.replace(/^[-•*]\s*/, ''))}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {project.technologies && project.technologies.length > 0 && (
              <Text style={minimalCleanStyles.technologies}>
                <Text style={minimalCleanStyles.technologiesLabel}>Technologies:</Text> {project.technologies.join(', ')}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;

    return (
      <View style={minimalCleanStyles.section}>
        <Text style={minimalCleanStyles.sectionTitle}>Education</Text>
        
        {resume.education.map((edu, index) => (
          <View key={index} style={minimalCleanStyles.educationItem}>
            <View style={minimalCleanStyles.educationHeader}>
              <View style={minimalCleanStyles.educationLeft}>
                <Text style={minimalCleanStyles.school}>{edu.school}</Text>
                <Text style={minimalCleanStyles.degree}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </Text>
                {edu.location && (
                  <Text style={minimalCleanStyles.location}>{edu.location}</Text>
                )}
                {edu.gpa && (
                  <Text style={minimalCleanStyles.gpa}>GPA: {edu.gpa}</Text>
                )}
              </View>
              <Text style={minimalCleanStyles.date}>{edu.date}</Text>
            </View>
            
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={minimalCleanStyles.bulletList}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={minimalCleanStyles.bulletItem}>
                    <View style={minimalCleanStyles.bulletDot} />
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
      <View style={minimalCleanStyles.section}>
        <Text style={minimalCleanStyles.sectionTitle}>Skills</Text>
        
        <View style={minimalCleanStyles.skillsContainer}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={minimalCleanStyles.skillCategory}>
              <Text style={minimalCleanStyles.skillCategoryTitle}>
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
        {renderHeader()}
        {renderExperience()}
        {renderProjects()}
        {renderEducation()}
        {renderSkills()}
      </PDFPage>
    </PDFDocument>
  );
});
