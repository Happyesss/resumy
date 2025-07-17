'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';
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
    fontSize: 8, // further reduced base font
    lineHeight: 1.2,
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  // Left sidebar styles
  sidebar: {
    width: '35%',
    background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #ec4899 100%)',
    backgroundColor: '#4338ca',
    color: '#ffffff',
    padding: 16,
    flexDirection: 'column',
  },
  sidebarContent: {
    flex: 1,
  },
  avatar: {
    width: 48, // smaller avatar
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  name: {
    fontSize: 16, // smaller name
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    color: '#ffffff',
    lineHeight: 1.1,
  },
  sidebarSection: {
    marginBottom: 16,
  },
  sidebarSectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    paddingBottom: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  contactIcon: {
    width: 12,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    fontSize: 7,
    color: '#c7d2fe',
    flex: 1,
  },
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#c7d2fe',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  skillTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 2,
  },
  skillTagText: {
    fontSize: 7,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
  },
  // Main content styles
  mainContent: {
    flex: 1,
    padding: 18,
    backgroundColor: '#ffffff',
    fontSize: 7,
  },
  section: {
    marginBottom: 12, // less spacing between sections
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#4338ca',
    borderRadius: 4,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#c7d2fe',
    marginLeft: 5,
  },
  // Experience/Project item styles
  entryContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 6,
    height: 6,
    backgroundColor: '#4338ca',
    borderRadius: 3,
  },
  entryContent: {
    marginLeft: 12,
    paddingLeft: 7,
    borderLeftWidth: 2,
    borderLeftColor: '#c7d2fe',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  entryLeft: {
    flex: 1,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryPosition: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  entryCompany: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#4338ca',
    marginBottom: 2,
  },
  entryLocation: {
    fontSize: 7,
    color: '#6b7280',
  },
  dateTag: {
    backgroundColor: '#eef2ff',
    color: '#4338ca',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  bulletList: {
    marginBottom: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletDot: {
    width: 4,
    height: 4,
    backgroundColor: '#4338ca',
    borderRadius: 2,
    marginTop: 3,
    marginRight: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 7,
    color: '#374151',
    lineHeight: 1.3,
  },
  techTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 5,
  },
  techTag: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  // Project specific styles
  projectCard: {
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  projectName: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  projectLink: {
    fontSize: 7,
    color: '#4338ca',
    textDecoration: 'underline',
    marginBottom: 3,
  },
  // Education specific styles
  educationCard: {
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  educationSchool: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  educationDegree: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#ec4899',
    marginBottom: 2,
  },
});

interface CreativeModernPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

// Lucide SVG icons for PDF
const MailIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M4 4h16v16H4V4zm0 0l8 8 8-8"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M22 16.92V21a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

const LocationIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M12 21c-4.418 0-8-5.373-8-10a8 8 0 1 1 16 0c0 4.627-3.582 10-8 10zm0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

const LinkedinIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Path
      d="M2 9h4v12H2z"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Path
      d="M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

const GithubIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M12 2C6.477 2 2 6.484 2 12.021c0 4.418 2.865 8.167 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.529 2.341 1.088 2.91.832.091-.646.349-1.088.635-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.099 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.184 22 16.437 22 12.021 22 6.484 17.523 2 12 2z"
      stroke="#fff"
      strokeWidth={1.2}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

const GlobeIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Path
      d="M2.05 6A9.001 9.001 0 0 1 12 3c2.5 0 4.75.98 6.45 2.6M2.05 18A9.001 9.001 0 0 0 12 21c2.5 0 4.75-.98 6.45-2.6"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Path
      d="M12 3v18"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Path
      d="M3 12h18"
      stroke="#fff"
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

export const CreativeModernPDF = memo(function CreativeModernPDF({ resume, variant = 'base' }: CreativeModernPDFProps) {
  
  const renderSidebar = () => (
    <View style={creativeModernStyles.sidebar}>
      <View style={creativeModernStyles.sidebarContent}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <View style={creativeModernStyles.avatar}>
            <Text style={creativeModernStyles.avatarText}>
              {resume.first_name?.[0]}{resume.last_name?.[0]}
            </Text>
          </View>
          <Text style={creativeModernStyles.name}>
            {resume.first_name} {resume.last_name}
          </Text>
          
          {/* Header divider line */}
          <View style={{
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            marginBottom: 4,
          }} />
        </View>

        {/* Contact Information */}
        <View style={creativeModernStyles.sidebarSection}>
          <Text style={creativeModernStyles.sidebarSectionTitle}>Contact</Text>
          {resume.email && (
            <View style={creativeModernStyles.contactItem}>
              <View style={creativeModernStyles.contactIcon}>
                <MailIcon />
              </View>
              <Text style={creativeModernStyles.contactText}>{resume.email}</Text>
            </View>
          )}
          {resume.phone_number && (
            <View style={creativeModernStyles.contactItem}>
              <View style={creativeModernStyles.contactIcon}>
                <PhoneIcon />
              </View>
              <Text style={creativeModernStyles.contactText}>{resume.phone_number}</Text>
            </View>
          )}
          {resume.location && (
            <View style={creativeModernStyles.contactItem}>
              <View style={creativeModernStyles.contactIcon}>
                <LocationIcon />
              </View>
              <Text style={creativeModernStyles.contactText}>{resume.location}</Text>
            </View>
          )}
          {resume.linkedin_url && (
            <View style={creativeModernStyles.contactItem}>
              <View style={creativeModernStyles.contactIcon}>
                <LinkedinIcon />
              </View>
              <Text style={creativeModernStyles.contactText}>
                {resume.linkedin_url.replace('https://', '').replace('http://', '')}
              </Text>
            </View>
          )}
          {resume.github_url && (
            <View style={creativeModernStyles.contactItem}>
              <View style={creativeModernStyles.contactIcon}>
                <GithubIcon />
              </View>
              <Text style={creativeModernStyles.contactText}>
                {resume.github_url.replace('https://', '').replace('http://', '')}
              </Text>
            </View>
          )}
          {resume.website && (
            <View style={creativeModernStyles.contactItem}>
              <View style={creativeModernStyles.contactIcon}>
                <GlobeIcon />
              </View>
              <Text style={creativeModernStyles.contactText}>
                {resume.website.replace('https://', '').replace('http://', '')}
              </Text>
            </View>
          )}
        </View>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={creativeModernStyles.sidebarSection}>
            <Text style={creativeModernStyles.sidebarSectionTitle}>Skills</Text>
            {resume.skills.map((skillCategory, index) => (
              <View key={index} style={creativeModernStyles.skillCategory}>
                <Text style={creativeModernStyles.skillCategoryTitle}>
                  {skillCategory.category}
                </Text>
                <View style={creativeModernStyles.skillTags}>
                  {skillCategory.items.map((skill, skillIndex) => (
                    <View key={skillIndex} style={creativeModernStyles.skillTag}>
                      <Text style={creativeModernStyles.skillTagText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;

    return (
      <View style={creativeModernStyles.section}>
        <View style={creativeModernStyles.sectionHeader}>
          <View style={creativeModernStyles.sectionIcon} />
          <Text style={creativeModernStyles.sectionTitle}>Experience</Text>
          <View style={creativeModernStyles.sectionLine} />
        </View>
        
        {resume.work_experience.map((exp, index) => (
          <View key={index} style={creativeModernStyles.entryContainer}>
            <View style={creativeModernStyles.timelineDot} />
            <View style={creativeModernStyles.entryContent}>
              <View style={creativeModernStyles.entryHeader}>
                <View style={creativeModernStyles.entryLeft}>
                  <Text style={creativeModernStyles.entryPosition}>{exp.position}</Text>
                  <Text style={creativeModernStyles.entryCompany}>{exp.company}</Text>
                  {exp.location && (
                    <Text style={creativeModernStyles.entryLocation}>{exp.location}</Text>
                  )}
                </View>
                <View style={creativeModernStyles.entryRight}>
                  <Text style={creativeModernStyles.dateTag}>{exp.date}</Text>
                </View>
              </View>
              
              {exp.description && exp.description.length > 0 && (
                <View style={creativeModernStyles.bulletList}>
                  {exp.description.map((desc, descIndex) => (
                    <View key={descIndex} style={creativeModernStyles.bulletItem}>
                      <View style={creativeModernStyles.bulletDot} />
                      <Text style={creativeModernStyles.bulletText}>
                        {parseMarkdownText(desc)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              {exp.technologies && exp.technologies.length > 0 && (
                <View style={creativeModernStyles.techTags}>
                  {exp.technologies.map((tech, techIndex) => (
                    <Text key={techIndex} style={creativeModernStyles.techTag}>
                      {tech}
                    </Text>
                  ))}
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
      <View style={creativeModernStyles.section}>
        <View style={creativeModernStyles.sectionHeader}>
          <View style={creativeModernStyles.sectionIcon} />
          <Text style={creativeModernStyles.sectionTitle}>Projects</Text>
          <View style={creativeModernStyles.sectionLine} />
        </View>
        
        {resume.projects.map((project, index) => {
          // Ensure the link uses https:// if not present
          let displayUrl = project.url;
          let linkUrl = project.url;
          if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
            linkUrl = 'https://' + linkUrl;
          }
          if (displayUrl) {
            displayUrl = displayUrl.replace(/^https?:\/\//i, '');
          }
          return (
            <View key={index} style={creativeModernStyles.projectCard}>
              <View style={creativeModernStyles.entryHeader}>
                <View style={creativeModernStyles.entryLeft}>
                  <Text style={creativeModernStyles.projectName}>{project.name}</Text>
                  {project.url && (
                    <Link src={linkUrl} style={creativeModernStyles.projectLink}>
                      {displayUrl}
                    </Link>
                  )}
                </View>
                <View style={creativeModernStyles.entryRight}>
                  {project.date && (
                    <Text style={creativeModernStyles.dateTag}>{project.date}</Text>
                  )}
                </View>
              </View>
              
              {project.description && project.description.length > 0 && (
                <View style={creativeModernStyles.bulletList}>
                  {project.description.map((desc, descIndex) => (
                    <View key={descIndex} style={creativeModernStyles.bulletItem}>
                      <View style={creativeModernStyles.bulletDot} />
                      <Text style={creativeModernStyles.bulletText}>
                        {parseMarkdownText(desc)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              {project.technologies && project.technologies.length > 0 && (
                <View style={creativeModernStyles.techTags}>
                  {project.technologies.map((tech, techIndex) => (
                    <Text key={techIndex} style={creativeModernStyles.techTag}>
                      {tech}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;

    return (
      <View style={creativeModernStyles.section}>
        <View style={creativeModernStyles.sectionHeader}>
          <View style={creativeModernStyles.sectionIcon} />
          <Text style={creativeModernStyles.sectionTitle}>Education</Text>
          <View style={creativeModernStyles.sectionLine} />
        </View>
        
        {resume.education.map((edu, index) => (
          <View key={index} style={creativeModernStyles.educationCard}>
            <View style={creativeModernStyles.entryHeader}>
              <View style={creativeModernStyles.entryLeft}>
                <Text style={creativeModernStyles.educationSchool}>{edu.school}</Text>
                <Text style={creativeModernStyles.educationDegree}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </Text>
                {edu.location && (
                  <Text style={creativeModernStyles.entryLocation}>{edu.location}</Text>
                )}
              </View>
              <View style={creativeModernStyles.entryRight}>
                <Text style={creativeModernStyles.dateTag}>{edu.date}</Text>
                {edu.gpa && (
                  <Text style={[creativeModernStyles.entryLocation, { marginTop: 2 }]}>
                    GPA: {edu.gpa}
                  </Text>
                )}
              </View>
            </View>
            
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={creativeModernStyles.bulletList}>
                {edu.achievements.map((achievement, achIndex) => (
                  <View key={achIndex} style={creativeModernStyles.bulletItem}>
                    <View style={creativeModernStyles.bulletDot} />
                    <Text style={creativeModernStyles.bulletText}>
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
      <PDFPage size="LETTER" style={creativeModernStyles.page}>
        {renderSidebar()}
        <View style={creativeModernStyles.mainContent}>
          {renderExperience()}
          {renderProjects()}
          {renderEducation()}
        </View>
      </PDFPage>
    </PDFDocument>
  );
});
