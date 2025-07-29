"use client";

import { useState, useEffect } from "react";
import { analyzeResumeFull } from "./actions/analyzeResumeFull"; // 🆕 local action
import { ResumeScoreMetrics } from "@/components/resume/editor/panels/resume-score-panel";
import { AnalyzeNavbar } from "@/components/analyze-resume/navbar";
import { UploadForm } from "@/components/analyze-resume/upload-form";
import { DetailedResults } from "@/components/analyze-resume/detailed-results";
import ResumePreviewCard from "@/components/analyze-resume/resume-preview-card";
import { createClient } from "@/utils/supabase/client";
import { Metadata } from "next";

// Note: Client components can't export metadata directly
// This metadata should be moved to a layout.tsx or page wrapper

interface KeywordAnalysis {
  existingKeywords: string[];
  missingKeywords: string[];
  categoryAnalysis: {
    programming: string[];
    frameworks: string[];
    tools: string[];
    cloud: string[];
    databases: string[];
  };
  suggestions: string[];
}

export default function AnalyzeResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreData, setScoreData] = useState<ResumeScoreMetrics | null>(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [delayCountdown, setDelayCountdown] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [apiKeyTestResult, setApiKeyTestResult] = useState<any>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please enter your resume content");
      return;
    }

    // Prevent double submissions
    if (isAnalyzing || delayCountdown !== null) {
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {

      
      // 4-second delay with countdown to avoid rate limiting
      setDelayCountdown(4);
      
      const countdownInterval = setInterval(() => {
        setDelayCountdown((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(countdownInterval);
            return null;
          }
        });
      }, 1000);

      await new Promise(resolve => setTimeout(resolve, 4000));

      // Single comprehensive analysis request with enhanced features
      const analysisResult = await analyzeResumeFull(resumeText, {
        model: "gemini-2.5-flash-lite",
        atsEnhanced: true,
        targetRole: "General",
        includeDetailedFeedback: true,
        apiKeys: [],
      });

      setScoreData(analysisResult.score);
      setKeywordAnalysis(analysisResult.keywordAnalysis);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
      setDelayCountdown(null);
    }
  };

  const handleAnalyzeAnother = () => {
    setScoreData(null);
    setKeywordAnalysis(null);
    setResumeText("");
    setResumeFile(null);
    setError(null);
    // Clear localStorage
    localStorage.removeItem('resumePdfData');
    localStorage.removeItem('resumePdfName');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar - Only show AnalyzeNavbar for non-authenticated users */}
      {/* For authenticated users, AppHeader is already shown by layout.tsx */}
      {isAuthenticated === false && <AnalyzeNavbar />}

      <div className="pt-16 lg:pt-20">

        
        {!scoreData ? (
          /* Upload Form - Split layout with preview */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Left Side - Compact Upload Form */}
              <div className="space-y-6">
                <UploadForm
                  resumeText={resumeText}
                  setResumeText={setResumeText}
                  isAnalyzing={isAnalyzing}
                  error={error}
                  setError={setError}
                  onAnalyze={handleAnalyze}
                  hasResults={false}
                  setResumeFile={setResumeFile}
                />
              </div>

              {/* Right Side - Resume Preview Component */}
              <div className="space-y-6 mt-8 lg:mt-0">
                {/* Pass current text so preview updates live */}
                <ResumePreviewCard resumeText={resumeText} />
              </div>
            </div>
          </div>
        ) : (
          /* Results Layout - Full Screen DetailedResults */
          <DetailedResults
            scoreData={scoreData}
            onAnalyzeAnother={handleAnalyzeAnother}
            resumeText={resumeText}
            resumeFile={resumeFile}
            keywordAnalysis={keywordAnalysis || undefined}
            isProcessing={isAnalyzing || delayCountdown !== null}
          />
        )}
      </div>
    </div>
  );
}
