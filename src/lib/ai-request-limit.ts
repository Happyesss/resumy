'use client';

import {
  getCurrentDailyLimit,
  getRemainingRequests,
  hasReachedDailyLimit,
  incrementDailyUsage,
  resetDailyUsage,
} from '@/lib/daily-limit';

// Backward-compatible wrappers around the single daily limiter.
export function hasReachedAILimit(email?: string | null): boolean {
  return hasReachedDailyLimit(email);
}

export function getRemainingAIRequests(email?: string | null): number {
  return getRemainingRequests(email);
}

export function getAIRequestLimit(email?: string | null): number {
  return getCurrentDailyLimit(email);
}

export function incrementAIUsage(_email?: string | null): void {
  incrementDailyUsage();
}

export function resetAIUsage(_email?: string | null): void {
  resetDailyUsage();
}
