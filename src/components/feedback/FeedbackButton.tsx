'use client';

import { cn } from '@/lib/utils';
import { MessageSquareText } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the dialog to avoid SSR issues
const FeedbackDialog = dynamic(
  () => import('./FeedbackDialog').then(mod => ({ default: mod.FeedbackDialog })),
  { ssr: false }
);

interface FeedbackButtonProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

export function FeedbackButton({ className, variant = 'floating' }: FeedbackButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server side
  if (!mounted) {
    return null;
  }

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
            'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white',
            'border border-gray-700 hover:border-gray-600',
            'transition-all duration-200',
            className
          )}
        >
          <MessageSquareText className="h-4 w-4" />
          Feedback
        </button>
        <FeedbackDialog open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed z-50 group',
          'bottom-6 right-6',
          'flex items-center gap-2',
          'px-4 py-3 rounded-full',
          'bg-gradient-to-r from-purple-600 to-purple-500',
          'hover:from-purple-500 hover:to-purple-400',
          'text-white font-medium text-sm',
          'shadow-lg shadow-purple-500/25',
          'hover:shadow-xl hover:shadow-purple-500/30',
          'transform hover:scale-105',
          'transition-all duration-300 ease-out',
          className
        )}
        aria-label="Send feedback"
      >
        <MessageSquareText className="h-5 w-5" />
        <span className="hidden sm:inline">Feedback</span>
      </button>
      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
