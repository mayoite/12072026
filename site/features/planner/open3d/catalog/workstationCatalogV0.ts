/**
 * Systems v0 → Open3d catalog items for inventory / click-to-place.
 * Pure combinatorics live in workstationSystemV0; this is the catalog surface.
 */

import type { Open3dCatalogItem } from "./catalogTypes";
import {
  expandWorkstationV0Matrix,
  workstationConfigKey,
  workstationFootprintMm,
  type WorkstationConfigV0,
} from "./workstationSystemV0";

function shapeLabel(shape: WorkstationConfigV0["shape"]): string {
  return shape === "l-shape" ? "L-shape" : "Linear";
}

/**
 * Build a catalog item from a workstation config (stable id = workstationConfigKey).
 */
export function workstationConfigToCatalogItem(
  config: WorkstationConfigV0,
): Open3dCatalogItem {
  const key = workstationConfigKey(config);
  const footprint = workstationFootprintMm(config);
  const shape = shapeLabel(config.shape);
  const sizeLabel = `${config.size.lengthMm}×${config.size.depthMm}`;
  const name = `Workstation ${shape} ${sizeLabel}`;
  const shortName =
    name.length <= 30 ? name : `WS ${shape.slice(0, 1)} ${sizeLabel}`.slice(0, 30);

  return {
    id: key,
    slug: key,
    sku: key.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 40),
    name,
    shortName,
    description: `Systems v0 ${shape.toLowerCase()} workstation (${sizeLabel} mm footprint ${footprint.widthMm}×${footprint.depthMm}). Modules: ${config.modules.join(", ")}.`,
    category: "Furniture",
    subCategory: "Desks & Workstations",
    taxonomyPath: "Furniture > Desks & Workstations",
    dimensions: {
      widthMm: footprint.widthMm,
      depthMm: footprint.depthMm,
      heightMm: config.heightMm,
    },
    displayUnit: "mm",
    assets: {
      imageUrls: [],
      previewImageUrl: "/placeholder-desk.svg",
    },
    material: {
      marketingMaterial: "Premium laminate",
      normalizedMaterial: "default",
    },
    roomTags: ["Office"],
    styleTags: ["Modern", "Minimalist"],
    availability: "in-stock",
    assemblyType: "flat-pack",
    flatPack: true,
    configurability: "configurable",
    tags: [
      "workstation",
      "systems-v0",
      "ws-v0",
      config.shape,
      ...config.modules,
    ],
    variants: [],
    provenance: {
      source: "systems_v0",
      plannerSourceSlug: key,
    },
    symbolOnly: false,
    geometryMode: "workstation-v0",
  };
}

/** Full v0 matrix as demo/inventory catalog seed (size grid × linear/L). */
export function expandWorkstationV0CatalogItems(): Open3dCatalogItem[] {
  return expandWorkstationV0Matrix().map(workstationConfigToCatalogItem);
}

/** Stable demo list (matrix expand — currently 8 configs). */
export const WORKSTATION_V0_DEMO_CATALOG_ITEMS: Open3dCatalogItem[] =
  expandWorkstationV0CatalogItems();
