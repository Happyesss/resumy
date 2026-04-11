import { createAnthropic } from '@ai-sdk/anthropic';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import {
  DEFAULT_MODEL_BY_PROVIDER,
  inferProviderFromModel,
  normalizeServiceName,
  parseModelWithOptionalProvider,
  type SupportedAIService,
} from '@/lib/ai-provider-config';
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

function sanitizeApiKeys(apiKeys?: Array<ApiKey>): Array<ApiKey> {
  if (!Array.isArray(apiKeys)) {
    return [];
  }

  return apiKeys
    .filter((key): key is ApiKey => {
      return (
        typeof key === 'object' &&
        key !== null &&
        typeof key.service === 'string' &&
        typeof key.key === 'string'
      );
    })
    .map((key) => ({
      service: key.service.trim().toLowerCase(),
      key: key.key.trim(),
      addedAt: key.addedAt,
    }))
    .filter((key) => key.key.length > 0);
}

function getUserApiKey(provider: SupportedAIService, apiKeys: Array<ApiKey>): string | null {
  const matched = apiKeys.find((apiKey) => normalizeServiceName(apiKey.service) === provider);
  return matched?.key ?? null;
}

function getPreferredProviderFromApiKeys(apiKeys: Array<ApiKey>): SupportedAIService | null {
  for (const apiKey of apiKeys) {
    const normalized = normalizeServiceName(apiKey.service);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function getEnvironmentApiKey(provider: SupportedAIService): string | null {
  switch (provider) {
    case 'google':
      return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
    case 'openai':
      return process.env.OPENAI_API_KEY || null;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY || null;
    case 'xai':
      return process.env.XAI_API_KEY || null;
    case 'groq':
      return process.env.GROQ_API_KEY || null;
    case 'deepseek':
      return process.env.DEEPSEEK_API_KEY || null;
    default:
      return null;
  }
}

function getEnvironmentKeyHint(provider: SupportedAIService): string {
  switch (provider) {
    case 'google':
      return 'GEMINI_API_KEY (or GOOGLE_API_KEY)';
    case 'openai':
      return 'OPENAI_API_KEY';
    case 'anthropic':
      return 'ANTHROPIC_API_KEY';
    case 'xai':
      return 'XAI_API_KEY';
    case 'groq':
      return 'GROQ_API_KEY';
    case 'deepseek':
      return 'DEEPSEEK_API_KEY';
    default:
      return 'API_KEY';
  }
}

export function resolveAIProviderAndModel(config?: AIConfig): {
  provider: SupportedAIService;
  modelId: string;
} {
  const cleanedKeys = sanitizeApiKeys(config?.apiKeys);
  const parsedModel = parseModelWithOptionalProvider(config?.model);

  const providerFromModel = parsedModel.provider ?? inferProviderFromModel(parsedModel.modelId);
  const provider = providerFromModel ?? getPreferredProviderFromApiKeys(cleanedKeys) ?? 'google';
  const modelId = parsedModel.modelId || DEFAULT_MODEL_BY_PROVIDER[provider];

  return {
    provider,
    modelId,
  };
}

export function isUsingUserProvidedApiKey(config?: AIConfig): boolean {
  const cleanedKeys = sanitizeApiKeys(config?.apiKeys);
  if (!cleanedKeys.length) {
    return false;
  }

  const { provider } = resolveAIProviderAndModel({
    model: config?.model,
    apiKeys: cleanedKeys,
  });

  return Boolean(getUserApiKey(provider, cleanedKeys));
}

export function initializeAIClient(config?: AIConfig, _useThinking?: boolean): LanguageModelV1 {
  const cleanedKeys = sanitizeApiKeys(config?.apiKeys);
  const { provider, modelId } = resolveAIProviderAndModel({
    model: config?.model,
    apiKeys: cleanedKeys,
  });

  const apiKey = getUserApiKey(provider, cleanedKeys) ?? getEnvironmentApiKey(provider);
  if (!apiKey) {
    throw new Error(
      `No ${provider} API key found. Add one in Profile > AI Keys or set ${getEnvironmentKeyHint(provider)}.`
    );
  }

  switch (provider) {
    case 'google':
      return createGoogleGenerativeAI({ apiKey })(modelId) as LanguageModelV1;
    case 'openai':
      return createOpenAI({ apiKey })(modelId) as LanguageModelV1;
    case 'anthropic':
      return createAnthropic({ apiKey })(modelId) as LanguageModelV1;
    case 'xai':
      return createOpenAI({
        apiKey,
        baseURL: 'https://api.x.ai/v1',
      })(modelId) as LanguageModelV1;
    case 'groq':
      return createGroq({ apiKey })(modelId) as LanguageModelV1;
    case 'deepseek':
      return createDeepSeek({ apiKey })(modelId) as LanguageModelV1;
    default:
      return createGoogleGenerativeAI({ apiKey })(modelId) as LanguageModelV1;
  }
}
