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
  premium: boolean;
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
    premium: false,
    rating: 4.5,
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
    premium: false,
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
    premium: false,
    rating: 4.6,
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
    premium: true,
    rating: 4.9,
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
    premium: false,
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
    premium: true,
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
    premium: false,
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
      {/* Header Section */}
      <div className="text-center space-y-4 py-4 sm:py-8 px-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Resume Templates
          </h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
          Browse our collection of professionally designed resume templates. 
          Each template is ATS-optimized and ready to help you land your dream job.
        </p>
        
        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 mt-6">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>4.7 average rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-green-400" />
            <span>50K+ downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-400" />
            <span>Free previews</span>
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
