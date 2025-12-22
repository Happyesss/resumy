'use client';

import { CoverLetterPDFDocument } from "@/components/cover-letter/cover-letter-pdf-document";
import { toast } from "@/hooks/use-toast";
import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { pdf } from '@react-pdf/renderer';
import { 
  CheckCircle, 
  Download, 
  FileText, 
  Loader2, 
  Mail, 
  Palette, 
  Save, 
  Upload 
} from "lucide-react";
import { TextImportDialog } from "../../management/dialogs/text-import-dialog";
import { ResumePDFDocument } from "../preview/resume-pdf-document";
import { useResumeContext } from "../resume-editor-context";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { trackResumeEvent } from "@/lib/analytics";
import { updateResume } from "@/utils/actions/resumes/actions";
import { useState } from "react";

import { Dispatch, SetStateAction } from "react";

interface ResumeEditorActionsProps {
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

// Action button component for consistency
const ActionButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  variant = 'default',
  disabled = false,
  isLoading = false 
}: { 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  const variantStyles = {
    default: "text-zinc-400 hover:text-white hover:bg-zinc-800",
    primary: "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10",
    success: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
    warning: "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={cn(
              "w-9 h-9 flex items-center justify-center",
              "rounded-lg",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              variantStyles[variant]
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <Icon className="h-4.5 w-4.5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Quick access tab button
const QuickTabButton = ({ 
  onClick, 
  icon: Icon, 
  label,
  color 
}: { 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string;
  color: string;
}) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "flex items-center justify-center",
            "w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg",
            "text-xs font-medium",
            "transition-all duration-200",
            "hover:scale-105",
            color
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs sm:hidden"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function ResumeEditorActions({
  onResumeChange,
  setActiveTab
}: ResumeEditorActionsProps) {
  const { state, dispatch } = useResumeContext();
  const { resume, isSaving } = state;
  const [downloadOptions, _setDownloadOptions] = useState({
    resume: true,
    coverLetter: true
  });

  // Save Resume
  const handleSave = async () => {
    try {
      dispatch({ type: 'SET_SAVING', value: true });
      await updateResume(state.resume.id, state.resume);
      toast({
        title: "Changes saved",
        description: "Your resume has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_SAVING', value: false });
    }
  };

  // Download handler
  const handleDownload = async () => {
    try {
      if (downloadOptions.resume) {
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
      }

      if (downloadOptions.coverLetter && resume.has_cover_letter) {
        trackResumeEvent.createCoverLetter();
        const blob = await pdf(<CoverLetterPDFDocument resume={resume} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.first_name}_${resume.last_name}_Cover_Letter.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Download started",
        description: "Your documents are being downloaded.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unable to download your documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn(
      "px-2 py-2 sm:px-3 sm:py-2.5 @container",
      "flex items-center justify-between gap-2 sm:gap-4",
      "bg-zinc-950"
    )}>
      {/* Left side: Quick access tabs */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <QuickTabButton
          onClick={() => setActiveTab("cover-letter")}
          icon={FileText}
          label="Cover Letter"
          color="text-violet-400 bg-violet-500/10 hover:bg-violet-500/20"
        />
        <QuickTabButton
          onClick={() => setActiveTab("resume-score")}
          icon={CheckCircle}
          label="Score"
          color="text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
        />
        <QuickTabButton
          onClick={() => setActiveTab("cold-mail")}
          icon={Mail}
          label="Cold Email"
          color="text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
        />
        <QuickTabButton
          onClick={() => setActiveTab("templates")}
          icon={Palette}
          label="Templates"
          color="text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
        />
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* Import */}
        <TextImportDialog
          resume={resume}
          onResumeChange={onResumeChange}
          trigger={
            <button
              className={cn(
                "flex items-center justify-center",
                "w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg",
                "text-xs font-medium",
                "text-indigo-400 bg-indigo-500/10",
                "hover:bg-indigo-500/20",
                "transition-all duration-200"
              )}
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Import</span>
            </button>
          }
        />

        {/* Divider */}
        <div className="w-px h-5 sm:h-6 bg-zinc-800 mx-1 sm:mx-2" />

        {/* Download */}
        <ActionButton
          onClick={handleDownload}
          icon={Download}
          label="Download PDF"
          variant="primary"
        />

        {/* Save */}
        <ActionButton
          onClick={handleSave}
          icon={Save}
          label="Save Changes"
          variant="success"
          disabled={isSaving}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}