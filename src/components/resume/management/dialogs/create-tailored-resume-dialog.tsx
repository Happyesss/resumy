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
import { MiniResumePreview } from "../../shared/mini-resume-preview";
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
        <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200 shadow-lg rounded-lg">
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <h3 className="font-semibold text-lg text-gray-900">No Base Resumes Found</h3>
              <p className="text-sm text-gray-600">
                You need to create a base resume first before you can create a tailored version.
              </p>
            </div>
            {profile ? (
              <CreateBaseResumeDialog profile={profile}>
                <Button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Base Resume
                </Button>
              </CreateBaseResumeDialog>
            ) : (
              <Button disabled className="mt-2">
                No profile available to create base resume
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
        <DialogContent className="sm:max-w-[700px] p-0 max-h-[85vh] overflow-y-auto bg-black border border-gray-800 shadow-lg rounded-lg">
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
          
          {/* Header */}
          <div className="relative px-6 py-6 border-b border-gray-800 bg-gradient-to-r from-neutral-900 via-black to-neutral-900">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl opacity-20 blur-sm"></div>
                <div className="relative p-3 rounded-xl bg-gradient-to-br  from-purple-400 to-blue-500 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Create Tailored Resume
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  {dialogStep === 1 
                    ? "Choose a base resume to start with"
                    : "Configure job details and tailoring method"
                  }
                </DialogDescription>
              </div>
              {/* Enhanced Step indicator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    dialogStep >= 1 
                      ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg" 
                      : "bg-gray-200 text-gray-600"
                  )}>
                    1
                    {dialogStep >= 1 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full animate-pulse opacity-30"></div>
                    )}
                  </div>
                  <div className={cn(
                    "w-6 h-1 rounded-full transition-all duration-300",
                    dialogStep >= 2 ? "bg-gradient-to-r from-purple-500 to-blue-600" : "bg-gray-200"
                  )} />
                  <div className={cn(
                    "relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    dialogStep >= 2 
                      ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg" 
                      : "bg-gray-200 text-gray-600"
                  )}>
                    2
                    {dialogStep >= 2 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full animate-pulse opacity-30"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 min-h-[300px] relative bg-black">
            {isCreating && <LoadingOverlay currentStep={currentStep} />}
            
            {dialogStep === 1 && (
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                  <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full animate-pulse opacity-20"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    Select Your Base Resume
                  </h3>
                  <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
                    Choose which resume you&apos;d like to tailor for this specific job opportunity
                  </p>
                </div>
                
                {/* Form Section */}
                <div className="max-w-lg mx-auto">
                  <div className="bg-neutral-900 rounded-2xl p-6 shadow-xl border border-gray-800 backdrop-blur-sm">
                    <div className="space-y-6">
                      {/* Base Resume Selector */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                          Choose Base Resume
                        </Label>
                        <div className="relative group">
                          <BaseResumeSelector
                            baseResumes={baseResumes}
                            selectedResumeId={selectedBaseResume}
                            onResumeSelect={setSelectedBaseResume}
                            isInvalid={isBaseResumeInvalid}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Resume Flow Visualization */}
                      {selectedBaseResume ? (
                        <div className="relative">
                          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-8 border border-purple-800/40 flex flex-col items-center">
                            <div className="flex items-center justify-center gap-12">
                              {/* Base Resume */}
                              <div className="flex flex-col items-center space-y-2">
                                <div className="relative">
                                  <MiniResumePreview
                                    name={baseResumes.find(r => r.id === selectedBaseResume)?.name || ''}
                                    type="base"
                                    className="w-20 h-28 hover:scale-105 transition-all duration-300 shadow-xl"
                                  />
                                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full border-2 border-green-400 flex items-center justify-center shadow">
                                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-300 mt-1 tracking-wide">Base Resume</span>
                              </div>

                              {/* Arrow and Label */}
                              <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center mb-2">
                                  <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                                    <defs>
                                      <linearGradient id="arrow-gradient" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#a78bfa"/>
                                        <stop offset="1" stopColor="#60a5fa"/>
                                      </linearGradient>
                                    </defs>
                                    <path d="M4 12h36" stroke="url(#arrow-gradient)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round"/>
                                    <polygon points="44,8 48,12 44,16" fill="url(#arrow-gradient)" />
                                  </svg>
                                </div>
                                <span className="text-xs font-semibold text-purple-200 bg-gradient-to-r from-purple-600/80 to-blue-600/80 px-3 py-1 rounded-full shadow border border-purple-400/30">
                                  Will Become
                                </span>
                              </div>

                              {/* Tailored Resume */}
                              <div className="flex flex-col items-center space-y-2">
                                <div className="relative">
                                  <MiniResumePreview
                                    name="Tailored Resume"
                                    type="tailored"
                                    className="w-20 h-28 hover:scale-105 transition-all duration-300 shadow-xl"
                                  />
                                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow">
                                    <Sparkles className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-300 mt-1 tracking-wide">Tailored Resume</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Selected Resume Info */}
                          <div className="mt-5 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl border border-purple-800/30 flex items-center gap-3 shadow">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center shadow">
                              <span className="text-white text-lg font-bold">✓</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-purple-200">
                                Selected: {baseResumes.find(r => r.id === selectedBaseResume)?.name}
                              </div>
                              <div className="text-xs text-purple-300 mt-1">
                                This resume will be used as the foundation for your tailored version.
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
                          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ArrowRight className="w-5 h-5 text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">
                            Select a base resume to see preview
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dialogStep === 2 && (
              <div className="space-y-5">
                {/* Show selected base resume */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-400">
                    <span className="font-medium">Base Resume:</span> {baseResumes.find(r => r.id === selectedBaseResume)?.name}
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
          <div className="px-6 py-4 border-t border-gray-800 bg-gradient-to-r from-neutral-900 via-black to-neutral-900">
            <div className="flex justify-between items-center">
              <div>
                {dialogStep === 2 && (
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
                {dialogStep === 1 && (
                  <Button 
                    onClick={handleNext} 
                    className="h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <span className="flex items-center gap-2">
                      Next →
                    </span>
                  </Button>
                )}
                {dialogStep === 2 && (
                  <Button 
                    onClick={handleCreate} 
                    disabled={isCreating}
                    className="h-10 px-6 bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 disabled:from-purple-300 disabled:to-blue-300 text-white font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200"
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