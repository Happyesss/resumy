'use client';

import { memo } from 'react';
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';

// Helper function to parse markdown-style text and return plain text for PDF
const parseMarkdownText = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
};

const modernProfessionalStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 25,
    lineHeight: 1.4,
    color: '#111827'
  },
  
  // Header styles
  header: {
    marginBottom: 16,
    borderLeft: '3pt solid #2563EB',
    paddingLeft: 15,
  },
  
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#111827',
    letterSpacing: 0.5,
  },
  
  targetRole: {
    fontSize: 12,
    color: '#2563EB',
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#4B5563',
  },
  
  contactItem: {
    flexDirection: 'row',
    marginRight: 15,
    marginBottom: 3,
  },
  
  contactLabel: {
    fontFamily: 'Helvetica-Bold',
    marginRight: 4,
  },
  
  contactValue: {
    color: '#2563EB',
  },
  
  // Section styles
  section: {
    marginBottom: 8, 
  },
  
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 6, 
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: '2pt solid #2563EB',
    paddingBottom: 3,
  },
  
  // Experience styles
  experienceItem: {
    marginBottom: 4, 
    paddingLeft: 8,
    borderLeft: '1pt solid #E5E7EB',
    position: 'relative',
  },
  
  experienceDot: {
    width: 8,
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 4,
    position: 'absolute',
    left: -4,
    top: 0,
  },
  
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  
  experienceLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  position: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  
  company: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
    marginBottom: 2,
  },
  
  location: {
    fontSize: 9,
    color: '#4B5563',
  },
  
  dateContainer: {
    backgroundColor: '#F9FAFB',
    padding: 3,
    borderRadius: 3,
  },
  
  date: {
    fontSize: 9,
    color: '#374151',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  
  // Bullet points
  bulletList: {
    marginTop: 3, // reduced from 5
    marginBottom: 5, // reduced from 8
  },
  
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2, // reduced from 3
  },
  
  bulletDot: {
    width: 3,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 1.5,
    marginTop: 3,
    marginRight: 6,
    flexShrink: 0,
  },
  
  bulletText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
    flex: 1,
  },
  
  // Technologies
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 5,
  },
  
  technologiesLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginRight: 5,
  },
  
  technologyTag: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 4,
    paddingTop: 1,
    paddingBottom: 1,
    marginRight: 3,
    marginBottom: 2,
    borderRadius: 2,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  
  // Projects styles
  projectItem: {
    marginBottom: 6, // reduced from 10
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 4,
    borderLeft: '3pt solid #2563EB',
  },
  
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2, // reduced from 4
  },
  
  projectLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  projectName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  
  projectUrl: {
    fontSize: 9,
    color: '#2563EB',
    textDecoration: 'underline',
    fontFamily: 'Helvetica-Bold',
  },
  
  projectDate: {
    backgroundColor: '#FFFFFF',
    padding: 2,
    borderRadius: 2,
    fontSize: 9,
    color: '#4B5563',
    fontFamily: 'Helvetica-Bold',
  },
  
  // Education styles
  educationItem: {
    marginBottom: 5, // reduced from 8
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  educationLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  school: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  
  degree: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
    marginBottom: 2,
  },
  
  gpa: {
    fontSize: 9,
    color: '#4B5563',
    fontFamily: 'Helvetica-Bold',
  },
  
  educationDate: {
    backgroundColor: '#FFFFFF',
    padding: 3,
    borderRadius: 3,
    fontSize: 9,
    color: '#374151',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  
  // Skills styles
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  skillCategory: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 8,
    marginBottom: 5, // reduced from 8
    borderRadius: 4,
  },
  
  skillCategoryTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
    marginBottom: 3, // reduced from 6
  },
  
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  skillItem: {
    backgroundColor: '#FFFFFF',
    color: '#374151',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 6,
    paddingTop: 1,
    paddingBottom: 1,
    marginRight: 3,
    marginBottom: 2, // reduced from 3
    borderRadius: 2,
    border: '0.5pt solid #E5E7EB',
    textAlign: 'center',
    lineHeight: 1.2,
  },
});

interface ModernProfessionalPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const ModernProfessionalPDF = memo(function ModernProfessionalPDF({ resume, variant = 'base' }: ModernProfessionalPDFProps) {
  
  const renderHeader = () => (
    <View style={modernProfessionalStyles.header}>
      <Text style={modernProfessionalStyles.name}>
        {resume.first_name} {resume.last_name}
      </Text>
      
      <View style={modernProfessionalStyles.contactGrid}>
        {resume.email && (
          <View style={modernProfessionalStyles.contactItem}>
            <Text style={modernProfessionalStyles.contactLabel}>Email:</Text>
            <Text style={modernProfessionalStyles.contactValue}>{resume.email}</Text>
          </View>
        )}
        {resume.phone_number && (
          <View style={modernProfessionalStyles.contactItem}>
            <Text style={modernProfessionalStyles.contactLabel}>Phone:</Text>
            <Text>{resume.phone_number}</Text>
          </View>
        )}
        {resume.location && (
          <View style={modernProfessionalStyles.contactItem}>
            <Text style={modernProfessionalStyles.contactLabel}>Location:</Text>
            <Text>{resume.location}</Text>
          </View>
        )}
        {resume.linkedin_url && (
          <View style={modernProfessionalStyles.contactItem}>
            <Text style={modernProfessionalStyles.contactLabel}>LinkedIn:</Text>
            <Text style={modernProfessionalStyles.contactValue}>
              {resume.linkedin_url.replace('https://', '').replace('http://', '')}
            </Text>
          </View>
        )}
        {resume.github_url && (
          <View style={modernProfessionalStyles.contactItem}>
            <Text style={modernProfessionalStyles.contactLabel}>GitHub:</Text>
            <Text style={modernProfessionalStyles.contactValue}>
              {resume.github_url.replace('https://', '').replace('http://', '')}
            </Text>
          </View>
        )}
        {resume.website && (
          <View style={modernProfessionalStyles.contactItem}>
            <Text style={modernProfessionalStyles.contactLabel}>Website:</Text>
            <Text style={modernProfessionalStyles.contactValue}>
              {resume.website.replace('https://', '').replace('http://', '')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <View style={modernProfessionalStyles.section}>
        <Text style={modernProfessionalStyles.sectionTitle}>Professional Experience</Text>
        
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={modernProfessionalStyles.experienceItem}>
            <View style={modernProfessionalStyles.experienceDot} />
            
            <View style={modernProfessionalStyles.experienceHeader}>
              <View style={modernProfessionalStyles.experienceLeft}>
                <Text style={modernProfessionalStyles.position}>{exp.position}</Text>
                <Text style={modernProfessionalStyles.company}>{exp.company}</Text>
                {exp.location && (
                  <Text style={modernProfessionalStyles.location}>{exp.location}</Text>
                )}
              </View>
              <View style={modernProfessionalStyles.dateContainer}>
                <Text style={modernProfessionalStyles.date}>{exp.date}</Text>
              </View>
            </View>
            
            {exp.description && exp.description.length > 0 && (
              <View style={modernProfessionalStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={modernProfessionalStyles.bulletItem}>
                    <View style={modernProfessionalStyles.bulletDot} />
                    <Text style={modernProfessionalStyles.bulletText}>
                      {parseMarkdownText(desc.replace(/^[-•*]\s*/, ''))}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {exp.technologies && exp.technologies.length > 0 && (
              <View style={modernProfessionalStyles.technologiesContainer}>
                <Text style={modernProfessionalStyles.technologiesLabel}>Technologies:</Text>
                {exp.technologies.map((tech, techIndex) => (
                  <Text key={techIndex} style={modernProfessionalStyles.technologyTag}>
                    {tech}
                  </Text>
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
      <View style={modernProfessionalStyles.section}>
        <Text style={modernProfessionalStyles.sectionTitle}>Key Projects</Text>
        
        {resume.projects.map((project, index) => (
          <View key={index} style={modernProfessionalStyles.projectItem}>
            <View style={modernProfessionalStyles.projectHeader}>
              <View style={modernProfessionalStyles.projectLeft}>
                <Text style={modernProfessionalStyles.projectName}>{project.name}</Text>
                {project.url && (
                  <Text style={modernProfessionalStyles.projectUrl}>
                    {project.url.replace('https://', '').replace('http://', '')}
                  </Text>
                )}
              </View>
              {project.date && (
                <Text style={modernProfessionalStyles.projectDate}>{project.date}</Text>
              )}
            </View>
            
            {project.description && project.description.length > 0 && (
              <View style={modernProfessionalStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={modernProfessionalStyles.bulletItem}>
                    <View style={modernProfessionalStyles.bulletDot} />
                    <Text style={modernProfessionalStyles.bulletText}>
                      {parseMarkdownText(desc.replace(/^[-•*]\s*/, ''))}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {project.technologies && project.technologies.length > 0 && (
              <View style={modernProfessionalStyles.technologiesContainer}>
                <Text style={modernProfessionalStyles.technologiesLabel}>Technologies:</Text>
                {project.technologies.map((tech, techIndex) => (
                  <Text key={techIndex} style={modernProfessionalStyles.technologyTag}>
                    {tech}
                  </Text>
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
      <View style={modernProfessionalStyles.section}>
        <Text style={modernProfessionalStyles.sectionTitle}>Education</Text>
        
        {resume.education.map((edu, index) => (
          <View key={index} style={modernProfessionalStyles.educationItem}>
            <View style={modernProfessionalStyles.educationLeft}>
              <Text style={modernProfessionalStyles.school}>{edu.school}</Text>
              <Text style={modernProfessionalStyles.degree}>
                {edu.degree} {edu.field && `in ${edu.field}`}
              </Text>
              {edu.location && (
                <Text style={modernProfessionalStyles.location}>{edu.location}</Text>
              )}
              {edu.gpa && (
                <Text style={modernProfessionalStyles.gpa}>GPA: {edu.gpa}</Text>
              )}
            </View>
            <View style={modernProfessionalStyles.dateContainer}>
              <Text style={modernProfessionalStyles.educationDate}>{edu.date}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View style={modernProfessionalStyles.section}>
        <Text style={modernProfessionalStyles.sectionTitle}>Technical Skills</Text>
        
        <View style={modernProfessionalStyles.skillsGrid}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={modernProfessionalStyles.skillCategory}>
              <Text style={modernProfessionalStyles.skillCategoryTitle}>
                {skillCategory.category}
              </Text>
              <View style={modernProfessionalStyles.skillsContainer}>
                {skillCategory.items.map((skill, skillIndex) => (
                  <Text key={skillIndex} style={modernProfessionalStyles.skillItem}>
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
        {renderHeader()}
        {renderExperience()}
        {renderProjects()}
        {renderEducation()}
        {renderSkills()}
      </PDFPage>
    </PDFDocument>
  );
});
