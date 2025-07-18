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
      case 'default':
        return (
          <div className="w-full h-full bg-white p-3 text-xs">
            <div className="text-center border-b pb-1 mb-2">
              <div className="h-2 bg-gray-800 w-3/4 mx-auto mb-1"></div>
              <div className="h-1 bg-gray-600 w-1/2 mx-auto"></div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="h-1 bg-gray-700 w-1/4 mb-1"></div>
                <div className="h-0.5 bg-gray-500 w-full"></div>
                <div className="h-0.5 bg-gray-500 w-4/5"></div>
              </div>
              <div>
                <div className="h-1 bg-gray-700 w-1/3 mb-1"></div>
                <div className="h-0.5 bg-gray-500 w-full"></div>
                <div className="h-0.5 bg-gray-500 w-3/4"></div>
              </div>
            </div>
          </div>
        );
      case 'modern-1':
        return (
          <div className="w-full h-full bg-white p-2 text-xs">
            <div className="border-l-2 border-blue-500 pl-2 mb-2">
              <div className="h-2 bg-gray-800 w-3/4 mb-1"></div>
              <div className="h-1 bg-blue-500 w-1/2 mb-1"></div>
              <div className="grid grid-cols-2 gap-1 text-[0.3rem]">
                <div className="h-0.5 bg-gray-500 w-full"></div>
                <div className="h-0.5 bg-gray-500 w-3/4"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-0.5 bg-blue-500 w-1/3 border-b border-blue-500"></div>
              <div className="bg-gray-50 p-1 border-l-2 border-blue-200">
                <div className="h-0.5 bg-gray-700 w-2/3 mb-0.5"></div>
                <div className="h-0.5 bg-blue-500 w-1/2"></div>
              </div>
            </div>
          </div>
        );
      case 'modern-2':
        return (
          <div className="w-full h-full bg-gray-900 p-2 text-xs font-mono">
            <div className="border-l-2 border-green-400 pl-2 mb-2 text-white">
              <div className="h-1.5 bg-white w-3/4 mb-1"></div>
              <div className="h-0.5 bg-green-400 w-1/2 mb-1"></div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-0.5 bg-green-400"></div>
                  <div className="h-0.5 bg-gray-300 w-6"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-0.5 bg-green-400"></div>
                  <div className="h-0.5 bg-gray-300 w-8"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-1 rounded text-green-400">
              <div className="flex gap-1 mb-1">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
              </div>
              <div className="h-0.5 bg-blue-300 w-2/3 mb-0.5"></div>
              <div className="h-0.5 bg-yellow-300 w-1/2"></div>
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

      case 'creative-modern':
        return (
          <div className="w-full h-full flex text-xs">
            {/* Left sidebar */}
            <div className="w-1/3 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 p-1.5 text-white">
              <div className="w-3 h-3 bg-white/20 rounded-full mb-1"></div>
              <div className="h-1 bg-white w-3/4 mb-0.5"></div>
              <div className="h-0.5 bg-indigo-200 w-1/2 mb-2"></div>
              <div className="space-y-1">
                <div className="h-0.5 bg-white/60 w-2/3"></div>
                <div className="h-0.5 bg-white/60 w-3/4"></div>
                <div className="h-0.5 bg-white/60 w-1/2"></div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex gap-0.5">
                  <div className="w-3 h-2 bg-white/20 rounded-sm"></div>
                  <div className="w-4 h-2 bg-white/20 rounded-sm"></div>
                </div>
              </div>
            </div>
            {/* Right content */}
            <div className="flex-1 p-1.5 bg-white">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-indigo-500 rounded"></div>
                <div className="h-1 bg-gray-800 w-1/3"></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-1 bg-gray-700 w-2/5"></div>
                  <div className="h-0.5 bg-indigo-200 w-1/6 rounded-full"></div>
                </div>
                <div className="h-0.5 bg-gray-500 w-full"></div>
                <div className="h-0.5 bg-gray-500 w-4/5"></div>
              </div>
            </div>
          </div>
        );
      case 'creative-minimal':
        return (
          <div className="w-full h-full bg-white p-2 text-xs">
            {/* Header with decorative line */}
            <div className="relative mb-2">
              <div className="h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-600 w-full mb-1"></div>
              <div className="text-center">
                <div className="h-1.5 bg-gray-800 w-1/2 mx-auto mb-0.5"></div>
                <div className="h-0.5 bg-emerald-600 w-1/3 mx-auto mb-1"></div>
                <div className="flex justify-center gap-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Two column layout */}
            <div className="flex gap-2">
              <div className="w-1/3 space-y-1">
                <div className="h-0.5 bg-gray-800 w-3/4 mb-1"></div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <div className="w-0.5 h-0.5 bg-emerald-400 rounded-full"></div>
                    <div className="h-0.5 bg-gray-600 w-full"></div>
                  </div>
                  <div className="ml-1 h-0.5 bg-emerald-400 w-3/4"></div>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="bg-gray-50 p-1 rounded border-l-2 border-emerald-400">
                  <div className="h-0.5 bg-gray-700 w-2/3 mb-0.5"></div>
                  <div className="h-0.5 bg-emerald-600 w-1/2 mb-0.5"></div>
                  <div className="h-0.5 bg-gray-500 w-full"></div>
                </div>
              </div>
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
