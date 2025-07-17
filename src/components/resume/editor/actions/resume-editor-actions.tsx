'use client';

import { Resume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Save, FileText, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { pdf } from '@react-pdf/renderer';
import { TextImportDialog } from "../../management/dialogs/text-import-dialog";
import { ResumePDFDocument } from "../preview/resume-pdf-document";
import { cn } from "@/lib/utils";
import { useResumeContext } from "../resume-editor-context";

import { updateResume } from "@/utils/actions/resumes/actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

import { Dispatch, SetStateAction } from "react";

interface ResumeEditorActionsProps {
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export function ResumeEditorActions({
  onResumeChange,
  setActiveTab
}: ResumeEditorActionsProps) {
  const { state, dispatch } = useResumeContext();
  const { resume, isSaving } = state;
  const [downloadOptions, setDownloadOptions] = useState({
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


  // Dynamic color classes based on resume type
  const colors = resume.is_base_resume ? {
    // Import button colors
    importBg: "bg-indigo-600",
    importHover: "hover:bg-indigo-700",
    importShadow: "shadow-indigo-400/20",
    // Action buttons colors (download & save)
    actionBg: "bg-purple-600",
    actionHover: "hover:bg-purple-700",
    actionShadow: "shadow-purple-400/20"
  } : {
    // Import button colors
    importBg: "bg-rose-600",
    importHover: "hover:bg-rose-700",
    importShadow: "shadow-rose-400/20",
    // Action buttons colors (download & save)
    actionBg: "bg-pink-600",
    actionHover: "hover:bg-pink-700",
    actionShadow: "shadow-pink-400/20"
  };

  
  const buttonBaseStyle = cn(
    "transition-all duration-300",
    "relative overflow-hidden",
    "h-8 px-3 text-[11px] font-medium",
    "rounded-md border-none",
    "text-white shadow-sm",
    "hover:shadow-md hover:-translate-y-[1px]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
  );

  const importButtonClasses = cn(
    buttonBaseStyle,
    colors.importBg,
    colors.importHover,
    colors.importShadow
  );

  const actionButtonClasses = cn(
    buttonBaseStyle,
    colors.actionBg,
    colors.actionHover,
    colors.actionShadow
  );

  return (
    <div className="px-1 py-2 @container bg-black flex items-center justify-between">
      {/* Left side: Cover Letter, Resume Score, and Templates tabs */}
      <div className="flex items-center gap-4 pl-2">
        {/* Cover Letter Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="hover:opacity-80 transition-opacity"
                type="button"
                onClick={() => setActiveTab("cover-letter")}
              >
                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Cover Letter</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Resume Score Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="hover:opacity-80 transition-opacity"
                type="button"
                onClick={() => setActiveTab("resume-score")}
              >
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Resume Score</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Templates Tab */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setActiveTab("templates")}
                className="group flex items-center gap-1.5 px-2 py-1 rounded-md font-medium relative transition-all duration-300
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20
                  data-[state=active]:border-amber-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
                  data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
              >
                {/* Palette icon from lucide-react, no background */}
                <Palette className="h-5 w-5 text-orange-400 transition-colors group-data-[state=inactive]:text-amber-500/70" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Templates</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Right side: Import, Download, Save icons */}
      <div className="flex items-center gap-3 pr-2">
        {/* Import Icon */}
        <TextImportDialog
          resume={resume}
          onResumeChange={onResumeChange}
          trigger={
            <button
              className="px-3 py-1 text-sm font-medium text-indigo-400 hover:text-indigo-500 bg-transparent border border-indigo-500 rounded-md focus:outline-none transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md"
              style={{ minWidth: 0 }}
            >
              Import
            </button>
          }
        />

        {/* Download Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={async () => {
                  try {
                    // Download Resume if selected
                    if (downloadOptions.resume) {
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

                    // Download Cover Letter if selected and exists
                    if (downloadOptions.coverLetter && resume.has_cover_letter) {
                      // Dynamically import html2pdf only when needed
                      const html2pdf = (await import('html2pdf.js')).default;
                      
                      const coverLetterElement = document.getElementById('cover-letter-content');
                      if (!coverLetterElement) {
                        throw new Error('Cover letter content not found');
                      }

                      const opt = {
                        margin: [0, 0, -0.5, 0],
                        filename: `${resume.first_name}_${resume.last_name}_Cover_Letter.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: {
                          useCORS: true,
                          letterRendering: true,
                        },
                        jsPDF: { 
                          unit: 'in', 
                          format: 'letter', 
                          orientation: 'portrait' 
                        }
                      };

                      await html2pdf().set(opt).from(coverLetterElement).save();
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
                }}
                className="w-8 h-8 flex items-center justify-center bg-transparent border-none shadow-none focus:outline-none group"
              >
                <Download className="h-5 w-5 text-blue-400 group-hover:text-blue-500 transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Download</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Save Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-8 h-8 flex items-center justify-center bg-transparent border-none shadow-none focus:outline-none group"
              >
                {isSaving ? (
                  <Loader2 className="h-5 w-5 text-green-500 animate-spin" />
                ) : (
                  <Save className="h-5 w-5 text-green-500 group-hover:text-green-600 transition-colors" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Save</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}