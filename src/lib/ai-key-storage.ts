'use client';

import {
  DEFAULT_MODEL_BY_PROVIDER,
  inferProviderFromModel,
  normalizeServiceName,
  parseModelWithOptionalProvider,
  type SupportedAIService,
} from "@/lib/ai-provider-config";

export interface StoredApiKey {
  service: string;
  key: string;
  addedAt: string;
}

export const PRIMARY_API_KEYS_STORAGE_KEY = "resumy-api-keys";
export const LEGACY_API_KEYS_STORAGE_KEY = "resumelm-api-keys";
export const PRIMARY_MODEL_STORAGE_KEY = "resumy-default-model";
export const LEGACY_MODEL_STORAGE_KEY = "resumelm-default-model";

export const API_KEYS_STORAGE_KEYS = [
  PRIMARY_API_KEYS_STORAGE_KEY,
  LEGACY_API_KEYS_STORAGE_KEY,
] as const;

export const MODEL_STORAGE_KEYS = [
  PRIMARY_MODEL_STORAGE_KEY,
  LEGACY_MODEL_STORAGE_KEY,
] as const;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readFirstAvailableValue(keys: readonly string[]): string | null {
  if (!canUseStorage()) {
    return null;
  }

  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value && value.trim()) {
      return value;
    }
  }

  return null;
}

function normalizeApiKeys(apiKeys: StoredApiKey[]): StoredApiKey[] {
  const byService = new Map<string, StoredApiKey>();

  for (const apiKey of apiKeys) {
    const cleanedKey = apiKey.key?.trim();
    const service = normalizeServiceName(apiKey.service) ?? apiKey.service.trim().toLowerCase();

    if (!service || !cleanedKey) {
      continue;
    }

    byService.set(service, {
      service,
      key: cleanedKey,
      addedAt: apiKey.addedAt || new Date().toISOString(),
    });
  }

  return [...byService.values()];
}

function parseApiKeyPayload(rawValue: string | null): StoredApiKey[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is StoredApiKey => {
        if (!item || typeof item !== "object") {
          return false;
        }

        const candidate = item as Partial<StoredApiKey>;
        return typeof candidate.service === "string" && typeof candidate.key === "string";
      })
      .map((item) => ({
        service: item.service,
        key: item.key,
        addedAt: typeof item.addedAt === "string" ? item.addedAt : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export function getStoredApiKeys(): StoredApiKey[] {
  if (!canUseStorage()) {
    return [];
  }

  const allKeys = API_KEYS_STORAGE_KEYS.flatMap((storageKey) =>
    parseApiKeyPayload(window.localStorage.getItem(storageKey))
  );

  return normalizeApiKeys(allKeys);
}

export function setStoredApiKeys(apiKeys: StoredApiKey[]): void {
  if (!canUseStorage()) {
    return;
  }

  const normalized = normalizeApiKeys(apiKeys);
  const payload = JSON.stringify(normalized);

  for (const storageKey of API_KEYS_STORAGE_KEYS) {
    window.localStorage.setItem(storageKey, payload);
  }
}

export function hasStoredApiKey(service?: SupportedAIService): boolean {
  const apiKeys = getStoredApiKeys();
  if (!apiKeys.length) {
    return false;
  }

  if (!service) {
    return true;
  }

  return apiKeys.some((apiKey) => normalizeServiceName(apiKey.service) === service);
}

export function hasStoredKeyForModel(model?: string | null): boolean {
  const apiKeys = getStoredApiKeys();
  if (!apiKeys.length) {
    return false;
  }

  const { provider, modelId } = parseModelWithOptionalProvider(model);
  const inferredProvider = provider ?? inferProviderFromModel(modelId);
  if (!inferredProvider) {
    return apiKeys.length > 0;
  }

  return apiKeys.some((apiKey) => normalizeServiceName(apiKey.service) === inferredProvider);
}

export function getStoredDefaultModel(): string {
  const stored = readFirstAvailableValue(MODEL_STORAGE_KEYS);
  if (stored && stored.trim()) {
    return stored.trim();
  }

  const keys = getStoredApiKeys();
  const firstProvider = keys.length ? normalizeServiceName(keys[0].service) : null;
  if (firstProvider) {
    return `${firstProvider}:${DEFAULT_MODEL_BY_PROVIDER[firstProvider]}`;
  }

  return `google:${DEFAULT_MODEL_BY_PROVIDER.google}`;
}

export function setStoredDefaultModel(model: string): void {
  if (!canUseStorage()) {
    return;
  }

  const cleanedModel = model.trim();
  if (!cleanedModel) {
    return;
  }

  for (const storageKey of MODEL_STORAGE_KEYS) {
    window.localStorage.setItem(storageKey, cleanedModel);
  }
}