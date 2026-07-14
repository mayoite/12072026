import type { Product, SizeOption } from "@/lib/catalog/types";

import type { CatalogItem } from "./catalogTypes";
import {
  mapAdminCategoryToWorkspace,
  millimetersToCatalogCmFields,
  shapeTypeForCategory,
} from "./managedProductCatalogBridge";

function minPositive(values: readonly number[]): number | null {
  const valid = values.filter((value) => Number.isFinite(value) && value > 0);
  return valid.length > 0 ? Math.min(...valid) : null;
}

function parametricFootprintMm(
  product: Product,
): { widthMm: number; depthMm: number; heightMm: number } | null {
  const ws = product.workstation;
  if (!ws) return null;

  const minLength = minPositive(ws.lengthOptions);
  const minDepth = minPositive(ws.depthOptions);
  const minSeaters = minPositive(ws.seaterOptions);
  if (minLength === null || minDepth === null || minSeaters === null) return null;

  const heightMm = ws.heightMm ?? 750;

  if (ws.shape === "l-shape") {
    return { widthMm: minLength, depthMm: minLength, heightMm };
  }

  return {
    widthMm: minSeaters * minLength,
    depthMm: ws.sharing === "sharing" ? minDepth * 2 : minDepth,
    heightMm,
  };
}

function discreteFootprintMm(
  product: Product,
): { widthMm: number; depthMm: number; heightMm: number } | null {
  const options = product.sizeOptions ?? [];
  if (options.length === 0) return null;

  let best: SizeOption | null = null;
  let bestArea = Number.POSITIVE_INFINITY;
  for (const option of options) {
    const area = option.dim.L * option.dim.D;
    if (area > 0 && area < bestArea) {
      bestArea = area;
      best = option;
    }
  }
  if (!best) return null;

  return {
    widthMm: best.dim.L,
    depthMm: best.dim.D,
    heightMm: best.dim.H ?? 750,
  };
}

function fixedFootprintMm(
  product: Product,
): { widthMm: number; depthMm: number; heightMm: number } | null {
  const footprint = product.defaultFootprint;
  if (!footprint?.L || !footprint?.D) return null;
  return {
    widthMm: footprint.L,
    depthMm: footprint.D,
    heightMm: footprint.H ?? 750,
  };
}

/** Map typed configurator `Product` → planner workspace `CatalogItem`. */
export function productToCatalogItem(product: Product): CatalogItem | null {
  if (!product.slug?.trim() || !product.name?.trim() || !product.sizingType) return null;

  let footprint: { widthMm: number; depthMm: number; heightMm: number } | null = null;
  if (product.sizingType === "parametric") {
    footprint = parametricFootprintMm(product);
  } else if (product.sizingType === "discrete") {
    footprint = discreteFootprintMm(product);
  } else if (product.sizingType === "fixed") {
    footprint = fixedFootprintMm(product);
  }
  if (!footprint) return null;

  const category = mapAdminCategoryToWorkspace(product.category_id, product.family);
  const shapeType = shapeTypeForCategory(category, product.family);
  const planFootprint = millimetersToCatalogCmFields(footprint.widthMm, footprint.depthMm);
  const slug = product.slug.trim();

  return {
    id: slug,
    sku: slug,
    name: product.name,
    shortName:
      product.name.length > 30 ? `${product.name.slice(0, 27).trim()}…` : product.name,
    category,
    shapeType,
    widthMm: planFootprint.widthMm,
    heightMm: planFootprint.heightMm,
    depthMm: Math.max(1, Math.round(footprint.heightMm / 10)),
    seatCount:
      product.sizingType === "parametric"
        ? (minPositive(product.workstation?.seaterOptions ?? []) ?? undefined)
        : undefined,
    description: product.description ?? "",
    tags: ["configurator", product.category_id, product.family ?? ""].filter(Boolean),
    imageUrl: product.thumbnailUrl ?? undefined,
    material: product.specs?.materials?.[0] ?? "Configurator",
  };
}
