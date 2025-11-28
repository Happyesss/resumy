"use client";

import { login, signInWithGithub } from "@/app/auth/login/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Github, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (    <Button 
      type="submit" 
      disabled={pending}
      className="w-full h-9 bg-purple-400 hover:bg-purple-500 text-white font-medium transition-all duration-200 rounded-lg shadow-lg shadow-purple-400/20"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

export function LoginForm() {
  const [error, setError] = useState<string>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Check for error parameters in URL
  useEffect(() => {
    const errorType = searchParams?.get('error');
    const errorDescription = searchParams?.get('error_description');
    
    if (errorType) {
      let errorMessage = "Authentication error";
      
      if (errorDescription) {
        errorMessage = decodeURIComponent(errorDescription);
      } else if (errorType === 'token_refresh_error' || errorType === 'refresh_token_already_used') {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (errorType === 'exchange_failed') {
        errorMessage = "Failed to authenticate. Please try again.";
      }
      
      setError(errorMessage);
    }
  }, [searchParams]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      
      const result = await login(formDataToSend);
      
      if (!result.success) {
        // Give more specific error messages based on the error
        if (result.error?.includes('Invalid login credentials')) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (result.error?.includes('Email not confirmed')) {
          setError("Please check your email and click the confirmation link before logging in.");
        } else if (result.error?.includes('Too many requests')) {
          setError("Too many login attempts. Please wait a moment before trying again.");
        } else {
          setError(result.error || "Invalid credentials. If you just signed up, please check your email for a verification link.");
        }
      } else {
        // Show success message and redirect
        toast.success("Login successful! Redirecting...");
        // Small delay to show the success message before redirect
        setTimeout(() => {
          router.push('/');
        }, 500);
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-sm font-medium text-white">Email</Label>
        <div className="relative">
          <Input 
            autoFocus
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="username"
            className="bg-black border-purple-400/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 hover:bg-black hover:border-purple-400/50 focus:bg-black"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="text-sm font-medium text-white">Password</Label>
          <Link 
            href="/auth/reset-password"
            className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="current-password"
            className="bg-black border-purple-400/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 hover:bg-black hover:border-purple-400/50 focus:bg-black pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-lg">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <SubmitButton />
      <SocialAuth />
    </form>
  );
}

function SocialAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGithub();
      
      if (result.success && result.url) {
        window.location.href = result.url;
      }
    } catch {
      // Silent fail - user can retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 mt-2">
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