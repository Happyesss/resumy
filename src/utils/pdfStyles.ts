import { StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF - A4 optimized with multi-page support
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: '15mm',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    width: '210mm',
    height: '297mm',
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
    flexShrink: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
    lineHeight: 1.2,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 9,
    color: '#6b7280',
  },
  contactItem: {
    marginRight: 12,
  },
  section: {
    marginBottom: 12,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summary: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 10,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
    breakInside: 'avoid',
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  company: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  location: {
    fontSize: 8,
    color: '#6b7280',
  },
  date: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.3,
    marginTop: 2,
  },
  skillCategory: {
    marginBottom: 6,
    breakInside: 'avoid',
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  skillList: {
    fontSize: 9,
    color: '#374151',
  },
  educationItem: {
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
    breakInside: 'avoid',
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  institution: {
    fontSize: 9,
    color: '#2563EB',
  },
  projectItem: {
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
    breakInside: 'avoid',
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  projectDescription: {
    fontSize: 9,
    color: '#374151',
    marginTop: 2,
    lineHeight: 1.3,
  },
  technologies: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  certificationItem: {
    marginBottom: 6,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2563EB',
    breakInside: 'avoid',
  },
  certificationName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  certificationIssuer: {
    fontSize: 8,
    color: '#2563EB',
  },
  pageBreak: {
    pageBreakBefore: 'always',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
  },
});

export default styles;
