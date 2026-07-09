/**
 * Bridge G5 binary export path → furniture document field (for G8).
 *
 * After `exportModularCabinetV0GlbBinary` (and optional upload), stamp the
 * policy-safe relative path / URL onto furniture. Placement does not set this;
 * unset means procedural mesh remains the product default.
 *
 * Two stamp modes (clear naming):
 * - **path-only** — `stampFurnitureFromModularOptions`: stamps
 *   `modularCabinetV0GeneratedRelativePath` without producing bytes. Path may
 *   not exist on disk/CDN until a later upload or G5 binary write.
 * - **binary-export + write stamp** — `placeModularWithGeneratedGlbPlan` (or
 *   `exportModularAndWrite` + `stampFurnitureGeneratedGlb`): runs G5, writes
 *   under site/public/catalog-assets/generated/, stamps `relativePath`.
 *   Does **not** auto-upload to remote CDN.
 */

import {
  assertNoDesignerStaticGlb,
  isSystemGeneratedGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
import { modularCabinetV0GeneratedRelativePath } from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";
import { defaultCabinetV0Options } from "@/features/planner/open3d/catalog/modularCabinetV0";
import type { Open3dFurnitureItem } from "@/features/planner/open3d/model/types";

/**
 * Stamp a system-generated GLB path onto furniture for catalog/document + G8.
 * Rejects empty and designer/static URLs (glbAssetPolicy).
 */
export function stampFurnitureGeneratedGlb(
  item: Open3dFurnitureItem,
  relativePath: string,
): Open3dFurnitureItem {
  const trimmed = relativePath.trim();
  if (!trimmed) {
    throw new Error(
      "generatedGlbUrl requires a non-empty system-generated path " +
        "(catalog-assets/generated/… or blob:).",
    );
  }
  assertNoDesignerStaticGlb(trimmed, "generatedGlbUrl");
  if (!isSystemGeneratedGlbUrl(trimmed)) {
    // Defensive: policy helper already rejects non-empty non-system paths.
    throw new Error(
      "generatedGlbUrl must pass isSystemGeneratedGlbUrl " +
        "(catalog-assets/generated/ or blob:).",
    );
  }
  return {
    ...item,
    generatedGlbUrl: trimmed,
  };
}

/** Alias for stampFurnitureGeneratedGlb (G5 path → furniture field). */
export const attachGeneratedGlbToFurniture = stampFurnitureGeneratedGlb;

/**
 * **Path-only stamp** (no binary export).
 *
 * Derives `modularCabinetV0GeneratedRelativePath` from the item's modular
 * options and stamps `generatedGlbUrl`. Does **not** run G5 / GLTFExporter;
 * the path is plan metadata until a file or blob actually exists under
 * catalog-assets/generated/. Prefer when binary is heavy and only the planned
 * path is needed on the document.
 *
 * Requires `geometryMode === "modular-cabinet-v0"` and `modularOptions`.
 */
export function stampFurnitureFromModularOptions(
  item: Open3dFurnitureItem,
): Open3dFurnitureItem {
  if (item.geometryMode !== "modular-cabinet-v0") {
    throw new Error(
      "stampFurnitureFromModularOptions requires geometryMode modular-cabinet-v0 " +
        "(path-only stamp of modularCabinetV0GeneratedRelativePath).",
    );
  }
  if (!item.modularOptions) {
    throw new Error(
      "stampFurnitureFromModularOptions requires modularOptions on the furniture item.",
    );
  }
  const options = defaultCabinetV0Options(item.modularOptions);
  const relativePath = modularCabinetV0GeneratedRelativePath(options);
  return stampFurnitureGeneratedGlb(item, relativePath);
}
