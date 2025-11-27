"use client";
import AuthErrorHandler from "@/components/auth/auth-error-handler";
import { ReactNode } from "react";

export default function ClientAppWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthErrorHandler />
      {children}
    </>
  );
}
