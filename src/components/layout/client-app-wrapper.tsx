"use client";
import { ReactNode } from "react";
import AuthErrorHandler from "@/components/auth/auth-error-handler";

export default function ClientAppWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthErrorHandler />
      {children}
    </>
  );
}
