'use client'

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Target, TrendingUp, Award, Users, Zap, FileText, Brain, Eye, Shield, User, BarChart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from '@/lib/utils';
import { ResumeScoreMetrics } from '@/components/resume/editor/panels/resume-score-panel';
import { ATSTimeline } from './ats-timeline';
import { useState, useEffect } from 'react';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface DetailedResultsProps {
  scoreData: ResumeScoreMetrics;
  onAnalyzeAnother?: () => void;
  resumeText?: string; // Add resume text for preview
  resumeFile?: File | null; // Add resume file for PDF display
  keywordAnalysis?: {
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
  };
  isProcessing?: boolean; // Add processing state
}

// Simple font size estimation helper function
const estimateFontSizeFromFile = (file: File): number => {
  const fileSizeKB = file.size / 1024;
  
  // Estimate font size based on file size (rough heuristic)
  if (fileSizeKB < 50) return 12.0;      // Small file, likely larger font
  else if (fileSizeKB < 100) return 11.0; // Medium file
  else if (fileSizeKB < 200) return 10.5; // Larger file
  else return 10.0;                        // Large file, likely smaller font
};

// Function to analyze resume and suggest missing keywords (fallback only)
const analyzeKeywords = (resumeText?: string) => {
  // Return empty results - we only want to use Gemini AI suggestions
  return { existingKeywords: [], missingKeywords: [], suggestions: [] };
};

export function DetailedResults({ scoreData, onAnalyzeAnother, resumeText, resumeFile, keywordAnalysis, isProcessing = false }: DetailedResultsProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [averageFontSize, setAverageFontSize] = useState<number | null>(null);
  const [lineCount, setLineCount] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
  }, []);

  // Scroll to top when the results page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Debug log to see what data we're receiving
  console.log('DetailedResults received props:', {
    hasScoreData: !!scoreData,
    resumeTextLength: resumeText?.length || 0,
    resumeTextPreview: resumeText?.substring(0, 100) || 'No text',
    hasResumeFile: !!resumeFile,
    hasKeywordAnalysis: !!keywordAnalysis
  });

  // Only use backend keyword analysis - no client-side fallback for suggestions
  const finalKeywordAnalysis = keywordAnalysis || { existingKeywords: [], missingKeywords: [], suggestions: [] };

  useEffect(() => {
    // Calculate line count from resumeText with better logic
    if (resumeText && resumeText.trim().length > 0) {
      // Split by line breaks and count meaningful lines
      const allLines = resumeText.split(/\r?\n/);
      const nonEmptyLines = allLines.filter(line => line.trim().length > 0);
      
      // For better accuracy, also count lines with significant content
      const meaningfulLines = allLines.filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 2 && !trimmed.match(/^\s*[\•\-\*]\s*$/);
      });
      
      // Use the higher count for better representation
      const calculatedLineCount = Math.max(nonEmptyLines.length, meaningfulLines.length);
      
      // Fallback: If we get very few lines but lots of content, estimate based on content
      let finalLineCount = calculatedLineCount;
      if (calculatedLineCount < 5 && resumeText.length > 500) {
        // Estimate lines based on content patterns (sentences, bullet points, etc.)
        const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 10);
        const bulletPoints = (resumeText.match(/[•\-\*]\s+/g) || []).length;
        const paragraphs = resumeText.split(/\n\s*\n/).filter(p => p.trim().length > 20);
        
        finalLineCount = Math.max(
          calculatedLineCount,
          Math.floor(sentences.length * 0.7),
          bulletPoints + paragraphs.length,
          Math.floor(resumeText.length / 80) // Rough estimate: ~80 chars per line
        );
      }
      
      console.log('Line count analysis:', {
        totalText: resumeText.length,
        allLines: allLines.length,
        nonEmptyLines: nonEmptyLines.length,
        meaningfulLines: meaningfulLines.length,
        originalCount: calculatedLineCount,
        finalCount: finalLineCount,
        sampleLines: allLines.slice(0, 5)
      });
      
      setLineCount(finalLineCount);
    } else {
      console.log('No resume text available for line count');
      setLineCount(0);
    }

    // Try to get PDF from resumeFile first, then from localStorage
    if (resumeFile && resumeFile.type === 'application/pdf') {
      const url = URL.createObjectURL(resumeFile);
      setPdfUrl(url);
      // Estimate font size from PDF file
      const estimatedSize = estimateFontSizeFromFile(resumeFile);
      setAverageFontSize(estimatedSize);
      return () => URL.revokeObjectURL(url); // Cleanup
    } else {
      // Try to get from localStorage
      const storedPdfData = localStorage.getItem('resumePdfData');
      
      if (storedPdfData) {
        setPdfUrl(storedPdfData);
        // Set a reasonable default for stored PDFs
        setAverageFontSize(11.0);
      } else {
        setAverageFontSize(null); // Reset font size for non-PDF files
      }
    }
  }, [resumeFile, resumeText]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return { color: '#22c55e', label: 'Excellent', bgColor: 'bg-green-500', textColor: 'text-green-400' };
    if (score >= 80) return { color: '#eab308', label: 'Very Good', bgColor: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (score >= 70) return { color: '#f97316', label: 'Good', bgColor: 'bg-orange-500', textColor: 'text-orange-400' };
    if (score >= 60) return { color: '#ef4444', label: 'Needs Improvement', bgColor: 'bg-red-500', textColor: 'text-red-400' };
    return { color: '#dc2626', label: 'Poor', bgColor: 'bg-red-600', textColor: 'text-red-500' };
  };

  const scoreInfo = getScoreColor(scoreData.overallScore.score);

  // Calculate statistics
  const allScores = [
    scoreData.completeness.contactInformation.score,
    scoreData.completeness.detailLevel.score,
    scoreData.impactScore.activeVoiceUsage.score,
    scoreData.impactScore.quantifiedAchievements.score,
    scoreData.roleMatch.skillsRelevance.score,
    scoreData.roleMatch.experienceAlignment.score,
    scoreData.roleMatch.educationFit.score
  ];
  const averageScore = Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);
  const highestScore = Math.max(...allScores);
  const lowestScore = Math.min(...allScores);

  // Organize scores by category for better display
  const organizedScores = [
    {
      title: 'Completeness',
      icon: FileText,
      color: 'blue',
      items: [
        { name: 'Contact Information', ...scoreData.completeness.contactInformation },
        { name: 'Detail Level', ...scoreData.completeness.detailLevel }
      ]
    },
    {
      title: 'Impact & Voice',
      icon: TrendingUp,
      color: 'purple',
      items: [
        { name: 'Active Voice Usage', ...scoreData.impactScore.activeVoiceUsage },
        { name: 'Quantified Achievements', ...scoreData.impactScore.quantifiedAchievements }
      ]
    },
    {
      title: 'Role Matching',
      icon: Target,
      color: 'green',
      items: [
        { name: 'Skills Relevance', ...scoreData.roleMatch.skillsRelevance },
        { name: 'Experience Alignment', ...scoreData.roleMatch.experienceAlignment },
        { name: 'Education Fit', ...scoreData.roleMatch.educationFit }
      ]
    }
  ];

  return (

    <div className="min-h-screen text-white">
      {/* Compact Professional Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 -mt-8">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Icon and Title Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500/10">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight text-center">Your Resume Analysis Results</h1>
          </div>
          <div className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 px-2">
            Discover how your resume performs against industry standards and get <span className="text-blue-400 font-semibold">AI-powered insights</span> to land your dream job
          </div>
          {/* Score indicator row */}
          <div className="flex flex-wrap items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-800/70 rounded-full border border-gray-700 w-fit mx-auto text-xs sm:text-sm">
            <span className={cn("w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mr-1", scoreInfo.bgColor)} />
            <span className="text-white font-medium">Overall Score:</span>
            <span className={cn(scoreInfo.textColor, "font-semibold ml-1")}>{scoreData.overallScore.score}/100</span>
            <Badge variant="outline" className={cn("text-xs border ml-1 sm:ml-2 px-1 sm:px-2 py-0.5", scoreInfo.textColor)}>
              {scoreInfo.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

        {/* Left Column - Main Score */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <Card className="bg-gray-800 border-gray-700 p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-6">
                <CircularProgressbar
                  value={scoreData.overallScore.score}
                  text={`${scoreData.overallScore.score}`}
                  styles={buildStyles({
                    textSize: '20px',
                    textColor: '#ffffff',
                    pathColor: scoreInfo.color,
                    trailColor: '#374151',
                    backgroundColor: '#1f2937',
                  })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>1</span>
                  <span>100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${scoreData.overallScore.score}%`,
                      backgroundColor: scoreInfo.color 
                    }}
                  />
                </div>
                <p className="text-gray-300 text-xs sm:text-sm mt-4">{scoreData.overallScore.reason}</p>
              </div>
            </div>
            {isAuthenticated ? (
              <Link href="/home">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-white bg-purple-500 hover:bg-purple-600 transition-all duration-200 text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow" />
                  <span className="hidden sm:inline">Enhance your resume score</span>
                  <span className="sm:hidden">Enhance Score</span>
                </button>
              </Link>
            ) : (
              <AuthDialog defaultTab="login">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-white bg-purple-500 hover:bg-purple-600 transition-all duration-200 text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow" />
                  <span className="hidden sm:inline">Enhance your resume score</span>
                  <span className="sm:hidden">Enhance Score</span>
                </button>
              </AuthDialog>
            )}
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="bg-gray-800 border-gray-700 p-3 sm:p-4">
              <div className="text-center">
                <div className="text-green-400 text-sm font-medium mb-1">100%</div>
                <div className="text-xs text-gray-400">High impact</div>
                <div className="text-xs text-gray-500 hidden sm:block">Percentage of achievements you've quantified on time</div>
              </div>
            </Card>
            <Card className="bg-gray-800 border-gray-700 p-3 sm:p-4">
              <div className="text-center">
                <div className="text-red-400 text-sm font-medium mb-1">2%</div>
                <div className="text-xs text-gray-400">Low impact</div>
                <div className="text-xs text-gray-500 hidden sm:block">How much experience you can add compared to your total time</div>
              </div>
            </Card>
          </div>

          {/* Ready for Another Analysis Card */}
          {onAnalyzeAnother && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-0"
            >
              <Card className="bg-gray-800 border-gray-700 p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Ready for Another Analysis?</h3>
                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Upload a new resume to get detailed insights and recommendations</p>
                <button
                  onClick={onAnalyzeAnother}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  Analyze Another Resume
                </button>
              </Card>
            </motion.div>
          )}

          {/* ATS Timeline Component */}
          <ATSTimeline 
            scoreData={scoreData}
            resumeFile={resumeFile}
            keywordAnalysis={keywordAnalysis}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Column - Categories */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Top Row: Completeness and Resume Preview side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Left: Completeness Component */}
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-blue-500/20">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">Completeness</h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {organizedScores[0].items.map((item, index) => {
                    const itemScore = getScoreColor(item.score);
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-gray-900/50 rounded-lg p-2 sm:p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-700 rounded flex items-center justify-center">
                              <BarChart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" />
                            </div>
                            <h4 className="text-white font-medium text-xs sm:text-sm">{item.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold text-xs sm:text-sm">{item.score}%</div>
                            <div className={cn("text-xs", itemScore.textColor)}>
                              {itemScore.label}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mb-2">
                          <div 
                            className="h-1.5 sm:h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${item.score}%`,
                              backgroundColor: itemScore.color 
                            }}
                          />
                        </div>
                        
                        <p className="text-gray-400 text-xs leading-tight">{item.reason}</p>
                      </motion.div>
                    );
                  })}

                  {/* Keyword Suggestions Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-2 sm:p-3 border border-blue-500/20"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500/20 rounded flex items-center justify-center">
                        <Brain className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-400" />
                      </div>
                      <h4 className="text-blue-300 font-medium text-xs sm:text-sm">Keyword Suggestions</h4>
                    </div>
                    
                    {finalKeywordAnalysis.suggestions.length > 0 ? (
                      <>
                        <p className="text-gray-400 text-xs mb-2 sm:mb-3">
                          AI-powered keyword suggestions to improve ATS compatibility:
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                          {finalKeywordAnalysis.suggestions.map((keyword) => (
                            <span
                              key={keyword}
                              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>

                        {finalKeywordAnalysis.existingKeywords.length > 0 && (
                          <div className="mb-2">
                            <p className="text-green-400 text-xs mb-1">✓ Keywords already present:</p>
                            <div className="flex flex-wrap gap-1">
                              {finalKeywordAnalysis.existingKeywords.slice(0, 6).map((keyword) => (
                                <span
                                  key={keyword}
                                  className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded border border-green-500/20"
                                >
                                  {keyword}
                                </span>
                              ))}
                              {finalKeywordAnalysis.existingKeywords.length > 6 && (
                                <span className="text-green-400 text-xs py-1">
                                  +{finalKeywordAnalysis.existingKeywords.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : keywordAnalysis ? (
                      <p className="text-green-400 text-xs mb-3">
                        ✓ Great! Your resume already contains excellent keyword coverage.
                      </p>
                    ) : (
                      <p className="text-gray-400 text-xs mb-3">
                        🤖 AI keyword analysis will appear here after processing your resume.
                      </p>
                    )}
                    
                    <p className="text-gray-500 text-xs mt-2">
                      💡 Tip: Include 2-3 of these keywords naturally in your experience descriptions
                    </p>
                  </motion.div>
                </div>
              </div>
            </Card>

            {/* Right: Resume Preview */}
            {(pdfUrl || resumeText) && (
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">Resume Preview</h3>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400">
                      <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span className="hidden sm:inline">{pdfUrl ? 'PDF' : 'Text'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-1.5 sm:p-2">
                    {pdfUrl ? (
                      /* Compact PDF Iframe Display */
                      <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
                        {/* PDF Viewer Header */}
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <FileText className="h-2 w-2 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {localStorage.getItem('resumePdfName') || 'Resume.pdf'}
                            </span>
                          </div>
                        </div>
                        {/* Slightly taller PDF Content in iframe */}
                        <iframe
                          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-[250px] sm:h-[350px] lg:h-[400px] border-none"
                          title="Resume PDF"
                          style={{ border: 'none' }}
                        />
                      </div>
                    ) : (
                      /* Text display */
                      <div className="bg-white text-black rounded-lg shadow-xl max-h-[250px] sm:max-h-[350px] overflow-hidden relative border border-gray-300">
                        <div className="bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 border-b border-gray-200">
                          <span className="text-xs font-medium text-gray-700">Resume.txt</span>
                        </div>
                        <div className="p-2 sm:p-4 h-[250px] sm:h-[350px] lg:h-[360px] overflow-y-auto bg-white">
                          <div className="text-xs text-black leading-relaxed">
                            {resumeText?.substring(0, 1400)}...
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Document info */}
                    {resumeText && (
                      <div className="mt-1.5 sm:mt-2">
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-xs">
                          <div className="bg-gray-800 rounded p-1.5 sm:p-2 text-center">
                            <div className="text-blue-400 font-medium text-xs">{resumeText.split(' ').length}</div>
                            <div className="text-gray-400 text-xs">Words</div>
                          </div>
                          <div className="bg-gray-800 rounded p-1.5 sm:p-2 text-center">
                            <div className="text-green-400 font-medium text-xs">{lineCount}</div>
                            <div className="text-gray-400 text-xs">Lines</div>
                          </div>
                          <div className="bg-gray-800 rounded p-1.5 sm:p-2 text-center">
                            <div className="text-purple-400 font-medium text-xs">
                              {pdfUrl ? (averageFontSize ? `${averageFontSize}px` : 'Loading...') : `${(resumeText.length / 1024).toFixed(1)}KB`}
                            </div>
                            <div className="text-gray-400 text-xs">{pdfUrl ? 'Font' : 'Size'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs mt-1.5 sm:mt-2 text-center px-1">
                    <span className="inline-block align-middle">💡 <b>Tip:</b> For a good ATS resume, font size matters too! Aim for 10–12px for best readability and parsing.</span>
                        </div>
                </div>
              </Card>
            )}
          </div>

          {/* Remaining categories below */}
          {organizedScores.slice(1).map((category, categoryIndex) => (
            <Card key={category.title} className="bg-gray-800 border-gray-700">
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                    category.color === 'blue' ? 'bg-blue-500/20' : 
                    category.color === 'purple' ? 'bg-purple-500/20' : 'bg-green-500/20'
                  }`}>
                    <category.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${
                      category.color === 'blue' ? 'text-blue-400' : 
                      category.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                    }`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">{category.title}</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">{category.items.map((item, index) => {
                    const itemScore = getScoreColor(item.score);
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                        className="bg-gray-900/50 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 rounded flex items-center justify-center">
                              <BarChart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400" />
                            </div>
                            <h4 className="text-white font-medium text-sm sm:text-base">{item.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold text-sm sm:text-base">{item.score}%</div>
                            <div className={cn("text-xs", itemScore.textColor)}>
                              {itemScore.label}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mb-2 sm:mb-3">
                          <div 
                            className="h-1.5 sm:h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${item.score}%`,
                              backgroundColor: itemScore.color 
                            }}
                          />
                        </div>
                        
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.reason}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}

          {/* Improvements Section */}
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Key Improvements</h3>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {scoreData.overallImprovements.map((improvement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-900/50 rounded-lg"
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400" />
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{improvement}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          {/* Miscellaneous Scores */}
          {scoreData.miscellaneous && Object.keys(scoreData.miscellaneous ?? {}).length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">Additional Analysis</h3>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  {Object.entries(scoreData.miscellaneous ?? {}).map(([key, data], index) => {
                    const miscScore = getScoreColor(data.score);
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-900/50 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium text-sm sm:text-base capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <div className="text-right">
                            <div className="text-white font-semibold text-sm sm:text-base">{data.score}%</div>
                            <div className={cn("text-xs", miscScore.textColor)}>
                              {miscScore.label}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mb-2">
                          <div 
                            className="h-1.5 sm:h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${data.score}%`,
                              backgroundColor: miscScore.color 
                            }}
                          />
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{data.reason}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
