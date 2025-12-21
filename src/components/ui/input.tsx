import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validation?: {
    isValid?: boolean;
    message?: string;
  };
  showValidation?: boolean;
  isTouched?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, validation, showValidation = true, isTouched = false, ...props }, ref) => {
    const isValid = validation?.isValid;
    const showStatus = showValidation && typeof isValid !== 'undefined' && isTouched;
    
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-lg border px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "focus-visible:outline-none",
            
            // Validation states - only show when touched
            showStatus && isValid && "border-emerald-400/50 focus:border-emerald-400/60 focus:ring-emerald-400/20",
            showStatus && !isValid && "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/20",
            
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            
            // File input styles
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            
            className
          )}
          ref={ref}
          aria-invalid={showStatus && !isValid}
          {...props}
        />
        
        {/* Validation Message */}
        {showStatus && validation?.message && !isValid && (
          <p
            className={cn(
              "text-xs text-red-400 mt-1 ml-1",
              "transition-all duration-200",
              isTouched ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            )}
          >
            {validation.message}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input };
