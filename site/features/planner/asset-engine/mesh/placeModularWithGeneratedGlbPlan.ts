/**
 * Optional place + G5 binary + public disk write + document stamp (Node).
 *
 * **P0.2 recommendation (part C):** second place path already exists — use this
 * helper for write+stamp. Do **not** add `DEV_MODULAR_GLB_WRITE` (or similar) to
 * `placeCatalogItemInProject`; product UI/default stays procedural mesh except
 * the narrow cabinet-v0 inventory wire (browser uses placeModularWithGeneratedGlbBrowser).
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

import {
  placeModularWithGeneratedGlbCore,
  type PlaceModularWithGeneratedGlbCoreResult,
} from "@/features/planner/asset-engine/mesh/placeModularWithGeneratedGlbCore";
import {
  writeGeneratedGlbToPublic,
  type WriteGeneratedGlbToPublicOptions,
} from "@/features/planner/asset-engine/mesh/writeGeneratedGlbToPublic";
import type { PlacementOptions } from "@/features/planner/project/catalog/placementAction";
import type {
  Open3dCatalogItem,
  Open3dCatalogVariant,
} from "@/features/planner/project/catalog/catalogTypes";
import type { Open3dProject } from "@/features/planner/project/model/types";

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

export type PlaceModularWithGeneratedGlbPlanResult =
  PlaceModularWithGeneratedGlbCoreResult;

/**
 * Place modular catalog item, export G5 binary, write under public, stamp path.
 * Does **not** upload to remote CDN. Product default place stays procedural
 * except open3d inventory cabinet-v0 (browser path).
 */
export async function placeModularWithGeneratedGlbPlan(
  project: Open3dProject,
  item: Open3dCatalogItem,
  position: { x: number; y: number },
  options?: PlaceModularWithGeneratedGlbPlanOptions,
): Promise<PlaceModularWithGeneratedGlbPlanResult> {
  const writeToPublic = options?.writeToPublic !== false;
  const writeOpts: WriteGeneratedGlbToPublicOptions | undefined =
    options?.publicRoot !== undefined
      ? { publicRoot: options.publicRoot }
      : undefined;

  return placeModularWithGeneratedGlbCore(project, item, position, {
    variant: options?.variant,
    placedFrom: options?.placedFrom,
    rotation: options?.rotation,
    scale: options?.scale,
    materialOverride: options?.materialOverride,
    colorOverride: options?.colorOverride,
    locked: options?.locked,
    writeToPublic,
    writeBytes: writeToPublic
      ? (buffer, relativePath) => {
          const write = writeGeneratedGlbToPublic(
            buffer,
            relativePath,
            writeOpts,
          );
          return {
            absolutePath: write.absolutePath,
            publicUrlPath: write.publicUrlPath,
          };
        }
      : undefined,
  });
}
