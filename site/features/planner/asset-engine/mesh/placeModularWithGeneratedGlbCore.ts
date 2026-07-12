/**
 * Shared place → G5 → optional write → stamp orchestration.
 * No node:fs — callers inject write (Node disk or browser API).
 *
 * @see placeModularWithGeneratedGlbPlan (Node default write)
 * @see placeModularWithGeneratedGlbBrowser (client → public write API)
 */

import { exportModularCabinetV0GlbBinary } from "@/features/planner/asset-engine/mesh/exportModularGlbBinary";
import { stampFurnitureGeneratedGlb } from "@/features/planner/asset-engine/mesh/stampFurnitureGeneratedGlb";
import {
  placeCatalogItemInProject,
  type PlacementOptions,
} from "@/features/planner/project/catalog/placementAction";
import { modularCabinetV0GeneratedRelativePath } from "@/features/planner/project/catalog/modularCabinetV0GlbExport";
import { defaultCabinetV0Options } from "@/features/planner/project/catalog/modularCabinetV0";
import type {
  PlannerCatalogItem,
  PlannerCatalogVariant,
} from "@/features/planner/project/catalog/catalogTypes";
import type {
  PlannerFurnitureItem,
  PlannerProject,
} from "@/features/planner/project/model/types";

export type PlaceModularGlbWriteResult = {
  readonly absolutePath: string | null;
  readonly publicUrlPath: string | null;
};

/**
 * Write generated GLB bytes somewhere fetchable (public disk or remote).
 * Throw or reject to leave furniture unstamped (procedural mesh).
 */
export type PlaceModularGlbWriter = (
  buffer: ArrayBuffer,
  relativePath: string,
) => PlaceModularGlbWriteResult | Promise<PlaceModularGlbWriteResult>;

export type PlaceModularWithGeneratedGlbCoreOptions = {
  variant?: PlannerCatalogVariant | null;
  placedFrom?: PlacementOptions["placedFrom"];
  rotation?: number;
  scale?: PlacementOptions["scale"];
  materialOverride?: string;
  colorOverride?: string;
  locked?: boolean;
  /**
   * When false, skip write and stamp from in-memory G5 only.
   * Default true.
   */
  writeToPublic?: boolean;
  /**
   * Required when writeToPublic is true (default).
   * Node: writeGeneratedGlbToPublic; browser: POST /api/planner/generated-glb.
   */
  writeBytes?: PlaceModularGlbWriter;
};

export type PlaceModularWithGeneratedGlbCoreResult = {
  project: PlannerProject;
  furnitureId: string;
  relativePath: string;
  stamped: boolean;
  written: boolean;
  writtenAbsolutePath: string | null;
  publicUrlPath: string | null;
};

function findFurniture(
  project: PlannerProject,
  furnitureId: string,
): PlannerFurnitureItem | undefined {
  for (const floor of project.floors) {
    const hit = floor.furniture.find((f) => f.id === furnitureId);
    if (hit) return hit;
  }
  return undefined;
}

function replaceFurniture(
  project: PlannerProject,
  furnitureId: string,
  next: PlannerFurnitureItem,
): PlannerProject {
  return {
    ...project,
    floors: project.floors.map((floor) => ({
      ...floor,
      furniture: floor.furniture.map((f) => (f.id === furnitureId ? next : f)),
    })),
  };
}

/**
 * Place modular catalog item, export G5 binary, optionally write, stamp path.
 * Does **not** upload to remote CDN.
 */
export async function placeModularWithGeneratedGlbCore(
  project: PlannerProject,
  item: PlannerCatalogItem,
  position: { x: number; y: number },
  options?: PlaceModularWithGeneratedGlbCoreOptions,
): Promise<PlaceModularWithGeneratedGlbCoreResult> {
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
      `placeModularWithGeneratedGlb: furniture ${furnitureId} missing after place.`,
    );
  }

  if (
    furniture.geometryMode !== "modular-cabinet-v0" ||
    !furniture.modularOptions
  ) {
    throw new Error(
      "placeModularWithGeneratedGlb requires a modular-cabinet-v0 catalog item " +
        "(geometryMode + modularOptions after place).",
    );
  }

  const modularOptions = defaultCabinetV0Options(furniture.modularOptions);
  const planPath = modularCabinetV0GeneratedRelativePath(modularOptions);
  const writeToPublic = options?.writeToPublic !== false;

  const exportResult = await exportModularCabinetV0GlbBinary(modularOptions);
  if (!exportResult.ok) {
    return {
      project: nextProject,
      furnitureId,
      relativePath: planPath,
      stamped: false,
      written: false,
      writtenAbsolutePath: null,
      publicUrlPath: null,
    };
  }

  let writtenAbsolutePath: string | null = null;
  let publicUrlPath: string | null = null;
  let written = false;

  if (writeToPublic) {
    const writer = options?.writeBytes;
    if (!writer) {
      throw new Error(
        "placeModularWithGeneratedGlb: writeToPublic requires writeBytes",
      );
    }
    try {
      const write = await writer(
        exportResult.buffer,
        exportResult.relativePath,
      );
      written = true;
      writtenAbsolutePath = write.absolutePath;
      publicUrlPath = write.publicUrlPath;
    } catch {
      return {
        project: nextProject,
        furnitureId,
        relativePath: exportResult.relativePath,
        stamped: false,
        written: false,
        writtenAbsolutePath: null,
        publicUrlPath: null,
      };
    }
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
    written,
    writtenAbsolutePath,
    publicUrlPath,
  };
}
