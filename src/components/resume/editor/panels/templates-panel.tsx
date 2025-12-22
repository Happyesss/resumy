'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
          <Palette className="h-5 w-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Resume Templates</h3>
          <p className="text-xs text-zinc-500">Choose from professionally designed templates</p>
        </div>
      </div>

      {/* Main CTA Card */}
      <div className={cn(
        "p-6 rounded-2xl",
        "bg-zinc-900/50 border border-zinc-800/80",
        "hover:border-rose-500/30 transition-all duration-200"
      )}>
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-400" />
            <h3 className="text-base font-semibold text-white">
              Transform Your Resume
            </h3>
          </div>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            Browse our template collection and give your resume a professional makeover.
            {resume?.template && (
              <span className="block mt-2 text-xs text-rose-400">
                Current template: <span className="font-medium">{resume.template}</span>
              </span>
            )}
            {!resume?.template && (
              <span className="block mt-2 text-xs text-zinc-500">
                Using default template
              </span>
            )}
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className={cn(
              "h-12 mt-2",
              "bg-gradient-to-r from-rose-500/10 to-pink-500/10",
              "border border-rose-500/30 hover:border-rose-500/50",
              "text-rose-400 hover:text-rose-300",
              "hover:from-rose-500/20 hover:to-pink-500/20",
              "transition-all duration-200"
            )}
          >
            <Palette className="h-4 w-4 mr-2" />
            Browse Templates
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Features List */}
      <div className={cn(
        "p-6 rounded-2xl",
        "bg-zinc-900/50 border border-zinc-800/80"
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-rose-400" />
          <h4 className="text-sm font-semibold text-white">Template Features</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="text-xs text-zinc-300">ATS-Optimized Formatting</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="text-xs text-zinc-300">Professional Typography</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="text-xs text-zinc-300">Customizable Colors</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="text-xs text-zinc-300">Multiple Layout Options</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="text-xs text-zinc-300">Industry-Specific Designs</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span className="text-xs text-zinc-300">One-Click Application</span>
            </div>
          </div>
        </div>
      </div>

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
