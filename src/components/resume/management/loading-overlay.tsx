'use client';

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import { LoadingDots } from "@/components/ui/loading-dots";

// Define the creation steps
export const CREATION_STEPS = [
  { id: 'analyzing', label: 'Analyzing Job Description' },
  { id: 'formatting', label: 'Formatting Requirements' },
  { id: 'tailoring', label: 'Tailoring Resume Content' },
  { id: 'finalizing', label: 'Finalizing Resume' },
] as const;

export type CreationStep = typeof CREATION_STEPS[number]['id'];

interface LoadingOverlayProps {
  currentStep: CreationStep;
}

export function LoadingOverlay({ currentStep }: LoadingOverlayProps) {
  const currentStepIndex = CREATION_STEPS.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / CREATION_STEPS.length) * 100;

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-black/95 rounded-2xl shadow-2xl border border-gray-800/50 backdrop-blur-sm">
        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-100">
            <span>Creating Resume</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {CREATION_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors duration-300",
                  isActive && "bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-700/30",
                  isCompleted && "text-gray-200"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : isActive ? (
                  <div className="h-5 w-5 flex items-center justify-center">
                    <LoadingDots className="text-teal-400" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  isActive && "bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent",
                  !isActive && !isCompleted && "text-gray-400"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current action description */}
        <div className="text-center">
          <p className="text-sm text-gray-400 animate-pulse">
            {currentStep === 'analyzing' && "Reading and understanding the job requirements..."}
            {currentStep === 'formatting' && "Structuring the job information..."}
            {currentStep === 'tailoring' && "Optimizing your resume for the best match..."}
            {currentStep === 'finalizing' && "Putting the final touches..."}
          </p>
        </div>
      </div>
    </div>
  );
} 