'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trackResumeEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
    ArrowRight, Check, RotateCcw, Star,
    Users, ZoomIn,
    ZoomOut
} from "lucide-react";
import Image from "next/image";
import { useState } from 'react';
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

const categoryColors = {
  modern: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  classic: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  creative: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  minimal: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

const categoryDescriptions = {
  modern: 'Contemporary design with clean lines and modern aesthetics',
  classic: 'Traditional professional format that never goes out of style',
  creative: 'Unique and eye-catching design for creative professionals',
  minimal: 'Clean and simple design focusing on content'
};

export function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const { handleUseTemplate: applyTemplate } = useTemplateHandler();

  if (!template) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleUseTemplate = () => {
    trackResumeEvent.selectTemplate(template.name);
    applyTemplate({ templateId: template.id });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-gray-950 border-gray-800 text-white p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Side - Template Preview */}
          <div className="flex-1 bg-gray-900 border-r border-gray-800 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{template.rating}</span>
                <span className="text-xs text-gray-400 mx-2">•</span>
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">{formatNumber(template.downloads)}</span>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-300 px-2 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 2}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 bg-gray-600 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Template Preview */}
            <div className="w-full h-full flex items-center justify-center pt-20 pb-8 px-8 overflow-auto">
              <div 
                className="bg-white rounded-lg shadow-2xl transition-transform duration-300 ease-out"
                style={{ 
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center'
                }}
              >
                <div className="relative aspect-[8.5/11] w-80">
                  <Image
                    src={template.preview}
                    alt={`${template.name} preview`}
                    fill
                    className="object-contain rounded-lg"
                    sizes="320px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Template Details */}
          <div className="w-96 bg-gray-950 flex flex-col min-h-0">
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {template.name}
                  </DialogTitle>
                  <Badge className={cn("text-xs", categoryColors[template.category])}>
                    {template.category}
                  </Badge>
                </div>
               </div>
            </DialogHeader>

            <ScrollArea className="flex-1 px-6 min-h-0 h-full">
              <div className="space-y-6 pb-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Category Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Category</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {categoryDescriptions[template.category]}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Features</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {template.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/50 border border-gray-800"
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-green-400" />
                        </div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                 </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-800 space-y-3">
              <Button 
                onClick={handleUseTemplate}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                size="lg"
              >
                Use This Template
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}