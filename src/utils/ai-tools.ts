import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LanguageModelV1 } from 'ai';

export type ApiKey = {
  service: string;
  key: string;
  addedAt: string;
};

export type AIConfig = {
  model: string;
  apiKeys: Array<ApiKey>;
};

/**
 * Initializes an AI client based on the provided configuration
 * Uses gemini-2.5-flash-lite model
 */
export function initializeAIClient(config?: AIConfig, useThinking?: boolean) {
  if (!config) {
    // If no config provided, try to use environment variables
    const envKey = process.env.GEMINI_API_KEY;
    if (!envKey) {
      throw new Error('AI configuration is required or GEMINI_API_KEY environment variable must be set');
    }
    return createGoogleGenerativeAI({ apiKey: envKey })('gemini-2.5-flash-lite') as LanguageModelV1;
  }

  const { apiKeys } = config;
  
  // We use gemini-2.5-flash-lite model
  // First try to use user's API key if provided
  const googleKey = apiKeys?.find(k => k.service === 'google')?.key || process.env.GEMINI_API_KEY;
  
  // Make sure we have an API key
  if (!googleKey) {
    throw new Error('Google API key not found - please add a Google API key in your profile settings or set GEMINI_API_KEY environment variable');
  }
  
  return createGoogleGenerativeAI({ apiKey: googleKey })('gemini-2.5-flash-lite') as LanguageModelV1;
}
