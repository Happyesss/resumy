import { Redis } from "@upstash/redis";

// Create mock Redis client for development if env vars are not set
const createMockRedisClient = () => {
  const store = new Map();
  
  return {
    hgetall: async (key: string) => {
      return store.get(key) || null;
    },
    hset: async (key: string, fieldOrObj: string | Record<string, string>, value?: string) => {
      let existing = store.get(key) || {};
      
      // Handle both object and field-value formats
      if (typeof fieldOrObj === 'object') {
        existing = { ...existing, ...fieldOrObj };
        store.set(key, existing);
      } else if (typeof fieldOrObj === 'string' && value !== undefined) {
        existing[fieldOrObj] = value;
        store.set(key, existing);
      }
      
      return 'OK';
    },
    expire: async (_key: string, _seconds: number) => {
      return 'OK';
    }
  };
};

// Use real Redis if env vars are set, otherwise use mock
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : createMockRedisClient();

export default redis;
