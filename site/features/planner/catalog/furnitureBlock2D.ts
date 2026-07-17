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
import { resolveCatalogItemBlock2D } from "@/features/planner/catalog-api/catalogBlockBridge";
import type { CatalogItem } from "@/features/planner/catalog-api/catalogTypes";
import type { PlannerFurnitureItem } from "../model/types";
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
 * Top-left mm origin (0..L, 0..D). Canvas centers via renderBlock2DCentered.
 *
 * HARD RULE: detail is **fraction of footprint**, not absolute mm insets of 6–16.
 * At plan zoom (~0.1 scale) a 600×580 cabinet is ~60px — fixed 16mm inset (~1.6px)
 * and 12mm handles collapse to an empty cream tile. Fractions keep multiprim legible.
 *
 * Colors are literal hex (CSS vars often fail on Canvas2D / Fabric theme resolver → blob).
 * Body + door face use **distinct fills** so eyes see structure, not one cream rectangle.
 */
function modularCabinetBlock(item: PlannerFurnitureItem): Block2D {
  const opts = item.modularOptions;
  const w = Math.max(1, opts?.widthMm ?? item.width ?? DEFAULT_MM);
  const d = Math.max(1, opts?.depthMm ?? item.depth ?? DEFAULT_MM);
  const h = opts?.heightMm ?? item.height ?? 900;
  const doorStyle = opts?.doorStyle ?? "slab";
  const material = (opts?.material ?? "white").toLowerCase();

  // Fractions of the smaller side so symbols read when footprint is ~40–80 screen px.
  const m = Math.min(w, d);
  const inset = Math.max(m * 0.1, m * 0.12); // ~10–12% carcass wall
  // Door band is a filled strip (not a hairline) so structure survives plan zoom.
  const frontBand = Math.max(m * 0.22, d * 0.2);
  const frontY = d - frontBand;
  // Warm body / cooler door / dark hardware — three readable colors at ~60px.
  const bodyFill = material === "oak" ? "#d9b88a" : "#e8d9c0";
  const doorFill = material === "oak" ? "#c4a06e" : "#c9b89a";
  const stroke = "#1a1814";
  const detailStroke = "#3a3228";
  const handleFill = "#4a4034";
  // Thick relative strokes; Fabric + canvas floor still to ≥1.5 screen px.
  const outerSw = Math.max(m * 0.045, 10);
  const detailSw = Math.max(m * 0.035, 8);
  const frontSw = Math.max(m * 0.05, 12);

  const innerW = Math.max(1, w - inset * 2);
  const innerH = Math.max(1, d - inset * 2);

  const prims: Prim[] = [
    {
      kind: "rect",
      x: 0,
      y: 0,
      w,
      h: d,
      fill: bodyFill,
      stroke,
      strokeWidth: outerSw,
      radius: Math.min(m * 0.04, 12),
    },
    // Inner carcass void (stroke only) — readable wall thickness.
    {
      kind: "rect",
      x: inset,
      y: inset,
      w: innerW,
      h: innerH,
      fill: "none",
      stroke: detailStroke,
      strokeWidth: detailSw,
      radius: Math.min(m * 0.02, 6),
    },
    // Filled door face band at front — primary multiprim cue (not a single cream tile).
    {
      kind: "rect",
      x: inset,
      y: frontY,
      w: innerW,
      h: Math.max(1, frontBand - inset * 0.25),
      fill: doorFill,
      stroke: detailStroke,
      strokeWidth: frontSw * 0.65,
      radius: Math.min(m * 0.015, 4),
    },
    // Front hinge edge (thick)
    {
      kind: "line",
      points: [inset, frontY, w - inset, frontY],
      stroke: detailStroke,
      strokeWidth: frontSw,
    },
    // Back edge
    {
      kind: "line",
      points: [inset, inset, w - inset, inset],
      stroke: detailStroke,
      strokeWidth: detailSw,
    },
  ];

  if (doorStyle === "pair") {
    prims.push({
      kind: "line",
      points: [w * 0.5, frontY, w * 0.5, d - inset * 0.4],
      stroke: detailStroke,
      strokeWidth: detailSw,
    });
    const handleW = Math.max(w * 0.08, m * 0.07);
    const handleH = Math.max(d * 0.1, m * 0.08);
    const handleY = frontY + frontBand * 0.35 - handleH / 2;
    prims.push({
      kind: "rect",
      x: w * 0.25 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: handleFill,
      stroke,
      strokeWidth: Math.max(m * 0.01, 2),
      radius: 2,
    });
    prims.push({
      kind: "rect",
      x: w * 0.75 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: handleFill,
      stroke,
      strokeWidth: Math.max(m * 0.01, 2),
      radius: 2,
    });
  } else if (doorStyle === "slab") {
    // Single door: oversized handle + mid stile so it is not an empty tile
    const handleW = Math.max(w * 0.1, m * 0.09);
    const handleH = Math.max(d * 0.12, m * 0.1);
    prims.push({
      kind: "rect",
      x: w - inset - handleW - m * 0.05,
      y: frontY + frontBand * 0.28 - handleH / 2,
      w: handleW,
      h: handleH,
      fill: handleFill,
      stroke,
      strokeWidth: Math.max(m * 0.01, 2),
      radius: 2,
    });
    prims.push({
      kind: "line",
      points: [w * 0.5, inset + m * 0.04, w * 0.5, frontY - m * 0.02],
      stroke: detailStroke,
      strokeWidth: detailSw * 0.85,
      dash: [m * 0.06, m * 0.04],
    });
  } else {
    // Open shelves — three filled shelf strips (not hairlines only)
    for (const yFrac of [0.35, 0.55, 0.75] as const) {
      const sy = d * yFrac;
      prims.push({
        kind: "rect",
        x: inset,
        y: sy - m * 0.02,
        w: innerW,
        h: Math.max(m * 0.035, 4),
        fill: doorFill,
        stroke: detailStroke,
        strokeWidth: detailSw * 0.6,
      });
    }
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
export function workstationBlock2DFromItem(item: PlannerFurnitureItem): Block2D | null {
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
export function plannerLikeBuddyCatalogItem(input: {
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
  item: PlannerFurnitureItem,
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
    const buddyLike = plannerLikeBuddyCatalogItem({
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
export function furnitureBlockUsesCenteredPath(_item: PlannerFurnitureItem): boolean {
  return false;
}
