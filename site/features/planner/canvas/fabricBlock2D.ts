import {
  Circle,
  FabricImage,
  Group,
  Line,
  Path,
  Polyline,
  Rect,
  type FabricObject,
} from "fabric";

import { furnitureBlock2DFromItem } from "@/features/planner/catalog/furnitureBlock2D";
import {
  getSvgPlanImage,
  isPublishedSvgPlanUrl,
} from "@/features/planner/catalog/svg/svgPlanSymbolCache";
import type { PlannerFurnitureItem } from "@/features/planner/model/types";
import type { Prim } from "@/lib/catalog/blocks2d";

import type { FurnitureFabricPose } from "./furnitureFabricMapper";

export const PLAN_PAINT_MODE_PROP = "planPaintMode" as const;
export type PlanPaintMode = "svg" | "block2d";

export type FabricBlockOptions = {
  readonly interactive: boolean;
  readonly resolveColor: (token: string, fallback: string) => string;
};

/**
 * Resolve prim paint for Fabric.
 * Literal hex/rgb must pass through — resolveStageColor historically treated
 * every token as a CSS variable and fell back, killing multiprim contrast.
 */
function paint(
  token: string | undefined,
  fallback: string,
  resolveColor: FabricBlockOptions["resolveColor"],
): string {
  if (!token || token === "none") return "transparent";
  if (token === "transparent") return "transparent";
  // Keep authored literal colors (cabinet multiprim uses hex on purpose).
  if (/^#([0-9a-f]{3,8})$/i.test(token) || /^(rgb|hsl)a?\(/i.test(token)) {
    return token;
  }
  return resolveColor(token, fallback);
}

/**
 * Stroke in screen px. Prim strokeWidth is authored in mm; multiply by plan scale.
 * Floor at 1.5px so door lines/handles survive default zoom (~0.1 → ~60px cabinet).
 */
function strokeWidth(value: number | undefined, scale: number): number {
  return Math.max(1.5, (value ?? 1) * scale);
}

/** Exported for unit tests — literal hex bypass of theme resolver. */
export function resolveFabricPrimPaint(
  token: string | undefined,
  fallback: string,
  resolveColor: FabricBlockOptions["resolveColor"] = (_t, fb) => fb,
): string {
  return paint(token, fallback, resolveColor);
}

function pathFromArc(prim: Extract<Prim, { kind: "arc" }>): string {
  const start = (prim.startAngle * Math.PI) / 180;
  const end = (prim.endAngle * Math.PI) / 180;
  const startX = prim.cx + Math.cos(start) * prim.r;
  const startY = prim.cy + Math.sin(start) * prim.r;
  const endX = prim.cx + Math.cos(end) * prim.r;
  const endY = prim.cy + Math.sin(end) * prim.r;
  const delta = Math.abs(prim.endAngle - prim.startAngle) % 360;
  const largeArc = delta > 180 ? 1 : 0;
  return `M ${startX} ${startY} A ${prim.r} ${prim.r} 0 ${largeArc} 1 ${endX} ${endY}`;
}

function fabricPrim(
  prim: Prim,
  scale: number,
  resolveColor: FabricBlockOptions["resolveColor"],
): FabricObject {
  const common = {
    selectable: false,
    evented: false,
    objectCaching: false,
    opacity: 1,
  };

  switch (prim.kind) {
    case "rect":
      return new Rect({
        ...common,
        left: prim.x * scale,
        top: prim.y * scale,
        width: prim.w * scale,
        height: prim.h * scale,
        rx: (prim.radius ?? 0) * scale,
        ry: (prim.radius ?? 0) * scale,
        fill: paint(prim.fill, "#e2e8f0", resolveColor),
        stroke: paint(prim.stroke, "#334155", resolveColor),
        strokeWidth: strokeWidth(prim.strokeWidth, scale),
        strokeUniform: true,
      });
    case "circle":
      return new Circle({
        ...common,
        left: (prim.cx - prim.r) * scale,
        top: (prim.cy - prim.r) * scale,
        radius: prim.r * scale,
        fill: paint(prim.fill, "#e2e8f0", resolveColor),
        stroke: paint(prim.stroke, "#334155", resolveColor),
        strokeWidth: strokeWidth(prim.strokeWidth, scale),
        strokeUniform: true,
        strokeDashArray: prim.dash
          ? [...prim.dash].map((dash) => Math.max(1.5, dash * scale))
          : undefined,
      });
    case "line":
      {
        const options = {
          ...common,
          stroke: paint(prim.stroke, "#334155", resolveColor),
          strokeWidth: strokeWidth(prim.strokeWidth, scale),
          strokeUniform: true,
          strokeLineCap: prim.lineCap ?? "round",
          strokeDashArray: prim.dash
            ? [...prim.dash].map((dash) => Math.max(1.5, dash * scale))
            : undefined,
        };
        if (prim.points.length === 4) {
          const [x1, y1, x2, y2] = prim.points;
          return new Line([x1 * scale, y1 * scale, x2 * scale, y2 * scale], options);
        }
        const points = [] as Array<{ x: number; y: number }>;
        for (let index = 0; index + 1 < prim.points.length; index += 2) {
          points.push({
            x: prim.points[index] * scale,
            y: prim.points[index + 1] * scale,
          });
        }
        return new Polyline(points, options);
      }
    case "arc":
      return new Path(pathFromArc(prim), {
        ...common,
        left: 0,
        top: 0,
        scaleX: scale,
        scaleY: scale,
        fill: paint(prim.fill, "transparent", resolveColor),
        stroke: paint(prim.stroke, "#334155", resolveColor),
        strokeWidth: strokeWidth(prim.strokeWidth, 1),
        strokeUniform: true,
        strokeLineCap: prim.lineCap ?? "round",
      });
    case "path":
      return new Path(prim.data, {
        ...common,
        left: 0,
        top: 0,
        scaleX: scale,
        scaleY: scale,
        fill: paint(prim.fill, "transparent", resolveColor),
        stroke: paint(prim.stroke, "#334155", resolveColor),
        strokeWidth: strokeWidth(prim.strokeWidth, 1),
        strokeUniform: true,
        strokeLineCap: prim.lineCap ?? "round",
      });
  }
}

export function furniturePlanSvgUrl(item: PlannerFurnitureItem): string | null {
  // Prefer stamped preview; fall back to disk catalog slug path for older placements.
  const direct = item.previewImageUrl;
  if (isPublishedSvgPlanUrl(direct)) return direct ?? null;
  const slug = (item.sourceSlug || item.catalogId || "").trim();
  if (slug && /^[a-z0-9][a-z0-9._-]{0,120}$/i.test(slug)) {
    const candidate = `/svg-catalog/${slug}.svg`;
    if (isPublishedSvgPlanUrl(candidate)) return candidate;
  }
  return null;
}

function writePlanPaintMode(target: FabricObject, mode: PlanPaintMode): void {
  (target as FabricObject & { [PLAN_PAINT_MODE_PROP]?: PlanPaintMode })[
    PLAN_PAINT_MODE_PROP
  ] = mode;
}

function createFabricSvgSymbol(
  img: HTMLImageElement,
  pose: FurnitureFabricPose,
  options: FabricBlockOptions,
): FabricImage {
  const naturalW = Math.max(1, img.naturalWidth || img.width || 1);
  const naturalH = Math.max(1, img.naturalHeight || img.height || 1);
  const fabricImg = new FabricImage(img, {
    left: pose.left,
    top: pose.top,
    angle: pose.angle,
    originX: "center",
    originY: "center",
    scaleX: pose.width / naturalW,
    scaleY: pose.height / naturalH,
    selectable: options.interactive && !pose.locked,
    evented: options.interactive && !pose.locked,
    hasControls: options.interactive && !pose.locked,
    hasBorders: options.interactive && !pose.locked,
    lockScalingX: true,
    lockScalingY: true,
    lockSkewingX: true,
    lockSkewingY: true,
    objectCaching: false,
  });
  writePlanPaintMode(fabricImg, "svg");
  return fabricImg;
}

/**
 * Primary plan paint: published `/svg-catalog/*.svg` when loaded; Block2D while loading or on miss.
 */
export function createFabricFurnitureSymbol(
  item: PlannerFurnitureItem,
  pose: FurnitureFabricPose,
  options: FabricBlockOptions,
  onSvgLoaded?: () => void,
): Group | FabricImage {
  const url = furniturePlanSvgUrl(item);
  if (url) {
    const img = getSvgPlanImage(url, onSvgLoaded);
    if (img) {
      return createFabricSvgSymbol(img, pose, options);
    }
  }
  const block = createFabricFurnitureBlock(item, pose, options);
  writePlanPaintMode(block, "block2d");
  return block;
}

/**
 * Render the canonical Block2D primitives as one movable Fabric object.
 * The document remains authoritative; Fabric JSON is never persisted.
 */
export function createFabricFurnitureBlock(
  item: PlannerFurnitureItem,
  pose: FurnitureFabricPose,
  options: FabricBlockOptions,
): Group {
  const block = furnitureBlock2DFromItem(item);
  const objects = block.prims.map((prim) =>
    fabricPrim(prim, pose.width / Math.max(1, block.footprint.L), options.resolveColor),
  );

  return new Group(objects, {
    left: pose.left,
    top: pose.top,
    angle: pose.angle,
    originX: "center",
    originY: "center",
    selectable: options.interactive && !pose.locked,
    evented: options.interactive && !pose.locked,
    hasControls: options.interactive && !pose.locked,
    hasBorders: options.interactive && !pose.locked,
    // Entity metadata lives on the Group — never select orphan prims.
    subTargetCheck: false,
    lockScalingX: true,
    lockScalingY: true,
    lockSkewingX: true,
    lockSkewingY: true,
    objectCaching: false,
  });
}
