import { CreateTailoredResumeDialog } from "@/components/resume/management/dialogs/create-tailored-resume-dialog";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { hasReachedAILimit, incrementAIUsage } from '@/lib/ai-request-limit';
import { Job, Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { generate } from "@/utils/actions/cold-mail/actions";
import type { AIConfig } from "@/utils/ai-tools";
import { readStreamableValue } from 'ai/rsc';
import { Building, Info, Loader2, Mail, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useState } from 'react';
import { useResumeContext } from "../resume-editor-context";

interface ColdMailPanelProps {
  resume: Resume;
  job: Job | null;
  aiConfig?: AIConfig;
  userEmail?: string | null;
}

export function ColdMailPanel({
  resume,
  job,
}: ColdMailPanelProps) {
  const { dispatch } = useResumeContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', description: '' });
  const [showTip, setShowTip] = useState(false);
  
  // Mail composition state
  const [mailData, setMailData] = useState({
    to: '',
    subject: '',
    body: '',
    customPrompt: ''
  });

  const updateField = (field: keyof Resume, value: Resume[keyof Resume]) => {
    dispatch({ 
      type: 'UPDATE_FIELD',
      field,
      value
    });
  };
  
  // Silence unused variable warning
  void updateField;

  const generateColdMail = async () => {
    if (!job) {
      setErrorMessage({
        title: 'No Target Job',
        description: 'This feature requires a target job. Please ensure you have job information available.'
      });
      setShowErrorDialog(true);
      return;
    }

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
      // Get API key from environment variable for mail generation
      const MODEL_STORAGE_KEY = 'resumelm-default-model';
      const LOCAL_STORAGE_KEY = 'resumelm-api-keys';

      const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY);
      const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      let apiKeys = [];
      if (storedKeys) {
        try {
          apiKeys = JSON.parse(storedKeys);
        } catch (_e) {
          console.warn('Failed to parse stored API keys');
        }
      }

      // Prepare mail generation prompt
      const promptData = {
        resume,
        job,
        recipientName: 'Hiring Manager',
        customPrompt: mailData.customPrompt
      };

      const stream = await generate(JSON.stringify(promptData), {
        model: selectedModel || 'gemini-2.5-flash-lite',
        apiKeys: apiKeys
      });
      // Increment usage after successful AI call
      incrementAIUsage();

      let generatedContent = '';
      let extractedSubject = '';
      let subjectExtracted = false;
      
      for await (const delta of readStreamableValue(stream)) {
        if (delta) {
          // Accumulate content instead of overwriting
          generatedContent += String(delta);
          
          // Only extract subject line once from the complete content when we have enough text
          if (!subjectExtracted && generatedContent.includes('\n')) {
            const subjectMatch = generatedContent.match(/^Subject(?:\s*Line)?:\s*(.+?)(?:\n|$)/i);
            if (subjectMatch) {
              extractedSubject = subjectMatch[1].trim();
              generatedContent = generatedContent.replace(/^Subject(?:\s*Line)?:\s*.+?(?:\n|$)/i, '').trim();
              subjectExtracted = true;
            }
          }
          
          setMailData(prev => ({
            ...prev,
            body: generatedContent,
            subject: extractedSubject || prev.subject
          }));
        }
      }

      // Auto-generate subject if not extracted and not provided
      if (!extractedSubject && !mailData.subject) {
        const companyName = job.company_name || (resume.name.includes(' at ') ? resume.name.split(' at ')[1] : 'Your Company');
        const position = job.position_title || resume.target_role || 'the position';
        setMailData(prev => ({
          ...prev,
          subject: `Application for ${position} at ${companyName}`
        }));
      }

    } catch (error) {
      console.error('Error generating cold mail:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to generate cold mail';
      setErrorMessage({
        title: 'Generation Failed',
        description: errorMsg
      });
      setShowErrorDialog(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearMail = () => {
    setMailData({
      to: '',
      subject: '',
      body: '',
      customPrompt: ''
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Show "tailor resume" message for base resumes
  if (resume.is_base_resume) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Mail className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Cold Mail Generator</h3>
            <p className="text-xs text-zinc-500">Professional cold emails for job outreach</p>
          </div>
        </div>

        {/* Base Resume Notice */}
        <div className={cn(
          "p-6 rounded-2xl",
          "bg-zinc-900/50 border border-zinc-800/80",
          "space-y-4 text-center"
        )}>
          <div className="space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-violet-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-violet-500/20">
              <Sparkles className="h-5 w-5 sm:h-8 sm:w-8 text-violet-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Tailor Your Resume First
              </h3>
              <p className="text-zinc-400 leading-relaxed max-w-sm mx-auto text-sm">
                Cold mail generation is available for tailored resumes only. Create a tailored version of your resume to unlock this feature.
              </p>
            </div>
            
            <CreateTailoredResumeDialog baseResumes={[resume]}>
              <Button
                size="lg"
                className={cn(
                  "mt-4 sm:mt-6 h-10 sm:h-12",
                  "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
                  "border border-violet-500/30 hover:border-violet-500/50",
                  "text-violet-400 hover:text-violet-300",
                  "hover:from-violet-500/20 hover:to-purple-500/20",
                  "transition-all duration-200",
                  "shadow-lg hover:shadow-violet-500/20"
                )}
              >
                <Plus className="h-5 w-5 mr-2" />
                Tailor This Resume
              </Button>
            </CreateTailoredResumeDialog>
          </div>
        </div>
      </div>
    );
  }

  // Show "no job" message for tailored resumes without job context
  if (!job) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Mail className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Cold Mail Generator</h3>
            <p className="text-xs text-zinc-500">Professional cold emails based on your resume</p>
          </div>
        </div>

        {/* No Job Notice */}
        <div className={cn(
          "p-4 sm:p-6 rounded-2xl",
          "bg-zinc-900/50 border border-zinc-800/80",
          "space-y-4 text-center"
        )}>
          <div className="space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-amber-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-amber-500/20">
              <Building className="h-5 w-5 sm:h-8 sm:w-8 text-amber-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                No Target Job Found
              </h3>
              <p className="text-zinc-400 leading-relaxed max-w-sm mx-auto text-sm">
                Cold mail generation requires target job information. Please add a job to this resume to generate personalized cold emails.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
          <Mail className="h-5 w-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Cold Outreach Email</h3>
          <p className="text-xs text-zinc-500">Reach out directly to hiring managers</p>
        </div>
        <button
          onClick={() => setShowTip(!showTip)}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "hover:bg-amber-500/10",
            showTip ? "bg-amber-500/10 text-amber-400" : "text-zinc-400 hover:text-amber-400"
          )}
          aria-label="Toggle tip"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {/* Tip Card - Only shown when clicked */}
      {showTip && (
        <div className={cn(
          "p-3 sm:p-4 rounded-xl animate-in slide-in-from-top-2 duration-200",
          "bg-amber-500/10 border border-amber-500/30",
          "relative"
        )}>
          <button
            onClick={() => setShowTip(false)}
            className="absolute top-2 right-2 p-1 rounded-md hover:bg-amber-500/20 text-amber-400 transition-colors"
            aria-label="Close tip"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-amber-300 text-xs leading-relaxed pr-6">
            <span className="font-semibold">Tip:</span> Cold emails work best when you personalize your message and show genuine interest. Mention something unique about the company or role.
          </p>
        </div>
      )}

      {/* Company Info */}
      {job && (
        <div className={cn(
          "p-4 rounded-xl",
          "bg-zinc-900/50 border border-zinc-800/80",
          "flex items-center gap-3"
        )}>
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
            <Building className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex-1 text-sm">
            <span className="text-zinc-300">
              Target: <span className="font-semibold text-white">{job.company_name && job.company_name.trim() !== ''
                ? job.company_name
                : (resume.name.includes(' at ') ? resume.name.split(' at ')[1] : 'Company')}</span>
            </span>
            <span className="text-zinc-500 mx-2">|</span>
            <span className="text-blue-400">
              Role: <span className="font-semibold text-blue-300">{job.position_title && job.position_title.trim() !== ''
                ? job.position_title
                : (resume.target_role || 'Position')}</span>
            </span>
          </div>
        </div>
      )}

      {/* Email Generation Form */}
      <div className={cn(
        "p-3 sm:p-4 rounded-2xl",
        "bg-zinc-900/50 border border-zinc-800/80",
        "space-y-3"
      )}>
        <div className="space-y-3">
          <div>
            <label htmlFor="to" className="text-xs text-zinc-400 mb-1.5 block">Recipient Email</label>
            <Input
              id="to"
              value={mailData.to}
              onChange={(e) => setMailData(prev => ({ ...prev, to: e.target.value }))}
              placeholder="hiring@company.com"
              className={cn(
                "h-10 sm:h-12 bg-zinc-900/50 border-zinc-800",
                "text-zinc-200 placeholder:text-zinc-500",
                "focus:border-blue-500/50 focus:bg-zinc-900",
                "transition-all duration-200"
              )}
            />
          </div>
          
          <div>
            <label htmlFor="customPrompt" className="text-xs text-zinc-400 mb-1.5 block">Personalization (Optional)</label>
            <Textarea
              id="customPrompt"
              value={mailData.customPrompt}
              onChange={(e) => setMailData(prev => ({ ...prev, customPrompt: e.target.value }))}
              placeholder="What makes you interested in this company?"
              className={cn(
                "min-h-[80px] sm:min-h-[100px] bg-zinc-900/50 border-zinc-800",
                "text-zinc-200 placeholder:text-zinc-500",
                "focus:border-blue-500/50 focus:bg-zinc-900",
                "transition-all duration-200",
                "resize-none"
              )}
            />
          </div>
        </div>
        
        <Button
          onClick={generateColdMail}
          disabled={isGenerating || !job}
          className={cn(
            "w-full h-10 sm:h-12",
            "bg-gradient-to-r from-blue-500/10 to-cyan-500/10",
            "border border-blue-500/30 hover:border-blue-500/50",
            "text-blue-400 hover:text-blue-300",
            "hover:from-blue-500/20 hover:to-cyan-500/20",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Cold Email
            </>
          )}
        </Button>
      </div>

      {/* Generated Email Display */}
      {(mailData.subject || mailData.body) && (
        <div className={cn(
          "p-4 rounded-2xl",
          "bg-zinc-900/50 border border-zinc-800/80",
          "space-y-4"
        )}>
          {mailData.subject && (
            <div>
              <label className="text-xs text-blue-400 mb-2 block font-semibold">Email Subject</label>
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-200 text-sm">
                {mailData.subject}
              </div>
            </div>
          )}
          {mailData.body && (
            <div>
              <label className="text-xs text-blue-400 mb-2 block font-semibold">Message</label>
              <div className={cn(
                "p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl",
                "text-zinc-200 whitespace-pre-wrap text-sm leading-relaxed",
                "max-h-[240px] overflow-y-auto"
              )}>
                {mailData.body}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => copyToClipboard(`Subject: ${mailData.subject}\n\n${mailData.body}`)}
              variant="outline"
              size="sm"
              className={cn(
                "flex-1 h-10",
                "border-blue-500/30 hover:border-blue-500/50",
                "text-blue-400 hover:text-blue-300",
                "bg-blue-500/5 hover:bg-blue-500/10"
              )}
            >
              <Mail className="h-4 w-4 mr-2" />
              Copy Email
            </Button>
            <Button
              onClick={clearMail}
              variant="outline"
              size="sm"
              className={cn(
                "h-10",
                "border-rose-500/30 hover:border-rose-500/50",
                "text-rose-400 hover:text-rose-300",
                "bg-rose-500/5 hover:bg-rose-500/10"
              )}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      <ApiErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title={errorMessage.title}
        description={errorMessage.description}
      />
    </div>
  );
}
