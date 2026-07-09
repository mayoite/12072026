/**
 * Optional place + G5 binary + public disk write + document stamp.
 *
 * **P0.2 recommendation (part C):** second place path already exists — use this
 * helper for write+stamp. Do **not** add `DEV_MODULAR_GLB_WRITE` (or similar) to
 * `placeCatalogItemInProject`; product UI/default stays procedural mesh.
 *
 * Opt-in steps:
 * 1. places via placeCatalogItemInProject (still leaves generatedGlbUrl unset)
 * 2. runs exportModularCabinetV0GlbBinary for that item's modular options
 * 3. writes bytes under site/public/catalog-assets/generated/ (Next-served)
 * 4. stamps stampFurnitureGeneratedGlb only after successful write (when write enabled)
 * 5. returns relativePath (+ write metadata); plain place stays procedural
 *
 * Write failure → leave furniture unstamped (no G8 404 thrash).
 * `writeToPublic: false` → stamp after in-memory export only (tests / legacy).
 *
 * **Binary-export + write stamp** (vs path-only `stampFurnitureFromModularOptions`).
 */

import { exportModularCabinetV0GlbBinary } from "@/features/planner/asset-engine/mesh/exportModularGlbBinary";
import { stampFurnitureGeneratedGlb } from "@/features/planner/asset-engine/mesh/stampFurnitureGeneratedGlb";
import {
  writeGeneratedGlbToPublic,
  type WriteGeneratedGlbToPublicOptions,
} from "@/features/planner/asset-engine/mesh/writeGeneratedGlbToPublic";
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
  /**
   * Override public root for disk write (tests use temp dir).
   * Default: site/public via resolvePublicDir().
   */
  publicRoot?: string;
  /**
   * When false, skip disk write and stamp from in-memory G5 only
   * (legacy path-only-after-export behavior). Default true (P0.2).
   */
  writeToPublic?: boolean;
};

export type PlaceModularWithGeneratedGlbPlanResult = {
  project: Open3dProject;
  furnitureId: string;
  /** Policy-safe path under catalog-assets/generated/. */
  relativePath: string;
  /** true when G5 succeeded, write (if enabled) succeeded, and furniture was stamped. */
  stamped: boolean;
  /** true when GLB bytes were written under public root. */
  written: boolean;
  /** Absolute path when written; null otherwise. */
  writtenAbsolutePath: string | null;
  /** Next public URL path (/catalog-assets/generated/…) when written; null otherwise. */
  publicUrlPath: string | null;
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
 * Place modular catalog item, export G5 binary, write under public, stamp path.
 * Does **not** upload to remote CDN. Product default place stays procedural.
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
  const writeToPublic = options?.writeToPublic !== false;
  const writeOpts: WriteGeneratedGlbToPublicOptions | undefined =
    options?.publicRoot !== undefined
      ? { publicRoot: options.publicRoot }
      : undefined;

  const exportResult = await exportModularCabinetV0GlbBinary(modularOptions);
  if (!exportResult.ok) {
    // Place succeeded; binary failed — leave procedural (unstamped).
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
    try {
      const write = writeGeneratedGlbToPublic(
        exportResult.buffer,
        exportResult.relativePath,
        writeOpts,
      );
      written = true;
      writtenAbsolutePath = write.absolutePath;
      publicUrlPath = write.publicUrlPath;
    } catch {
      // G5 ok but disk write failed — leave procedural so G8 is not stamped to missing file.
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
