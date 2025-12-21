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
import { Project } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface ProfileProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProfileProjectsForm({ projects, onChange }: ProfileProjectsFormProps) {
  const [techInputs, setTechInputs] = React.useState<{ [key: number]: string }>(
    Object.fromEntries(projects.map((p, i) => [i, p.technologies?.join(', ') || '']))
  );

  React.useEffect(() => {
    setTechInputs(Object.fromEntries(
      projects.map((p, i) => [i, p.technologies?.join(', ') || ''])
    ));
  }, [projects]);

  const addProject = () => {
    onChange([...projects, {
      name: "",
      description: [],
      technologies: [],
      url: "",
      github_url: "",
      date: ""
    }]);
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={projects.map((_, index) => `project-${index}`)}
      >
        {projects.map((project, index) => (
          <AccordionItem
            key={index}
            value={`project-${index}`}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-zinc-200">
                  {project.name || "Untitled Project"}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {project.date && <span>{project.date}</span>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4 border-t border-zinc-800">
                {/* Project Name and Delete Button Row */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Project Name</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="Project Name"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-6 h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* URLs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Live URL</Label>
                    <Input
                      type="url"
                      value={project.url || ''}
                      onChange={(e) => updateProject(index, 'url', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="https://your-project.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">GitHub URL</Label>
                    <Input
                      type="url"
                      value={project.github_url || ''}
                      onChange={(e) => updateProject(index, 'github_url', e.target.value)}
                      className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                        hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                        placeholder:text-zinc-600"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-zinc-500">Technologies & Tools</Label>
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
                        updateProject(index, 'technologies', technologies);
                      } else {
                        const technologies = newValue
                          .split(',')
                          .map(t => t.trim())
                          .filter(Boolean);
                        updateProject(index, 'technologies', technologies);
                      }
                    }}
                    onBlur={(e) => {
                      const technologies = e.target.value
                        .split(',')
                        .map(t => t.trim())
                        .filter(Boolean);
                      updateProject(index, 'technologies', technologies);
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

                {/* Date Row */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-500">Date</Label>
                  <Input
                    type="text"
                    value={project.date || ''}
                    onChange={(e) => updateProject(index, 'date', e.target.value)}
                    className="h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100
                      focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                      hover:border-zinc-700 hover:bg-zinc-900/70 focus:bg-zinc-900/70 transition-colors
                      placeholder:text-zinc-600"
                    placeholder="e.g., Jan 2023 - Present"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-purple-400 rounded-full">Description</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = [...projects];
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
                    {project.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            value={desc}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].description[descIndex] = e.target.value;
                              onChange(updated);
                            }}
                            placeholder="Describe a key feature or achievement"
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
                            const updated = [...projects];
                            updated[index].description = updated[index].description.filter((_, i) => i !== descIndex);
                            onChange(updated);
                          }}
                          className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {project.description.length === 0 && (
                      <div className="text-xs text-zinc-500 italic py-2">
                        Add points to describe your project&apos;s features and achievements
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
        className="w-full bg-zinc-900/30 hover:bg-zinc-800/50 border-dashed border-zinc-700 hover:border-zinc-600 
          text-zinc-400 hover:text-zinc-200 transition-colors h-10"
        onClick={addProject}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}