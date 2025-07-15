'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Eye, ArrowRight, Zap } from 'lucide-react';
import { TemplateSelectionModal } from '../../templates/template-selection-modal';
import { cn } from '@/lib/utils';

import { Resume } from '@/lib/types';

interface TemplatesPanelProps {
  resume?: Resume;
  onTemplateSelect?: (templateId: string) => void;
}

export function TemplatesPanel({ resume, onTemplateSelect }: TemplatesPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const templateCategories = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary designs',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      count: 8
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and professional',
      icon: Eye,
      color: 'from-indigo-500 to-purple-500',
      count: 6
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and artistic layouts',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      count: 4
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect?.(templateId);
    // Here you would apply the template to the resume
    console.log('Template selected:', templateId);
    // Show success message
    // toast({ title: "Template Applied", description: "Your resume has been updated with the new template." });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Resume Templates</h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Choose from our collection of professionally designed templates. 
          Each template is ATS-optimized and customizable to match your industry and style.
        </p>
      </div>

      {/* Main CTA Card */}
      <Card className="border-2 border-dashed border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 hover:from-purple-900/30 hover:to-pink-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">
                Transform Your Resume
              </h3>
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              Browse our premium template collection and give your resume a professional makeover in seconds.
              {resume?.template && (
                <span className="block mt-2 text-sm text-purple-400">
                  Current template: <span className="font-semibold">{resume.template}</span>
                </span>
              )}
              {!resume?.template && (
                <span className="block mt-2 text-sm text-gray-500">
                  No template selected (using default)
                </span>
              )}
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Palette className="h-5 w-5 mr-2" />
              Browse Templates
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Template Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templateCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="group cursor-pointer border-gray-700 bg-gray-800 hover:border-purple-400 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10"
              onClick={() => setIsModalOpen(true)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "p-2 rounded-lg bg-gradient-to-r",
                    category.color
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                    {category.count} templates
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-400">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Template Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-300">ATS-Optimized Formatting</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-300">Professional Typography</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-300">Customizable Colors</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-300">Multiple Layout Options</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-300">Industry-Specific Designs</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-300">One-Click Application</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onTemplateSelect={handleTemplateSelect}
        currentTemplate={resume?.template}
      />
    </div>
  );
}
