'use client'

import { Button } from '@/components/ui/button';
import { NavLinks, MobileNavLinks } from "@/components/layout/nav-links";
import { Logo } from "@/components/ui/logo";
import { AuthDialog } from "@/components/auth/auth-dialog";

export function AnalyzeNavbar() {
  return (
    <nav aria-label="Main navigation" className="bg-black border-b border-purple-800/30 fixed top-0 w-full z-[1000] transition-all duration-300 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          
          {/* Middle - Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavLinks />
          </div>
          
          {/* Right Side - Auth Button & Mobile Menu */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-2">
              <AuthDialog defaultTab="login">
                <Button
                  variant="outline"
                  className="h-9 px-6 text-white bg-transparent border border-purple-500/50 font-semibold rounded-lg shadow-none hover:bg-purple-600/20 hover:border-purple-400 hover:text-white focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Login
                </Button>
              </AuthDialog>
              <AuthDialog defaultTab="signup">
                <Button
                  className="h-9 px-6 text-white bg-gradient-to-r from-purple-600 to-purple-700 font-semibold rounded-lg shadow-none border-none hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Sign Up
                </Button>
              </AuthDialog>
            </div>
            <div className="md:hidden">
              <MobileNavLinks />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
