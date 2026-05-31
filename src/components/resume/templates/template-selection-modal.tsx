'use client';

import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TemplatePreview } from './template-preview';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (templateId: string) => void;
  currentTemplate?: string;
}

const templates = [
  { id: 'default', name: 'Default', category: 'minimal' },
  { id: 'modern-1', name: 'Modern Professional', category: 'modern' },
  { id: 'classic-1', name: 'Classic Executive', category: 'classic' },
  { id: 'minimal-1', name: 'Minimal Clean', category: 'minimal' },
  { id: 'modern-2', name: 'Tech Professional', category: 'modern' },
  { id: 'creative-modern', name: 'Creative Modern', category: 'creative' },
  { id: 'creative-minimal', name: 'Creative Minimal', category: 'creative' },
  { id: 'ca-professional', name: 'CA Professional', category: 'classic' },
  { id: 'software-engineer', name: 'Software Engineer', category: 'classic' },
] as const;

type TemplateId = typeof templates[number]['id'];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'creative', label: 'Creative' },
  { id: 'minimal', label: 'Minimal' },
];

export function TemplateSelectionModal({
  isOpen,
  onOpenChange,
  onTemplateSelect,
  currentTemplate,
}: TemplateSelectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(
    (currentTemplate as TemplateId) || null,
  );
  // Track original so Cancel can revert
  const originalTemplateRef = useRef<string | undefined>(currentTemplate);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      originalTemplateRef.current = currentTemplate;
      setSelectedTemplate((currentTemplate as TemplateId) || null);
    }
  }, [isOpen, currentTemplate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close when clicking outside the panel
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleCancel();
      }
    };
    if (isOpen) {
      const t = setTimeout(() => document.addEventListener('mousedown', handleOutside), 50);
      return () => {
        clearTimeout(t);
        document.removeEventListener('mousedown', handleOutside);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  // Clicking a template gives instant live preview on the resume
  const handleTemplateClick = (id: TemplateId) => {
    setSelectedTemplate(id);
    onTemplateSelect(id); // live preview — updates resume immediately
  };

  // Cancel reverts to original template
  const handleCancel = () => {
    if (originalTemplateRef.current !== undefined) {
      onTemplateSelect(originalTemplateRef.current || 'default');
    }
    onOpenChange(false);
  };

  // Apply just closes — template already applied via live preview
  const handleApply = () => {
    onOpenChange(false);
  };

  const selectedName = templates.find((t) => t.id === selectedTemplate)?.name;

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed left-3 top-[72px] z-50 w-[300px] sm:w-[320px]',
        'bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/[0.1]',
        'rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.55)] flex flex-col',
        'max-h-[calc(100dvh-88px)]',
        'animate-in slide-in-from-left-2 fade-in duration-200',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-white leading-tight">
            Choose a Template
          </h2>
          <p className="text-[11px] text-white/40 mt-0.5">{templates.length} templates · click to preview</p>
        </div>
        <button
          onClick={handleCancel}
          className="w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center text-white/50 hover:bg-white/[0.14] hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 px-4 pb-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border',
              selectedCategory === cat.id
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white/50 border-white/[0.12] hover:text-white/80 hover:border-white/20',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template grid — scrollable */}
      <div className="overflow-y-auto px-3 pb-2 flex-1">
        <div className="grid grid-cols-3 gap-2">
          {filtered.map((template) => {
            const isSelected = selectedTemplate === template.id;
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template.id as TemplateId)}
                className="group text-left focus:outline-none"
                aria-label={`Preview ${template.name} template`}
              >
                {/* Preview thumbnail */}
                <div
                  className={cn(
                    'relative h-[84px] rounded-lg overflow-hidden bg-white transition-all duration-200',
                    isSelected
                      ? 'ring-2 ring-[#bf5af2] ring-offset-1 ring-offset-[#1c1c1e]'
                      : 'ring-1 ring-white/[0.07] group-hover:ring-[#bf5af2]/40',
                  )}
                >
                  <TemplatePreview
                    templateId={template.id}
                    className="w-full h-full"
                    enableZoom={false}
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#bf5af2] flex items-center justify-center shadow-sm">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Name */}
                <p
                  className={cn(
                    'mt-1 text-[10px] font-medium leading-tight px-0.5 truncate transition-colors',
                    isSelected ? 'text-[#bf5af2]' : 'text-white/55 group-hover:text-white/75',
                  )}
                >
                  {template.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-white/[0.06] flex items-center gap-2">
        <p className="text-[11px] text-white/40 truncate flex-1 min-w-0">
          {selectedName ? (
            <span className="text-white/65 font-medium">{selectedName}</span>
          ) : (
            'None selected'
          )}
        </p>
        <button
          onClick={handleCancel}
          className="px-3 py-1 rounded-full text-[12px] font-medium text-white/60 bg-white/[0.07] hover:bg-white/[0.12] transition-colors flex-shrink-0"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          disabled={!selectedTemplate}
          className={cn(
            'px-3 py-1 rounded-full text-[12px] font-semibold transition-colors flex-shrink-0',
            selectedTemplate
              ? 'bg-[#bf5af2] text-white hover:bg-[#a64de0]'
              : 'bg-white/[0.07] text-white/25 cursor-not-allowed',
          )}
        >
          Done
        </button>
      </div>
    </div>
  );
}
