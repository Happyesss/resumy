import { Resume, Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Mail, Send, Trash2, Plus, Sparkles, Loader2, MapPin, Calendar, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import type { AIConfig } from "@/utils/ai-tools";
import { generate } from "@/utils/actions/cold-mail/actions";
import { useResumeContext } from "../resume-editor-context";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { CreateTailoredResumeDialog } from "@/components/resume/management/dialogs/create-tailored-resume-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { hasReachedDailyLimit, getRemainingRequests, incrementDailyUsage, DAILY_REQUEST_LIMIT } from '@/lib/daily-limit';
import { toast } from "@/hooks/use-toast";

interface ColdMailPanelProps {
  resume: Resume;
  job: Job | null;
  aiConfig?: AIConfig;
}

export function ColdMailPanel({
  resume,
  job,
  aiConfig,
}: ColdMailPanelProps) {
  const { dispatch } = useResumeContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', description: '' });
  
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

  const generateColdMail = async () => {
    if (!job) {
      setErrorMessage({
        title: 'No Target Job',
        description: 'This feature requires a target job. Please ensure you have job information available.'
      });
      setShowErrorDialog(true);
      return;
    }

    // Check daily API request limit
    if (hasReachedDailyLimit()) {
      toast({
        title: "Daily Request Limit Reached",
        description: `You have reached the daily limit of ${DAILY_REQUEST_LIMIT} AI requests. Please try again tomorrow.`,
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
        } catch (e) {
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
      incrementDailyUsage();

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
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Cold Mail Generator</h2>
          </div>
          <p className="text-gray-300 max-w-md mx-auto">
            Generate professional cold emails to companies using your resume and job information.
          </p>
        </div>

        {/* Base Resume Notice */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl p-8 border border-purple-500/30 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Tailor Your Resume First</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Cold mail generation is available for tailored resumes only. Create a tailored version of your resume to unlock this feature.
          </p>
          <CreateTailoredResumeDialog baseResumes={[resume]}>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-5 w-5 mr-2" />
              Tailor This Resume
            </Button>
          </CreateTailoredResumeDialog>
        </div>
      </div>
    );
  }

  // Show "no job" message for tailored resumes without job context
  if (!job) {
    return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Cold Mail Generator</h2>
          </div>
          <p className="text-gray-300">
            Generate professional cold emails to companies based on your resume and target company information.
          </p>
        </div>

        {/* No Job Notice */}
        <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-8 border border-orange-500/30 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building className="h-6 w-6 text-orange-400" />
            <h3 className="text-xl font-semibold text-white">No Target Job Found</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Cold mail generation requires target job information. Please add a job to this resume to generate personalized cold emails.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {/* Compact Header */}
      <div className="flex items-center gap-2 mb-1">
        <Mail className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-bold text-white">Cold Outreach Email</h2>
      </div>
      <p className="text-gray-400 text-sm mb-2">Reach out directly to hiring managers or recruiters. Use this email to introduce yourself and express interest in opportunities at your target company.</p>
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-2 text-xs text-yellow-300 mb-2">
        Tip: Cold emails work best when you personalize your message and show genuine interest. Mention something unique about the company or role.
      </div>

      {/* Company Info */}
      {job && (
        <div className="bg-blue-950/30 rounded-lg p-2 border border-blue-500/20 mb-2 flex flex-col gap-1">
          <span className="text-white text-sm">
            <Building className="inline h-4 w-4 mr-1 text-blue-400" />
            Target: <b>{job.company_name && job.company_name.trim() !== ''
              ? job.company_name
              : (resume.name.includes(' at ') ? resume.name.split(' at ')[1] : 'Company')}</b>
            {' | '}
            <span className="text-blue-400">
              Role: <b>{job.position_title && job.position_title.trim() !== ''
                ? job.position_title
                : (resume.target_role || 'Position')}</b>
            </span>
          </span>
        </div>
      )}

      {/* Email Address Input */}
      <div className="bg-gray-900/70 rounded-lg p-2 border border-gray-700/50 mb-2">
        <Input
          id="to"
          value={mailData.to}
          onChange={(e) => setMailData(prev => ({ ...prev, to: e.target.value }))}
          placeholder="To (e.g. hiring@google.com)"
          className="bg-gray-800/90 border-gray-600/50 text-white text-xs mb-1 placeholder:text-gray-400/70 focus:bg-gray-800 focus:border-gray-500"
        />
        <Textarea
          id="customPrompt"
          value={mailData.customPrompt}
          onChange={(e) => setMailData(prev => ({ ...prev, customPrompt: e.target.value }))}
          placeholder="What makes you interested in this company? (optional)"
          className="bg-gray-800/90 border-gray-600/50 text-white text-xs min-h-[40px] placeholder:text-gray-400/70 focus:bg-gray-800 focus:border-gray-500"
        />
        <Button
          onClick={generateColdMail}
          disabled={isGenerating || !job}
          className="w-full mt-2 bg-blue-600 text-white text-xs py-1 transition-colors duration-200 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
          {isGenerating ? "Generating..." : "Generate Cold Email"}
        </Button>
      </div>

      {/* Generated Email Display */}
      {(mailData.subject || mailData.body) && (
        <div className="bg-gray-900/70 rounded-lg border border-gray-700/50 p-2 mt-2">
          {mailData.subject && (
            <div className="mb-1">
              <span className="text-blue-300 text-xs">Email Subject</span>
              <div className="bg-gray-800/90 border border-gray-600/50 rounded p-1 text-white text-xs">{mailData.subject}</div>
            </div>
          )}
          {mailData.body && (
            <div>
              <span className="text-blue-300 text-xs">Message</span>
              <div className="bg-gray-800/90 border border-gray-600/50 rounded p-2 text-white whitespace-pre-wrap font-mono text-xs max-h-[250px] overflow-y-auto">{mailData.body}</div>
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => copyToClipboard(`Subject: ${mailData.subject}\n\n${mailData.body}`)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 text-xs px-2 py-1"
            >
              <Mail className="h-3 w-3 mr-1" /> Copy Email
            </Button>
            <Button
              onClick={() => copyToClipboard(mailData.body)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 text-xs px-2 py-1"
            >Copy Message</Button>
            <Button
              onClick={clearMail}
              variant="outline"
              className="border-red-600 text-red-400 hover:text-white hover:bg-red-600 text-xs px-2 py-1"
            ><Trash2 className="h-3 w-3 mr-1" />Clear</Button>
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
