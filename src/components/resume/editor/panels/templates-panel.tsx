'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Palette, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { TemplateSelectionModal } from '../../templates/template-selection-modal';

import { Resume } from '@/lib/types';

interface TemplatesPanelProps {
  resume?: Resume;
  onTemplateSelect?: (templateId: string) => void;
}

export function TemplatesPanel({ resume, onTemplateSelect }: TemplatesPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <p className="text-gray-400 max-w-2xl mx-auto hidden md:block">
          Choose from our collection of professionally designed templates. 
          Each template is ATS-optimized and customizable to match your industry and style.
        </p>
      </div>

      {/* Clean Main CTA Card */}
      <Card className="border border-gray-700 bg-gray-900 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-100">
                Transform Your Resume
              </h3>
            </div>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Browse our template collection and give your resume a professional makeover.
              {resume?.template && (
                <span className="block mt-2 text-xs text-purple-400">
                  Current template: <span className="font-medium">{resume.template}</span>
                </span>
              )}
              {!resume?.template && (
                <span className="block mt-2 text-xs text-gray-500">
                  Using default template
                </span>
              )}
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 h-auto shadow-lg hover:shadow-purple-500/20"
            >
              <Palette className="h-4 w-4 mr-2" />
              Browse Templates
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features List */}
      <Card className="bg-gray-900 border border-gray-700">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-gray-100">
            <Sparkles className="h-4 w-4 text-purple-400" />
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
