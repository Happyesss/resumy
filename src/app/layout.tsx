import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/app-header";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import ClientAppWrapper from "@/components/layout/AppClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://resumelm.com"),
  title: {
    default: "Resumy - AI-Powered Resume Builder",
    template: "%s | Resumy"
  },
  description: "Create tailored, ATS-optimized resumes powered by AI. Land your dream tech job with personalized resume optimization.",
  applicationName: "Resumy",
  keywords: ["resume builder", "AI resume", "ATS optimization", "tech jobs", "career tools", "job application"],
  authors: [{ name: "Resumy" }],
  creator: "Resumy",
  publisher: "Resumy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  // manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Resumy",
    title: "Resumy - AI-Powered Resume Builder",
    description: "Create tailored, ATS-optimized resumes powered by AI. Land your dream tech job with personalized resume optimization.",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Resumy - AI Resume Builder",
      },
    ],
  },  twitter: {
    card: "summary_large_image",
    title: "Resumy - AI-Powered Resume Builder",
    description: "Create tailored, ATS-optimized resumes powered by AI. Land your dream tech job with personalized resume optimization.",
    images: ["/og.webp"],
    creator: "@resumy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "google-site-verification-code", // Replace with actual verification code
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
    <html lang="en">
      <body className={inter.className}>
        <ClientAppWrapper>
          <div className="relative min-h-screen h-screen flex flex-col">
            {user && <AppHeader />}
            {/* Padding for header and footer */}
            <main className="py-14 h-full">
              {children}
              <Analytics />
            </main>
            {user && <Footer /> }
          </div>
        </ClientAppWrapper>
      </body>
    </html>
  );
}
