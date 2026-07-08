/**
 * Optional place + G5 in-memory binary + document stamp (not auto-upload).
 *
 * Product default remains procedural: `placeCatalogItemInProject` does not
 * set `generatedGlbUrl`. This opt-in helper:
 * 1. places via placeCatalogItemInProject
 * 2. runs exportModularCabinetV0GlbBinary for that item's modular options
 * 3. stamps stampFurnitureGeneratedGlb on the new furniture entity
 * 4. returns relativePath only (bytes not uploaded / not returned)
 *
 * **Binary-export stamp** (vs path-only `stampFurnitureFromModularOptions`).
 */

import { exportModularCabinetV0GlbBinary } from "@/features/planner/asset-engine/mesh/exportModularGlbBinary";
import { stampFurnitureGeneratedGlb } from "@/features/planner/asset-engine/mesh/stampFurnitureGeneratedGlb";
import {
  placeCatalogItemInProject,
  type PlacementOptions,
} from "@/features/planner/open3d/catalog/placementAction";
import { modularCabinetV0GeneratedRelativePath } from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";
import { defaultCabinetV0Options } from "@/features/planner/open3d/catalog/modularCabinetV0";
import type { Open3dCatalogItem, Open3dCatalogVariant } from "@/features/planner/open3d/catalog/catalogTypes";
import type {
  Open3dFurnitureItem,
  Open3dProject,
} from "@/features/planner/open3d/model/types";

export type PlaceModularWithGeneratedGlbPlanOptions = {
  /** Catalog variant (default null). */
  variant?: Open3dCatalogVariant | null;
  placedFrom?: PlacementOptions["placedFrom"];
  rotation?: number;
  scale?: PlacementOptions["scale"];
  materialOverride?: string;
  colorOverride?: string;
  locked?: boolean;
};

export type PlaceModularWithGeneratedGlbPlanResult = {
  project: Open3dProject;
  furnitureId: string;
  /** Policy-safe path under catalog-assets/generated/ (not uploaded). */
  relativePath: string;
  /** true when G5 binary export succeeded and furniture was stamped. */
  stamped: boolean;
};

function findFurniture(
  project: Open3dProject,
  furnitureId: string,
): Open3dFurnitureItem | undefined {
  for (const floor of project.floors) {
    const hit = floor.furniture.find((f) => f.id === furnitureId);
    if (hit) return hit;
  }
  return undefined;
}

function replaceFurniture(
  project: Open3dProject,
  furnitureId: string,
  next: Open3dFurnitureItem,
): Open3dProject {
  return {
    ...project,
    floors: project.floors.map((floor) => ({
      ...floor,
      furniture: floor.furniture.map((f) => (f.id === furnitureId ? next : f)),
    })),
  };
}

/**
 * Place modular catalog item, optionally stamp G5 plan path after in-memory binary export.
 * Does **not** upload the GLB. Honest product default stays procedural unless callers use this.
 */
export async function placeModularWithGeneratedGlbPlan(
  project: Open3dProject,
  item: Open3dCatalogItem,
  position: { x: number; y: number },
  options?: PlaceModularWithGeneratedGlbPlanOptions,
): Promise<PlaceModularWithGeneratedGlbPlanResult> {
  const placement = placeCatalogItemInProject(
    project,
    item,
    options?.variant ?? null,
    {
      placedFrom: options?.placedFrom ?? "api",
      position,
      rotation: options?.rotation,
      scale: options?.scale,
      materialOverride: options?.materialOverride,
      colorOverride: options?.colorOverride,
      locked: options?.locked,
    },
  );

  const furnitureId = placement.snapshot.placementId;
  let nextProject = placement.result.project;
  const furniture = findFurniture(nextProject, furnitureId);

  if (!furniture) {
    throw new Error(
      `placeModularWithGeneratedGlbPlan: furniture ${furnitureId} missing after place.`,
    );
  }

  if (
    furniture.geometryMode !== "modular-cabinet-v0" ||
    !furniture.modularOptions
  ) {
    throw new Error(
      "placeModularWithGeneratedGlbPlan requires a modular-cabinet-v0 catalog item " +
        "(geometryMode + modularOptions after place).",
    );
  }

  const modularOptions = defaultCabinetV0Options(furniture.modularOptions);
  const planPath = modularCabinetV0GeneratedRelativePath(modularOptions);

  const exportResult = await exportModularCabinetV0GlbBinary(modularOptions);
  if (!exportResult.ok) {
    // Place succeeded; binary failed — leave procedural (unstamped). Path still reported.
    return {
      project: nextProject,
      furnitureId,
      relativePath: planPath,
      stamped: false,
    };
  }

  const stampedItem = stampFurnitureGeneratedGlb(
    furniture,
    exportResult.relativePath,
  );
  nextProject = replaceFurniture(nextProject, furnitureId, stampedItem);

  return {
    project: nextProject,
    furnitureId,
    relativePath: exportResult.relativePath,
    stamped: true,
  };
}
