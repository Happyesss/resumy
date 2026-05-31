'use client';

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface TemplateFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function TemplateFilter({ categories, selectedCategory, onCategoryChange }: TemplateFilterProps) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
      <div className="flex items-center gap-2 flex-shrink-0">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-1 px-4 py-2 rounded-full text-[13px] font-medium",
                "transition-all duration-200 whitespace-nowrap select-none",
                "border",
                isSelected
                  ? "bg-white text-black border-white shadow-sm"
                  : "bg-transparent text-white/50 border-white/[0.12] hover:text-white/80 hover:border-white/[0.2]"
              )}
            >
              {category.name}
              <span className={cn(
                "text-[11px] tabular-nums",
                isSelected ? "text-black/40" : "text-white/25"
              )}>
                {category.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
