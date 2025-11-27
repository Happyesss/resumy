'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Tiptap from '@/components/ui/tiptap';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { hasReachedAILimit, incrementAIUsage } from '@/lib/ai-request-limit';
import { cn } from '@/lib/utils';
import { improveSummary } from '@/utils/actions/resumes/ai';
import { Check, Loader2, Sparkles, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { AIImprovementPrompt } from '../../shared/ai-improvement-prompt';

interface SummaryFormProps {
  summary: string;
  onChange: (summary: string) => void;
  userEmail?: string | null;
}

export function SummaryForm({ summary, onChange, userEmail }: SummaryFormProps) {
  const { toast } = useToast();
  const [improvementPrompt, setImprovementPrompt] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [improvedSummary, setImprovedSummary] = useState<{ original: string; improved: string } | null>(null);

  // Add custom styles for the Tiptap editor
  React.useEffect(() => {
    // Only run on client-side
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
    // Clear improved state if content changes manually
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
      const improved = await improveSummary(summary, improvementPrompt);
      incrementAIUsage();
      
      // Store both original and improved versions
      setImprovedSummary({
        original: summary,
        improved: improved
      });
      
      // Apply the improved version
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
      <Card className={cn(
        'relative group transition-all duration-300',
        'bg-gray-900 border-2 border-gray-800',
        'hover:border-fuchsia-400/40 hover:shadow-lg hover:shadow-fuchsia-400/10',
        'shadow-sm'
      )}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between mb-1 gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-fuchsia-400 rounded-full" />
              <h3 className="text-sm font-semibold text-fuchsia-400">Professional Summary</h3>
              <span className="text-xs text-gray-500">(Optional)</span>
            </div>
            {/* AI Improve Button */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleImprove}
                    disabled={isImproving}
                    className={cn(
                      'h-8 w-8 rounded-lg p-0',
                      'bg-gray-900/90 hover:bg-gray-900',
                      'text-purple-400 hover:text-purple-300',
                      'border border-gray-800/80',
                      'shadow-sm transition-all duration-300',
                      'hover:scale-105 hover:shadow-md hover:-translate-y-0.5'
                    )}
                  >
                    {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  className={cn(
                    'w-80 p-3.5',
                    'bg-gray-900/95',
                    'border-2 border-purple-700/30',
                    'shadow-lg shadow-black/60',
                    'rounded-lg'
                  )}
                >
                  <AIImprovementPrompt
                    value={improvementPrompt}
                    onChange={setImprovementPrompt}
                    onSubmit={handleImprove}
                    isLoading={isImproving}
                    placeholder="e.g., Emphasize cloud, leadership, and measurable impact"
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Tiptap
              content={summary}
              onChange={handleChange}
              editorProps={{
                attributes: {
                  placeholder: "Write a concise 2-4 sentence professional summary highlighting years of experience, core expertise, key achievements, and technologies or domains. Avoid first-person pronouns.",
                  class: cn(
                    "min-h-[140px] text-xs md:text-sm bg-gray-800/90 border-gray-700/70 rounded-lg px-3 py-2",
                    "focus:border-fuchsia-400/40 focus:ring-2 focus:ring-fuchsia-400/20",
                    "hover:border-fuchsia-400/30 hover:bg-gray-800/95 transition-colors",
                    "placeholder:text-gray-400 text-white [&_*]:text-white [&_p]:text-white [&_strong]:text-white [&_strong]:font-bold",
                    improvedSummary ? [
                      "border-purple-400",
                      "bg-gradient-to-r from-purple-900/30 to-indigo-900/30",
                      "shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]",
                      "hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40"
                    ] : ""
                  )
                }
              }}
            />
            {improvedSummary && (
              <div className="absolute -top-2.5 right-12 px-2 py-0.5 bg-purple-100 rounded-full">
                <span className="text-[10px] font-medium text-purple-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Suggestion
                </span>
              </div>
            )}
          </div>
          {improvedSummary && (
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Accept the improvement
                  setImprovedSummary(null);
                  toast({ 
                    title: 'Improvement accepted', 
                    description: 'Summary enhancement has been applied.' 
                  });
                }}
                className={cn(
                  "h-8 px-4 text-xs",
                  "bg-gradient-to-br from-emerald-900/80 to-emerald-800/80",
                  "text-emerald-200",
                  "border border-emerald-700/60",
                  "shadow-sm",
                  "transition-all duration-300",
                  "hover:scale-105 hover:shadow-md",
                  "hover:-translate-y-0.5"
                )}
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Accept
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Reject the improvement and restore original
                  onChange(improvedSummary.original);
                  setImprovedSummary(null);
                  toast({ 
                    title: 'Improvement rejected', 
                    description: 'Original summary has been restored.' 
                  });
                }}
                className={cn(
                  "h-8 px-4 text-xs",
                  "bg-gradient-to-br from-rose-900/80 to-rose-800/80",
                  "text-rose-200",
                  "border border-rose-700/60",
                  "shadow-sm",
                  "transition-all duration-300",
                  "hover:scale-105 hover:shadow-md",
                  "hover:-translate-y-0.5"
                )}
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Reject
              </Button>
            </div>
          )}
          <div className="text-[11px] leading-relaxed text-gray-400 space-y-1">
            <p><span className="text-fuchsia-400 font-medium">Tip:</span> Start with your title + years of experience. Add 1–2 standout achievements or impact metrics.</p>
            <p>Only include technologies, domains, or achievements you actually have experience with—don’t add anything you can’t defend in an interview.</p>
            <p>Keep it targeted to the role you want; avoid generic claims like 'hard-working team player'.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
