import { CreateTailoredResumeDialog } from "@/components/resume/management/dialogs/create-tailored-resume-dialog";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { hasReachedAILimit, incrementAIUsage } from '@/lib/ai-request-limit';
import { Job, Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { generate } from "@/utils/actions/cover-letter/actions";
import type { AIConfig } from "@/utils/ai-tools";
import { readStreamableValue } from 'ai/rsc';
import { FileText, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from 'react';
import { AIImprovementPrompt } from "../../shared/ai-improvement-prompt";
import { useResumeContext } from "../resume-editor-context";


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

    // Check AI request limit
    if (hasReachedAILimit()) {
      toast({
        title: "AI Request Limit Reached",
  description: "You have reached your daily AI request limit.",
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
      incrementAIUsage();

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
        "p-4 sm:p-6 rounded-2xl",
        "bg-zinc-900/50 border border-zinc-800/80",
        "space-y-6 text-center"
      )}>
        <div className="space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-violet-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-violet-500/20">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-violet-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Cover Letter
            </h3>
            <p className="text-zinc-400 leading-relaxed max-w-sm mx-auto text-sm">
              To generate a cover letter, please first tailor this base resume to a specific job.
            </p>
          </div>
          
          <CreateTailoredResumeDialog 
            baseResumes={[resume]}
          >
            <Button
                variant="outline"
                size="lg"
                className={cn(
                  "mt-4 sm:mt-6 h-10 sm:h-auto",
                  "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
                  "border border-violet-500/30 hover:border-violet-500/50",
                  "text-violet-400 hover:text-violet-300",
                  "hover:from-violet-500/20 hover:to-purple-500/20",
                  "transition-all duration-200",
                  "shadow-lg hover:shadow-violet-500/20"
                )}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tailor This Resume
              </Button>
          </CreateTailoredResumeDialog>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 sm:p-6 rounded-2xl",
      "bg-zinc-900/50 border border-zinc-800/80",
      "space-y-6"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
          <FileText className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Cover Letter</h3>
          <p className="text-xs text-zinc-500">AI-powered personalized cover letter</p>
        </div>
      </div>

      {resume.has_cover_letter ? (
        <div className="space-y-4">
          {/* AI Improvement Prompt */}
          <div className={cn(
            "p-3 sm:p-4 rounded-xl",
            "bg-zinc-900/50 border border-zinc-800"
          )}>
            <AIImprovementPrompt
              value={customPrompt}
              onChange={setCustomPrompt}
              isLoading={isGenerating}
              placeholder="e.g., Focus on leadership experience and technical skills"
              hideSubmitButton
              colorTheme="violet"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              size="lg"
              className={cn(
                "h-10 sm:h-12",
                "bg-violet-500/10 hover:bg-violet-500/20",
                "text-violet-400 hover:text-violet-300",
                "border border-violet-500/30 hover:border-violet-500/50",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={generateCoverLetter}
              disabled={isGenerating || !job}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className={cn(
                "h-10 sm:h-12",
                "border-rose-500/30 hover:border-rose-500/50",
                "text-rose-400 hover:text-rose-300",
                "bg-rose-500/5 hover:bg-rose-500/10",
                "transition-all duration-200"
              )}
              onClick={() => updateField('has_cover_letter', false)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Empty State */}
          <div className="p-4 sm:p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/50 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-zinc-800/50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-zinc-700/50">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-500" />
            </div>
            <p className="text-zinc-400 text-sm">No cover letter has been created for this resume yet.</p>
          </div>
          
          {/* Create Button */}
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "w-full h-12",
              "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
              "border border-violet-500/30 hover:border-violet-500/50",
              "text-violet-400 hover:text-violet-300",
              "hover:from-violet-500/20 hover:to-purple-500/20",
              "transition-all duration-200"
            )}
            onClick={() => updateField('has_cover_letter', true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Cover Letter
          </Button>
        </div>
      )}

      <ApiErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title={errorMessage.title}
        description={errorMessage.description}
      />
    </div>
  );
} 