'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Eye, Sparkles, Briefcase, GraduationCap, Palette, Maximize2 as Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplatePreview } from './template-preview';
import { FullscreenTemplatePreview } from './fullscreen-template-preview';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  image: string;
  features: string[];
  premium: boolean;
}

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (templateId: string) => void;
  currentTemplate?: string;
}

// Mock template data - replace with actual templates
const templates: Template[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Simple and clean default resume format',
    category: 'minimal',
    image: '/templates/default.png',
    features: ['ATS Optimized', 'Simple Layout', 'Standard Format'],
    premium: false
  },
  {
    id: 'modern-1',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and corporate roles',
    category: 'modern',
    image: '/templates/modern-1.png',
    features: ['ATS Optimized', 'Clean Layout', 'Modern Typography'],
    premium: false
  },
  {
    id: 'classic-1',
    name: 'Classic Executive',
    description: 'Traditional format ideal for executive and senior positions',
    category: 'classic',
    image: '/templates/classic-1.png',
    features: ['Professional', 'Time-tested', 'Executive Ready'],
    premium: false
  },

  {
    id: 'minimal-1',
    name: 'Minimal Clean',
    description: 'Minimalist approach focusing on content and readability',
    category: 'minimal',
    image: '/templates/minimal-1.png',
    features: ['Minimal Design', 'Content Focus', 'Easy to Read'],
    premium: false
  },
  {
    id: 'modern-2',
    name: 'Tech Professional',
    description: 'Modern layout optimized for technology and startup roles',
    category: 'modern',
    image: '/templates/modern-2.png',
    features: ['Tech Optimized', 'Startup Ready', 'Skills Focused'],
    premium: true
  },

  {
    id: 'creative-modern',
    name: 'Creative Modern',
    description: 'Professional creative design with modern sidebar layout and gradient accents',
    category: 'creative',
    image: '/templates/creative-modern.png',
    features: ['Modern Layout', 'Gradient Design', 'Professional Appeal', 'ATS Optimized'],
    premium: false
  },
  {
    id: 'creative-minimal',
    name: 'Creative Minimal',
    description: 'Clean minimal design with creative elements and sophisticated typography',
    category: 'creative',
    image: '/templates/creative-minimal.png',
    features: ['Minimal Design', 'Creative Elements', 'Typography Focus', 'Clean Layout'],
    premium: false
  },
  {
    id: 'ca-professional',
    name: 'CA Professional',
    description: 'Specialized template designed for Chartered Accountants with finance industry styling',
    category: 'classic',
    image: '/templates/caProfessional.png',
    features: ['Finance Focused', 'Professional Layout', 'ATS Optimized', 'CA Specialized'],
    premium: false
  }
];

const categoryIcons = {
  modern: Briefcase,
  classic: GraduationCap,
  creative: Palette,
  minimal: Eye
};

const categoryColors = {
  modern: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  classic: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  creative: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  minimal: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export function TemplateSelectionModal({ 
  isOpen, 
  onOpenChange, 
  onTemplateSelect,
  currentTemplate 
}: TemplateSelectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(currentTemplate || null);
  const [fullscreenPreview, setFullscreenPreview] = useState<{ isOpen: boolean; templateId: string; templateName: string }>({
    isOpen: false,
    templateId: '',
    templateName: ''
  });

  const categories = [
    { id: 'all', name: 'All Templates', icon: Eye },
    { id: 'modern', name: 'Modern', icon: Briefcase },
    { id: 'classic', name: 'Classic', icon: GraduationCap },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'minimal', name: 'Minimal', icon: Eye }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
      onOpenChange(false);
    }
  };

  const handleFullscreenPreview = (templateId: string, templateName: string) => {
    setFullscreenPreview({
      isOpen: true,
      templateId,
      templateName
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl h-[90vh] sm:h-[80vh] p-0 bg-gray-900 border-gray-800 m-2 sm:m-0">
        <DialogHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-800">
          <DialogTitle className="text-lg sm:text-2xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
            Choose a Resume Template
          </DialogTitle>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Select a professional template that matches your style and industry
          </p>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Category Sidebar - Mobile: Horizontal scroll, Desktop: Vertical sidebar */}
          <div className="lg:w-64 bg-gray-950 border-b lg:border-b-0 lg:border-r border-gray-800 p-2 sm:p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2 sm:mb-3 hidden lg:block">Categories</h3>
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-1.5 lg:py-2 rounded-md text-xs lg:text-sm transition-colors whitespace-nowrap lg:w-full",
                      selectedCategory === category.id
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                    )}
                  >
                    <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-2 sm:p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {filteredTemplates.map((template) => {
                  const Icon = categoryIcons[template.category];
                  return (
                    <div
                      key={template.id}
                      className={cn(
                        "group relative bg-gray-800 rounded-lg border transition-all duration-300 cursor-pointer",
                        selectedTemplate === template.id
                          ? "border-purple-500 ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/10"
                          : "border-gray-700 hover:border-gray-600 hover:shadow-lg"
                      )}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      {/* Template Preview */}
                      <div className="aspect-[3/4] bg-gray-700 rounded-t-lg overflow-hidden relative group">
                        <TemplatePreview 
                          templateId={template.id}
                          className="w-full h-full border-none"
                          enableZoom={true}
                        />
                        
                        {/* Overlay with actions on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFullscreenPreview(template.id, template.name);
                            }}
                            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                          >
                            <Maximize className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                        
                        {/* Selected Indicator */}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-purple-500 rounded-full p-0.5 sm:p-1 z-10">
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                        )}

                        {/* Premium Badge */}
                        {template.premium && (
                          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none text-xs">
                              <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                              Premium
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="p-2 sm:p-3 lg:p-4">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <h3 className="font-semibold text-white text-sm sm:text-base">{template.name}</h3>
                          <Badge className={cn(categoryColors[template.category], "text-xs")}>
                            {template.category}
                          </Badge>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature) => (
                            <Badge
                              key={feature}
                              variant="outline"
                              className="text-xs border-gray-600 text-gray-300"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-gray-600 text-gray-300"
                            >
                              +{template.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="border-t border-gray-800 p-2 sm:p-3 lg:p-4 bg-gray-950">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:justify-between">
                <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                  {selectedTemplate ? (
                    <span>
                      Template selected: <span className="text-purple-400">
                        {templates.find(t => t.id === selectedTemplate)?.name}
                      </span>
                    </span>
                  ) : (
                    'Select a template to continue'
                  )}
                </div>
                
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1 sm:flex-none text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyTemplate}
                    disabled={!selectedTemplate}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-none text-sm"
                  >
                    Apply Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Fullscreen Preview Modal */}
      <FullscreenTemplatePreview
        isOpen={fullscreenPreview.isOpen}
        onOpenChange={(open) => setFullscreenPreview(prev => ({ ...prev, isOpen: open }))}
        templateId={fullscreenPreview.templateId}
        templateName={fullscreenPreview.templateName}
      />
    </Dialog>
  );
}
