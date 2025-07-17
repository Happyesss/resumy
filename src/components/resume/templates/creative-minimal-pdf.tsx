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

const creativeMinimalStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8, // further reduced base font
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 1.2,
    color: '#111827',
  },
  // Header styles
  header: {
    position: 'relative',
    marginBottom: 18,
    paddingBottom: 12,
  },
  decorativeLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#10b981', // Emerald-500
  },
  headerContent: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22, // smaller name
    color: '#111827',
    marginBottom: 20, // increased space below name
    textAlign: 'center',
  },
  nameFirst: {
    fontFamily: 'Helvetica',
    fontWeight: 300,
  },
  nameLast: {
    fontFamily: 'Helvetica-Bold',
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactDot: {
    width: 4,
    height: 4,
    backgroundColor: '#10b981', // Emerald-500
    borderRadius: 2,
    marginRight: 5,
  },
  contactText: {
    fontSize: 8,
    color: '#6b7280', // Gray-500
  },
  // Layout styles
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 16,
  },
  leftColumn: {
    width: '32%',
  },
  rightColumn: {
    width: '68%',
  },
  // Section styles
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    position: 'relative',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    fontWeight: 300,
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionUnderline: {
    position: 'absolute',
    bottom: -3,
    left: 0,
    width: 22,
    height: 1,
    backgroundColor: '#10b981', // Emerald-500
  },
  // Skills styles
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#374151', // Gray-800
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 5,
  },
  skillItem: {
    position: 'relative',
    marginBottom: 4,
  },
  skillItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillDot: {
    width: 2,
    height: 2,
    backgroundColor: '#10b981', // Emerald-400
    borderRadius: 1,
    marginRight: 6,
  },
  skillText: {
    fontSize: 8,
    color: '#374151', // Gray-700
    fontFamily: 'Helvetica-Bold',
  },
  skillLevel: {
    marginLeft: 8,
    marginTop: 1,
    height: 2,
    backgroundColor: '#f3f4f6', // Gray-100
    borderRadius: 1,
    overflow: 'hidden',
  },
  skillLevelFill: {
    height: 2,
    backgroundColor: '#10b981', // Emerald-400
    borderRadius: 1,
  },
  // Circular skill tags
  skillTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginTop: 5,
  },
  skillTag: {
    backgroundColor: '#10b981', // Emerald-500
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
    minWidth: 50,
  },
  // Education styles
  educationItem: {
    borderLeftWidth: 1,
    borderLeftColor: '#f3f4f6', // Gray-100
    paddingLeft: 8,
    marginBottom: 10,
  },
  educationSchool: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 1,
  },
  educationDegree: {
    fontSize: 8,
    color: '#10b981', // Teal-600
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  educationDate: {
    fontSize: 7,
    color: '#6b7280', // Gray-500
    marginBottom: 1,
  },
  educationLocation: {
    fontSize: 7,
    color: '#6b7280', // Gray-500
  },
  educationGpa: {
    fontSize: 7,
    color: '#6b7280', // Gray-500
  },
  // Experience styles
  experienceItem: {
    backgroundColor: '#f9fafb', // Gray-50
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#10b981', // Emerald-400
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  experienceLeft: {
    flex: 1,
  },
  experienceRight: {
    alignItems: 'flex-end',
  },
  experiencePosition: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 300,
    color: '#111827',
    marginBottom: 1,
  },
  experienceCompany: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#10b981', // Emerald-600
    marginBottom: 2,
  },
  experienceLocation: {
    fontSize: 7,
    color: '#6b7280', // Gray-600
  },
  experienceDateTag: {
    backgroundColor: '#dcfce7', // Emerald-100
    color: '#047857', // Emerald-700
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  bulletList: {
    marginBottom: 5,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletDot: {
    width: 3,
    height: 3,
    backgroundColor: '#10b981', // Emerald-400
    borderRadius: 1.5,
    marginTop: 3,
    marginRight: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    color: '#374151', // Gray-700
    lineHeight: 1.3,
  },
  techTagsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // Gray-200
    paddingTop: 6,
  },
  techTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  techTag: {
    backgroundColor: '#ffffff',
    color: '#374151', // Gray-700
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb', // Gray-200
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  // Project styles
  projectItem: {
    backgroundColor: '#f9fafb', // Gray-50
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#0d9488', // Teal-400
    marginBottom: 8,
  },
  projectName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  projectLink: {
    fontSize: 7,
    color: '#0d9488', // Teal-600
    textDecoration: 'underline',
    marginBottom: 4,
  },
  projectDateTag: {
    backgroundColor: '#ccfbf1', // Teal-100
    color: '#0f766e', // Teal-700
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
});

interface CreativeMinimalPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const CreativeMinimalPDF = memo(function CreativeMinimalPDF({ resume, variant = 'base' }: CreativeMinimalPDFProps) {
  
  const renderHeader = () => (
    <View style={creativeMinimalStyles.header}>
      <View style={creativeMinimalStyles.headerContent}>
        <Text style={[creativeMinimalStyles.name, creativeMinimalStyles.nameLast]}>
          {resume.first_name} {resume.last_name}
        </Text>
        
        <View style={creativeMinimalStyles.contactGrid}>
          {resume.email && (
            <View style={creativeMinimalStyles.contactItem}>
              <View style={[creativeMinimalStyles.contactDot, { backgroundColor: '#10b981' }]} />
              <Text style={creativeMinimalStyles.contactText}>{resume.email}</Text>
            </View>
          )}
          {resume.phone_number && (
            <View style={creativeMinimalStyles.contactItem}>
              <View style={[creativeMinimalStyles.contactDot, { backgroundColor: '#0d9488' }]} />
              <Text style={creativeMinimalStyles.contactText}>{resume.phone_number}</Text>
            </View>
          )}
          {resume.location && (
            <View style={creativeMinimalStyles.contactItem}>
              <View style={[creativeMinimalStyles.contactDot, { backgroundColor: '#0891b2' }]} />
              <Text style={creativeMinimalStyles.contactText}>{resume.location}</Text>
            </View>
          )}
          {resume.linkedin_url && (
            <View style={creativeMinimalStyles.contactItem}>
              <View style={[creativeMinimalStyles.contactDot, { backgroundColor: '#10b981' }]} />
              <Text style={creativeMinimalStyles.contactText}>
                {resume.linkedin_url.replace('https://', '').replace('http://', '')}
              </Text>
            </View>
          )}
          {resume.github_url && (
            <View style={creativeMinimalStyles.contactItem}>
              <View style={[creativeMinimalStyles.contactDot, { backgroundColor: '#0d9488' }]} />
              <Text style={creativeMinimalStyles.contactText}>
                {resume.github_url.replace('https://', '').replace('http://', '')}
              </Text>
            </View>
          )}
          {resume.website && (
            <View style={creativeMinimalStyles.contactItem}>
              <View style={[creativeMinimalStyles.contactDot, { backgroundColor: '#0891b2' }]} />
              <Text style={creativeMinimalStyles.contactText}>
                {resume.website.replace('https://', '').replace('http://', '')}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={creativeMinimalStyles.decorativeLine} />
    </View>
  );

  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;

    return (
      <View style={creativeMinimalStyles.section}>
        <View style={creativeMinimalStyles.sectionHeader}>
          <Text style={creativeMinimalStyles.sectionTitle}>Expertise</Text>
          <View style={creativeMinimalStyles.sectionUnderline} />
        </View>
        
        {resume.skills.map((skillCategory, index) => (
          <View key={index} style={creativeMinimalStyles.skillCategory}>
            <Text style={creativeMinimalStyles.skillCategoryTitle}>
              {skillCategory.category}
            </Text>
            <View style={creativeMinimalStyles.skillTagsContainer}>
              {skillCategory.items.map((skill, skillIndex) => (
                <Text key={skillIndex} style={creativeMinimalStyles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;

    return (
      <View style={creativeMinimalStyles.section}>
        <View style={creativeMinimalStyles.sectionHeader}>
          <Text style={creativeMinimalStyles.sectionTitle}>Education</Text>
          <View style={[creativeMinimalStyles.sectionUnderline, { backgroundColor: '#0d9488' }]} />
        </View>
        
        {resume.education.map((edu, index) => (
          <View key={index} style={creativeMinimalStyles.educationItem}>
            <Text style={creativeMinimalStyles.educationSchool}>{edu.school}</Text>
            <Text style={creativeMinimalStyles.educationDegree}>
              {edu.degree} {edu.field && `in ${edu.field}`}
            </Text>
            <Text style={creativeMinimalStyles.educationDate}>{edu.date}</Text>
            {edu.location && (
              <Text style={creativeMinimalStyles.educationLocation}>{edu.location}</Text>
            )}
            {edu.gpa && (
              <Text style={creativeMinimalStyles.educationGpa}>GPA: {edu.gpa}</Text>
            )}
            
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={[creativeMinimalStyles.bulletList, { marginTop: 6 }]}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={creativeMinimalStyles.bulletItem}>
                    <View style={[creativeMinimalStyles.bulletDot, { backgroundColor: '#0d9488' }]} />
                    <Text style={creativeMinimalStyles.bulletText}>
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

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <View style={creativeMinimalStyles.section}>
        <View style={creativeMinimalStyles.sectionHeader}>
          <Text style={creativeMinimalStyles.sectionTitle}>Professional Experience</Text>
          <View style={[creativeMinimalStyles.sectionUnderline, { width: 40 }]} />
        </View>
        
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={creativeMinimalStyles.experienceItem}>
            <View style={creativeMinimalStyles.experienceHeader}>
              <View style={creativeMinimalStyles.experienceLeft}>
                <Text style={creativeMinimalStyles.experiencePosition}>{exp.position}</Text>
                <Text style={creativeMinimalStyles.experienceCompany}>{exp.company}</Text>
                {exp.location && (
                  <Text style={creativeMinimalStyles.experienceLocation}>{exp.location}</Text>
                )}
              </View>
              <View style={creativeMinimalStyles.experienceRight}>
                <Text style={creativeMinimalStyles.experienceDateTag}>{exp.date}</Text>
              </View>
            </View>
            
            {exp.description && exp.description.length > 0 && (
              <View style={creativeMinimalStyles.bulletList}>
                {exp.description.map((desc, descIndex) => (
                  <View key={descIndex} style={creativeMinimalStyles.bulletItem}>
                    <View style={creativeMinimalStyles.bulletDot} />
                    <Text style={creativeMinimalStyles.bulletText}>
                      {parseMarkdownText(desc)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {exp.technologies && exp.technologies.length > 0 && (
              <View style={creativeMinimalStyles.techTagsContainer}>
                <View style={creativeMinimalStyles.techTags}>
                  {exp.technologies.map((tech, techIndex) => (
                    <Text key={techIndex} style={creativeMinimalStyles.techTag}>
                      {tech}
                    </Text>
                  ))}
                </View>
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
      <View style={creativeMinimalStyles.section}>
        <View style={creativeMinimalStyles.sectionHeader}>
          <Text style={creativeMinimalStyles.sectionTitle}>Featured Projects</Text>
          <View style={[creativeMinimalStyles.sectionUnderline, { backgroundColor: '#0d9488', width: 40 }]} />
        </View>
        
        {resume.projects.map((project, index) => (
          <View key={index} style={creativeMinimalStyles.projectItem}>
            <View style={creativeMinimalStyles.experienceHeader}>
              <View style={creativeMinimalStyles.experienceLeft}>
                <Text style={creativeMinimalStyles.projectName}>{project.name}</Text>
                {project.url && (
                  <Link src={project.url} style={creativeMinimalStyles.projectLink}>
                    {project.url.replace('https://', '').replace('http://', '')}
                  </Link>
                )}
              </View>
              <View style={creativeMinimalStyles.experienceRight}>
                {project.date && (
                  <Text style={creativeMinimalStyles.projectDateTag}>{project.date}</Text>
                )}
              </View>
            </View>
            
            {project.description && project.description.length > 0 && (
              <View style={creativeMinimalStyles.bulletList}>
                {project.description.map((desc, descIndex) => (
                  <View key={descIndex} style={creativeMinimalStyles.bulletItem}>
                    <View style={[creativeMinimalStyles.bulletDot, { backgroundColor: '#0d9488' }]} />
                    <Text style={creativeMinimalStyles.bulletText}>
                      {parseMarkdownText(desc)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {project.technologies && project.technologies.length > 0 && (
              <View style={creativeMinimalStyles.techTagsContainer}>
                <View style={creativeMinimalStyles.techTags}>
                  {project.technologies.map((tech, techIndex) => (
                    <Text key={techIndex} style={creativeMinimalStyles.techTag}>
                      {tech}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={creativeMinimalStyles.page}>
        {renderHeader()}
        
        <View style={creativeMinimalStyles.twoColumnLayout}>
          <View style={creativeMinimalStyles.leftColumn}>
            {renderSkills()}
            {renderEducation()}
          </View>
          
          <View style={creativeMinimalStyles.rightColumn}>
            {renderExperience()}
            {renderProjects()}
          </View>
        </View>
      </PDFPage>
    </PDFDocument>
  );
});
