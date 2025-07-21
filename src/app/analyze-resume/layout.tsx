import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Resume Analyzer | ATS Score & Optimization Tips - Resumy",
  description: "Analyze your resume for free with Resumy's AI-powered resume scanner. Get instant ATS compatibility scores, keyword optimization suggestions, and professional tips to improve your resume.",
  keywords: [
    "resume analyzer",
    "free resume scanner",
    "ATS resume checker",
    "resume optimization",
    "resume score",
    "resume feedback",
    "resume analysis tool",
    "ATS compatibility",
    "resume keywords",
    "resume improvement",
    "job application analysis",
    "resume evaluation"
  ],
  openGraph: {
    title: "Free Resume Analyzer | ATS Score & Optimization Tips - Resumy",
    description: "Analyze your resume for free with Resumy's AI-powered resume scanner. Get instant ATS compatibility scores and optimization suggestions.",
    url: "https://resumy.live/analyze-resume",
    type: "website",
    images: [
      {
        url: "/og-analyze.webp",
        width: 1200,
        height: 630,
        alt: "Resumy Resume Analyzer Tool",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Analyzer | ATS Score & Optimization - Resumy",
    description: "Analyze your resume for free with AI-powered scanning. Get instant ATS scores and optimization tips.",
    images: ["/og-analyze.webp"],
  },
  alternates: {
    canonical: "https://resumy.live/analyze-resume",
  },
};

export default function AnalyzeResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
