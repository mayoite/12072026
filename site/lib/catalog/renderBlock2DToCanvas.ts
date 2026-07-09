/**
 * Draw procedural Block2D primitives onto Canvas 2D.
 * Same prim vocabulary as blockToSvg — inventory preview and plan canvas share one geometry.
 * No external assets; colors resolved via caller (theme / CSS) or createBlockColorResolver.
 */

import type { Block2D, Prim } from "./blocks2d";
import {
  createBlockColorResolver,
  type BlockColorResolver,
} from "./resolveBlockColors";

export interface RenderBlock2DToCanvasOptions {
  /** Color resolver; default uses TOKEN_COLORS map (may leave theme vars unresolved). */
  resolve?: BlockColorResolver;
  /**
   * When true, prim coordinates are drawn as-is (mm).
   * Caller must transform the context (translate/rotate/scale) first.
   */
  skipShadow?: boolean;
}

/**
 * Resolve CSS color tokens for canvas (browser only).
 * Uses a probe element so `var(--token)` chains resolve to computed rgb().
 */
export function createCanvasBlockColorResolver(
  host: Element,
): BlockColorResolver {
  const base = createBlockColorResolver();
  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:absolute;left:-9999px;top:0;width:0;height:0;pointer-events:none;visibility:hidden";
  host.appendChild(probe);

  const resolve = (token: string | undefined): string => {
    if (!token || token === "none") return "transparent";
    if (token === "currentColor") return getComputedStyle(host).color || "#333";
    if (/^#([0-9a-f]{3,8})$/i.test(token)) return token;
    if (/^rgba?\(/i.test(token)) return token;

    const fromMap = base(token);
    if (/^#|^rgba?\(/i.test(fromMap)) return fromMap;

    try {
      probe.style.color = token.startsWith("var(") || token.startsWith("--")
        ? token.startsWith("--")
          ? `var(${token})`
          : token
        : fromMap.startsWith("var(") || fromMap.startsWith("--")
          ? fromMap.startsWith("--")
            ? `var(${fromMap})`
            : fromMap
          : fromMap;
      const computed = getComputedStyle(probe).color;
      if (computed && computed !== "rgba(0, 0, 0, 0)" && computed !== "transparent") {
        return computed;
      }
    } catch {
      /* fall through */
    }
    return fromMap === "none" ? "transparent" : fromMap;
  };

  /** Detach probe when host unmounts — call from cleanup if holding long-lived resolver. */
  (resolve as BlockColorResolver & { dispose?: () => void }).dispose = () => {
    probe.remove();
  };

  return resolve;
}

function applyPrimTransform(
  ctx: CanvasRenderingContext2D,
  prim: Prim,
): void {
  if (prim.rotation) {
    const ox = prim.offsetX ?? 0;
    const oy = prim.offsetY ?? 0;
    ctx.translate(ox, oy);
    ctx.rotate((prim.rotation * Math.PI) / 180);
    ctx.translate(-ox, -oy);
  }
}

function applyShadow(
  ctx: CanvasRenderingContext2D,
  prim: Prim,
  resolve: BlockColorResolver,
  skipShadow: boolean,
): void {
  if (skipShadow || !prim.shadowColor) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    return;
  }
  const c = resolve(prim.shadowColor);
  ctx.shadowColor = c === "none" || c === "transparent" ? "transparent" : c;
  ctx.shadowBlur = prim.shadowBlur ?? 0;
  ctx.shadowOffsetY = prim.shadowOffsetY ?? 0;
  ctx.shadowOffsetX = 0;
}

function fillStyleForPrim(
  ctx: CanvasRenderingContext2D,
  prim: Prim,
  resolve: BlockColorResolver,
): string | CanvasGradient {
  const stops = prim.fillLinearGradientColorStops;
  if (
    stops &&
    stops.length >= 4 &&
    prim.fillLinearGradientStartPoint &&
    prim.fillLinearGradientEndPoint
  ) {
    const g = ctx.createLinearGradient(
      prim.fillLinearGradientStartPoint.x,
      prim.fillLinearGradientStartPoint.y,
      prim.fillLinearGradientEndPoint.x,
      prim.fillLinearGradientEndPoint.y,
    );
    for (let i = 0; i + 1 < stops.length; i += 2) {
      const t = Number(stops[i]);
      const col = resolve(String(stops[i + 1]));
      if (Number.isFinite(t) && col !== "none") g.addColorStop(t, col);
    }
    return g;
  }
  const fill = resolve(prim.fill);
  return fill === "none" ? "transparent" : fill;
}

function drawPrim(
  ctx: CanvasRenderingContext2D,
  prim: Prim,
  resolve: BlockColorResolver,
  skipShadow: boolean,
): void {
  ctx.save();
  applyPrimTransform(ctx, prim);
  applyShadow(ctx, prim, resolve, skipShadow);

  if (prim.kind === "rect") {
    const fill = fillStyleForPrim(ctx, prim, resolve);
    const r = prim.radius ?? 0;
    ctx.beginPath();
    if (r > 0 && typeof ctx.roundRect === "function") {
      ctx.roundRect(prim.x, prim.y, prim.w, prim.h, r);
    } else {
      ctx.rect(prim.x, prim.y, prim.w, prim.h);
    }
    if (fill !== "transparent") {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (prim.stroke && prim.strokeWidth) {
      ctx.strokeStyle = resolve(prim.stroke);
      ctx.lineWidth = prim.strokeWidth;
      ctx.stroke();
    }
  } else if (prim.kind === "circle") {
    ctx.beginPath();
    ctx.arc(prim.cx, prim.cy, prim.r, 0, Math.PI * 2);
    const fill = fillStyleForPrim(ctx, prim, resolve);
    if (fill !== "transparent") {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (prim.stroke && prim.strokeWidth) {
      ctx.strokeStyle = resolve(prim.stroke);
      ctx.lineWidth = prim.strokeWidth;
      if (prim.dash?.length) ctx.setLineDash([...prim.dash]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  } else if (prim.kind === "line") {
    ctx.beginPath();
    for (let i = 0; i + 1 < prim.points.length; i += 2) {
      const x = prim.points[i];
      const y = prim.points[i + 1];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = resolve(prim.stroke);
    ctx.lineWidth = prim.strokeWidth;
    ctx.lineCap = prim.lineCap ?? "round";
    if (prim.dash?.length) ctx.setLineDash([...prim.dash]);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (prim.kind === "path") {
    const path = new Path2D(prim.data);
    const fill = resolve(prim.fill);
    if (fill && fill !== "none" && fill !== "transparent") {
      ctx.fillStyle = fillStyleForPrim(ctx, prim, resolve);
      ctx.fill(path);
    }
    if (prim.stroke && prim.strokeWidth) {
      ctx.strokeStyle = resolve(prim.stroke);
      ctx.lineWidth = prim.strokeWidth;
      ctx.lineCap = prim.lineCap ?? "round";
      ctx.stroke(path);
    }
  } else if (prim.kind === "arc") {
    ctx.beginPath();
    ctx.arc(prim.cx, prim.cy, prim.r, prim.startAngle, prim.endAngle);
    const fill = resolve(prim.fill);
    if (fill && fill !== "none" && fill !== "transparent") {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    ctx.strokeStyle = resolve(prim.stroke);
    ctx.lineWidth = prim.strokeWidth;
    ctx.lineCap = prim.lineCap ?? "round";
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw all prims of a block in **mm**, origin at block top-left (same as blockToSvg).
 * Caller should set transform so that (0,0) maps to the desired place (e.g. center of furniture).
 */
export function renderBlock2DToCanvas(
  ctx: CanvasRenderingContext2D,
  block: Block2D,
  options: RenderBlock2DToCanvasOptions = {},
): void {
  if (!block.prims.length) return;
  const resolve = options.resolve ?? createBlockColorResolver();
  const skipShadow = options.skipShadow ?? false;
  for (const prim of block.prims) {
    drawPrim(ctx, prim, resolve, skipShadow);
  }
}

/**
 * Convenience: draw block centered on (0,0) in current context space (mm).
 * Matches plan furniture placement (position = center).
 */
export function renderBlock2DCentered(
  ctx: CanvasRenderingContext2D,
  block: Block2D,
  options: RenderBlock2DToCanvasOptions = {},
): void {
  ctx.save();
  ctx.translate(-block.footprint.L / 2, -block.footprint.D / 2);
  renderBlock2DToCanvas(ctx, block, options);
  ctx.restore();
}
