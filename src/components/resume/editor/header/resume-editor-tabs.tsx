'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  FileText, 
  FolderGit2, 
  GraduationCap, 
  User, 
  Wrench,
  LucideIcon
} from "lucide-react";

interface TabConfig {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  activeGradient: string;
}

const tabs: TabConfig[] = [
  {
    value: "basic",
    label: "Basic Info",
    icon: User,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    activeGradient: "from-emerald-500/20 to-teal-500/10"
  },
  {
    value: "summary",
    label: "Summary",
    icon: FileText,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    activeGradient: "from-violet-500/20 to-purple-500/10"
  },
  {
    value: "work",
    label: "Work",
    icon: Briefcase,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    activeGradient: "from-blue-500/20 to-cyan-500/10"
  },
  {
    value: "projects",
    label: "Projects",
    icon: FolderGit2,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    activeGradient: "from-amber-500/20 to-orange-500/10"
  },
  {
    value: "education",
    label: "Education",
    icon: GraduationCap,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    activeGradient: "from-cyan-500/20 to-sky-500/10"
  },
  {
    value: "skills",
    label: "Skills",
    icon: Wrench,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    activeGradient: "from-rose-500/20 to-pink-500/10"
  }
];

export function ResumeEditorTabs() {
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
          return (
            <TooltipProvider key={tab.value} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.value}
                    className={cn(
                      "group relative flex items-center justify-center",
                      "flex-1 min-w-0",
                      "px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg",
                      "font-medium text-xs",
                      "transition-all duration-200 ease-out",
                      // Inactive state
                      "text-zinc-500 hover:text-zinc-300",
                      "hover:bg-zinc-800/60",
                      // Active state
                      "data-[state=active]:text-white",
                      `data-[state=active]:bg-gradient-to-br data-[state=active]:${tab.activeGradient}`,
                      "data-[state=active]:shadow-md",
                      "data-[state=active]:border data-[state=active]:border-zinc-700/50"
                    )}
                  >
                    {/* Icon container */}
                    <div className={cn(
                      "flex items-center justify-center",
                      "w-6 h-6 lg:w-7 lg:h-7 rounded-lg",
                      "transition-all duration-200",
                      tab.bgColor,
                      "group-data-[state=active]:scale-110",
                      "group-hover:scale-105"
                    )}>
                      <Icon className={cn(
                        "h-3 w-3 lg:h-3.5 lg:w-3.5 transition-colors duration-200",
                        "text-zinc-500 group-hover:text-zinc-400",
                        `group-data-[state=active]:${tab.color}`
                      )} />
                    </div>
                    
                    {/* Label - only shown on 2xl screens and larger */}
                    <span className="hidden 2xl:inline-block whitespace-nowrap ml-2">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  className="2xl:hidden bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"
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