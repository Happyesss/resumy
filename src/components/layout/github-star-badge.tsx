import { cn } from "@/lib/utils";
import { Github, Star } from "lucide-react";
import Link from "next/link";

interface GitHubStarBadgeProps {
  href: string;
  starCount: string;
  starLabel: string;
  compact?: boolean;
  className?: string;
}

export function GitHubStarBadge({
  href,
  starCount,
  starLabel,
  compact = false,
  className,
}: GitHubStarBadgeProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Star Resumy on GitHub"
      title={starLabel}
      className={cn(
        "group inline-flex items-stretch overflow-hidden rounded-md border border-zinc-700/80",
        "bg-zinc-900/90 text-zinc-200 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900",
        "hover:shadow-[0_8px_22px_rgba(0,0,0,0.45)] focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-yellow-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        compact ? "h-7" : "h-8",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 border-r border-zinc-700/80 bg-zinc-800/70 px-2.5",
          compact ? "text-[11px]" : "text-xs"
        )}
      >
        <Github className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
        {!compact && <span className="font-medium tracking-wide">Star</span>}
      </span>

      <span
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden px-2.5",
          "font-semibold tabular-nums",
          compact ? "min-w-[42px] text-[11px]" : "min-w-[50px] text-xs"
        )}
      >
        <span className="inline-flex items-center gap-1 transition-all duration-300 group-hover:-translate-y-8 group-hover:opacity-0">
          {starCount}
        </span>

        <span className="absolute inset-0 inline-flex translate-y-8 items-center justify-center gap-1 text-yellow-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Star className={cn("fill-yellow-300", compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
          <span className="tabular-nums">{starCount}</span>
        </span>
      </span>
    </Link>
  );
}
