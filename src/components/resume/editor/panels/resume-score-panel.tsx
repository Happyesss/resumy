"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { hasReachedAILimit, incrementAIUsage } from "@/lib/ai-request-limit";
import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { generateResumeScore } from "@/utils/actions/resumes/actions";
import { ApiKey } from "@/utils/ai-tools";
import { motion } from "framer-motion";
import { AlertCircle, FileText, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export interface ResumeScoreMetrics {
  overallScore: {
    score: number;
    reason: string;
  };
  
  completeness: {
    contactInformation: {
      score: number;
      reason: string;
    };
    detailLevel: {
      score: number;
      reason: string;
    };
  };
  
  impactScore: {
    activeVoiceUsage: {
      score: number;
      reason: string;
    };
    quantifiedAchievements: {
      score: number;
      reason: string;
    };
  };

  roleMatch: {
    skillsRelevance: {
      score: number;
      reason: string;
    };
    experienceAlignment: {
      score: number;
      reason: string;
    };
    educationFit: {
      score: number;
      reason: string;
    };
  };

  miscellaneous?: {
    [key: string]: {
      score: number;
      reason: string;
    };
  };

  overallImprovements: string[];
}

// Add props interface
interface ResumeScorePanelProps {
  resume: Resume;
  userEmail?: string | null;
}

const LOCAL_STORAGE_KEY = 'resumelm-resume-scores';
const MAX_SCORES = 10;

function getStoredScores(resumeId: string): ResumeScoreMetrics | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return null;
    
    const scores = new Map(JSON.parse(stored));
    return scores.get(resumeId) as ResumeScoreMetrics | null;
  } catch (error) {
    console.error('Error reading stored scores:', error);
    return null;
  }
}

function updateStoredScores(resumeId: string, score: ResumeScoreMetrics) {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const scores = stored ? new Map(JSON.parse(stored)) : new Map();

    // Maintain only MAX_SCORES entries
    if (scores.size >= MAX_SCORES) {
      const oldestKey = scores.keys().next().value;
      scores.delete(oldestKey);
    }

    scores.set(resumeId, score);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(scores)));
  } catch (error) {
    console.error('Error storing score:', error);
  }
}

export default function ResumeScorePanel({ resume }: ResumeScorePanelProps) {
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState<ResumeScoreMetrics | null>(() => {
    // Initialize with stored score if available
    return getStoredScores(resume.id);
  });

  // Add useEffect for initial load
  useEffect(() => {
    const storedScore = getStoredScores(resume.id);
    if (storedScore) {
      setScoreData(storedScore);
    }
  }, [resume.id]);

  const handleRecalculate = async () => {
    // Check AI request limit
    if (hasReachedAILimit()) {
      toast({
        title: "AI Request Limit Reached",
  description: "You have reached your daily AI request limit.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCalculating(true);
    setError(null);
    try {
        const MODEL_STORAGE_KEY = 'resumelm-default-model';
        const API_KEYS_STORAGE_KEY = 'resumelm-api-keys';
  
        const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY);
        const storedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
        
        // Parse stored API keys or use empty array as fallback
        let apiKeys: ApiKey[] = [];
        if (storedKeys) {
          try {
            apiKeys = JSON.parse(storedKeys);
          } catch (_e) {
            console.warn('Failed to parse stored API keys');
          }
        }
        
      // Call the generateResumeScore action with current resume
      const newScore = await generateResumeScore({
        ...resume,
        section_configs: undefined,
        section_order: undefined
      }, {
        model: selectedModel || 'gemini-2.5-flash-lite',
        apiKeys: apiKeys
      });

      // Increment AI usage after successful API call
      incrementAIUsage();

      // Update state and storage
      setScoreData(newScore as ResumeScoreMetrics);
      updateStoredScores(resume.id, newScore as ResumeScoreMetrics);
    } catch (error) {
      console.error("Error generating score:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate resume score. Please try again.";
      setError(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  };

  // If no score data is available, show the empty state
  if (!scoreData) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        {error && (
          <div className={cn(
            "p-4 rounded-xl",
            "bg-rose-500/10 border border-rose-500/30",
            "flex items-center gap-3"
          )}>
            <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/30">
              <AlertCircle className="h-5 w-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-rose-300">Error generating score</h3>
              <p className="text-rose-400/80 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}
        
        <div className={cn(
          "p-4 sm:p-6 rounded-2xl",
          "bg-zinc-900/50 border border-zinc-800/80",
          "space-y-6 text-center"
        )}>
          <div className="space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-amber-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-amber-500/20">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Resume Score Analysis
              </h3>
              <p className="text-zinc-400 leading-relaxed max-w-sm mx-auto text-sm">
                No score analysis available yet. Generate one to see how your resume measures up!
              </p>
            </div>
            
            <Button
              onClick={handleRecalculate}
              disabled={isCalculating}
              size="lg"
              className={cn(
                "mt-4 sm:mt-6 h-10 sm:h-12",
                "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
                "border border-amber-500/30 hover:border-amber-500/50",
                "text-amber-400 hover:text-amber-300",
                "hover:from-amber-500/20 hover:to-orange-500/20",
                "transition-all duration-200",
                "shadow-lg hover:shadow-amber-500/20",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <RefreshCw 
                className={cn(
                  "mr-2 h-5 w-5",
                  isCalculating && "animate-spin"
                )} 
              />
              {isCalculating ? "Analyzing Resume..." : "Generate Score Analysis"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // When we have score data, show the full analysis
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {error && (
        <div className={cn(
          "p-4 rounded-xl",
          "bg-rose-500/10 border border-rose-500/30",
          "flex items-center gap-3"
        )}>
          <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/30">
            <AlertCircle className="h-5 w-5 text-rose-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-rose-300">Error generating score</h3>
            <p className="text-rose-400/80 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}
      
      {/* Recalculate Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleRecalculate}
          disabled={isCalculating}
          variant="outline"
          size="sm"
          className={cn(
            "h-10",
            "border-zinc-700 hover:border-amber-500/50",
            "text-zinc-400 hover:text-amber-400",
            "bg-zinc-900/50 hover:bg-amber-500/10",
            "transition-all duration-200"
          )}
        >
          <RefreshCw 
            className={cn(
              "mr-2 h-4 w-4",
              isCalculating && "animate-spin"
            )} 
          />
          Recalculate Score
        </Button>
      </div>

      {/* Main Score Card */}
      <div className={cn(
        "p-4 sm:p-6 rounded-2xl",
        "bg-zinc-900/50 border border-zinc-800/80"
      )}>
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Title and Description */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                <FileText className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Resume Score Analysis
              </h3>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto text-sm">{scoreData.overallScore.reason}</p>
          </div>
          
          {/* Score Circle */}
          <div className="w-28 h-28 sm:w-40 sm:h-40">
            <CircularProgressbar
              value={scoreData.overallScore.score}
              text={`${scoreData.overallScore.score}%`}
              styles={buildStyles({
                pathColor: `rgba(245, 158, 11, ${scoreData.overallScore.score / 100})`,
                textColor: '#fbbf24',
                trailColor: '#27272a',
                pathTransitionDuration: 1.5,
                textSize: '16px'
              })}
            />
          </div>
        </div>
      </div>

      {/* Key Improvements Card */}
      <div className={cn(
        "p-4 sm:p-6 rounded-2xl",
        "bg-zinc-900/50 border border-zinc-800/80"
      )}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          Key Improvements
        </h2>
        <div className="space-y-3">
          {scoreData.overallImprovements.map((improvement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50"
            >
              <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
              <p className="text-zinc-300 text-sm leading-relaxed">{improvement}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      {Object.entries({
        Completeness: scoreData.completeness,
        "Impact Score": scoreData.impactScore,
        "Role Match": scoreData.roleMatch,
        ...(scoreData.miscellaneous && Object.keys(scoreData.miscellaneous).length > 0 && {
          "Additional Metrics": scoreData.miscellaneous
        })
      }).map(([title, metrics]) => (
        <MetricsCard key={title} title={title} metrics={metrics} />
      ))}
    </div>
  );
}

function MetricsCard({ title, metrics }: { title: string; metrics: Record<string, { score: number; reason: string }> }) {
  // Handle case where metrics might be undefined or null
  if (!metrics || typeof metrics !== 'object') {
    return null;
  }

  const getIconColor = (title: string) => {
    switch (title) {
      case 'Completeness':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' };
      case 'Impact Score':
        return { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' };
      case 'Role Match':
        return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' };
      default:
        return { bg: 'bg-zinc-800/50', border: 'border-zinc-700/50', text: 'text-zinc-400' };
    }
  };

  const colors = getIconColor(title);

  return (
    <div className={cn(
      "p-4 sm:p-6 rounded-2xl",
      "bg-zinc-900/50 border border-zinc-800/80"
    )}>
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center border",
          colors.bg,
          colors.border
        )}>
          <Sparkles className={cn("h-4 w-4", colors.text)} />
        </div>
        {title}
      </h2>
      <div className="space-y-4">
        {Object.entries(metrics).map(([label, data]) => {
          // Additional safety check for each metric
          if (!data || typeof data !== 'object' || typeof data.score !== 'number' || typeof data.reason !== 'string') {
            return null;
          }
          return (
            <ScoreItem key={label} label={label} {...data} />
          );
        })}
      </div>
    </div>
  );
}

function ScoreItem({ label, score, reason }: { label: string; score: number; reason: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-emerald-500 to-green-500";
    if (score >= 80) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    if (score >= 70) return "bg-gradient-to-r from-amber-500 to-yellow-500";
    if (score >= 60) return "bg-gradient-to-r from-orange-500 to-amber-600";
    return "bg-gradient-to-r from-rose-500 to-red-500";
  };

  const getBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (score >= 70) return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-zinc-200">{label}</span>
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-semibold border",
          getBadgeColor(score)
        )}>
          {score}/100
        </span>
      </div>
      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", getScoreColor(score))}
        />
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
        {reason}
      </p>
    </motion.div>
  );
}