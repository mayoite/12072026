import type { PlannerSceneEnvelope, PlannerProject } from "../../model/types";
import { createPlannerSceneEnvelope } from "../../model/project";

/**
 * Export result containing the envelope and any metadata.
 */
export interface ExportResult {
  success: boolean;
  envelope: PlannerSceneEnvelope;
  error?: string;
}

/**
 * Options for JSON export.
 */
export interface JsonExportOptions {
  /** If true, pretty-prints the JSON with indentation */
  pretty?: boolean;
  /** If provided, include only this floor ID */
  floorId?: string;
}

/**
 * Exports an Open3D project to a planner scene envelope.
 * @param project - The project to export
 * @param options - Export options
 * @returns The export result with envelope
 */
export function exportToJson(
  project: PlannerProject,
  options: JsonExportOptions = {},
): ExportResult {
  try {
    if (!project || !project.floors || project.floors.length === 0) {
      return {
        success: false,
        envelope: createEnvelopePlaceholder(),
        error: "Project has no floors",
      };
    }

    // Validate project has required fields
    if (!project.id || !project.name) {
      return {
        success: false,
        envelope: createEnvelopePlaceholder(),
        error: "Project must have id and name",
      };
    }

    // Filter to single floor if requested
    let floors = project.floors;
    if (options.floorId) {
      const floor = floors.find((f) => f.id === options.floorId);
      if (!floor) {
        return {
          success: false,
          envelope: createEnvelopePlaceholder(),
          error: `Floor not found: ${options.floorId}`,
        };
      }
      floors = [floor];
    }

    const filteredProject: PlannerProject = {
      ...project,
      floors,
    };

    const envelope = createPlannerSceneEnvelope(filteredProject);

    return {
      success: true,
      envelope,
    };
  } catch (error) {
    return {
      success: false,
      envelope: createEnvelopePlaceholder(),
      error: error instanceof Error ? error.message : "Unknown export error",
    };
  }
}

/**
 * Converts an envelope to a JSON string.
 * @param envelope - The envelope to stringify
 * @param pretty - Whether to pretty-print
 * @returns JSON string
 */
export function envelopeToJsonString(
  envelope: PlannerSceneEnvelope,
  pretty = false,
): string {
  return JSON.stringify(envelope, null, pretty ? 2 : 0);
}

/**
 * Creates an empty placeholder envelope for error cases.
 */
function createEnvelopePlaceholder(): PlannerSceneEnvelope {
  return {
    type: "open3d-floorplan-project",
    version: 1,
    units: "mm",
    displayUnit: "mm",
    source: "native-open3d",
    project: {
      id: "",
      name: "Error",
      floors: [],
      activeFloorId: "",
      displayUnit: "mm",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}