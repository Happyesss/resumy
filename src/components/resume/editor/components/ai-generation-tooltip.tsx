'use client';

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIGenerationTooltipProps {
  index: number;
  loadingAI: boolean;
  generateAIPoints: (index: number) => void;
  aiConfig: { numPoints: number; customPrompt: string };
  onNumPointsChange: (value: number) => void;
  onCustomPromptChange: (value: string) => void;
  colorClass: {
    button: string;
    border: string;
    hoverBorder: string;
    hoverBg: string;
    tooltipBg: string;
    tooltipBorder: string;
    tooltipShadow: string;
    text: string;
    hoverText: string;
  };
}

export function AIGenerationSettingsTooltip({
  index,
  loadingAI,
  generateAIPoints,
  aiConfig,
  onNumPointsChange,
  onCustomPromptChange,
  colorClass
}: AIGenerationTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateAIPoints(index)}
            disabled={loadingAI}
            className={cn(
              "flex-1 transition-colors text-[10px] sm:text-xs",
              colorClass.button,
              colorClass.border,
              colorClass.hoverBorder,
              colorClass.hoverBg,
              colorClass.hoverText
            )}
          >
            {loadingAI ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            {loadingAI ? 'Generating...' : 'Write points with AI'}
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          align="start"
          sideOffset={2}
          className={cn(
            "w-72 p-3.5 rounded-lg",
            colorClass.tooltipBg,
            colorClass.tooltipBorder,
            colorClass.tooltipShadow
          )}
        >
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-cyan-400 block mb-1.5">
                Number of Points
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => onNumPointsChange(num)}
                    className={cn(
                      "w-8 h-8 rounded-md text-xs font-medium transition-all duration-200",
                      aiConfig.numPoints === num
                        ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/50 shadow-sm"
                        : "bg-gray-800/90 text-gray-400 border border-gray-700/60 hover:bg-gray-700/90 hover:text-gray-300 hover:border-gray-600/80"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-cyan-400 block mb-1.5">
                Custom Prompt (Optional)
              </label>
              <textarea
                value={aiConfig.customPrompt}
                onChange={(e) => onCustomPromptChange(e.target.value)}
                placeholder="e.g., Make it more impactful and quantifiable"
                className={cn(
                  "w-full h-16 px-2.5 py-2 text-xs rounded-md resize-none",
                  "bg-gray-800/90 backdrop-blur-sm",
                  "border border-gray-700/80",
                  "focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none",
                  "hover:bg-gray-800/95 hover:border-gray-600/80",
                  "text-gray-100 placeholder:text-gray-400",
                  "transition-all duration-300"
                )}
              />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}