import { Inter } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/layout/app-header";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import ClientAppWrapper from "@/components/layout/AppClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://resumy.live"),
  title: {
    default: "Resumy - Free AI-Powered Resume Builder | Create Professional Resumes Online",
    template: "%s | Resumy - Free AI Resume Builder"
  },
  description: "Resumy is a free AI resume builder that helps you create professional resumes quickly and easily. Build ATS-optimized resumes with AI assistance, get hired faster with our smart resume optimization tools.",
  applicationName: "Resumy",
  keywords: [
    "resume builder",
    "free resume builder", 
    "ai resume builder",
    "professional resume",
    "create resume online",
    "ATS optimized resume",
    "resume maker",
    "job application",
    "career builder",
    "resume templates",
    "resume generator",
    "online resume builder",
    "resume writing",
    "job search",
    "tech resume",
    "software engineer resume",
    "resume optimization",
    "resume scanner",
    "resume creator",
    "digital resume",
    "modern resume",
    "resume design",
    "hiring tools",
    "job hunting",
    "career development"
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
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Resumy",
    title: "Resumy - Free AI-Powered Resume Builder | Create Professional Resumes Online",
    description: "Resumy is a free AI resume builder that helps you create professional resumes quickly and easily. Build ATS-optimized resumes with AI assistance, get hired faster with our smart resume optimization tools.",
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
    ],
  },  twitter: {
    card: "summary_large_image",
    site: "@resumy",
    creator: "@resumy",
    title: "Resumy - Free AI-Powered Resume Builder | Create Professional Resumes Online",
    description: "Resumy is a free AI resume builder that helps you create professional resumes quickly and easily. Build ATS-optimized resumes with AI assistance.",
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
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
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
