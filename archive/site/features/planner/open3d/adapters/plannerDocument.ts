import {
  createEmptyPlannerDocument,
  getPlannerSceneEnvelope,
  type PlannerDocument,
  type PlannerSceneEnvelope,
} from "@/features/planner/model/plannerDocument";
import { toPlannerJsonSafe } from "@/features/planner/model/plannerJsonSafe";

import { createRectangularRoomProject } from "../model/project";
import type {
  Open3dDisplayUnit,
  Open3dFurnitureItem,
  Open3dProject,
} from "../model/types";
import { parseOpen3dSceneEnvelope } from "./projectParser";

export interface Open3dDocumentReadResult {
  ok: boolean;
  project?: Open3dProject;
  error?: string;
  convertedLegacy?: boolean;
}

function displayUnitFromLegacy(scene: PlannerSceneEnvelope): Open3dDisplayUnit {
  return scene.measurement.displayUnit === "ft-in" ? "ft-in" : "mm";
}

function legacySceneToProject(
  document: PlannerDocument,
  scene: PlannerSceneEnvelope,
): Open3dProject {
  const ids = ["floor", "project", "north", "east", "south", "west"];
  let index = 0;
  const project = createRectangularRoomProject({
    widthMm: scene.room.widthMm,
    depthMm: scene.room.depthMm,
    wallHeightMm: scene.room.wallHeightMm,
    wallThicknessMm: scene.room.wallThicknessMm,
    name: document.title ?? document.name,
    now: document.updatedAt,
    idFactory: () => `${document.id}:${ids[index++] ?? `legacy-${index}`}`,
  });
  const furniture: Open3dFurnitureItem[] = scene.items.map((item) => ({
    id: item.id,
    catalogId: item.productId ?? item.productSlug ?? "legacy-placeholder",
    sourceCatalogId: item.productId,
    sourceSlug: item.productSlug ?? item.plannerSourceSlug,
    position: { x: item.centerMm.xMm, y: item.centerMm.yMm },
    rotation: item.rotationDeg,
    scale: { x: 1, y: 1, z: 1 },
    width: item.sizeMm.widthMm,
    depth: item.sizeMm.depthMm,
    height: item.sizeMm.heightMm,
    material: `Legacy item: ${item.name}`,
  }));
  return {
    ...project,
    id: document.id ?? project.id,
    displayUnit: displayUnitFromLegacy(scene),
    createdAt: document.createdAt ?? project.createdAt,
    updatedAt: document.updatedAt ?? project.updatedAt,
    floors: [{ ...project.floors[0], furniture }],
  };
}

export function plannerDocumentToOpen3dProject(
  document: PlannerDocument,
): Open3dDocumentReadResult {
  try {
    return { ok: true, project: parseOpen3dSceneEnvelope(document.sceneJson).project };
  } catch (nativeError) {
    const legacy = getPlannerSceneEnvelope(document.sceneJson);
    if (legacy) {
      return {
        ok: true,
        project: legacySceneToProject(document, legacy),
        convertedLegacy: true,
      };
    }
    return {
      ok: false,
      error: nativeError instanceof Error ? nativeError.message : "Unsupported planner scene.",
    };
  }
}

function projectBounds(project: Open3dProject): { widthMm: number; depthMm: number } {
  const floor = project.floors.find((candidate) => candidate.id === project.activeFloorId);
  const points = floor?.walls.flatMap((wall) => [wall.start, wall.end]) ?? [];
  if (points.length === 0) return { widthMm: 6000, depthMm: 8000 };
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    widthMm: Math.max(1, Math.round(Math.max(...xs) - Math.min(...xs))),
    depthMm: Math.max(1, Math.round(Math.max(...ys) - Math.min(...ys))),
  };
}

export function open3dProjectToPlannerDocument(
  project: Open3dProject,
  base?: PlannerDocument,
): PlannerDocument {
  const bounds = projectBounds(project);
  const itemCount = project.floors.reduce(
    (total, floor) => total + floor.furniture.length,
    0,
  );
  const source = base ?? createEmptyPlannerDocument({ name: project.name, title: project.name });
  return createEmptyPlannerDocument({
    ...source,
    name: project.name,
    title: project.name,
    roomWidthMm: bounds.widthMm,
    roomDepthMm: bounds.depthMm,
    unitSystem: project.displayUnit === "in" || project.displayUnit === "ft-in"
      ? "imperial"
      : "metric",
    sceneJson: toPlannerJsonSafe({
      type: "open3d-floorplan-project",
      version: 1,
      units: "mm",
      displayUnit: project.displayUnit,
      source: "native-open3d",
      project,
    }),
    itemCount,
    createdAt: source.createdAt,
    updatedAt: project.updatedAt,
  });
}
