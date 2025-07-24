'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Download, Star, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplateCard } from "./template-card";
import { TemplateFilter } from "./template-filter";
import { TemplatePreviewModal } from "./template-preview-modal";

// Template data structure
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

// Sample template data - in a real app, this would come from an API
const templates: Template[] = [
  {
    id: 'default',
    name: 'Default Professional',
    description: 'Clean and simple default resume format perfect for any industry',
    category: 'minimal',
    image: '/templates/default-preview.png',
    features: ['ATS Optimized', 'Simple Layout', 'Standard Format'],

    rating: 5.0,
    downloads: 15420,
    preview: '/templates/default-full.png'
  },
  {
    id: 'modern-1',
    name: 'Modern Professional',
    description: 'Contemporary design with blue accents and clean typography',
    category: 'modern',
    image: '/templates/modern-1-preview.png',
    features: ['Modern Design', 'Color Accents', 'Professional Layout'],

    rating: 4.8,
    downloads: 12890,
    preview: '/templates/modern-1-full.png'
  },
  {
    id: 'classic-1',
    name: 'Classic Executive',
    description: 'Traditional executive style with elegant typography',
    category: 'classic',
    image: '/templates/classic-1-preview.png',
    features: ['Traditional Style', 'Executive Format', 'Formal Layout'],

    rating: 4.95,
    downloads: 9540,
    preview: '/templates/classic-1-full.png'
  },
  {
    id: 'creative-modern',
    name: 'Creative Modern',
    description: 'Bold and creative design perfect for creative industries',
    category: 'creative',
    image: '/templates/creative-modern-preview.png',
    features: ['Creative Design', 'Bold Colors', 'Unique Layout'],

    rating: 4.5,
    downloads: 8320,
    preview: '/templates/creative-modern-full.png'
  },
  {
    id: 'minimal-1',
    name: 'Minimal Clean',
    description: 'Ultra-clean minimal design with perfect white space',
    category: 'minimal',
    image: '/templates/minimal-1-preview.png',
    features: ['Minimal Design', 'Clean Layout', 'White Space'],

    rating: 4.7,
    downloads: 11200,
    preview: '/templates/minimal-1-full.png'
  },
  {
    id: 'modern-2',
    name: 'Tech Professional',
    description: 'Modern tech-focused design with technical styling',
    category: 'modern',
    image: '/templates/modern-2-preview.png',
    features: ['Tech Style', 'Modern Layout', 'Professional'],

    rating: 4.8,
    downloads: 7650,
    preview: '/templates/modern-2-full.png'
  },
  {
    id: 'creative-minimal',
    name: 'Creative Minimal',
    description: 'Perfect balance of creativity and minimalism',
    category: 'creative',
    image: '/templates/creative-minimal-preview.png',
    features: ['Creative Elements', 'Minimal Style', 'Balanced Design'],

    rating: 4.6,
    downloads: 6890,
    preview: '/templates/creative-minimal-full.png'
  }
];

const categories = [
  { id: 'all', name: 'All Templates', count: templates.length },
  { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
  { id: 'classic', name: 'Classic', count: templates.filter(t => t.category === 'classic').length },
  { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
  { id: 'minimal', name: 'Minimal', count: templates.filter(t => t.category === 'minimal').length }
];

export function TemplatesGallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Filter templates based on category
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Section - Liquid Glassy Design */}
      <div className="flex justify-center py-6">
  <div className="relative backdrop-blur-lg bg-black/40 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
          {/* Liquid morphing background elements (smaller) */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-800/30 to-pink-800/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-pink-900/15 to-blue-900/15 rounded-full blur-lg animate-pulse delay-500" />
          <div className="relative text-center space-y-3">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-pink-800 rounded-xl blur-md opacity-60 animate-pulse" />
                <div className="relative p-2 sm:p-2.5 bg-gradient-to-r from-purple-800 to-pink-800 rounded-xl backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow">
                Resume Templates
              </h1>
            </div>
            <div className="relative">
              <p className="text-gray-200 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-normal drop-shadow">
                Browse our collection of professionally designed resume templates. 
                Each template is ATS-optimized and ready to help you land your dream job.
              </p>
            </div>
            {/* Stats with glassy cards (smaller) */}
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 mt-4 flex-wrap">
              <div className="backdrop-blur-sm bg-black/30 border border-white/10 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 hover:bg-black/40 transition-all duration-300">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 drop-shadow" />
                <span className="text-white/80 text-xs sm:text-sm font-medium whitespace-nowrap">4.7 rating</span>
              </div>
              <div className="backdrop-blur-sm bg-black/30 border border-white/10 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 hover:bg-black/40 transition-all duration-300">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 drop-shadow" />
                <span className="text-white/80 text-xs sm:text-sm font-medium whitespace-nowrap">50K+ downloads</span>
              </div>
              <div className="backdrop-blur-sm bg-black/30 border border-white/10 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 hover:bg-black/40 transition-all duration-300">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 drop-shadow" />
                <span className="text-white/80 text-xs sm:text-sm font-medium whitespace-nowrap">Free previews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <TemplateFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between px-4 sm:px-0">
        <p className="text-gray-400 text-sm sm:text-base">
          Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={() => setPreviewTemplate(template)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card className="border border-gray-700 bg-gray-900/50">
          <CardContent className="p-12 text-center">
            <Filter className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              onClick={() => {
                setSelectedCategory('all');
              }}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}
