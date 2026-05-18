import { Redis } from "@upstash/redis";

// Create mock Redis client for development if env vars are not set
const createMockRedisClient = () => {
  const store = new Map<string, { value: unknown; expires?: number }>();

  const isExpired = (key: string) => {
    const entry = store.get(key);
    if (!entry) return true;
    if (entry.expires && Date.now() > entry.expires) {
      store.delete(key);
      return true;
    }
    return false;
  };

  return {
    get: async <T>(key: string): Promise<T | null> => {
      if (isExpired(key)) return null;
      return (store.get(key)?.value ?? null) as T | null;
    },
    set: async (key: string, value: unknown, options?: { ex?: number }) => {
      const expires = options?.ex ? Date.now() + options.ex * 1000 : undefined;
      store.set(key, { value, expires });
      return 'OK';
    },
    del: async (...keys: string[]) => {
      let count = 0;
      for (const key of keys) { if (store.delete(key)) count++; }
      return count;
    },
    keys: async (pattern: string): Promise<string[]> => {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return [...store.keys()].filter(k => regex.test(k));
    },
    hgetall: async (key: string) => {
      if (isExpired(key)) return null;
      return (store.get(key)?.value ?? null) as Record<string, string> | null;
    },
    hset: async (key: string, fieldOrObj: string | Record<string, string>, value?: string) => {
      let existing = (!isExpired(key) ? store.get(key)?.value : null) as Record<string, string> | null || {};
      if (typeof fieldOrObj === 'object') {
        existing = { ...existing, ...fieldOrObj };
        store.set(key, { value: existing });
      } else if (typeof fieldOrObj === 'string' && value !== undefined) {
        existing[fieldOrObj] = value;
        store.set(key, { value: existing });
      }
      return 'OK';
    },
    expire: async (key: string, seconds: number) => {
      const entry = store.get(key);
      if (entry) entry.expires = Date.now() + seconds * 1000;
      return 'OK';
    },
  };
};

// Use real Redis if env vars are set, otherwise use mock
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : createMockRedisClient() as unknown as Redis;

export default redis;

// ── Cache TTLs (seconds) ─────────────────────────────────────────────────────
export const TTL = {
  PROFILE: 900,        // 15 min
  RESUME: 600,         // 10 min
  RESUME_COUNT: 300,   // 5 min
  JOBS: 600,           // 10 min
  RECENT_RESUMES: 180, // 3 min
} as const;

// ── Cache key builders ───────────────────────────────────────────────────────
export const cacheKey = {
  profile: (userId: string) => `cache:profile:${userId}`,
  resume: (userId: string, resumeId: string) => `cache:resume:${userId}:${resumeId}`,
  resumeCount: (userId: string, type: string) => `cache:resume-count:${userId}:${type}`,
  resumeCounts: (userId: string) => `cache:resume-count:${userId}:*`,
  jobs: (userId: string, page: number, pageSize: number) => `cache:jobs:${userId}:${page}:${pageSize}`,
  jobsAll: (userId: string) => `cache:jobs:${userId}:*`,
  recentResumes: (userId: string) => `cache:recent-resumes:${userId}`,
};

// ── Generic helpers ──────────────────────────────────────────────────────────
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

export async function setCache(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    // Redis errors must never block the response
  }
}

export async function deleteCache(...keys: string[]): Promise<void> {
  try {
    if (keys.length > 0) await redis.del(...(keys as [string, ...string[]]));
  } catch { /* ignore */ }
}

export async function deleteCacheByPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...(keys as [string, ...string[]]));
  } catch { /* ignore */ }
}
