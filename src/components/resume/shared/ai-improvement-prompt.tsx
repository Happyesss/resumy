'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

interface AIImprovementPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  hideSubmitButton?: boolean;
}

export function AIImprovementPrompt({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "e.g., Make it more impactful and quantifiable",
  hideSubmitButton = false
}: AIImprovementPromptProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-[11px] font-medium text-purple-400">Prompt for AI (Optional)</Label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-14 mt-0.5 text-xs",
            "bg-gray-800/90 backdrop-blur-sm",
            "border-gray-700/80",
            "focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20",
            "hover:bg-gray-800/95 hover:border-gray-600/80",
            "resize-none",
            "text-gray-100 placeholder:text-gray-400",
            "transition-all duration-300",
            "shadow-sm"
          )}
        />
      </div>
      {!hideSubmitButton && onSubmit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSubmit}
          disabled={isLoading}
          className={cn(
            "w-full h-8",
            "bg-gray-800/90 hover:bg-gray-700/90",
            "text-purple-400 hover:text-purple-300",
            "border border-gray-700/80 hover:border-purple-400/60",
            "shadow-sm hover:shadow-md",
            "transition-all duration-300",
            "hover:scale-[1.02]",
            "hover:-translate-y-0.5",
            "text-xs",
            "backdrop-blur-sm"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Improve with AI
            </>
          )}
        </Button>
      )}
    </div>
  );
} 