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
        "flex w-full rounded-lg border px-3 py-2 text-sm",
        "transition-all duration-200",
        "focus-visible:outline-none",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
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
