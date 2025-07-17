"use client";

import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { generateResumeScore } from "@/utils/actions/resumes/actions";
import { Resume } from "@/lib/types";
import { ApiKey } from "@/utils/ai-tools";

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
          } catch (e) {
            console.warn('Failed to parse stored API keys');
          }
        }
        
      // Call the generateResumeScore action with current resume
      const newScore = await generateResumeScore({
        ...resume,
        section_configs: undefined,
        section_order: undefined
      }, {
        model: selectedModel || 'gemini-2.5-flash-lite-preview-06-17',
        apiKeys: apiKeys
      });

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
      <div className="max-w-4xl mx-auto space-y-6 p-8">
        {error && (
          <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-lg">
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Error generating score</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative p-8 flex flex-col items-center gap-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg border border-blue-200/50">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Resume Score Analysis
              </h1>
              <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
                No score analysis available yet. Generate one to see how your resume measures up!
              </p>
            </div>
            
            <Button
              onClick={handleRecalculate}
              disabled={isCalculating}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-12 px-8"
            >
              <RefreshCw 
                className={cn(
                  "mr-3 h-5 w-5",
                  isCalculating && "animate-spin"
                )} 
              />
              {isCalculating ? "Analyzing Resume..." : "Generate Score Analysis"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // When we have score data, show the full analysis
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-8">
      {error && (
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-lg">
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800">Error generating score</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Recalculate Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleRecalculate}
          disabled={isCalculating}
          variant="outline"
          className="bg-white/80 hover:bg-white border-slate-300 text-slate-700 hover:text-slate-900 shadow-md hover:shadow-lg transition-all duration-300"
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative p-8 flex flex-col items-center gap-6 text-center">
          {/* Title and Description First */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Resume Score Analysis
            </h1>
            <p className="text-slate-700 text-lg leading-relaxed max-w-2xl mx-auto">{scoreData.overallScore.reason}</p>
          </div>
          
          {/* Score Circle Below */}
          <div className="w-44 h-44">
            <CircularProgressbar
              value={scoreData.overallScore.score}
              text={`${scoreData.overallScore.score}%`}
              styles={buildStyles({
                pathColor: `rgba(59, 130, 246, ${scoreData.overallScore.score / 100})`,
                textColor: '#1e40af',
                trailColor: '#e2e8f0',
                pathTransitionDuration: 1.5,
                textSize: '16px'
              })}
            />
          </div>
        </div>
      </Card>

      {/* Key Improvements Card */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-amber-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            Key Improvements
          </h2>
          <div className="space-y-4">
            {scoreData.overallImprovements.map((improvement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-amber-200/50"
              >
                <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                <p className="text-amber-800 font-medium leading-relaxed">{improvement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

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

  const getCardColor = (title: string) => {
    switch (title) {
      case 'Completeness':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'Impact Score':
        return 'from-purple-50 to-violet-50 border-purple-200';
      case 'Role Match':
        return 'from-cyan-50 to-teal-50 border-cyan-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getTitleColor = (title: string) => {
    switch (title) {
      case 'Completeness':
        return 'from-blue-700 to-indigo-700';
      case 'Impact Score':
        return 'from-purple-700 to-violet-700';
      case 'Role Match':
        return 'from-cyan-700 to-teal-700';
      default:
        return 'from-gray-700 to-slate-700';
    }
  };

  return (
    <Card className={cn("bg-gradient-to-br", getCardColor(title), "shadow-lg")}>
      <div className="p-6">
        <h2 className={cn("text-xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent", getTitleColor(title))}>
          {title}
        </h2>
        <div className="grid gap-6">
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
    </Card>
  );
}

function ScoreItem({ label, score, reason }: { label: string; score: number; reason: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-blue-500 to-indigo-500";
    if (score >= 80) return "bg-gradient-to-r from-cyan-500 to-blue-500";
    if (score >= 70) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    if (score >= 60) return "bg-gradient-to-r from-orange-500 to-red-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  const getBadgeColor = (score: number) => {
    if (score >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 70) return "bg-cyan-100 text-cyan-800 border-cyan-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4 bg-white/60 rounded-xl border border-gray-200/50 shadow-sm"
    >
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-gray-800">{label}</span>
        <span className={cn(
          "px-3 py-1.5 rounded-full text-sm font-bold border",
          getBadgeColor(score)
        )}>
          {score}/100
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("h-full rounded-full shadow-sm", getScoreColor(score))}
        />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
        {reason}
      </p>
    </motion.div>
  );
}