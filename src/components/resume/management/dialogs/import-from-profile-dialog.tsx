'use client';

import { WorkExperience, Project, Profile, Education, Skill } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Import } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type ImportItem = WorkExperience | Project | Education | Skill;

interface ImportFromProfileDialogProps<T extends ImportItem> {
  profile: Profile;
  onImport: (items: T[]) => void;
  type: 'work_experience' | 'projects' | 'education' | 'skills';
  buttonClassName?: string;
}

export function ImportFromProfileDialog<T extends ImportItem>({ 
  profile, 
  onImport, 
  type,
  buttonClassName 
}: ImportFromProfileDialogProps<T>) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const items = type === 'work_experience' 
    ? profile.work_experience 
    : type === 'projects'
    ? profile.projects
    : type === 'education'
    ? profile.education
    : profile.skills;

  const title = type === 'work_experience' 
    ? 'Work Experience' 
    : type === 'projects'
    ? 'Projects'
    : type === 'education'
    ? 'Education'
    : 'Skills';

  const handleImport = () => {
    const itemsToImport = items.filter((item) => {
      const id = getItemId(item);
      return selectedItems.includes(id);
    }) as T[];
    
    onImport(itemsToImport);
    setOpen(false);
    setSelectedItems([]);
  };

  const getItemId = (item: ImportItem): string => {
    if (type === 'work_experience') {
      const exp = item as WorkExperience;
      return `${exp.company}-${exp.position}-${exp.date}`;
    } else if (type === 'projects') {
      return (item as Project).name;
    } else if (type === 'education') {
      const edu = item as Education;
      return `${edu.school}-${edu.degree}-${edu.field}`;
    } else {
      return (item as Skill).category;
    }
  };

  const getItemTitle = (item: ImportItem): string => {
    if (type === 'work_experience') {
      return (item as WorkExperience).position;
    } else if (type === 'projects') {
      return (item as Project).name;
    } else if (type === 'education') {
      const edu = item as Education;
      return `${edu.degree} in ${edu.field}`;
    } else {
      return (item as Skill).category;
    }
  };

  const getItemSubtitle = (item: ImportItem): string | null => {
    if (type === 'work_experience') {
      return (item as WorkExperience).company;
    } else if (type === 'projects') {
      return ((item as Project).technologies || []).join(', ');
    } else if (type === 'education') {
      return (item as Education).school;
    } else {
      return null;
    }
  };

  const getItemDate = (item: ImportItem): string => {
    if (type === 'work_experience') {
      const exp = item as WorkExperience;
      return exp.date;
    } else if (type === 'projects') {
      const proj = item as Project;
      return proj.date || '';
    } else if (type === 'education') {
      const edu = item as Education;
      return edu.date;
    }
    return '';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "mb-6 w-full h-16",
            "bg-gradient-to-r from-purple-500/5 via-purple-500/10 to-teal-500/5",
            "hover:from-purple-500/10 hover:via-purple-500/15 hover:to-teal-500/10",
            "border-2 border-dashed border-purple-500/30 hover:border-purple-500/40",
            "text-purple-400 hover:text-purple-300",
            "transition-all duration-300",
            "rounded-xl",
            "shadow-sm hover:shadow-lg hover:shadow-purple-500/10",
            buttonClassName
          )}
        >
          <Import className="h-5 w-5 mr-2" />
          Import from Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-gray-900 border-gray-800">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-white">
            Select the {title.toLowerCase()} you want to import from your profile
          </DialogTitle>
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-400">
              {items.length} {title.toLowerCase()} available
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedItems.length === items.length) {
                  setSelectedItems([]);
                } else {
                  setSelectedItems(items.map(item => getItemId(item)));
                }
              }}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs"
            >
              {selectedItems.length === items.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] mt-4 pr-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Import className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-gray-400 mb-2">No {title.toLowerCase()} found</div>
              <div className="text-sm text-gray-500">
                Add some {title.toLowerCase()} to your profile first to import them here.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const id = getItemId(item);
                const isSelected = selectedItems.includes(id);
                return (
                  <div
                    key={id}
                    className={cn(
                      "flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer group",
                      "hover:shadow-lg hover:shadow-purple-500/10",
                      isSelected 
                        ? "border-purple-400 bg-purple-500/10 shadow-md shadow-purple-500/20" 
                        : "border-gray-700 bg-gray-800/50 hover:border-purple-400/50 hover:bg-gray-800/80"
                    )}
                    onClick={() => {
                      setSelectedItems(prev =>
                        isSelected
                          ? prev.filter(x => x !== id)
                          : [...prev, id]
                      );
                    }}
                  >
                    <Checkbox
                      id={id}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        setSelectedItems(prev =>
                          checked
                            ? [...prev, id]
                            : prev.filter(x => x !== id)
                        );
                      }}
                      className={cn(
                        "mt-1 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
                        "border-gray-600 hover:border-purple-400"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-base mb-1 group-hover:text-purple-300 transition-colors">
                            {getItemTitle(item)}
                          </div>
                          {getItemSubtitle(item) && (
                            <div className="text-sm text-blue-400 mb-1">
                              {getItemSubtitle(item)}
                            </div>
                          )}
                          {getItemDate(item) && (
                            <div className="text-xs text-gray-400 font-mono">
                              {getItemDate(item)}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                      {type === 'skills' && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {(item as Skill).items.slice(0, 6).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-gray-700 text-gray-300 border border-gray-600 text-xs px-2 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {(item as Skill).items.length > 6 && (
                            <Badge variant="secondary" className="bg-gray-700 text-gray-400 border border-gray-600 text-xs px-2 py-1">
                              +{(item as Skill).items.length - 6} more
                            </Badge>
                          )}
                        </div>
                      )}
                      {type === 'work_experience' && (item as WorkExperience).technologies && (item as WorkExperience).technologies!.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(item as WorkExperience).technologies!.slice(0, 4).map((tech, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-teal-500/10 text-teal-400 border-teal-500/30 text-xs px-2 py-0.5"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {(item as WorkExperience).technologies!.length > 4 && (
                            <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/30 text-xs px-2 py-0.5">
                              +{(item as WorkExperience).technologies!.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                      {type === 'projects' && (item as Project).technologies && (item as Project).technologies!.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(item as Project).technologies!.slice(0, 4).map((tech, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs px-2 py-0.5"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {(item as Project).technologies!.length > 4 && (
                            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs px-2 py-0.5">
                              +{(item as Project).technologies!.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-400">
              {selectedItems.length > 0 && (
                <span>{selectedItems.length} item{selectedItems.length === 1 ? '' : 's'} selected</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={selectedItems.length === 0 || items.length === 0}
                className={cn(
                  "transition-all duration-200",
                  selectedItems.length === 0 || items.length === 0
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-purple-500/25"
                )}
              >
                <Import className="h-4 w-4 mr-2" />
                Import Selected
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}