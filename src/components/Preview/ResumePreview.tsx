import React from 'react';
import { Eye, ZoomIn, ZoomOut } from 'lucide-react';
import { ResumeData } from '../../types/resume';
import { ModernProfessionalTemplate } from './templates/ModernProfessionalTemplate';
import { CreativePortfolioTemplate } from './templates/CreativePortfolioTemplate';
import { ExecutivePremiumTemplate } from './templates/ExecutivePremiumTemplate';

interface ResumePreviewProps {
  resumeData: ResumeData;
  className?: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  className = ''
}) => {
  const [zoom, setZoom] = React.useState(70); // Default to 70% as requested

  const getTemplateComponent = () => {
    switch (resumeData.template) {
      case 'creative-portfolio':
        return CreativePortfolioTemplate;
      case 'executive-premium':
        return ExecutivePremiumTemplate;
      case 'modern-professional':
      default:
        return ModernProfessionalTemplate;
    }
  };

  const TemplateComponent = getTemplateComponent();

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 30));
  };

  const resetZoom = () => {
    setZoom(70);
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <Eye className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
          <span className="text-sm text-gray-500">A4 (210mm × 297mm)</span>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={resetZoom}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors min-w-[3rem] text-center"
            title="Reset zoom to 70%"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preview Content - A4 Optimized with Fixed Container */}
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-start">
        <div 
          className="bg-white shadow-xl flex-shrink-0 border border-gray-300"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: '210mm',
            height: '297mm',
            maxWidth: '210mm',
            maxHeight: '297mm',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
          }}>
            <TemplateComponent data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};