/**
 * Phase 06 Import Utilities
 *
 * Multi-format import for Open3D floor plans:
 * - JSON: Standard project format
 * - RoomPlan: Apple RoomPlan JSON format
 *
 * Includes validation, error recovery, and schema checking.
 */

import type {
  Open3dFloor,
  Open3dWall,
  Open3dDoor,
  Open3dWindow,
  Open3dFurnitureItem,
  Open3dRoom,
  Open3dPoint,
  Open3dDisplayUnit,
} from "../../model/types";
import { themeColorRef } from "../readThemeColor";
import { PLANNER_COLOR_TOKENS } from "../themeColorTokens";
import {
  importFromJson,
  parseJsonToEnvelope,
  validateEnvelopeStructure,
  recoverFromErrors,
  DEFAULT_IMPORT_LIMITS,
  type ImportLimits,
  type ImportResult,
} from "./jsonImport";

// ── Types ──

/** RoomPlan import options */
export interface RoomPlanImportOptions {
  straighten?: boolean;
  orthogonal?: boolean;
  angleTolerance?: number;
  mergeDistance?: number;
}

/** Import format detection result */
export interface FormatDetectionResult {
  format: "json" | "roomplan" | "unknown";
  confidence: number;
}

// ── JSON Import ──

/**
 * Parse and validate JSON string to a project.
 * @param jsonString - The JSON string to import
 * @param limits - Optional custom limits
 * @returns Import result with project and errors
 */
export function importFromJSON(
  jsonString: string,
  limits: ImportLimits = DEFAULT_IMPORT_LIMITS,
): ImportResult {
  // Use existing jsonImport module
  return importFromJson(jsonString, limits);
}

/**
 * Import from JSON with error recovery.
 * Attempts to fix common issues and re-validate.
 */
export function importFromJSONWithRecovery(
  jsonString: string,
  limits: ImportLimits = DEFAULT_IMPORT_LIMITS,
): ImportResult & { recovered: string[] } {
  const result = importFromJSON(jsonString, limits);

  // If successful or has warnings but no errors, try recovery
  const hasErrors = result.errors.some((e) => e.severity === "error");
  if (hasErrors && result.project) {
    // Try to recover from errors
    const envelopeResult = parseJsonToEnvelope(jsonString);
    if (envelopeResult.envelope) {
      const { recovered } = recoverFromErrors(envelopeResult.envelope);
      return { ...result, recovered };
    }
  }

  return { ...result, recovered: [] };
}

// ── RoomPlan Import ──

// RoomPlan uses meters in XZ plane, we use mm in XY plane
const ROOMPLAN_TO_MM = 1000;

/**
 * Generate a unique ID for imported elements.
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Convert RoomPlan point (meters in XZ) to our point (mm in XY).
 */
function toOurPoint(rpX: number, rpZ: number): Open3dPoint {
  return { x: rpX * ROOMPLAN_TO_MM, y: rpZ * ROOMPLAN_TO_MM };
}

/**
 * Get position from RoomPlan transform matrix.
 */
function getPositionFromTransform(t: number[]): { x: number; y: number; z: number } {
  return { x: t[12] ?? 0, y: t[13] ?? 0, z: t[14] ?? 0 };
}

/**
 * Get Y rotation from transform matrix.
 */
function getYRotation(t: number[]): number {
  return Math.atan2(t[8] ?? 0, t[0] ?? 1);
}

/**
 * Project a point onto a wall segment.
 */
function projectOntoWall(wall: Open3dWall, pt: Open3dPoint): number {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return 0.5;
  const t = ((pt.x - wall.start.x) * dx + (pt.y - wall.start.y) * dy) / lenSq;
  return Math.max(0.01, Math.min(0.99, t));
}

/**
 * Map RoomPlan door category to our door type.
 */
function mapDoorType(category: unknown): Open3dDoor["type"] {
  if (typeof category === "string") {
    if (category === "doubleDoor" || category === "french") return "double";
    if (category === "slidingDoor") return "sliding";
    if (category === "foldingDoor") return "bifold";
    if (category === "pocketDoor") return "pocket";
  }
  return "single";
}

/**
 * Map RoomPlan window category to our window type.
 */
function mapWindowType(category: unknown): Open3dWindow["type"] {
  if (typeof category === "string") {
    if (category === "slidingWindow") return "sliding";
    if (category === "bayWindow") return "bay";
    if (category === "casementWindow") return "casement";
    if (category === "fixedWindow") return "fixed";
  }
  return "standard";
}

/**
 * Map RoomPlan section label to room name.
 */
function mapSectionLabel(label: string): string {
  const labelMap: Record<string, string> = {
    livingRoom: "Living Room",
    bedroom: "Bedroom",
    kitchen: "Kitchen",
    bathroom: "Bathroom",
    diningRoom: "Dining Room",
    laundryRoom: "Laundry",
    office: "Office",
    hallway: "Hallway",
    garage: "Garage",
    closet: "Closet",
    pantry: "Pantry",
    entryway: "Entryway",
  };
  return labelMap[label] ?? label;
}

/**
 * Simplify RoomPlan walls by snapping to orthogonal and merging endpoints.
 */
function straightenWalls(
  walls: Open3dWall[],
  angleTolerance = 5,
  mergeDistance = 15,
): void {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const normalizeAngle = (a: number) => {
    a = a % (Math.PI * 2);
    if (a > Math.PI) a -= Math.PI * 2;
    if (a <= -Math.PI) a += Math.PI * 2;
    return a;
  };
  const angleDiff = (a: number, b: number) => Math.abs(normalizeAngle(a - b));
  const tolRad = toRad(angleTolerance);

  // Pass 1: Snap near-axis walls
  for (const wall of walls) {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const angle = Math.atan2(dy, dx);
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) continue;

    const snapped = [0, Math.PI / 2, Math.PI, -Math.PI / 2, -Math.PI].find(
      (a) => angleDiff(angle, a) < tolRad,
    );

    if (snapped !== undefined) {
      const mx = (wall.start.x + wall.end.x) / 2;
      const my = (wall.start.y + wall.end.y) / 2;
      const halfLen = len / 2;
      wall.start.x = Math.round(mx - Math.cos(snapped) * halfLen);
      wall.start.y = Math.round(my - Math.sin(snapped) * halfLen);
      wall.end.x = Math.round(mx + Math.cos(snapped) * halfLen);
      wall.end.y = Math.round(my + Math.sin(snapped) * halfLen);
    }
  }

  // Pass 2: Merge nearby endpoints
  mergeWallEndpoints(walls, mergeDistance);
}

/**
 * Merge nearby wall endpoints.
 */
function mergeWallEndpoints(walls: Open3dWall[], mergeDistance: number): void {
  interface Endpoint {
    wall: Open3dWall;
    which: "start" | "end";
  }

  const endpoints: Endpoint[] = [];
  for (const wall of walls) {
    endpoints.push({ wall, which: "start" });
    endpoints.push({ wall, which: "end" });
  }

  const getPoint = (ep: Endpoint): Open3dPoint =>
    ep.which === "start" ? ep.wall.start : ep.wall.end;

  // Union-Find for clustering
  const parent: number[] = endpoints.map((_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  const union = (a: number, b: number) => {
    parent[find(a)] = find(b);
  };

  // Cluster nearby endpoints
  for (let i = 0; i < endpoints.length; i++) {
    const pi = getPoint(endpoints[i]);
    for (let j = i + 1; j < endpoints.length; j++) {
      const pj = getPoint(endpoints[j]);
      if (Math.sqrt((pi.x - pj.x) ** 2 + (pi.y - pj.y) ** 2) < mergeDistance) {
        union(i, j);
      }
    }
  }

  // Merge clusters
  const clusters = new Map<number, number[]>();
  for (let i = 0; i < endpoints.length; i++) {
    const root = find(i);
    if (!clusters.has(root)) clusters.set(root, []);
    const group = clusters.get(root);
    if (group) group.push(i);
  }

  for (const [, members] of clusters) {
    if (members.length < 2) continue;

    let ax = 0,
      ay = 0;
    for (const idx of members) {
      const p = getPoint(endpoints[idx]);
      ax += p.x;
      ay += p.y;
    }
    ax = Math.round(ax / members.length);
    ay = Math.round(ay / members.length);

    for (const idx of members) {
      const ep = endpoints[idx];
      if (ep.which === "start") {
        ep.wall.start.x = ax;
        ep.wall.start.y = ay;
      } else {
        ep.wall.end.x = ax;
        ep.wall.end.y = ay;
      }
    }
  }
}

/**
 * Import a floor from Apple RoomPlan JSON format.
 * @param jsonData - RoomPlan JSON data
 * @param options - Import options
 * @returns The imported floor
 */
export function importRoomPlan(
  jsonData: Record<string, unknown>,
  options: RoomPlanImportOptions = {},
): Open3dFloor {
  const rpWalls = (jsonData.walls ?? []) as Array<Record<string, unknown>>;
  const rpDoors = (jsonData.doors ?? []) as Array<Record<string, unknown>>;
  const rpWindows = (jsonData.windows ?? []) as Array<Record<string, unknown>>;
  const rpObjects = (jsonData.objects ?? []) as Array<Record<string, unknown>>;
  const rpSections = (jsonData.sections ?? []) as Array<Record<string, unknown>>;

  const floorId = generateId();
  const walls: Open3dWall[] = [];
  const doors: Open3dDoor[] = [];
  const windows: Open3dWindow[] = [];
  const furniture: Open3dFurnitureItem[] = [];
  const rooms: Open3dRoom[] = [];

  // Map RoomPlan wall IDs to our wall IDs
  const wallIdMap = new Map<string, string>();

  // Process walls
  for (const rw of rpWalls) {
    const dims = (rw.dimensions ?? []) as number[];
    const transform = (rw.transform ?? []) as number[];

    if (!dims || dims.length < 2 || !transform || transform.length < 16) continue;
    if (!Number.isFinite(dims[0]) || !Number.isFinite(dims[1])) continue;

    const pos = getPositionFromTransform(transform);
    const halfWidth = (dims[0] / 2) * ROOMPLAN_TO_MM;
    const height = dims[1] * ROOMPLAN_TO_MM;

    // Wall direction from transform
    const wallDirX = transform[0] ?? 1;
    const wallDirZ = transform[2] ?? 0;

    const center = toOurPoint(pos.x, pos.z);
    const start: Open3dPoint = {
      x: center.x - wallDirX * halfWidth,
      y: center.y - wallDirZ * halfWidth,
    };
    const end: Open3dPoint = {
      x: center.x + wallDirX * halfWidth,
      y: center.y + wallDirZ * halfWidth,
    };

    const wallId = generateId();
    wallIdMap.set(String(rw.identifier ?? ""), wallId);

    walls.push({
      id: wallId,
      start,
      end,
      thickness: 150, // 15cm default
      height: Math.round(height),
      color: themeColorRef(PLANNER_COLOR_TOKENS.importWall),
    });
  }

  // Process doors
  for (const rd of rpDoors) {
    const dims = (rd.dimensions ?? []) as number[];
    const transform = (rd.transform ?? []) as number[];

    if (!dims || dims.length < 2 || !transform || transform.length < 16) continue;

    const parentId = String(rd.parentIdentifier ?? "");
    const parentWallId = wallIdMap.get(parentId);
    if (!parentWallId) continue;

    const wall = walls.find((w) => w.id === parentWallId);
    if (!wall) continue;

    const pos = getPositionFromTransform(transform);
    const doorPoint = toOurPoint(pos.x, pos.z);
    const position = projectOntoWall(wall, doorPoint);

    doors.push({
      id: generateId(),
      wallId: parentWallId,
      position,
      width: Math.round(dims[0] * ROOMPLAN_TO_MM),
      height: Math.round(dims[1] * ROOMPLAN_TO_MM),
      type: mapDoorType(rd.category),
      swingDirection: "left",
      flipSide: false,
    });
  }

  // Process windows
  for (const rw of rpWindows) {
    const dims = (rw.dimensions ?? []) as number[];
    const transform = (rw.transform ?? []) as number[];

    if (!dims || dims.length < 2 || !transform || transform.length < 16) continue;

    const parentId = String(rw.parentIdentifier ?? "");
    const parentWallId = wallIdMap.get(parentId);
    if (!parentWallId) continue;

    const wall = walls.find((w) => w.id === parentWallId);
    if (!wall) continue;

    const pos = getPositionFromTransform(transform);
    const winPoint = toOurPoint(pos.x, pos.z);
    const position = projectOntoWall(wall, winPoint);

    windows.push({
      id: generateId(),
      wallId: parentWallId,
      position,
      width: Math.round(dims[0] * ROOMPLAN_TO_MM),
      height: Math.round(dims[1] * ROOMPLAN_TO_MM),
      sillHeight: 900, // 90cm default
      type: mapWindowType(rw.category),
    });
  }

  // Process furniture objects
  for (const ro of rpObjects) {
    const dims = (ro.dimensions ?? []) as number[];
    const transform = (ro.transform ?? []) as number[];

    if (!dims || dims.length < 3 || !transform || transform.length < 16) continue;

    const pos = getPositionFromTransform(transform);
    const angle = getYRotation(transform);

    // Simple catalog ID mapping based on category
    const category = String(ro.category ?? "");
    let catalogId = "chair";
    if (category.includes("sofa") || category.includes("couch")) catalogId = "sofa";
    else if (category.includes("table")) catalogId = "dining_table";
    else if (category.includes("bed")) catalogId = "bed";
    else if (category.includes("storage") || category.includes("cabinet")) catalogId = "storage";

    furniture.push({
      id: generateId(),
      catalogId,
      position: toOurPoint(pos.x, pos.z),
      rotation: (angle * 180) / Math.PI,
      scale: { x: 1, y: 1, z: 1 },
      width: Math.round(dims[0] * ROOMPLAN_TO_MM),
      depth: Math.round(dims[2] * ROOMPLAN_TO_MM),
      height: Math.round(dims[1] * ROOMPLAN_TO_MM),
    });
  }

  // Post-process walls
  const mergeDist = options.mergeDistance ?? 15;
  if (options.straighten !== false) {
    straightenWalls(walls, options.angleTolerance ?? 5, mergeDist);
  }

  // Process sections (rooms)
  for (const rs of rpSections) {
    const label = String(rs.label ?? "");
    rooms.push({
      id: generateId(),
      name: mapSectionLabel(label),
      walls: [],
      floorTexture: "hardwood",
      area: 0,
    });
  }

  return {
    id: floorId,
    name: "Ground Floor",
    level: 0,
    walls,
    rooms,
    doors,
    windows,
    furniture,
    stairs: [],
    columns: [],
    guides: [],
    measurements: [],
    annotations: [],
    textAnnotations: [],
    groups: [],
  };
}

/**
 * Import RoomPlan JSON string.
 */
export function importRoomPlanFromJson(
  jsonString: string,
  options: RoomPlanImportOptions = {},
): { floor: Open3dFloor | null; error: string | null } {
  try {
    const jsonData = JSON.parse(jsonString);
    const floor = importRoomPlan(jsonData, options);
    return { floor, error: null };
  } catch (e) {
    return { floor: null, error: e instanceof Error ? e.message : "Failed to parse RoomPlan JSON" };
  }
}

// ── Format Detection ─-

/**
 * Detect the format of an input JSON string.
 */
export function detectFormat(jsonString: string): FormatDetectionResult {
  try {
    const data = JSON.parse(jsonString);

    // Check for RoomPlan format
    if (data.walls && data.doors && data.sections && !data.project && !data.floors) {
      // Likely RoomPlan
      return { format: "roomplan", confidence: 0.9 };
    }

    // Check for our JSON envelope format
    if (data.type === "open3d-floorplan-project" && data.project) {
      return { format: "json", confidence: 0.95 };
    }

    // Check for older format
    if (data.floors && data.id && data.name) {
      return { format: "json", confidence: 0.7 };
    }

    return { format: "unknown", confidence: 0 };
  } catch {
    return { format: "unknown", confidence: 0 };
  }
}

/**
 * Auto-detect and import based on format.
 */
export function autoImport(
  jsonString: string,
  options?: {
    importLimits?: ImportLimits;
    roomPlanOptions?: RoomPlanImportOptions;
  },
): ImportResult | { floor: Open3dFloor; error?: string } {
  const format = detectFormat(jsonString);

  switch (format.format) {
    case "json":
      return importFromJSON(jsonString, options?.importLimits);

    case "roomplan": {
      const result = importRoomPlanFromJson(
        jsonString,
        options?.roomPlanOptions,
      );
      if (result.floor) {
        return {
          success: true,
          project: {
            id: generateId(),
            name: "Imported Project",
            floors: [result.floor],
            activeFloorId: result.floor.id,
            displayUnit: "mm" as Open3dDisplayUnit,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          errors: [],
        };
      }
      return {
        success: false,
        project: null,
        errors: [{ path: "parse", message: result.error ?? "Parse error", severity: "error" }],
      };
    }

    default:
      return {
        success: false,
        project: null,
        errors: [
          { path: "format", message: "Unknown JSON format", severity: "error" },
        ],
      };
  }
}

// Re-export from jsonImport for convenience
export { parseJsonToEnvelope, validateEnvelopeStructure, recoverFromErrors, DEFAULT_IMPORT_LIMITS };
export type { ImportValidationError, ImportLimits, ImportResult } from "./jsonImport";
