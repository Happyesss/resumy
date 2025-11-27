'use client';

import { Button } from "@/components/ui/button";
import Tiptap from "@/components/ui/tiptap";
import { cn } from "@/lib/utils";
import { Check, Sparkles, X } from "lucide-react";

interface AISuggestion {
  id: string;
  point: string;
}

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  onApprove: (suggestion: AISuggestion) => void;
  onDelete: (suggestionId: string) => void;
}

export function AISuggestions({ suggestions, onApprove, onDelete }: AISuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn(
      "relative group/suggestions",
      "p-6 mt-4",
      "rounded-xl",
      "border border-[#222]",
      "bg-black",
      "shadow-lg shadow-black/30",
      "transition-all duration-500",
      "hover:shadow-xl hover:shadow-black/50",
      "overflow-hidden"
    )}>
      {/* Remove animated backgrounds and orbs for pure black theme */}
      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-[#181818] text-purple-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-purple-400">AI Suggestions</span>
        </div>
        
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id} 
              className={cn(
                "group/item relative",
                "animate-in fade-in-50 duration-500",
                "transition-all"
              )}
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <Tiptap
                    content={suggestion.point}
                    onChange={() => {}}
                    readOnly={true}
                    className={cn(
                      "min-h-[80px] text-sm",
                      "bg-[#181818]",
                      "border border-[#333]",
                      "text-gray-200",
                      "focus:border-[#444] focus:ring-2 focus:ring-[#222]",
                      "placeholder:text-gray-500",
                      "transition-all duration-300",
                      "hover:bg-[#232323] hover:border-[#444]"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onApprove(suggestion)}
                    className={cn(
                      "h-9 w-9",
                      "bg-[#232323] hover:bg-[#333]",
                      "text-gray-300 hover:text-white",
                      "border border-[#333]",
                      "shadow-sm",
                      "transition-all duration-300",
                      "hover:scale-105 hover:shadow-md",
                      "hover:-translate-y-0.5"
                    )}
                  >
                    <Check className="h-4 w-4 text-purple-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(suggestion.id)}
                    className={cn(
                      "h-9 w-9",
                      "bg-[#232323] hover:bg-[#333]",
                      "text-gray-400 hover:text-red-500",
                      "border border-[#333]",
                      "shadow-sm",
                      "transition-all duration-300",
                      "hover:scale-105 hover:shadow-md",
                      "hover:-translate-y-0.5"
                    )}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}