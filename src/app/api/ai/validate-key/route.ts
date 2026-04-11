import { DEFAULT_MODEL_BY_PROVIDER, normalizeServiceName } from "@/lib/ai-provider-config";
import { initializeAIClient, type AIConfig } from "@/utils/ai-tools";
import { getAuthenticatedUser } from "@/utils/auth";
import { generateText } from "ai";
import { NextResponse } from "next/server";

interface ValidateKeyRequest {
  provider?: string;
  model?: string;
  apiKey?: string;
}

function buildErrorMessage(rawMessage: string): { success: boolean; error?: string; warning?: string } {
  const message = rawMessage.toLowerCase();

  if (message.includes("rate limit") || message.includes("quota") || message.includes("429")) {
    return {
      success: true,
      warning: "Key looks valid, but this provider is currently rate limited or quota exhausted.",
    };
  }

  if (
    message.includes("api key") ||
    message.includes("unauthorized") ||
    message.includes("authentication") ||
    message.includes("invalid key") ||
    message.includes("invalid_api_key")
  ) {
    return {
      success: false,
      error: "Invalid API key for the selected provider/model.",
    };
  }

  if (
    message.includes("model") &&
    (message.includes("not found") || message.includes("not supported") || message.includes("does not exist"))
  ) {
    return {
      success: false,
      error: "This model is not available for the selected provider/key.",
    };
  }

  return {
    success: false,
    error: "Validation failed. Please recheck provider, model, and key.",
  };
}

export async function POST(request: Request) {
  try {
    await getAuthenticatedUser();
  } catch {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ValidateKeyRequest;
    const normalizedProvider = normalizeServiceName(body.provider || "");
    const cleanedApiKey = body.apiKey?.trim() || "";

    if (!normalizedProvider) {
      return NextResponse.json({ success: false, error: "Invalid provider" }, { status: 400 });
    }

    if (cleanedApiKey.length < 10) {
      return NextResponse.json({ success: false, error: "Please provide a valid API key." }, { status: 400 });
    }

    const model = body.model?.trim()
      ? body.model.trim()
      : `${normalizedProvider}:${DEFAULT_MODEL_BY_PROVIDER[normalizedProvider]}`;

    const config: AIConfig = {
      model,
      apiKeys: [
        {
          service: normalizedProvider,
          key: cleanedApiKey,
          addedAt: new Date().toISOString(),
        },
      ],
    };

    const modelClient = initializeAIClient(config);

    await generateText({
      model: modelClient,
      prompt: "Respond with the single word VALID.",
      maxRetries: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const mapped = buildErrorMessage(message);

    if (mapped.success) {
      return NextResponse.json(mapped);
    }

    return NextResponse.json(mapped, { status: 400 });
  }
}
