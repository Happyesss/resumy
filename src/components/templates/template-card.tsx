'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Download, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTemplateHandler } from "./use-template-handler";
import { trackResumeEvent } from "@/lib/analytics";

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

interface TemplateCardProps {
  template: Template;
  onPreview: () => void;
}

const categoryColors = {
  modern: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  classic: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  creative: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  minimal: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const { handleUseTemplate } = useTemplateHandler();
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const onUseTemplate = () => {
    // Track template selection
    trackResumeEvent.selectTemplate(template.name);
    handleUseTemplate({ templateId: template.id });
  };

  return (
    <Card className="group border border-gray-700 bg-gray-900/50 hover:border-gray-600 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-purple-500/10">
      <CardContent className="p-0">
        {/* Template Preview */}
        <div className="relative aspect-[3/4] bg-gray-800 rounded-t-lg overflow-hidden">
          {/* Template Image */}
          <div className="w-full h-full bg-white relative p-2">
            <div className="w-full h-full relative rounded overflow-hidden">
              <Image
                src={template.image}
                alt={template.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>
          </div>
          {/* ...removed premium badge... */}

          {/* Rating */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <div className="flex items-center gap-1 bg-black/70 rounded px-2 py-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-white font-medium">{template.rating}</span>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Button
                onClick={onPreview}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1 text-sm sm:text-base min-w-0 flex-1">
              {template.name}
            </h3>
            <Badge className={cn("text-xs flex-shrink-0", categoryColors[template.category])}>
              {template.category}
            </Badge>
          </div>
          
          <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
            {template.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {template.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
              <Users className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">{formatNumber(template.downloads)} downloads</span>
                <span className="sm:hidden">{formatNumber(template.downloads)}</span>
              </span>
            </div>
            <Button 
              onClick={onUseTemplate}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-2 sm:px-3 flex-shrink-0"
            >
              <span className="hidden sm:inline">Use Template</span>
              <span className="sm:hidden">Use</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
