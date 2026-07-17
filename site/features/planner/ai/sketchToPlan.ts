/**
 * Server-side sketch-to-plan conversion (provider chain + OpenAI).
 * Client/editor code must import from `./sketchToPlanShared` only.
 */

import "server-only";

import OpenAI from "openai";

import { SketchToPlanResponseSchema } from "@/features/shared/api/schemas";
import { resolveProviderChain } from "@/lib/ai/providerChain";

import {
  SKETCH_TO_PLAN_SYSTEM_PROMPT,
  classifySketchConversionError,
  createSketchConversionError,
  getSketchRecoveryMessage,
  type SketchToPlanRequest,
} from "./sketchToPlanShared";

// Re-export client-safe surface for server routes and unit tests.
export {
  SKETCH_RECOVERY_MESSAGES,
  SKETCH_TO_PLAN_SYSTEM_PROMPT,
  SketchConversionError,
  buildSketchPlanFabricDraft,
  classifySketchConversionError,
  getSketchRecoveryMessage,
  type SketchRecoveryState,
  type SketchToPlanRequest,
  type SketchToPlanResponse,
} from "./sketchToPlanShared";

function buildUserContent(request: SketchToPlanRequest) {
  return [
    {
      type: "text" as const,
      text: [
        `Sketch file: ${request.fileName}`,
        `User prompt: ${request.prompt}`,
        `Include rooms: ${request.includeRooms ? "yes" : "no"}`,
        "Convert the sketch into editable walls and rooms.",
        "Use the simplest geometry that preserves the sketch intent.",
      ].join("\n"),
    },
    {
      type: "image_url" as const,
      image_url: { url: request.imageDataUrl },
    },
  ];
}

function createSketchClient() {
  const provider = resolveProviderChain()[0];
  if (!provider) {
    throw createSketchConversionError("missing_provider", "sketch", getSketchRecoveryMessage("missing_provider"));
  }
  return new OpenAI({
    apiKey: provider.apiKey,
    baseURL: provider.baseURL,
    defaultHeaders: "defaultHeaders" in provider ? provider.defaultHeaders : undefined,
  });
}

function parseSketchResponse(raw: string) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return SketchToPlanResponseSchema.parse(JSON.parse(raw.slice(start, end + 1)));
  } catch {
    return null;
  }
}

async function withSketchTimeout<T>(work: Promise<T>, fileName: string, timeoutMs = 30_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(createSketchConversionError("timeout", fileName));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function requestSketchToPlan(request: SketchToPlanRequest) {
  const provider = resolveProviderChain()[0];
  if (!provider) {
    throw createSketchConversionError("missing_provider", request.fileName);
  }

  const client = createSketchClient();
  const completion = await (async () => {
    try {
      return await withSketchTimeout(
        client.chat.completions.create({
          model: provider.model,
          messages: [
            { role: "system", content: SKETCH_TO_PLAN_SYSTEM_PROMPT },
            { role: "user", content: buildUserContent(request) },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
        request.fileName,
      );
    } catch (error) {
      throw classifySketchConversionError(error, request.fileName);
    }
  })();

  const content = completion.choices[0]?.message?.content;
  const raw = Array.isArray(content)
    ? content.map((part) => (typeof part === "string" ? part : "")).join("")
    : String(content ?? "");
  const parsed = parseSketchResponse(raw);
  if (!parsed) {
    throw createSketchConversionError("invalid_response", request.fileName);
  }
  if (parsed.objects.length === 0) {
    throw createSketchConversionError("low_confidence", request.fileName);
  }
  if (parsed.warnings.some((warning) => /low confidence|uncertain|not confident/i.test(warning))) {
    throw createSketchConversionError(
      "low_confidence",
      request.fileName,
      parsed.warnings[0] ?? getSketchRecoveryMessage("low_confidence"),
    );
  }
  return parsed;
}
