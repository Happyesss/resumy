"use client";

import { signInWithGithub, signInWithLinkedIn } from "@/app/auth/login/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type OAuthProvider = 'github' | 'linkedin' | null;

export default function SocialAuth() {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider>(null);

  const handleGithubSignIn = async () => {
    if (loadingProvider) return; // Prevent multiple simultaneous OAuth attempts
    
    try {
      setLoadingProvider('github');
      const result = await signInWithGithub();
      
      if (result.success && result.url) {
        // Validate URL before redirecting (security measure)
        try {
          const url = new URL(result.url);
          // Only allow GitHub OAuth URLs
          if (url.hostname.includes('github.com') || url.hostname.includes('supabase')) {
            window.location.href = result.url;
          } else {
            throw new Error('Invalid OAuth redirect URL');
          }
        } catch {
          toast.error("Authentication failed. Please try again.");
          setLoadingProvider(null);
        }
      } else {
        toast.error(result.error || "Failed to connect to GitHub");
        setLoadingProvider(null);
      }
    } catch (error) {
      console.error("Github sign in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setLoadingProvider(null);
    }
  };

  const handleLinkedInSignIn = async () => {
    if (loadingProvider) return; // Prevent multiple simultaneous OAuth attempts
    
    try {
      setLoadingProvider('linkedin');
      const result = await signInWithLinkedIn();
      
      if (result.success && result.url) {
        // Validate URL before redirecting (security measure)
        try {
          const url = new URL(result.url);
          // Only allow LinkedIn OAuth URLs
          if (url.hostname.includes('linkedin.com') || url.hostname.includes('supabase')) {
            window.location.href = result.url;
          } else {
            throw new Error('Invalid OAuth redirect URL');
          }
        } catch {
          toast.error("Authentication failed. Please try again.");
          setLoadingProvider(null);
        }
      } else {
        toast.error(result.error || "Failed to connect to LinkedIn");
        setLoadingProvider(null);
      }
    } catch (error) {
      console.error("LinkedIn sign in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setLoadingProvider(null);
    }
  };

  const isLoading = loadingProvider !== null;

  return (
    <div className="space-y-2 mt-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="bg-purple-400/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-3 text-gray-400 font-medium">Or continue with</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="
            flex-1 h-9 bg-black border-purple-400/30
            hover:bg-black hover:border-white hover:text-white
            text-white font-medium transition-all duration-200
            focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black
            rounded-lg
            transform hover:scale-105 hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          "
          onClick={handleGithubSignIn}
          disabled={isLoading}
        >
          {loadingProvider === 'github' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="
            flex-1 h-9 bg-black border-purple-400/30
            hover:bg-black hover:border-[#0A66C2] hover:text-[#0A66C2]
            text-white font-medium transition-all duration-200
            focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black
            rounded-lg
            transform hover:scale-105 hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          "
          onClick={handleLinkedInSignIn}
          disabled={isLoading}
        >
          {loadingProvider === 'linkedin' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex items-center">
              <span className="mr-2 h-6 w-6 rounded flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.vecteezy.com/system/resources/previews/023/986/926/non_2x/linkedin-logo-linkedin-logo-transparent-linkedin-icon-transparent-free-free-png.png"
                  alt="LinkedIn"
                  className="h-6 w-6 object-contain"
                  style={{ display: 'block' }}
                />
              </span>
              LinkedIn
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
