/**
 * Sketch-to-plan command module.
 * 
 * This module provides an explicit command interface for converting
 * sketches/images to floor plans through the AI service.
 */

import type { Open3dProject, Open3dFloor, Open3dDisplayUnit } from "../model/types";
import { createRectangularRoomProject } from "../model/project"; // (removed unused createOpen3dProject)

/**
 * Sketch-to-plan request options.
 */
export interface SketchToPlanRequest {
  /** The sketch image as a data URL */
  imageDataUrl: string;
  /** Optional name for the resulting project */
  projectName?: string;
  /** Target display unit for the plan */
  displayUnit?: Open3dDisplayUnit;
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
  project?: Open3dProject;
  floor?: Open3dFloor;
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
    const validUnits: Open3dDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];
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

/**
 * Executes sketch-to-plan conversion.
 * 
 * Note: This is a stub implementation that returns a placeholder result.
 * The actual AI-powered conversion would be implemented through an API call.
 * 
 * @param request - The sketch-to-plan request
 * @param onProgress - Optional progress callback
 * @returns The result of the conversion
 */
export async function executeSketchToPlan(
  request: SketchToPlanRequest,
  onProgress?: SketchToPlanProgressCallback,
): Promise<SketchToPlanResult> {
  const startTime = Date.now();

  // Validate request
  const errors = validateSketchToPlanRequest(request);
  if (errors.length > 0) {
    return createFailureResult("Validation failed", errors.join("; "));
  }

  // Report pending status
  onProgress?.({
    status: "pending",
    message: "Preparing sketch...",
    progressPercent: 0,
  });

  // Report processing status
  onProgress?.({
    status: "processing",
    message: "Analyzing sketch...",
    progressPercent: 25,
  });

  // Stub: In a real implementation, this would call the AI API
  // For now, create a placeholder project
  onProgress?.({
    status: "processing",
    message: "Generating floor plan...",
    progressPercent: 50,
  });

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 100));

  onProgress?.({
    status: "processing",
    message: "Finalizing...",
    progressPercent: 75,
  });

  // Create a placeholder result
  // In production, this would parse the AI response into floor data
  const displayUnit = request.displayUnit ?? "mm";
  const projectName = request.projectName ?? "Sketch Conversion";

  // Create a default room as placeholder
  const placeholderProject = createRectangularRoomProject({
    name: projectName,
    widthMm: request.hints?.knownDimensions?.widthMm ?? 6000,
    depthMm: request.hints?.knownDimensions?.depthMm ?? 4000,
  });

  const processingTimeMs = Date.now() - startTime;

  onProgress?.({
    status: "completed",
    message: "Sketch converted successfully",
    progressPercent: 100,
  });

  return {
    success: true,
    status: "completed",
    project: {
      ...placeholderProject,
      displayUnit,
    },
    floor: placeholderProject.floors[0],
    message: "Sketch converted (placeholder - API not connected)",
    processingTimeMs,
  };
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
  // Stub: In production, this would ping the API endpoint
  // For now, return false to indicate API is not connected
  return false;
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