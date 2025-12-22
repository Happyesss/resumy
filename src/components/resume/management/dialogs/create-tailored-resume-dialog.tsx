'use client';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { hasReachedAILimit, incrementAIUsage } from '@/lib/ai-request-limit';
import { getResumeLimit } from '@/lib/constants';
import { Profile, Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { createJob } from "@/utils/actions/jobs/actions";
import { formatJobListing, tailorResumeToJob } from "@/utils/actions/jobs/ai";
import { countResumes, createTailoredResume } from "@/utils/actions/resumes/actions";
import { ArrowRight, Loader2, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BaseResumeSelector } from "../base-resume-selector";
import { ImportMethodRadioGroup } from "../import-method-radio-group";
import { JobDescriptionInput } from "../job-description-input";
import { LoadingOverlay, type CreationStep } from "../loading-overlay";
import { CreateBaseResumeDialog } from "./create-base-resume-dialog";

interface CreateTailoredResumeDialogProps {
  children: React.ReactNode;
  baseResumes?: Resume[];
  profile?: Profile;
  totalResumesCount?: number;
}

export function CreateTailoredResumeDialog({ children, baseResumes, profile, totalResumesCount }: CreateTailoredResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedBaseResume, setSelectedBaseResume] = useState<string>(baseResumes?.[0]?.id || '');
  const [jobDescription, setJobDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<CreationStep>('analyzing');
  const [dialogStep, setDialogStep] = useState<1 | 2>(1);
  const [importOption, setImportOption] = useState<'import-profile' | 'ai'>('ai');
  const [isBaseResumeInvalid, setIsBaseResumeInvalid] = useState(false);
  const [isJobDescriptionInvalid, setIsJobDescriptionInvalid] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', description: '' });
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const router = useRouter();
  

  const handleNext = () => {
    if (!selectedBaseResume) {
      setIsBaseResumeInvalid(true);
      toast({
        title: "Required Field Missing",
        description: "Please select a base resume to continue.",
        variant: "destructive",
      });
      return;
    }
    setDialogStep(2);
  };

  const handleBack = () => {
    setDialogStep(1);
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

    const resumeLimit = getResumeLimit(profile?.email);
    if (currentTotalCount >= resumeLimit) {
      setShowLimitDialog(true);
      return;
    }

    // Check AI request limit (hardcoded 50 requests)
    if (hasReachedAILimit()) {
      toast({
        title: "AI Request Limit Reached",
  description: "You have reached your daily AI request limit.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!selectedBaseResume) {
      setIsBaseResumeInvalid(true);
      toast({
        title: "Error",
        description: "Please select a base resume",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription.trim() && importOption === 'ai') {
      setIsJobDescriptionInvalid(true);
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      setCurrentStep('analyzing');
      
      // Reset validation states
      setIsBaseResumeInvalid(false);
      setIsJobDescriptionInvalid(false);

      if (importOption === 'import-profile') {
        // Direct copy logic
        const baseResume = baseResumes?.find(r => r.id === selectedBaseResume);
        if (!baseResume) throw new Error("Base resume not found");

        let jobId: string | null = null;
        let jobTitle = 'Copied Resume';
        let companyName = '';

        if (jobDescription.trim()) {
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
            setCurrentStep('analyzing');
            const formattedJobListing = await formatJobListing(jobDescription, {
              model: selectedModel || '',
              apiKeys
            });
            // Increment usage after successful AI call
            incrementAIUsage();

            setCurrentStep('formatting');
            const jobEntry = await createJob(formattedJobListing);
            if (!jobEntry?.id) throw new Error("Failed to create job entry");
            
            jobId = jobEntry.id;
            jobTitle = formattedJobListing.position_title || 'Copied Resume';
            companyName = formattedJobListing.company_name || '';
          } catch (error: Error | unknown) {
            if (error instanceof Error && (
                error.message.toLowerCase().includes('api key') || 
                error.message.toLowerCase().includes('unauthorized') ||
                error.message.toLowerCase().includes('invalid key'))
            ) {
              setErrorMessage({
                title: "API Key Error",
                description: "There was an issue with your API key. Please check your settings and try again."
              });
            } else {
              setErrorMessage({
                title: "Error",
                description: "Failed to process job description. Please try again."
              });
            }
            setShowErrorDialog(true);
            setIsCreating(false);
            return;
          }
        }

        const resume = await createTailoredResume(
          baseResume,
          jobId,
          jobTitle,
          companyName,
          {
            work_experience: baseResume.work_experience,
            education: baseResume.education.map(edu => ({
              ...edu,
              gpa: edu.gpa?.toString()
            })),
            skills: baseResume.skills,
            projects: baseResume.projects,
            target_role: baseResume.target_role
          }
        );

        toast({
          title: "Success",
          description: "Resume created successfully",
        });

        router.push(`/resumes/${resume.id}`);
        setOpen(false);
        return;
      }

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
      // 1. Format the job listing
      let formattedJobListing;
      try {
        formattedJobListing = await formatJobListing(jobDescription, {
          model: selectedModel || '',
          apiKeys
        });
        // Increment usage after successful AI call
        incrementAIUsage();
      } catch (error: Error | unknown) {
        if (error instanceof Error && (
            error.message.toLowerCase().includes('api key') || 
            error.message.toLowerCase().includes('unauthorized') ||
            error.message.toLowerCase().includes('invalid key'))
        ) {
          setErrorMessage({
            title: "API Key Error",
            description: "There was an issue with your API key. Please check your settings and try again."
          });
        } else {
          setErrorMessage({
            title: "Error",
            description: "Failed to analyze job description. Please try again."
          });
        }
        setShowErrorDialog(true);
        setIsCreating(false);
        return;
      }

      setCurrentStep('formatting');

      // 2. Create job in database and get ID
      const jobEntry = await createJob(formattedJobListing);
      if (!jobEntry?.id) throw new Error("Failed to create job entry");


      // 3. Get the base resume object
      const baseResume = baseResumes?.find(r => r.id === selectedBaseResume);
      if (!baseResume) throw new Error("Base resume not found");

      setCurrentStep('tailoring');

      // 4. Tailor the resume using the formatted job listing
      let tailoredContent;

      try {
        tailoredContent = await tailorResumeToJob(baseResume, formattedJobListing, {
          model: selectedModel || '',
          apiKeys
        });
        // Increment usage after successful AI call
        incrementAIUsage();
      } catch (error: Error | unknown) {
        if (error instanceof Error && (
            error.message.toLowerCase().includes('api key') || 
            error.message.toLowerCase().includes('unauthorized') ||
            error.message.toLowerCase().includes('invalid key'))
        ) {
          setErrorMessage({
            title: "API Key Error",
            description: "There was an issue with your API key. Please check your settings and try again."
          });
        } else {
          setErrorMessage({
            title: "Error",
            description: "Failed to tailor resume. Please try again."
          });
        }
        setShowErrorDialog(true);
        setIsCreating(false);
        return;
      }


      setCurrentStep('finalizing');

      
      // 5. Create the tailored resume with job reference
      try {
        const resume = await createTailoredResume(
          baseResume,
          jobEntry.id,
          formattedJobListing.position_title || '',
          formattedJobListing.company_name || '',
          tailoredContent,
        );

        toast({
          title: "Success",
          description: "Resume created successfully",
        });

        router.push(`/resumes/${resume.id}`);
        setOpen(false);
      } catch (tailorError) {
        console.error('Error in createTailoredResume:', tailorError);
        toast({
          title: "Error",
          description: tailorError instanceof Error ? tailorError.message : "Failed to create tailored resume",
          variant: "destructive",
        });
        setIsCreating(false);
      }
    } catch (error: unknown) {
      console.error('Failed to create resume:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create resume",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setJobDescription('');
      setDialogStep(1);
      setImportOption('ai');
      setSelectedBaseResume(baseResumes?.[0]?.id || '');
    }
  };

  if (!baseResumes || baseResumes.length === 0) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[420px] bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <h3 className="font-semibold text-lg text-white">No Base Resumes Found</h3>
              <p className="text-sm text-neutral-400">
                You need to create a base resume first before you can create a tailored version.
              </p>
            </div>
            {profile ? (
              <CreateBaseResumeDialog profile={profile}>
                <Button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Base Resume
                </Button>
              </CreateBaseResumeDialog>
            ) : (
              <Button disabled className="mt-2 bg-neutral-700 text-neutral-400">
                No profile available
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] p-0 max-h-[85vh] overflow-y-auto w-[95vw] bg-neutral-900 border border-neutral-800 shadow-2xl rounded-2xl">
          
          {/* Header */}
          <div className="relative px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-800">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg font-semibold text-white truncate">
                  Create Tailored Resume
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-neutral-400 mt-0.5 truncate">
                  {dialogStep === 1 
                    ? "Choose a base resume to start with"
                    : "Configure job details and tailoring method"
                  }
                </DialogDescription>
              </div>
              {/* Step indicator */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200",
                  dialogStep >= 1 
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/50" 
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                )}>
                  1
                </div>
                <div className={cn(
                  "w-6 sm:w-8 h-0.5 rounded-full transition-all duration-200",
                  dialogStep >= 2 ? "bg-purple-500/50" : "bg-neutral-700"
                )} />
                <div className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200",
                  dialogStep >= 2 
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/50" 
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                )}>
                  2
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-6 sm:py-8 min-h-[300px] relative">
            {isCreating && <LoadingOverlay currentStep={currentStep} />}
            
            {dialogStep === 1 && (
              <div className="space-y-6 sm:space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-2 sm:space-y-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-100 mb-2">
                    Select Your Base Resume
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto px-4">
                    Choose which resume you&apos;d like to tailor for this job opportunity
                  </p>
                </div>
                
                {/* Form Section */}
                <div className="max-w-lg mx-auto px-2 sm:px-0">
                  <div className="bg-neutral-900 rounded-xl p-4 sm:p-5 border border-neutral-800">
                    <div className="space-y-5">
                      {/* Base Resume Selector */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-neutral-300">
                          Choose Base Resume
                        </Label>
                        <BaseResumeSelector
                          baseResumes={baseResumes}
                          selectedResumeId={selectedBaseResume}
                          onResumeSelect={setSelectedBaseResume}
                          isInvalid={isBaseResumeInvalid}
                        />
                      </div>
                      
                      {/* Resume Transformation Visualization */}
                      {selectedBaseResume ? (
                        <div className="relative bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 rounded-2xl p-4 sm:p-6 border border-neutral-700/50 overflow-hidden">
                          {/* Background decoration */}
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-indigo-500/5 blur-2xl" />
                          </div>
                          
                          <div className="relative flex items-center justify-between gap-2 sm:gap-4">
                            {/* Base Resume Card */}
                            <div className="flex-1 flex flex-col items-center">
                              <div className="relative group">
                                <div className="w-16 h-24 sm:w-20 sm:h-28 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                                  {/* Mini resume mockup */}
                                  <div className="p-2 space-y-2">
                                    <div className="h-1.5 w-10 mx-auto bg-neutral-300 rounded-full" />
                                    <div className="space-y-1">
                                      <div className="h-1 w-full bg-neutral-200 rounded-full" />
                                      <div className="h-1 w-4/5 bg-neutral-200 rounded-full" />
                                      <div className="h-1 w-3/4 bg-neutral-200 rounded-full" />
                                    </div>
                                    <div className="pt-1 space-y-1">
                                      <div className="h-1 w-8 bg-neutral-300 rounded-full" />
                                      <div className="h-1 w-full bg-neutral-200 rounded-full" />
                                      <div className="h-1 w-5/6 bg-neutral-200 rounded-full" />
                                    </div>
                                  </div>
                                </div>
                                {/* Glow effect */}
                                <div className="absolute -inset-1 bg-neutral-400/20 rounded-lg blur-md -z-10" />
                              </div>
                              <div className="mt-3 text-center">
                                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Base</span>
                              </div>
                            </div>

                            {/* Transformation Arrow */}
                            <div className="flex flex-col items-center gap-1 sm:gap-2 px-1 sm:px-2">
                              <div className="relative">
                                {/* Animated dots */}
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-pulse" style={{ animationDelay: '0ms' }} />
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400/80 animate-pulse" style={{ animationDelay: '150ms' }} />
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                                </div>
                                {/* Arrow icon */}
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                                  <ArrowRight className="w-4 h-4 text-purple-400" />
                                </div>
                              </div>
                              <span className="text-[10px] text-purple-400/70 font-medium">AI Tailor</span>
                            </div>

                            {/* Tailored Resume Card */}
                            <div className="flex-1 flex flex-col items-center">
                              <div className="relative group">
                                <div className="w-16 h-24 sm:w-20 sm:h-28 bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-lg border border-purple-200/50 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                                  {/* Mini resume mockup with purple accents */}
                                  <div className="p-2 space-y-2">
                                    <div className="h-1.5 w-10 mx-auto bg-purple-400 rounded-full" />
                                    <div className="space-y-1">
                                      <div className="h-1 w-full bg-purple-200 rounded-full" />
                                      <div className="h-1 w-4/5 bg-purple-100 rounded-full" />
                                      <div className="h-1 w-3/4 bg-purple-100 rounded-full" />
                                    </div>
                                    <div className="pt-1 space-y-1">
                                      <div className="h-1 w-8 bg-purple-300 rounded-full" />
                                      <div className="h-1 w-full bg-purple-100 rounded-full" />
                                      <div className="h-1 w-5/6 bg-purple-100 rounded-full" />
                                    </div>
                                  </div>
                                  {/* Sparkle badge */}
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                                    <Sparkles className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                                {/* Purple glow effect */}
                                <div className="absolute -inset-1 bg-purple-400/20 rounded-lg blur-md -z-10" />
                              </div>
                              <div className="mt-3 text-center">
                                <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">Tailored</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Selected Resume Info */}
                          <div className="relative mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-neutral-700/50">
                            <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 sm:px-4 py-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                              <span className="text-xs sm:text-sm font-medium text-green-400 truncate">
                                {baseResumes.find(r => r.id === selectedBaseResume)?.name}
                              </span>
                              <span className="text-xs text-neutral-500">selected</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative bg-neutral-800/30 border-2 border-dashed border-neutral-700/50 rounded-2xl p-8 text-center overflow-hidden">
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-4 left-4 w-8 h-10 rounded bg-neutral-700/50" />
                            <div className="absolute top-4 right-4 w-8 h-10 rounded bg-neutral-700/50" />
                          </div>
                          <div className="relative">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                              <ArrowRight className="w-5 h-5 text-neutral-600" />
                            </div>
                            <p className="text-sm text-neutral-500 font-medium">
                              Select a base resume to see the transformation preview
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dialogStep === 2 && (
              <div className="space-y-4 sm:space-y-5">
                {/* Show selected base resume */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2.5 sm:p-3">
                  <div className="text-xs sm:text-sm text-purple-300 truncate">
                    <span className="font-medium text-purple-400">Base Resume:</span> {baseResumes.find(r => r.id === selectedBaseResume)?.name}
                  </div>
                </div>

                

                {/* Job Description Input */}
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                  isInvalid={isJobDescriptionInvalid}
                />

                {/* Import Method Selection */}
                <ImportMethodRadioGroup
                  value={importOption}
                  onChange={setImportOption}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-neutral-800">
            <div className="flex justify-between items-center">
              <div>
                {dialogStep === 2 && (
                  <Button 
                    variant="ghost" 
                    onClick={handleBack} 
                    className="h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    ← Back
                  </Button>
                )}
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setOpen(false)} 
                  className="h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancel
                </Button>
                {dialogStep === 1 && (
                  <Button 
                    onClick={handleNext} 
                    className="h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  >
                    Next →
                  </Button>
                )}
                {dialogStep === 2 && (
                  <Button 
                    onClick={handleCreate} 
                    disabled={isCreating}
                    className="h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-700 text-white font-medium disabled:text-neutral-400"
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
              You have reached the maximum limit of {getResumeLimit(profile?.email)} resumes. 
              To create a new resume, please delete one of your existing resumes first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}