import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Base styles
        "flex w-full rounded-xl border-2 bg-gray-700/80 px-4 py-3 text-sm",
        "border-gray-600/50",
        "shadow-sm shadow-gray-900/30",
        "placeholder:text-gray-400",
        // Interactive states
        "hover:border-gray-500/60 hover:bg-gray-700/90",
        "focus:border-purple-400/60 focus:bg-gray-800 focus:ring-4 focus:ring-purple-400/10 focus:ring-offset-0",
        "focus-visible:outline-none",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-700/80",
        // Custom scrollbar
        "custom-scrollbar",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
