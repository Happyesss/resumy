'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

// Color themes for different sections
type ColorTheme = 'violet' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'default';

const colorThemes: Record<ColorTheme, {
  label: string;
  textarea: string;
  button: string;
  icon: string;
  glow: string;
}> = {
  violet: {
    label: "text-violet-400",
    textarea: "focus:border-violet-500/50 focus:ring-violet-500/20 hover:border-violet-500/30",
    button: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-violet-500/25 hover:shadow-violet-500/40",
    icon: "text-violet-300",
    glow: "shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]"
  },
  cyan: {
    label: "text-cyan-400",
    textarea: "focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-cyan-500/30",
    button: "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-cyan-500/25 hover:shadow-cyan-500/40",
    icon: "text-cyan-300",
    glow: "shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]"
  },
  amber: {
    label: "text-amber-400",
    textarea: "focus:border-amber-500/50 focus:ring-amber-500/20 hover:border-amber-500/30",
    button: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25 hover:shadow-amber-500/40",
    icon: "text-amber-300",
    glow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]"
  },
  emerald: {
    label: "text-emerald-400",
    textarea: "focus:border-emerald-500/50 focus:ring-emerald-500/20 hover:border-emerald-500/30",
    button: "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-emerald-500/25 hover:shadow-emerald-500/40",
    icon: "text-emerald-300",
    glow: "shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
  },
  rose: {
    label: "text-rose-400",
    textarea: "focus:border-rose-500/50 focus:ring-rose-500/20 hover:border-rose-500/30",
    button: "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-500/25 hover:shadow-rose-500/40",
    icon: "text-rose-300",
    glow: "shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]"
  },
  default: {
    label: "text-purple-400",
    textarea: "focus:border-purple-500/50 focus:ring-purple-500/20 hover:border-purple-500/30",
    button: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25 hover:shadow-purple-500/40",
    icon: "text-purple-300",
    glow: "shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]"
  }
};

interface AIImprovementPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  hideSubmitButton?: boolean;
  colorTheme?: ColorTheme;
}

export function AIImprovementPrompt({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "e.g., Make it more impactful and quantifiable",
  hideSubmitButton = false,
  colorTheme = 'default'
}: AIImprovementPromptProps) {
  const theme = colorThemes[colorTheme];

  return (
    <div className="space-y-3">
      {/* Header with icon */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center",
          "w-5 h-5 rounded-md",
          "bg-zinc-800/80"
        )}>
          <Wand2 className={cn("h-3 w-3", theme.icon)} />
        </div>
        <span className={cn("text-[11px] font-semibold tracking-wide uppercase", theme.label)}>
          Custom Instructions
        </span>
        <span className="text-[10px] text-zinc-500 font-normal normal-case">
          (Optional)
        </span>
      </div>

      {/* Textarea with enhanced styling */}
      <div className="relative group">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-h-[72px] text-xs leading-relaxed",
            "bg-zinc-900/80 backdrop-blur-sm",
            "border border-zinc-700/60 rounded-xl",
            "focus:ring-2 focus:outline-none",
            theme.textarea,
            "resize-none",
            "text-zinc-100 placeholder:text-zinc-500",
            "transition-all duration-200",
            "px-3.5 py-2.5"
          )}
        />
        {/* Subtle corner decoration */}
        <div className={cn(
          "absolute bottom-2 right-2",
          "opacity-0 group-focus-within:opacity-100",
          "transition-opacity duration-200"
        )}>
          <Sparkles className={cn("h-3 w-3", theme.icon, "opacity-40")} />
        </div>
      </div>

      {/* Submit button with gradient and glow effect */}
      {!hideSubmitButton && onSubmit && (
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isLoading}
          className={cn(
            "w-full h-9",
            "text-white font-medium text-xs",
            "border-0",
            "shadow-lg",
            theme.button,
            "transition-all duration-300",
            "hover:scale-[1.02]",
            "hover:-translate-y-0.5",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0",
            "rounded-lg",
            "flex items-center justify-center gap-2",
            !isLoading && theme.glow
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Enhancing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Enhance with AI</span>
            </>
          )}
        </Button>
      )}

      {/* Helper text */}
      <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
        Provide specific directions to tailor the AI enhancement
      </p>
    </div>
  );
} 