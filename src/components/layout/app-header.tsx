'use client';

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Layout, Menu, Sparkles, Share2, User } from "lucide-react";
import Link from "next/link";
import { PageTitle } from "./page-title";
import { ShareNotifications } from "@/components/notifications/share-notifications";

import { usePathname } from "next/navigation";
import { useState } from "react";

interface AppHeaderProps {
  children?: React.ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Detect if on landing page
  const _isLanding = pathname === "/";

  // Check which tab is active
  const isAnalyzeActive = pathname?.startsWith("/analyze-resume");
  const isTemplatesActive = pathname?.startsWith("/templates");
  const isSharesActive = pathname?.startsWith("/resumes/share");
  const isProfileActive = pathname?.startsWith("/profile");

  return (
    <header className="h-14 border-b backdrop-blur-xl fixed top-0 left-0 right-0 z-40 shadow-md border-gray-200/50">
      {/* Content Container */}
      <div className="max-w-[2000px] mx-auto h-full px-3 flex items-center justify-between relative">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          {/* Always show logo */}
          <span className="text-xl flex-shrink-0">
            <Logo />
          </span>
          <div className="h-5 w-px bg-gray-200/50 hidden sm:block flex-shrink-0" />
          <div className="hidden sm:flex items-center min-w-0 max-w-[140px] sm:max-w-[300px] lg:max-w-[600px]">
            <div className="truncate max-w-[80ch] overflow-hidden text-ellipsis">
              <PageTitle />
            </div>
          </div>
        </div>

        {/* Right Section - Tab Navigation */}
        <div className="flex items-center flex-shrink-0">
          {children ? (
            children
          ) : (
            <>
              {/* Desktop Tab Navigation */}
              <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                {/* Notifications */}
                <ShareNotifications />
                
                <Link
                  href="/analyze-resume"
                  className={cn(
                    "flex items-center gap-1.5 px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    isAnalyzeActive
                      ? "bg-teal-500/20 text-teal-300 shadow-lg shadow-teal-500/10"
                      : "text-teal-400 hover:bg-teal-500/10 hover:text-teal-300"
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden lg:inline">Analyze</span>
                </Link>
                <Link
                  href="/templates"
                  className={cn(
                    "flex items-center gap-1.5 px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    isTemplatesActive
                      ? "bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10"
                      : "text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                  )}
                >
                  <Layout className="h-4 w-4" />
                  <span className="hidden lg:inline">Templates</span>
                </Link>

                <Link
                  href="/resumes/share"
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    isSharesActive
                      ? "bg-pink-500/20 text-pink-300 shadow-lg shadow-pink-500/10"
                      : "text-pink-400 hover:bg-pink-500/10 hover:text-pink-300"
                  )}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden lg:inline">Shares</span>
                </Link>

                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-1.5 px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    isProfileActive
                      ? "bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10"
                      : "text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">Profile</span>
                </Link>
              </nav>

              {/* Mobile Menu */}
              <div className="flex items-center gap-1 md:hidden">
                {/* Mobile Notifications */}
                <ShareNotifications />
                
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5 text-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[50vw] max-w-[400px] min-w-[220px] h-[50vh] mt-14 bg-black/95 rounded-l-2xl rounded-bl-2xl border-l border-purple-400/20 flex flex-col justify-start"
                  style={{ top: '0', bottom: 'auto' }}
                >
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 pt-6">
                    <Link
                      href="/analyze-resume"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isAnalyzeActive
                          ? "bg-teal-500/20 text-teal-300"
                          : "text-teal-400 hover:bg-teal-500/10 hover:text-teal-300"
                      )}
                    >
                      <Sparkles className="h-4 w-4" />
                      Analyze Resume
                    </Link>
                    <Link
                      href="/templates"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isTemplatesActive
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                      )}
                    >
                      <Layout className="h-4 w-4" />
                      Templates
                    </Link>

                    <Link
                      href="/resumes/share"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isSharesActive
                          ? "bg-purple-500/20 text-purple-300"
                          : "text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                      )}
                    >
                      <Share2 className="h-4 w-4" />
                      Shares
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        isProfileActive
                          ? "bg-purple-500/20 text-purple-300"
                          : "text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                      )}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}