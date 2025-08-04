'use client';

// Daily limit configuration
export const DAILY_REQUEST_LIMIT = 80;

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
  const stored = localStorage.getItem('gemini-daily-usage');
  
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

// Check if user has reached daily limit
export function hasReachedDailyLimit(): boolean {
  const usage = getDailyUsage();
  return usage.count >= DAILY_REQUEST_LIMIT;
}

// Get remaining requests for today
export function getRemainingRequests(): number {
  const usage = getDailyUsage();
  return Math.max(0, DAILY_REQUEST_LIMIT - usage.count);
}

// Increment daily usage count
export function incrementDailyUsage(): void {
  if (typeof window === 'undefined') return;

  const usage = getDailyUsage();
  const newUsage: DailyUsage = {
    date: usage.date,
    count: usage.count + 1
  };
  
  localStorage.setItem('gemini-daily-usage', JSON.stringify(newUsage));
}

// Reset daily usage (for testing or manual reset)
export function resetDailyUsage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gemini-daily-usage');
}
