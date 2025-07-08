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
 * Uses gemini-2.5-flash-lite-preview-06-17 model
 */
export function initializeAIClient(config?: AIConfig, useThinking?: boolean) {
  if (!config) {
    throw new Error('AI configuration is required');
  }

  const { apiKeys } = config;
  
  // We use gemini-2.5-flash-lite-preview-06-17 model
  // First try to use user's API key if provided
  const googleKey = apiKeys.find(k => k.service === 'google')?.key || process.env.GEMINI_API_KEY;
  
  // Make sure we have an API key
  if (!googleKey) {
    throw new Error('Google API key not found - please add a Google API key in your profile settings');
  }
  
  return createGoogleGenerativeAI({ apiKey: googleKey })('gemini-2.5-flash-lite-preview-06-17') as LanguageModelV1;
}
