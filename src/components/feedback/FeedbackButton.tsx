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
          // ensure this button sits above other widgets (eg. BuyMeCoffee) on mobile
          'fixed z-[9999] group pointer-events-auto',
          // use safe-area for bottom inset on devices with home indicators
          'bottom-6 right-6',
          'flex items-center gap-2',
          // show only icon on small screens but make hit area touch-friendly
          'p-3 rounded-full sm:px-4 sm:py-3',
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
        // Ensure the button has a generous hit area on mobile
        style={{
          // add bottom safe area inset fallback value for older browsers
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)'
        }}
      >
        <MessageSquareText className="h-5 w-5" />
        <span className="hidden sm:inline">Feedback</span>
      </button>
      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
