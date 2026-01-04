'use client';

import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tiptap from "@/components/ui/tiptap";
import {
    Tooltip,
    TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { getCurrentDailyLimit, hasReachedDailyLimit, incrementDailyUsage } from "@/lib/daily-limit";
import { Profile, Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { generateProjectPoints, improveProject } from "@/utils/actions/resumes/ai";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Check, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { KeyboardEvent, memo, useEffect, useMemo, useRef, useState } from "react";
import { ImportFromProfileDialog } from "../../management/dialogs/import-from-profile-dialog";
import { AIImprovementPrompt } from "../../shared/ai-improvement-prompt";
import { AISuggestions } from "../../shared/ai-suggestions";
import { AIGenerationSettingsTooltip } from "../components/ai-generation-tooltip";
import { SortableItem } from "../components/sortable-item";

interface AISuggestion {
  id: string;
  point: string;
}

interface ImprovedPoint {
  original: string;
  improved: string;
}

interface ImprovementConfig {
  [key: number]: { [key: number]: string }; // projectIndex -> pointIndex -> prompt
}

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
  profile: Profile;
}

function areProjectsPropsEqual(
  prevProps: ProjectsFormProps,
  nextProps: ProjectsFormProps
) {
  return (
    JSON.stringify(prevProps.projects) === JSON.stringify(nextProps.projects) &&
    prevProps.profile.id === nextProps.profile.id
  );
}

export const ProjectsForm = memo(function ProjectsFormComponent({
  projects,
  onChange,
  profile
}: ProjectsFormProps) {
  const { toast } = useToast();
  const [aiSuggestions, setAiSuggestions] = useState<{ [key: number]: AISuggestion[] }>({});
  const [loadingAI, setLoadingAI] = useState<{ [key: number]: boolean }>({});
  const [loadingPointAI, setLoadingPointAI] = useState<{ [key: number]: { [key: number]: boolean } }>({});
  const [aiConfig, setAiConfig] = useState<{ [key: number]: { numPoints: number; customPrompt: string } }>({});
  const [popoverOpen, setPopoverOpen] = useState<{ [key: number]: boolean }>({});
  const [improvedPoints, setImprovedPoints] = useState<{ [key: number]: { [key: number]: ImprovedPoint } }>({});
  const [improvementConfig, setImprovementConfig] = useState<ImprovementConfig>({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', description: '' });
  const textareaRefs = useRef<{ [key: number]: HTMLTextAreaElement }>({});
  const [newTechnologies, setNewTechnologies] = useState<{ [key: number]: string }>({});

  // Create stable IDs for drag and drop
  const projectIds = useMemo(() => 
    projects.map((_, index) => `project-${index}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects.length]
  );

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = projectIds.indexOf(active.id as string);
      const newIndex = projectIds.indexOf(over.id as string);
      const reordered = arrayMove(projects, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  // Extract dependency for useEffect to satisfy lint rules
  const projectDescriptionLengths = projects.map(proj => proj.description?.length || 0).join(',');

  // Effect to force re-render when descriptions change
  useEffect(() => {
    // This effect ensures that the UI updates when descriptions are added/removed
    // by creating a dependency on the description arrays
  }, [projectDescriptionLengths]);

  // Effect to focus textarea when popover opens
  useEffect(() => {
    Object.entries(popoverOpen).forEach(([index, isOpen]) => {
      if (isOpen && textareaRefs.current[Number(index)]) {
        // Small delay to ensure the popover is fully rendered
        setTimeout(() => {
          textareaRefs.current[Number(index)]?.focus();
        }, 100);
      }
    });
  }, [popoverOpen]);

  // Add this style block at the top level of your component file, before the return statement
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .ProseMirror {
        font-weight: 400 !important; /* Make normal text less bold */
      }
      .ProseMirror strong {
        color: #fff !important;
        font-weight: 700 !important; /* Make bold text white and strongly bold */
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const addProject = () => {
    onChange([{
      name: "",
      description: [],
      technologies: [],
      date: "",
      url: "",
      github_url: ""
    }, ...projects]);
  };

  const updateProject = (index: number, field: keyof Project, value: Project[keyof Project]) => {
    const updated = [...projects];
    
    // Special handling for description array to ensure proper updates
    if (field === 'description' && Array.isArray(value)) {
      updated[index] = { ...updated[index], description: [...value] };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const handleImportFromProfile = (importedProjects: Project[]) => {
    onChange([...importedProjects, ...projects]);
  };

  const generateAIPoints = async (index: number) => {
    const project = projects[index];
    const config = aiConfig[index] || { numPoints: 3, customPrompt: '' };
    
    // Check daily API request limit
    if (hasReachedDailyLimit(profile.email)) {
      const dailyLimit = getCurrentDailyLimit(profile.email);
      toast({
        title: "Daily Request Limit Reached",
        description: `You have reached the daily limit of ${dailyLimit} AI requests. Please try again tomorrow.`,
        variant: "destructive",
      });
      return;
    }
    
    setLoadingAI(prev => ({ ...prev, [index]: true }));
    setPopoverOpen(prev => ({ ...prev, [index]: false }));
    
    try {
      // Get model and API key from local storage
      const MODEL_STORAGE_KEY = 'resumelm-default-model';
      const LOCAL_STORAGE_KEY = 'resumelm-api-keys';

      const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY);
      const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
      let apiKeys = [];

      try {
        apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
      } catch (error) {
        console.error('Error parsing API keys:', error);
      }

      const result = await generateProjectPoints(
        project.name,
        project.technologies || [],
        "Software Engineer",
        config.numPoints,
        config.customPrompt,
        {
          model: selectedModel || '',
          apiKeys
        }
      );
      
      // Increment daily usage after successful API call
      incrementDailyUsage();
      
      const suggestions = result.points.map((point: string) => ({
        id: Math.random().toString(36).substr(2, 9),
        point
      }));
      
      setAiSuggestions(prev => ({
        ...prev,
        [index]: suggestions
      }));
    } catch (error: Error | unknown) {
      if (error instanceof Error && (
          error.message.toLowerCase().includes('api key') || 
          error.message.toLowerCase().includes('unauthorized') ||
          error.message.toLowerCase().includes('invalid key') ||
          error.message.toLowerCase().includes('invalid x-api-key'))
      ) {
        setErrorMessage({
          title: "API Key Error",
          description: "There was an issue with your API key. Please check your settings and try again."
        });
      } else {
        setErrorMessage({
          title: "Error",
          description: "Failed to generate AI points. Please try again."
        });
      }
      setShowErrorDialog(true);
    } finally {
      setLoadingAI(prev => ({ ...prev, [index]: false }));
    }
  };

  const approveSuggestion = (projectIndex: number, suggestion: AISuggestion) => {
    const updated = [...projects];
    updated[projectIndex].description = [...updated[projectIndex].description, suggestion.point];
    onChange(updated);
    
    // Remove the suggestion after approval
    setAiSuggestions(prev => ({
      ...prev,
      [projectIndex]: prev[projectIndex].filter(s => s.id !== suggestion.id)
    }));
  };

  const deleteSuggestion = (projectIndex: number, suggestionId: string) => {
    setAiSuggestions(prev => ({
      ...prev,
      [projectIndex]: prev[projectIndex].filter(s => s.id !== suggestionId)
    }));
  };

  const rewritePoint = async (projectIndex: number, pointIndex: number) => {
    const project = projects[projectIndex];
    const point = project.description[pointIndex];
    const customPrompt = improvementConfig[projectIndex]?.[pointIndex];
    
    // Check daily API request limit
    if (hasReachedDailyLimit(profile.email)) {
      const dailyLimit = getCurrentDailyLimit(profile.email);
      toast({
        title: "Daily Request Limit Reached",
        description: `You have reached the daily limit of ${dailyLimit} AI requests. Please try again tomorrow.`,
        variant: "destructive",
      });
      return;
    }
    
    setLoadingPointAI(prev => ({
      ...prev,
      [projectIndex]: { ...(prev[projectIndex] || {}), [pointIndex]: true }
    }));
    
    try {
      const MODEL_STORAGE_KEY = 'resumelm-default-model';
      const LOCAL_STORAGE_KEY = 'resumelm-api-keys';

      const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY);
      const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
      let apiKeys = [];

      try {
        apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
      } catch (error) {
        console.error('Error parsing API keys:', error);
      }

      const improvedPoint = await improveProject(point, customPrompt, {
        model: selectedModel || '',
        apiKeys
      });

      // Increment daily usage after successful API call
      incrementDailyUsage();

      setImprovedPoints(prev => ({
        ...prev,
        [projectIndex]: {
          ...(prev[projectIndex] || {}),
          [pointIndex]: {
            original: point,
            improved: improvedPoint
          }
        }
      }));

      const updated = [...projects];
      updated[projectIndex].description[pointIndex] = improvedPoint;
      onChange(updated);
    } catch (error: unknown) {
      if (error instanceof Error && (
        error.message.toLowerCase().includes('api key') || 
        error.message.toLowerCase().includes('unauthorized') ||
        error.message.toLowerCase().includes('invalid key') ||
        error.message.toLowerCase().includes('invalid x-api-key'))
      ) {
        setErrorMessage({
          title: "API Key Error",
          description: "There was an issue with your API key. Please check your settings and try again."
        });
      } else {
        setErrorMessage({
          title: "Error",
          description: "Failed to improve point. Please try again."
        });
      }
      setShowErrorDialog(true);
    } finally {
      setLoadingPointAI(prev => ({
        ...prev,
        [projectIndex]: { ...(prev[projectIndex] || {}), [pointIndex]: false }
      }));
    }
  };

  const undoImprovement = (projectIndex: number, pointIndex: number) => {
    const improvedPoint = improvedPoints[projectIndex]?.[pointIndex];
    if (improvedPoint) {
      const updated = [...projects];
      updated[projectIndex].description[pointIndex] = improvedPoint.original;
      onChange(updated);
      
      // Remove the improvement from state
      setImprovedPoints(prev => {
        const newState = { ...prev };
        if (newState[projectIndex]) {
          delete newState[projectIndex][pointIndex];
          if (Object.keys(newState[projectIndex]).length === 0) {
            delete newState[projectIndex];
          }
        }
        return newState;
      });
    }
  };

  const addTechnology = (projectIndex: number) => {
    const techToAdd = newTechnologies[projectIndex]?.trim();
    if (!techToAdd) return;

    const updated = [...projects];
    const currentTechnologies = updated[projectIndex].technologies || [];
    
    if (!currentTechnologies.includes(techToAdd)) {
      updated[projectIndex] = {
        ...updated[projectIndex],
        technologies: [...currentTechnologies, techToAdd]
      };
      onChange(updated);
    }
    setNewTechnologies({ ...newTechnologies, [projectIndex]: '' });
  };

  const handleTechKeyPress = (e: KeyboardEvent<HTMLInputElement>, projectIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology(projectIndex);
    }
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const updated = [...projects];
    updated[projectIndex].technologies = (updated[projectIndex].technologies || [])
      .filter((_, i) => i !== techIndex);
    onChange(updated);
  };

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={addProject}
            className={cn(
              "flex-1 h-9",
              "bg-gradient-to-r from-amber-500/5 to-orange-500/5",
              "border border-dashed border-amber-500/30 hover:border-amber-500/50",
              "hover:from-amber-500/10 hover:to-orange-500/10",
              "text-amber-400 hover:text-amber-300",
              "transition-all duration-200",
              "rounded-xl",
              "text-[11px] sm:text-xs font-medium",
              "hover:shadow-lg hover:shadow-amber-500/10"
            )}
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
            <span className="hidden xs:inline">Add Project</span>
            <span className="xs:hidden">Add</span>
          </Button>

          <ImportFromProfileDialog<Project>
            profile={profile}
            onImport={handleImportFromProfile}
            type="projects"
            buttonClassName={cn(
              "flex-1 h-9",
              "text-[11px] sm:text-xs font-medium"
            )}
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projectIds}
            strategy={verticalListSortingStrategy}
          >
            {projects.map((project, index) => (
              <SortableItem key={projectIds[index]} id={projectIds[index]} accentColor="amber">
                <Card 
                  className={cn(
                    "relative transition-all duration-200",
                    "bg-zinc-900/50 border border-zinc-800/80",
                    "hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5",
                    "rounded-2xl"
                  )}
                >
                  <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Header with Delete Button */}
                    <div className="space-y-2 sm:space-y-3">
                      {/* Project Name - Full Width */}
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="relative flex-1">
                          <Input
                            value={project.name}
                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                            className={cn(
                              "text-sm font-semibold tracking-tight h-12 pl-4 pr-4",
                              "bg-zinc-900/50 border-zinc-800 rounded-xl",
                              "focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20",
                              "hover:border-zinc-700 hover:bg-zinc-900/70",
                              "transition-all duration-200",
                              "placeholder:text-zinc-600 text-white"
                            )}
                            placeholder="Project Name"
                          />
                          <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            Project Name
                          </Label>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                    onClick={() => removeProject(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* URLs Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      value={project.url || ''}
                      onChange={(e) => updateProject(index, 'url', e.target.value)}
                      className={cn(
                        "text-sm font-medium h-12 pl-4 pr-4",
                        "bg-zinc-900/50 border-zinc-800 rounded-xl",
                        "focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20",
                        "hover:border-zinc-700 hover:bg-zinc-900/70",
                        "transition-all duration-200",
                        "placeholder:text-zinc-600 text-white"
                      )}
                      placeholder="Live URL"
                    />
                    <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Live URL
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      value={project.github_url || ''}
                      onChange={(e) => updateProject(index, 'github_url', e.target.value)}
                      className={cn(
                        "h-12 pl-4 pr-4",
                        "bg-zinc-900/50 border-zinc-800 rounded-xl",
                        "focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20",
                        "hover:border-zinc-700 hover:bg-zinc-900/70",
                        "transition-all duration-200",
                        "placeholder:text-zinc-600 text-white text-sm"
                      )}
                      placeholder="GitHub URL"
                    />
                    <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      GitHub URL
                    </Label>
                  </div>
                </div>

                {/* Date */}
                <div className="relative group">
                  <Input
                    type="text"
                    value={project.date || ''}
                    onChange={(e) => updateProject(index, 'date', e.target.value)}
                    className={cn(
                      "w-full h-12 pl-4 pr-4",
                      "bg-zinc-900/50 border-zinc-800 rounded-xl",
                      "focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20",
                      "hover:border-zinc-700 hover:bg-zinc-900/70",
                      "transition-all duration-200",
                      "placeholder:text-zinc-600 text-white text-sm"
                    )}
                    placeholder="e.g., 'Jan 2023 - Present' or '2020 - 2022'"
                  />
                  <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Date
                  </Label>
                </div>

                {/* Description Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-amber-500 rounded-full" />
                    <Label className="text-xs font-semibold text-amber-400">
                      Key Features & Technical Achievements
                    </Label>
                  </div>
                  <div className="space-y-2 pl-0">
                    {project.description.map((desc, descIndex) => (
                      <div key={`${index}-${descIndex}-${desc?.substring(0, 10) || 'empty'}`} className="flex gap-1 items-start group/item">
                        <div className="flex-1">
                          <Tiptap
                            content={desc} 
                            onChange={(newContent) => {
                              const updated = [...projects];
                              updated[index].description[descIndex] = newContent;
                              onChange(updated);

                              if (improvedPoints[index]?.[descIndex]) {
                                setImprovedPoints(prev => {
                                  const newState = { ...prev };
                                  if (newState[index]) {
                                    delete newState[index][descIndex];
                                    if (Object.keys(newState[index]).length === 0) {
                                      delete newState[index];
                                    }
                                  }
                                  return newState;
                                });
                              }
                            }}
                            className={cn(
                              "min-h-[60px] text-xs md:text-sm bg-zinc-900/50 border-zinc-800 rounded-lg",
                              "focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20",
                              "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                              "placeholder:text-zinc-600 border border-zinc-800 text-white focus:bg-zinc-900/70",
                              improvedPoints[index]?.[descIndex] && [
                                "border-amber-400",
                                "bg-gradient-to-r from-amber-900/30 to-orange-900/30",
                                "shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]",
                                "hover:bg-gradient-to-r hover:from-amber-900/40 hover:to-orange-900/40"
                              ]
                            )}
                          />

                          {improvedPoints[index]?.[descIndex] && (
                            <div className="absolute -top-2.5 right-12 px-2 py-0.5 rounded-full">
                              <span className="text-[10px] font-medium text-purple-600 flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                AI Suggestion
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {improvedPoints[index]?.[descIndex] ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setImprovedPoints(prev => {
                                    const newState = { ...prev };
                                    if (newState[index]) {
                                      delete newState[index][descIndex];
                                      if (Object.keys(newState[index]).length === 0) {
                                        delete newState[index];
                                      }
                                    }
                                    return newState;
                                  });
                                }}
                                className={cn(
                                  "p-0 group-hover/item:opacity-100",
                                  "h-8 w-8 rounded-lg",
                                  "bg-green-50/80 hover:bg-green-100/80",
                                  "text-green-600 hover:text-green-700",
                                  "border border-green-200/60",
                                  "shadow-sm",
                                  "transition-all duration-300",
                                  "hover:scale-105 hover:shadow-md",
                                  "hover:-translate-y-0.5"
                                )}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => undoImprovement(index, descIndex)}
                                className={cn(
                                  "p-0 group-hover/item:opacity-100",
                                  "h-8 w-8 rounded-lg",
                                  "bg-rose-50/80 hover:bg-rose-100/80",
                                  "text-rose-600 hover:text-rose-400",
                                  "border border-rose-200/60",
                                  "shadow-sm",
                                  "transition-all duration-300",
                                  "hover:scale-105 hover:shadow-md",
                                  "hover:-translate-y-0.5"
                                )}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newDescription = project.description.filter((_, i) => i !== descIndex);
                                  updateProject(index, 'description', newDescription);
                                }}
                                className="p-0 group-hover/item:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => rewritePoint(index, descIndex)}
                                      disabled={loadingPointAI[index]?.[descIndex]}
                                      className={cn(
                                        "p-0 group-hover/item:opacity-100",
                                        "h-8 w-8 rounded-lg",
                                        "hover:bg-black/5",
                                        "text-purple-600 hover:text-purple-700",
                                        "border border-purple-200/60",
                                        "shadow-sm",
                                        "transition-all duration-300",
                                        "hover:scale-105 hover:shadow-md",
                                        "hover:-translate-y-0.5"
                                      )}
                                    >
                                      {loadingPointAI[index]?.[descIndex] ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Sparkles className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent 
                                    side="bottom" 
                                    align="start"
                                    sideOffset={2}
                                    className={cn(
                                      "w-80 p-4",
                                      "bg-zinc-900 border border-zinc-800",
                                      "shadow-xl shadow-black/20",
                                      "rounded-xl"
                                    )}
                                  >
                                    <AIImprovementPrompt
                                      value={improvementConfig[index]?.[descIndex] || ''}
                                      onChange={(value) => setImprovementConfig(prev => ({
                                        ...prev,
                                        [index]: {
                                          ...(prev[index] || {}),
                                          [descIndex]: value
                                        }
                                      }))}
                                      onSubmit={() => rewritePoint(index, descIndex)}
                                      isLoading={loadingPointAI[index]?.[descIndex]}
                                      colorTheme="amber"
                                    />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* AI Suggestions */}
                    <AISuggestions
                      suggestions={aiSuggestions[index] || []}
                      onApprove={(suggestion) => approveSuggestion(index, suggestion)}
                      onDelete={(suggestionId) => deleteSuggestion(index, suggestionId)}
                    />

                    {project.description.length === 0 && !aiSuggestions[index]?.length && (
                      <div className="text-[10px] sm:text-xs text-zinc-400 border-2 border-dashed border-zinc-700/60 italic px-4 py-3 bg-zinc-900/30 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Plus className="h-3 w-3 text-amber-400" />
                          <span>Add points to describe your project&apos;s features and achievements</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDescription = [...project.description, ""];
                        updateProject(index, 'description', newDescription);
                      }}
                      className={cn(
                        "flex-1 text-amber-500 hover:text-amber-400 transition-colors text-[10px] sm:text-xs",
                        "border-amber-500/40 hover:border-amber-500/60 hover:bg-amber-500/10 bg-zinc-900/50"
                      )}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Point
                    </Button>

                    
                    <AIGenerationSettingsTooltip
                      index={index}
                      loadingAI={loadingAI[index]}
                      generateAIPoints={generateAIPoints}
                      aiConfig={aiConfig[index] || { numPoints: 3, customPrompt: '' }}
                      onNumPointsChange={(value) => setAiConfig(prev => ({
                        ...prev,
                        [index]: { ...prev[index], numPoints: value }
                      }))}
                      onCustomPromptChange={(value) => setAiConfig(prev => ({
                        ...prev,
                        [index]: { ...prev[index], customPrompt: value }
                      }))}
                      colorClass={{
                        button: "text-amber-400 hover:text-amber-300",
                        border: "border-zinc-800",
                        hoverBorder: "hover:border-amber-500/60",
                        hoverBg: "hover:bg-zinc-900/90",
                        tooltipBg: "bg-zinc-950/95 backdrop-blur-sm",
                        tooltipBorder: "border-2 border-zinc-800",
                        tooltipShadow: "shadow-lg shadow-black/20",
                        text: "text-amber-400",
                        hoverText: "hover:text-amber-300"
                      }}
                    />
                  </div>
                </div>

                {/* Technologies Section */}
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-[10px] sm:text-xs font-medium text-amber-400">
                    Technologies & Tools Used
                  </Label>
                  
                  <div className="space-y-2">
                    {/* Technologies Display */}
                    <div className="flex flex-wrap gap-1.5">
                      {(project.technologies || []).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className={cn(
                            "bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 py-0.5",
                            "transition-all duration-300 group/badge cursor-default text-[10px] sm:text-xs"
                          )}
                        >
                          {tech}
                          <button
                            onClick={() => removeTechnology(index, techIndex)}
                            className="ml-1.5 hover:text-red-500 opacity-50 hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {/* New Technology Input */}
                    <div className="relative group flex gap-2">
                      <Input
                        value={newTechnologies[index] || ''}
                        onChange={(e) => setNewTechnologies({ ...newTechnologies, [index]: e.target.value })}
                        onKeyPress={(e) => handleTechKeyPress(e, index)}
                        className={cn(
                          "h-9 bg-zinc-900/50 border-zinc-800 rounded-lg",
                          "focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20",
                          "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                          "placeholder:text-zinc-600 border border-zinc-800 text-white focus:bg-zinc-900/70",
                          "text-[10px] sm:text-xs"
                        )}
                        placeholder="Type a technology and press Enter or click +"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTechnology(index)}
                        className="h-9 px-2 bg-zinc-900/50 hover:bg-zinc-900/90 border-amber-500/40 hover:border-amber-500/60"
                      >
                        <Plus className="h-4 w-4 text-amber-400" />
                      </Button>
                      <div className="absolute -top-2 left-2 px-1 bg-zinc-950 rounded-full text-[7px] sm:text-[9px] font-medium text-amber-400">
                        ADD TECHNOLOGY
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                  </CardContent>
                </Card>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Error Alert Dialog at the end */}
      <ApiErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title={errorMessage.title}
        description={errorMessage.description}
      />
    </>
  );
}, areProjectsPropsEqual);
