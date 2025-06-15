"use client";
import { ReactNode } from "react";
import AuthErrorHandler from "@/components/auth/auth-error-handler";
import { Toaster } from "sonner";

export default function AppClientWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthErrorHandler />
      {children}
      <Toaster 
        richColors 
        position="top-right" 
        closeButton 
        toastOptions={{
          style: {
            fontSize: '1rem',
            padding: '16px',
            minWidth: '400px',
            maxWidth: '500px'
          }
        }}
      />
    </>
  );
}
