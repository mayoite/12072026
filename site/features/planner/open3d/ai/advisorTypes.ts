/**
 * Types for AI Advisor (planner mode).
 *
 * Supports two operation modes:
 * - chat: Multi-turn conversational assistance
 * - space-suggest: Generates structured layout suggestions from seat count/purpose
 */

import type { Open3dDisplayUnit } from "../model/types";

/**
 * Chat message structure for advisor conversations.
 */
export interface AdvisorMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Planner context passed to the advisor for contextual suggestions.
 */
export interface AdvisorContext {
  /** Planner identifier */
  planner?: "oando" | "buddy" | "unified";
  /** Room dimensions in millimeters */
  roomWidth?: number;
  roomHeight?: number;
  /** Current furniture count on canvas */
  currentShapeCount?: number;
  /** Target seat count */
  seatCount?: number;
  /** Primary purpose of the space */
  purpose?: string;
  /** Floor area in square feet */
  floorAreaSqFt?: number;
  /** Project name */
  projectName?: string;
}

/**
 * A suggestion returned by the AI advisor for one-click apply.
 */
export interface AdvisorSuggestion {
  /** Suggestion type */
  type: "placement" | "modification" | "suggestion";
  /** Human-readable description */
  description: string;
  /** Label for the apply action button */
  actionLabel: string;
  /** Optional structured layout data (for space-suggest mode) */
  layout?: SpaceSuggestLayout;
}

/**
 * Structured layout from space-suggest mode.
 */
export interface SpaceSuggestLayout {
  version: 1;
  source: "grid-pack" | "llm";
  summary: string;
  room: {
    label: string;
    x: number;
    y: number;
    widthMm: number;
    depthMm: number;
  };
  walls: SpaceSuggestWall[];
  zones: SpaceSuggestZone[];
  furniture: SpaceSuggestFurniture[];
}

/**
 * Canvas wall segment in page coordinates (canvas units).
 */
export interface SpaceSuggestWall {
  type: "planner-wall";
  x: number;
  y: number;
  endX: number;
  endY: number;
  lengthMm: number;
}

/**
 * Zone definition for area segmentation.
 */
export interface SpaceSuggestZone {
  label: string;
  x: number;
  y: number;
  widthMm: number;
  heightMm: number;
  zoneType: "focus" | "collaborative" | "quiet" | "social";
}

/**
 * Furniture placement referencing a catalog SKU.
 */
export interface SpaceSuggestFurniture {
  catalogItemId: string;
  label: string;
  x: number;
  y: number;
  rotation?: number;
}

/**
 * Response from the advisor chat endpoint.
 */
export interface AdvisorChatResponse {
  success: true;
  content: string;
  suggestion?: AdvisorSuggestion;
  degraded?: boolean;
  provider?: string;
}

/**
 * Response from the space-suggest endpoint.
 */
export interface AdvisorSpaceSuggestResponse {
  success: true;
  layout: SpaceSuggestLayout;
  content: string;
  degraded?: boolean;
  provider?: string;
}

/**
 * Error response from advisor endpoints.
 */
export interface AdvisorErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Input for space-suggest mode.
 */
export interface SpaceSuggestInput {
  seatCount: number;
  purpose: string;
  floorAreaSqFt?: number;
}

/**
 * Common advisor error codes.
 */
export const ADVISOR_ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  INVALID_RESPONSE: "INVALID_RESPONSE",
} as const;

/**
 * User-friendly error messages for advisor failures.
 */
export const ADVISOR_ERROR_MESSAGES: Record<string, string> = {
  [ADVISOR_ERROR_CODES.VALIDATION_ERROR]: "The request format was invalid. Please try again.",
  [ADVISOR_ERROR_CODES.RATE_LIMITED]: "Too many requests. Please wait a moment and try again.",
  [ADVISOR_ERROR_CODES.SERVICE_UNAVAILABLE]: "AI advisor is temporarily unavailable. Please try again later.",
  [ADVISOR_ERROR_CODES.INVALID_RESPONSE]: "The AI response could not be processed. Please try again.",
};

/**
 * Maps an error code to a user-friendly message.
 * @param code - Error code
 * @param fallback - Optional fallback message
 * @returns User-friendly error message
 */
export function getAdvisorErrorMessage(code: string, fallback?: string): string {
  return ADVISOR_ERROR_MESSAGES[code] ?? fallback ?? "An unexpected error occurred.";
}