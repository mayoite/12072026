import type {
  Open3dProject,
  Open3dFloor,
  Open3dWall,
  _Open3dDoor,
  _Open3dWindow,
  _Open3dFurnitureItem,
  _Open3dRoom,
  Open3dDisplayUnit,
} from "../model/types";

/**
 * Summary of a project's current state for AI analysis.
 */
export interface ProjectStateSummary {
  projectId: string;
  projectName: string;
  displayUnit: Open3dDisplayUnit;
  floors: FloorSummary[];
  totalWalls: number;
  totalRooms: number;
  totalDoors: number;
  totalWindows: number;
  totalFurniture: number;
  selectedItemId?: string;
  selectedItemType?: "wall" | "door" | "window" | "furniture" | "room" | "stair" | "column";
  constraints: ProjectConstraints;
  availableCatalogIds: string[];
}

/**
 * Summary of a single floor.
 */
export interface FloorSummary {
  floorId: string;
  floorName: string;
  level: number;
  wallCount: number;
  roomCount: number;
  doorCount: number;
  windowCount: number;
  furnitureCount: number;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  walls: WallSummary[];
}

/**
 * Summary of a wall with dimensions.
 */
export interface WallSummary {
  wallId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  lengthMm: number;
  heightMm: number;
  thicknessMm: number;
}

/**
 * Project-level constraints.
 */
export interface ProjectConstraints {
  maxFloors: number;
  maxWallLengthMm: number;
  maxWallHeightMm: number;
  minRoomAreaMm2: number;
}

/**
 * AI-generated suggestion or action proposal.
 */
export interface AiProposal {
  id: string;
  type: "placement" | "suggestion" | "modification" | "summary";
  confidence: number; // 0-1
  description: string;
  details: AiProposalDetails;
  units: Open3dDisplayUnit;
  privacyNotice?: string;
  retentionNotice?: string;
}

/**
 * Details of an AI proposal.
 */
export interface AiProposalDetails {
  // For placement proposals
  catalogId?: string;
  position?: { x: number; y: number };
  rotation?: number;
  scale?: { x: number; y: number; z: number };

  // For modification proposals
  targetId?: string;
  targetType?: string;
  changes?: Record<string, unknown>;

  // For summary proposals
  summary?: string;
  roomCount?: number;
  dimensions?: string;
  furnitureCount?: number;
  recommendations?: string[];
}

/**
 * Result of applying an AI proposal.
 */
export interface ApplyAiProposalResult {
  success: boolean;
  applied: boolean;
  error?: string;
  undoAction?: unknown; // The action that can undo this change
}

/**
 * Default catalog IDs that are always available.
 */
export const DEFAULT_CATALOG_IDS = [
  "chair-standard",
  "table-dining",
  "sofa-standard",
  "bed-single",
  "bed-double",
  "desk-standard",
  "bookshelf-standard",
  "wardrobe-standard",
  "tv-stand",
  "coffee-table",
];

/**
 * Creates a summary of the current project state.
 * @param project - The project to summarize
 * @param selectedItemId - Optional currently selected item
 * @param selectedItemType - Optional type of selected item
 * @returns Project state summary
 */
export function summarizeProjectState(
  project: Open3dProject,
  selectedItemId?: string,
  selectedItemType?: "wall" | "door" | "window" | "furniture" | "room" | "stair" | "column",
): ProjectStateSummary {
  const floors: FloorSummary[] = project.floors.map((floor) => summarizeFloor(floor));

  const totalWalls = floors.reduce((sum, f) => sum + f.wallCount, 0);
  const totalRooms = floors.reduce((sum, f) => sum + f.roomCount, 0);
  const totalDoors = floors.reduce((sum, f) => sum + f.doorCount, 0);
  const totalWindows = floors.reduce((sum, f) => sum + f.windowCount, 0);
  const totalFurniture = floors.reduce((sum, f) => sum + f.furnitureCount, 0);

  return {
    projectId: project.id,
    projectName: project.name,
    displayUnit: project.displayUnit,
    floors,
    totalWalls,
    totalRooms,
    totalDoors,
    totalWindows,
    totalFurniture,
    selectedItemId,
    selectedItemType,
    constraints: getDefaultConstraints(),
    availableCatalogIds: DEFAULT_CATALOG_IDS,
  };
}

/**
 * Summarizes a single floor.
 */
function summarizeFloor(floor: Open3dFloor): FloorSummary {
  const walls = floor.walls.map(summarizeWall);
  const bounds = calculateBounds(walls);

  return {
    floorId: floor.id,
    floorName: floor.name,
    level: floor.level,
    wallCount: floor.walls.length,
    roomCount: floor.rooms.length,
    doorCount: floor.doors.length,
    windowCount: floor.windows.length,
    furnitureCount: floor.furniture.length,
    bounds,
    walls,
  };
}

/**
 * Summarizes a single wall.
 */
function summarizeWall(wall: Open3dWall): WallSummary {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const lengthMm = Math.sqrt(dx * dx + dy * dy);

  return {
    wallId: wall.id,
    startX: wall.start.x,
    startY: wall.start.y,
    endX: wall.end.x,
    endY: wall.end.y,
    lengthMm,
    heightMm: wall.height,
    thicknessMm: wall.thickness,
  };
}

/**
 * Calculates bounding box from walls.
 */
function calculateBounds(walls: WallSummary[]): { minX: number; minY: number; maxX: number; maxY: number } {
  if (walls.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const wall of walls) {
    minX = Math.min(minX, wall.startX, wall.endX);
    minY = Math.min(minY, wall.startY, wall.endY);
    maxX = Math.max(maxX, wall.startX, wall.endX);
    maxY = Math.max(maxY, wall.startY, wall.endY);
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Returns default project constraints.
 */
function getDefaultConstraints(): ProjectConstraints {
  return {
    maxFloors: 20,
    maxWallLengthMm: 50000,
    maxWallHeightMm: 5000,
    minRoomAreaMm2: 1000000, // 1m²
  };
}

/**
 * Validates an AI proposal before application.
 * @param proposal - The proposal to validate
 * @param projectState - Current project state
 * @returns Validation result with errors
 */
export function validateAiProposal(
  proposal: AiProposal,
  _projectState: ProjectStateSummary,
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate confidence
  if (proposal.confidence < 0 || proposal.confidence > 1) {
    errors.push("Confidence must be between 0 and 1");
  }

  // Validate proposal type
  const validTypes = ["placement", "suggestion", "modification", "summary"];
  if (!validTypes.includes(proposal.type)) {
    errors.push(`Invalid proposal type: ${proposal.type}`);
  }

  // Validate units
  const validUnits: Open3dDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];
  if (!validUnits.includes(proposal.units)) {
    errors.push(`Invalid units: ${proposal.units}`);
  }

  // For placement proposals, validate catalog ID
  if (proposal.type === "placement") {
    if (!proposal.details.catalogId) {
      errors.push("Placement proposal must have a catalogId");
    } else if (!DEFAULT_CATALOG_IDS.includes(proposal.details.catalogId)) {
      warnings.push(`Catalog ID ${proposal.details.catalogId} is not in the default list`);
    }

    if (!proposal.details.position) {
      errors.push("Placement proposal must have a position");
    }
  }

  // For modification proposals, validate target
  if (proposal.type === "modification") {
    if (!proposal.details.targetId) {
      errors.push("Modification proposal must have a targetId");
    }
    if (!proposal.details.targetType) {
      errors.push("Modification proposal must have a targetType");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Creates a privacy and retention notice for AI-generated content.
 */
export function createAiPrivacyNotice(): { privacy: string; retention: string } {
  return {
    privacy: "AI-generated suggestions are proposals and should be reviewed before application. Always verify measurements and placements.",
    retention: "AI-generated content is not stored. Each suggestion is independent and based on the current project state.",
  };
}

import { mmToDisplayValue, formatFeetAndInches } from "../model/units";

/**
 * Formats a dimension string with explicit units.
 * @param valueMm - Value in millimeters
 * @param unit - Display unit
 * @returns Formatted string with units
 */
export function formatDimensionWithUnit(valueMm: number, unit: Open3dDisplayUnit): string {
  if (unit === "ft-in") {
    return formatFeetAndInches(valueMm);
  }

  const converted = mmToDisplayValue(valueMm, unit);
  const unitLabels: Record<Open3dDisplayUnit, string> = {
    mm: "mm",
    cm: "cm",
    m: "m",
    in: "in",
    "ft-in": "",
  };

  return `${converted.toFixed(2)} ${unitLabels[unit]}`;
}