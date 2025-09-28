'use client';

import { WorkExperience, Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Check, X, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImportFromProfileDialog } from "../../management/dialogs/import-from-profile-dialog";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";

import { useState, useRef, useEffect, memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Tiptap from "@/components/ui/tiptap";
import { generateWorkExperiencePoints, improveWorkExperience } from "@/utils/actions/resumes/ai";
import { AIImprovementPrompt } from "../../shared/ai-improvement-prompt";
import { AIGenerationSettingsTooltip } from "../components/ai-generation-tooltip";
import { AISuggestions } from "../../shared/ai-suggestions";
import { hasReachedDailyLimit, incrementDailyUsage, DAILY_REQUEST_LIMIT } from '@/lib/daily-limit';
import { toast } from "@/hooks/use-toast";


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

  // Effect to force re-render when descriptions change
  useEffect(() => {
    // This effect ensures that the UI updates when descriptions are added/removed
    // by creating a dependency on the description arrays
  }, [experiences.map(exp => exp.description?.length || 0).join(',')]);

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

    // Check daily API request limit
    if (hasReachedDailyLimit()) {
      toast({
        title: "Daily Request Limit Reached",
        description: `You have reached the daily limit of ${DAILY_REQUEST_LIMIT} AI requests. Please try again tomorrow.`,
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
    
    // Check daily API request limit
    if (hasReachedDailyLimit()) {
      toast({
        title: "Daily Request Limit Reached",
        description: `You have reached the daily limit of ${DAILY_REQUEST_LIMIT} AI requests. Please try again tomorrow.`,
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

      // Increment daily usage after successful API call
      incrementDailyUsage();

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
        <div className="@container">
          <div className={cn(
            "flex flex-col @[400px]:flex-row gap-2",
            "transition-all duration-300 ease-in-out"
          )}>
            <Button 
              variant="outline" 
              onClick={addExperience}
              className={cn(
                "flex-1 h-9 min-w-[120px]",
                "bg-gray-900/90 border-2 border-gray-800/70",
                "hover:from-cyan-500/10 hover:via-cyan-500/15 hover:to-blue-500/10",
                "border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/40",
                "text-cyan-400 hover:text-cyan-300",
                "transition-all duration-300",
                "rounded-xl backdrop-blur-sm",
                "whitespace-nowrap text-[11px] @[300px]:text-sm",
                "hover:bg-gray-900/95 hover:shadow-lg hover:shadow-cyan-500/10"
              )}
            >
              <Plus className="h-4 w-4 mr-2 shrink-0" />
              Add Work Experience
            </Button>

            <ImportFromProfileDialog<WorkExperience>
              profile={profile}
              onImport={handleImportFromProfile}
              type="work_experience"
              buttonClassName={cn(
                "flex-1 mb-0 h-9 min-w-[120px]",
                "whitespace-nowrap text-[11px] @[300px]:text-sm"
              )}
            />
          </div>
        </div>

        {(experiences || []).map((exp, index) => (
          <Card 
            key={index} 
            className={cn(
              "relative group transition-all duration-300",
              "bg-gray-900/95 border-2 border-gray-800",
              "hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/10",
              "shadow-sm backdrop-blur-sm",
              "hover:bg-gray-900/98"
            )}
          >
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-cyan-400/20 rounded-lg p-1.5 cursor-move shadow-sm backdrop-blur-sm border border-cyan-400/30">
                <GripVertical className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            
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
                        "text-sm font-semibold tracking-tight h-9",
                        "bg-gray-800/90 border-gray-700/70 rounded-lg",
                        "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20",
                        "hover:border-cyan-400/50 hover:bg-gray-800/95 transition-colors",
                        "placeholder:text-gray-500 border border-gray-700/70 text-white focus:bg-gray-800/95"
                      )}
                      placeholder="Position Title"
                    />
                    <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-cyan-400 border border-gray-700">
                      POSITION
                    </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="relative">
                    <Input
                      value={exp.company || ""}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className={cn(
                        "text-sm font-medium bg-gray-800/90 border-gray-700/70 rounded-lg h-9",
                        "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20",
                        "hover:border-cyan-400/50 hover:bg-gray-800/95 transition-colors",
                        "placeholder:text-gray-500 border border-gray-700/70 text-white focus:bg-gray-800/95"
                      )}
                      placeholder="Company Name"
                    />
                    <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-cyan-400 border border-gray-700">
                      COMPANY
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      value={exp.location || ""}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      className={cn(
                        "bg-gray-800/90 border-gray-700/70 rounded-lg h-9",
                        "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20",
                        "hover:border-cyan-400/50 hover:bg-gray-800/95 transition-colors",
                        "placeholder:text-gray-500 border border-gray-700/70 text-white focus:bg-gray-800/95"
                      )}
                      placeholder="Location"
                    />
                    <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-cyan-400 border border-gray-700">
                      LOCATION
                    </div>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="relative group">
                  <Input
                    type="text"
                    value={exp.date || ""}
                    onChange={(e) => updateExperience(index, 'date', e.target.value)}
                    className={cn(
                      "w-full bg-gray-800/90 border-gray-700/70 rounded-lg h-9",
                      "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20",
                      "hover:border-cyan-400/50 hover:bg-gray-800/95 transition-colors",
                      "placeholder:text-gray-500 border border-gray-700/70 text-white focus:bg-gray-800/95"
                    )}
                    placeholder="e.g., 'Jan 2023 - Present' or '2020 - 2022'"
                  />
                  <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-cyan-400 border border-gray-700">
                    DATE
                  </div>
                  <span className="ml-2 text-[8px] sm:text-[10px] text-gray-400">Use 'Present' in the date field for current positions</span>
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <Label className="text-[11px] md:text-xs font-medium text-cyan-400">
                    Key Responsibilities & Achievements
                  </Label>
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
                              "min-h-[60px] text-xs md:text-sm bg-gray-800/90 border-gray-700/70 rounded-lg",
                              "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20",
                              "hover:border-cyan-400/50 hover:bg-gray-800/95 transition-colors",
                              "placeholder:text-gray-500 border border-gray-700/70 text-white focus:bg-gray-800/95",
                              improvedPoints[index]?.[descIndex] && [
                                "border-purple-400",
                                "bg-gradient-to-r from-purple-900/30 to-indigo-900/30",
                                "shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]",
                                "hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-indigo-900/40"
                              ]
                            )}
                          />

                          {improvedPoints[index]?.[descIndex] && (
                            <div className="absolute -top-2.5 right-12 px-2 py-0.5 bg-purple-100 rounded-full">
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
                                      "w-72 p-3.5",
                                      "border-2 border-purple-300",
                                      "shadow-lg shadow-purple-100/50",
                                      "rounded-lg"
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
                      <div className="text-[11px] md:text-xs text-gray-400 border-2 border-dashed border-gray-700/60 italic px-4 py-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Plus className="h-3 w-3 text-cyan-400" />
                          <span>Add points to describe your project's features and achievements</span>
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
                        "flex-1 text-cyan-600 hover:text-cyan-400 transition-colors text-[10px] sm:text-xs",
                        "border-cyan-200/40 hover:border-cyan-300/60 hover:bg-cyan-50/10 bg-gray-800/50"
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
                        border: "border-gray-700/80",
                        hoverBorder: "hover:border-cyan-400/60",
                        hoverBg: "hover:bg-gray-800/90",
                        tooltipBg: "bg-gray-900/95 backdrop-blur-sm",
                        tooltipBorder: "border-2 border-gray-700/80",
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
        ))}
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
