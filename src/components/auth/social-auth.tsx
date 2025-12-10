"use client";

import { signInWithGithub } from "@/app/auth/login/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SocialAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGithub();
      if (result.success && result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      // Silent fail - user can retry
      console.error("Github sign in error:", error);
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
          <span className="bg-black px-3 text-gray-400 font-medium">Or continue with</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="
          w-full h-9 bg-black border-purple-400/30
          hover:bg-black hover:border-white hover:text-white
          text-white font-medium transition-all duration-200
          focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black
          rounded-lg
          transform hover:scale-105 hover:-translate-y-0.5
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
