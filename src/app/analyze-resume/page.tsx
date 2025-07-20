
"use client";

import { useState } from "react";
import { analyzeResumeFull } from "./actions/analyzeResumeFull"; // 🆕 local action
import { ResumeScoreMetrics } from "@/components/resume/editor/panels/resume-score-panel";
import { AnalyzeNavbar } from "@/components/analyze-resume/navbar";
import { UploadForm } from "@/components/analyze-resume/upload-form";
import { DetailedResults } from "@/components/analyze-resume/detailed-results";
import ResumePreviewCard from "@/components/analyze-resume/resume-preview-card";


export default function AnalyzeResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreData, setScoreData] = useState<ResumeScoreMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Enhanced analyze function using the redesigned analyzeResumeFull action
   * Provides comprehensive analysis with ATS diagnostics and detailed scoring
   */
  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please enter your resume content");
      return;
    }

    // Prevent double submissions
    if (isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // � Single comprehensive analysis request with enhanced features
      const analysisResult = await analyzeResumeFull(resumeText, {
        model: "gemini-2.5-flash-lite-preview-06-17",
        atsEnhanced: true, // Enable advanced ATS diagnostics
        targetRole: "General", // Could be made dynamic based on user input
        includeDetailedFeedback: true,
        apiKeys: [], // API keys handled by server-side configuration
      });

      // Extract score from the comprehensive result
      setScoreData(analysisResult.score);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setScoreData(null);
    setResumeText("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <AnalyzeNavbar />

      {/* Main Content with top padding for fixed navbar */}
      <div className="pt-16">
        {!scoreData ? (
          /* Upload Form - Split layout with preview */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                />
              </div>

              {/* Right Side - Resume Preview Component */}
              <div className="space-y-6">
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
          />
        )}
      </div>
    </div>
  );
}
