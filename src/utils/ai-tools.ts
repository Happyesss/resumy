import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LanguageModelV1 } from 'ai';

// Legacy types kept for backward compatibility
export type ApiKey = {
  service: string;
  key: string;
  addedAt: string;
};

export type AIConfig = {
  model?: string;
  apiKeys?: Array<ApiKey>;
};

/**
 * Initializes an AI client using environment variables
 * Uses gemini-2.5-flash-lite model with GEMINI_API_KEY from environment
 */
export function initializeAIClient(config?: AIConfig, useThinking?: boolean) {
  // Always use environment variable since user API keys are no longer supported
  const envKey = process.env.GEMINI_API_KEY;
  if (!envKey) {
    throw new Error('GEMINI_API_KEY environment variable must be set');
  }
  
  return createGoogleGenerativeAI({ apiKey: envKey })('gemini-2.5-flash-lite') as LanguageModelV1;
}
