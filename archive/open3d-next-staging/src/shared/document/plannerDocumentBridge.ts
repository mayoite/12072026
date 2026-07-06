import type {
  PlannerDocument,
  PlannerJsonValue,
} from "../../../../site/features/planner/model/plannerDocument";
import type { Open3dProject, Open3dFloor, Open3dPlannerSceneEnvelope } from "../../model/types";
import { createOpen3dProject, createRectangularRoomProject } from "../../model/project";
import { createEnvelopeV1, validateEnvelope } from "../../model/operations/migration";

export interface PlannerDocumentToOpen3dResult {
  project: Open3dProject;
  envelope: Open3dPlannerSceneEnvelope;
  warnings: string[];
}

export interface Open3dToPlannerDocumentResult {
  document: PlannerDocument;
  warnings: string[];
}

function isPlannerJsonObject(value: PlannerJsonValue | undefined | null): value is Record<string, PlannerJsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toPlannerJsonValue(value: Open3dPlannerSceneEnvelope): PlannerJsonValue {
  return JSON.parse(JSON.stringify(value)) as PlannerJsonValue;
}

/**
 * Convert an OOFPLWeb PlannerDocument to an Open3dProject + envelope.
 * Preserves metadata in the envelope source field and description.
 */
export function plannerDocumentToOpen3dProject(
  document: PlannerDocument,
): PlannerDocumentToOpen3dResult {
  const warnings: string[] = [];

  // Build base project from room dimensions if no scene data
  let project: Open3dProject;
  const sceneJson = document.sceneJson;

  if (isPlannerJsonObject(sceneJson) && sceneJson.type === "open3d-floorplan-project") {
    // Already an Open3D envelope stored in sceneJson
    const envelope = sceneJson as unknown as Open3dPlannerSceneEnvelope;
    const validation = validateEnvelope(envelope);
    if (validation.valid) {
      project = envelope.project;
    } else {
      warnings.push(...validation.errors.map((e) => `Envelope invalid: ${e}`));
      project = createRectangularRoomProject({
        widthMm: document.roomWidthMm,
        depthMm: document.roomDepthMm,
        name: document.name,
      });
    }
  } else if (isPlannerJsonObject(sceneJson) && sceneJson.type === "cad-suite-planner-scene") {
    // Legacy scene — cannot directly convert without legacy adapter
    warnings.push("Legacy cad-suite-planner-scene detected; using rectangular room fallback.");
    project = createRectangularRoomProject({
      widthMm: document.roomWidthMm,
      depthMm: document.roomDepthMm,
      name: document.name,
    });
  } else {
    // No recognizable scene — create a rectangular room from planner dimensions
    project = createRectangularRoomProject({
      widthMm: document.roomWidthMm,
      depthMm: document.roomDepthMm,
      name: document.name,
    });
  }

  // Overwrite metadata from PlannerDocument
  project = {
    ...project,
    id: document.id ?? project.id,
    name: project.name || document.name,
    description: [
      document.title && document.title !== document.name ? `Title: ${document.title}` : "",
      document.projectName ? `Project: ${document.projectName}` : "",
      document.clientName ? `Client: ${document.clientName}` : "",
      document.preparedBy ? `Prepared by: ${document.preparedBy}` : "",
    ]
      .filter(Boolean)
      .join("\n") || undefined,
    displayUnit: document.unitSystem === "imperial" ? "ft-in" : "mm",
    createdAt: document.createdAt ?? project.createdAt,
    updatedAt: document.updatedAt ?? project.updatedAt,
  };

  const envelope = createEnvelopeV1(project);
  return { project, envelope, warnings };
}

/**
 * Convert an Open3dProject back to an OOFPLWeb PlannerDocument.
 * Reconstructs metadata from description and envelope fields.
 */
export function open3dProjectToPlannerDocument(
  project: Open3dProject,
  envelope?: Open3dPlannerSceneEnvelope,
): Open3dToPlannerDocumentResult {
  const warnings: string[] = [];

  // Parse description back into metadata fields
  let title: string | null = null;
  let projectName: string | null = null;
  let clientName: string | null = null;
  let preparedBy: string | null = null;

  if (project.description) {
    const lines = project.description.split("\n");
    for (const line of lines) {
      if (line.startsWith("Title: ")) title = line.slice("Title: ".length);
      else if (line.startsWith("Project: ")) projectName = line.slice("Project: ".length);
      else if (line.startsWith("Client: ")) clientName = line.slice("Client: ".length);
      else if (line.startsWith("Prepared by: ")) preparedBy = line.slice("Prepared by: ".length);
    }
  }

  // Derive room dimensions from first floor walls
  let roomWidthMm = 6000;
  let roomDepthMm = 8000;
  const floor = project.floors[0];
  if (floor && floor.walls.length >= 4) {
    const xs = floor.walls.flatMap((w) => [w.start.x, w.end.x]);
    const ys = floor.walls.flatMap((w) => [w.start.y, w.end.y]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    roomWidthMm = Math.max(1, Math.round(maxX - minX));
    roomDepthMm = Math.max(1, Math.round(maxY - minY));
  } else {
    warnings.push("No recognizable rectangular room in first floor; using default dimensions.");
  }

  const unitSystem: "metric" | "imperial" = project.displayUnit === "ft-in" ? "imperial" : "metric";

  // Store the full Open3D envelope in sceneJson so round-trip preserves everything
  const sceneJson = envelope ?? createEnvelopeV1(project);

  const document: PlannerDocument = {
    schemaVersion: 1,
    id: project.id,
    name: project.name,
    title: title ?? project.name,
    projectName,
    clientName,
    preparedBy,
    roomWidthMm,
    roomDepthMm,
    seatTarget: 10,
    unitSystem,
    sceneJson: toPlannerJsonValue(sceneJson),
    itemCount: 0,
    thumbnailUrl: null,
    status: "draft",
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };

  return { document, warnings };
}
