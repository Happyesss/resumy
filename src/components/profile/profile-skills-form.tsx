'use client';

import { Skill } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

interface ProfileSkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function ProfileSkillsForm({ skills, onChange }: ProfileSkillsFormProps) {
  const addSkill = () => {
    onChange([
      ...skills,
      {
        category: "",
        items: []
      }
    ]);
  };

  const updateSkill = (index: number, field: keyof Skill, value: Skill[typeof field]) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  // Local input state for comma-separated items
  const [skillInputs, setSkillInputs] = React.useState<{ [key: number]: string }>(
    Object.fromEntries(skills.map((s, i) => [i, s.items?.join(', ') || '']))
  );

  // Reset local inputs only when category count changes
  React.useEffect(() => {
    setSkillInputs(
      Object.fromEntries(
        skills.map((s, i) => [i, s.items?.join(', ') || ''])
      )
    );
  }, [skills.length]);

  return (
    <div className="space-y-3">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={skills.map((_, index) => `skill-${index}`)}
      >
        {skills.map((skill, index) => (
          <AccordionItem
            key={index}
            value={`skill-${index}`}
            className="bg-gray-900 border-2 border-gray-800 hover:border-purple-400/40 hover:shadow-lg transition-all duration-300 shadow-sm rounded-md overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-purple-400">
                  {skill.category || "New Skill Category"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {skill.items && skill.items.length > 0 && (
                    <span className="max-w-[300px] truncate">
                      {skill.items.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4">
                {/* Category and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative group flex-1">
                    <Input
                      value={skill.category}
                      onChange={(e) => updateSkill(index, 'category', e.target.value)}
                      className="text-base bg-gray-800 border-gray-700 rounded-md h-8
                        focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 focus:bg-gray-800
                        hover:border-purple-400/50 hover:bg-gray-800/90 transition-colors
                        placeholder:text-gray-500 text-white"
                      placeholder="e.g., Programming Languages, Frameworks, Tools"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-gray-900 rounded-full text-[9px] font-medium text-purple-400 border border-gray-700">
                      CATEGORY
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300 h-8 w-8"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Skills Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-purple-400 rounded-full">Skills</Label>
                    <span className="text-[9px] text-gray-400">Separate with commas</span>
                  </div>
                  <Input
                    value={skillInputs[index] || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSkillInputs(prev => ({ ...prev, [index]: newValue }));
                      const items = newValue
                        .split(',')
                        .map(t => t.trim())
                        .filter(Boolean);
                      updateSkill(index, 'items', items);
                    }}
                    onBlur={(e) => {
                      const items = e.target.value
                        .split(',')
                        .map(t => t.trim())
                        .filter(Boolean);
                      setSkillInputs(prev => ({
                        ...prev,
                        [index]: items.join(', ')
                      }));
                    }}
                    placeholder="e.g., TypeScript, React, Node.js, AWS"
                    className="bg-gray-800 border-gray-700 rounded-md h-8
                      focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 focus:bg-gray-800
                      hover:border-purple-400/50 hover:bg-gray-800/90 transition-colors
                      placeholder:text-gray-500 text-sm text-white"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button 
        variant="outline" 
        onClick={addSkill}
        className="w-full bg-gray-900 hover:bg-gray-800 border-dashed border-gray-800 hover:border-purple-400/40 text-purple-400 hover:text-purple-500 transition-all duration-300 h-8 text-sm"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Skill Category
      </Button>
    </div>
  );
}
