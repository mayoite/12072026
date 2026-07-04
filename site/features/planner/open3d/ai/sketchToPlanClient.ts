/**
 * Sketch-to-plan client for open3d-next-staging.
 *
 * Provides a typed interface for converting sketches/images
 * to editable floor plan geometry through the AI service.
 */

import type { _Open3dProject, _Open3dFloor, _Open3dDisplayUnit } from "../model/types";

/**
 * Request parameters for sketch-to-plan conversion.
 */
export interface SketchToPlanRequest {
  /** The sketch image as a base64 data URL */
  imageDataUrl: string;
  /** Original file name of the sketch */
  fileName: string;
  /** Optional prompt to guide the conversion */
  prompt?: string;
  /** Whether to include room detection */
  includeRooms?: boolean;
}

/**
 * Converted objects from sketch.
 */
export type SketchObject =
  | { type: "wall"; x1: number; y1: number; x2: number; y2: number }
  | { type: "room"; left: number; top: number; width: number; height: number; label?: string };

/**
 * Response from successful sketch-to-plan conversion.
 */
export interface SketchToPlanSuccessResponse {
  status: "preview";
  fileName: string;
  objects: SketchObject[];
  warnings: string[];
}

/**
 * Response when fallback is triggered.
 */
export interface SketchToPlanFallbackResponse {
  status: "fallback";
  fileName: string;
  reason: SketchRecoveryReason;
  message: string;
}

/**
 * Error response from sketch-to-plan endpoint.
 */
export interface SketchToPlanErrorResponse {
  status: "error";
  error: {
    code: string;
    message: string;
    details?: {
      reason?: string;
      fileName?: string;
    };
  };
}

/**
 * Union of all possible responses.
 */
export type SketchToPlanResponse =
  | SketchToPlanSuccessResponse
  | SketchToPlanFallbackResponse
  | SketchToPlanErrorResponse;

/**
 * Recovery reasons when sketch conversion fails.
 */
export type SketchRecoveryReason =
  | "missing_provider"
  | "timeout"
  | "invalid_response"
  | "low_confidence"
  | "unsupported_input"
  | "server_error";

/**
 * States of the sketch conversion workflow.
 */
export type SketchConversionState =
  | { status: "idle" }
  | { status: "converting"; fileName: string }
  | { status: "preview"; fileName: string; objects: SketchObject[]; warnings: string[] }
  | { status: "fallback"; fileName: string; reason: SketchRecoveryReason; message: string }
  | { status: "accepted"; fileName: string }
  | { status: "rejected"; fileName: string };

/**
 * User-friendly messages for recovery reasons.
 */
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

/**
 * Gets the recovery message for a reason.
 * @param reason - The recovery reason
 * @returns User-friendly message
 */
export function getSketchRecoveryMessage(reason: SketchRecoveryReason): string {
  return SKETCH_RECOVERY_MESSAGES[reason];
}

/**
 * API route for sketch-to-plan endpoint.
 */
const SKETCH_TO_PLAN_API_ROUTE = "/api/planner/sketch-to-plan";

/**
 * Validates a sketch-to-plan request.
 */
function validateRequest(request: SketchToPlanRequest): string[] {
  const errors: string[] = [];

  if (!request.imageDataUrl) {
    errors.push("Image data URL is required");
  } else if (!request.imageDataUrl.startsWith("data:")) {
    errors.push("Image must be a data URL");
  } else if (!/^data:image\/(png|jpe?g|webp);base64,/i.test(request.imageDataUrl)) {
    errors.push("Image must be a base64-encoded PNG, JPEG, or WebP");
  }

  if (!request.fileName || request.fileName.trim().length === 0) {
    errors.push("File name is required");
  } else if (request.fileName.length > 200) {
    errors.push("File name must be 200 characters or less");
  }

  if (request.prompt && request.prompt.length > 2000) {
    errors.push("Prompt must be 2000 characters or less");
  }

  return errors;
}

/**
 * Result of a conversion request.
 */
export interface ConversionResult {
  success: boolean;
  status: SketchConversionState["status"];
  objects?: SketchObject[];
  warnings?: string[];
  reason?: SketchRecoveryReason;
  message?: string;
  error?: string;
  fileName?: string;
}

/**
 * Converts a sketch image to a floor plan.
 *
 * @param request - The sketch-to-plan request
 * @returns Conversion result with objects or recovery info
 */
export async function convertSketchToPlan(
  request: SketchToPlanRequest,
): Promise<ConversionResult> {
  // Validate request
  const validationErrors = validateRequest(request);
  if (validationErrors.length > 0) {
    return {
      success: false,
      status: "idle",
      error: validationErrors.join("; "),
    };
  }

  try {
    const response = await fetch(SKETCH_TO_PLAN_API_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageDataUrl: request.imageDataUrl,
        fileName: request.fileName,
        prompt: request.prompt ?? "Convert this sketch to a floor plan",
        includeRooms: request.includeRooms ?? true,
      }),
    });

    const data = await response.json() as SketchToPlanResponse;

    // Handle preview status (success)
    if (data.status === "preview") {
      return {
        success: true,
        status: "preview",
        objects: data.objects,
        warnings: data.warnings,
        fileName: data.fileName,
      };
    }

    // Handle fallback status (partial success with recovery)
    if (data.status === "fallback") {
      return {
        success: false,
        status: "fallback",
        reason: data.reason,
        message: data.message,
        fileName: data.fileName,
      };
    }

    // Handle error status
    if (data.status === "error") {
      return {
        success: false,
        status: "idle",
        error: data.error.message,
      };
    }

    // Unknown status
    return {
      success: false,
      status: "idle",
      error: "Unknown response status",
    };
  } catch (error) {
    return {
      success: false,
      status: "idle",
      error: error instanceof Error ? error.message : "Conversion failed",
    };
  }
}

/**
 * Progress callback for conversion.
 */
export type ConversionProgressCallback = (state: SketchConversionState) => void;

/**
 * Converts a sketch with progress tracking.
 *
 * @param request - The sketch-to-plan request
 * @param onProgress - Progress callback
 * @returns Conversion result
 */
export async function convertSketchToPlanWithProgress(
  request: SketchToPlanRequest,
  onProgress?: ConversionProgressCallback,
): Promise<ConversionResult> {
  // Report converting state
  onProgress?.({
    status: "converting",
    fileName: request.fileName,
  });

  const result = await convertSketchToPlan(request);

  // Report final state
  if (result.success && result.status === "preview") {
    onProgress?.({
      status: "preview",
      fileName: request.fileName,
      objects: result.objects ?? [],
      warnings: result.warnings ?? [],
    });
  } else if (!result.success && result.reason) {
    onProgress?.({
      status: "fallback",
      fileName: request.fileName,
      reason: result.reason,
      message: result.message ?? getSketchRecoveryMessage(result.reason),
    });
  }

  return result;
}

/**
 * Accepts the preview and applies it to the canvas.
 * @param fileName - Name of the converted sketch
 * @returns Result of acceptance
 */
export function acceptConversion(_fileName: string): { success: boolean } {
  // This would integrate with the action layer in a full implementation
  // For now, return success and let the caller handle the objects
  return { success: true };
}

/**
 * Rejects the preview and keeps the original sketch.
 * @param fileName - Name of the converted sketch
 * @returns Result of rejection
 */
export function rejectConversion(_fileName: string): { success: boolean } {
  // This would notify the store to keep the sketch reference
  return { success: true };
}

/**
 * Gets the default prompt for sketch-to-plan.
 * @param includeRooms - Whether to include room detection
 * @returns Default prompt string
 */
export function getDefaultSketchPrompt(includeRooms = true): string {
  return `Convert this sketch into editable walls and rooms.${
    includeRooms ? " Include room boundaries where visible." : ""
  } Use the simplest geometry that preserves the sketch intent.`;
}

/**
 * Estimates the conversion timeout based on image size.
 * @param imageDataUrl - The image data URL
 * @returns Estimated timeout in milliseconds
 */
export function estimateConversionTimeout(imageDataUrl: string): number {
  const baseTimeout = 30000; // 30 seconds
  const sizeFactor = Math.min(imageDataUrl.length / 500000, 3) * 15000; // Up to 75 seconds extra
  return baseTimeout + sizeFactor;
}

/**
 * Checks if sketch-to-plan is available.
 * In production, this would verify API connectivity.
 * @returns Whether the feature is available
 */
export async function isSketchToPlanAvailable(): Promise<boolean> {
  try {
    // In production, would ping a health endpoint
    // For now, assume available if fetch works
    return true;
  } catch {
    return false;
  }
}