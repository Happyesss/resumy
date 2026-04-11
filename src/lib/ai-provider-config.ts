import type { ServiceName } from "@/lib/types";

export type SupportedAIService = Extract<
  ServiceName,
  "google" | "openai" | "anthropic" | "groq" | "deepseek"
>;

export interface ProviderMeta {
  id: SupportedAIService;
  name: string;
  docsUrl: string;
  recommended?: boolean;
  freeTierHint?: string;
}

export interface ModelOption {
  id: string;
  label: string;
  provider: SupportedAIService;
  recommended?: boolean;
}

export const SUPPORTED_AI_SERVICES: SupportedAIService[] = [
  "google",
  "openai",
  "anthropic",
  "groq",
  "deepseek",
];

export const PROVIDER_META: Record<SupportedAIService, ProviderMeta> = {
  google: {
    id: "google",
    name: "Google Gemini",
    docsUrl: "https://ai.google.dev/gemini-api/docs/api-key",
    recommended: true,
    freeTierHint: "Gemini includes a generous free tier.",
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  groq: {
    id: "groq",
    name: "Groq",
    docsUrl: "https://console.groq.com/keys",
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    docsUrl: "https://platform.deepseek.com/api_keys",
  },
};

export const DEFAULT_MODEL_BY_PROVIDER: Record<SupportedAIService, string> = {
  google: "gemini-2.5-flash-lite",
  openai: "gpt-4o-mini",
  anthropic: "claude-3-5-haiku-latest",
  groq: "llama-3.3-70b-versatile",
  deepseek: "deepseek-chat",
};

export const AI_MODEL_OPTIONS: ModelOption[] = [
  {
    id: "google:gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash-Lite",
    provider: "google",
    recommended: true,
  },
  {
    id: "google:gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    provider: "google",
  },
  {
    id: "openai:gpt-4o-mini",
    label: "OpenAI GPT-4o mini",
    provider: "openai",
  },
  {
    id: "anthropic:claude-3-5-haiku-latest",
    label: "Claude 3.5 Haiku",
    provider: "anthropic",
  },
  {
    id: "groq:llama-3.3-70b-versatile",
    label: "Groq Llama 3.3 70B",
    provider: "groq",
  },
  {
    id: "deepseek:deepseek-chat",
    label: "DeepSeek Chat",
    provider: "deepseek",
  },
];

const PROVIDER_ALIASES: Record<string, SupportedAIService> = {
  google: "google",
  gemini: "google",
  openai: "openai",
  anthropic: "anthropic",
  claude: "anthropic",
  groq: "groq",
  deepseek: "deepseek",
};

export function normalizeServiceName(service: string): SupportedAIService | null {
  const normalized = service.trim().toLowerCase();
  return PROVIDER_ALIASES[normalized] ?? null;
}

export function inferProviderFromModel(modelId?: string | null): SupportedAIService | null {
  const normalized = modelId?.trim().toLowerCase() ?? "";
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("gemini")) {
    return "google";
  }

  if (
    normalized.startsWith("gpt") ||
    normalized.startsWith("o1") ||
    normalized.startsWith("o3") ||
    normalized.startsWith("o4") ||
    normalized.includes("chatgpt")
  ) {
    return "openai";
  }

  if (normalized.startsWith("claude")) {
    return "anthropic";
  }

  if (normalized.startsWith("deepseek")) {
    return "deepseek";
  }

  if (
    normalized.includes("llama") ||
    normalized.includes("mixtral") ||
    normalized.includes("gemma")
  ) {
    return "groq";
  }

  return null;
}

export function parseModelWithOptionalProvider(model?: string | null): {
  provider: SupportedAIService | null;
  modelId: string;
} {
  const rawModel = model?.trim() ?? "";

  if (!rawModel) {
    return {
      provider: null,
      modelId: "",
    };
  }

  const separatorIdx = rawModel.indexOf(":");
  if (separatorIdx > 0) {
    const maybeProvider = normalizeServiceName(rawModel.slice(0, separatorIdx));
    if (maybeProvider) {
      const cleanedModel = rawModel.slice(separatorIdx + 1).trim();
      return {
        provider: maybeProvider,
        modelId: cleanedModel || DEFAULT_MODEL_BY_PROVIDER[maybeProvider],
      };
    }
  }

  return {
    provider: inferProviderFromModel(rawModel),
    modelId: rawModel,
  };
}