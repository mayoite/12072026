/**
 * Resolve placed furniture → procedural Block2D for canvas (our symbols only).
 * No GLBs, no third-party asset downloads — prims from blocks2d / modular path / box.
 */

import {
  BLOCK_STYLE,
  buildGenericBlock2D,
  type Block2D,
  type Prim,
} from "@/lib/catalog/blocks2d";
import { resolveCatalogItemBlock2D } from "@/features/planner/catalog/catalogBlockBridge";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";
import type { Open3dFurnitureItem } from "../model/types";
import type { ModularCabinetV0Options } from "./modularCabinetV0";

const DEFAULT_MM = 600;

function boxBlock(widthMm: number, depthMm: number, heightMm: number, label: string): Block2D {
  const w = Math.max(1, widthMm);
  const d = Math.max(1, depthMm);
  const prims: Prim[] = [
    {
      kind: "rect",
      x: 0,
      y: 0,
      w,
      h: d,
      fill: BLOCK_STYLE.surface,
      stroke: BLOCK_STYLE.surfaceStroke,
      strokeWidth: BLOCK_STYLE.surfaceStrokeWidth,
      radius: BLOCK_STYLE.cornerRadius,
    },
  ];
  return { footprint: { L: w, D: d, H: heightMm }, prims, label };
}

function modularCabinetBlock(item: Open3dFurnitureItem): Block2D {
  const opts = item.modularOptions as ModularCabinetV0Options | undefined;
  const w = opts?.widthMm ?? item.width ?? DEFAULT_MM;
  const d = opts?.depthMm ?? item.depth ?? DEFAULT_MM;
  const h = opts?.heightMm ?? item.height ?? 900;
  // Top-left plan symbol (not centered path) so renderBlock2DCentered works.
  const prims: Prim[] = [
    {
      kind: "rect",
      x: 0,
      y: 0,
      w,
      h: d,
      fill: BLOCK_STYLE.storage,
      stroke: BLOCK_STYLE.storageStroke,
      strokeWidth: BLOCK_STYLE.surfaceStrokeWidth,
      radius: 4,
    },
    {
      kind: "line",
      points: [w * 0.5, 8, w * 0.5, d - 8],
      stroke: BLOCK_STYLE.storageStroke,
      strokeWidth: 1.5,
      dash: [6, 4],
    },
  ];
  return {
    footprint: { L: w, D: d, H: h },
    prims,
    label: item.catalogId || "cabinet-v0",
  };
}

/**
 * Map open3d catalog dimensions onto buddy CatalogItem shape for block preview builders.
 * Only used to call our own procedural builders — not external assets.
 */
export function open3dLikeBuddyCatalogItem(input: {
  id: string;
  name: string;
  widthMm: number;
  depthMm: number;
  heightMm?: number;
  categoryHint?: string;
}): CatalogItem {
  const cat = (input.categoryHint ?? "").toLowerCase();
  // CatalogItem.category is desks|rooms|equipment|storage|zones|infrastructure
  let category: CatalogItem["category"] = "desks";
  if (cat.includes("stor") || cat.includes("cabinet")) {
    category = "storage";
  } else if (cat.includes("equip") || cat.includes("access") || cat.includes("plant")) {
    category = "equipment";
  } else if (cat.includes("room") || cat.includes("cabin") || cat.includes("pod")) {
    category = "rooms";
  }

  return {
    id: input.id,
    name: input.name,
    category,
    shapeType: "rect",
    // catalog UI *Mm fields hold cm; normalizeCatalogMm multiplies by 10 → mm prims
    widthMm: input.widthMm / 10,
    heightMm: input.depthMm / 10,
    depthMm: (input.heightMm ?? 750) / 10,
    description: "",
    tags: cat.includes("sofa")
      ? ["sofa"]
      : cat.includes("chair") || cat.includes("seat")
        ? ["chair"]
        : [],
  };
}

/**
 * Build Block2D for a placed furniture entity (plan-view symbol).
 */
export function furnitureBlock2DFromItem(
  item: Open3dFurnitureItem,
  catalogMeta?: { name?: string; category?: string },
): Block2D {
  const widthMm = Math.max(1, item.width ?? DEFAULT_MM);
  const depthMm = Math.max(1, item.depth ?? DEFAULT_MM);
  const heightMm = Math.max(1, item.height ?? 750);
  const label = catalogMeta?.name ?? item.catalogId ?? "item";

  if (item.geometryMode === "modular-cabinet-v0") {
    return modularCabinetBlock(item);
  }

  // Prefer full procedural symbol via catalog bridge (our SVG prims).
  try {
    const buddyLike = open3dLikeBuddyCatalogItem({
      id: item.catalogId || item.id,
      name: label,
      widthMm,
      depthMm,
      heightMm,
      categoryHint: catalogMeta?.category,
    });
    const rich = resolveCatalogItemBlock2D(buddyLike);
    if (rich?.prims.length) {
      // Re-scale if bridge footprint differs from placed size
      if (
        Math.abs(rich.footprint.L - widthMm) > 1 ||
        Math.abs(rich.footprint.D - depthMm) > 1
      ) {
        const sx = widthMm / Math.max(1, rich.footprint.L);
        const sy = depthMm / Math.max(1, rich.footprint.D);
        return scaleBlock2D(rich, sx, sy, widthMm, depthMm, heightMm);
      }
      return rich;
    }
  } catch {
    /* fall through to generic */
  }

  const generic = buildGenericBlock2D("rect", widthMm, depthMm);
  if (generic?.prims.length) {
    return { ...generic, label, footprint: { L: widthMm, D: depthMm, H: heightMm } };
  }

  return boxBlock(widthMm, depthMm, heightMm, label);
}

function scaleBlock2D(
  block: Block2D,
  sx: number,
  sy: number,
  L: number,
  D: number,
  H: number,
): Block2D {
  const prims = block.prims.map((p): Prim => {
    if (p.kind === "rect") {
      return {
        ...p,
        x: p.x * sx,
        y: p.y * sy,
        w: p.w * sx,
        h: p.h * sy,
        radius: p.radius !== undefined ? p.radius * Math.min(sx, sy) : undefined,
        strokeWidth: p.strokeWidth !== undefined ? p.strokeWidth * Math.min(sx, sy) : undefined,
      };
    }
    if (p.kind === "circle") {
      return {
        ...p,
        cx: p.cx * sx,
        cy: p.cy * sy,
        r: p.r * Math.min(sx, sy),
        strokeWidth: p.strokeWidth !== undefined ? p.strokeWidth * Math.min(sx, sy) : undefined,
      };
    }
    if (p.kind === "line") {
      return {
        ...p,
        points: p.points.map((v, i) => (i % 2 === 0 ? v * sx : v * sy)),
        strokeWidth: p.strokeWidth * Math.min(sx, sy),
      };
    }
    if (p.kind === "arc") {
      return {
        ...p,
        cx: p.cx * sx,
        cy: p.cy * sy,
        r: p.r * Math.min(sx, sy),
        strokeWidth: p.strokeWidth * Math.min(sx, sy),
      };
    }
    // path: leave as-is if already sized; otherwise box fallback path not scaled
    return p;
  });
  return { footprint: { L, D, H }, prims, label: block.label };
}

/**
 * True when path prims are authored in centered coordinates (modular cabinet).
 */
export function furnitureBlockUsesCenteredPath(item: Open3dFurnitureItem): boolean {
  return item.geometryMode === "modular-cabinet-v0";
}
