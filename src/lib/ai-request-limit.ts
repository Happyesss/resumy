'use client';

// Hardcoded limit for all users
const TOTAL_AI_REQUEST_LIMIT = 50;

interface UsageData {
  count: number;
}

// Get current usage count
function getUsageCount(userId?: string): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const storageKey = userId ? `ai-request-count-${userId}` : 'ai-request-count';
  const stored = localStorage.getItem(storageKey);
  
  if (!stored) {
    return 0;
  }

  try {
    const usage: UsageData = JSON.parse(stored);
    return usage.count || 0;
  } catch (error) {
    console.error('Error parsing AI request usage:', error);
    return 0;
  }
}

// Check if user has reached the limit
export function hasReachedAILimit(userId?: string): boolean {
  const count = getUsageCount(userId);
  return count >= TOTAL_AI_REQUEST_LIMIT;
}

// Get remaining requests
export function getRemainingAIRequests(userId?: string): number {
  const count = getUsageCount(userId);
  return Math.max(0, TOTAL_AI_REQUEST_LIMIT - count);
}

// Get current limit (always returns 50)
export function getAIRequestLimit(): number {
  return TOTAL_AI_REQUEST_LIMIT;
}

// Increment AI request count
export function incrementAIUsage(userId?: string): void {
  if (typeof window === 'undefined') return;

  const storageKey = userId ? `ai-request-count-${userId}` : 'ai-request-count';
  const currentCount = getUsageCount(userId);
  
  const newUsage: UsageData = {
    count: currentCount + 1
  };
  
  localStorage.setItem(storageKey, JSON.stringify(newUsage));
}

// Reset usage (for testing)
export function resetAIUsage(userId?: string): void {
  if (typeof window === 'undefined') return;
  const storageKey = userId ? `ai-request-count-${userId}` : 'ai-request-count';
  localStorage.removeItem(storageKey);
}
