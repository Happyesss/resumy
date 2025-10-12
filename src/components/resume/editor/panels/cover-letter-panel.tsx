import { Resume, Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Plus, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import type { AIConfig } from "@/utils/ai-tools";
import { AIImprovementPrompt } from "../../shared/ai-improvement-prompt";
import { generate } from "@/utils/actions/cover-letter/actions";
import { useResumeContext } from "../resume-editor-context";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { CreateTailoredResumeDialog } from "@/components/resume/management/dialogs/create-tailored-resume-dialog";
import { hasReachedDailyLimit, getRemainingRequests, incrementDailyUsage, getCurrentDailyLimit } from '@/lib/daily-limit';
import { toast } from "@/hooks/use-toast";


interface CoverLetterPanelProps {
  resume: Resume;
  job: Job | null;
  aiConfig?: AIConfig;
  userEmail?: string | null;
}

export function CoverLetterPanel({
  resume,
  job,
  aiConfig,
  userEmail,
}: CoverLetterPanelProps) {
  const { dispatch } = useResumeContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', description: '' });

  const updateField = (field: keyof Resume, value: Resume[keyof Resume]) => {
    dispatch({ 
      type: 'UPDATE_FIELD',
      field,
      value
    });
  };

  const generateCoverLetter = async () => {
    if (!job) return;

    // Check daily API request limit
    if (hasReachedDailyLimit(userEmail)) {
      const dailyLimit = getCurrentDailyLimit(userEmail);
      toast({
        title: "Daily Request Limit Reached",
        description: `You have reached the daily limit of ${dailyLimit} AI requests. Please try again tomorrow.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
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

      // Prompt
      const prompt = `Write a professional cover letter for the following job using my resume information:
      ${JSON.stringify(job)}
      
      ${JSON.stringify(resume)}
      
      Today's date is ${new Date().toLocaleDateString()}.

      Please use my contact information in the letter:
      Full Name: ${resume.first_name} ${resume.last_name}
      Email: ${resume.email}
      ${resume.phone_number ? `Phone: ${resume.phone_number}` : ''}
      ${resume.linkedin_url ? `LinkedIn: ${resume.linkedin_url}` : ''}
      ${resume.github_url ? `GitHub: ${resume.github_url}` : ''}

      ${customPrompt ? `\nAdditional requirements: ${customPrompt}` : ''}`;
      

      // Call The Model
      const { output } = await generate(prompt, {
        ...aiConfig,
        model: selectedModel || '',
        apiKeys
      });
      // Increment usage after successful AI call
      incrementDailyUsage();

      // Generated Content
      let generatedContent = '';


      // Update Resume Context
      for await (const delta of readStreamableValue(output)) {
        generatedContent += delta;
        // Update resume context directly
        // console.log('Generated Content:', generatedContent);
        updateField('cover_letter', {
          content: generatedContent,
        });
      }
      
      
    } catch (error: Error | unknown) {
      console.error('Generation error:', error);
      if (error instanceof Error && (
          error.message.toLowerCase().includes('api key') || 
          error.message.toLowerCase().includes('unauthorized') ||
          error.message.toLowerCase().includes('invalid key') ||
          error.message.toLowerCase().includes('invalid x-api-key'))
      ) {
        setErrorMessage({
          title: "API Key Error",
          description: "There was an issue with your API key. Please check your settings and try again."
        });
      } else {
        setErrorMessage({
          title: "Error",
          description: "Failed to generate cover letter. Please try again."
        });
      }
      setShowErrorDialog(true);
    } finally {
      setIsGenerating(false);
    }
  };

  if (resume.is_base_resume) {
    return (
      <div className={cn(
        "p-6 backdrop-blur-sm rounded-xl shadow-lg bg-gray-900 border border-gray-700",
        "space-y-6 text-center relative overflow-hidden"
      )}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-600/20 to-blue-600/20 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg border border-blue-500/50">
            <FileText className="h-8 w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Cover Letter
            </h3>
            <p className="text-blue-300/80 leading-relaxed max-w-sm mx-auto">
              To generate a cover letter, please first tailor this base resume to a specific job.
            </p>
          </div>
          
          <CreateTailoredResumeDialog 
            baseResumes={[resume]}
          >
            <Button
              variant="outline"
              size="lg"
              className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-500 text-white hover:from-blue-700 hover:to-cyan-700 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tailor This Resume
            </Button>
          </CreateTailoredResumeDialog>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 backdrop-blur-sm rounded-xl shadow-lg bg-gray-900 border border-gray-700",
      "space-y-6 relative overflow-hidden"
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-600/20 to-purple-600/20 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md border border-purple-500/50">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Cover Letter
          </h3>
        </div>

        {resume.has_cover_letter ? (
          <div className="space-y-6">
            {/* AI Improvement Prompt */}
            <div className={cn(
              "p-4 bg-gradient-to-br from-gray-800/80 to-purple-900/60 backdrop-blur-sm",
              "border border-purple-600/60 shadow-sm rounded-xl"
            )}>
              <AIImprovementPrompt
                value={customPrompt}
                onChange={setCustomPrompt}
                isLoading={isGenerating}
                placeholder="e.g., Focus on leadership experience and technical skills"
                hideSubmitButton
              />
            </div>

            {/* Action Buttons - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="default"
                size="lg"
                className={cn(
                  "h-12",
                  "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
                  "text-white font-semibold",
                  "border-0 shadow-lg hover:shadow-xl",
                  "transition-all duration-300",
                  "hover:scale-[1.02] hover:-translate-y-0.5",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                )}
                onClick={generateCoverLetter}
                disabled={isGenerating || !job}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 border-red-500 text-red-400 hover:bg-red-900/20 hover:border-red-400 bg-gray-800/50 transition-all duration-300"
                onClick={() => updateField('has_cover_letter', false)}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Cover Letter
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Empty State */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-700/60 border border-gray-600/60 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-300 font-medium">No cover letter has been created for this resume yet.</p>
            </div>
            
            {/* Create Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 border-purple-500 text-white hover:from-purple-700 hover:to-violet-700 hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => updateField('has_cover_letter', true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Cover Letter
            </Button>
          </div>
        )}
      </div>

      <ApiErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title={errorMessage.title}
        description={errorMessage.description}
      />
    </div>
  );
} 