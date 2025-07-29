'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, WorkExperience, Education, Skill, Project, Resume } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Loader2, FileText, Copy, Wand2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBaseResume } from "@/utils/actions/resumes/actions";
import pdfToText from "react-pdftotext";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { convertTextToResume } from "@/utils/actions/resumes/ai";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";

interface CreateBaseResumeDialogProps {
  children: React.ReactNode;
  profile: Profile;
}

export function CreateBaseResumeDialog({ children, profile }: CreateBaseResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [importOption, setImportOption] = useState<'import-profile' | 'scratch' | 'import-resume'>('import-profile');
  const [isTargetRoleInvalid, setIsTargetRoleInvalid] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedItems, setSelectedItems] = useState<{
    work_experience: string[];
    education: string[];
    skills: string[];
    projects: string[];
  }>({
    work_experience: [],
    education: [],
    skills: [],
    projects: []
  });
  const [resumeText, setResumeText] = useState('');
  const router = useRouter();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>({
    title: "",
    description: ""
  });
  const [isDragging, setIsDragging] = useState(false);

  const getItemId = (type: keyof typeof selectedItems, item: WorkExperience | Education | Skill | Project, index?: number): string => {
    const baseId = (() => {
      switch (type) {
        case 'work_experience':
          return `${(item as WorkExperience).company}-${(item as WorkExperience).position}-${(item as WorkExperience).date}`;
        case 'projects':
          return (item as Project).name;
        case 'education':
          return `${(item as Education).school}-${(item as Education).degree}-${(item as Education).field}`;
        case 'skills':
          return (item as Skill).category;
        default:
          return '';
      }
    })();
    
    // Add index to ensure uniqueness
    return index !== undefined ? `${baseId}-${index}` : baseId;
  };

  const handleItemSelection = (section: keyof typeof selectedItems, id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [section]: prev[section].includes(id)
        ? prev[section].filter(x => x !== id)
        : [...prev[section], id]
    }));
  };

  const handleSectionSelection = (section: keyof typeof selectedItems, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [section]: checked 
        ? profile[section].map((item, index) => getItemId(section, item, index))
        : []
    }));
  };

  const isSectionSelected = (section: keyof typeof selectedItems): boolean => {
    const sectionItems = profile[section].map((item, index) => getItemId(section, item, index));
    return sectionItems.length > 0 && sectionItems.every(id => selectedItems[section].includes(id));
  };

  const isSectionPartiallySelected = (section: keyof typeof selectedItems): boolean => {
    const sectionItems = profile[section].map((item, index) => getItemId(section, item, index));
    const selectedCount = sectionItems.filter(id => selectedItems[section].includes(id)).length;
    return selectedCount > 0 && selectedCount < sectionItems.length;
  };

  const handleNext = () => {
    if (!targetRole.trim()) {
      setIsTargetRoleInvalid(true);
      setTimeout(() => setIsTargetRoleInvalid(false), 820);
      toast({
        title: "Required Field Missing",
        description: "Target role is a required field. Please enter your target role.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleCreate = async () => {
    if (!targetRole.trim()) {
      setIsTargetRoleInvalid(true);
      setTimeout(() => setIsTargetRoleInvalid(false), 820);
      toast({
        title: "Required Field Missing",
        description: "Target role is a required field. Please enter your target role.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);

      if (importOption === 'import-resume') {
        if (!resumeText.trim()) {
          return;
        }

        // Create an empty resume to pass to convertTextToResume
        const emptyResume: Resume = {
          id: '',
          user_id: '',
          name: targetRole,
          target_role: targetRole,
          is_base_resume: true,
          first_name: '',
          last_name: '',
          email: '',
          work_experience: [],
          education: [],
          skills: [],
          projects: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          has_cover_letter: false,
        };

        // Get model and API key from local storage
        const MODEL_STORAGE_KEY = 'resumelm-default-model';
        const LOCAL_STORAGE_KEY = 'resumelm-api-keys';
        const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY);
        const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
        let apiKeys = [];
        try {
          apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
        } catch (error) {
          console.error('Error parsing API keys:', error);
        }


        try {
          const convertedResume = await convertTextToResume(resumeText, emptyResume, targetRole, {
            model: selectedModel || 'gemini-2.0-flash',
            apiKeys
          });
          
          // Extract content sections and basic info for createBaseResume
          const selectedContent = {
            // Basic Info
            first_name: convertedResume.first_name || '',
            last_name: convertedResume.last_name || '',
            email: convertedResume.email || '',
            phone_number: convertedResume.phone_number,
            location: convertedResume.location,
            website: convertedResume.website,
            linkedin_url: convertedResume.linkedin_url,
            github_url: convertedResume.github_url,
            
            // Content Sections
            work_experience: convertedResume.work_experience || [],
            education: convertedResume.education || [],
            skills: convertedResume.skills || [],
            projects: convertedResume.projects || [],
          };
          
          const resume = await createBaseResume(
            targetRole,
            'import-resume',
            selectedContent as Resume
          );
          
          toast({
            title: "Success",
            description: "Resume created successfully",
          });

          router.push(`/resumes/${resume.id}`);
          setOpen(false);
          return;
        } catch (error: Error | unknown) {
          if (error instanceof Error && (
            error.message.toLowerCase().includes('api key') || 
            error.message.toLowerCase().includes('unauthorized') ||
            error.message.toLowerCase().includes('invalid key') ||
            error.message.toLowerCase().includes('invalid x-api-key')
          )) {
            setErrorMessage({
              title: "API Key Error",
              description: "There was an issue with your API key. Please check your settings and try again."
            });
          } else {
            setErrorMessage({
              title: "Error",
              description: "Failed to convert resume text. Please try again."
            });
          }
          setShowErrorDialog(true);
          setIsCreating(false);
          return;
        }
      }

      const selectedContent = {
        work_experience: profile.work_experience.filter((exp, index) => 
          selectedItems.work_experience.includes(getItemId('work_experience', exp, index))
        ),
        education: profile.education.filter((edu, index) => 
          selectedItems.education.includes(getItemId('education', edu, index))
        ),
        skills: profile.skills.filter((skill, index) => 
          selectedItems.skills.includes(getItemId('skills', skill, index))
        ),
        projects: profile.projects.filter((project, index) => 
          selectedItems.projects.includes(getItemId('projects', project, index))
        ),
      };


      const resume = await createBaseResume(
        targetRole, 
        importOption === 'scratch' ? 'fresh' : importOption,
        selectedContent
      );



      toast({
        title: "Success",
        description: "Resume created successfully",
      });

      router.push(`/resumes/${resume.id}`);
      setOpen(false);
    } catch (error) {
      console.error('Create resume error:', error);
      setErrorMessage({
        title: "Error",
        description: "Failed to create resume. Please try again."
      });
      setShowErrorDialog(true);
    } finally {
      setIsCreating(false);
    }
  };

  // Initialize all items as selected when dialog opens
  const initializeSelectedItems = () => {
    setSelectedItems({
      work_experience: profile.work_experience.map((exp, index) => getItemId('work_experience', exp, index)),
      education: profile.education.map((edu, index) => getItemId('education', edu, index)),
      skills: profile.skills.map((skill, index) => getItemId('skills', skill, index)),
      projects: profile.projects.map((project, index) => getItemId('projects', project, index))
    });
  };

  // Reset form and initialize selected items when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Move focus back to the trigger when closing
      const trigger = document.querySelector('[data-state="open"]');
      if (trigger) {
        (trigger as HTMLElement).focus();
      }
      document.body.classList.remove('no-scroll');
    } else {
      document.body.classList.add('no-scroll');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setOpen(newOpen);
    if (newOpen) {
      setTargetRole('');
      setCurrentStep(1);
      setImportOption('import-profile');
      initializeSelectedItems();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === "application/pdf");

    if (pdfFile) {
      try {
        const text = await pdfToText(pdfFile);
        setResumeText(prev => prev + (prev ? "\n\n" : "") + text);
      } catch {
        toast({
          title: "PDF Processing Error",
          description: "Failed to extract text from the PDF. Please try again or paste the content manually.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      try {
        const text = await pdfToText(file);
        setResumeText(prev => prev + (prev ? "\n\n" : "") + text);
      } catch {
        toast({
          title: "PDF Processing Error",
          description: "Failed to extract text from the PDF. Please try again or paste the content manually.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={cn(
        "dialog-content sm:max-w-[520px] p-0 max-h-[85vh] overflow-y-auto",
        "bg-black border border-gray-800 shadow-lg rounded-2xl",
        "relative",
      )}>
        {/* Force close icon to top-right with red color */}
        <style jsx global>{`
          .dialog-close {
            position: absolute !important;
            top: 18px !important;
            right: 18px !important;
            z-index: 50 !important;
            margin-left: 16px !important;
          }
          .dialog-close svg {
            color: #ef4444 !important;
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
          body.no-scroll {
            overflow: hidden !important;
          }
          .dialog-content {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 1000 !important;
            max-height: 85vh !important;
            overflow-y: auto !important;
          }
        `}</style>
        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          .shake {
            animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
          }
        `}</style>
        {/* Compact Header */}
        <div className="relative px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-neutral-900 via-black to-neutral-900">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl opacity-20 blur-sm"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <DialogTitle className="text-lg font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              Base Resume
            </DialogTitle>
            <div className="flex-1" />
            {/* Stepper: use icons instead of numbers */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                currentStep >= 1 
                  ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg" 
                  : "bg-gray-200 text-gray-600"
              )}>
                <FileText className="w-4 h-4" />
              </div>
              <div className={cn(
                "w-6 h-1 rounded-full transition-all duration-300 mx-1",
                currentStep >= 2 ? "bg-gradient-to-r from-purple-400 to-purple-600" : "bg-gray-200"
              )} />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                currentStep >= 2 
                  ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg" 
                  : "bg-gray-200 text-gray-600"
              )}>
                <Upload className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 min-h-[240px] bg-black">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Medium Hero Section */}
              <div className="flex flex-col items-center gap-3 mb-3">
                <FileText className="w-10 h-10 text-purple-400 mb-1" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Target Role
                </h3>
                <p className="text-sm text-gray-400 text-center max-w-md">
                  Tailor your resume for your career goals
                </p>
              </div>
              {/* Smaller Form Section */}
              <div className="max-w-xs mx-auto">
                <div className="bg-neutral-900 rounded-xl p-4 shadow border border-gray-800 backdrop-blur-sm">
                  <div className="space-y-3">
                    <Label htmlFor="target-role" className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Role</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative group">
                      <Input
                        id="target-role"
                        placeholder="e.g. Senior Engineer"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext();
                          }
                        }}
                        className={cn(
                          "h-10 text-base px-3 bg-neutral-950 border-2 border-gray-800 rounded-lg text-white transition-all duration-300",
                          "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-neutral-900",
                          "group-hover:border-purple-400",
                          "placeholder:text-gray-400",
                          isTargetRoleInvalid && "border-red-500 bg-red-950/50 shake"
                        )}
                        required
                        autoFocus
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Show selected target role */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-sm text-purple-600">
                  <span className="font-medium">Target Role:</span> {targetRole}
                </div>
              </div>

              {/* Import Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-400">Resume Content</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'import-profile', icon: Copy, label: 'From Profile', desc: 'Use existing profile data' },
                    { id: 'import-resume', icon: Upload, label: 'Import Resume', desc: 'Upload or paste resume' },
                    { id: 'scratch', icon: Wand2, label: 'Start Fresh', desc: 'Create from scratch' }
                  ].map((option) => (
                    <div key={option.id}>
                      <input
                        type="radio"
                        id={option.id}
                        name="importOption"
                        value={option.id}
                        checked={importOption === option.id}
                        onChange={(e) => setImportOption(e.target.value as 'import-profile' | 'scratch' | 'import-resume')}
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor={option.id}
                        className={cn(
                          "flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all ",
                          "hover:border-purple-200 hover:bg-purple-50/50",
                          "peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:shadow-sm"
                        )}
                      >
                        <option.icon className="w-5 h-5 text-purple-600 mb-2" />
                        <div className="text-xs font-medium text-center">
                          <div className={cn(
                            "text-gray-200 transition-colors",
                            importOption === option.id && "text-black"
                          )}>{option.label}</div>
                          <div className="text-gray-500 mt-0.5">{option.desc}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Profile Import Content Selection */}
                {importOption === 'import-profile' && (
                  <div className="mt-4 space-y-3">
                    <div className="text-sm font-medium text-gray-400">Select Content to Include</div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'work_experience', label: 'Work Experience', data: profile.work_experience },
                        { key: 'projects', label: 'Projects', data: profile.projects },
                        { key: 'education', label: 'Education', data: profile.education },
                        { key: 'skills', label: 'Skills', data: profile.skills }
                      ].map((section) => (
                        <Accordion key={section.key} type="single" collapsible>
                          <AccordionItem value={section.key} className="border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2 px-3 py-2">
                              <Checkbox
                                checked={isSectionSelected(section.key as keyof typeof selectedItems)}
                                onCheckedChange={(checked) => handleSectionSelection(section.key as keyof typeof selectedItems, checked as boolean)}
                                className={cn(
                                  isSectionPartiallySelected(section.key as keyof typeof selectedItems) && "data-[state=checked]:bg-purple-600/50"
                                )}
                              />
                              <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-sm text-gray-200 font-medium">{section.label} ----</span>
                                  <span className="text-xs text-gray-500">{section.data.length}</span>
                                </div>
                              </AccordionTrigger>
                            </div>
                            <AccordionContent className="px-3 pb-3">
                              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                {section.data.map((item: WorkExperience | Education | Skill | Project, index: number) => {
                                  const id = getItemId(section.key as keyof typeof selectedItems, item, index);
                                  return (
                                    <div key={id} className="flex items-center gap-2 p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors">
                                      <Checkbox
                                        checked={selectedItems[section.key as keyof typeof selectedItems].includes(id)}
                                        onCheckedChange={() => handleItemSelection(section.key as keyof typeof selectedItems, id)}
                                      />
                                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleItemSelection(section.key as keyof typeof selectedItems, id)}>
                                        {section.key === 'work_experience' && (
                                          <div>
                                            <div className="text-xs font-medium truncate">{(item as WorkExperience).position}</div>
                                            <div className="text-xs text-gray-500">{(item as WorkExperience).company} • {(item as WorkExperience).date}</div>
                                          </div>
                                        )}
                                        {section.key === 'projects' && (
                                          <div>
                                            <div className="text-xs font-medium truncate">{(item as Project).name}</div>
                                            {(item as Project).technologies?.length && (
                                              <div className="text-xs text-gray-500 truncate">{(item as Project).technologies?.slice(0, 2).join(', ')}</div>
                                            )}
                                          </div>
                                        )}
                                        {section.key === 'education' && (
                                          <div>
                                            <div className="text-xs font-medium truncate">{(item as Education).degree} in {(item as Education).field}</div>
                                            <div className="text-xs text-gray-500">{(item as Education).school} • {(item as Education).date}</div>
                                          </div>
                                        )}
                                        {section.key === 'skills' && (
                                          <div>
                                            <div className="text-xs font-medium">{(item as Skill).category}</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {(item as Skill).items.slice(0, 3).map((skill: string, index: number) => (
                                                <Badge key={index} variant="secondary" className="text-[10px] px-1 py-0">
                                                  {skill}
                                                </Badge>
                                              ))}
                                              {(item as Skill).items.length > 3 && (
                                                <span className="text-[10px] text-gray-500">+{(item as Skill).items.length - 3} more</span>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume Import */}
                {importOption === 'import-resume' && (
                  <div className="space-y-3">
                    <label
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 transition-colors cursor-pointer",
                        isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400"
                      )}
                    >
                      <input type="file" className="hidden" accept="application/pdf" onChange={handleFileInput} />
                      <Upload className="w-8 h-8 text-purple-500" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Drop PDF here or click to browse</p>
                        <p className="text-xs text-gray-500">Supports PDF files only</p>
                      </div>
                    </label>
                    <Textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Or paste your resume text here..."
                      className="min-h-[120px] text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Dialog */}
        <ApiErrorDialog
          open={showErrorDialog}
          onOpenChange={setShowErrorDialog}
          title={errorMessage.title}
          description={errorMessage.description}
        />

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gradient-to-r from-neutral-900 via-black to-neutral-900">
          <div className="flex justify-between items-center">
            <div>
              {currentStep === 2 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="h-10 px-6 border-2 text-gray-200 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    ← Back
                  </span>
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)} 
                className="h-10 px-6 border-2 text-gray-200 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Button>
              {currentStep === 1 && (
                <Button 
                  onClick={handleNext} 
                className="h-10 px-6 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    Next →
                  </span>
                </Button>
              )}
              {currentStep === 2 && (
                <Button 
                  onClick={handleCreate} 
                  disabled={isCreating} 
                className="h-10 px-6 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200"
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Resume
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}