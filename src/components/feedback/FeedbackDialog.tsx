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
    AlertCircle, Bug, CheckCircle2, ImageIcon, Lightbulb, Loader2, MessageSquare, Sparkles, Upload,
    X
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeIcons: Record<FeedbackType, React.ReactNode> = {
  bug: <Bug className="h-5 w-5" />,
  feature: <Sparkles className="h-5 w-5" />,
  improvement: <Lightbulb className="h-5 w-5" />,
  general: <MessageSquare className="h-5 w-5" />,
};

const typeColors: Record<FeedbackType, string> = {
  bug: 'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20',
  feature: 'border-purple-500/50 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
  improvement: 'border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
  general: 'border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
};

const priorityColors: Record<FeedbackPriority, string> = {
  low: 'border-gray-500/50 bg-gray-500/10 text-gray-400 hover:bg-gray-500/20',
  medium: 'border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
  high: 'border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20',
  critical: 'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20',
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
    // Reset form after animation
    setTimeout(resetForm, 300);
  }, [onOpenChange, resetForm]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Only PNG, JPG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File too large. Maximum size is 5MB.');
      return;
    }

    setScreenshot(file);
    setErrorMessage('');

    // Create preview
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

      // Upload screenshot if exists
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

      // Submit feedback
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
        "bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto",
        "w-[calc(100vw-2rem)] mx-auto",
        step === 'form' ? 'sm:max-w-[600px]' : 'sm:max-w-[360px]'
      )}>
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                Send Feedback
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Help us improve by sharing your feedback, reporting bugs, or suggesting new features.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Feedback Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">
                  What type of feedback is this?
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {FEEDBACK_TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200',
                        type === option.value
                          ? `${typeColors[option.value]} border-opacity-100 ring-2 ring-offset-2 ring-offset-gray-900`
                          : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
                      )}
                      style={{
                        ['--tw-ring-color' as string]: type === option.value 
                          ? option.value === 'bug' ? 'rgb(239 68 68 / 0.3)'
                          : option.value === 'feature' ? 'rgb(168 85 247 / 0.3)'
                          : option.value === 'improvement' ? 'rgb(245 158 11 / 0.3)'
                          : 'rgb(59 130 246 / 0.3)'
                          : 'transparent'
                      }}
                    >
                      {typeIcons[option.value]}
                      <div className="text-left">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs opacity-70 line-clamp-1">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Priority Level</Label>
                <div className="grid grid-cols-2 sm:flex gap-2">
                  {FEEDBACK_PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value)}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                        priority === option.value
                          ? `${priorityColors[option.value]} ring-2 ring-offset-1 ring-offset-gray-900`
                          : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                      )}
                      style={{
                        ['--tw-ring-color' as string]: priority === option.value 
                          ? option.value === 'low' ? 'rgb(107 114 128 / 0.3)'
                          : option.value === 'medium' ? 'rgb(59 130 246 / 0.3)'
                          : option.value === 'high' ? 'rgb(249 115 22 / 0.3)'
                          : 'rgb(239 68 68 / 0.3)'
                          : 'transparent'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                  Title <span className="text-red-400">*</span>
                </Label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your feedback..."
                  className="flex h-10 w-full rounded-lg border-2 px-3 py-2 text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors"
                  maxLength={100}
                />
                <div className="text-xs text-gray-500 text-right">{title.length}/100</div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                  Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    type === 'bug'
                      ? "Please describe the issue in detail. What were you trying to do? What happened instead? Steps to reproduce..."
                      : type === 'feature'
                      ? "Describe the feature you'd like to see. How would it help you? Any specific requirements..."
                      : "Share your thoughts, suggestions, or ideas..."
                  }
                  className="min-h-[120px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                  maxLength={2000}
                />
                <div className="text-xs text-gray-500 text-right">{description.length}/2000</div>
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">
                  Screenshot <span className="text-gray-500">(optional)</span>
                </Label>
                
                {!screenshotPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:border-purple-500/50 hover:bg-gray-800/30 group"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-gray-800 group-hover:bg-purple-500/10 transition-colors">
                        <ImageIcon className="h-6 w-6 text-gray-500 group-hover:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">
                          <span className="text-purple-400 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF or WebP (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-700 bg-gray-800/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="w-full h-36 sm:h-48 object-contain bg-gray-900"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-900/80 hover:bg-red-500/80 text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="p-2 bg-gray-800/80 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400 truncate">{screenshot?.name}</span>
                      <Badge variant="outline" className="ml-auto text-xs border-gray-600">
                        {((screenshot?.size || 0) / 1024).toFixed(1)} KB
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
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white border-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isUploading ? 'Uploading...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="py-2 text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Thank You!</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Your feedback has been submitted.
              </p>
            </div>
            <Button
              onClick={handleClose}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 h-8 px-4 text-xs"
            >
              Close
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="py-2 text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Submission Failed</h3>
              <p className="text-xs text-gray-400 mt-0.5">{errorMessage || 'Something went wrong.'}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => setStep('form')}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 h-8 px-3 text-xs"
              >
                Try Again
              </Button>
              <Button
                onClick={handleClose}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-purple-500 h-8 px-3 text-xs"
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
