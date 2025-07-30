import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Sign In to Your Account - Resumy",
  description: "Sign in to your Resumy account to access your AI-powered resume builder. Create, edit, and optimize your professional resumes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  // Check if user is already authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If user is already authenticated, redirect to home
  if (user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
