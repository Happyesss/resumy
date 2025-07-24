'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Download, Star, Users, Eye, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
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
  template: Template;
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors = {
  modern: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  classic: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  creative: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  minimal: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
  const { handleUseTemplate } = useTemplateHandler();
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const onUseTemplate = () => {
    handleUseTemplate({ 
      templateId: template.id,
      onSuccess: onClose 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-gray-900 border-gray-800">
        <DialogHeader className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-semibold text-white">
                  {template.name}
                </DialogTitle>
                <Badge className={cn("text-sm", categoryColors[template.category])}>
                  {template.category}
                </Badge>

              </div>
              <p className="text-gray-400 text-sm max-w-2xl">
                {template.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500 pt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{template.rating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(template.downloads)} downloads</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 bg-gray-800 relative overflow-auto">
            <div className="p-8 flex items-center justify-center min-h-full">
              {/* Template Preview */}
              <Card className="w-full max-w-2xl bg-white shadow-2xl">
                <CardContent className="p-0">
                  <div className="aspect-[8.5/11] bg-white rounded-lg overflow-hidden relative">
                    <Image
                      src={template.preview}
                      alt={`${template.name} full preview`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">
            <div className="p-6 space-y-6">
              {/* Features */}
              <div>
                <h4 className="font-semibold text-white mb-3">Template Features</h4>
                <div className="space-y-2">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div>
                <h4 className="font-semibold text-white mb-3">Best For</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  {template.category === 'modern' && (
                    <>
                      <div>• Tech professionals</div>
                      <div>• Startups & modern companies</div>
                      <div>• Creative industries</div>
                    </>
                  )}
                  {template.category === 'classic' && (
                    <>
                      <div>• Traditional industries</div>
                      <div>• Executive positions</div>
                      <div>• Conservative companies</div>
                    </>
                  )}
                  {template.category === 'creative' && (
                    <>
                      <div>• Design & creative roles</div>
                      <div>• Marketing positions</div>
                      <div>• Agencies & studios</div>
                    </>
                  )}
                  {template.category === 'minimal' && (
                    <>
                      <div>• Any industry</div>
                      <div>• Clean, professional look</div>
                      <div>• ATS-friendly format</div>
                    </>
                  )}
                </div>
              </div>

              {/* File Formats */}
              <div>
                <h4 className="font-semibold text-white mb-3">Included Formats</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-sm text-gray-300">PDF Download</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-sm text-gray-300">Online Editor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-sm text-gray-300">ATS Compatible</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto p-6 border-t border-gray-800 space-y-3">
              <Button 
                onClick={onUseTemplate}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                onClick={() => {
                  // Open full-size preview in new tab
                  window.open(template.preview, '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full Preview
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
