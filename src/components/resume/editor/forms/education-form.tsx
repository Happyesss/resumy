'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tiptap from "@/components/ui/tiptap";
import { Education, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
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
import { Plus, Trash2 } from "lucide-react";
import { memo, useMemo } from 'react';
import { ImportFromProfileDialog } from "../../management/dialogs/import-from-profile-dialog";
import { SortableItem } from "../components/sortable-item";


interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
  profile: Profile;
}

function areEducationPropsEqual(
  prevProps: EducationFormProps,
  nextProps: EducationFormProps
) {
  return (
    JSON.stringify(prevProps.education) === JSON.stringify(nextProps.education) &&
    prevProps.profile.id === nextProps.profile.id
  );
}

export const EducationForm = memo(function EducationFormComponent({
  education = [],
  onChange,
  profile
}: EducationFormProps) {
  // Create stable IDs for drag and drop
  const educationIds = useMemo(() => 
    education.map((_, index) => `education-${index}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [education.length]
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
      const oldIndex = educationIds.indexOf(active.id as string);
      const newIndex = educationIds.indexOf(over.id as string);
      const reordered = arrayMove(education, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  const addEducation = () => {
    onChange([{
      school: "",
      degree: "",
      field: "",
      location: "",
      date: "",
      gpa: undefined,
      achievements: []
    }, ...(education || [])]);
  };

  const updateEducation = (index: number, field: keyof Education, value: Education[keyof Education]) => {
    const updated = [...(education || [])];
    if (!updated[index]) {
      updated[index] = {
        school: "",
        degree: "",
        field: "",
        location: "",
        date: "",
        gpa: undefined,
        achievements: []
      };
    }
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange((education || []).filter((_, i) => i !== index));
  };

  const handleImportFromProfile = (importedEducation: Education[]) => {
    onChange([...(importedEducation || []), ...(education || [])]);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className={cn(
            "flex-1 h-9",
            "bg-gradient-to-r from-cyan-500/5 to-sky-500/5",
            "border border-dashed border-cyan-500/30 hover:border-cyan-500/50",
            "hover:from-cyan-500/10 hover:to-sky-500/10",
            "text-cyan-400 hover:text-cyan-300",
            "transition-all duration-200",
            "rounded-xl",
            "text-[11px] sm:text-xs font-medium",
            "hover:shadow-lg hover:shadow-cyan-500/10"
          )}
          onClick={addEducation}
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
          <span className="hidden xs:inline">Add Education</span>
          <span className="xs:hidden">Add</span>
        </Button>

        <ImportFromProfileDialog<Education>
          profile={profile}
          onImport={handleImportFromProfile}
          type="education"
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
          items={educationIds}
          strategy={verticalListSortingStrategy}
        >
          {(education || []).map((edu, index) => (
            <SortableItem key={educationIds[index]} id={educationIds[index]} accentColor="cyan">
              <Card 
                className={cn(
                  "relative transition-all duration-200",
                  "bg-zinc-900/50 border border-zinc-800/80",
                  "hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5",
                  "rounded-2xl"
                )}
              >
                <CardContent className="p-4 sm:p-5 space-y-4">
                  <div className="space-y-4">
                    {/* School Name and Delete Button Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative group flex-1 min-w-0">
                        <Input
                          value={edu.school || ''}
                          onChange={(e) => updateEducation(index, 'school', e.target.value)}
                          className={cn(
                            "text-sm font-semibold h-12 pl-4 pr-4",
                            "bg-zinc-900/50 border-zinc-800 rounded-xl",
                            "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                            "hover:border-zinc-700 hover:bg-zinc-900/70",
                            "transition-all duration-200",
                            "placeholder:text-zinc-600 text-white"
                          )}
                          placeholder="Institution Name"
                        />
                        <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Institution
                        </Label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeEducation(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Location */}
                    <div className="relative group">
                      <Input
                  value={edu.location || ''}
                  onChange={(e) => updateEducation(index, 'location', e.target.value)}
                  className={cn(
                    "h-12 bg-zinc-900/50 border-zinc-800 rounded-xl",
                    "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                    "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                    "placeholder:text-zinc-600 border border-zinc-800 text-white focus:bg-zinc-900/70",
                    "text-sm"
                  )}
                  placeholder="City, Country"
                />
                <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Location
                </Label>
              </div>

              {/* Degree and Field Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <Input
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className={cn(
                      "h-12 bg-zinc-900/50 border-zinc-800 rounded-xl",
                      "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                      "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                      "placeholder:text-zinc-600 text-white focus:bg-zinc-900/70",
                      "text-sm"
                    )}
                    placeholder="Bachelor's, Master's, etc."
                  />
                  <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Degree
                  </Label>
                </div>
                <div className="relative group">
                  <Input
                    value={edu.field || ''}
                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                    className={cn(
                      "h-12 bg-zinc-900/50 border-zinc-800 rounded-xl",
                      "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                      "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                      "placeholder:text-zinc-600 text-white focus:bg-zinc-900/70",
                      "text-sm"
                    )}
                    placeholder="Field of Study"
                  />
                  <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Field of Study
                  </Label>
                </div>
              </div>

              {/* Dates Row */}
              <div className="relative group">
                <Input
                  type="text"
                  value={edu.date || ''}
                  onChange={(e) => updateEducation(index, 'date', e.target.value)}
                  className={cn(
                    "w-full h-12 bg-zinc-900/50 border-zinc-800 rounded-xl",
                    "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                    "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                    "placeholder:text-zinc-600 text-white focus:bg-zinc-900/70",
                    "text-sm"
                  )}
                  placeholder="e.g., '2019 - 2023' or '2020 - Present'"
                />
                <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Date
                </Label>
              </div>

              {/* Current Status Note */}
              <div className="flex items-center space-x-2 -mt-1">
                <span className="text-[10px] text-zinc-500">Use &apos;Present&apos; in the date field for current education</span>
              </div>

              {/* GPA */}
              <div className="relative group w-full sm:w-1/2 lg:w-1/3">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={cn(
                    "h-12 bg-zinc-900/50 border-zinc-800 rounded-xl",
                    "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                    "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                    "placeholder:text-zinc-600 border border-zinc-800 text-white focus:bg-zinc-900/70",
                    "text-sm"
                  )}
                  placeholder="0.00"
                />
                <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  GPA (Optional)
                </Label>
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                    <Label className="text-xs font-semibold text-cyan-400">Achievements & Activities</Label>
                  </div>
                  <span className="text-[10px] text-zinc-500">One achievement per line</span>
                </div>
                <Tiptap
                  content={(edu.achievements || []).join('\n\n') || ''}
                  onChange={(newContent) => {
                    // Process the content into achievements array
                    const achievements = newContent
                      .split(/\n\s*\n/) // Split on double newlines
                      .map(line => line.replace(/\n/g, ' ').trim()) // Replace single newlines with spaces
                      .filter(line => line.length > 0); // Remove empty lines
                    
                    updateEducation(index, 'achievements', achievements);
                  }}
                  editorProps={{
                    attributes: {
                      placeholder: "• Dean's List 2020-2021\n\n• President of Computer Science Club\n\n• First Place in Hackathon 2022"
                    }
                  }}
                  className={cn(
                    "min-h-[120px] bg-zinc-900/50 border-zinc-800 rounded-xl",
                    "focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20",
                    "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                    "placeholder:text-zinc-600 text-white focus:bg-zinc-900/70",
                    "text-sm"
                  )}
                />
              </div>
            </div>
                </CardContent>
              </Card>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}, areEducationPropsEqual);
