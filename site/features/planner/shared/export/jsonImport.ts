import type {
  PlannerSceneEnvelope,
  PlannerProject,
  PlannerFloor,
  PlannerDisplayUnit,
} from "../../model/types";
import { newEntityId } from "@/features/planner/lib/newEntityId";

/**
 * Validation errors found during import.
 */
export interface ImportValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

/**
 * Import result containing the project and any validation errors.
 */
export interface ImportResult {
  success: boolean;
  project: PlannerProject | null;
  errors: ImportValidationError[];
}

/**
 * Import limits to prevent resource exhaustion.
 */
export interface ImportLimits {
  /** Maximum number of floors */
  maxFloors: number;
  /** Maximum number of walls per floor */
  maxWallsPerFloor: number;
  /** Maximum number of furniture items per floor */
  maxFurniturePerFloor: number;
  /** Maximum JSON string size in bytes */
  maxJsonSize: number;
  /** Maximum wall length in mm */
  maxWallLengthMm: number;
  /** Maximum dimension (width/height) in mm */
  maxDimensionMm: number;
}

/**
 * Default import limits.
 */
export const DEFAULT_IMPORT_LIMITS: ImportLimits = {
  maxFloors: 20,
  maxWallsPerFloor: 500,
  maxFurniturePerFloor: 1000,
  maxJsonSize: 10 * 1024 * 1024, // 10MB
  maxWallLengthMm: 50000, // 50m
  maxDimensionMm: 100000, // 100m
};

/**
 * Parses a JSON string into an envelope.
 * @param jsonString - The JSON string to parse
 * @returns The parsed envelope or null if invalid
 */
export function parseJsonToEnvelope(jsonString: string): {
  envelope: PlannerSceneEnvelope | null;
  parseError: string | null;
} {
  if (!jsonString || typeof jsonString !== "string") {
    return { envelope: null, parseError: "Input must be a non-empty string" };
  }

  // Check size limit
  const sizeBytes = new Blob([jsonString]).size;
  if (sizeBytes > DEFAULT_IMPORT_LIMITS.maxJsonSize) {
    return {
      envelope: null,
      parseError: `JSON exceeds maximum size of ${DEFAULT_IMPORT_LIMITS.maxJsonSize / 1024 / 1024}MB`,
    };
  }

  try {
    const parsed = JSON.parse(jsonString);
    return { envelope: parsed as PlannerSceneEnvelope, parseError: null };
  } catch (error) {
    return {
      envelope: null,
      parseError: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

/**
 * Validates an envelope structure.
 * @param envelope - The envelope to validate
 * @param limits - Optional custom limits
 * @returns Validation errors found
 */
export function validateEnvelopeStructure(
  envelope: PlannerSceneEnvelope,
  limits: ImportLimits = DEFAULT_IMPORT_LIMITS,
): ImportValidationError[] {
  const errors: ImportValidationError[] = [];

  // Check type and version (only open3d v1 is supported — future versions fail visibly)
  const SUPPORTED_OPEN3D_SCENE_VERSION = 1;

  if (!envelope.type) {
    errors.push({ path: "type", message: "Missing type field", severity: "error" });
  } else if (envelope.type !== "open3d-floorplan-project") {
    errors.push({
      path: "type",
      message: `Unknown type: ${envelope.type}`,
      severity: "error",
    });
  }

  if (typeof envelope.version !== "number") {
    errors.push({
      path: "version",
      message: "Invalid or missing version",
      severity: "error",
    });
  } else if (envelope.version !== SUPPORTED_OPEN3D_SCENE_VERSION) {
    errors.push({
      path: "version",
      message: `Unsupported scene envelope version ${envelope.version}; expected ${SUPPORTED_OPEN3D_SCENE_VERSION}`,
      severity: "error",
    });
  }

  // Validate units
  if (envelope.units !== "mm") {
    errors.push({
      path: "units",
      message: `Unsupported units: ${envelope.units}. Only "mm" is supported.`,
      severity: "error",
    });
  }

  // Validate display unit
  const validDisplayUnits: PlannerDisplayUnit[] = ["mm", "cm", "m", "in", "ft-in"];
  if (!envelope.displayUnit || !validDisplayUnits.includes(envelope.displayUnit)) {
    errors.push({
      path: "displayUnit",
      message: `Invalid displayUnit: ${envelope.displayUnit}`,
      severity: "warning",
    });
  }

  // Validate project
  if (!envelope.project) {
    errors.push({ path: "project", message: "Missing project", severity: "error" });
    return errors;
  }

  const project = envelope.project;

  // Check floors count
  if (!project.floors || !Array.isArray(project.floors)) {
    errors.push({ path: "floors", message: "Missing or invalid floors array", severity: "error" });
  } else if (project.floors.length > limits.maxFloors) {
    errors.push({
      path: "floors",
      message: `Too many floors: ${project.floors.length} (max ${limits.maxFloors})`,
      severity: "error",
    });
  }

  // Validate floors
  if (project.floors) {
    project.floors.forEach((floor, index) => {
      const floorErrors = validateFloor(floor, limits, index);
      errors.push(...floorErrors);
    });
  }

  // Validate active floor
  if (project.floors && project.floors.length > 0) {
    const activeFloor = project.floors.find((f) => f.id === project.activeFloorId);
    if (!activeFloor) {
      errors.push({
        path: "activeFloorId",
        message: `Active floor not found: ${project.activeFloorId}`,
        severity: "error",
      });
    }
  }

  return errors;
}

/**
 * Validates a single floor.
 */
function validateFloor(
  floor: PlannerFloor,
  limits: ImportLimits,
  index: number,
): ImportValidationError[] {
  const errors: ImportValidationError[] = [];
  const prefix = `floors[${index}]`;

  if (!floor.id) {
    errors.push({ path: `${prefix}.id`, message: "Missing floor id", severity: "error" });
  }

  // Check walls count
  if (floor.walls && floor.walls.length > limits.maxWallsPerFloor) {
    errors.push({
      path: `${prefix}.walls`,
      message: `Too many walls: ${floor.walls.length} (max ${limits.maxWallsPerFloor})`,
      severity: "error",
    });
  }

  // Validate walls
  if (floor.walls) {
    floor.walls.forEach((wall, wIndex) => {
      const wallErrors = validateWall(wall, limits, `${prefix}.walls[${wIndex}]`);
      errors.push(...wallErrors);
    });
  }

  // Check furniture count
  if (floor.furniture && floor.furniture.length > limits.maxFurniturePerFloor) {
    errors.push({
      path: `${prefix}.furniture`,
      message: `Too many furniture items: ${floor.furniture.length} (max ${limits.maxFurniturePerFloor})`,
      severity: "error",
    });
  }

  return errors;
}

/**
 * Validates a wall.
 */
function validateWall(
  wall: { start: { x: number; y: number }; end: { x: number; y: number } },
  limits: ImportLimits,
  path: string,
): ImportValidationError[] {
  const errors: ImportValidationError[] = [];

  // Validate start/end points
  if (!wall.start || typeof wall.start.x !== "number" || typeof wall.start.y !== "number") {
    errors.push({ path: `${path}.start`, message: "Invalid start point", severity: "error" });
  }

  if (!wall.end || typeof wall.end.x !== "number" || typeof wall.end.y !== "number") {
    errors.push({ path: `${path}.end`, message: "Invalid end point", severity: "error" });
  }

  // Check wall length
  if (wall.start && wall.end) {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length > limits.maxWallLengthMm) {
      errors.push({
        path: path,
        message: `Wall too long: ${length}mm (max ${limits.maxWallLengthMm}mm)`,
        severity: "error",
      });
    }

    // Check bounds
    const bounds = [wall.start.x, wall.start.y, wall.end.x, wall.end.y];
    if (bounds.some((v) => Math.abs(v) > limits.maxDimensionMm)) {
      errors.push({
        path: path,
        message: `Coordinate exceeds max dimension: ${limits.maxDimensionMm}mm`,
        severity: "error",
      });
    }
  }

  return errors;
}

/**
 * Imports a JSON string into an Open3D project.
 * @param jsonString - The JSON string to import
 * @param limits - Optional custom limits
 * @returns The import result with project and errors
 */
export function importFromJson(
  jsonString: string,
  limits: ImportLimits = DEFAULT_IMPORT_LIMITS,
): ImportResult {
  // Step 1: Parse JSON
  const { envelope, parseError } = parseJsonToEnvelope(jsonString);
  if (!envelope) {
    return {
      success: false,
      project: null,
      errors: [{ path: "json", message: parseError || "Parse error", severity: "error" }],
    };
  }

  // Step 2: Validate structure
  const errors = validateEnvelopeStructure(envelope, limits);
  const hasErrors = errors.some((e) => e.severity === "error");

  if (hasErrors) {
    return {
      success: false,
      project: null,
      errors,
    };
  }

  // Return the project from the envelope
  return {
    success: true,
    project: envelope.project,
    errors,
  };
}

/**
 * Recovers from partial validation errors by fixing or removing invalid data.
 * @param envelope - The envelope to recover
 * @returns The recovered envelope
 */
export function recoverFromErrors(envelope: PlannerSceneEnvelope): {
  envelope: PlannerSceneEnvelope;
  recovered: string[];
} {
  const recovered: string[] = [];

  if (!envelope.project) {
    return { envelope, recovered };
  }

  // Fix display unit if missing
  if (!envelope.displayUnit) {
    envelope.displayUnit = "mm";
    recovered.push("Set default displayUnit to mm");
  }

  // Ensure each floor has required fields
  envelope.project.floors = envelope.project.floors.map((floor, index) => {
    if (!floor.id) {
      floor.id = newEntityId();
      recovered.push(`Assigned ID to floor ${index}`);
    }
    return floor;
  });

  return { envelope, recovered };
}