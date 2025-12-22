

import { cn } from "@/lib/utils";

interface MiniResumePreviewProps {
  name: string;
  type: 'base' | 'tailored';
  updatedAt?: string;
  createdAt?: string;
  target_role?: string;
  className?: string;
}

export function MiniResumePreview({
  name,
  type,
  createdAt,
  className
}: MiniResumePreviewProps) {

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return (
    <div className={cn(
      "relative w-full aspect-[8.5/11]",
      "rounded-xl overflow-hidden",
      "border transition-all duration-200",
      type === 'base' 
        ? "bg-white border-neutral-200" 
        : "bg-gradient-to-br from-white to-indigo-50/30 border-indigo-200/50",
      "shadow-sm hover:shadow-md",
      "group cursor-pointer",
      className
    )}>
      {/* Content Container */}
      <div className="relative h-full p-4 flex flex-col">
        {/* Header Section */}
        <div className="text-center mb-3 pb-2.5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-800 text-xs leading-tight line-clamp-2 min-h-[2.5em]">
            {name}
          </h3>
          <div className={cn(
            "inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium",
            type === 'base' 
              ? "bg-neutral-100 text-neutral-600" 
              : "bg-indigo-50 text-indigo-600"
          )}>
            {type === 'base' ? 'Base' : 'Tailored'}
          </div>
        </div>

        {/* Mock Resume Content - Skeleton Lines */}
        <div className="flex-1 space-y-3">
          {/* Contact Info Section */}
          <div className="flex justify-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={`contact-${i}`}
                className="h-1 rounded-full bg-neutral-200 w-10"
              />
            ))}
          </div>

          {/* Summary Section */}
          <div className="space-y-1.5">
            <div className="h-1.5 w-14 rounded-full bg-neutral-300" />
            <div className="space-y-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`summary-${i}`}
                  className={cn(
                    "h-1 rounded-full bg-neutral-150",
                    i === 0 && "w-[95%] bg-neutral-200",
                    i === 1 && "w-[85%] bg-neutral-200",
                    i === 2 && "w-[75%] bg-neutral-200"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-1.5">
            <div className="h-1.5 w-16 rounded-full bg-neutral-300" />
            {[...Array(2)].map((_, groupIndex) => (
              <div key={`exp-group-${groupIndex}`} className="py-0.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-20 rounded-full bg-neutral-300" />
                  <div className="h-1 w-12 rounded-full bg-neutral-200" />
                </div>
                {[...Array(2)].map((_, i) => (
                  <div
                    key={`exp-${groupIndex}-${i}`}
                    className={cn(
                      "h-1 rounded-full bg-neutral-200",
                      i === 0 && "w-[90%]",
                      i === 1 && "w-[80%]"
                    )}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="space-y-1.5">
            <div className="h-1.5 w-12 rounded-full bg-neutral-300" />
            <div className="flex flex-wrap gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`skill-${i}`}
                  className="h-1 rounded-full bg-neutral-200 w-12"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer with creation date */}
        {createdAt && (
          <div className="mt-2 pt-2 border-t border-neutral-100">
            <span className="text-[10px] text-neutral-400">
              {formatDate(createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* Subtle hover overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100",
        "transition-opacity duration-200",
        "bg-gradient-to-t from-neutral-900/5 to-transparent"
      )} />
    </div>
  );
} 