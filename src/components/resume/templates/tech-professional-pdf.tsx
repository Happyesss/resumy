'use client';

import { memo } from 'react';
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';

// Helper function to parse markdown-style text and return plain text for PDF
const parseMarkdownText = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
};

const techProfessionalStyles = StyleSheet.create({
  page: {
    fontFamily: 'Courier',
    fontSize: 9,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 1.4,
    color: '#111827',
    backgroundColor: '#FFFFFF'
  },
  
  // Header styles with dark tech theme
  header: {
    backgroundColor: '#111827',
    color: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    borderLeft: '3pt solid #10B981',
    paddingLeft: 18,
  },
  
  name: {
    fontSize: 18,
    fontFamily: 'Courier-Bold',
    marginBottom: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  
  targetRole: {
    fontSize: 11,
    color: '#10B981',
    marginBottom: 10,
    fontFamily: 'Courier-Bold',
  },
  
  contactGrid: {
    flexDirection: 'column',
    fontSize: 8,
  },
  
  contactRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'center',
  },
  
  promptSymbol: {
    color: '#10B981',
    marginRight: 4,
    fontFamily: 'Courier-Bold',
  },
  
  contactLabel: {
    color: '#D1D5DB',
    marginRight: 4,
  },
  
  contactValue: {
    color: '#FFFFFF',
  },
  
  contactLink: {
    color: '#93C5FD',
  },
  
  // Section styles
  section: {
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Courier-Bold',
    color: '#111827',
    marginBottom: 8,
    borderBottom: '2pt solid #10B981',
    paddingBottom: 3,
  },
  
  commentPrefix: {
    color: '#10B981',
  },
  
  // Skills section - prominent for tech roles
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  skillCategory: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderLeft: '3pt solid #10B981',
    padding: 8,
    marginBottom: 8,
    paddingLeft: 11,
  },
  
  skillCategoryTitle: {
    fontSize: 9,
    fontFamily: 'Courier-Bold',
    color: '#10B981',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  skillItem: {
    backgroundColor: '#111827',
    color: '#10B981',
    fontSize: 7,
    fontFamily: 'Courier-Bold',
    paddingHorizontal: 4,
    paddingTop: 1,
    paddingBottom: 1,
    marginRight: 3,
    marginBottom: 2,
    borderRadius: 1,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  
  // Experience styles with terminal theme
  experienceItem: {
    marginBottom: 12,
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 3,
  },
  
  terminalHeader: {
    backgroundColor: '#1F2937',
    padding: 4,
    marginBottom: 6,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  terminalDots: {
    flexDirection: 'row',
    marginRight: 8,
  },
  
  terminalDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 2,
  },
  
  redDot: {
    backgroundColor: '#EF4444',
  },
  
  yellowDot: {
    backgroundColor: '#F59E0B',
  },
  
  greenDot: {
    backgroundColor: '#10B981',
  },
  
  terminalTitle: {
    fontSize: 8,
    color: '#D1D5DB',
    fontFamily: 'Courier',
  },
  
  terminalContent: {
    color: '#10B981',
  },
  
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  
  experienceLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  terminalField: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  
  fieldLabel: {
    color: '#FFFFFF',
    marginRight: 4,
  },
  
  position: {
    color: '#93C5FD',
    fontFamily: 'Courier-Bold',
  },
  
  company: {
    color: '#FDE047',
    fontFamily: 'Courier-Bold',
  },
  
  location: {
    color: '#D1D5DB',
  },
  
  dateContainer: {
    backgroundColor: '#1F2937',
    padding: 3,
    borderRadius: 2,
  },
  
  date: {
    fontSize: 8,
    color: '#D1D5DB',
    fontFamily: 'Courier',
    textAlign: 'right',
  },
  
  achievementsLabel: {
    color: '#FFFFFF',
    marginBottom: 4,
    marginTop: 6,
  },
  
  // Bullet points
  bulletList: {
    marginTop: 4,
  },
  
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  
  bulletArrow: {
    color: '#10B981',
    marginRight: 6,
    marginTop: 1,
    fontFamily: 'Courier-Bold',
  },
  
  bulletText: {
    fontSize: 8,
    color: '#D1D5DB',
    lineHeight: 1.3,
    flex: 1,
  },
  
  // Technologies
  techStackLabel: {
    color: '#FFFFFF',
    marginBottom: 4,
    marginTop: 6,
  },
  
  technologiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  technologyTag: {
    backgroundColor: '#10B981',
    color: '#111827',
    fontSize: 7,
    fontFamily: 'Courier-Bold',
    paddingHorizontal: 3,
    paddingTop: 1,
    paddingBottom: 1,
    marginRight: 3,
    marginBottom: 2,
    borderRadius: 1,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  
  // Projects styles
  projectItem: {
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    border: '0.5pt solid #E5E7EB',
    padding: 8,
    borderRadius: 3,
  },
  
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  
  projectLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  projectName: {
    fontSize: 10,
    fontFamily: 'Courier-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  
  projectUrl: {
    fontSize: 8,
    color: '#2563EB',
    textDecoration: 'underline',
    fontFamily: 'Courier',
  },
  
  projectDate: {
    backgroundColor: '#1F2937',
    color: '#10B981',
    padding: 2,
    borderRadius: 2,
    fontSize: 8,
    fontFamily: 'Courier',
  },
  
  projectBulletArrow: {
    color: '#10B981',
    marginRight: 6,
    marginTop: 1,
    fontFamily: 'Courier-Bold',
  },
  
  projectBulletText: {
    fontSize: 8,
    color: '#374151',
    lineHeight: 1.3,
    flex: 1,
  },
  
  projectTechContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  
  projectTechTag: {
    backgroundColor: '#111827',
    color: '#10B981',
    fontSize: 7,
    fontFamily: 'Courier',
    paddingHorizontal: 3,
    paddingTop: 1,
    paddingBottom: 1,
    marginRight: 2,
    marginBottom: 2,
    borderRadius: 1,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  
  // Education styles
  educationItem: {
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderLeft: '3pt solid #10B981',
    padding: 8,
    paddingLeft: 11,
    borderRadius: 1,
  },
  
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  
  educationLeft: {
    flex: 1,
    paddingRight: 10,
  },
  
  school: {
    fontSize: 10,
    fontFamily: 'Courier-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  
  degree: {
    fontSize: 9,
    fontFamily: 'Courier-Bold',
    color: '#10B981',
    marginBottom: 2,
  },
  
  gpa: {
    fontSize: 8,
    color: '#4B5563',
    fontFamily: 'Courier',
  },
  
  educationDate: {
    backgroundColor: '#111827',
    color: '#10B981',
    padding: 3,
    borderRadius: 2,
    fontSize: 8,
    fontFamily: 'Courier',
    textAlign: 'center',
  },
});

interface TechProfessionalPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const TechProfessionalPDF = memo(function TechProfessionalPDF({ resume, variant = 'base' }: TechProfessionalPDFProps) {
  
  const renderHeader = () => (
    <View style={techProfessionalStyles.header}>
      <Text style={techProfessionalStyles.name}>
        {resume.first_name} {resume.last_name}
      </Text>
      
      <View style={techProfessionalStyles.contactGrid}>
        {resume.email && (
          <View style={techProfessionalStyles.contactRow}>
            <Text style={techProfessionalStyles.promptSymbol}>$</Text>
            <Text style={techProfessionalStyles.contactLabel}>email:</Text>
            <Text style={techProfessionalStyles.contactValue}>{resume.email}</Text>
          </View>
        )}
        {resume.phone_number && (
          <View style={techProfessionalStyles.contactRow}>
            <Text style={techProfessionalStyles.promptSymbol}>$</Text>
            <Text style={techProfessionalStyles.contactLabel}>phone:</Text>
            <Text style={techProfessionalStyles.contactValue}>{resume.phone_number}</Text>
          </View>
        )}
        {resume.location && (
          <View style={techProfessionalStyles.contactRow}>
            <Text style={techProfessionalStyles.promptSymbol}>$</Text>
            <Text style={techProfessionalStyles.contactLabel}>location:</Text>
            <Text style={techProfessionalStyles.contactValue}>{resume.location}</Text>
          </View>
        )}
        {resume.linkedin_url && (
          <View style={techProfessionalStyles.contactRow}>
            <Text style={techProfessionalStyles.promptSymbol}>$</Text>
            <Text style={techProfessionalStyles.contactLabel}>linkedin:</Text>
            <Text style={techProfessionalStyles.contactLink}>
              {resume.linkedin_url.replace('https://', '').replace('http://', '')}
            </Text>
          </View>
        )}
        {resume.github_url && (
          <View style={techProfessionalStyles.contactRow}>
            <Text style={techProfessionalStyles.promptSymbol}>$</Text>
            <Text style={techProfessionalStyles.contactLabel}>github:</Text>
            <Text style={techProfessionalStyles.contactLink}>
              {resume.github_url.replace('https://', '').replace('http://', '')}
            </Text>
          </View>
        )}
        {resume.website && (
          <View style={techProfessionalStyles.contactRow}>
            <Text style={techProfessionalStyles.promptSymbol}>$</Text>
            <Text style={techProfessionalStyles.contactLabel}>website:</Text>
            <Text style={techProfessionalStyles.contactLink}>
              {resume.website.replace('https://', '').replace('http://', '')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View style={techProfessionalStyles.section}>
        <Text style={techProfessionalStyles.sectionTitle}>
          <Text style={techProfessionalStyles.commentPrefix}>// </Text>Technical Stack
        </Text>
        
        <View style={techProfessionalStyles.skillsGrid}>
          {resume.skills.map((skillCategory, index) => (
            <View key={index} style={techProfessionalStyles.skillCategory}>
              <Text style={techProfessionalStyles.skillCategoryTitle}>
                {skillCategory.category.toUpperCase()}
              </Text>
              <View style={techProfessionalStyles.skillsContainer}>
                {skillCategory.items.map((skill, skillIndex) => (
                  <Text key={skillIndex} style={techProfessionalStyles.skillItem}>
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
      <View style={techProfessionalStyles.section}>
        <Text style={techProfessionalStyles.sectionTitle}>
          <Text style={techProfessionalStyles.commentPrefix}>// </Text>Experience
        </Text>
        
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={techProfessionalStyles.experienceItem}>
            <View style={techProfessionalStyles.terminalHeader}>
              <View style={techProfessionalStyles.terminalDots}>
                <View style={[techProfessionalStyles.terminalDot, techProfessionalStyles.redDot]} />
                <View style={[techProfessionalStyles.terminalDot, techProfessionalStyles.yellowDot]} />
                <View style={[techProfessionalStyles.terminalDot, techProfessionalStyles.greenDot]} />
              </View>
              <Text style={techProfessionalStyles.terminalTitle}>
                {exp.company.toLowerCase().replace(/\s+/g, '-')}.terminal
              </Text>
            </View>
            
            <View style={techProfessionalStyles.terminalContent}>
              <View style={techProfessionalStyles.experienceHeader}>
                <View style={techProfessionalStyles.experienceLeft}>
                  <View style={techProfessionalStyles.terminalField}>
                    <Text style={techProfessionalStyles.fieldLabel}>position:</Text>
                    <Text style={techProfessionalStyles.position}>{exp.position}</Text>
                  </View>
                  <View style={techProfessionalStyles.terminalField}>
                    <Text style={techProfessionalStyles.fieldLabel}>company:</Text>
                    <Text style={techProfessionalStyles.company}>{exp.company}</Text>
                  </View>
                  {exp.location && (
                    <View style={techProfessionalStyles.terminalField}>
                      <Text style={techProfessionalStyles.fieldLabel}>location:</Text>
                      <Text style={techProfessionalStyles.location}>{exp.location}</Text>
                    </View>
                  )}
                </View>
                <View style={techProfessionalStyles.dateContainer}>
                  <Text style={techProfessionalStyles.date}>{exp.date}</Text>
                </View>
              </View>
              
              {exp.description && exp.description.length > 0 && (
                <View>
                  <Text style={techProfessionalStyles.achievementsLabel}>achievements:</Text>
                  <View style={techProfessionalStyles.bulletList}>
                    {exp.description.map((desc, descIndex) => (
                      <View key={descIndex} style={techProfessionalStyles.bulletItem}>
                        <Text style={techProfessionalStyles.bulletArrow}>→</Text>
                        <Text style={techProfessionalStyles.bulletText}>
                          {parseMarkdownText(desc.replace(/^[-•*]\s*/, ''))}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {exp.technologies && exp.technologies.length > 0 && (
                <View>
                  <Text style={techProfessionalStyles.techStackLabel}>tech_stack:</Text>
                  <View style={techProfessionalStyles.technologiesContainer}>
                    {exp.technologies.map((tech, techIndex) => (
                      <Text key={techIndex} style={techProfessionalStyles.technologyTag}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return null;

    return (
      <View style={techProfessionalStyles.section}>
        <Text style={techProfessionalStyles.sectionTitle}>
          <Text style={techProfessionalStyles.commentPrefix}>// </Text>Projects
        </Text>
        
        {resume.projects.map((project, index) => (
          <View key={index} style={techProfessionalStyles.projectItem}>
            <View style={techProfessionalStyles.projectHeader}>
              <View style={techProfessionalStyles.projectLeft}>
                <Text style={techProfessionalStyles.projectName}>{project.name}</Text>
                {project.url && (
                  <Text style={techProfessionalStyles.projectUrl}>
                    {project.url.replace('https://', '').replace('http://', '')}
                  </Text>
                )}
              </View>
              {project.date && (
                <Text style={techProfessionalStyles.projectDate}>{project.date}</Text>
              )}
            </View>
            
            {project.description && project.description.length > 0 && (
              <View style={techProfessionalStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={techProfessionalStyles.bulletItem}>
                    <Text style={techProfessionalStyles.projectBulletArrow}>{'>'}</Text>
                    <Text style={techProfessionalStyles.projectBulletText}>
                      {parseMarkdownText(desc.replace(/^[-•*]\s*/, ''))}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {project.technologies && project.technologies.length > 0 && (
              <View style={techProfessionalStyles.projectTechContainer}>
                {project.technologies.map((tech, techIndex) => (
                  <Text key={techIndex} style={techProfessionalStyles.projectTechTag}>
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
      <View style={techProfessionalStyles.section}>
        <Text style={techProfessionalStyles.sectionTitle}>
          <Text style={techProfessionalStyles.commentPrefix}>// </Text>Education
        </Text>
        
        {resume.education.map((edu, index) => (
          <View key={index} style={techProfessionalStyles.educationItem}>
            <View style={techProfessionalStyles.educationHeader}>
              <View style={techProfessionalStyles.educationLeft}>
                <Text style={techProfessionalStyles.school}>{edu.school}</Text>
                <Text style={techProfessionalStyles.degree}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </Text>
                {edu.location && (
                  <Text style={techProfessionalStyles.location}>{edu.location}</Text>
                )}
                {edu.gpa && (
                  <Text style={techProfessionalStyles.gpa}>GPA: {edu.gpa}</Text>
                )}
              </View>
              <Text style={techProfessionalStyles.educationDate}>{edu.date}</Text>
            </View>
            
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={techProfessionalStyles.bulletList}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={techProfessionalStyles.bulletItem}>
                    <Text style={techProfessionalStyles.projectBulletArrow}>{'>'}</Text>
                    <Text style={techProfessionalStyles.projectBulletText}>
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
        {renderHeader()}
        {renderSkills()}
        {renderExperience()}
        {renderProjects()}
        {renderEducation()}
      </PDFPage>
    </PDFDocument>
  );
});
