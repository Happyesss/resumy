'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { improveSummary } from '@/utils/actions/resumes/ai';
import { AIImprovementPrompt } from '../../shared/ai-improvement-prompt';
import { DAILY_REQUEST_LIMIT, hasReachedDailyLimit, incrementDailyUsage } from '@/lib/daily-limit';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SummaryFormProps {
  summary: string;
  onChange: (summary: string) => void;
}

export function SummaryForm({ summary, onChange }: SummaryFormProps) {
  const { toast } = useToast();
  const [improvementPrompt, setImprovementPrompt] = useState('');
  const [isImproving, setIsImproving] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleImprove = async () => {
    if (!summary.trim()) {
      toast({
        title: 'Summary is empty',
        description: 'Add a draft summary first before using AI improvement.',
        variant: 'destructive'
      });
      return;
    }
    if (hasReachedDailyLimit()) {
      toast({
        title: 'Daily Request Limit Reached',
        description: `You have reached the daily limit of ${DAILY_REQUEST_LIMIT} AI requests. Try again tomorrow.`,
        variant: 'destructive'
      });
      return;
    }
    try {
      setIsImproving(true);
      const MODEL_STORAGE_KEY = 'resumelm-default-model';
      const LOCAL_STORAGE_KEY = 'resumelm-api-keys';
      const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY) || '';
      let apiKeys: any[] = [];
      try {
        apiKeys = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      } catch {}
      const improved = await improveSummary(summary, improvementPrompt, { model: selectedModel, apiKeys });
      incrementDailyUsage();
      onChange(improved);
      toast({ title: 'Summary improved', description: 'AI enhancement applied. Review for accuracy.' });
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
          <Textarea
            value={summary}
            onChange={handleChange}
            placeholder="Write a concise 2-4 sentence professional summary highlighting years of experience, core expertise, key achievements, and technologies or domains. Avoid first-person pronouns."
            rows={6}
            className="resize-y min-h-[140px] text-white placeholder:text-gray-400 focus:text-white"
          />
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
