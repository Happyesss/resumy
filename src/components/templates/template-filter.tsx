'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Palette, Monitor, GraduationCap, Sparkles, Eye } from "lucide-react";

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

const categoryIcons = {
  all: Eye,
  modern: Monitor,
  classic: GraduationCap,
  creative: Sparkles,
  minimal: Palette
};

const categoryColors = {
  all: 'hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30',
  modern: 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30',
  classic: 'hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30',
  creative: 'hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30',
  minimal: 'hover:bg-gray-500/10 hover:text-gray-400 hover:border-gray-500/30'
};

const selectedColors = {
  all: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  modern: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  classic: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
  creative: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  minimal: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
};

export function TemplateFilter({ categories, selectedCategory, onCategoryChange }: TemplateFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Palette className="h-5 w-5 text-purple-400" />
        Categories
      </h3>
      
      {/* Desktop - Horizontal */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              variant="outline"
              size="sm"
              className={cn(
                "transition-all duration-200 border border-gray-600 bg-gray-800/50",
                isSelected 
                  ? selectedColors[category.id as keyof typeof selectedColors]
                  : cn(
                      "text-gray-300 hover:bg-gray-700",
                      categoryColors[category.id as keyof typeof categoryColors]
                    )
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.name}
              <Badge 
                className={cn(
                  "ml-2 text-xs",
                  isSelected 
                    ? "bg-white/20 text-current" 
                    : "bg-gray-700 text-gray-400"
                )}
              >
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Mobile - Compact Horizontal */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
            const isSelected = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                variant="outline"
                size="sm"
                className={cn(
                  "flex-shrink-0 transition-all duration-200 border border-gray-600 bg-gray-800/50 text-xs px-2 py-1 h-8",
                  isSelected 
                    ? selectedColors[category.id as keyof typeof selectedColors]
                    : cn(
                        "text-gray-300 hover:bg-gray-700",
                        categoryColors[category.id as keyof typeof categoryColors]
                      )
                )}
              >
                <Icon className="h-3 w-3 mr-1" />
                <span className="whitespace-nowrap">{category.name}</span>
                <Badge 
                  className={cn(
                    "ml-1 text-xs px-1 py-0 h-4 min-w-[16px] flex items-center justify-center",
                    isSelected 
                      ? "bg-white/20 text-current" 
                      : "bg-gray-700 text-gray-400"
                  )}
                >
                  {category.count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
