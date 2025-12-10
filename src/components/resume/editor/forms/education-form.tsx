'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tiptap from "@/components/ui/tiptap";
import { Education, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { memo } from 'react';
import { ImportFromProfileDialog } from "../../management/dialogs/import-from-profile-dialog";


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
              "hover:from-indigo-400/10 hover:via-indigo-400/15 hover:to-blue-400/10",
              "border-2 border-dashed border-indigo-400/30 hover:border-indigo-400/40",
              "text-indigo-400 hover:text-indigo-300",
              "transition-all duration-300",
              "rounded-xl",
              "whitespace-nowrap text-[11px] @[300px]:text-sm"
            )}
            onClick={addEducation}
          >
            <Plus className="h-4 w-4 mr-2 shrink-0" />
            Add Education
          </Button>

          <ImportFromProfileDialog<Education>
            profile={profile}
            onImport={handleImportFromProfile}
            type="education"
            buttonClassName={cn(
              "flex-1 mb-0 h-9 min-w-[120px]",
              "whitespace-nowrap text-[11px] @[300px]:text-sm",
              "bg-gray-900 border-2 border-gray-800",
              "hover:from-indigo-400/10 hover:via-indigo-400/15 hover:to-blue-400/10",
              "border-2 border-dashed border-indigo-400/30 hover:border-indigo-400/40",
              "text-indigo-400 hover:text-indigo-300"
            )}
          />
        </div>
      </div>

      {(education || []).map((edu, index) => (
        <Card 
          key={index} 
          className={cn(
            "relative group transition-all duration-300",
            "bg-gray-900 border-2 border-gray-800",
            "hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-400/10",
            "shadow-sm"
          )}
        >
          <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3">
              {/* School Name and Delete Button Row */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="relative group flex-1 min-w-0">
                  <Input
                    value={edu.school || ''}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    className={cn(
                      "text-sm font-semibold h-9",
                      "bg-gray-800 border-gray-700 rounded-lg",
                      "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20",
                      "hover:border-indigo-400/50 hover:bg-gray-800/90 transition-colors",
                      "placeholder:text-gray-500 text-white focus:bg-gray-800"
                    )}
                    placeholder="Institution Name"
                  />
                  <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-indigo-400 border border-gray-700">
                    INSTITUTION
                  </div>
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
                    "h-9 bg-gray-800 border-gray-700 rounded-lg",
                    "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20",
                    "hover:border-indigo-500/30 hover:bg-gray-800/90 transition-colors",
                    "placeholder:text-gray-400 border border-gray-700 text-white focus:bg-gray-800",
                    "text-[10px] sm:text-xs"
                  )}
                  placeholder="City, Country"
                />
                <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-indigo-400 border border-gray-700">
                    LOCATION
                </div>
              </div>

              {/* Degree and Field Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="relative group">
                  <Input
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className={cn(
                      "h-9 bg-gray-800 border-gray-700 rounded-lg",
                      "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20",
                      "hover:border-indigo-400/50 hover:bg-gray-800/90 transition-colors",
                      "placeholder:text-gray-500 text-white focus:bg-gray-800",
                      "text-[10px] sm:text-xs"
                    )}
                    placeholder="Bachelor's, Master's, etc."
                  />
                  <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-indigo-400 border border-gray-700">
                    DEGREE
                  </div>
                </div>
                <div className="relative group">
                  <Input
                    value={edu.field || ''}
                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                    className={cn(
                      "h-9 bg-gray-800 border-gray-700 rounded-lg",
                      "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20",
                      "hover:border-indigo-400/50 hover:bg-gray-800/90 transition-colors",
                      "placeholder:text-gray-500 text-white focus:bg-gray-800",
                      "text-[10px] sm:text-xs"
                    )}
                    placeholder="Field of Study"
                  />
                  <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-indigo-400 border border-gray-700">
                    FIELD OF STUDY
                  </div>
                </div>
              </div>

              {/* Dates Row */}
              <div className="relative group">
                <Input
                  type="text"
                  value={edu.date || ''}
                  onChange={(e) => updateEducation(index, 'date', e.target.value)}
                  className={cn(
                    "w-full h-9 bg-gray-800 border-gray-700 rounded-lg",
                    "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20",
                    "hover:border-indigo-400/50 hover:bg-gray-800/90 transition-colors",
                    "placeholder:text-gray-500 text-white focus:bg-gray-800",
                    "text-[10px] sm:text-xs"
                  )}
                  placeholder="e.g., '2019 - 2023' or '2020 - Present'"
                />
                <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-indigo-400 border border-gray-700">
                  DATE
                </div>
              </div>

              {/* Current Status Note */}
              <div className="flex items-center space-x-2 -mt-1">
                <span className="text-[8px] sm:text-[10px] text-gray-400">Use &apos;Present&apos; in the date field for current education</span>
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
                    "h-9 bg-gray-800 border-gray-700 rounded-lg",
                    "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20",
                    "hover:border-indigo-500/30 hover:bg-gray-800/90 transition-colors",
                    "placeholder:text-gray-400 border border-gray-700 text-white focus:bg-gray-800",
                    "text-[10px] sm:text-xs"
                  )}
                  placeholder="0.00"
                />
                <div className="absolute -top-2 left-2 px-1 bg-gray-900 rounded-full text-[7px] sm:text-[9px] font-medium text-indigo-400 border border-gray-700">
                  GPA (OPTIONAL)
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <Label className="text-[10px] sm:text-xs font-medium text-indigo-400">Achievements & Activities</Label>
                  <span className="text-[8px] sm:text-[10px] text-gray-400">One achievement per line</span>
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
                    "min-h-[120px] bg-gray-800 border-gray-700 rounded-lg",
                    "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20",
                    "hover:border-indigo-400/50 hover:bg-gray-800/90 transition-colors",
                    "placeholder:text-gray-500 text-white focus:bg-gray-800",
                    "text-[10px] sm:text-xs"
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}, areEducationPropsEqual);
