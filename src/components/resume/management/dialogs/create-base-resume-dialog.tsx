'use client';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Education, Profile, Project, Resume, Skill, WorkExperience } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createBaseResume } from "@/utils/actions/resumes/actions";
import { Copy, FileText, Loader2, Upload, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import pdfToText from "react-pdftotext";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { hasReachedAILimit, incrementAIUsage } from '@/lib/ai-request-limit';
import { getResumeLimit } from '@/lib/constants';
import { countResumes } from '@/utils/actions/resumes/actions';
import { convertTextToResume } from "@/utils/actions/resumes/ai";

interface CreateBaseResumeDialogProps {
  children: React.ReactNode;
  profile: Profile;
  totalResumesCount?: number;
}

export function CreateBaseResumeDialog({ children, profile, totalResumesCount }: CreateBaseResumeDialogProps) {
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
  const [showLimitDialog, setShowLimitDialog] = useState(false);

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
    // Check resume limit first (fetch count if not provided)
    let currentTotalCount = totalResumesCount;
    if (currentTotalCount === undefined) {
      try {
        currentTotalCount = await countResumes('all');
      } catch (error) {
        console.error('Failed to fetch resume count:', error);
        // Continue without limit check if fetching fails
        currentTotalCount = 0;
      }
    }

    const resumeLimit = getResumeLimit(profile.email);
    if (currentTotalCount >= resumeLimit) {
      setShowLimitDialog(true);
      return;
    }

    // Check AI request limit (only for AI-powered creation)
    if (importOption === 'import-resume' && hasReachedAILimit()) {
      toast({
        title: "AI Request Limit Reached",
  description: "You have reached your daily AI request limit.",
        variant: "destructive",
      });
      return;
    }

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
          // Increment usage after successful AI call
          incrementAIUsage();
          
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
        "sm:max-w-[520px] p-0 max-h-[85vh] overflow-y-auto",
        "bg-neutral-900 border border-neutral-800 shadow-2xl rounded-2xl",
      )}>
        {/* Compact Header */}
        <div className="relative px-6 py-5 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold text-white">
                Create Base Resume
              </DialogTitle>
              <p className="text-sm text-neutral-400 mt-0.5">
                {currentStep === 1 ? 'Set your target role' : 'Choose resume content'}
              </p>
            </div>
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                currentStep >= 1 
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/50" 
                  : "bg-neutral-800 text-neutral-500 border border-neutral-700"
              )}>
                1
              </div>
              <div className={cn(
                "w-8 h-0.5 rounded-full transition-all duration-200",
                currentStep >= 2 ? "bg-purple-500/50" : "bg-neutral-700"
              )} />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                currentStep >= 2 
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/50" 
                  : "bg-neutral-800 text-neutral-500 border border-neutral-700"
              )}>
                2
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 min-h-[280px]">
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Target Role
                </h3>
                <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                  Tailor your resume for your career goals
                </p>
              </div>
              
              {/* Form Section */}
              <div className="max-w-sm mx-auto">
                <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
                  <div className="space-y-3">
                    <Label htmlFor="target-role" className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                      <span>Role</span>
                      <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
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
                          "h-11 text-base px-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white",
                          "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
                          "placeholder:text-neutral-500",
                          "transition-all duration-200",
                          isTargetRoleInvalid && "border-red-500 bg-red-950/20 shake"
                        )}
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Show selected target role */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="text-sm text-purple-300">
                  <span className="font-medium text-purple-400">Target Role:</span> {targetRole}
                </div>
              </div>

              {/* Import Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-neutral-300">Resume Content</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'import-profile', icon: Copy, label: 'From Profile', desc: 'Use existing data' },
                    { id: 'import-resume', icon: Upload, label: 'Import Resume', desc: 'Upload or paste' },
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
                          "flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-all",
                          "bg-neutral-900 border-neutral-800",
                          "hover:border-purple-500/50 hover:bg-purple-500/5",
                          "peer-checked:border-purple-500 peer-checked:bg-purple-500/10"
                        )}
                      >
                        <option.icon className={cn(
                          "w-5 h-5 mb-2 transition-colors",
                          importOption === option.id ? "text-purple-400" : "text-neutral-500"
                        )} />
                        <div className="text-center">
                          <div className={cn(
                            "text-xs font-medium transition-colors",
                            importOption === option.id ? "text-white" : "text-neutral-400"
                          )}>{option.label}</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">{option.desc}</div>
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
                          <AccordionItem value={section.key} className="border border-neutral-800 rounded-lg bg-neutral-900">
                            <div className="flex items-center gap-2 px-3 py-2">
                              <Checkbox
                                checked={isSectionSelected(section.key as keyof typeof selectedItems)}
                                onCheckedChange={(checked) => handleSectionSelection(section.key as keyof typeof selectedItems, checked as boolean)}
                                className={cn(
                                  "border-neutral-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
                                  isSectionPartiallySelected(section.key as keyof typeof selectedItems) && "data-[state=checked]:bg-purple-500/50"
                                )}
                              />
                              <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-sm text-neutral-300 font-medium">{section.label}</span>
                                  <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">{section.data.length}</span>
                                </div>
                              </AccordionTrigger>
                            </div>
                            <AccordionContent className="px-3 pb-3">
                              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                {section.data.map((item: WorkExperience | Education | Skill | Project, index: number) => {
                                  const id = getItemId(section.key as keyof typeof selectedItems, item, index);
                                  return (
                                    <div key={id} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                                      <Checkbox
                                        checked={selectedItems[section.key as keyof typeof selectedItems].includes(id)}
                                        onCheckedChange={() => handleItemSelection(section.key as keyof typeof selectedItems, id)}
                                        className="border-neutral-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                      />
                                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleItemSelection(section.key as keyof typeof selectedItems, id)}>
                                        {section.key === 'work_experience' && (
                                          <div>
                                            <div className="text-xs font-medium text-neutral-200 truncate">{(item as WorkExperience).position}</div>
                                            <div className="text-xs text-neutral-500">{(item as WorkExperience).company} • {(item as WorkExperience).date}</div>
                                          </div>
                                        )}
                                        {section.key === 'projects' && (
                                          <div>
                                            <div className="text-xs font-medium text-neutral-200 truncate">{(item as Project).name}</div>
                                            {(item as Project).technologies?.length && (
                                              <div className="text-xs text-neutral-500 truncate">{(item as Project).technologies?.slice(0, 2).join(', ')}</div>
                                            )}
                                          </div>
                                        )}
                                        {section.key === 'education' && (
                                          <div>
                                            <div className="text-xs font-medium text-neutral-200 truncate">{(item as Education).degree} in {(item as Education).field}</div>
                                            <div className="text-xs text-neutral-500">{(item as Education).school} • {(item as Education).date}</div>
                                          </div>
                                        )}
                                        {section.key === 'skills' && (
                                          <div>
                                            <div className="text-xs font-medium text-neutral-200">{(item as Skill).category}</div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {(item as Skill).items.slice(0, 3).map((skill: string, index: number) => (
                                                <Badge key={index} variant="secondary" className="text-[10px] px-1.5 py-0 bg-neutral-700 text-neutral-300 border-0">
                                                  {skill}
                                                </Badge>
                                              ))}
                                              {(item as Skill).items.length > 3 && (
                                                <span className="text-[10px] text-neutral-500">+{(item as Skill).items.length - 3}</span>
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
                        "border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-all cursor-pointer",
                        "bg-neutral-900",
                        isDragging 
                          ? "border-purple-500 bg-purple-500/10" 
                          : "border-neutral-700 hover:border-purple-500/50 hover:bg-purple-500/5"
                      )}
                    >
                      <input type="file" className="hidden" accept="application/pdf" onChange={handleFileInput} />
                      <Upload className={cn(
                        "w-8 h-8 transition-colors",
                        isDragging ? "text-purple-400" : "text-neutral-500"
                      )} />
                      <div className="text-center">
                        <p className="text-sm font-medium text-neutral-300">Drop PDF here or click to browse</p>
                        <p className="text-xs text-neutral-500">Supports PDF files only</p>
                      </div>
                    </label>
                    <Textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Or paste your resume text here..."
                      className="min-h-[120px] text-sm bg-neutral-900 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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

        {/* Resume Limit Reached Dialog */}
        <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resume Limit Reached</AlertDialogTitle>
              <AlertDialogDescription>
                You have reached the maximum limit of {getResumeLimit(profile.email)} resumes. 
                To create a new resume, please delete one of your existing resumes first.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800">
          <div className="flex justify-between items-center">
            <div>
              {currentStep === 2 && (
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  className="h-10 px-4 text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  ← Back
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setOpen(false)} 
                className="h-10 px-4 text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                Cancel
              </Button>
              {currentStep === 1 && (
                <Button 
                  onClick={handleNext} 
                  className="h-10 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                >
                  Next →
                </Button>
              )}
              {currentStep === 2 && (
                <Button 
                  onClick={handleCreate} 
                  disabled={isCreating} 
                  className="h-10 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-700 text-white font-medium disabled:text-neutral-400"
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Resume"
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