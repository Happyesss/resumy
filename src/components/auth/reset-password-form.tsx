"use client";

import { resetPasswordForEmail } from "@/app/auth/login/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FormState {
  error?: string;
  success?: boolean;
}

export function ResetPasswordForm() {
  const [formState, setFormState] = useState<FormState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState({});
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      const result = await resetPasswordForEmail(formData);
      
      if (!result.success) {
        setFormState({ error: result.error || "Failed to send reset email" });
        return;
      }
      
      setEmail("");
      setFormState({ success: true });
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      setFormState({ error: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-black p-6 rounded-2xl border border-purple-400/20 max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Reset Password</h2>
        <p className="text-sm text-gray-400">Enter your email to receive a reset link</p>
      </div>

      {formState.error && (
        <Alert variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-lg mb-4">
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}
      
      {formState.success ? (
        <Alert className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-lg">
          <AlertDescription>
            Check your email for a password reset link. You should receive it within 1 minute. Please check your spam folder if you don&apos;t see it in your inbox.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-white">Email</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-black border-purple-400/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 hover:bg-black hover:border-purple-400/50 focus:bg-black"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-10 bg-purple-400 hover:bg-purple-500 text-white font-medium transition-all duration-200 rounded-lg shadow-lg shadow-purple-400/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <div className="text-center text-sm">
            <Link 
              href="/"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
} 