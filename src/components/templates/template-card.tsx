'use client';

import { trackResumeEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTemplateHandler } from "./use-template-handler";

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  image: string;
  features: string[];
  rating: number;
  downloads: number;
  preview: string;
}

interface TemplateCardProps {
  template: Template;
  onPreview: () => void;
}

const dot: Record<string, string> = {
  modern:   'bg-[#0a84ff]',
  classic:  'bg-[#5e5ce6]',
  creative: 'bg-[#bf5af2]',
  minimal:  'bg-[#98989d]',
};

const label: Record<string, string> = {
  modern:   'text-[#0a84ff]',
  classic:  'text-[#5e5ce6]',
  creative: 'text-[#bf5af2]',
  minimal:  'text-[#98989d]',
};

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const { handleUseTemplate } = useTemplateHandler();

  const onUseTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackResumeEvent.selectTemplate(template.name);
    handleUseTemplate({ templateId: template.id });
  };

  return (
    <div className="group flex flex-col gap-2.5">
      {/* Paper card — lifts on hover */}
      <button
        onClick={onPreview}
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-white",
          "shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
          "hover:shadow-[0_8px_28px_rgba(0,0,0,0.55)]",
          "transition-all duration-300 ease-out",
          "group-hover:-translate-y-1",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        )}
        style={{ aspectRatio: '1 / 1.414' }}
        aria-label={`Preview ${template.name}`}
      >
        <Image
          src={template.image}
          alt={template.name}
          fill
          className="object-contain object-top"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Hover scrim */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        {/* Quick Look label */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-2.5 pointer-events-none">
          <span className={cn(
            "bg-black/80 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full",
            "opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-250 ease-out"
          )}>
            Quick Look
          </span>
        </div>
      </button>

      {/* Footer info */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot[template.category])} />
          <p className="text-[12px] font-semibold text-white/90 truncate">{template.name}</p>
        </div>
        <button
          onClick={onUseTemplate}
          className={cn(
            "flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold",
            "bg-white/[0.1] hover:bg-white/[0.18] active:bg-white/[0.08]",
            "text-white border border-white/[0.14]",
            "transition-colors duration-150"
          )}
        >
          Use
        </button>
      </div>
      <p className={cn("text-[10px] font-medium px-0.5 -mt-1.5 capitalize", label[template.category])}>
        {template.category}
      </p>
    </div>
  );
}
