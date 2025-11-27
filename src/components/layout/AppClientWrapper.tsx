"use client";
import AuthErrorHandler from "@/components/auth/auth-error-handler";
import { ReactNode, useEffect } from "react";
import { Toaster } from "sonner";

export default function AppClientWrapper({ children }: { children: ReactNode }) {
  // Global error handler to suppress PDF TextLayer warnings
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = function(...args) {
      // Check if this is a TextLayer cancellation error or PDF rendering error
      const message = args[0]?.toString() || '';
      if (message.includes('TextLayer task cancelled') || 
          message.includes('AbortException: TextLayer') ||
          message.includes('Cannot read properties of undefined (reading \'map\')') ||
          message.includes('Cannot read properties of null (reading \'props\')')) {
        // Convert PDF-related errors to warnings instead of errors
        console.warn('PDF generation warning (non-critical):', ...args);
        return;
      }
      // For all other errors, use the original error function
      originalError.apply(console, args);
    };

    console.warn = function(...args) {
      const message = args[0]?.toString() || '';
      // Suppress PDF-related warnings entirely as they're not actionable
      if (message.includes('TextLayer task cancelled') || 
          message.includes('AbortException: TextLayer') ||
          message.includes('PDF TextLayer task cancelled') ||
          message.includes('PDF component rendering error') ||
          message.includes('Cannot read properties of null (reading \'props\')')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    // Cleanup function to restore original console methods
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

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
