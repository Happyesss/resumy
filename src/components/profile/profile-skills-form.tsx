'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skill } from "@/lib/types";
import { Plus, Trash2, X } from "lucide-react";
import React from "react";

interface ProfileSkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function ProfileSkillsForm({ skills, onChange }: ProfileSkillsFormProps) {
  const [newSkillInputs, setNewSkillInputs] = React.useState<{ [key: number]: string }>({});

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

  const addSkillItem = (categoryIndex: number, item: string) => {
    if (!item.trim()) return;
    const updated = [...skills];
    const currentItems = updated[categoryIndex].items || [];
    // Prevent duplicates
    if (!currentItems.includes(item.trim())) {
      updated[categoryIndex].items = [...currentItems, item.trim()];
      onChange(updated);
    }
    // Clear the input
    setNewSkillInputs(prev => ({ ...prev, [categoryIndex]: '' }));
  };

  const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
    const updated = [...skills];
    updated[categoryIndex].items = updated[categoryIndex].items?.filter((_, i) => i !== itemIndex) || [];
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, categoryIndex: number) => {
    const value = newSkillInputs[categoryIndex] || '';
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkillItem(categoryIndex, value);
    }
  };

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
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-zinc-200">
                  {skill.category || "New Skill Category"}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {skill.items && skill.items.length > 0 && (
                    <span className="bg-zinc-800 px-2 py-0.5 rounded-full">
                      {skill.items.length} skill{skill.items.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4 border-t border-zinc-800">
                {/* Category and Delete Button Row */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Category</Label>
                    <Input
                      value={skill.category}
                      onChange={(e) => updateSkill(index, 'category', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="e.g., Programming Languages, Frameworks, Tools"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-6 h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Skills Tags Display */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-zinc-500">Skills</Label>
                  
                  {/* Tags Container */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                    {skill.items && skill.items.length > 0 ? (
                      skill.items.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 
                            bg-emerald-500/10 border border-emerald-500/30 
                            text-emerald-400 text-sm font-medium rounded-full
                            hover:bg-emerald-500/20 transition-colors group"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeSkillItem(index, itemIndex)}
                            className="p-0.5 rounded-full hover:bg-emerald-500/30 
                              text-emerald-400/70 hover:text-emerald-300 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-600 text-sm italic">No skills added yet</span>
                    )}
                  </div>

                  {/* Add New Skill Input */}
                  <div className="flex gap-2">
                    <Input
                      value={newSkillInputs[index] || ''}
                      onChange={(e) => setNewSkillInputs(prev => ({ ...prev, [index]: e.target.value }))}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="Type a skill and press Enter"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkillItem(index, newSkillInputs[index] || '')}
                      className="h-10 px-4 bg-emerald-500/10 border-emerald-500/30 
                        text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50
                        hover:text-emerald-300 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-zinc-600">Press Enter or comma to add a skill</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button 
        variant="outline" 
        onClick={addSkill}
        className="w-full bg-zinc-900/30 hover:bg-zinc-800/50 border-dashed border-zinc-700 hover:border-zinc-600 
          text-zinc-400 hover:text-zinc-200 transition-colors h-10"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Skill Category
      </Button>
    </div>
  );
}
