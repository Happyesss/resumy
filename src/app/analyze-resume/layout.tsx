import { AnalyzeResumeOptimization } from "@/components/seo/AnalyzeResumeOptimization";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Resume Analyzer & ATS Checker | Instant Score + Keyword Gaps - Resumy",
  description:
    "Analyze your resume for free with Resumy's AI-powered ATS checker. Get an instant ATS compatibility score, find missing keywords, and receive actionable tips to beat applicant tracking systems — 100% free, no sign-up required.",
  keywords: [
    // Primary
    "free resume analyzer",
    "resume analyzer",
    "ATS resume checker",
    "free ATS checker",
    "resume ATS score",
    "resume scanner free",
    "resume checker online",
    "resume analysis tool",
    // Long-tail
    "free resume analyzer online",
    "check resume ATS score free",
    "free ATS resume scanner",
    "resume keyword checker free",
    "analyze resume for ATS free",
    "resume score checker online",
    "how to check if resume passes ATS",
    "free resume feedback tool",
    "resume optimization tool free",
    "AI resume analyzer free",
    "instant resume score",
    "resume keyword gap analysis",
    "improve resume for ATS free",
    "ATS compatibility checker free",
    "best free resume analyzer 2025",
    "resume analysis AI free",
    "resume review tool free online",
    "resume improvement suggestions free",
  ],
  openGraph: {
    title: "Free Resume Analyzer & ATS Checker — Instant Score + Keyword Gaps",
    description:
      "Get your free ATS compatibility score, uncover keyword gaps, and receive AI-powered improvement tips. Resumy's resume analyzer is 100% free — no sign-up, no paywall.",
    url: "https://resumy.live/analyze-resume",
    type: "website",
    images: [
      {
        url: "/og-analyze.webp",
        width: 1200,
        height: 630,
        alt: "Resumy Free Resume Analyzer & ATS Checker",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Analyzer & ATS Checker - Resumy",
    description:
      "Instant ATS score, keyword gap analysis, and AI improvement tips — all free. No sign-up needed.",
    images: ["/og-analyze.webp"],
  },
  alternates: {
    canonical: "https://resumy.live/analyze-resume",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export default function AnalyzeResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Resumy Resume Analyzer",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://resumy.live/analyze-resume",
    description:
      "Free AI-powered resume analyzer that checks ATS compatibility, finds keyword gaps, and provides actionable improvement suggestions.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "ATS compatibility score",
      "Keyword gap analysis",
      "AI-powered improvement suggestions",
      "Resume formatting feedback",
      "Free, no sign-up required",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2400",
      bestRating: "5",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Next-Generation AI Optimization for Resume Analysis */}
      <AnalyzeResumeOptimization />
      {children}
    </>
  );
}
