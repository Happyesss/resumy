'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  FileText,
  FolderGit2,
  GraduationCap,
  LucideIcon,
  User,
  Wrench,
} from "lucide-react";
import { CSSProperties } from "react";

interface TabConfig {
  value: string;
  label: string;
  icon: LucideIcon;
  hex: string;
}

const tabs: TabConfig[] = [
  { value: "basic",     label: "Basic Info",  icon: User,        hex: "#30d158" },
  { value: "summary",   label: "Summary",     icon: FileText,    hex: "#bf5af2" },
  { value: "work",      label: "Work",        icon: Briefcase,   hex: "#0a84ff" },
  { value: "projects",  label: "Projects",    icon: FolderGit2,  hex: "#ffd60a" },
  { value: "education", label: "Education",   icon: GraduationCap, hex: "#5ac8fa" },
  { value: "skills",    label: "Skills",      icon: Wrench,      hex: "#ff453a" },
];

interface ResumeEditorTabsProps {
  activeTab?: string;
}

export function ResumeEditorTabs({ activeTab }: ResumeEditorTabsProps) {
  return (
    <div className="w-full py-1.5 lg:py-2">
      <TabsList className={cn(
        "w-full h-auto p-0.5 md:p-0.5 lg:p-1",
        "bg-zinc-900/80 backdrop-blur-xl",
        "border border-zinc-800/80",
        "rounded-xl shadow-lg shadow-black/20",
        "flex flex-row gap-0.5 md:gap-0.5 lg:gap-1",
        "overflow-x-auto scrollbar-hide"
      )}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;

          const triggerStyle: CSSProperties = isActive ? {
            background: `linear-gradient(135deg, ${tab.hex}26 0%, ${tab.hex}0d 100%)`,
            boxShadow: `0 0 14px ${tab.hex}28, 0 0 0 1px ${tab.hex}30`,
          } : {};

          const iconWrapStyle: CSSProperties = isActive ? {
            background: `${tab.hex}22`,
          } : {};

          return (
            <TooltipProvider key={tab.value} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.value}
                    style={triggerStyle}
                    className={cn(
                      "group relative flex items-center justify-center",
                      "flex-1 min-w-0",
                      "px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg",
                      "font-medium text-xs",
                      "transition-all duration-200 ease-out",
                      "text-zinc-500 hover:text-zinc-300",
                      "hover:bg-zinc-800/60",
                      "data-[state=active]:text-white",
                      "data-[state=active]:shadow-md",
                      "data-[state=active]:border data-[state=active]:border-zinc-700/50"
                    )}
                  >
                    {/* Icon container */}
                    <div
                      style={iconWrapStyle}
                      className={cn(
                        "flex items-center justify-center",
                        "w-6 h-6 lg:w-7 lg:h-7 rounded-lg",
                        "transition-all duration-200",
                        !isActive && "bg-zinc-800/50",
                        isActive && "scale-110"
                      )}
                    >
                      <Icon
                        style={{ color: isActive ? tab.hex : undefined }}
                        className={cn(
                          "h-3 w-3 lg:h-3.5 lg:w-3.5 transition-colors duration-200",
                          !isActive && "text-zinc-500 group-hover:text-zinc-400",
                        )}
                      />
                    </div>

                    {/* Label - only shown on very wide screens (3xl+) */}
                    <span className="hidden 3xl:inline-block whitespace-nowrap ml-2">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="3xl:hidden bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"
                >
                  {tab.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </TabsList>
    </div>
  );
}
