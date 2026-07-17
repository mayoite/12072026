/**
 * Client-safe sketch-to-plan types, messages, and pure helpers.
 * Do not import server-only modules here — editor chrome imports this path.
 */

import type { SketchRecoveryReason } from "@/features/shared/api/schemas";

export type SketchToPlanRequest = {
  imageDataUrl: string;
  fileName: string;
  prompt: string;
  includeRooms: boolean;
};

export type SketchToPlanResponse = {
  objects: Array<
    | { type: "wall"; x1: number; y1: number; x2: number; y2: number }
    | { type: "room"; left: number; top: number; width: number; height: number; label?: string }
  >;
  warnings: string[];
};

export type SketchRecoveryState =
  | { status: "idle" }
  | { status: "converting"; fileName: string }
  | {
      status: "preview";
      fileName: string;
      generatedDraftJson: string;
      previousDraftJson: string;
      warnings: string[];
    }
  | {
      status: "fallback";
      fileName: string;
      reason: SketchRecoveryReason;
      message: string;
    }
  | { status: "accepted"; fileName: string }
  | { status: "rejected"; fileName: string };

export const SKETCH_RECOVERY_MESSAGES: Record<SketchRecoveryReason, string> = {
  missing_provider:
    "AI conversion is unavailable. The sketch is kept as a reference so you can trace it manually.",
  timeout: "Conversion did not finish. The sketch is kept as a reference and you can retry.",
  invalid_response:
    "The conversion was not reliable enough to apply. The sketch is kept as a reference.",
  low_confidence:
    "The conversion was not reliable enough to apply. The sketch is kept as a reference.",
  unsupported_input:
    "The sketch input could not be used. The sketch is kept as a reference so you can trace it manually.",
  server_error: "Conversion did not finish. The sketch is kept as a reference and you can retry.",
};

export function getSketchRecoveryMessage(reason: SketchRecoveryReason): string {
  return SKETCH_RECOVERY_MESSAGES[reason];
}

export class SketchConversionError extends Error {
  readonly reason: SketchRecoveryReason;
  readonly fileName: string;

  constructor(
    reason: SketchRecoveryReason,
    fileName: string,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options?.cause === undefined ? undefined : { cause: options.cause });
    this.name = "SketchConversionError";
    this.reason = reason;
    this.fileName = fileName;
  }
}

export function createSketchConversionError(
  reason: SketchRecoveryReason,
  fileName: string,
  message = getSketchRecoveryMessage(reason),
  cause?: unknown,
) {
  return new SketchConversionError(
    reason,
    fileName,
    message || getSketchRecoveryMessage(reason),
    cause === undefined ? undefined : { cause },
  );
}

function classifySketchErrorReason(error: unknown): SketchRecoveryReason {
  if (error instanceof SketchConversionError) {
    return error.reason;
  }

  if (error instanceof Error) {
    const message = `${error.name}: ${error.message}`.toLowerCase();
    if (message.includes("missing ai provider") || message.includes("provider credentials")) {
      return "missing_provider";
    }
    if (
      message.includes("timeout") ||
      message.includes("timed out") ||
      message.includes("aborted") ||
      error.name === "AbortError"
    ) {
      return "timeout";
    }
    if (message.includes("unsupported") || message.includes("decode") || message.includes("mime")) {
      return "unsupported_input";
    }
    if (message.includes("low confidence")) {
      return "low_confidence";
    }
    if (message.includes("json") || message.includes("schema") || message.includes("valid json")) {
      return "invalid_response";
    }
  }

  return "server_error";
}

export function classifySketchConversionError(error: unknown, fileName: string) {
  if (error instanceof SketchConversionError) {
    return error;
  }
  const reason = classifySketchErrorReason(error);
  return createSketchConversionError(reason, fileName, getSketchRecoveryMessage(reason), error);
}

export const SKETCH_TO_PLAN_SYSTEM_PROMPT = [
  "You convert a hand sketch into a simple editable floor plan.",
  "Return only valid JSON with an objects array and warnings array.",
  "Prefer walls and rectangular rooms; do not return blueprint overlays.",
  "The output must be editable geometry, not a rendered image.",
].join(" ");

export function buildSketchPlanFabricDraft(response: SketchToPlanResponse): string {
  const objects = response.objects.map((object) => {
    if (object.type === "wall") {
      return {
        type: "line",
        version: "5.3.0",
        x1: object.x1,
        y1: object.y1,
        x2: object.x2,
        y2: object.y2,
        left: Math.min(object.x1, object.x2),
        top: Math.min(object.y1, object.y2),
        width: Math.abs(object.x2 - object.x1) || 1,
        height: Math.abs(object.y2 - object.y1) || 1,
        stroke: "var(--color-dark-midnight-blue-750)",
        strokeWidth: 2,
        selectable: true,
        evented: true,
        hasControls: false,
        hasBorders: false,
        originX: "left",
        originY: "top",
        name: `WALL:${crypto.randomUUID()}`,
      };
    }

    return {
      type: "rect",
      version: "5.3.0",
      left: object.left,
      top: object.top,
      width: object.width,
      height: object.height,
      fill: "var(--surface-sustain-soft)",
      stroke: "var(--text-heading-soft)",
      strokeWidth: 2,
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      originX: "left",
      originY: "top",
      name: `ROOM:${object.label ?? "Room"}`,
    };
  });

  return JSON.stringify({
    version: "5.3.0",
    objects,
    background: "var(--surface-status-bad)",
  });
}
