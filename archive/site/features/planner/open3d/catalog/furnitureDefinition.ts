import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";

import type { Open3dFurnitureItem, Open3dPoint } from "../model/types";

export interface Open3dFurnitureDefinition {
  sourceCatalogId: string;
  source: "standard" | "configurator";
  slug?: string;
  sku?: string;
  name: string;
  category: string;
  dimensionsMm: {
    width: number;
    depth: number;
    height: number;
  };
  previewImageUrl?: string;
  meshUrl?: string;
  material?: string;
  tags: string[];
  price?: number;
  quoteRequired?: boolean;
  fallbackGeometry: "box";
}

/**
 * CatalogItem footprint fields currently contain centimetres despite their
 * historical `*Mm` names. Normalize them once at this adapter boundary.
 */
export function catalogItemToOpen3dFurnitureDefinition(
  item: CatalogItem,
  source: Open3dFurnitureDefinition["source"] = "standard",
): Open3dFurnitureDefinition {
  return {
    sourceCatalogId: item.id,
    source,
    slug: item.catalogUrl,
    sku: item.sku,
    name: item.name,
    category: item.category,
    dimensionsMm: {
      width: item.widthMm * 10,
      depth: item.heightMm * 10,
      height: item.depthMm * 10,
    },
    previewImageUrl: item.imageUrl,
    material: item.material,
    tags: [...item.tags],
    fallbackGeometry: "box",
  };
}

export function createFurnitureItemFromDefinition(
  definition: Open3dFurnitureDefinition,
  input: {
    id: string;
    position: Open3dPoint;
    rotation?: number;
  },
): Open3dFurnitureItem {
  return {
    id: input.id,
    catalogId: definition.sourceCatalogId,
    sourceCatalogId: definition.sourceCatalogId,
    sourceSlug: definition.slug,
    sourceSku: definition.sku,
    position: { ...input.position },
    rotation: input.rotation ?? 0,
    scale: { x: 1, y: 1, z: 1 },
    width: definition.dimensionsMm.width,
    depth: definition.dimensionsMm.depth,
    height: definition.dimensionsMm.height,
    material: definition.material,
  };
}
