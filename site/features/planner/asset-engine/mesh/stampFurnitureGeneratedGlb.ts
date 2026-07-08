/**
 * Bridge G5 binary export path → furniture document field (for G8).
 *
 * After `exportModularCabinetV0GlbBinary` (and optional upload), stamp the
 * policy-safe relative path / URL onto furniture. Placement does not set this;
 * unset means procedural mesh remains the product default.
 */

import {
  assertNoDesignerStaticGlb,
  isSystemGeneratedGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
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
