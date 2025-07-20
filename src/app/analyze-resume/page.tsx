'use client'

import { useState } from 'react';
import { generateResumeScore } from '@/utils/actions/resumes/actions';
import { ResumeScoreMetrics } from '@/components/resume/editor/panels/resume-score-panel';
import { Resume } from '@/lib/types';
import { convertTextToResume } from '@/utils/actions/resumes/ai';
import { AnalyzeNavbar } from '@/components/analyze-resume/navbar';
import { AnalyzeHeader } from '@/components/analyze-resume/header';
import { UploadForm } from '@/components/analyze-resume/upload-form';
import { DetailedResults } from '@/components/analyze-resume/detailed-results';
import { ScoreSummary } from '@/components/analyze-resume/score-summary';
import ResumePreviewCard from '@/components/analyze-resume/resume-preview-card';

export default function AnalyzeResumePage() {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreData, setScoreData] = useState<ResumeScoreMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume content');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Create a base resume object for conversion
      const baseResume: Resume = {
        id: 'temp-analysis',
        user_id: 'temp',
        name: 'Resume Analysis',
        target_role: 'General',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '',
        location: '',
        website: '',
        linkedin_url: '',
        github_url: '',
        work_experience: [],
        education: [],
        skills: [],
        projects: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_base_resume: true,
        has_cover_letter: false
      };

      // First, convert the resume text to structured data
      const structuredResume = await convertTextToResume(resumeText, baseResume, 'General', {
        model: 'gemini-2.5-flash-lite-preview-06-17',
        apiKeys: []
      });

      // Then generate the score based on the structured resume data
      const score = await generateResumeScore(structuredResume as Resume, {
        model: 'gemini-2.5-flash-lite-preview-06-17',
        apiKeys: []
      });

      setScoreData(score as ResumeScoreMetrics);
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setScoreData(null);
    setResumeText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <AnalyzeNavbar />

      {/* Main Content with top padding for fixed navbar */}
      <div className="pt-16">
        {/* Main Content - Dynamic Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!scoreData ? (
            /* Upload Form - Split layout with preview */
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
                <ResumePreviewCard />
              </div>
            </div>
          ) : (
            /* Results Layout - Only DetailedResults, shifted left */
            <div className="max-w-2xl mx-auto">
              <DetailedResults 
                scoreData={scoreData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
