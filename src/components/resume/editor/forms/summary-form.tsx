'use client';

import { Button } from '@/components/ui/button';
import Tiptap from '@/components/ui/tiptap';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { hasReachedAILimit, incrementAIUsage } from '@/lib/ai-request-limit';
import { getStoredApiKeys, getStoredDefaultModel } from '@/lib/ai-key-storage';
import { cn } from '@/lib/utils';
import { improveSummary } from '@/utils/actions/resumes/ai';
import { Check, FileText, Lightbulb, Loader2, Sparkles, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { AIImprovementPrompt } from '../../shared/ai-improvement-prompt';

interface SummaryFormProps {
  summary: string;
  onChange: (summary: string) => void;
  userEmail?: string | null;
}

export function SummaryForm({ summary, onChange }: SummaryFormProps) {
  const { toast } = useToast();
  const [improvementPrompt, setImprovementPrompt] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [improvedSummary, setImprovedSummary] = useState<{ original: string; improved: string } | null>(null);

  // Add custom styles for the Tiptap editor
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const style = document.createElement('style');
    style.setAttribute('data-summary-form-styles', 'true');
    style.textContent = `
      .ProseMirror {
        color: white !important;
        font-weight: 400 !important;
      }
      .ProseMirror p {
        color: white !important;
        margin: 0.5em 0 !important;
      }
      .ProseMirror strong {
        color: white !important;
        font-weight: 700 !important;
      }
      .ProseMirror:focus {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      try {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      } catch (error) {
        console.warn('Failed to remove style element:', error);
      }
    };
  }, []);

  const handleChange = useCallback((content: string) => {
    onChange(content);
    if (improvedSummary) {
      setImprovedSummary(null);
    }
  }, [onChange, improvedSummary]);

  const handleImprove = async () => {
    if (!summary.trim()) {
      toast({
        title: 'Summary is empty',
        description: 'Add a draft summary first before using AI improvement.',
        variant: 'destructive'
      });
      return;
    }
    if (hasReachedAILimit()) {
      toast({
        title: 'AI Request Limit Reached',
        description: 'You have reached your daily AI request limit.',
        variant: 'destructive'
      });
      return;
    }
    try {
      setIsImproving(true);
      const improved = await improveSummary(summary, improvementPrompt, {
        model: getStoredDefaultModel(),
        apiKeys: getStoredApiKeys(),
      });
      incrementAIUsage();
      
      setImprovedSummary({
        original: summary,
        improved: improved
      });
      
      onChange(improved);
      toast({ 
        title: 'Summary improved', 
        description: 'AI enhancement applied. Review and accept/reject the changes.' 
      });
    } catch (e) {
      console.error(e);
      toast({ title: 'AI Error', description: 'Could not improve summary. Please try again.', variant: 'destructive' });
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Summary Card */}
      <div className={cn(
        "rounded-2xl",
        "bg-zinc-900/50",
        "border border-zinc-800/80",
        "p-5",
        "space-y-4"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-lg",
              "bg-violet-500/10",
              "flex items-center justify-center"
            )}>
              <FileText className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Professional Summary</h3>
              <p className="text-xs text-zinc-500">A brief overview of your experience</p>
            </div>
          </div>

          {/* AI Improve Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImprove}
                  disabled={isImproving}
                  className={cn(
                    "h-9 px-3 gap-2",
                    "bg-violet-500/10 hover:bg-violet-500/20",
                    "text-violet-400 hover:text-violet-300",
                    "border border-violet-500/20",
                    "rounded-lg",
                    "transition-all duration-200",
                    "hover:scale-105"
                  )}
                >
                  {isImproving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">Enhance</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="end"
                sideOffset={8}
                className={cn(
                  "w-80 p-4",
                  "bg-zinc-900 border-zinc-800",
                  "shadow-xl"
                )}
              >
                <AIImprovementPrompt
                  value={improvementPrompt}
                  onChange={setImprovementPrompt}
                  onSubmit={handleImprove}
                  isLoading={isImproving}
                  placeholder="e.g., Emphasize cloud, leadership, and measurable impact"
                  colorTheme="violet"
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Editor */}
        <div className="relative">
          {improvedSummary && (
            <div className={cn(
              "absolute -top-2 right-4 z-10",
              "px-2.5 py-1",
              "bg-violet-500/20 border border-violet-500/30",
              "rounded-full",
              "flex items-center gap-1.5"
            )}>
              <Sparkles className="h-3 w-3 text-violet-400" />
              <span className="text-[10px] font-medium text-violet-300">AI Suggestion</span>
            </div>
          )}
          <Tiptap
            content={summary}
            onChange={handleChange}
            editorProps={{
              attributes: {
                placeholder: "Write a concise 2-4 sentence professional summary highlighting years of experience, core expertise, key achievements, and technologies or domains.",
                class: cn(
                  "min-h-[140px] text-sm",
                  "bg-zinc-900/50 border border-zinc-800",
                  "rounded-xl px-4 py-3",
                  "focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20",
                  "hover:border-zinc-700",
                  "transition-all duration-200",
                  "placeholder:text-zinc-600 text-white",
                  "[&_*]:text-white [&_p]:text-white [&_strong]:text-white [&_strong]:font-bold",
                  improvedSummary && [
                    "border-violet-500/30",
                    "bg-gradient-to-br from-violet-500/5 to-purple-500/5",
                  ]
                )
              }
            }}
          />
        </div>

        {/* Accept/Reject Buttons */}
        {improvedSummary && (
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setImprovedSummary(null);
                toast({ 
                  title: 'Improvement accepted', 
                  description: 'Summary enhancement has been applied.' 
                });
              }}
              className={cn(
                "h-9 px-4 gap-2",
                "bg-emerald-500/10 hover:bg-emerald-500/20",
                "text-emerald-400 hover:text-emerald-300",
                "border border-emerald-500/20",
                "rounded-lg",
                "transition-all duration-200"
              )}
            >
              <Check className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Accept</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(improvedSummary.original);
                setImprovedSummary(null);
                toast({ 
                  title: 'Improvement rejected', 
                  description: 'Original summary has been restored.' 
                });
              }}
              className={cn(
                "h-9 px-4 gap-2",
                "bg-rose-500/10 hover:bg-rose-500/20",
                "text-rose-400 hover:text-rose-300",
                "border border-rose-500/20",
                "rounded-lg",
                "transition-all duration-200"
              )}
            >
              <X className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Reject</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tips Card */}
      <div className={cn(
        "rounded-xl",
        "bg-gradient-to-br from-violet-500/5 to-purple-500/5",
        "border border-violet-500/20",
        "p-4",
        "space-y-3"
      )}>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400">Writing Tips</span>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />
            Start with your title + years of experience. Add 1–2 standout achievements or impact metrics.
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />
            Only include technologies, domains, or achievements you can defend in an interview.
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />
            Keep it targeted to the role you want; avoid generic claims like &apos;hard-working team player&apos;.
          </p>
        </div>
      </div>
    </div>
  );
}
