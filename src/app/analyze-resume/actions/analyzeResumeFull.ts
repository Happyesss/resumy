'use server'

import { Resume } from "@/lib/types";
import { ResumeScoreMetrics } from "@/components/resume/editor/panels/resume-score-panel";
import { ApiKey, initializeAIClient } from "@/utils/ai-tools";
import { generateObject } from "ai";
import { LanguageModelV1 } from "ai";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from "zod";
import { resumeScoreSchema } from "@/lib/zod-schemas";
import { simplifiedResumeSchema } from "@/lib/zod-schemas";

/**
 * Enhanced ATS diagnostics interface for comprehensive resume analysis
 */
interface AtsDiagnostics {
  sectionOrder: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  dateGaps: {
    score: number;
    issues: string[];
    gapMonths: number[];
  };
  keywordDensity: {
    score: number;
    issues: string[];
    missingKeywords: string[];
  };
  formatting: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  atsCompatibility: {
    score: number;
    issues: string[];
    passesAtsTest: boolean;
  };
}

/**
 * Configuration options for the resume analysis
 */
interface AnalysisConfig {
  model?: string;
  atsEnhanced?: boolean;
  apiKeys?: ApiKey[];
  targetRole?: string;
  baseResumeTemplate?: Partial<Resume>;
  includeDetailedFeedback?: boolean;
}

/**
 * Complete analysis result containing all analysis data
 */
interface FullAnalysisResult {
  score: ResumeScoreMetrics;
  structuredResume: Resume;
  keywordAnalysis: {
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
  atsDiagnostics?: AtsDiagnostics;
  processingTime: number;
  analysisMetadata: {
    modelUsed: string;
    atsEnhanced: boolean;
    targetRole: string;
    timestamp: string;
  };
}

/**
 * Advanced ATS diagnostics runner
 * Performs comprehensive analysis of resume structure and ATS compatibility
 */
async function runAdvancedAtsDiagnostics(resume: Resume): Promise<AtsDiagnostics> {
  // Section order analysis
  const expectedOrder = ['work_experience', 'education', 'skills', 'projects'];
  const actualOrder = resume.section_order || [];
  const orderScore = calculateSectionOrderScore(actualOrder, expectedOrder);

  // Date gap analysis
  const dateGaps = analyzeEmploymentGaps(resume.work_experience);
  const gapScore = calculateGapScore(dateGaps);

  // Keyword density analysis
  const keywordAnalysis = analyzeKeywordDensity(resume);
  
  // Formatting analysis
  const formattingAnalysis = analyzeFormatting(resume);
  
  // Overall ATS compatibility
  const atsCompatibility = {
    score: Math.round((orderScore + gapScore + keywordAnalysis.score + formattingAnalysis.score) / 4),
    issues: [] as string[],
    passesAtsTest: true
  };
  
  const avgScore = (orderScore + gapScore + keywordAnalysis.score + formattingAnalysis.score) / 4;
  atsCompatibility.passesAtsTest = avgScore >= 75;
  
  if (avgScore < 75) {
    atsCompatibility.issues.push('Resume may have difficulty passing ATS filters');
    if (orderScore < 80) atsCompatibility.issues.push('Section order could be improved');
    if (keywordAnalysis.score < 70) atsCompatibility.issues.push('Keyword optimization needed');
    if (formattingAnalysis.score < 80) atsCompatibility.issues.push('Formatting improvements recommended');
  }

  return {
    sectionOrder: {
      score: orderScore,
      issues: actualOrder.length === 0 ? ['No section order defined'] : [],
      recommendations: orderScore < 80 ? ['Consider reordering sections to: Work Experience, Education, Skills, Projects'] : []
    },
    dateGaps: {
      score: gapScore,
      issues: dateGaps.length > 0 ? [`Found ${dateGaps.length} employment gap(s)`] : [],
      gapMonths: dateGaps
    },
    keywordDensity: keywordAnalysis,
    formatting: formattingAnalysis,
    atsCompatibility: atsCompatibility
  };
}

/**
 * Calculate section order score based on best practices
 */
function calculateSectionOrderScore(actual: string[], expected: string[]): number {
  if (actual.length === 0) return 50;
  
  let score = 100;
  const maxPenalty = 30;
  
  for (let i = 0; i < Math.min(actual.length, expected.length); i++) {
    if (actual[i] !== expected[i]) {
      score -= maxPenalty / expected.length;
    }
  }
  
  return Math.max(0, Math.round(score));
}

/**
 * Analyze employment gaps in work experience
 */
function analyzeEmploymentGaps(workExperience: any[]): number[] {
  if (!workExperience || workExperience.length < 2) return [];
  
  const gaps: number[] = [];
  // This is a simplified implementation - in reality you'd parse dates more carefully
  // For now, return empty array as placeholder
  return gaps;
}

/**
 * Calculate score based on employment gaps
 */
function calculateGapScore(gaps: number[]): number {
  if (gaps.length === 0) return 100;
  
  const totalGapMonths = gaps.reduce((sum, gap) => sum + gap, 0);
  
  if (totalGapMonths <= 3) return 95;
  if (totalGapMonths <= 6) return 85;
  if (totalGapMonths <= 12) return 70;
  return 50;
}

/**
 * Analyze keyword density and relevance
 */
function analyzeKeywordDensity(resume: Resume): { score: number; issues: string[]; missingKeywords: string[] } {
  const skills = resume.skills || [];
  const workExp = resume.work_experience || [];
  
  // Simple keyword analysis - count technical skills and action verbs
  const technicalSkills = skills.filter(skill => 
    skill.items.some(item => 
      item.toLowerCase().includes('javascript') ||
      item.toLowerCase().includes('python') ||
      item.toLowerCase().includes('react') ||
      item.toLowerCase().includes('node')
    )
  );
  
  const hasActionVerbs = workExp.some(exp => 
    exp.description && exp.description.some((desc: string) => 
      desc.toLowerCase().includes('developed') ||
      desc.toLowerCase().includes('managed') ||
      desc.toLowerCase().includes('implemented') ||
      desc.toLowerCase().includes('led')
    )
  );
  
  let score = 60;
  const issues: string[] = [];
  const missingKeywords: string[] = [];
  
  if (technicalSkills.length > 0) score += 20;
  else {
    issues.push('Limited technical keywords found');
    missingKeywords.push('technical skills');
  }
  
  if (hasActionVerbs) score += 20;
  else {
    issues.push('Few action verbs found in experience descriptions');
    missingKeywords.push('action verbs');
  }
  
  return { score: Math.min(100, score), issues, missingKeywords };
}

/**
 * Analyze formatting and structure
 */
function analyzeFormatting(resume: Resume): { score: number; issues: string[]; recommendations: string[] } {
  let score = 90;
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check for essential contact information
  if (!resume.email) {
    score -= 10;
    issues.push('Missing email address');
    recommendations.push('Add professional email address');
  }
  
  if (!resume.phone_number) {
    score -= 5;
    issues.push('Missing phone number');
    recommendations.push('Add contact phone number');
  }
  
  if (!resume.location) {
    score -= 5;
    issues.push('Missing location information');
    recommendations.push('Add city and state/country');
  }
  
  return { score: Math.max(0, score), issues, recommendations };
}

/**
 * Combined schema for single AI request that returns both structured resume and score
 */
const combinedAnalysisSchema = z.object({
  structuredResume: simplifiedResumeSchema,
  scoreMetrics: resumeScoreSchema,
  keywordAnalysis: z.object({
    existingKeywords: z.array(z.string()).describe("Technical keywords found in the resume"),
    missingKeywords: z.array(z.string()).describe("Relevant keywords missing from the resume that would improve ATS compatibility"),
    categoryAnalysis: z.object({
      programming: z.array(z.string()),
      frameworks: z.array(z.string()),
      tools: z.array(z.string()),
      cloud: z.array(z.string()),
      databases: z.array(z.string())
    }).describe("Categorized keywords found in resume"),
    suggestions: z.array(z.string()).describe("Top 6-8 keyword suggestions based on existing skills and career trajectory")
  })
});

/**
 * Single AI request function that parses resume and generates score in one call
 * This reduces API calls from 2 to 1, improving performance and reducing costs
 */
async function analyzeResumeWithSingleAIRequest(
  resumeText: string,
  targetRole: string,
  model: string,
  apiKeys: ApiKey[]
): Promise<{ structuredResume: Resume; score: ResumeScoreMetrics; keywordAnalysis: any }> {
  try {
    // Use specific GEMINI_ANALYZE_API_KEY for resume analysis if available
    const analyzeApiKey = process.env.GEMINI_ANALYZE_API_KEY;
    
    // Initialize AI client with appropriate key
    const aiClient = analyzeApiKey 
      ? createGoogleGenerativeAI({ apiKey: analyzeApiKey })(model) as LanguageModelV1
      : initializeAIClient({ model, apiKeys });
    
    // ...existing code...
    
    const { object } = await generateObject({
      model: aiClient,
      schema: combinedAnalysisSchema,
      prompt: `
You are a professional resume analysis AI. Analyze the following resume text and provide:
1. A structured JSON representation of the resume
2. A comprehensive scoring breakdown
3. Intelligent keyword analysis and suggestions

Resume Text:
${resumeText}

Target Role: ${targetRole}

Instructions:
1. FIRST, parse the resume text into structured data with these exact fields:
   - Extract personal information (name, email, phone, location, etc.)
   - Parse work experience with company, position, dates, and bullet-point descriptions
   - Extract education details
   - Identify skills and categorize them
   - Find any projects mentioned

2. SECOND, analyze and score the resume based on:
   - Overall Score (0-100): Holistic assessment
   - Completeness: 
     * Contact Information: Award 100 if email, phone, location are present. Deduct 10-15 per missing field
     * Detail Level: Assess if work experience, skills, education have sufficient detail
   - Impact Score:
     * Active Voice Usage: Look for action verbs and active voice
     * Quantified Achievements: Check for numbers, percentages, measurable results
   - Role Match:
     * Skills Relevance: How relevant are listed skills for ${targetRole}
     * Experience Alignment: How well does experience match typical requirements
     * Education Fit: How appropriate is education level
   - Miscellaneous (exactly 3 metrics):
     * keywordOptimization: Industry keyword usage
     * formatting: Structure and organization
     * lengthAppropriate: Appropriate length for experience level

3. THIRD, perform intelligent keyword analysis:
   - Identify ALL technical keywords currently in the resume (programming languages, frameworks, tools, platforms, methodologies)
   - Categorize them into: programming, frameworks, tools, cloud, databases
   - Based on existing skills and experience, suggest 6-8 complementary keywords that would:
     * Be DIRECTLY RELATED to their current tech stack (e.g., if they have React, suggest Next.js/TypeScript, NOT unrelated technologies)
     * Enhance their existing skill set rather than suggesting completely different domains
     * Match their experience level (don't suggest advanced cloud platforms if they're a frontend developer)
     * Be logical progression from their current skills
   - AVOID suggesting keywords from completely different domains (e.g., don't suggest AWS to someone who only has frontend skills, don't suggest Python to someone who only works with Java)
   - Focus on missing keywords that complement their existing ecosystem
   - If they have Java/Spring Boot, suggest related Java ecosystem tools
   - If they have JavaScript/React, suggest related frontend/Node.js ecosystem tools
   - If they have Python, suggest Python ecosystem tools
   - Only suggest cloud platforms if they already have backend/DevOps experience

4. Provide 3-5 specific improvement suggestions

Return the response in this exact structure:
{
  "structuredResume": {
    "first_name": "extracted first name",
    "last_name": "extracted last name", 
    "email": "extracted email",
    "phone_number": "extracted phone",
    "location": "extracted location",
    "website": "extracted website",
    "linkedin_url": "extracted linkedin",
    "github_url": "extracted github",
    "work_experience": [array of work experiences],
    "education": [array of education],
    "skills": [array of skill categories],
    "projects": [array of projects]
  },
  "scoreMetrics": {
    "overallScore": {"score": number, "reason": "explanation"},
    "completeness": {
      "contactInformation": {"score": number, "reason": "explanation"},
      "detailLevel": {"score": number, "reason": "explanation"}
    },
    "impactScore": {
      "activeVoiceUsage": {"score": number, "reason": "explanation"},
      "quantifiedAchievements": {"score": number, "reason": "explanation"}
    },
    "roleMatch": {
      "skillsRelevance": {"score": number, "reason": "explanation"},
      "experienceAlignment": {"score": number, "reason": "explanation"},
      "educationFit": {"score": number, "reason": "explanation"}
    },
    "miscellaneous": {
      "keywordOptimization": {"score": number, "reason": "explanation"},
      "formatting": {"score": number, "reason": "explanation"},
      "lengthAppropriate": {"score": number, "reason": "explanation"}
    },
    "overallSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  },
  "keywordAnalysis": {
    "existingKeywords": ["list of all technical keywords found in resume"],
    "missingKeywords": ["list of relevant missing keywords"],
    "categoryAnalysis": {
      "programming": ["programming languages found"],
      "frameworks": ["frameworks/libraries found"], 
      "tools": ["development tools found"],
      "cloud": ["cloud platforms found"],
      "databases": ["databases found"]
    },
    "suggestions": ["6-8 contextually relevant keyword suggestions based on existing skills"]
  }
}

Be thorough, accurate, and provide constructive feedback. Focus on intelligent keyword analysis that considers their current tech stack and career trajectory.
      `
    });

    // ...existing code...

    // Transform the simplified resume to full Resume object
    const fullResume: Resume = {
      id: `temp-analysis-${Date.now()}`,
      user_id: "temp-ui-session",
      name: "Resume Analysis",
      target_role: targetRole,
      first_name: object.structuredResume.first_name || "",
      last_name: object.structuredResume.last_name || "",
      email: object.structuredResume.email || "",
      phone_number: object.structuredResume.phone_number || "",
      location: object.structuredResume.location || "",
      website: object.structuredResume.website || "",
      linkedin_url: object.structuredResume.linkedin_url || "",
      github_url: object.structuredResume.github_url || "",
      work_experience: (object.structuredResume.work_experience || []).map(exp => ({
        company: exp.company || "",
        position: exp.position || "",
        location: exp.location || "",
        date: exp.date || "",
        description: exp.description || [],
        technologies: exp.technologies || []
      })),
      education: (object.structuredResume.education || []).map(edu => ({
        school: edu.school || "",
        degree: edu.degree || "",
        field: edu.field || "",
        location: edu.location || "",
        date: edu.date || "",
        gpa: edu.gpa || "",
        achievements: edu.achievements || []
      })),
      skills: (object.structuredResume.skills || []).map(skill => ({
        category: skill.category || "",
        items: skill.items || []
      })),
      projects: (object.structuredResume.projects || []).map(project => ({
        name: project.name || "",
        description: project.description || [],
        technologies: project.technologies || [],
        github_url: project.github_url || "",
        url: project.url || "",
        date: project.date || ""
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_base_resume: true,
      has_cover_letter: false,
      section_order: ['work_experience', 'education', 'skills', 'projects'],
      section_configs: {
        work_experience: { visible: true },
        education: { visible: true },
        skills: { visible: true },
        projects: { visible: true }
      }
    };

    return {
      structuredResume: fullResume,
      score: object.scoreMetrics as ResumeScoreMetrics,
      keywordAnalysis: object.keywordAnalysis
    };

  } catch (error) {
    // ...existing code...
    throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Main function: Comprehensive resume analysis in a single request
 * 
 * This function performs the complete resume analysis pipeline:
 * 1. Converts raw text to structured resume data
 * 2. Runs advanced ATS diagnostics (optional)
 * 3. Generates comprehensive scoring
 * 4. Returns all analysis results
 * 
 * @param resumeText - Raw resume text content
 * @param config - Analysis configuration options
 * @returns Complete analysis results
 */
export async function analyzeResumeFull(
  resumeText: string,
  config: AnalysisConfig = {}
): Promise<FullAnalysisResult> {
  const startTime = Date.now();
  // Note: The specialized GEMINI_ANALYZE_API_KEY will be used if available
  // This is configured in the analyzeResumeWithSingleAIRequest function
  const {
    model = "gemini-2.5-flash-lite",
    atsEnhanced = true,
    apiKeys = [],
    targetRole = "General",
    baseResumeTemplate = {},
    includeDetailedFeedback = true
  } = config;

  // ...existing code...

  try {
    // Step 1: Single AI request for both parsing and scoring
    const { structuredResume, score, keywordAnalysis } = await analyzeResumeWithSingleAIRequest(
      resumeText,
      targetRole,
      model,
      apiKeys
    );

    // Step 2: Run ATS diagnostics (if enabled) - this is local processing
    let atsDiagnostics: AtsDiagnostics | undefined;
    if (atsEnhanced) {
      // ...existing code...
      atsDiagnostics = await runAdvancedAtsDiagnostics(structuredResume);
    }

    const processingTime = Date.now() - startTime;

    // ...existing code...

    return {
      score,
      structuredResume,
      keywordAnalysis,
      atsDiagnostics,
      processingTime,
      analysisMetadata: {
        modelUsed: model,
        atsEnhanced,
        targetRole,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    throw new Error(`Resume analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Lightweight version for quick analysis (without ATS diagnostics)
 * This is a separate implementation to avoid calling analyzeResumeFull internally
 */
export async function analyzeResumeQuick(
  resumeText: string,
  config: Omit<AnalysisConfig, 'atsEnhanced'> = {}
): Promise<Omit<FullAnalysisResult, 'atsDiagnostics'>> {
  const startTime = Date.now();
  // Note: The specialized GEMINI_ANALYZE_API_KEY will be used if available
  // This is configured in the analyzeResumeWithSingleAIRequest function
  const {
    model = "gemini-2.5-flash-lite",
    apiKeys = [],
    targetRole = "General",
    includeDetailedFeedback = true
  } = config;

  try {
    // Single AI request for both parsing and scoring (no ATS diagnostics)
    const { structuredResume, score, keywordAnalysis } = await analyzeResumeWithSingleAIRequest(
      resumeText,
      targetRole,
      model,
      apiKeys
    );

    const processingTime = Date.now() - startTime;

    // ...existing code...

    return {
      score,
      structuredResume,
      keywordAnalysis,
      processingTime,
      analysisMetadata: {
        modelUsed: model,
        atsEnhanced: false,
        targetRole,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    // ...existing code...
    throw new Error(`Quick analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export types for use in other components
 */
export type { 
  AtsDiagnostics, 
  AnalysisConfig, 
  FullAnalysisResult 
};
