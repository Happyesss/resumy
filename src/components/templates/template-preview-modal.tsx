'use client';

import { trackResumeEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTemplateHandler } from "./use-template-handler";

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  image: string;
  features: string[];
  rating: number;
  downloads: number;
  preview: string;
}

interface TemplatePreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryAccent: Record<string, string> = {
  modern:   'text-[#0a84ff] bg-[#0a84ff]/10',
  classic:  'text-[#5e5ce6] bg-[#5e5ce6]/10',
  creative: 'text-[#bf5af2] bg-[#bf5af2]/10',
  minimal:  'text-[#aeaeb2] bg-white/[0.07]',
};

const categoryDescriptions: Record<string, string> = {
  modern:   'Clean lines and a contemporary look that feels right at home in any modern industry.',
  classic:  'A timeless, structured format trusted by executives and recruiters worldwide.',
  creative: 'Bold layout with personality — ideal for design, media, and creative roles.',
  minimal:  'Every pixel of white space is intentional. Content speaks for itself.',
};

export function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
  const { handleUseTemplate: applyTemplate } = useTemplateHandler();
  const panelRef = useRef<HTMLDivElement>(null);

  // Trap focus & close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!template || !isOpen) return null;

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const handleUse = () => {
    trackResumeEvent.selectTemplate(template.name);
    applyTemplate({ templateId: template.id });
    onClose();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dim */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel — bottom sheet on mobile, centered card on sm+ */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={template.name}
        className={cn(
          "relative z-10 w-full",
          // Mobile: bottom sheet — full width, rounded top corners, limited height
          "max-h-[92dvh] rounded-t-3xl",
          "sm:rounded-3xl sm:max-w-2xl sm:mx-4",
          "bg-[#1c1c1e] flex flex-col sm:flex-row overflow-hidden",
          "shadow-2xl shadow-black/80"
        )}
      >
        {/* ── Drag handle (mobile only) ── */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        {/* ── Resume preview pane ── */}
        <div className={cn(
          "flex-shrink-0 flex items-center justify-center",
          "bg-[#242426]",
          // Mobile: horizontal strip at top
          "py-5 px-6",
          // Desktop: left column
          "sm:w-[46%] sm:py-8 sm:px-8",
          "rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none"
        )}>
          {/* A4 paper */}
          <div
            className="relative bg-white rounded-lg overflow-hidden w-full"
            style={{
              maxWidth: '180px',
              aspectRatio: '1 / 1.414',
              boxShadow: '0 4px 24px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)'
            }}
          >
            <Image
              src={template.preview}
              alt={`${template.name} preview`}
              fill
              className="object-contain object-top"
              sizes="180px"
              priority
            />
          </div>
        </div>

        {/* ── Info pane ── */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-white/[0.07] flex-shrink-0">
            <div>
              <h2 className="text-[17px] font-bold text-white leading-snug">{template.name}</h2>
              <span className={cn(
                "inline-block mt-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize tracking-wide",
                categoryAccent[template.category]
              )}>
                {template.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors flex-shrink-0 mt-0.5"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5 text-white/50" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4 min-h-0">
            {/* Description */}
            <p className="text-[13px] text-white/50 leading-relaxed">
              {categoryDescriptions[template.category]}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Rating', value: String(template.rating) },
                { label: 'Downloads', value: fmt(template.downloads) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-center">
                  <p className="text-[16px] font-bold text-white tabular-nums">{value}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2.5">Features</p>
              <div className="space-y-1.5">
                {template.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#30d158]/15 flex items-center justify-center flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-[#30d158]" />
                    </div>
                    <span className="text-[12px] text-white/60">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 pb-6 pt-3 flex-shrink-0 border-t border-white/[0.07]">
            <button
              onClick={handleUse}
              className={cn(
                "w-full h-11 rounded-2xl",
                "bg-[#bf5af2] hover:bg-[#a64de0] active:bg-[#9340cc]",
                "text-white font-semibold text-[15px]",
                "transition-colors duration-150",
                "shadow-lg shadow-[#bf5af2]/20"
              )}
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
