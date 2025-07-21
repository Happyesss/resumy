import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Secure Account Recovery - Resumy",
  description: "Reset your Resumy account password securely. Regain access to your AI resume builder account and continue creating professional resumes.",
  robots: {
    index: false,
    follow: false,
  },
};


export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]">
          <ResetPasswordForm/>
        </div>
      </div>
    </div>
  )
} 