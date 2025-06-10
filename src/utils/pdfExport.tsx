import { pdf } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import PDFResume from './PDFResume';

export const exportToPDF = async (resumeData: ResumeData): Promise<Blob> => {
  const doc = <PDFResume data={resumeData} />;
  const pdfBlob = await pdf(doc).toBlob();
  return pdfBlob;
};

export const downloadPDF = async (resumeData: ResumeData, filename?: string) => {
  try {
    const pdfBlob = await exportToPDF(resumeData);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Safe access to personalInfo with fallbacks
    const safePersonalInfo = resumeData.personalInfo || {};
    const firstName = safePersonalInfo.firstName || 'Resume';
    const lastName = safePersonalInfo.lastName || 'Export';
    link.download = filename || `${firstName}_${lastName}_Resume.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Batch export functionality for multiple resumes
export const batchExportPDFs = async (resumeDataList: ResumeData[], progressCallback?: (progress: number) => void) => {
  const results: { success: boolean; filename: string; error?: string }[] = [];
  
  for (let i = 0; i < resumeDataList.length; i++) {
    const resumeData = resumeDataList[i];
    
    try {
      // Safe access to personalInfo with fallbacks
      const safePersonalInfo = resumeData.personalInfo || {};
      const firstName = safePersonalInfo.firstName || 'Resume';
      const lastName = safePersonalInfo.lastName || 'Export';
      const filename = `${firstName}_${lastName}_Resume.pdf`;
      
      await downloadPDF(resumeData, filename);
      
      results.push({
        success: true,
        filename
      });
      
      // Update progress
      if (progressCallback) {
        progressCallback(((i + 1) / resumeDataList.length) * 100);
      }
      
      // Small delay to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      // Safe access to personalInfo with fallbacks
      const safePersonalInfo = resumeData.personalInfo || {};
      const firstName = safePersonalInfo.firstName || 'Resume';
      const lastName = safePersonalInfo.lastName || 'Export';
      
      results.push({
        success: false,
        filename: `${firstName}_${lastName}_Resume.pdf`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
};

// Validate PDF formatting and content integrity
export const validatePDFExport = async (resumeData: ResumeData): Promise<{
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}> => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Safe access to personalInfo
  const safePersonalInfo = resumeData.personalInfo || {};

  // Check for missing required fields
  if (!safePersonalInfo.firstName || !safePersonalInfo.lastName) {
    issues.push('Missing name information');
  }
  
  if (!safePersonalInfo.email || !safePersonalInfo.phone) {
    issues.push('Missing contact information');
  }

  // Check content length for optimal formatting
  if (resumeData.summary && resumeData.summary.length > 500) {
    recommendations.push('Consider shortening the professional summary for better formatting');
  }

  // Check work experience descriptions
  (resumeData.workExperience || []).forEach((exp, index) => {
    if (exp.description && exp.description.length > 6) {
      recommendations.push(`Work experience ${index + 1} has many bullet points - consider condensing for better layout`);
    }
    
    (exp.description || []).forEach((desc, descIndex) => {
      if (desc && desc.length > 150) {
        recommendations.push(`Work experience ${index + 1}, bullet point ${descIndex + 1} is very long - consider shortening`);
      }
    });
  });

  // Check skills organization
  const skillsByCategory = (resumeData.skills || []).reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = 0;
    acc[skill.category]++;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(skillsByCategory).length > 6) {
    recommendations.push('Consider consolidating skill categories for better organization');
  }

  // Check project descriptions
  (resumeData.projects || []).forEach((project, index) => {
    if (project.description && project.description.length > 200) {
      recommendations.push(`Project ${index + 1} description is long - consider shortening for better layout`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
};