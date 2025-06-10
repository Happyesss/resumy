import React, { useState } from 'react';
import { FileText, Download, Save, Settings, FileDown, Files } from 'lucide-react';

interface HeaderProps {
  resumeTitle: string;
  onExport: () => void;
  onSave: () => void;
  onSettings: () => void;
  lastSaved?: string;
}

export const Header: React.FC<HeaderProps> = ({
  resumeTitle,
  onExport,
  onSave,
  onSettings,
  lastSaved
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportClick = (format: string) => {
    setShowExportMenu(false);
    if (format === 'pdf') {
      onExport();
    }
    // Add other format handlers here
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ResumeBuilder Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span>•</span>
              <span className="truncate max-w-48">{resumeTitle}</span>
              {lastSaved && (
                <>
                  <span>•</span>
                  <span>Saved {lastSaved}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSave}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Save className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Save</span>
            </button>
            
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Download className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">PDF</span>
              </button>

              {/* Export Menu */}
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleExportClick('pdf')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FileDown className="h-4 w-4 mr-3" />
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExportClick('docx')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <Files className="h-4 w-4 mr-3" />
                      Export as DOCX (Coming Soon)
                    </button>
                    <button
                      onClick={() => handleExportClick('txt')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      Export as Text (Coming Soon)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onSettings}
              className="inline-flex items-center p-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </header>
  );
};