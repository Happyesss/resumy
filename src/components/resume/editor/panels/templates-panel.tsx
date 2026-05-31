'use client';

import { Check, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { TemplateSelectionModal } from '../../templates/template-selection-modal';
import { Resume } from '@/lib/types';

const TEMPLATE_LABELS: Record<string, string> = {
  'default': 'Default',
  'modern-1': 'Modern Professional',
  'classic-1': 'Classic Executive',
  'minimal-1': 'Minimal Clean',
  'modern-2': 'Tech Professional',
  'creative-modern': 'Creative Modern',
  'creative-minimal': 'Creative Minimal',
  'ca-professional': 'CA Professional',
  'software-engineer': 'Software Engineer',
};

const FEATURES = [
  'ATS-Optimized Formatting',
  'Professional Typography',
  'Customizable Colors',
  'Multiple Layout Options',
  'Industry-Specific Designs',
  'One-Click Application',
];

interface TemplatesPanelProps {
  resume?: Resume;
  onTemplateSelect?: (templateId: string) => void;
}

export function TemplatesPanel({ resume, onTemplateSelect }: TemplatesPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect?.(templateId);
  };

  const currentLabel = resume?.template
    ? (TEMPLATE_LABELS[resume.template] ?? resume.template)
    : 'Default';

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 bg-[#bf5af2]/10 rounded-xl flex items-center justify-center border border-[#bf5af2]/20">
          <Layers className="h-4 w-4 text-[#bf5af2]" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-white tracking-tight">Resume Templates</h3>
          <p className="text-[11px] text-white/40">Choose from professionally designed templates</p>
        </div>
      </div>

      {/* Current template + CTA */}
      <div className="bg-[#2c2c2e] rounded-2xl border border-white/[0.07] overflow-hidden">
        {/* Active template row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-white/40 mb-0.5">Active template</p>
            <p className="text-[13px] font-medium text-white truncate">{currentLabel}</p>
          </div>
          <div className="w-5 h-5 rounded-full bg-[#bf5af2]/20 flex items-center justify-center flex-shrink-0">
            <Check className="h-3 w-3 text-[#bf5af2]" strokeWidth={3} />
          </div>
        </div>

        {/* Browse button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.04] transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#bf5af2]/10 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-[#bf5af2]" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">Browse Templates</p>
              <p className="text-[11px] text-white/40">Click to preview & switch instantly</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
        </button>
      </div>

      {/* Features — compact pill list */}
      <div className="bg-[#2c2c2e] rounded-2xl border border-white/[0.07] px-4 py-3">
        <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest mb-2.5">Template Features</p>
        <div className="grid grid-cols-1 gap-y-2">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#bf5af2] flex-shrink-0" />
              <span className="text-[12px] text-white/70">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating template picker */}
      <TemplateSelectionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onTemplateSelect={handleTemplateSelect}
        currentTemplate={resume?.template}
      />
    </div>
  );
}
