'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Profile, Skill } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { KeyboardEvent, useState } from 'react';
import { ImportFromProfileDialog } from "../../management/dialogs/import-from-profile-dialog";

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
      <div className="@container">
        <div className={cn(
          "flex flex-col @[400px]:flex-row gap-2",
          "transition-all duration-300 ease-in-out"
        )}>
          <Button 
            variant="outline" 
            className={cn(
              "flex-1 h-9 min-w-[120px]",
              "bg-gray-900 border-2 border-gray-800",
              "hover:from-rose-500/10 hover:via-rose-500/15 hover:to-pink-500/10",
              "border-2 border-dashed border-rose-400/30 hover:border-rose-400/40",
              "text-rose-400 hover:text-rose-300",
              "transition-all duration-300",
              "rounded-xl",
              "whitespace-nowrap text-[11px] @[300px]:text-sm"
            )}
            onClick={addSkillCategory}
          >
            <Plus className="h-4 w-4 mr-2 shrink-0" />
            Add Skill Category
          </Button>

          <ImportFromProfileDialog<Skill>
            profile={profile}
            onImport={handleImportFromProfile}
            type="skills"
            buttonClassName={cn(
              "flex-1 mb-0 h-9 min-w-[120px]",
              "whitespace-nowrap text-[11px] @[300px]:text-sm",
              "bg-gray-900 border-2 border-gray-800",
              "hover:from-rose-500/10 hover:via-rose-500/15 hover:to-pink-500/10",
              "border-2 border-dashed border-rose-400/30 hover:border-rose-400/40",
              "text-rose-400 hover:text-rose-300"
            )}
          />
        </div>
      </div>

      {skills.map((skill, index) => (
        <Card 
          key={index} 
          className={cn(
            "relative group transition-all duration-300",
            "bg-gray-900 border-2 border-gray-800",
            "hover:border-rose-400/40 hover:shadow-lg hover:shadow-rose-400/10",
            "shadow-sm"
          )}
        >
          <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3">
              {/* Category Name and Delete Button Row */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="relative group flex-1">
                  <Input
                    value={skill.category}
                    onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                    className={cn(
                      "text-sm font-medium h-9",
                      "bg-gray-800 border-gray-700 rounded-lg",
                      "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20",
                      "hover:border-rose-400/50 hover:bg-gray-800/90 transition-colors",
                      "placeholder:text-gray-400 border border-gray-700 text-white focus:bg-gray-800"
                    )}
                    placeholder="Category Name"
                  />
                  <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-rose-400 border border-gray-700">
                    CATEGORY
                  </div>
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
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className={cn(
                        "bg-gray-800 hover:bg-gray-700 text-rose-400 border border-gray-600 py-0.5",
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
                      "h-9 bg-gray-800 border-gray-700 rounded-lg",
                      "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20",
                      "hover:border-rose-400/50 hover:bg-gray-800/90 transition-colors",
                      "placeholder:text-gray-400 border border-gray-700 text-white focus:bg-gray-800",
                      "text-[10px] sm:text-xs"
                    )}
                    placeholder="Type a skill and press Enter or click +"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(index)}
                    className="h-9 px-2 bg-gray-800 hover:bg-gray-700 border-gray-600"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </Button>
                  <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-rose-400 border border-gray-700">
                    ADD SKILL
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 
