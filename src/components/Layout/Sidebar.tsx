import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Palette, Layout } from 'lucide-react';
import { templates } from '../../data/templates';
import { Template } from '../../types/resume';

interface SidebarProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'modern':
        return <Layout className="h-4 w-4" />;
      case 'creative':
        return <Palette className="h-4 w-4" />;
      default:
        return <Layout className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'modern':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'creative':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'traditional':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'technical':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow z-50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {!isCollapsed && (
          <div className="p-6 h-full overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Resume Templates</h2>
              <p className="text-sm text-gray-600">Choose a template that matches your style and industry</p>
            </div>

            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => onTemplateChange(template.id)}
                >
                  {/* Template Preview */}
                  <div className="aspect-[3/4] bg-gray-100 rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <Layout className="h-12 w-12 mx-auto mb-2" />
                        <span className="text-xs">Preview</span>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(template.category)}`}>
                        {getCategoryIcon(template.category)}
                        <span className="ml-1 capitalize">{template.category}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {template.features.length > 2 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{template.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer to push content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}></div>
    </>
  );
};