"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AI_MODEL_OPTIONS,
  DEFAULT_MODEL_BY_PROVIDER,
  PROVIDER_META,
  SUPPORTED_AI_SERVICES,
  inferProviderFromModel,
  normalizeServiceName,
  parseModelWithOptionalProvider,
  type SupportedAIService,
} from "@/lib/ai-provider-config";
import {
  getStoredApiKeys,
  getStoredDefaultModel,
  setStoredApiKeys,
  setStoredDefaultModel,
  type StoredApiKey,
} from "@/lib/ai-key-storage";
import { cn } from "@/lib/utils";
import { CheckCircle2, ExternalLink, KeyRound, Loader2, ShieldCheck, Sparkles, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function maskApiKey(value: string): string {
  if (value.length <= 8) {
    return "••••••••";
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function normalizeModelValue(value: string): string {
  const { provider, modelId } = parseModelWithOptionalProvider(value);
  const resolvedProvider = provider ?? inferProviderFromModel(modelId) ?? "google";
  const resolvedModel = modelId || DEFAULT_MODEL_BY_PROVIDER[resolvedProvider];
  return `${resolvedProvider}:${resolvedModel}`;
}

export function AiApiKeysForm() {
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);
  const [selectedService, setSelectedService] = useState<SupportedAIService>("google");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [defaultModel, setDefaultModel] = useState<string>(
    `google:${DEFAULT_MODEL_BY_PROVIDER.google}`
  );
  const [testModel, setTestModel] = useState<string>(
    `google:${DEFAULT_MODEL_BY_PROVIDER.google}`
  );
  const [isCheckingKey, setIsCheckingKey] = useState(false);
  const [keyCheckResult, setKeyCheckResult] = useState<
    { ok: boolean; message: string } | null
  >(null);

  useEffect(() => {
    setApiKeys(getStoredApiKeys());
    setDefaultModel(normalizeModelValue(getStoredDefaultModel()));
  }, []);

  useEffect(() => {
    const firstModelForProvider =
      AI_MODEL_OPTIONS.find((model) => model.provider === selectedService && model.recommended)?.id ||
      AI_MODEL_OPTIONS.find((model) => model.provider === selectedService)?.id ||
      `${selectedService}:${DEFAULT_MODEL_BY_PROVIDER[selectedService]}`;

    setTestModel(firstModelForProvider);
    setKeyCheckResult(null);
  }, [selectedService]);

  const selectedProvider = PROVIDER_META[selectedService];
  const providerModelOptions = useMemo(
    () => AI_MODEL_OPTIONS.filter((model) => model.provider === selectedService),
    [selectedService]
  );

  const hasCustomModel = useMemo(
    () => defaultModel.length > 0 && !AI_MODEL_OPTIONS.some((model) => model.id === defaultModel),
    [defaultModel]
  );

  const sortedKeys = useMemo(() => {
    const copy = [...apiKeys];
    copy.sort((a, b) => {
      const normalizedA = normalizeServiceName(a.service) ?? "";
      const normalizedB = normalizeServiceName(b.service) ?? "";

      if (normalizedA === "google") return -1;
      if (normalizedB === "google") return 1;
      return normalizedA.localeCompare(normalizedB);
    });

    return copy;
  }, [apiKeys]);

  const handleSaveKey = () => {
    const cleanedKey = apiKeyInput.trim();
    if (cleanedKey.length < 10) {
      toast.error("Please enter a valid API key.");
      return;
    }

    const next = [
      ...apiKeys.filter((item) => normalizeServiceName(item.service) !== selectedService),
      {
        service: selectedService,
        key: cleanedKey,
        addedAt: new Date().toISOString(),
      },
    ];

    setStoredApiKeys(next);
    setApiKeys(next);
    setApiKeyInput("");
    setKeyCheckResult(null);

    const maybeDefaultProvider = parseModelWithOptionalProvider(defaultModel).provider;
    if (!maybeDefaultProvider) {
      const fallbackModel = `${selectedService}:${DEFAULT_MODEL_BY_PROVIDER[selectedService]}`;
      setDefaultModel(fallbackModel);
      setStoredDefaultModel(fallbackModel);
    }

    toast.success(`${selectedProvider.name} API key saved.`);
  };

  const handleCheckApiKey = async () => {
    const cleanedInput = apiKeyInput.trim();
    const savedKeyForProvider = apiKeys.find(
      (item) => normalizeServiceName(item.service) === selectedService
    )?.key;
    const keyToCheck = cleanedInput || savedKeyForProvider;

    if (!keyToCheck) {
      toast.error("Paste an API key or save one first.");
      return;
    }

    setIsCheckingKey(true);
    setKeyCheckResult(null);

    try {
      const response = await fetch("/api/ai/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: selectedService,
          model: testModel,
          apiKey: keyToCheck,
        }),
      });

      const payload = (await response.json()) as { success?: boolean; error?: string; warning?: string };
      if (response.ok && payload.success) {
        const message =
          payload.warning ||
          `API key is valid for ${testModel.split(":")[1] || testModel}.`;
        setKeyCheckResult({ ok: true, message });
        toast.success(message);
        return;
      }

      const message = payload.error || "Unable to validate this API key for the selected model.";
      setKeyCheckResult({ ok: false, message });
      toast.error(message);
    } catch {
      const message = "Unable to validate key right now. Please try again.";
      setKeyCheckResult({ ok: false, message });
      toast.error(message);
    } finally {
      setIsCheckingKey(false);
    }
  };

  const handleRemoveKey = (service: SupportedAIService) => {
    const next = apiKeys.filter((item) => normalizeServiceName(item.service) !== service);
    setStoredApiKeys(next);
    setApiKeys(next);

    const currentProvider = parseModelWithOptionalProvider(defaultModel).provider;
    if (currentProvider === service) {
      const fallbackProvider =
        (next.length > 0 ? normalizeServiceName(next[0].service) : null) ?? "google";
      const fallbackModel = `${fallbackProvider}:${DEFAULT_MODEL_BY_PROVIDER[fallbackProvider]}`;
      setDefaultModel(fallbackModel);
      setStoredDefaultModel(fallbackModel);
    }

    toast.success("API key removed.");
  };

  const handleDefaultModelChange = (value: string) => {
    const normalized = normalizeModelValue(value);
    setDefaultModel(normalized);
    setStoredDefaultModel(normalized);
    toast.success("Default AI model updated.");
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-xl border p-4",
          "bg-emerald-500/10 border-emerald-500/30",
          "text-emerald-100"
        )}
      >
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-emerald-300 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">Recommended: Google Gemini API key</p>
            <p className="text-sm text-emerald-200/90">
              Gemini gives a free tier, so it is the easiest option for longer usage.
            </p>
            <p className="text-xs text-emerald-200/80">
              Feel free to add your own key. We do not store API keys in our database; they stay only in your browser localStorage on this device.
            </p>
            <Link
              href={PROVIDER_META.google.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-emerald-300 hover:text-emerald-200"
            >
              Get Gemini API key
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
        <div className="flex items-center gap-2 text-zinc-200">
          <ShieldCheck className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold">Quick Setup</h3>
        </div>
        <p className="text-xs text-zinc-400">1. Pick a provider. 2. Paste your key. 3. Choose test model. 4. Check key. 5. Save and set default model.</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
        <div className="flex items-center gap-2 text-zinc-100">
          <KeyRound className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold">Add or Update API Key</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Provider</Label>
            <Select
              value={selectedService}
              onValueChange={(value) => setSelectedService(value as SupportedAIService)}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                {SUPPORTED_AI_SERVICES.map((service) => (
                  <SelectItem key={service} value={service}>
                    {PROVIDER_META[service].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link
              href={selectedProvider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
            >
              Provider docs
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">API Key</Label>
            <Input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={`Paste ${selectedProvider.name} key`}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="space-y-2 max-w-md">
          <Label className="text-xs text-zinc-400">Model To Test</Label>
          <Select value={testModel} onValueChange={setTestModel}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
              {providerModelOptions.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={handleCheckApiKey}
            disabled={isCheckingKey}
            variant="outline"
            className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
          >
            {isCheckingKey ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Check API Key"
            )}
          </Button>
          <Button
            type="button"
            onClick={handleSaveKey}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Save API Key
          </Button>
        </div>

        {keyCheckResult && (
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-sm flex items-start gap-2",
              keyCheckResult.ok
                ? "border-emerald-700/60 bg-emerald-950/30 text-emerald-300"
                : "border-red-800/60 bg-red-950/30 text-red-300"
            )}
          >
            {keyCheckResult.ok ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
            ) : (
              <XCircle className="h-4 w-4 mt-0.5" />
            )}
            <p>{keyCheckResult.message}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-100">Default AI Model</h3>
        <Select value={defaultModel} onValueChange={handleDefaultModelChange}>
          <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <SelectValue placeholder="Select default model" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            {AI_MODEL_OPTIONS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.label}
              </SelectItem>
            ))}
            {hasCustomModel && <SelectItem value={defaultModel}>Custom ({defaultModel})</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-100">Saved Keys</h3>
        {sortedKeys.length === 0 ? (
          <p className="text-sm text-zinc-500">No API keys saved yet.</p>
        ) : (
          <div className="space-y-2">
            {sortedKeys.map((item) => {
              const service = normalizeServiceName(item.service);
              if (!service) {
                return null;
              }

              return (
                <div
                  key={service}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-zinc-200">{PROVIDER_META[service].name}</p>
                    <p className="text-xs text-zinc-500">{maskApiKey(item.key)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveKey(service)}
                    className="border-zinc-700 text-zinc-400 hover:text-red-300 hover:border-red-800 hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}