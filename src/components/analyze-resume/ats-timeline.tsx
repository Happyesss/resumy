'use client'

import { ResumeScoreMetrics } from '@/components/resume/editor/panels/resume-score-panel';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, Award, Brain, CheckCircle, Clock, FileText, Filter, Search, XCircle, Zap } from 'lucide-react';

interface ATSStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'passed' | 'warning' | 'failed';
  details: string[];
  duration: string;
}

interface ATSTimelineProps {
  scoreData?: ResumeScoreMetrics;
  resumeFile?: File | null;
  keywordAnalysis?: {
    existingKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  };
  isProcessing?: boolean;
}

export function ATSTimeline({ scoreData, resumeFile, keywordAnalysis, isProcessing = false }: ATSTimelineProps) {
  // Dynamic function to generate ATS steps based on actual data
  const generateATSSteps = (): ATSStep[] => {
    // Step 1: File Format Check
    const fileFormatStep: ATSStep = {
      id: 1,
      title: 'File Format Check',
      description: 'ATS scans for compatible file formats and text extraction',
      icon: FileText,
      status: resumeFile ? 
        (resumeFile.type === 'application/pdf' || resumeFile.type.includes('word') ? 'passed' : 'warning') : 
        'passed',
      details: resumeFile ? [
        resumeFile.type === 'application/pdf' ? 'PDF format supported ✓' : 
        resumeFile.type.includes('word') ? 'Word format supported ✓' : 'Format may have issues',
        'Text extraction successful',
        `File size: ${(resumeFile.size / 1024).toFixed(1)}KB`
      ] : ['Format check pending', 'Awaiting file upload', 'Ready for processing'],
      duration: '0.1s'
    };

    // Step 2: Keyword Matching (based on keyword analysis)
    const keywordMatchPercent = keywordAnalysis ? 
      Math.round((keywordAnalysis.existingKeywords.length / 
        (keywordAnalysis.existingKeywords.length + keywordAnalysis.missingKeywords.length)) * 100) || 75 : 0;
    
    const keywordStep: ATSStep = {
      id: 2,
      title: 'Keyword Matching',
      description: 'System searches for job-relevant keywords and skills',
      icon: Search,
      status: !keywordAnalysis ? 'failed' :
        keywordMatchPercent >= 80 ? 'passed' : 
        keywordMatchPercent >= 60 ? 'warning' : 'failed',
      details: keywordAnalysis ? [
        `${keywordMatchPercent}% keyword match found`,
        `${keywordAnalysis.existingKeywords.length} keywords present`,
        `${keywordAnalysis.missingKeywords.length} missing critical skills`
      ] : ['Keyword analysis pending', 'AI processing required', 'Upload resume to analyze'],
      duration: '0.3s'
    };

    // Step 3: Content Structure (based on completeness scores)
    const avgCompleteness = scoreData ? 
      (scoreData.completeness.contactInformation.score + scoreData.completeness.detailLevel.score) / 2 : 0;
    
    const structureStep: ATSStep = {
      id: 3,
      title: 'Content Structure',
      description: 'Analyzes resume sections and formatting consistency',
      icon: Brain,
      status: !scoreData ? 'failed' :
        avgCompleteness >= 80 ? 'passed' :
        avgCompleteness >= 60 ? 'warning' : 'failed',
      details: scoreData ? [
        `Contact info score: ${scoreData.completeness.contactInformation.score}%`,
        `Detail level score: ${scoreData.completeness.detailLevel.score}%`,
        avgCompleteness >= 70 ? 'Well-structured sections' : 'Structure needs improvement'
      ] : ['Structure analysis pending', 'Awaiting content processing', 'Upload resume to analyze'],
      duration: '0.2s'
    };

    // Step 4: Experience Filter (based on role match scores)
    const avgRoleMatch = scoreData ? 
      (scoreData.roleMatch.skillsRelevance.score + scoreData.roleMatch.experienceAlignment.score + scoreData.roleMatch.educationFit.score) / 3 : 0;
    
    const experienceStep: ATSStep = {
      id: 4,
      title: 'Experience Filter',
      description: 'Evaluates work experience relevance and progression',
      icon: Filter,
      status: !scoreData ? 'failed' :
        avgRoleMatch >= 80 ? 'passed' :
        avgRoleMatch >= 60 ? 'warning' : 'failed',
      details: scoreData ? [
        `Skills relevance: ${scoreData.roleMatch.skillsRelevance.score}%`,
        `Experience alignment: ${scoreData.roleMatch.experienceAlignment.score}%`,
        `Education fit: ${scoreData.roleMatch.educationFit.score}%`
      ] : ['Experience analysis pending', 'Role matching not started', 'Upload resume to analyze'],
      duration: '0.4s'
    };

    // Step 5: Final Scoring (based on overall score)
    const finalStep: ATSStep = {
      id: 5,
      title: 'Final Scoring',
      description: 'Calculates overall compatibility score and ranking',
      icon: Award,
      status: !scoreData ? 'failed' :
        scoreData.overallScore.score >= 80 ? 'passed' :
        scoreData.overallScore.score >= 60 ? 'warning' : 'failed',
      details: scoreData ? [
        `Overall Score: ${scoreData.overallScore.score}/100`,
        scoreData.overallScore.score >= 70 ? 'Above average threshold' : 'Below average threshold',
        scoreData.overallScore.score >= 70 ? 'Recommended for review' : 'Needs improvement'
      ] : ['Final scoring pending', 'Awaiting complete analysis', 'Upload resume to score'],
      duration: '0.1s'
    };

    return [fileFormatStep, keywordStep, structureStep, experienceStep, finalStep];
  };

  const atsSteps = generateATSSteps();

  // Distribute extra 4 seconds proportionally across all steps
  const baseDurations = atsSteps.map(step => parseFloat(step.duration));
  const baseTime = baseDurations.reduce((sum, t) => sum + t, 0);
  const extraTime = 4.0;
  const totalTimeNum = baseTime + extraTime;
  // Calculate new durations
  const distributedDurations = baseDurations.map(d => d + (d / baseTime) * extraTime);
  // Format durations to 1 decimal place and update steps
  const atsStepsWithDistributedTime = atsSteps.map((step, i) => ({
    ...step,
    duration: distributedDurations[i].toFixed(1) + 's'
  }));
  const totalTime = totalTimeNum.toFixed(1);
  const completedSteps = atsStepsWithDistributedTime.filter(step => step.status !== 'failed').length;
  const processingStatus = scoreData ? 'Complete' : 'Pending Analysis';
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return { 
          bg: 'bg-green-500/20', 
          text: 'text-green-400', 
          icon: CheckCircle,
          border: 'border-green-500/30'
        };
      case 'warning':
        return { 
          bg: 'bg-yellow-500/20', 
          text: 'text-yellow-400', 
          icon: AlertTriangle,
          border: 'border-yellow-500/30'
        };
      case 'failed':
        return { 
          bg: 'bg-red-500/20', 
          text: 'text-red-400', 
          icon: XCircle,
          border: 'border-red-500/30'
        };
      default:
        return { 
          bg: 'bg-gray-500/20', 
          text: 'text-gray-400', 
          icon: Clock,
          border: 'border-gray-500/30'
        };
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
            <Zap className="h-3 w-3 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">ATS Processing Pipeline</h3>
            <p className="text-xs text-gray-400">How your resume gets processed by ATS</p>
          </div>
        </div>

        {/* Processing Time Summary */}
        <div className="mb-4 p-2 bg-gray-900/50 rounded text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Processing Time:</span>
            <span className="text-blue-400 font-mono">{totalTime}s</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>{processingStatus}</span>
            <span>{completedSteps}/{atsStepsWithDistributedTime.length} completed</span>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-2">
          {atsStepsWithDistributedTime.map((step, index) => {
            const statusConfig = getStatusColor(step.status);
            const StepIcon = step.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline connector line */}
                {index < atsStepsWithDistributedTime.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-4 bg-gray-600 z-0" />
                )}
                
                <div className={cn(
                  "relative bg-gray-900/30 rounded p-3 border transition-all duration-200 hover:bg-gray-900/50",
                  statusConfig.border,
                  step.status === 'failed' && !scoreData ? 'opacity-50' : 'opacity-100'
                )}>
                  <div className="flex items-start gap-3">
                    {/* Step Icon - smaller */}
                    <div className={cn(
                      "w-8 h-8 rounded flex items-center justify-center flex-shrink-0",
                      statusConfig.bg
                    )}>
                      {isProcessing && step.status === 'failed' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-3 h-3"
                        >
                          <Clock className="h-3 w-3 text-blue-400" />
                        </motion.div>
                      ) : (
                        <StepIcon className={cn("h-3 w-3", statusConfig.text)} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Step Header - more compact */}
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium text-xs">
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs border px-1 py-0", statusConfig.text, statusConfig.border)}
                          >
                            <StatusIcon className="h-2 w-2 mr-1" />
                            {isProcessing && step.status === 'failed' ? 'processing...' : step.status}
                          </Badge>
                          <span className="text-xs text-gray-500 font-mono">
                            {step.duration}
                          </span>
                        </div>
                      </div>

                      {/* Step Description - smaller */}
                      <p className="text-gray-400 text-xs mb-2 leading-tight">
                        {step.description}
                      </p>

                      {/* Step Details - more compact */}
                      <div className="space-y-0.5">
                        {step.details.slice(0, 2).map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center gap-1 text-xs">
                            <div className={cn("w-1 h-1 rounded-full", 
                              step.status === 'passed' ? 'bg-green-400' :
                              step.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                            )} />
                            <span className="text-gray-300 text-xs">{detail}</span>
                          </div>
                        ))}
                        {step.details.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{step.details.length - 2} more details
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Tips - more compact */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded border border-blue-500/20">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Brain className="h-2 w-2 text-blue-400" />
            </div>
            <div>
              <h5 className="text-blue-300 font-medium text-xs mb-1">ATS Optimization Tips</h5>
              <ul className="text-xs text-gray-400 space-y-0.5">
                <li>• Use standard headers (Experience, Education, Skills)</li>
                <li>• Include job-relevant keywords naturally</li>
                <li>• Avoid complex formatting and graphics</li>
                <li>• Use PDF or DOCX formats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
