import * as React from "react"
import { cn } from "@/lib/utils"

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
            "flex h-10 w-full rounded-lg border-2 px-3 py-2 text-sm",
            "shadow-sm transition-all duration-200 ease-in-out",
            "focus-visible:outline-none",
            
            // Default light theme styles (will be overridden by className if provided)
            "bg-white/90 border-gray-300 text-gray-900",
            "placeholder:text-gray-500/60",
            "hover:border-gray-400 hover:bg-white",
            "focus:border-primary/60 focus:bg-white focus:ring-4 focus:ring-primary/10",
            
            // Dark theme styles for better compatibility
            "dark:bg-gray-800/50 dark:border-gray-600/30 dark:text-white",
            "dark:placeholder:text-gray-400/60",
            "dark:hover:border-gray-500 dark:hover:bg-gray-800",
            "dark:focus:border-primary/60 dark:focus:bg-gray-800 dark:focus:ring-4 dark:focus:ring-primary/10",
            
            // Dark theme styles for auth forms will be applied through className
            // We'll make sure these take precedence by applying them directly in the forms
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

export { Input }
