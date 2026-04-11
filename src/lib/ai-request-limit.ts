'use client';

import {
  getCurrentDailyLimit,
  getRemainingRequests,
  hasReachedDailyLimit,
  incrementDailyUsage,
  resetDailyUsage,
} from '@/lib/daily-limit';

// Backward-compatible wrappers around the single daily limiter.
export function hasReachedAILimit(_userId?: string): boolean {
  return hasReachedDailyLimit();
}

export function getRemainingAIRequests(_userId?: string): number {
  return getRemainingRequests();
}

export function getAIRequestLimit(): number {
  return getCurrentDailyLimit();
}

export function incrementAIUsage(_userId?: string): void {
  incrementDailyUsage();
}

export function resetAIUsage(_userId?: string): void {
  resetDailyUsage();
}
