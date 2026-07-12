/**
 * Phase 03 Fallback Geometry
 *
 * Generates visible, accessible fallback geometry when a catalog asset
 * (image, mesh, or texture) is missing, expired, or invalid.
 *
 * Always produces a colored procedural box with visible border and
 * accessible name. Fallback is noticeable but safe.
 */

import type { PlannerCatalogDimensions, PlannerFallbackGeometry } from "./catalogTypes";
import { buildAccessibleName } from "./unitConversion";

// ── Fallback color palette ──

/**
 * Color palette for fallback geometry, keyed by category.
 * Each color has high contrast against typical backgrounds and
 * includes a visible border color.
 */
const FALLBACK_COLORS: Record<string, { fill: string; border: string }> = {
  Furniture: { fill: "#E8D5B7", border: "#8B7355" },
  Lighting: { fill: "#FFF3C4", border: "#D4A017" },
  Decor: { fill: "#E8D5F0", border: "#8E6B9E" },
  Outdoor: { fill: "#C8E6C9", border: "#4CAF50" },
  "Bedding & Textiles": { fill: "#F0E6EF", border: "#B39DBC" },
  "Storage & Organisation": { fill: "#D5E8F0", border: "#5C8BA8" },
  "Kitchen & Dining": { fill: "#FFE0B2", border: "#E65100" },
  Symbols: { fill: "#E0E0E0", border: "#616161" },
};

// ── Fallback generation ──

/**
 * Build fallback geometry for a catalog item when assets are unavailable.
 *
 * Produces a colored box matching the catalog dimensions with:
 * - Fill color based on product category
 * - High-contrast border for visibility
 * - Accessible name derived from product name + dimensions
 * - Reason string describing why the fallback was triggered
 */
export function buildFallbackGeometry(params: {
  name: string;
  category: string;
  dimensions: PlannerCatalogDimensions;
  reason: string;
  type?: "image" | "mesh" | "texture";
}): PlannerFallbackGeometry {
  const colors = FALLBACK_COLORS[params.category] ?? {
    fill: "#FFEB3B",
    border: "#F44336",
  };

  const assetType = params.type ?? "image";
  const accessibleName = `Missing ${assetType}: ${buildAccessibleName(params.name, params.dimensions)} (placeholder)`;

  return {
    type: "box",
    color: colors.fill,
    borderColor: colors.border,
    material: "fallback",
    accessibleName,
    dimensions: {
      widthMm: params.dimensions.widthMm,
      depthMm: params.dimensions.depthMm,
      heightMm: params.dimensions.heightMm,
      seatHeightMm: params.dimensions.seatHeightMm,
      weightKg: params.dimensions.weightKg,
    },
    reason: params.reason,
  };
}

/**
 * Build fallback geometry from missing image URL scenario.
 */
export function buildImageFallback(
  name: string,
  category: string,
  dimensions: PlannerCatalogDimensions,
  reason: string,
): PlannerFallbackGeometry {
  return buildFallbackGeometry({ name, category, dimensions, reason, type: "image" });
}

/**
 * Build fallback geometry from missing 3D mesh scenario.
 */
export function buildMeshFallback(
  name: string,
  category: string,
  dimensions: PlannerCatalogDimensions,
  reason: string,
): PlannerFallbackGeometry {
  return buildFallbackGeometry({ name, category, dimensions, reason, type: "mesh" });
}

/**
 * Build fallback geometry from missing texture scenario.
 */
export function buildTextureFallback(
  name: string,
  category: string,
  dimensions: PlannerCatalogDimensions,
  reason: string,
): PlannerFallbackGeometry {
  return buildFallbackGeometry({ name, category, dimensions, reason, type: "texture" });
}
