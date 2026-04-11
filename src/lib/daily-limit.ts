'use client';

import { isEducationalEmail } from './constants';
import { hasStoredApiKey } from '@/lib/ai-key-storage';

// Daily limit configuration
export const DAILY_REQUEST_LIMIT = 10;
export const EDUCATIONAL_DAILY_REQUEST_LIMIT = 18;

const DAILY_USAGE_STORAGE_KEY = 'ai-daily-usage';
const LEGACY_DAILY_USAGE_STORAGE_KEY = 'gemini-daily-usage';

interface DailyUsage {
  date: string;
  count: number;
}

// Get today's date as YYYY-MM-DD
function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

// Get current usage for today
export function getDailyUsage(): DailyUsage {
  if (typeof window === 'undefined') {
    return { date: getTodayKey(), count: 0 };
  }

  const today = getTodayKey();
  const stored =
    localStorage.getItem(DAILY_USAGE_STORAGE_KEY) ||
    localStorage.getItem(LEGACY_DAILY_USAGE_STORAGE_KEY);
  
  if (!stored) {
    return { date: today, count: 0 };
  }

  try {
    const usage: DailyUsage = JSON.parse(stored);
    
    // If it's a new day, reset the count
    if (usage.date !== today) {
      return { date: today, count: 0 };
    }
    
    return usage;
  } catch (error) {
    console.error('Error parsing daily usage:', error);
    return { date: today, count: 0 };
  }
}

// Get the appropriate daily limit based on email
function getDailyRequestLimit(email?: string | null): number {
  return isEducationalEmail(email) ? EDUCATIONAL_DAILY_REQUEST_LIMIT : DAILY_REQUEST_LIMIT;
}

// Check if user has reached daily limit
export function hasReachedDailyLimit(email?: string | null): boolean {
  if (hasStoredApiKey()) {
    return false;
  }

  const usage = getDailyUsage();
  const limit = getDailyRequestLimit(email);
  return usage.count >= limit;
}

// Get remaining requests for today
export function getRemainingRequests(email?: string | null): number {
  if (hasStoredApiKey()) {
    return getDailyRequestLimit(email);
  }

  const usage = getDailyUsage();
  const limit = getDailyRequestLimit(email);
  return Math.max(0, limit - usage.count);
}

// Get current daily limit for a user
export function getCurrentDailyLimit(email?: string | null): number {
  return getDailyRequestLimit(email);
}

// Increment daily usage count
export function incrementDailyUsage(): void {
  if (typeof window === 'undefined') return;
  if (hasStoredApiKey()) return;

  const usage = getDailyUsage();
  const newUsage: DailyUsage = {
    date: usage.date,
    count: usage.count + 1
  };
  
  localStorage.setItem(DAILY_USAGE_STORAGE_KEY, JSON.stringify(newUsage));
}

// Reset daily usage (for testing or manual reset)
export function resetDailyUsage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DAILY_USAGE_STORAGE_KEY);
  localStorage.removeItem(LEGACY_DAILY_USAGE_STORAGE_KEY);
}
