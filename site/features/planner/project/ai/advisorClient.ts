/**
 * AI Advisor client for open3d-next-staging.
 *
 * Provides typed interfaces for:
 * - Chat mode: Multi-turn conversational assistance
 * - Space Suggest mode: Generates layout suggestions from seat count/purpose
 */

import type {
  AdvisorMessage,
  AdvisorContext,
  AdvisorSuggestion,
  SpaceSuggestLayout,
  AdvisorChatResponse,
  AdvisorSpaceSuggestResponse,
  AdvisorErrorResponse,
  SpaceSuggestInput,
} from "./advisorTypes";
import { getAdvisorErrorMessage } from "./advisorTypes";
import { applySuggestion as applySuggestionAction } from "./advisorActions";

/**
 * API route paths for planner AI services.
 */
const API_ROUTES = {
  AI_ADVISOR: "/api/planner/ai-advisor",
  SPACE_SUGGEST: "/api/planner/ai-advisor", // Same endpoint, different mode
} as const;

/**
 * Maximum messages in a chat session.
 */
const MAX_MESSAGES = 20;

/**
 * Maximum content length for messages.
 */
const MAX_CONTENT_LENGTH = 2000;

/**
 * Validates an advisor message.
 */
function validateMessage(message: AdvisorMessage): string[] {
  const errors: string[] = [];
  const validRoles = ["system", "user", "assistant"] as const;

  if (!validRoles.includes(message.role)) {
    errors.push(`Invalid role: ${message.role}`);
  }

  if (!message.content || typeof message.content !== "string") {
    errors.push("Content is required");
  } else if (message.content.trim().length === 0) {
    errors.push("Content cannot be empty");
  } else if (message.content.length > MAX_CONTENT_LENGTH) {
    errors.push(`Content exceeds maximum length of ${MAX_CONTENT_LENGTH}`);
  }

  return errors;
}

/**
 * Validates advisor context.
 */
function validateContext(context?: AdvisorContext): string[] {
  const errors: string[] = [];

  if (!context) return errors;

  if (context.planner && !["oando", "buddy", "unified"].includes(context.planner)) {
    errors.push(`Invalid planner: ${context.planner}`);
  }

  if (context.roomWidth !== undefined && (context.roomWidth <= 0 || !Number.isFinite(context.roomWidth))) {
    errors.push("roomWidth must be a positive number");
  }

  if (context.roomHeight !== undefined && (context.roomHeight <= 0 || !Number.isFinite(context.roomHeight))) {
    errors.push("roomHeight must be a positive number");
  }

  if (context.seatCount !== undefined && (context.seatCount <= 0 || !Number.isFinite(context.seatCount))) {
    errors.push("seatCount must be a positive number");
  }

  if (context.floorAreaSqFt !== undefined && (context.floorAreaSqFt <= 0 || !Number.isFinite(context.floorAreaSqFt))) {
    errors.push("floorAreaSqFt must be a positive number");
  }

  return errors;
}

/**
 * Validates space suggest input.
 */
function validateSpaceSuggestInput(input: SpaceSuggestInput): string[] {
  const errors: string[] = [];

  if (!input.seatCount || input.seatCount <= 0 || !Number.isFinite(input.seatCount)) {
    errors.push("seatCount is required and must be a positive number");
  }

  if (!input.purpose || typeof input.purpose !== "string" || input.purpose.trim().length === 0) {
    errors.push("purpose is required");
  }

  if (input.floorAreaSqFt !== undefined && (input.floorAreaSqFt <= 0 || !Number.isFinite(input.floorAreaSqFt))) {
    errors.push("floorAreaSqFt must be a positive number");
  }

  return errors;
}

/**
 * Makes a request to the AI advisor API.
 */
async function requestAdvisorApi<T>(
  mode: "chat" | "space-suggest",
  messages: AdvisorMessage[],
  context?: AdvisorContext,
): Promise<T> {
  // Validate messages
  for (const message of messages) {
    const errors = validateMessage(message);
    if (errors.length > 0) {
      throw new Error(`Invalid message: ${errors.join(", ")}`);
    }
  }

  // Validate context
  const contextErrors = validateContext(context);
  if (contextErrors.length > 0) {
    throw new Error(`Invalid context: ${contextErrors.join(", ")}`);
  }

  // Check message count
  if (messages.length > MAX_MESSAGES) {
    throw new Error(`Maximum ${MAX_MESSAGES} messages allowed`);
  }

  const response = await fetch(API_ROUTES.AI_ADVISOR, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode,
      messages,
      context,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) {
      throw new Error(getAdvisorErrorMessage("RATE_LIMITED"));
    }
    if (status === 503) {
      throw new Error(getAdvisorErrorMessage("SERVICE_UNAVAILABLE"));
    }
    throw new Error(`Request failed with status ${status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Result of a chat request.
 */
export interface ChatRequestResult {
  success: boolean;
  content?: string;
  suggestion?: AdvisorSuggestion;
  degraded?: boolean;
  provider?: string;
  error?: string;
}

/**
 * Sends a chat message to the AI advisor.
 *
 * @param messages - Array of conversation messages (should include user message as last)
 * @param context - Optional planner context for contextual suggestions
 * @returns Chat result with response content and optional suggestion
 */
export async function requestAdvisorChat(
  messages: AdvisorMessage[],
  context?: AdvisorContext,
): Promise<ChatRequestResult> {
  try {
    const response = await requestAdvisorApi<AdvisorChatResponse | AdvisorErrorResponse>(
      "chat",
      messages,
      context,
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error.message,
      };
    }

    return {
      success: true,
      content: response.content,
      suggestion: response.suggestion,
      degraded: response.degraded,
      provider: response.provider,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Result of a space suggest request.
 */
export interface SpaceSuggestResult {
  success: boolean;
  layout?: SpaceSuggestLayout;
  summary?: string;
  degraded?: boolean;
  provider?: string;
  error?: string;
}

/**
 * Requests a layout suggestion based on seat count and purpose.
 *
 * @param seatCount - Number of seats to plan for
 * @param purpose - Primary purpose (e.g., "mixed", "meeting-rooms", "open-plan")
 * @param floorAreaSqFt - Optional floor area in square feet
 * @returns Layout suggestion with furniture placements
 */
export async function requestSpaceSuggest(
  seatCount: number,
  purpose: string,
  floorAreaSqFt?: number,
): Promise<SpaceSuggestResult> {
  // Validate input
  const input: SpaceSuggestInput = { seatCount, purpose, floorAreaSqFt };
  const errors = validateSpaceSuggestInput(input);
  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join(", "),
    };
  }

  try {
    // Build messages for space-suggest mode
    const messages: AdvisorMessage[] = [
      {
        role: "user",
        content: `Plan a layout for ${seatCount} seats.\nPrimary purpose: ${purpose}.\n${
          floorAreaSqFt ? `Floor area: ${floorAreaSqFt} sq ft.` : ""
        }\nOutput the JSON layout object only.`,
      },
    ];

    const context: AdvisorContext = {
      seatCount,
      purpose,
      floorAreaSqFt,
      planner: "oando",
    };

    const response = await requestAdvisorApi<AdvisorSpaceSuggestResponse | AdvisorErrorResponse>(
      "space-suggest",
      messages,
      context,
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error.message,
      };
    }

    return {
      success: true,
      layout: response.layout,
      summary: response.content,
      degraded: response.degraded,
      provider: response.provider,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Result of applying a suggestion.
 */
export interface ApplySuggestionResult {
  success: boolean;
  applied: boolean;
  error?: string;
}

/**
 * Applies an AI suggestion through the action layer.
 *
 * This validates the suggestion before applying and provides
 * user feedback on the outcome.
 *
 * @param suggestion - The suggestion to apply
 * @returns Result of the application
 */
export async function applySuggestion(suggestion: AdvisorSuggestion): Promise<ApplySuggestionResult> {
  if (!suggestion) {
    return {
      success: false,
      applied: false,
      error: "No suggestion provided",
    };
  }

  // Validate suggestion
  if (!suggestion.type || !suggestion.description) {
    return {
      success: false,
      applied: false,
      error: "Invalid suggestion format",
    };
  }

  try {
    // Apply through action layer
    const result = await applySuggestionAction(suggestion);

    return {
      success: result.success,
      applied: result.applied,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      applied: false,
      error: error instanceof Error ? error.message : "Failed to apply suggestion",
    };
  }
}

/**
 * Validates a layout before applying.
 * @param layout - The layout to validate
 * @returns Validation result with errors and warnings
 */
export function validateLayout(layout: SpaceSuggestLayout): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate version
  if (layout.version !== 1) {
    errors.push(`Unsupported layout version: ${layout.version}`);
  }

  // Validate source
  if (!["grid-pack", "llm"].includes(layout.source)) {
    errors.push(`Invalid layout source: ${layout.source}`);
  }

  // Validate room
  if (!layout.room) {
    errors.push("Layout must have a room");
  } else {
    if (!layout.room.widthMm || layout.room.widthMm <= 0) {
      errors.push("Room must have valid width");
    }
    if (!layout.room.depthMm || layout.room.depthMm <= 0) {
      errors.push("Room must have valid depth");
    }
  }

  // Validate furniture count matches seat count
  if (layout.furniture) {
    const seatCount = layout.furniture.filter(
      (f) => f.catalogItemId.includes("desk") || f.catalogItemId.includes("bench") || f.catalogItemId.includes("chair"),
    ).length;

    if (seatCount === 0) {
      warnings.push("No seating furniture in layout");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Configuration for the AI advisor provider chain.
 */
export interface AdvisorProviderConfig {
  /** Provider priority order */
  providerOrder: string[];
  /** Request timeout in milliseconds */
  timeoutMs: number;
  /** Retry count for failed requests */
  retryCount: number;
}

/**
 * Default advisor configuration.
 */
export const DEFAULT_ADVISOR_CONFIG: AdvisorProviderConfig = {
  providerOrder: ["openai", "anthropic", "google"],
  timeoutMs: 30000,
  retryCount: 1,
};

/**
 * Provider chain configuration (placeholder for future implementation).
 * In production, this would resolve from environment/config.
 */
export function resolveAdvisorProviderChain(): string[] {
  // Placeholder: would check environment or config for provider settings
  return DEFAULT_ADVISOR_CONFIG.providerOrder;
}
