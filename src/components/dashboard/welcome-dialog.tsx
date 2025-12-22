'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { FileText, Sparkles, User } from "lucide-react";
import Link from "next/link";
import * as React from 'react';

interface WelcomeDialogProps {
  isOpen: boolean;
}

export function WelcomeDialog({ isOpen: initialIsOpen }: WelcomeDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return null;
  }

  const steps = [
    {
      icon: User,
      title: "Complete your profile",
      description: "Add your work experience, education, and skills"
    },
    {
      icon: FileText,
      title: "Create a base resume",
      description: "Build a foundation resume for your target roles"
    },
    {
      icon: Sparkles,
      title: "Tailor for each job",
      description: "Customize your resume for specific job applications"
    }
  ];

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={setIsOpen}
    >
      <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Welcome to Resumy! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="pt-4 space-y-6">
          <p className="text-sm text-neutral-400">
            Get started in three simple steps:
          </p>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="text-sm font-medium text-white">{step.title}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
                </div>
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-500 font-medium">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <Link href="/profile" className="block">
              <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100 font-medium">
                Start with Your Profile
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full text-neutral-400 hover:text-white hover:bg-neutral-800"
              onClick={() => setIsOpen(false)}
            >
              I&apos;ll explore first
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 