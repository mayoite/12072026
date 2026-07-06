import type {
  Open3dProject,
  Open3dFloor,
  Open3dWall,
  Open3dDoor,
  Open3dWindow,
  Open3dFurnitureItem,
  Open3dRoom,
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

  // Use default display unit if not specified
  const displayUnit: Open3dDisplayUnit = project.displayUnit ?? "mm";

  return {
    projectId: project.id,
    projectName: project.name,
    displayUnit,
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
  const lengthMm = Math.round(Math.hypot(dx, dy));

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
 * Calculates bounds for a set of walls.
 */
function calculateBounds(walls: WallSummary[]): { minX: number; minY: number; maxX: number; maxY: number } {
  if (walls.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  const xs = walls.flatMap((w) => [w.startX, w.endX]);
  const ys = walls.flatMap((w) => [w.startY, w.endY]);

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

/**
 * Gets the default project constraints.
 */
export function getDefaultConstraints(): ProjectConstraints {
  return {
    maxFloors: 10,
    maxWallLengthMm: 5000,
    maxWallHeightMm: 3000,
    minRoomAreaMm2: 1000000, // 1m x 1m
  };
}
