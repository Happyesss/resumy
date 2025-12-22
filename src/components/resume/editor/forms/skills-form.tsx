'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, Skill } from "@/lib/types";
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
import { KeyboardEvent, useMemo, useState } from 'react';
import { ImportFromProfileDialog } from "../../management/dialogs/import-from-profile-dialog";
import { SortableItem } from "../components/sortable-item";

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  profile: Profile;
}

export function SkillsForm({
  skills,
  onChange,
  profile
}: SkillsFormProps) {
  const [newSkills, setNewSkills] = useState<{ [key: number]: string }>({});

  // Create stable IDs for drag and drop
  const skillIds = useMemo(() => 
    skills.map((_, index) => `skill-${index}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skills.length]
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
      const oldIndex = skillIds.indexOf(active.id as string);
      const newIndex = skillIds.indexOf(over.id as string);
      const reordered = arrayMove(skills, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  const addSkillCategory = () => {
    onChange([{
      category: "",
      items: []
    }, ...skills]);
  };

  const updateSkillCategory = (index: number, field: keyof Skill, value: string | string[]) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkillCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const addSkill = (categoryIndex: number) => {
    const skillToAdd = newSkills[categoryIndex]?.trim();
    if (!skillToAdd) return;

    const updated = [...skills];
    const currentItems = updated[categoryIndex].items || [];
    if (!currentItems.includes(skillToAdd)) {
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        items: [...currentItems, skillToAdd]
      };
      onChange(updated);
    }
    setNewSkills({ ...newSkills, [categoryIndex]: '' });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, categoryIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(categoryIndex);
    }
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = skills.map((skill, idx) => {
      if (idx === categoryIndex) {
        return {
          ...skill,
          items: skill.items.filter((_, i) => i !== skillIndex)
        };
      }
      return skill;
    });
    onChange(updated);
  };

  const handleImportFromProfile = (importedSkills: Skill[]) => {
    onChange([...importedSkills, ...skills]);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className={cn(
            "flex-1 h-9",
            "bg-gradient-to-r from-rose-500/5 to-pink-500/5",
            "border border-dashed border-rose-500/30 hover:border-rose-500/50",
            "hover:from-rose-500/10 hover:to-pink-500/10",
            "text-rose-400 hover:text-rose-300",
            "transition-all duration-200",
            "rounded-xl",
            "text-[11px] sm:text-xs font-medium",
            "hover:shadow-lg hover:shadow-rose-500/10"
          )}
          onClick={addSkillCategory}
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
          <span className="hidden xs:inline">Add Category</span>
          <span className="xs:hidden">Add</span>
        </Button>

        <ImportFromProfileDialog<Skill>
          profile={profile}
          onImport={handleImportFromProfile}
          type="skills"
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
          items={skillIds}
          strategy={verticalListSortingStrategy}
        >
          {skills.map((skill, index) => (
            <SortableItem key={skillIds[index]} id={skillIds[index]} accentColor="rose">
              <Card 
                className={cn(
                  "relative transition-all duration-200",
                  "bg-zinc-900/50 border border-zinc-800/80",
                  "hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/5",
                  "rounded-2xl"
                )}
              >
                <CardContent className="p-4 sm:p-5 space-y-4">
                  <div className="space-y-4">
                    {/* Category Name and Delete Button Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative group flex-1">
                        <Input
                          value={skill.category}
                          onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                          className={cn(
                            "text-sm font-medium h-12 pl-4 pr-4",
                            "bg-zinc-900/50 border-zinc-800 rounded-xl",
                            "focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20",
                            "hover:border-zinc-700 hover:bg-zinc-900/70",
                            "transition-all duration-200",
                            "placeholder:text-zinc-600 text-white"
                          )}
                          placeholder="Category Name"
                        />
                        <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Category
                        </Label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeSkillCategory(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

              {/* Skills Display */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className={cn(
                        "bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-rose-500/30 py-0.5",
                        "transition-all duration-300 group/badge cursor-default text-[10px] sm:text-xs"
                      )}
                    >
                      {item}
                      <button
                        onClick={() => removeSkill(index, skillIndex)}
                        className="ml-1.5 hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* New Skill Input */}
                <div className="relative group flex gap-2">
                  <Input
                    value={newSkills[index] || ''}
                    onChange={(e) => setNewSkills({ ...newSkills, [index]: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    className={cn(
                      "h-12 bg-zinc-900/50 border-zinc-800 rounded-xl",
                      "focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20",
                      "hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors",
                      "placeholder:text-zinc-600 border border-zinc-800 text-white focus:bg-zinc-900/70",
                      "text-sm"
                    )}
                    placeholder="Type a skill and press Enter or click +"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(index)}
                    className="h-12 px-3 bg-zinc-900/50 hover:bg-zinc-900/90 border-rose-500/40 hover:border-rose-500/60"
                  >
                    <Plus className="h-4 w-4 text-rose-400" />
                  </Button>
                  <Label className="absolute -top-2.5 left-3 px-2 py-0.5 bg-zinc-900 rounded-md text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Add Skill
                  </Label>
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
  );
} 
