'use client';

import { Resume } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";
import { ResumePreview } from "./resume-preview";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from "./resume-pdf-document";
import { useToast } from "@/hooks/use-toast";
import { trackResumeEvent } from '@/lib/analytics';

interface MobileFullscreenPreviewProps {
  resume: Resume;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFullscreenPreview({ 
  resume, 
  isOpen, 
  onClose 
}: MobileFullscreenPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Calculate optimal width based on screen size and zoom
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateWidth = () => {
        const screenWidth = window.innerWidth;
        
        // Base width for A4 aspect ratio (8.5:11), use 90% of screen width
        const baseWidth = Math.min(screenWidth * 0.9, 600);
        setContainerWidth(baseWidth);
      };

      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []); // Remove zoom dependency since we handle scaling differently

  // Reset position when zoom changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [zoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Touch and mouse event handlers for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      e.preventDefault();
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Download functionality - using the same logic as the context menu
  const handleDownload = async () => {
    try {
      // Track download event
      trackResumeEvent.downloadResume('PDF');
      
      const blob = await pdf(<ResumePDFDocument resume={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.first_name}_${resume.last_name}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your resume PDF is being downloaded.",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Unable to download your resume. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "w-full h-full max-w-none max-h-none m-0 p-0 rounded-none",
          "bg-gray-50 overflow-hidden flex flex-col",
          "[&>button]:hidden" // Hide the default close button
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between p-3 bg-white border-b shadow-sm shrink-0">
          <DialogTitle className="text-base font-medium text-gray-900 truncate">
            {resume.first_name} {resume.last_name} - Resume
          </DialogTitle>
          
          <div className="flex items-center gap-1">
            {/* Download Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="h-6 w-6 p-0"
                title="Zoom Out"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              
              <span className="text-xs font-medium min-w-[2.5rem] text-center text-gray-600">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="h-6 w-6 p-0"
                title="Zoom In"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                className="h-6 w-6 p-0"
                title="Reset Zoom"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-hidden bg-gray-100 touch-pan-x touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <div className="w-full h-full overflow-auto">
            <div className="flex justify-center items-start min-h-full p-4">
              <div 
                className="transition-transform duration-200 ease-in-out origin-top"
                style={{ 
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'top center'
                }}
              >
                <ResumePreview 
                  resume={resume} 
                  containerWidth={containerWidth} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="bg-white border-t px-3 py-2 text-xs text-gray-500 text-center shrink-0">
          {zoom > 1 ? 'Drag to pan • ' : ''}Pinch to zoom or use controls above
        </div>
      </DialogContent>
    </Dialog>
  );
}