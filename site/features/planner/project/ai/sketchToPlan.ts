/**
 * Sketch-to-plan command module.
 * 
 * This module provides an explicit command interface for converting
 * sketches/images to floor plans through the AI service.
 */

import type { PlannerProject, PlannerFloor, PlannerDisplayUnit } from "../model/types";
import { createRectangularRoomProject } from "../model/project"; // (removed unused createPlannerProject)

/**
 * Sketch-to-plan request options.
 */
export interface SketchToPlanRequest {
  /** The sketch image as a data URL */
  imageDataUrl: string;
  /** Optional name for the resulting project */
  projectName?: string;
  /** Target display unit for the plan */
  displayUnit?: PlannerDisplayUnit;
  /** Optional hints about the sketch (room count, dimensions, etc.) */
  hints?: SketchHints;
}

/**
 * Hints to guide the sketch interpretation.
 */
export interface SketchHints {
  /** Expected number of rooms */
  roomCount?: number;
  /** Known dimensions in mm (width, depth) */
  knownDimensions?: { widthMm: number; depthMm: number };
  /** Room type hints */
  roomTypes?: string[];
}

/**
 * Status of a sketch-to-plan operation.
 */
export type SketchToPlanStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

/**
 * Result of a sketch-to-plan operation.
 */
export interface SketchToPlanResult {
  success: boolean;
  status: SketchToPlanStatus;
  project?: PlannerProject;
  floor?: PlannerFloor;
  error?: string;
  message?: string;
  /** Time taken to process in milliseconds */
  processingTimeMs?: number;
}

/**
 * Progress callback for long-running operations.
 */
export type SketchToPlanProgressCallback = (progress: SketchToPlanProgress) => void;

/**
 * Progress update for sketch-to-plan.
 */
export interface SketchToPlanProgress {
  status: SketchToPlanStatus;
  message: string;
  progressPercent: number;
}

/**
 * Creates a default sketch-to-plan result for failure cases.
 */
function createFailureResult(message: string, error?: string): SketchToPlanResult {
  return {
    success: false,
    status: "failed",
    error,
    message,
  };
}

/**
 * Validates a sketch-to-plan request.
 * @param request - The request to validate
 * @returns Validation errors or empty array if valid
 */
export function validateSketchToPlanRequest(
  request: SketchToPlanRequest,
): string[] {
  const errors: string[] = [];

  if (!request.imageDataUrl) {
    errors.push("Image data URL is required");
  } else if (!request.imageDataUrl.startsWith("data:")) {
    errors.push("Image must be a data URL");
  } else if (!request.imageDataUrl.match(/^data:image\//)) {
    errors.push("Image must be a valid image format");
  }

  if (request.displayUnit) {
    const validUnits: PlannerDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];
    if (!validUnits.includes(request.displayUnit)) {
      errors.push(`Invalid display unit: ${request.displayUnit}`);
    }
  }

  if (request.hints?.roomCount !== undefined) {
    if (request.hints.roomCount < 1 || request.hints.roomCount > 20) {
      errors.push("Room count must be between 1 and 20");
    }
  }

  if (request.hints?.knownDimensions) {
    if (request.hints.knownDimensions.widthMm <= 0 || request.hints.knownDimensions.depthMm <= 0) {
      errors.push("Known dimensions must be positive");
    }
    if (request.hints.knownDimensions.widthMm > 100000 || request.hints.knownDimensions.depthMm > 100000) {
      errors.push("Known dimensions exceed maximum (100m)");
    }
  }

  return errors;
}

export async function executeSketchToPlan(
  request: SketchToPlanRequest,
  onProgress?: SketchToPlanProgressCallback,
): Promise<SketchToPlanResult> {
  const startTime = Date.now();

  const errors = validateSketchToPlanRequest(request);
  if (errors.length > 0) {
    return createFailureResult("Validation failed", errors.join("; "));
  }

  onProgress?.({
    status: "pending",
    message: "Preparing sketch...",
    progressPercent: 10,
  });

  try {
    onProgress?.({
      status: "processing",
      message: "Analyzing sketch with AI...",
      progressPercent: 50,
    });

    const response = await fetch("/api/planner/project-sketch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Unknown conversion error");
    }

    const processingTimeMs = Date.now() - startTime;

    onProgress?.({
      status: "completed",
      message: "Sketch converted successfully",
      progressPercent: 100,
    });

    return {
      success: true,
      status: "completed",
      project: data.project,
      floor: data.floor,
      message: data.message,
      processingTimeMs,
    };
  } catch (err) {
    onProgress?.({
      status: "failed",
      message: "Conversion failed",
      progressPercent: 0,
    });
    return createFailureResult("API request failed", String(err));
  }
}

/**
 * Cancels a running sketch-to-plan operation.
 * Note: In a real implementation, this would cancel the API call.
 * 
 * @returns Cancellation result
 */
export function cancelSketchToPlan(): SketchToPlanResult {
  return {
    success: false,
    status: "cancelled",
    message: "Operation cancelled by user",
  };
}

/**
 * API route path for sketch-to-plan endpoint.
 */
export const SKETCH_TO_PLAN_API_ROUTE = "/api/planner/sketch-to-plan";

/**
 * Checks if sketch-to-plan is available.
 * This would check for API connectivity in a real implementation.
 * 
 * @returns Whether the feature is available
 */
export async function isSketchToPlanAvailable(): Promise<boolean> {
  return true;
}

/**
 * Gets the estimated processing time for a sketch.
 * This is a rough estimate based on image size.
 * 
 * @param imageDataUrl - The image data URL
 * @returns Estimated time in milliseconds
 */
export function estimateProcessingTime(imageDataUrl: string): number {
  // Base time + time proportional to data size
  const baseTime = 2000;
  const sizeFactor = Math.min(imageDataUrl.length / 100000, 5) * 1000;
  return baseTime + sizeFactor;
}