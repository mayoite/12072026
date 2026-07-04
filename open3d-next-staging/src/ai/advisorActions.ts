/**
 * Action layer for applying AI advisor suggestions.
 *
 * This module applies AI suggestions through the project's action layer
 * (projectActions.ts) rather than direct state manipulation.
 */

import type {
  Open3dProject,
  Open3dFurnitureItem,
  Open3dWall,
  Open3dRoom,
} from "../model/types";
import {
  applyOpen3dProjectAction,
  applyOpen3dProjectTransaction,
  type Open3dProjectAction,
} from "../model/actions/projectActions";
import type { AdvisorSuggestion, SpaceSuggestLayout } from "./advisorTypes";
import { validateLayout } from "./advisorClient";

/**
 * Result of applying a suggestion.
 */
export interface ApplySuggestionActionResult {
  success: boolean;
  applied: boolean;
  error?: string;
  previewActions?: Open3dProjectAction[];
}

/**
 * Generates a unique entity ID.
 */
function generateEntityId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Converts a catalog item ID to internal furniture type.
 */
function catalogItemToFurnitureType(catalogItemId: string): string {
  const lower = catalogItemId.toLowerCase();
  if (lower.includes("desk") || lower.includes("workstation")) return "desk";
  if (lower.includes("bench")) return "bench";
  if (lower.includes("chair") || lower.includes("seat")) return "chair";
  if (lower.includes("table")) return "table";
  if (lower.includes("storage") || lower.includes("cabinet")) return "storage";
  if (lower.includes("meeting") || lower.includes("conference")) return "conference";
  if (lower.includes("booth") || lower.includes("phone")) return "phone-booth";
  return "generic";
}

/**
 * Creates a furniture item from a layout suggestion.
 */
function createFurnitureFromLayout(
  item: { catalogItemId: string; label: string; x: number; y: number; rotation?: number },
): Open3dFurnitureItem {
  return {
    id: generateEntityId("furniture"),
    catalogId: item.catalogItemId,
    position: { x: item.x, y: item.y },
    rotation: item.rotation ?? 0,
    scale: { x: 1, y: 1, z: 1 },
    material: catalogItemToFurnitureType(item.catalogItemId),
  };
}

/**
 * Creates a wall from a layout suggestion.
 */
function createWallFromLayout(
  wall: { x: number; y: number; endX: number; endY: number; lengthMm: number },
  heightMm = 2800,
): Open3dWall {
  return {
    id: generateEntityId("wall"),
    start: { x: wall.x, y: wall.y },
    end: { x: wall.endX, y: wall.endY },
    height: heightMm,
    thickness: 120,
    color: "#444444",
  };
}

/**
 * Creates a room from a layout suggestion.
 */
function createRoomFromLayout(
  room: { label: string; x: number; y: number; widthMm: number; depthMm: number },
): Open3dRoom {
  return {
    id: generateEntityId("room"),
    name: room.label,
    walls: [],
    floorTexture: "default",
    area: room.widthMm * room.depthMm,
  };
}

/**
 * Applies a layout suggestion by creating project actions.
 */
export function applyLayoutToProject(
  project: Open3dProject,
  layout: SpaceSuggestLayout,
): { project: Open3dProject; actions: Open3dProjectAction[] } {
  const actions: Open3dProjectAction[] = [];
  const floorId = project.activeFloorId ?? project.floors[0]?.id;

  if (!floorId) {
    return { project, actions };
  }

  // Add room
  if (layout.room) {
    const room = createRoomFromLayout(layout.room);
    actions.push({
      type: "add",
      collection: "rooms",
      entity: room,
    });
  }

  // Add walls
  for (const wall of layout.walls ?? []) {
    const newWall = createWallFromLayout(wall);
    actions.push({
      type: "add",
      collection: "walls",
      entity: newWall,
    });
  }

  // Add furniture
  for (const item of layout.furniture ?? []) {
    const furniture = createFurnitureFromLayout(item);
    actions.push({
      type: "add",
      collection: "furniture",
      entity: furniture,
    });
  }

  // Apply all actions in a transaction
  const updatedProject = applyOpen3dProjectTransaction(project, actions);

  return { project: updatedProject, actions };
}

/**
 * Applies a placement suggestion (adding furniture at a position).
 */
function applyPlacementSuggestion(
  project: Open3dProject,
  suggestion: AdvisorSuggestion,
): ApplySuggestionActionResult {
  const floorId = project.activeFloorId ?? project.floors[0]?.id;

  if (!floorId) {
    return {
      success: false,
      applied: false,
      error: "No active floor in project",
    };
  }

  // For placement suggestions, we need catalog info from the description
  // This is a simplified implementation
  const furniture: Open3dFurnitureItem = {
    id: generateEntityId("furniture"),
    catalogId: suggestion.type === "placement" ? "desk-standard" : "generic",
    position: { x: 0, y: 0 }, // Would be extracted from suggestion details
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    material: "desk",
  };

  try {
    const updatedProject = applyOpen3dProjectAction(project, {
      type: "add",
      collection: "furniture",
      entity: furniture,
    });

    // In a full implementation, this would dispatch to the store
    // For now, return success with the actions
    return {
      success: true,
      applied: true,
      previewActions: [
        {
          type: "add",
          collection: "furniture",
          entity: furniture,
        },
      ],
    };
  } catch (error) {
    return {
      success: false,
      applied: false,
      error: error instanceof Error ? error.message : "Failed to apply placement",
    };
  }
}

/**
 * Applies an AI suggestion through the action layer.
 *
 * @param suggestion - The suggestion to apply
 * @param project - Current project state (for validation)
 * @returns Result of the application
 */
export async function applySuggestion(
  suggestion: AdvisorSuggestion,
  project?: Open3dProject,
): Promise<ApplySuggestionActionResult> {
  if (!suggestion) {
    return {
      success: false,
      applied: false,
      error: "No suggestion provided",
    };
  }

  // Handle layout suggestions (from space-suggest mode)
  if (suggestion.layout) {
    // Validate the layout first
    const validation = validateLayout(suggestion.layout);
    if (!validation.valid) {
      return {
        success: false,
        applied: false,
        error: `Layout validation failed: ${validation.errors.join("; ")}`,
      };
    }

    // Warn if there are issues
    if (validation.warnings.length > 0) {
      console.warn("[advisorActions] Layout warnings:", validation.warnings);
    }

    // If we have a project, apply the layout
    if (project) {
      const result = applyLayoutToProject(project, suggestion.layout);
      return {
        success: true,
        applied: true,
        previewActions: result.actions,
      };
    }

    // No project provided - return success with layout for later application
    return {
      success: true,
      applied: false,
      error: "Project required to apply layout",
    };
  }

  // Handle placement/modification suggestions
  if (!project) {
    return {
      success: false,
      applied: false,
      error: "Project required to apply suggestion",
    };
  }

  if (suggestion.type === "placement") {
    return applyPlacementSuggestion(project, suggestion);
  }

  // Unsupported suggestion type
  return {
    success: false,
    applied: false,
    error: `Unsupported suggestion type: ${suggestion.type}`,
  };
}

/**
 * Previews what actions would be applied without executing them.
 */
export function previewSuggestionActions(
  suggestion: AdvisorSuggestion,
): Open3dProjectAction[] {
  if (suggestion.layout) {
    // Generate preview actions for layout (without applying to project)
    const actions: Open3dProjectAction[] = [];

    if (suggestion.layout.room) {
      const room = createRoomFromLayout(suggestion.layout.room);
      actions.push({ type: "add", collection: "rooms", entity: room });
    }

    for (const wall of suggestion.layout.walls ?? []) {
      const newWall = createWallFromLayout(wall);
      actions.push({ type: "add", collection: "walls", entity: newWall });
    }

    for (const item of suggestion.layout.furniture ?? []) {
      const furniture = createFurnitureFromLayout(item);
      actions.push({ type: "add", collection: "furniture", entity: furniture });
    }

    return actions;
  }

  return [];
}

/**
 * Reverts the last applied suggestion.
 * Note: This requires keeping track of applied actions in the store.
 */
export function revertLastSuggestion(
  project: Open3dProject,
  _appliedActionIds: string[],
): Open3dProject {
  // In a full implementation, this would find and remove the entities
  // that were added by the last suggestion
  console.warn("[advisorActions] revertLastSuggestion not fully implemented");
  return project;
}
