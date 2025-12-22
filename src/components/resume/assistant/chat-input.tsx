import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CornerRightUp, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
  onStop: () => void;
}

export default function ChatInput({ 
    isLoading, 
    onSubmit,
    onStop,
  }: ChatInputProps) {
    const [inputValue, setInputValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustTextareaHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height (capped at 6 lines ~ 144px)
      const newHeight = Math.min(textarea.scrollHeight, 144);
      textarea.style.height = `${newHeight}px`;
    }, []);

    // Adjust height whenever input value changes
    useEffect(() => {
      adjustTextareaHeight();
    }, [inputValue, adjustTextareaHeight]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        const cleanedMessage = inputValue.replace(/\n+$/, '').trim();
        onSubmit(cleanedMessage);
        setInputValue("");
      }
    }, [inputValue, onSubmit]);

    return (
      <form onSubmit={handleSubmit} className={cn(
        "relative z-10",
        "p-3",
        "bg-zinc-900/80",
        "flex gap-3 items-end"
      )}>
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              } else {
                // Ensure height is adjusted after Shift+Enter
                requestAnimationFrame(adjustTextareaHeight);
              }
            }
          }}
          placeholder="Ask me anything about your resume..."
          rows={1}
          className={cn(
            "flex-1",
            "bg-zinc-800/80 border-zinc-700/60",
            "text-zinc-100 placeholder:text-zinc-500",
            "focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20",
            "hover:border-zinc-600/60",
            "text-sm",
            "min-h-[44px]",
            "max-h-[144px]", // Approximately 6 lines
            "resize-none",
            "overflow-y-auto",
            "px-4 py-3",
            "rounded-xl",
            "transition-all duration-200"
          )}
        />
        <Button 
          type={isLoading ? "button" : "submit"}
          onClick={isLoading ? onStop : undefined}
          size="sm"
          className={cn(
            isLoading ? [
              "bg-rose-500/90",
              "hover:bg-rose-600",
            ] : [
              "bg-violet-500",
              "hover:bg-violet-600",
            ],
            "text-white",
            "border-none",
            "shadow-lg shadow-violet-500/20",
            "transition-all duration-200",
            "hover:scale-105",
            "px-3 h-11 min-w-[44px]",
            "rounded-xl",
            "self-end"
          )}
        >
          {isLoading ? (
            <X className="h-4 w-4" />
          ) : (
            <CornerRightUp className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
}