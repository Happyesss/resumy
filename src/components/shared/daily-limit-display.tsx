'use client';

import { useEffect, useState } from 'react';
import { getRemainingRequests, DAILY_REQUEST_LIMIT } from '@/lib/daily-limit';
import { cn } from '@/lib/utils';

interface DailyLimitDisplayProps {
  className?: string;
  showLabel?: boolean;
}

export function DailyLimitDisplay({ className, showLabel = true }: DailyLimitDisplayProps) {
  const [remaining, setRemaining] = useState(DAILY_REQUEST_LIMIT);

  useEffect(() => {
    const updateRemaining = () => {
      setRemaining(getRemainingRequests());
    };

    // Update immediately
    updateRemaining();

    // Update every 10 seconds to sync with localStorage changes
    const interval = setInterval(updateRemaining, 10000);

    // Listen for storage events (when user makes requests in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gemini-daily-usage') {
        updateRemaining();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const usedCount = DAILY_REQUEST_LIMIT - remaining;
  const percentage = (usedCount / DAILY_REQUEST_LIMIT) * 100;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {showLabel && (
        <span className="text-sm text-muted-foreground">
          AI Requests:
        </span>
      )}
      <div className="flex items-center space-x-1">
        <span className={cn(
          "text-sm font-medium",
          remaining <= 10 ? "text-red-500" : 
          remaining <= 25 ? "text-yellow-500" : 
          "text-green-500"
        )}>
          {remaining}
        </span>
        <span className="text-sm text-muted-foreground">
          / {DAILY_REQUEST_LIMIT}
        </span>
      </div>
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300",
            percentage >= 90 ? "bg-red-500" :
            percentage >= 75 ? "bg-yellow-500" :
            "bg-green-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
