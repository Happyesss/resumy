'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Eye, Sparkles, Briefcase, GraduationCap, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplatePreview } from './template-preview';

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
    id: 'creative-1',
    name: 'Creative Designer',
    description: 'Eye-catching design for creative professionals and designers',
    category: 'creative',
    image: '/templates/creative-1.png',
    features: ['Visual Impact', 'Creative Layout', 'Portfolio Ready'],
    premium: true
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
    id: 'creative-2',
    name: 'Brand Designer',
    description: 'Bold and creative template for branding and marketing professionals',
    category: 'creative',
    image: '/templates/creative-2.png',
    features: ['Brand Focus', 'Marketing Ready', 'Visual Elements'],
    premium: true
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] p-0 bg-gray-900 border-gray-800">
        <DialogHeader className="px-6 py-4 border-b border-gray-800">
          <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Choose a Resume Template
          </DialogTitle>
          <p className="text-gray-400 mt-1">
            Select a professional template that matches your style and industry
          </p>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-64 bg-gray-950 border-r border-gray-800 p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      selectedCategory === category.id
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <div className="aspect-[3/4] bg-gray-700 rounded-t-lg overflow-hidden relative">
                        <TemplatePreview 
                          templateId={template.id}
                          className="w-full h-full border-none"
                        />
                        
                        {/* Selected Indicator */}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}

                        {/* Premium Badge */}
                        {template.premium && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{template.name}</h3>
                          <Badge className={categoryColors[template.category]}>
                            {template.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-3">
                          {template.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature) => (
                            <Badge
                              key={feature}
                              variant="outline"
                              className="text-xs border-gray-600 text-gray-300"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="border-t border-gray-800 p-4 bg-gray-950">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
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
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyTemplate}
                    disabled={!selectedTemplate}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Apply Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
