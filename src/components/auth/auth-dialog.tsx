'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Sparkles, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { AuthProvider } from "./auth-context";
import { signInWithGithub } from "@/app/auth/login/actions";
import { Separator } from "@/components/ui/separator";

const gradientClasses = {
  base: "bg-gradient-to-r from-violet-600 via-blue-600 to-violet-600",
  hover: "hover:from-violet-500 hover:via-blue-500 hover:to-violet-500",
  shadow: "shadow-lg shadow-violet-500/25",
  animation: "transition-all duration-500 animate-gradient-x",
};

interface TabButtonProps {
  value: "login" | "signup";
  children: React.ReactNode;
}

interface AuthDialogProps {
  children?: React.ReactNode;
}

function TabButton({ value, children }: TabButtonProps) {
  return (
    <TabsTrigger 
      value={value}
      className="
        relative flex-1 h-9 px-4 text-sm font-medium rounded-lg
        transition-all duration-300 ease-out
        data-[state=inactive]:text-gray-400 data-[state=inactive]:bg-transparent
        data-[state=active]:text-white data-[state=active]:bg-purple-400
        data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-purple-400/50
        border-0 shadow-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        data-[state=active]:shadow-lg data-[state=active]:shadow-purple-400/20
      "
    >
      <span className="relative z-10 font-semibold">{children}</span>
    </TabsTrigger>
  );
}

function SocialAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGithub();
      
      if (!result.success) {
        console.error('❌ GitHub sign in error:', result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('💥 Failed to sign in with GitHub:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="bg-purple-400/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-3 text-gray-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        className="
          w-full h-9 bg-black border-purple-400/30 hover:bg-purple-400/10 hover:border-purple-400/50
          text-white font-medium transition-all duration-200
          focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black
          rounded-lg
        "
        onClick={handleGithubSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </>
        )}
      </Button>
    </div>
  );
}

export function AuthDialog({ children }: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      {/* AUTH DIALOG TRIGGER BUTTON */}
      <DialogTrigger asChild>
        {children || (
          <Button 
            size="lg" 
            className={`${gradientClasses.base} ${gradientClasses.hover} text-white font-semibold 
            text-lg py-6 px-10 ${gradientClasses.animation} group
            shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40
            ring-2 ring-white/20 hover:ring-white/30
            scale-105 hover:scale-110 transition-all duration-300
            rounded-xl relative overflow-hidden`}
            aria-label="Open authentication dialog"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center">
              Start Now
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent 
        className="
          sm:max-w-[420px] w-full max-h-[90vh] p-0 bg-black border border-purple-400/20 shadow-2xl 
          animate-in fade-in-0 zoom-in-95 duration-200
          rounded-2xl overflow-hidden overflow-y-auto
        "
      >
        <AuthProvider>
          {/* Header Section */}
          <div className="px-6 py-3 border-b border-purple-400/10 bg-black">
            <DialogTitle className="sr-only">Authentication</DialogTitle>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="flex flex-col">
                  <Logo className="text-xl text-white" asLink={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="px-6 pt-4">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "login" | "signup")} 
              className="w-full"
            >
              <TabsList className="
                w-full h-10 bg-purple-400/10 border border-purple-400/20 p-1
                flex gap-1 rounded-xl backdrop-blur-sm
              ">
                <TabButton value="login">
                  Sign In
                </TabButton>
                <TabButton value="signup">
                  Create Account
                </TabButton>
              </TabsList>

              {/* Forms Content */}
              <div className="mt-3 pb-4">
                <TabsContent value="login" className="mt-0 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Welcome back</h3>
                    <p className="text-sm text-gray-400 mb-2">Sign in to your account to continue</p>
                    <LoginForm />
                  </div>
                  <SocialAuth />
                </TabsContent>
                
                <TabsContent value="signup" className="mt-0 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Get started for free</h3>
                    <p className="text-sm text-gray-400 mb-2">Create your account and build your first resume</p>
                    <SignupForm />
                  </div>
                  <SocialAuth />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </AuthProvider>
      </DialogContent>
    </Dialog>
  );
} 