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
import { Textarea } from "@/components/ui/textarea";
import { Education } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

interface ProfileEducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function ProfileEducationForm({ education, onChange }: ProfileEducationFormProps) {
  const addEducation = () => {
    onChange([...education, {
      school: "",
      degree: "",
      field: "",
      location: "",
      date: "",
      gpa: undefined,
      achievements: []
    }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: Education[typeof field]) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={education.map((_, index) => `education-${index}`)}
      >
        {education.map((edu, index) => (
          <AccordionItem
            key={index}
            value={`education-${index}`}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-zinc-200">
                  {edu.degree ? `${edu.degree} ` : ''}{edu.field ? <span className="text-zinc-400 font-normal">in {edu.field} </span> : ''}{edu.school ? <span className="text-zinc-400 font-normal">at {edu.school}</span> : 'New Education'}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {edu.date && <span>{edu.date}</span>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4 border-t border-zinc-800">
                {/* School Name and Delete Button Row */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Institution</Label>
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="Institution Name"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-6 h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-500">Location</Label>
                  <Input
                    value={edu.location}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                      focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
                      hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
                      placeholder:text-zinc-600"
                    placeholder="City, Country"
                  />
                </div>

                {/* Degree and Field Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="Bachelor's, Master's, etc."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Field of Study</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="Field of Study"
                    />
                  </div>
                </div>

                {/* Date and GPA Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Date</Label>
                    <Input
                      type="text"
                      value={edu.date}
                      onChange={(e) => updateEducation(index, 'date', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="e.g., 2019 - 2023"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">GPA (Optional)</Label>
                    <Input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(index, 'gpa', e.target.value || undefined)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-zinc-500">Achievements & Activities</Label>
                    <span className="text-[10px] text-zinc-600">One per line</span>
                  </div>
                  <Textarea
                    value={edu.achievements?.join('\n') || ''}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n');
                      const achievements = lines.length === 1 && lines[0] === '' ? [] : lines;
                      updateEducation(index, 'achievements', achievements);
                    }}
                    placeholder="• Dean's List 2020-2021&#10;• President of Computer Science Club&#10;• First Place in Hackathon 2022"
                    className="min-h-[100px] bg-zinc-900/50 border-zinc-800 text-zinc-100
                      focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900/70
                      hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors
                      placeholder:text-zinc-600 resize-none"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button 
        variant="outline" 
        onClick={addEducation}
        className="w-full bg-zinc-900/30 hover:bg-zinc-800/50 border-dashed border-zinc-700 hover:border-zinc-600 
          text-zinc-400 hover:text-zinc-200 transition-colors h-10"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}