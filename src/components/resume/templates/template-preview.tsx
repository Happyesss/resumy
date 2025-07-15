'use client';

import { cn } from '@/lib/utils';

interface TemplatePreviewProps {
  templateId: string;
  className?: string;
}

export function TemplatePreview({ templateId, className }: TemplatePreviewProps) {
  // This would render different template previews based on templateId
  const getTemplatePreview = (id: string) => {
    switch (id) {
      case 'modern-1':
        return (
          <div className="w-full h-full bg-white p-2 text-xs">
            <div className="border-b pb-1 mb-2">
              <div className="h-2 bg-gray-800 w-3/4 mb-1"></div>
              <div className="h-1 bg-blue-500 w-1/2"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-600 w-full"></div>
              <div className="h-1 bg-gray-600 w-4/5"></div>
              <div className="h-1 bg-gray-600 w-3/4"></div>
            </div>
          </div>
        );
      case 'classic-1':
        return (
          <div className="w-full h-full bg-white p-3 text-xs font-serif">
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-2 mb-3">
              <div className="h-2.5 bg-gray-900 w-2/3 mx-auto mb-1 rounded-sm"></div>
              <div className="flex justify-center gap-2 mb-1">
                <div className="h-0.5 bg-gray-600 w-6"></div>
                <div className="h-0.5 bg-gray-600 w-8"></div>
                <div className="h-0.5 bg-gray-600 w-6"></div>
              </div>
              <div className="h-0.5 bg-gray-500 w-1/3 mx-auto"></div>
            </div>
            
            {/* Education */}
            <div className="mb-3">
              <div className="h-1 bg-black w-1/4 mb-1 border-b border-black"></div>
              <div className="flex justify-between items-start mb-1">
                <div className="w-2/3">
                  <div className="h-1 bg-gray-800 w-4/5 mb-0.5"></div>
                  <div className="h-0.5 bg-gray-600 w-3/4 italic"></div>
                  <div className="h-0.5 bg-gray-500 w-1/2"></div>
                </div>
                <div className="w-1/4 text-right">
                  <div className="h-0.5 bg-gray-500 w-full"></div>
                  <div className="h-0.5 bg-gray-400 w-2/3 ml-auto"></div>
                </div>
              </div>
            </div>

            {/* Coursework */}
            <div className="mb-3">
              <div className="h-1 bg-black w-1/3 mb-1 border-b border-black"></div>
              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-0.5">
                  <div className="h-0.5 bg-gray-600 w-full"></div>
                  <div className="h-0.5 bg-gray-500 w-4/5"></div>
                </div>
                <div className="space-y-0.5">
                  <div className="h-0.5 bg-gray-600 w-full"></div>
                  <div className="h-0.5 bg-gray-500 w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-2">
              <div className="h-1 bg-black w-1/4 mb-1 border-b border-black"></div>
              <div className="flex justify-between items-start">
                <div className="w-2/3">
                  <div className="h-1 bg-gray-800 w-4/5 mb-0.5"></div>
                  <div className="h-0.5 bg-gray-600 w-3/4"></div>
                  <div className="space-y-0.5 mt-1">
                    <div className="flex items-start gap-1">
                      <div className="w-1 h-1 bg-gray-600 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div className="h-0.5 bg-gray-500 w-full"></div>
                    </div>
                    <div className="flex items-start gap-1">
                      <div className="w-1 h-1 bg-gray-600 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div className="h-0.5 bg-gray-500 w-4/5"></div>
                    </div>
                  </div>
                </div>
                <div className="w-1/4 text-right">
                  <div className="h-0.5 bg-gray-500 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'creative-1':
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 p-2 text-xs">
            <div className="flex items-start gap-1 mb-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-2 bg-gray-800 w-4/5 mb-1"></div>
                <div className="h-1 bg-gray-500 w-3/5"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-600 w-full"></div>
              <div className="h-1 bg-gray-600 w-4/5"></div>
            </div>
          </div>
        );
      case 'minimal-1':
        return (
          <div className="w-full h-full bg-white p-2 text-xs">
            <div className="mb-2">
              <div className="h-1.5 bg-gray-800 w-2/3 mb-1"></div>
              <div className="h-0.5 bg-gray-400 w-1/2"></div>
            </div>
            <div className="space-y-1">
              <div className="h-0.5 bg-gray-500 w-full"></div>
              <div className="h-0.5 bg-gray-500 w-4/5"></div>
              <div className="h-0.5 bg-gray-500 w-3/4"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gray-100 p-2 flex items-center justify-center">
            <div className="text-gray-400 text-xs">Preview</div>
          </div>
        );
    }
  };

  return (
    <div className={cn("border rounded overflow-hidden", className)}>
      {getTemplatePreview(templateId)}
    </div>
  );
}
