'use client';

import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, WorkExperience } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { ImportFromProfileDialog } from "../../management/dialogs/import-from-profile-dialog";

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
import Tiptap from "@/components/ui/tiptap";
import {
    Tooltip,
    TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { hasReachedAILimit, incrementAIUsage } from '@/lib/ai-request-limit';
import { generateWorkExperiencePoints, improveWorkExperience } from "@/utils/actions/resumes/ai";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { AIImprovementPrompt } from "../../shared/ai-improvement-prompt";
import { AISuggestions } from "../../shared/ai-suggestions";
import { AIGenerationSettingsTooltip } from "../components/ai-generation-tooltip";
import { SortableItem } from "../components/sortable-item";


interface AISuggestion {
  id: string;
  point: string;
}

interface WorkExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
  profile: Profile;
  targetRole?: string;
}

interface ImprovedPoint {
  original: string;
  improved: string;
}

interface ImprovementConfig {
  [key: number]: { [key: number]: string }; // expIndex -> pointIndex -> prompt
}

// Create a comparison function
function areWorkExperiencePropsEqual(
  prevProps: WorkExperienceFormProps,
  nextProps: WorkExperienceFormProps
) {
  return (
    prevProps.targetRole === nextProps.targetRole &&
    JSON.stringify(prevProps.experiences) === JSON.stringify(nextProps.experiences) &&
    prevProps.profile.id === nextProps.profile.id
  );
}

// Export the memoized component
export const WorkExperienceForm = memo(function WorkExperienceFormComponent({ 
  experiences = [], 
  onChange, 
  profile, 
  targetRole = "Software Engineer" 
}: WorkExperienceFormProps) {
  const [aiSuggestions, setAiSuggestions] = useState<{ [key: number]: AISuggestion[] }>({});
  const [loadingAI, setLoadingAI] = useState<{ [key: number]: boolean }>({});
  const [loadingPointAI, setLoadingPointAI] = useState<{ [key: number]: { [key: number]: boolean } }>({});
  const [aiConfig, setAiConfig] = useState<{ [key: number]: { numPoints: number; customPrompt: string } }>({});
  const [popoverOpen, setPopoverOpen] = useState<{ [key: number]: boolean }>({});
  const textareaRefs = useRef<{ [key: number]: HTMLTextAreaElement }>({});
  const [improvedPoints, setImprovedPoints] = useState<{ [key: number]: { [key: number]: ImprovedPoint } }>({});
  const [improvementConfig, setImprovementConfig] = useState<ImprovementConfig>({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', description: '' });

  // Create stable IDs for drag and drop
  const experienceIds = useMemo(() => 
    experiences.map((_, index) => `experience-${index}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [experiences.length]
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
      const oldIndex = experienceIds.indexOf(active.id as string);
      const newIndex = experienceIds.indexOf(over.id as string);
      const reordered = arrayMove(experiences, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  // Effect to force re-render when descriptions change
  const descriptionLengths = experiences.map(exp => exp.description?.length || 0).join(',');
  useEffect(() => {
    // This effect ensures that the UI updates when descriptions are added/removed
    // by creating a dependency on the description arrays
  }, [descriptionLengths]);

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

  // Effect to inject custom styles for Tiptap editor
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

  const addExperience = () => {
    const newExperience: WorkExperience = {
      company: "",
      position: "",
      location: "",
      date: "",
      description: [],
      technologies: []
    };
    onChange([newExperience, ...(experiences || [])]);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | string[]) => {
    const updated = [...experiences];
    // Ensure the experience object exists
    if (!updated[index]) {
      updated[index] = {
        company: "",
        position: "",
        location: "",
        date: "",
        description: [],
        technologies: []
      };
    }
    
    // Special handling for description array to ensure proper updates
    if (field === 'description' && Array.isArray(value)) {
      updated[index] = { ...updated[index], description: [...value] };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const handleImportFromProfile = (importedExperiences: WorkExperience[]) => {
    onChange([...importedExperiences, ...experiences]);
  };

  const generateAIPoints = async (index: number) => {
    const exp = experiences[index];
    if (!exp) return; // Safety check

    // Check AI request limit
    if (hasReachedAILimit()) {
      toast({
        title: "AI Request Limit Reached",
  description: "You have reached your daily AI request limit.",
        variant: "destructive",
      });
      return;
    }
    
    const config = aiConfig[index] || { numPoints: 3, customPrompt: '' };
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

      const result = await generateWorkExperiencePoints(
        exp.position,
        exp.company,
        exp.technologies || [],
        targetRole,
        config.numPoints,
        config.customPrompt,
        {
          model: selectedModel || '',
          apiKeys
        }
      );
      
      // Increment AI usage after successful API call
      incrementAIUsage();
      
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

  const approveSuggestion = (expIndex: number, suggestion: AISuggestion) => {
    const updated = [...experiences];
    if (!updated[expIndex]) {
      updated[expIndex] = {
        company: "",
        position: "",
        location: "",
        date: "",
        description: [],
        technologies: []
      };
    }
    if (!updated[expIndex].description) {
      updated[expIndex].description = [];
    }
    updated[expIndex].description = [...updated[expIndex].description, suggestion.point];
    onChange(updated);
    
    // Remove the suggestion after approval
    setAiSuggestions(prev => ({
      ...prev,
      [expIndex]: prev[expIndex].filter(s => s.id !== suggestion.id)
    }));
  };

  const deleteSuggestion = (expIndex: number, suggestionId: string) => {
    setAiSuggestions(prev => ({
      ...prev,
      [expIndex]: prev[expIndex].filter(s => s.id !== suggestionId)
    }));
  };

  const rewritePoint = async (expIndex: number, pointIndex: number) => {
    const exp = experiences[expIndex];
    if (!exp) return;  // Safety check
    const point = exp.description?.[pointIndex] || "";  // Add default value
    const customPrompt = improvementConfig[expIndex]?.[pointIndex] || "";  // Add default value
    
    // Check AI request limit
    if (hasReachedAILimit()) {
      toast({
        title: "AI Request Limit Reached",
  description: "You have reached your daily AI request limit.",
        variant: "destructive",
      });
      return;
    }
    
    setLoadingPointAI(prev => ({
      ...prev,
      [expIndex]: { ...(prev[expIndex] || {}), [pointIndex]: true }
    }));
    
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

      const improvedPoint = await improveWorkExperience(point, customPrompt, {
        model: selectedModel || '',
        apiKeys
      });

      // Increment AI usage after successful API call
      incrementAIUsage();

      // Store both original and improved versions
      setImprovedPoints(prev => ({
        ...prev,
        [expIndex]: {
          ...(prev[expIndex] || {}),
          [pointIndex]: {
            original: point,
            improved: improvedPoint
          }
        }
      }));

      // Update the experience with the improved version
      const updated = [...experiences];
      updated[expIndex].description[pointIndex] = improvedPoint;
      onChange(updated);
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
          description: "Failed to improve point. Please try again."
        });
      }
      setShowErrorDialog(true);
    } finally {
      setLoadingPointAI(prev => ({
        ...prev,
        [expIndex]: { ...(prev[expIndex] || {}), [pointIndex]: false }
      }));
    }
  };

  const undoImprovement = (expIndex: number, pointIndex: number) => {
    const improvedPoint = improvedPoints[expIndex]?.[pointIndex];
    if (improvedPoint) {
      const updated = [...experiences];
      updated[expIndex].description[pointIndex] = improvedPoint.original;
      onChange(updated);
      
      // Remove the improvement from state
      setImprovedPoints(prev => {
        const newState = { ...prev };
        if (newState[expIndex]) {
          delete newState[expIndex][pointIndex];
          if (Object.keys(newState[expIndex]).length === 0) {
            delete newState[expIndex];
          }
        }
        return newState;
      });
    }
  };

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={addExperience}
            className={cn(
              "flex-1 h-9",
              "bg-gradient-to-r from-cyan-500/5 to-teal-500/5",
              "border border-dashed border-cyan-500/30 hover:border-cyan-500/50",
              "hover:from-cyan-500/10 hover:to-teal-500/10",
              "text-cyan-400 hover:text-cyan-300",
              "transition-all duration-200",
              "rounded-xl",
              "text-[11px] sm:text-xs font-medium",
              "hover:shadow-lg hover:shadow-cyan-500/10"
            )}
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
            <span className="hidden xs:inline">Add Work</span>
            <span className="xs:hidden">Add</span>
          </Button>

          <ImportFromProfileDialog<WorkExperience>
            profile={profile}
            onImport={handleImportFromProfile}
            type="work_experience"
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
            items={experienceIds}
            strategy={verticalListSortingStrategy}
          >
            {(experiences || []).map((exp, index) => (
              <SortableItem key={experienceIds[index]} id={experienceIds[index]} accentColor="cyan">
                <Card 
                  className={cn(
                    "relative transition-all duration-200",
                    "bg-zinc-900/50 border border-zinc-800/80",
                    "hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5",
                    "rounded-2xl"
                  )}
                >
                  <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Header with Delete Button */}
                    <div className="space-y-2 sm:space-y-3">
                      {/* Position Title - Full Width */}
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="relative flex-1">
                          <Input
                            value={exp.position || ""}
                            onChange={(e) => updateExperience(index, 'position', e.target.value)}
                            className={cn(
                              "text-sm font-semibold tracking-tight h-12 pl-4 pr-4",
                              "bg-zinc-900/50 border-zinc-800 rounded-xl",
                              "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                              "hover:border-zinc-700 hover:bg-zinc-900/70",
                              "transition-all duration-200",
                              "placeholder:text-zinc-600 text-white"
                            )}
                            placeholder="Position Title"
                          />
                          <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                            Position
                          </Label>
                        </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeExperience(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Company and Location Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      value={exp.company || ""}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className={cn(
                        "text-sm font-medium h-12 pl-4 pr-4",
                        "bg-zinc-900/50 border-zinc-800 rounded-xl",
                        "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                        "hover:border-zinc-700 hover:bg-zinc-900/70",
                        "transition-all duration-200",
                        "placeholder:text-zinc-600 text-white"
                      )}
                      placeholder="Company Name"
                    />
                    <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Company
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      value={exp.location || ""}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      className={cn(
                        "text-sm h-12 pl-4 pr-4",
                        "bg-zinc-900/50 border-zinc-800 rounded-xl",
                        "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                        "hover:border-zinc-700 hover:bg-zinc-900/70",
                        "transition-all duration-200",
                        "placeholder:text-zinc-600 text-white"
                      )}
                      placeholder="Location"
                    />
                    <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Location
                    </Label>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="relative group">
                  <Input
                    type="text"
                    value={exp.date || ""}
                    onChange={(e) => updateExperience(index, 'date', e.target.value)}
                    className={cn(
                      "w-full h-12 pl-4 pr-4",
                      "bg-zinc-900/50 border-zinc-800 rounded-xl",
                      "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                      "hover:border-zinc-700 hover:bg-zinc-900/70",
                      "transition-all duration-200",
                      "placeholder:text-zinc-600 text-white text-sm"
                    )}
                    placeholder="e.g., 'Jan 2023 - Present' or '2020 - 2022'"
                  />
                  <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Date
                  </Label>
                  <span className="mt-1 block text-[10px] text-zinc-500 ml-1">Use &apos;Present&apos; in the date field for current positions</span>
                </div>

                {/* Description Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                    <Label className="text-xs font-semibold text-cyan-400">
                      Key Responsibilities & Achievements
                    </Label>
                  </div>
                  <div className="space-y-2 pl-0">
                    {(exp.description || []).map((desc, descIndex) => (
                      <div key={`${index}-${descIndex}-${desc?.substring(0, 10) || 'empty'}`} className="flex gap-1 items-start group/item">
                        <div className="flex-1">
                          <Tiptap
                            content={desc || ""} 
                            onChange={(newContent) => {
                              const updated = [...experiences];
                              if (!updated[index].description) {
                                updated[index].description = [];
                              }
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
                              "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                              "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                              "placeholder:text-zinc-600 border border-zinc-800 text-white focus:bg-zinc-900/70",
                              improvedPoints[index]?.[descIndex] && [
                                "border-cyan-400",
                                "bg-gradient-to-r from-cyan-900/30 to-teal-900/30",
                                "shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]",
                                "hover:bg-gradient-to-r hover:from-cyan-900/40 hover:to-teal-900/40"
                              ]
                            )}
                          />

                          {improvedPoints[index]?.[descIndex] && (
                            <div className="absolute -top-2.5 right-12 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                              <span className="text-[10px] font-medium text-cyan-400 flex items-center gap-1">
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
                                  // Remove the improvement state after accepting
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
                                  const updated = [...experiences];
                                  if (!updated[index].description) {
                                    updated[index].description = [];
                                    onChange(updated);
                                    return;
                                  }
                                  const newDescription = updated[index].description.filter((_, i) => i !== descIndex);
                                  updateExperience(index, 'description', newDescription);
                                }}
                                className="p-0 group-hover:item:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>

                              {/* AI IMPROVEMENT */}
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
                                        " hover:bg-black",
                                        "text-purple-400 hover:text-purple-600",
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
                                      colorTheme="cyan"
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

                    {exp.description.length === 0 && !aiSuggestions[index]?.length && (
                      <div className="text-[11px] md:text-xs text-zinc-400 border-2 border-dashed border-zinc-700/60 italic px-4 py-3 bg-zinc-900/30 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Plus className="h-3 w-3 text-cyan-400" />
                          <span>Add points to describe your responsibilities and achievements</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...experiences];
                        if (!updated[index].description) {
                          updated[index].description = [];
                        }
                        const newDescription = [...updated[index].description, ""];
                        updateExperience(index, 'description', newDescription);
                      }}
                      className={cn(
                        "flex-1 text-cyan-500 hover:text-cyan-400 transition-colors text-[10px] sm:text-xs",
                        "border-cyan-500/40 hover:border-cyan-500/60 hover:bg-cyan-500/10 bg-zinc-900/50"
                      )}
                    >
                      <Plus className="h-4 w-4 mr-1 text-white" />
                      Add Point
                    </Button>


                    {/* AI GENERATION SETTINGS */}
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
                        button: "text-cyan-400 hover:text-cyan-300",
                        border: "border-zinc-800",
                        hoverBorder: "hover:border-cyan-500/60",
                        hoverBg: "hover:bg-zinc-900/90",
                        tooltipBg: "bg-zinc-950/95 backdrop-blur-sm",
                        tooltipBorder: "border-2 border-zinc-800",
                        tooltipShadow: "shadow-lg shadow-black/20",
                        text: "text-cyan-400",
                        hoverText: "hover:text-cyan-300"
                      }}
                    />
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
}, areWorkExperiencePropsEqual);
