import { Inter } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/layout/app-header";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import ClientAppWrapper from "@/components/layout/AppClientWrapper";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://resumy.live"),
  title: {
    default: "Resumy - Free AI-Powered Resume Builder | Create Professional Resumes Online",
    template: "%s | Resumy - Free AI Resume Builder"
  },
  description: "Resumy is the best free AI resume builder that helps you create professional, ATS-optimized resumes quickly and easily. Build modern resumes with AI assistance, smart templates, keyword optimization, and get hired faster with our intelligent resume optimization tools. Perfect for all industries including tech, healthcare, finance, marketing, and more.",
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
    "experienced professional resume"
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
    title: "Resumy - Free AI-Powered Resume Builder | Create Professional Resumes Online",
    description: "Create professional, ATS-optimized resumes for free with Resumy's AI-powered resume builder. Perfect for tech professionals, healthcare workers, finance experts, and job seekers across all industries. Get hired faster with smart templates and AI optimization.",
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
    title: "Resumy - Free AI-Powered Resume Builder | Create Professional Resumes Online",
    description: "Create professional, ATS-optimized resumes for free with AI assistance. Perfect for software engineers, healthcare professionals, marketing experts, and all career levels. Start building today!",
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
        </ClientAppWrapper>
      </body>
    </html>
  );
}
