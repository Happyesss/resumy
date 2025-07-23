'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, AlertTriangle } from "lucide-react";
import { Resume } from "@/lib/types";

import { toast } from "sonner";
import { convertTextToResume } from "@/utils/actions/resumes/ai";
import pdfToText from "react-pdftotext";
import { cn } from "@/lib/utils";

interface TextImportDialogProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  trigger: React.ReactNode;
}

export function TextImportDialog({
  resume,
  onResumeChange,
  trigger
}: TextImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");

  useEffect(() => {
    if (!open) {
      setApiKeyError("");
    }
  }, [open]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === "application/pdf");

    if (pdfFile) {
      try {
        const text = await pdfToText(pdfFile);
        setContent(prev => prev + (prev ? "\n\n" : "") + text);
      } catch (err) {
        console.error('PDF processing error:', err);
        toast.error("Failed to extract text from the PDF. Please try again or paste the content manually.");
      }
    } else {
      toast.error("Please drop a PDF file.");
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      try {
        const text = await pdfToText(file);
        setContent(prev => prev + (prev ? "\n\n" : "") + text);
      } catch (err) {
        console.error('PDF processing error:', err);
        toast.error("Failed to extract text from the PDF. Please try again or paste the content manually.");
      }
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const handleImport = async () => {
    setApiKeyError("");
    if (!content.trim()) {
      toast.error("Please enter some text to import.");
      return;
    }

    setIsProcessing(true);
    try {
      // Provide a default AIConfig to use the environment variable for Gemini
      const aiConfig = {
        model: 'gemini-2.5-flash-lite',
        apiKeys: [],
      };
      // Use convertTextToResume for better extraction
      const updatedResume = await convertTextToResume(content, resume, resume.target_role || "", aiConfig);
      // Update each field of the resume
      (Object.keys(updatedResume) as Array<keyof Resume>).forEach((key) => {
        onResumeChange(key, updatedResume[key] as Resume[keyof Resume]);
      });

      toast.success("Your resume has been updated with the imported content.");
      setOpen(false);
      setContent("");
    } catch (error) {
      console.error('Import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      if (errorMessage.includes('API key')) {
        setApiKeyError(
          'API key required to use AI features.'
        );
      } else {
        toast.error("Failed to process the text. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900/95 backdrop-blur-xl border-gray-800/60 shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Import Resume Content
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Upload a PDF or paste your resume text below
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer group",
              "bg-gray-800/30 backdrop-blur-sm",
              isDragging
                ? "border-violet-400 bg-violet-500/10"
                : "border-gray-700/60 hover:border-violet-400/60 hover:bg-violet-500/5"
            )}
          >
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileInput}
            />
            <div className="p-2 rounded-full bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
              <Upload className="w-6 h-6 text-violet-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                Drop PDF here or click to browse
              </p>
            </div>
          </label>
          
          <div className="relative">
            <div className="absolute -top-2.5 left-3 bg-gray-900 px-2 text-xs text-violet-400 font-medium">
              Or paste text here
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your resume content here..."
              className={cn(
                "min-h-[100px] bg-gray-800/50 border-gray-700/60 rounded-lg pt-4",
                "focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 focus:bg-gray-800/70",
                "hover:border-gray-600/80 hover:bg-gray-800/60",
                "text-white placeholder:text-gray-500 text-sm",
                "transition-all duration-300 resize-none"
              )}
            />
          </div>
        </div>
        {apiKeyError && (
          <div className="px-3 py-2 bg-red-900/20 border border-red-800/40 rounded-lg flex items-start gap-2 text-red-400 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-red-300">API Key Required</p>
              <p className="text-red-400/90">{apiKeyError}</p>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-700/60 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600/80 hover:text-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={isProcessing || !content.trim()}
            className={cn(
              "bg-gradient-to-r from-violet-600 to-indigo-600 text-white",
              "hover:from-violet-700 hover:to-indigo-700",
              "disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400",
              "transition-all duration-300"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Import'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}