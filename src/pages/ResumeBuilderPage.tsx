import React, { useState, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { ResumeEditor } from '../components/Editor/ResumeEditor';
import { ResumePreview } from '../components/Preview/ResumePreview';
import { ResumeData } from '../types/resume';
import { sampleResumeData } from '../data/sampleData';
import { useLocalStorage, useAutoSave } from '../hooks/useLocalStorage';
import { downloadPDF, validatePDFExport } from '../utils/pdfExport';

export const ResumeBuilderPage: React.FC = () => {
  const [resumeData, setResumeData] = useLocalStorage<ResumeData>('resume-data', sampleResumeData);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } | null>(null);

  // Auto-save functionality
  useAutoSave('resume-data', resumeData, 30000);

  useEffect(() => {
    const now = new Date();
    setLastSaved(now.toLocaleTimeString());
  }, [resumeData]);

  const handleUpdateResume = (updates: Partial<ResumeData>) => {
    setResumeData(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date().toISOString()
    }));
  };

  const handleTemplateChange = (templateId: string) => {
    handleUpdateResume({ template: templateId });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Validate PDF before export
      const validation = await validatePDFExport(resumeData);
      setValidationResults(validation);
      
      if (!validation.isValid) {
        const proceed = window.confirm(
          `There are some issues with your resume:\n${validation.issues.join('\n')}\n\nDo you want to proceed with the export anyway?`
        );
        
        if (!proceed) {
          setIsExporting(false);
          return;
        }
      }
      
      // Show recommendations if any
      if (validation.recommendations.length > 0) {
        console.log('PDF Export Recommendations:', validation.recommendations);
      }
      
      setExportProgress(50);
      await downloadPDF(resumeData);
      setExportProgress(100);
      
      // Show success message
      setTimeout(() => {
        alert('PDF exported successfully!');
      }, 500);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleSave = () => {
    setResumeData(resumeData);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const handleSettings = () => {
    // Settings modal would be implemented here
    console.log('Settings clicked');
  };

  const getResumeTitle = () => {
    const { firstName, lastName } = resumeData.personalInfo;
    return firstName && lastName ? `${firstName} ${lastName} - Resume` : 'My Resume';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        resumeTitle={getResumeTitle()}
        onExport={handleExportPDF}
        onSave={handleSave}
        onSettings={handleSettings}
        lastSaved={lastSaved}
      />

      <div className="flex pt-16">
        <Sidebar
          selectedTemplate={resumeData.template}
          onTemplateChange={handleTemplateChange}
        />

        <main className="flex-1 min-h-screen">
          <div className="grid grid-cols-1 xl:grid-cols-2 min-h-screen">
            {/* Editor Panel */}
            <div className="bg-gray-50 overflow-y-auto h-screen">
              <ResumeEditor
                resumeData={resumeData}
                onUpdateResume={handleUpdateResume}
              />
            </div>

            {/* Preview Panel */}
            <div className="bg-white border-l border-gray-200 overflow-y-auto h-screen">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        </main>
      </div>

      {/* Enhanced Loading overlay for PDF export */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating PDF...</h3>
              <p className="text-gray-600 mb-4">
                Creating your professional resume with optimized formatting
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-gray-500">
                {exportProgress < 50 ? 'Validating content...' : 
                 exportProgress < 100 ? 'Formatting document...' : 'Finalizing...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Results Modal */}
      {validationResults && validationResults.recommendations.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40">
          <h4 className="font-semibold text-gray-900 mb-2">PDF Export Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {validationResults.recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setValidationResults(null)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};