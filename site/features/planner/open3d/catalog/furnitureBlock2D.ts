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
import {
  parseWorkstationConfigKey,
  workstationPlanPrims,
  type WorkstationPlanPrimV0,
} from "./workstationSystemV0";

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

/**
 * Readable plan-view cabinet-v0 symbol (W2 / P05).
 * Top-left mm origin (0..L, 0..D): carcass, inner, front/back, doorStyle cues.
 * Canvas centers via renderBlock2DCentered — prims are never authored centered.
 */
function modularCabinetBlock(item: Open3dFurnitureItem): Block2D {
  const opts = item.modularOptions;
  const w = opts?.widthMm ?? item.width ?? DEFAULT_MM;
  const d = opts?.depthMm ?? item.depth ?? DEFAULT_MM;
  const h = opts?.heightMm ?? item.height ?? 900;
  const doorStyle = opts?.doorStyle ?? "slab";
  const inset = Math.min(16, Math.max(6, Math.min(w, d) * 0.04));
  const frontY = d - inset; // plan: +Y depth; front at larger Y
  const stroke = BLOCK_STYLE.storageStroke;
  const strokeW = BLOCK_STYLE.surfaceStrokeWidth;

  const prims: Prim[] = [
    // Outer carcass
    {
      kind: "rect",
      x: 0,
      y: 0,
      w,
      h: d,
      fill: BLOCK_STYLE.storage,
      stroke,
      strokeWidth: strokeW,
      radius: 4,
    },
    // Inner carcass / shelf zone
    {
      kind: "rect",
      x: inset,
      y: inset,
      w: Math.max(1, w - inset * 2),
      h: Math.max(1, d - inset * 2),
      fill: "none",
      stroke,
      strokeWidth: 1,
      radius: 2,
    },
    // Front edge (door face)
    {
      kind: "line",
      points: [inset, frontY, w - inset, frontY],
      stroke,
      strokeWidth: 2,
    },
    // Back edge
    {
      kind: "line",
      points: [inset, inset, w - inset, inset],
      stroke,
      strokeWidth: 1.5,
    },
  ];

  if (doorStyle === "pair") {
    // Mid stile between pair doors
    prims.push({
      kind: "line",
      points: [w * 0.5, inset, w * 0.5, frontY],
      stroke,
      strokeWidth: 1.5,
      dash: [6, 4],
    });
    const handleW = Math.min(28, w * 0.06);
    const handleH = Math.min(10, d * 0.06);
    const handleY = frontY - handleH - 4;
    prims.push({
      kind: "rect",
      x: w * 0.25 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: stroke,
      radius: 2,
    });
    prims.push({
      kind: "rect",
      x: w * 0.75 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: stroke,
      radius: 2,
    });
  } else if (doorStyle === "slab") {
    const handleW = Math.min(36, w * 0.08);
    const handleH = Math.min(12, d * 0.07);
    prims.push({
      kind: "rect",
      x: w - inset - handleW - 8,
      y: frontY - handleH - 4,
      w: handleW,
      h: handleH,
      fill: stroke,
      radius: 2,
    });
  } else {
    // doorStyle "none" — open shelves cue
    prims.push({
      kind: "line",
      points: [inset, d * 0.33, w - inset, d * 0.33],
      stroke,
      strokeWidth: 1,
      dash: [8, 4],
    });
    prims.push({
      kind: "line",
      points: [inset, d * 0.66, w - inset, d * 0.66],
      stroke,
      strokeWidth: 1,
      dash: [8, 4],
    });
  }

  return {
    footprint: { L: w, D: d, H: h },
    prims,
    label: item.catalogId || "cabinet-v0",
  };
}

function roleFill(role: WorkstationPlanPrimV0["role"]): string {
  if (role === "pedestal") return BLOCK_STYLE.storage;
  if (role === "panel") return BLOCK_STYLE.panel;
  return BLOCK_STYLE.surface;
}

function roleStroke(role: WorkstationPlanPrimV0["role"]): string {
  if (role === "pedestal") return BLOCK_STYLE.storageStroke;
  if (role === "panel") return BLOCK_STYLE.surfaceStroke;
  return BLOCK_STYLE.surfaceStroke;
}

/**
 * Systems v0 workstation plan symbol from workstationPlanPrims (desk/return/pedestal/panel).
 * Top-left mm origin; canvas centers via renderBlock2DCentered.
 */
export function workstationBlock2DFromItem(item: Open3dFurnitureItem): Block2D | null {
  const config =
    parseWorkstationConfigKey(item.catalogId) ??
    parseWorkstationConfigKey(item.sourceCatalogId ?? "") ??
    parseWorkstationConfigKey(item.sourceSlug ?? "");
  if (!config) return null;

  const { footprint, prims: planPrims } = workstationPlanPrims(config);
  const widthMm = Math.max(1, item.width ?? footprint.widthMm);
  const depthMm = Math.max(1, item.depth ?? footprint.depthMm);
  const heightMm = Math.max(1, item.height ?? config.heightMm);

  // Normalize plan prims into top-left quadrant (panel can be y=-40 in rules).
  let minX = 0;
  let minY = 0;
  for (const p of planPrims) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
  }
  const shiftX = -minX;
  const shiftY = -minY;

  let contentW = footprint.widthMm;
  let contentD = footprint.depthMm;
  for (const p of planPrims) {
    contentW = Math.max(contentW, p.x + shiftX + p.w);
    contentD = Math.max(contentD, p.y + shiftY + p.h);
  }

  const prims: Prim[] = planPrims.map((p) => ({
    kind: "rect" as const,
    x: p.x + shiftX,
    y: p.y + shiftY,
    w: Math.max(1, p.w),
    h: Math.max(1, p.h),
    fill: roleFill(p.role),
    stroke: roleStroke(p.role),
    strokeWidth: p.role === "desk" || p.role === "return" ? 2 : 1.5,
    radius: p.role === "panel" ? 2 : BLOCK_STYLE.cornerRadius,
  }));

  // Scale content AABB into placed furniture footprint.
  const sx = widthMm / Math.max(1, contentW);
  const sy = depthMm / Math.max(1, contentD);
  if (Math.abs(sx - 1) > 1e-6 || Math.abs(sy - 1) > 1e-6) {
    for (const prim of prims) {
      if (prim.kind === "rect") {
        prim.x *= sx;
        prim.y *= sy;
        prim.w *= sx;
        prim.h *= sy;
      }
    }
  }

  return {
    footprint: { L: widthMm, D: depthMm, H: heightMm },
    prims,
    label: item.catalogId || "workstation-v0",
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

  const workstationBlock = workstationBlock2DFromItem(item);
  if (workstationBlock) {
    return workstationBlock;
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
 * Historical name. All furnitureBlock2D prims are authored top-left (0..L, 0..D).
 * Canvas centers via renderBlock2DCentered — never via centered prim authorship.
 * Always false (was a dead lie when modular returned true with top-left prims).
 */
export function furnitureBlockUsesCenteredPath(_item: Open3dFurnitureItem): boolean {
  return false;
}
