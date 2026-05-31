'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Link, Page as PDFPage, Path, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import { memo } from 'react';

// ── SVG icon primitives (sized to sit beside 9-10pt text) ─────────────────────
const PhoneIcon = () => (
  <Svg width={9} height={9} viewBox="0 0 24 24" style={{ marginRight: 2 }}>
    <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#2E2E2E" />
  </Svg>
);
const EmailIcon = () => (
  <Svg width={9} height={9} viewBox="0 0 24 24" style={{ marginRight: 2 }}>
    <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#2E2E2E" />
  </Svg>
);
const WebIcon = () => (
  <Svg width={9} height={9} viewBox="0 0 24 24" style={{ marginRight: 2 }}>
    <Path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" fill="#0E5484" />
  </Svg>
);
const LinkedInIcon = () => (
  <Svg width={9} height={9} viewBox="0 0 24 24" style={{ marginRight: 2 }}>
    <Path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="#0E5484" />
  </Svg>
);
const GithubIcon = () => (
  <Svg width={9} height={9} viewBox="0 0 24 24" style={{ marginRight: 2 }}>
    <Path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#2E2E2E" />
  </Svg>
);
const ExternalLinkIcon = () => (
  <Svg width={8} height={8} viewBox="0 0 24 24" style={{ marginLeft: 2 }}>
    <Path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" fill="#0E5484" />
  </Svg>
);

// Utility: parse **bold** markdown — uses Times-Bold to match the serif body font
const parseMarkdownText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} style={{ fontFamily: 'Times-Bold' }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

// Colours from the LaTeX \definecolor declarations
const COLOR = {
  black: '#130810',
  cvblue: '#0E5484',
  slateGrey: '#2E2E2E',
  lightGrey: '#666666',
};

// LaTeX document is 11pt base. Sizes used:
//   \Huge  ≈ 24pt  (name)
//   \large ≈ 12pt  (company / role / degree)
//   \normalsize = 11pt  (body)
//   \small ≈ 9pt   (date / location chips)
//   \small contact row ≈ 9pt
const abeyStyles = StyleSheet.create({
  page: {
    // Default LaTeX font = Computer Modern (serif). Closest in react-pdf = Times-Roman.
    fontFamily: 'Times-Roman',
    fontSize: 11,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    lineHeight: 1.25,
    color: COLOR.slateGrey,
    backgroundColor: '#ffffff',
  },

  // ── Header (\begin{center} block) ────────────────────────────────────
  header: {
    textAlign: 'center',
    marginBottom: 4,
  },
  // \Huge \scshape — \Huge in 11pt base doc = ~20.74pt
  name: {
    fontSize: 21,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLOR.black,
    marginBottom: 10,  // enough gap so location never touches the name
    textAlign: 'center',
  },
  // Location line below name
  locationLine: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: COLOR.slateGrey,
    marginBottom: 4,
    textAlign: 'center',
  },
  // Contact row: each item is a small flex-row View with icon + link
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 0,
  },
  // Each icon+link pair
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  // Link text next to icon — black underlined (not blue)
  contactLink: {
    fontSize: 9,
    fontFamily: 'Times-Roman',
    color: COLOR.black,
    textDecoration: 'underline',
  },
  // Tilde separator between items
  contactSep: {
    fontSize: 9,
    fontFamily: 'Times-Roman',
    color: COLOR.slateGrey,
    marginHorizontal: 3,
  },

  // ── Section heading (\titleformat{\section}) ─────────────────────────
  // \scshape\raggedright\large\bfseries + \color{black}\titlerule
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLOR.black,
    paddingBottom: 2,
    marginTop: 10,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },

  // ── Entry rows (\resumeSubheading{Co}{Date}{Role}{Loc}) ──────────────
  entryContainer: {
    marginBottom: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // flex:1 eats all remaining width so the right column is pushed flush to the right
  entryLeft: {
    flex: 1,
    paddingRight: 8,
  },
  // Fixed width + alignItems:flex-end = children right-aligned to the page edge
  entryRight: {
    width: 95,
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  // \textbf{\large Company}  →  Times-Bold 12pt
  entryTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    color: COLOR.black,
  },
  // \textbf{\small Date}  →  Times-Bold 9pt, right-aligned within fixed column
  entryDate: {
    fontSize: 9,
    fontFamily: 'Times-Bold',
    color: COLOR.black,
    textAlign: 'right',
  },
  // \textit{\large Role/Degree}  →  Times-Italic 12pt
  entrySubtitle: {
    fontSize: 12,
    fontFamily: 'Times-Italic',
    color: COLOR.slateGrey,
  },
  // \textit{\small Location}  →  Times-Italic 9pt, right-aligned within fixed column
  entryLocation: {
    fontSize: 9,
    fontFamily: 'Times-Italic',
    color: COLOR.slateGrey,
    textAlign: 'right',
  },

  // ── Bullet list (\resumeItemListStart) ───────────────────────────────
  bulletList: {
    marginTop: 2,
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: COLOR.slateGrey,
  },
  // \normalsize bullet text
  bulletText: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Times-Roman',
    lineHeight: 1.3,
    color: COLOR.slateGrey,
  },

  // ── Project heading (\resumeProjectHeading) ───────────────────────────
  projectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  projectLeft: {
    flex: 1,
    paddingRight: 8,
  },
  // Bold underlined project name — black, underlined
  projectNameLink: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: COLOR.black,
    textDecoration: 'underline',
  },
  projectNamePlain: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: COLOR.black,
    textDecoration: 'underline',
  },
  projectPipe: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: COLOR.slateGrey,
  },
  // Tech stack underlined (matches \underline in LaTeX)
  projectTech: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: COLOR.slateGrey,
    textDecoration: 'underline',
  },
  projectDate: {
    fontSize: 9,
    fontFamily: 'Times-Bold',
    color: COLOR.black,
    textAlign: 'right',
    width: 95,
    flexShrink: 0,
  },

  // ── Technical Skills ─────────────────────────────────────────────────
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  skillLabel: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: COLOR.black,
    marginRight: 2,
  },
  skillItems: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: COLOR.slateGrey,
    flex: 1,
  },
});

interface SoftwareEngineerPDFProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const SoftwareEngineerPDF = memo(function SoftwareEngineerPDF({ resume, variant: _variant = 'base' }: SoftwareEngineerPDFProps) {
  // ── Helpers ────────────────────────────────────────────────────────────
  const ensureHttps = (url: string) =>
    url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

  // ── Contact row ────────────────────────────────────────────────────────
  const renderContact = () => {
    // Each entry: { icon, href, label }
    type ContactEntry = { key: string; icon: React.ReactNode; href: string; label: string };
    const entries: ContactEntry[] = [];

    if (resume.phone_number)
      entries.push({ key: 'phone', icon: <PhoneIcon />, href: `tel:${resume.phone_number}`, label: resume.phone_number });
    if (resume.email)
      entries.push({ key: 'email', icon: <EmailIcon />, href: `mailto:${resume.email}`, label: resume.email });
    if (resume.website)
      entries.push({ key: 'web', icon: <WebIcon />, href: ensureHttps(resume.website), label: 'Portfolio' });
    if (resume.linkedin_url)
      entries.push({ key: 'li', icon: <LinkedInIcon />, href: ensureHttps(resume.linkedin_url), label: 'LinkedIn' });
    if (resume.github_url)
      entries.push({ key: 'gh', icon: <GithubIcon />, href: ensureHttps(resume.github_url), label: 'GitHub' });

    const nodes: React.ReactNode[] = [];
    entries.forEach((e, i) => {
      nodes.push(
        <View key={e.key} style={abeyStyles.contactItem}>
          {e.icon}
          <Link src={e.href} style={abeyStyles.contactLink}>
            <Text>{e.label}</Text>
          </Link>
        </View>
      );
      if (i < entries.length - 1)
        nodes.push(<Text key={`sep-${i}`} style={abeyStyles.contactSep}>~</Text>);
    });

    return <View style={abeyStyles.contactRow}>{nodes}</View>;
  };

  // ── Education ─────────────────────────────────────────────────────────
  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;
    return (
      <View>
        <Text style={abeyStyles.sectionTitle}>Education</Text>
        {resume.education.map((edu, i) => (
          <View key={i} style={abeyStyles.entryContainer}>
            <View style={abeyStyles.entryHeader}>
              <View style={abeyStyles.entryLeft}>
                <Text style={abeyStyles.entryTitle}>{edu.school}</Text>
                <Text style={abeyStyles.entrySubtitle}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                </Text>
              </View>
              <View style={abeyStyles.entryRight}>
                <Text style={abeyStyles.entryDate}>{edu.date}</Text>
                {edu.location && (
                  <Text style={abeyStyles.entryLocation}>{edu.location}</Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // ── Experience ────────────────────────────────────────────────────────
  const renderExperience = () => {
    if (!resume.work_experience || resume.work_experience.length === 0) return null;
    return (
      <View>
        <Text style={abeyStyles.sectionTitle}>Experience</Text>
        {resume.work_experience.map((exp, i) => (
          <View key={i} style={abeyStyles.entryContainer}>
            <View style={abeyStyles.entryHeader}>
              <View style={abeyStyles.entryLeft}>
                <Text style={abeyStyles.entryTitle}>{exp.company}</Text>
                <Text style={abeyStyles.entrySubtitle}>{exp.position}</Text>
              </View>
              <View style={abeyStyles.entryRight}>
                <Text style={abeyStyles.entryDate}>{exp.date}</Text>
                {exp.location && (
                  <Text style={abeyStyles.entryLocation}>{exp.location}</Text>
                )}
              </View>
            </View>
            {exp.description && exp.description.length > 0 && (
              <View style={abeyStyles.bulletList}>
                {exp.description.map((desc, di) => (
                  <View key={di} style={abeyStyles.bulletItem}>
                    <Text style={abeyStyles.bulletDot}>• </Text>
                    <Text style={abeyStyles.bulletText}>{parseMarkdownText(desc)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  // ── Projects ──────────────────────────────────────────────────────────
  const renderProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return null;
    return (
      <View>
        <Text style={abeyStyles.sectionTitle}>Projects</Text>
        {resume.projects.map((proj, i) => {
          const techString = proj.technologies && proj.technologies.length > 0
            ? proj.technologies.join(', ')
            : null;

          return (
            <View key={i} style={abeyStyles.entryContainer}>
              <View style={abeyStyles.projectHeaderRow}>
                <View style={abeyStyles.projectLeft}>
                  {/* Project name + redirect icon + pipe + tech — flex row so SVG icon sits inline */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text>
                      {(proj.url || proj.github_url) ? (
                        <Link
                          src={ensureHttps(proj.url ?? proj.github_url!)}
                          style={abeyStyles.projectNameLink}
                        >{proj.name}</Link>
                      ) : (
                        <Text style={abeyStyles.projectNamePlain}>{proj.name}</Text>
                      )}
                    </Text>
                    {(proj.url || proj.github_url) && <ExternalLinkIcon />}
                    {techString ? (
                      <Text>
                        <Text style={abeyStyles.projectPipe}> | </Text>
                        <Text style={abeyStyles.projectTech}>{techString}</Text>
                      </Text>
                    ) : null}
                  </View>
                </View>
                {proj.date && (
                  <Text style={abeyStyles.projectDate}>{proj.date}</Text>
                )}
              </View>
              {proj.description && proj.description.length > 0 && (
                <View style={abeyStyles.bulletList}>
                  {proj.description.map((desc, di) => (
                    <View key={di} style={abeyStyles.bulletItem}>
                      <Text style={abeyStyles.bulletDot}>• </Text>
                      <Text style={abeyStyles.bulletText}>{parseMarkdownText(desc)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // ── Technical Skills ──────────────────────────────────────────────────
  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;
    return (
      <View>
        <Text style={abeyStyles.sectionTitle}>Technical Skills</Text>
        <View style={{ marginLeft: 6 }}>
          {resume.skills.map((skillCat, i) => (
            <View key={i} style={abeyStyles.skillRow}>
              <Text style={abeyStyles.skillLabel}>{skillCat.category}:</Text>
              <Text style={abeyStyles.skillItems}>{skillCat.items.join(', ')}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // ── Achievements & Leadership (from education.achievements) ───────────
  const renderAchievements = () => {
    const allAchievements: string[] = [];
    resume.education?.forEach((edu) => {
      if (edu.achievements && edu.achievements.length > 0) {
        edu.achievements.forEach((a) => {
          allAchievements.push(a.replace(/^[-•*]\s*/, ''));
        });
      }
    });
    if (allAchievements.length === 0) return null;

    return (
      <View>
        <Text style={abeyStyles.sectionTitle}>Achievements &amp; Leadership</Text>
        <View style={abeyStyles.bulletList}>
          {allAchievements.map((a, i) => (
            <View key={i} style={abeyStyles.bulletItem}>
              <Text style={abeyStyles.bulletDot}>• </Text>
              <Text style={abeyStyles.bulletText}>{parseMarkdownText(a)}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // ── Summary (optional) ────────────────────────────────────────────────
  const renderSummary = () => {
    if (!resume.professional_summary) return null;
    return (
      <View>
        <Text style={abeyStyles.sectionTitle}>Summary</Text>
        <View style={abeyStyles.bulletList}>
          <View style={abeyStyles.bulletItem}>
            <Text style={abeyStyles.bulletDot}>• </Text>
            <Text style={abeyStyles.bulletText}>
              {parseMarkdownText(resume.professional_summary)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // ── Document ──────────────────────────────────────────────────────────
  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={abeyStyles.page}>
        {/* Header */}
        <View style={abeyStyles.header}>
          <Text style={abeyStyles.name}>
            {resume.first_name} {resume.last_name}
          </Text>
          {resume.location && (
            <Text style={abeyStyles.locationLine}>{resume.location}</Text>
          )}
          {renderContact()}
        </View>

        {/* Optional summary */}
        {renderSummary()}

        {/* Main sections — order mirrors the LaTeX document */}
        {renderEducation()}
        {renderExperience()}
        {renderProjects()}
        {renderSkills()}
        {renderAchievements()}
      </PDFPage>
    </PDFDocument>
  );
});
