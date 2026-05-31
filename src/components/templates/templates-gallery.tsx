'use client';

import { useState } from 'react';
import { TemplateCard } from "./template-card";
import { TemplateFilter } from "./template-filter";
import { TemplatePreviewModal } from "./template-preview-modal";

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

const templates: Template[] = [
  {
    id: 'default',
    name: 'Default Professional',
    description: 'Clean and simple default resume format perfect for any industry',
    category: 'minimal',
    image: '/templates/defaultTemplate.png',
    features: ['ATS Optimized', 'Simple Layout', 'Standard Format'],
    rating: 5.0,
    downloads: 15420,
    preview: '/templates/defaultTemplate.png'
  },
  {
    id: 'modern-1',
    name: 'Modern Professional',
    description: 'Contemporary design with blue accents and clean typography',
    category: 'modern',
    image: '/templates/modernProfessional.png',
    features: ['Modern Design', 'Color Accents', 'Professional Layout'],
    rating: 4.8,
    downloads: 12890,
    preview: '/templates/modernProfessional.png'
  },
  {
    id: 'classic-1',
    name: 'Classic Executive',
    description: 'Traditional executive style with elegant typography',
    category: 'classic',
    image: '/templates/classic.png',
    features: ['Traditional Style', 'Executive Format', 'Formal Layout'],
    rating: 4.95,
    downloads: 9540,
    preview: '/templates/classic.png'
  },
  {
    id: 'creative-modern',
    name: 'Creative Modern',
    description: 'Bold and creative design perfect for creative industries',
    category: 'creative',
    image: '/templates/creativeModern.png',
    features: ['Creative Design', 'Bold Colors', 'Unique Layout'],
    rating: 4.5,
    downloads: 8320,
    preview: '/templates/creativeModern.png'
  },
  {
    id: 'minimal-1',
    name: 'Minimal Clean',
    description: 'Ultra-clean minimal design with perfect white space',
    category: 'minimal',
    image: '/templates/minimalClean.png',
    features: ['Minimal Design', 'Clean Layout', 'White Space'],
    rating: 4.7,
    downloads: 11200,
    preview: '/templates/minimalClean.png'
  },
  {
    id: 'modern-2',
    name: 'Tech Professional',
    description: 'Modern tech-focused design with technical styling',
    category: 'modern',
    image: '/templates/techProfessional.png',
    features: ['Tech Style', 'Modern Layout', 'Professional'],
    rating: 4.8,
    downloads: 7650,
    preview: '/templates/techProfessional.png'
  },
  {
    id: 'creative-minimal',
    name: 'Creative Minimal',
    description: 'Perfect balance of creativity and minimalism',
    category: 'creative',
    image: '/templates/creativeMinimal.png',
    features: ['Creative Elements', 'Minimal Style', 'Balanced Design'],
    rating: 4.6,
    downloads: 6890,
    preview: '/templates/creativeMinimal.png'
  },
  {
    id: 'ca-professional',
    name: 'CA Professional',
    description: 'Specialized template for Chartered Accountants',
    category: 'classic',
    image: '/templates/CAprofessional.png',
    features: ['Finance Focus', 'Professional Layout', 'ATS Optimized', 'CA Specialized'],
    rating: 4.9,
    downloads: 5420,
    preview: '/templates/CAprofessional.png'
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'The iconic sb2nov LaTeX template trusted by SWE candidates worldwide',
    category: 'classic',
    image: '/templates/softwareEngineer.png',
    features: ['SWE Focused', 'LaTeX Classic', 'ATS Optimized', 'Single Column'],
    rating: 4.9,
    downloads: 8700,
    preview: '/templates/softwareEngineer.png'
  }
];

const categories = [
  { id: 'all',      name: 'All',      count: templates.length },
  { id: 'modern',   name: 'Modern',   count: templates.filter(t => t.category === 'modern').length },
  { id: 'classic',  name: 'Classic',  count: templates.filter(t => t.category === 'classic').length },
  { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
  { id: 'minimal',  name: 'Minimal',  count: templates.filter(t => t.category === 'minimal').length },
];

export function TemplatesGallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filtered = templates.filter(t =>
    selectedCategory === 'all' || t.category === selectedCategory
  );

  return (
    <>
      <div className="space-y-8 pb-16">
        {/* ── Hero ─────────────────────────────── */}
        <div className="pt-12 pb-2 text-center space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Resumy Templates
          </p>
          <h1 className="text-[34px] sm:text-[44px] lg:text-[52px] font-bold tracking-tight text-white leading-[1.05]">
            Find your&nbsp;
            <span className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
              perfect design.
            </span>
          </h1>
          <p className="text-[15px] sm:text-[16px] text-white/40 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            Every template is ATS-ready and free to preview.
          </p>

          {/* Stat chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            {[
              { v: '4.8★', l: 'avg rating' },
              { v: '50k+', l: 'downloads' },
              { v: '9',    l: 'templates' },
            ].map(({ v, l }) => (
              <div
                key={l}
                className="flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04]"
              >
                <span className="text-[13px] font-semibold text-white">{v}</span>
                <span className="text-[11px] text-white/35">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filter ───────────────────────────── */}
        <TemplateFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* ── Count label ──────────────────────── */}
        <p className="text-[12px] text-white/25">
          {filtered.length} template{filtered.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </p>

        {/* ── Grid ─────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-7">
            {filtered.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                onPreview={() => setPreviewTemplate(t)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-2">
            <p className="text-[17px] font-semibold text-white">No templates</p>
            <p className="text-[14px] text-white/35">Try a different filter</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-3 px-5 py-2 rounded-full border border-white/[0.12] text-white/60 hover:text-white text-[13px] font-medium transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* ── Preview modal ─────────────────────── */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </>
  );
}
