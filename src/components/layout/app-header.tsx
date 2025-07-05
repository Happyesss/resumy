'use client';

import { LogoutButton } from "@/components/auth/logout-button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import { PageTitle } from "./page-title";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AppHeaderProps {
  children?: React.ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  // Detect if on landing page
  const isLanding = pathname === "/";

  return (
    <header className="h-14 border-b backdrop-blur-xl fixed top-0 left-0 right-0 z-40 shadow-md border-gray-200/50">
      {/* Content Container */}
      <div className="max-w-[2000px] mx-auto h-full px-3 flex items-center justify-between relative">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          {/* Hide logo on mobile except landing page */}
          <span
            className={cn(
              "text-xl flex-shrink-0",
              !isLanding ? "hidden sm:inline-flex" : ""
            )}
          >
            <Logo />
          </span>
          <div className="h-5 w-px bg-gray-200/50 hidden sm:block flex-shrink-0" />
          <div className="flex items-center min-w-0 max-w-[140px] sm:max-w-[300px] lg:max-w-[600px]">
            <div className="truncate max-w-[80ch] overflow-hidden text-ellipsis">
              <PageTitle />
            </div>
          </div>
        </div>

        {/* Right Section - Navigation Items */}
        <div className="flex items-center flex-shrink-0">
          {children ? (
            children
          ) : (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                <div className="flex items-center px-2 lg:px-3 py-1">
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center gap-1.5 px-2 lg:px-3 py-1 text-purple-400 hover:text-purple-300",
                      "text-sm font-medium transition-colors duration-200"
                    )}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">Profile</span>
                  </Link>
                  <div className="mx-1 lg:mx-2 h-4 w-px" />
                  <LogoutButton className="text-red-500 hover:text-red-700" />
                </div>
              </nav>

              {/* Mobile Menu */}
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
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-purple-400 hover:text-purple-300",
                        "text-sm font-medium transition-colors duration-200"
                      )}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <div className="px-4">
                      <LogoutButton className="w-full justify-start text-red-500 hover:text-red-700" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
}