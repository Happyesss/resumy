import { FeedbackButton } from "@/components/feedback";
import { AppHeader } from "@/components/layout/app-header";
import ClientAppWrapper from "@/components/layout/AppClientWrapper";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://resumy.live"),
  title: {
    default: "Resumy - Free AI-Powered Resume Builder | Create Professional Resumes Online",
    template: "%s | Resumy - Free AI Resume Builder"
  },
  description: "Build professional resumes for free with Resumy's AI-powered resume builder. Create ATS-optimized resumes in minutes with smart templates, keyword optimization, and AI assistance. Get hired faster with resumes designed to pass applicant tracking systems. Perfect for tech, healthcare, finance, marketing professionals and all career levels. Start building your winning resume today - completely free!",
  applicationName: "Resumy",
  keywords: [
    // Core resume building keywords
    "resume builder",
    "free resume builder", 
    "ai resume builder",
    "professional resume",
    "create resume online",
    "ATS optimized resume",
    "resume maker",
    "resume templates",
    "resume generator",
    "online resume builder",
    "resume writing",
    "resume creator",
    "digital resume",
    "modern resume",
    "resume design",
    "resume scanner",
    "resume optimization",
    
    // Job search related
    "job application",
    "career builder",
    "job search",
    "hiring tools",
    "job hunting",
    "career development",
    "employment tools",
    "job seeker",
    "career advancement",
    "professional development",
    "job placement",
    "career coaching",
    
    // Industry specific
    "tech resume",
    "software engineer resume",
    "engineering resume",
    "IT resume",
    "developer resume",
    "programmer resume",
    "data scientist resume",
    "marketing resume",
    "sales resume",
    "finance resume",
    "accounting resume",
    "healthcare resume",
    "nursing resume",
    "teacher resume",
    "manager resume",
    "executive resume",
    "startup resume",
    "remote work resume",
    
    // AI and technology features
    "AI powered resume",
    "artificial intelligence resume",
    "machine learning resume",
    "automated resume builder",
    "smart resume maker",
    "intelligent resume creator",
    "AI resume assistant",
    "resume AI tool",
    "chatgpt resume",
    "AI resume optimization",
    "automated resume writing",
    
    // ATS and optimization
    "ATS friendly resume",
    "applicant tracking system",
    "ATS compliant resume",
    "ATS resume checker",
    "resume ATS optimization",
    "keyword optimization",
    "resume scoring",
    "ATS scanner",
    "resume parsing",
    "ATS resume format",
    
    // Format and design
    "resume format",
    "CV maker",
    "curriculum vitae",
    "professional CV",
    "resume layout",
    "resume structure",
    "clean resume design",
    "minimalist resume",
    "creative resume",
    "executive resume format",
    "chronological resume",
    "functional resume",
    "combination resume",
    "modern CV template",
    "professional resume template",
    
    // Features and benefits
    "free resume download",
    "resume pdf",
    "instant resume",
    "quick resume builder",
    "easy resume maker",
    "simple resume creator",
    "resume editor",
    "resume customization",
    "resume personalization",
    "tailored resume",
    "custom resume",
    "professional resume service",
    
    // Career levels
    "entry level resume",
    "graduate resume",
    "student resume",
    "internship resume",
    "senior level resume",
    "executive level resume",
    "career change resume",
    "first job resume",
    "experienced professional resume",
    
    // Additional 100+ Core Keywords for Resume & Resume Builder
    "resume writing service",
    "resume template download",
    "professional resume help",
    "resume examples by industry",
    "resume format guide",
    "CV template free",
    "resume skills section",
    "resume objective examples",
    "resume summary examples",
    "modern resume design",
    "creative resume templates",
    "executive resume samples",
    "resume cover letter",
    "resume keywords list",
    "resume tips 2025",
    "resume best practices",
    "resume writing tips",
    "resume layout design",
    "professional CV templates",
    "resume builder software",
    "online CV maker",
    "digital resume creator",
    "resume portfolio builder",
    "interactive resume maker",
    "video resume creator",
    "infographic resume maker",
    "resume website builder",
    "personal branding resume",
    "visual resume creator",
    "resume analytics tool",
    "resume tracking system",
    "resume performance metrics",
    "resume success rate",
    "resume interview scheduler",
    "job application tracker",
    "career portfolio builder",
    "professional profile creator",
    "LinkedIn resume sync",
    "social media resume",
    "networking resume tools",
    "career advancement tools",
    "professional development tracker",
    "skill assessment resume",
    "competency based resume",
    "achievement focused resume",
    "results driven resume",
    "quantified resume maker",
    "impact resume creator",
    "performance resume builder",
    "leadership resume templates",
    "management resume maker",
    "C-suite resume builder",
    "VP level resume creator",
    "director resume templates",
    "senior manager resume",
    "team leader resume maker",
    "supervisor resume builder",
    "coordinator resume templates",
    "specialist resume creator",
    "analyst resume maker",
    "consultant resume builder",
    "freelancer resume templates",
    "contractor resume creator",
    "remote worker resume",
    "digital nomad resume",
    "startup founder resume",
    "entrepreneur resume maker",
    "business owner resume",
    "CEO resume builder",
    "CTO resume templates",
    "CFO resume creator",
    "CMO resume maker",
    "CHRO resume builder",
    "product manager resume",
    "program manager resume",
    "project coordinator resume",
    "scrum master resume",
    "agile coach resume",
    "business analyst resume",
    "data analyst resume",
    "research scientist resume",
    "lab technician resume",
    "clinical researcher resume",
    "medical device resume",
    "pharmaceutical resume",
    "biotechnology resume",
    "healthcare administrator resume",
    "hospital manager resume",
    "medical assistant resume",
    "physician assistant resume",
    "nurse practitioner resume",
    "registered nurse resume",
    "licensed practical nurse resume",
    "certified nursing assistant resume",
    "medical technologist resume",
    "radiologic technologist resume",
    "physical therapist resume",
    "occupational therapist resume",
    "speech therapist resume",
    "mental health counselor resume",
    "social worker resume",
    "case manager resume",
    "human resources resume",
    "talent acquisition resume",
    "recruiter resume maker",
    "training specialist resume",
    "learning developer resume",
    "instructional designer resume",
    "curriculum developer resume",
    "education administrator resume",
    "school principal resume",
    "academic dean resume",
    "university professor resume",
    "research professor resume",
    "adjunct faculty resume",
    "graduate student resume",
    "postdoc researcher resume"
  ],
  authors: [{ name: "Resumy Team", url: "https://resumy.live" }],
  creator: "Resumy",
  publisher: "Resumy",
  category: "Business",
  classification: "Resume Building Software",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon/favicon-96x96.png",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/svg+xml",
        url: "/favicon/favicon.svg",
      },
      {
        rel: "mask-icon",
        url: "/favicon/favicon.svg",
        color: "#8B5CF6",
      },
      {
        rel: "image_src",
        url: "/logo.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Resumy",
    title: "Resume Builder Free | Create Professional Resumes Online | Resumy",
    description: "Build professional ATS-optimized resumes for free with AI assistance. Create winning resumes in minutes with smart templates, keyword optimization, and expert guidance. Perfect for tech professionals, healthcare workers, finance experts, and all career levels. Get hired faster with resumes that pass applicant tracking systems.",
    url: "https://resumy.live",
    locale: "en_US",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Resumy - Free AI Resume Builder",
        type: "image/webp",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Resumy Logo",
        type: "image/png",
      },
    ],
  },  twitter: {
    card: "summary_large_image",
    site: "@resumy",
    creator: "@resumy",
    title: "Resume Builder Free | Create Professional Resumes Online | Resumy",
    description: "Build professional ATS-optimized resumes for free with AI assistance. Perfect for software engineers, healthcare professionals, marketing experts, and all career levels. Start building your winning resume today!",
    images: ["/og.webp"],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      noarchive: false,
      nosnippet: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://resumy.live",
  },
  other: {
    "google-site-verification": "your-google-verification-code", // Replace with actual verification code
    "msvalidate.01": "your-bing-verification-code", // Replace with actual verification code
    "pinterest-domain-verify": "your-pinterest-verification-code", // Replace with actual verification code
    "apple-mobile-web-app-title": "Resumy",
    "application-name": "Resumy",
    "msapplication-TileColor": "#8B5CF6",
    "theme-color": "#8B5CF6",
  },
  // verification: {
  //   google: "google-site-verification-code", // Replace with actual verification code
  //   yandex: "yandex-verification-code", // Replace with actual verification code  
  //   bing: "bing-verification-code", // Replace with actual verification code
  // },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional logo-specific meta tags */}
        <link rel="image_src" href="/logo.png" />
        <meta property="og:logo" content="https://resumy.live/logo.png" />
        <meta name="msapplication-TileImage" content="/logo.png" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <GoogleAnalytics />
        <ClientAppWrapper>
          <div className="relative min-h-screen flex flex-col">
            {user && <AppHeader />}
            {/* Main content */}
            <main className={`flex-1 bg-black ${user ? 'pt-16' : ''}`}>
              {children}
            </main>
          </div>
          {/* Floating Feedback Button */}
          <FeedbackButton />
        </ClientAppWrapper>
      </body>
    </html>
  );
}
