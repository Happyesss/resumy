import type { ServiceName } from "@/lib/types";

export type SupportedAIService = Extract<
  ServiceName,
  "google" | "openai" | "anthropic" | "xai" | "deepseek" | "groq"
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
  "xai",
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
  xai: {
    id: "xai",
    name: "xAI (Grok)",
    docsUrl: "https://console.x.ai/",
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    docsUrl: "https://platform.deepseek.com/api_keys",
  },
  groq: {
    id: "groq",
    name: "Groq",
    docsUrl: "https://console.groq.com/keys",
  },
};

export const DEFAULT_MODEL_BY_PROVIDER: Record<SupportedAIService, string> = {
  google: "gemini-2.5-flash-lite",
  openai: "gpt-5-mini",
  anthropic: "claude-sonnet-4-6",
  xai: "grok-4.1",
  deepseek: "deepseek-v3.2",
  // Keep legacy default for users who still have old Groq keys configured.
  groq: "llama-3.3-70b-versatile",
};

export const AI_MODEL_OPTIONS: ModelOption[] = [
  {
    id: "google:gemini-3.1-flash",
    label: "Gemini 3.1 Flash",
    provider: "google",
  },
  {
    id: "google:gemini-3.1-flash-lite",
    label: "Gemini 3.1 Flash Lite",
    provider: "google",
  },
  {
    id: "google:gemini-3.0-flash",
    label: "Gemini 3.0 Flash",
    provider: "google",
  },
  {
    id: "google:gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    provider: "google",
  },
  {
    id: "google:gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite",
    provider: "google",
    recommended: true,
  },
  {
    id: "openai:gpt-5-mini",
    label: "GPT-5 Mini",
    provider: "openai",
  },
  {
    id: "openai:gpt-5-nano",
    label: "GPT-5 Nano",
    provider: "openai",
  },
  {
    id: "openai:gpt-4.1",
    label: "GPT-4.1",
    provider: "openai",
  },
  {
    id: "openai:gpt-4o-mini",
    label: "GPT-4o Mini",
    provider: "openai",
  },
  {
    id: "anthropic:claude-sonnet-4-6",
    label: "Claude Sonnet 4.6",
    provider: "anthropic",
  },
  {
    id: "anthropic:claude-sonnet-4-5",
    label: "Claude Sonnet 4.5",
    provider: "anthropic",
  },
  {
    id: "anthropic:claude-haiku-4-5",
    label: "Claude Haiku 4.5",
    provider: "anthropic",
  },
  {
    id: "anthropic:claude-haiku-4",
    label: "Claude Haiku 4",
    provider: "anthropic",
  },
  {
    id: "anthropic:claude-3-7-sonnet",
    label: "Claude 3.7 Sonnet",
    provider: "anthropic",
  },
  {
    id: "xai:grok-4.1",
    label: "Grok 4.1",
    provider: "xai",
  },
  {
    id: "xai:grok-4.1-fast",
    label: "Grok 4.1 Fast",
    provider: "xai",
  },
  {
    id: "xai:grok-4-turbo",
    label: "Grok 4 Turbo",
    provider: "xai",
  },
  {
    id: "xai:grok-3.5",
    label: "Grok 3.5",
    provider: "xai",
  },
  {
    id: "xai:grok-3",
    label: "Grok 3",
    provider: "xai",
  },
  {
    id: "deepseek:deepseek-v3.2",
    label: "DeepSeek V3.2",
    provider: "deepseek",
    recommended: true,
  },
  {
    id: "deepseek:deepseek-v3",
    label: "DeepSeek V3",
    provider: "deepseek",
  },
  {
    id: "deepseek:deepseek-r1",
    label: "DeepSeek R1",
    provider: "deepseek",
  },
  {
    id: "deepseek:deepseek-r2",
    label: "DeepSeek R2",
    provider: "deepseek",
  },
];

const PROVIDER_ALIASES: Record<string, SupportedAIService> = {
  google: "google",
  gemini: "google",
  openai: "openai",
  anthropic: "anthropic",
  claude: "anthropic",
  xai: "xai",
  grok: "xai",
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

  if (normalized.startsWith("grok")) {
    return "xai";
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