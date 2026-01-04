'use client';

import CoverLetter from "@/components/cover-letter/cover-letter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import { MobileFullscreenPreview } from "../preview/mobile-fullscreen-preview";
import { ResumeContextMenu } from "../preview/resume-context-menu";
import { ResumePreview } from "../preview/resume-preview";

interface PreviewPanelProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  width: number;
  // percentWidth: number;
}

export function PreviewPanel({
  resume,
  // onResumeChange,
  width
}: PreviewPanelProps) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  return (
    <>
      <ScrollArea className={cn(
        "z-50 h-full relative",
        "bg-transparent"
      )}>
        {/* Mobile Fullscreen Button */}
        <div className="md:hidden absolute top-3 right-3 z-50">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFullscreenOpen(true)}
            className="bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white border border-gray-300 hover:shadow-xl transition-all duration-200"
          >
            <Maximize2 className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">View Full</span>
          </Button>
        </div>

        <div className="">
        <ResumeContextMenu resume={resume}>
            <ResumePreview resume={resume} containerWidth={width} />
          </ResumeContextMenu>
        </div>

        <CoverLetter 
          // resumeId={resume.id} 
          // hasCoverLetter={resume.has_cover_letter}
          // coverLetterData={resume.cover_letter}
          containerWidth={width}
          // onCoverLetterChange={(data: Record<string, unknown>) => {
          //   if ('has_cover_letter' in data) {
          //     onResumeChange('has_cover_letter', data.has_cover_letter as boolean);
          //   }
          //   if ('cover_letter' in data) {    
          //     onResumeChange('cover_letter', data.cover_letter as Record<string, unknown>);
          //   }
          // }}
        />
      </ScrollArea>

      {/* Mobile Fullscreen Modal */}
      <MobileFullscreenPreview
        resume={resume}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </>
  );
} 