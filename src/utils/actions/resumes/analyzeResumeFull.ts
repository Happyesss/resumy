// utils/actions/resumes/analyzeResumeFull.ts
// -------------------------------------------------
// A single-call helper that takes *raw* resume text, converts it into a
// structured <Resume> object, runs all ATS‑style diagnostics + LLM scoring,
// and returns both the score breakdown and the structured resume in **one**
// network round‑trip.
// -------------------------------------------------
import { Resume } from "@/lib/types";
import { ResumeScoreMetrics } from "@/components/resume/editor/panels/resume-score-panel";
import { convertTextToResume } from "@/utils/actions/resumes/ai";
import { generateResumeScore } from "@/utils/actions/resumes/actions"; // keeps existing scoring logic
import { ApiKey } from "@/utils/ai-tools";

// Optional: Deep‑dive ATS heuristics (regex & ML‑based)
// import { runAtsDiagnostics, AtsDiagnostics } from "@/utils/ats/diagnostics";

// Temporary placeholder for ATS diagnostics until the module is implemented
interface AtsDiagnostics {
  sectionOrder: { score: number; issues: string[] };
  dateGaps: { score: number; issues: string[] };
  keywordDensity: { score: number; issues: string[] };
  formatting: { score: number; issues: string[] };
}

async function runAtsDiagnostics(resume: Resume): Promise<AtsDiagnostics> {
  // Placeholder implementation - replace with actual ATS diagnostics
  return {
    sectionOrder: { score: 85, issues: [] },
    dateGaps: { score: 90, issues: [] },
    keywordDensity: { score: 75, issues: ["Could use more industry keywords"] },
    formatting: { score: 88, issues: [] },
  };
}

/**
 * The wrapper that bundles parsing ➜ diagnostics ➜ scoring.
 *
 * @param resumeText   Raw plaintext or PDF‑to‑text content.
 * @param options      Model + feature flags.
 *
 * @returns { score, structuredResume }  — everything needed by the UI.
 */
export async function analyzeResumeFull(
  resumeText: string,
  options: {
    model?: string;
    atsEnhanced?: boolean;
    apiKeys?: ApiKey[];
    baseResumeTemplate?: Partial<Resume>; // supply defaults if desired
  } = {}
): Promise<{
  score: ResumeScoreMetrics;
  structuredResume: Resume;
  atsDiagnostics?: AtsDiagnostics;
}> {
  const {
    model = "gemini-2.5-flash-lite-preview-06-17",
    atsEnhanced = false,
    apiKeys = [],
    baseResumeTemplate = {},
  } = options;

  // 1️⃣  Create a skeleton so convertTextToResume has IDs & timestamps to work with
  const baseResume: Resume = {
    id: "temp-analysis",
    user_id: "temp-ui-session",
    name: "Resume Analysis",
    target_role: "General",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone_number: "",
    location: "",
    website: "",
    linkedin_url: "",
    github_url: "",
    work_experience: [],
    education: [],
    skills: [],
    projects: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_base_resume: true,
    has_cover_letter: false,
    ...baseResumeTemplate, // allow overrides
  };

  // 2️⃣  Raw text ➜ structured JSON
  const structuredResume = (await convertTextToResume(
    resumeText,
    baseResume,
    baseResume.target_role,
    { model, apiKeys }
  )) as Resume;

  // 3️⃣  Optional regex/ML ATS heuristics (section order, date gaps, etc.)
  let atsDiagnostics: AtsDiagnostics | undefined;
  if (atsEnhanced) {
    atsDiagnostics = await runAtsDiagnostics(structuredResume);
  }

  // 4️⃣  Large‑language‑model based scoring
  const score = (await generateResumeScore(structuredResume, {
    model,
    apiKeys,
    // atsDiagnostics, // let the scoring prompt embed hard checks
  })) as ResumeScoreMetrics;

  return {
    score,
    structuredResume,
    atsDiagnostics,
  };
}
