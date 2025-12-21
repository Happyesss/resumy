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
import { WorkExperience } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface ProfileWorkExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export function ProfileWorkExperienceForm({ experiences, onChange }: ProfileWorkExperienceFormProps) {
  const addExperience = () => {
    onChange([...experiences, {
      company: "",
      position: "",
      location: "",
      date: "",
      description: [],
      technologies: []
    }]);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | string[]) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const [techInputs, setTechInputs] = React.useState<{ [key: number]: string }>(
    Object.fromEntries(experiences.map((exp, i) => [i, exp.technologies?.join(', ') || '']))
  );

  React.useEffect(() => {
    setTechInputs(Object.fromEntries(
      experiences.map((exp, i) => [i, exp.technologies?.join(', ') || ''])
    ));
  }, [experiences]);

  return (
    <div className="space-y-3">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={experiences.map((_, index) => `experience-${index}`)}
      >
        {experiences.map((exp, index) => (
          <AccordionItem
            key={index}
            value={`experience-${index}`}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-zinc-200">
                  {exp.position || "Untitled Position"} {exp.company && <span className="text-zinc-400 font-normal">at {exp.company}</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {exp.date && <span>{exp.date}</span>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4 border-t border-zinc-800">
                {/* Position and Delete Button Row */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="Position Title"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-6 h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-500">Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                      focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                      hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                      placeholder:text-zinc-600"
                    placeholder="Company Name"
                  />
                </div>

                {/* Date and Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Date</Label>
                    <Input
                      type="text"
                      value={exp.date}
                      onChange={(e) => updateExperience(index, 'date', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="e.g., Jan 2023 - Present"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="e.g., Vancouver, BC"
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-zinc-500">Technologies & Skills</Label>
                    <span className="text-[10px] text-zinc-600">Separate with commas</span>
                  </div>
                  <Input
                    value={techInputs[index] || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setTechInputs(prev => ({ ...prev, [index]: newValue }));
                      
                      if (newValue.endsWith(',')) {
                        const technologies = newValue
                          .split(',')
                          .map(t => t.trim())
                          .filter(Boolean);
                        updateExperience(index, 'technologies', technologies);
                      } else {
                        const technologies = newValue
                          .split(',')
                          .map(t => t.trim())
                          .filter(Boolean);
                        updateExperience(index, 'technologies', technologies);
                      }
                    }}
                    onBlur={(e) => {
                      const technologies = e.target.value
                        .split(',')
                        .map(t => t.trim())
                        .filter(Boolean);
                      updateExperience(index, 'technologies', technologies);
                      setTechInputs(prev => ({ 
                        ...prev, 
                        [index]: technologies.join(', ') 
                      }));
                    }}
                    placeholder="React, TypeScript, Node.js, etc."
                    className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                      focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                      hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                      placeholder:text-zinc-600"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-purple-400 rounded-full">Key Responsibilities & Achievements</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = [...experiences];
                        updated[index].description = [...updated[index].description, ""];
                        onChange(updated);
                      }}
                      className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors h-8 text-xs px-3"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Point
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {exp.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            value={desc}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].description[descIndex] = e.target.value;
                              onChange(updated);
                            }}
                            placeholder="Start with a strong action verb"
                            className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                              focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                              hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                              placeholder:text-zinc-600"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...experiences];
                            updated[index].description = updated[index].description.filter((_, i) => i !== descIndex);
                            onChange(updated);
                          }}
                          className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {exp.description.length === 0 && (
                      <div className="text-xs text-zinc-500 italic py-2">
                        Add points to describe your responsibilities and achievements
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button 
        variant="outline" 
        onClick={addExperience}
        className="w-full bg-zinc-900/30 hover:bg-zinc-800/50 border-dashed border-zinc-700 hover:border-zinc-600 
          text-zinc-400 hover:text-zinc-200 transition-colors h-10"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Work Experience
      </Button>
    </div>
  );
}