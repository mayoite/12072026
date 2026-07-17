/**
 * 2D document ↔ 3D scene parity checks (pure).
 * Used by unit tests and optional browser matrix hooks.
 */

import type { PlannerProject } from "@/features/planner/model/types";
import {
  buildPlannerSceneNodes,
  type PlannerSceneNode,
} from "./buildPlannerSceneNodes";

export type SceneParityReport = {
  ok: boolean;
  wallIdsMissingInScene: string[];
  furnitureIdsMissingInScene: string[];
  doorIdsInDocument: string[];
  windowIdsInDocument: string[];
  /** Doors/windows are still 2D-first; 3D markers may be absent. */
  openingsRepresentedIn3d: boolean;
  sceneNodeCount: number;
  furnitureNodeCount: number;
  wallNodeCount: number;
};

function activeFloor(project: PlannerProject) {
  return (
    project.floors.find((f) => f.id === project.activeFloorId) ??
    project.floors[0]
  );
}

/**
 * Compare document entity ids on the active floor with scene nodes.
 * Walls + furniture must appear 1:1. Openings are reported but not required yet.
 */
export function checkSceneParity(project: PlannerProject): SceneParityReport {
  const floor = activeFloor(project);
  const nodes: PlannerSceneNode[] = buildPlannerSceneNodes(project);
  const sceneIds = new Set(nodes.map((n) => n.id));

  const wallIdsMissingInScene = (floor?.walls ?? [])
    .map((w) => w.id)
    .filter((id) => !sceneIds.has(id));
  const furnitureIdsMissingInScene = (floor?.furniture ?? [])
    .map((f) => f.id)
    .filter((id) => !sceneIds.has(id));

  const doorIdsInDocument = (floor?.doors ?? []).map((d) => d.id);
  const windowIdsInDocument = (floor?.windows ?? []).map((w) => w.id);
  const openingsRepresentedIn3d =
    doorIdsInDocument.every((id) => sceneIds.has(id)) &&
    windowIdsInDocument.every((id) => sceneIds.has(id));

  const wallNodeCount = nodes.filter((n) => n.kind === "wall").length;
  const furnitureNodeCount = nodes.filter((n) => n.kind === "furniture").length;

  return {
    ok:
      wallIdsMissingInScene.length === 0 &&
      furnitureIdsMissingInScene.length === 0,
    wallIdsMissingInScene,
    furnitureIdsMissingInScene,
    doorIdsInDocument,
    windowIdsInDocument,
    openingsRepresentedIn3d,
    sceneNodeCount: nodes.length,
    furnitureNodeCount,
    wallNodeCount,
  };
}
