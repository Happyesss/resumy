'use client';

import { submitFeedback, uploadFeedbackScreenshot } from '@/app/feedback/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    FeedbackPriority, FeedbackType, FEEDBACK_PRIORITY_OPTIONS, FEEDBACK_TYPE_OPTIONS
} from '@/lib/feedback-types';
import { cn } from '@/lib/utils';
import {
    AlertCircle, Bug, CheckCircle2, ImagePlus, Lightbulb, Loader2, MessageSquare, Send, Sparkles,
    X
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeIcons: Record<FeedbackType, React.ReactNode> = {
  bug: <Bug className="h-4 w-4" />,
  feature: <Sparkles className="h-4 w-4" />,
  improvement: <Lightbulb className="h-4 w-4" />,
  general: <MessageSquare className="h-4 w-4" />,
};

const typeStyles: Record<FeedbackType, { active: string; inactive: string }> = {
  bug: {
    active: 'bg-red-500/15 border-red-500/50 text-red-400 ring-red-500/20',
    inactive: 'hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400',
  },
  feature: {
    active: 'bg-violet-500/15 border-violet-500/50 text-violet-400 ring-violet-500/20',
    inactive: 'hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-400',
  },
  improvement: {
    active: 'bg-amber-500/15 border-amber-500/50 text-amber-400 ring-amber-500/20',
    inactive: 'hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400',
  },
  general: {
    active: 'bg-sky-500/15 border-sky-500/50 text-sky-400 ring-sky-500/20',
    inactive: 'hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400',
  },
};

const priorityStyles: Record<FeedbackPriority, { active: string; inactive: string }> = {
  low: {
    active: 'bg-zinc-500/15 border-zinc-500/50 text-zinc-300',
    inactive: 'hover:bg-zinc-500/10 hover:border-zinc-500/30',
  },
  medium: {
    active: 'bg-sky-500/15 border-sky-500/50 text-sky-400',
    inactive: 'hover:bg-sky-500/10 hover:border-sky-500/30',
  },
  high: {
    active: 'bg-orange-500/15 border-orange-500/50 text-orange-400',
    inactive: 'hover:bg-orange-500/10 hover:border-orange-500/30',
  },
  critical: {
    active: 'bg-red-500/15 border-red-500/50 text-red-400',
    inactive: 'hover:bg-red-500/10 hover:border-red-500/30',
  },
};

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [type, setType] = useState<FeedbackType>('general');
  const [priority, setPriority] = useState<FeedbackPriority>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setType('general');
    setPriority('medium');
    setTitle('');
    setDescription('');
    setScreenshot(null);
    setScreenshotPreview(null);
    setStep('form');
    setErrorMessage('');
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(resetForm, 300);
  }, [onOpenChange, resetForm]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Only PNG, JPG, GIF, and WebP are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File too large. Maximum size is 5MB.');
      return;
    }

    setScreenshot(file);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveScreenshot = useCallback(() => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let screenshotUrl: string | null = null;

      if (screenshot) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', screenshot);
        
        const uploadResult = await uploadFeedbackScreenshot(formData);
        setIsUploading(false);
        
        if (!uploadResult.success) {
          setErrorMessage(uploadResult.error || 'Failed to upload screenshot');
          setIsSubmitting(false);
          return;
        }
        
        screenshotUrl = uploadResult.url || null;
      }

      const result = await submitFeedback(
        {
          type,
          priority,
          title: title.trim(),
          description: description.trim(),
        },
        screenshotUrl
      );

      if (result.success) {
        setStep('success');
      } else {
        setErrorMessage(result.message);
        setStep('error');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "bg-zinc-950 border-zinc-800 text-white p-0 gap-0 overflow-hidden",
        "w-[calc(100vw-2rem)] max-w-[92vw] sm:max-w-[500px]",
        "max-h-[85vh] flex flex-col"
      )}>
        {step === 'form' && (
          <>
            {/* Header */}
            <DialogHeader className="px-4 pt-4 pb-3 border-b border-zinc-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-zinc-100">
                    Send Feedback
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                    Help us improve your experience
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Feedback Type */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Type
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FEEDBACK_TYPE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setType(option.value)}
                        className={cn(
                          'flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all duration-200',
                          type === option.value
                            ? `${typeStyles[option.value].active} ring-2 ring-offset-1 ring-offset-zinc-950`
                            : `border-zinc-800 bg-zinc-900/50 text-zinc-500 ${typeStyles[option.value].inactive}`
                        )}
                      >
                        {typeIcons[option.value]}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2.5">
                  <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Priority
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {FEEDBACK_PRIORITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPriority(option.value)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200',
                          priority === option.value
                            ? priorityStyles[option.value].active
                            : `border-zinc-800 bg-zinc-900/50 text-zinc-500 ${priorityStyles[option.value].inactive}`
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Title <span className="text-red-400">*</span>
                    </Label>
                    <span className="text-[10px] text-zinc-600">{title.length}/100</span>
                  </div>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief summary..."
                    className="flex h-10 w-full rounded-lg border px-3 py-2 text-sm 
                      bg-zinc-900/50 border-zinc-800 text-zinc-100 
                      placeholder:text-zinc-600
                      focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 
                      hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70
                      focus:outline-none transition-colors"
                    maxLength={100}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Description <span className="text-red-400">*</span>
                    </Label>
                    <span className="text-[10px] text-zinc-600">{description.length}/2000</span>
                  </div>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      type === 'bug'
                        ? "Describe the issue. What happened? Steps to reproduce..."
                        : type === 'feature'
                        ? "Describe the feature and how it would help..."
                        : "Share your thoughts or suggestions..."
                    }
                    className="min-h-[90px] bg-zinc-900/50 border-zinc-800 text-zinc-100 
                      placeholder:text-zinc-600 resize-none
                      focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 
                      hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70"
                    maxLength={2000}
                  />
                </div>

                {/* Screenshot */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Screenshot <span className="text-zinc-600 normal-case">(optional)</span>
                  </Label>
                  
                  {!screenshotPreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className="w-full border border-dashed border-zinc-800 rounded-lg p-3 
                        text-center cursor-pointer transition-all duration-200 
                        hover:border-purple-500/40 hover:bg-purple-500/5 group"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-purple-500/10 transition-colors">
                          <ImagePlus className="h-4 w-4 text-zinc-500 group-hover:text-purple-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-zinc-400 group-hover:text-zinc-300">
                            Click or drag to upload
                          </p>
                          <p className="text-[10px] text-zinc-600">PNG, JPG, GIF, WebP (max 5MB)</p>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="w-full h-32 object-contain bg-zinc-900"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveScreenshot}
                        className="absolute top-2 right-2 p-1.5 rounded-full 
                          bg-zinc-900/90 hover:bg-red-500/80 text-zinc-400 hover:text-white 
                          transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="px-3 py-2 bg-zinc-900/80 flex items-center gap-2 border-t border-zinc-800">
                        <span className="text-xs text-zinc-500 truncate flex-1">{screenshot?.name}</span>
                        <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500">
                          {((screenshot?.size || 0) / 1024).toFixed(0)} KB
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-red-400">{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/30 shrink-0">
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 h-9 border-zinc-800 bg-transparent text-zinc-400 
                      hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !description.trim()}
                    className="flex-1 h-9 bg-purple-600 hover:bg-purple-500 text-white border-0
                      disabled:bg-zinc-800 disabled:text-zinc-500"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {isUploading ? 'Uploading...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Feedback
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="p-6 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 
              flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-purple-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-100">Thank You!</h3>
              <p className="text-sm text-zinc-500">
                Your feedback has been submitted successfully.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="h-9 px-5 bg-purple-600 hover:bg-purple-500 text-white"
            >
              Close
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="p-6 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 
              flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-100">Something went wrong</h3>
              <p className="text-sm text-zinc-500">{errorMessage || 'Please try again.'}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setStep('form')}
                variant="outline"
                className="h-9 px-4 border-zinc-800 bg-transparent text-zinc-400 
                  hover:bg-zinc-800 hover:text-zinc-200"
              >
                Try Again
              </Button>
              <Button
                onClick={handleClose}
                className="h-9 px-4 bg-purple-600 hover:bg-purple-500 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
