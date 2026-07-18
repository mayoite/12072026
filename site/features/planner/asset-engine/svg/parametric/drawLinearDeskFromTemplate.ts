/**
 * Plan+A hybrid: sample-desk-1 visual language + field-driven mm layout.
 * Pen: explicit rect paths (Maker-compatible multipath). Not freehand.
 */

import type { LinearDeskFields } from "./linearDeskFields";

export type LinearDeskPartRole = "frame" | "top" | "pedestal" | "modesty";

export type LinearDeskPart = {
  readonly id: string;
  readonly role: LinearDeskPartRole;
  readonly dPath: string;
  readonly fill: string | "none";
  readonly stroke: string;
  readonly strokeWidth: number;
};

export type LinearDeskDrawResult = {
  readonly viewBox: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
  readonly parts: readonly LinearDeskPart[];
  readonly fields: LinearDeskFields;
};

const STROKE = "#2c2a28";
const FILL_TOP = "#4a4642";
const FILL_PED = "#6b6660";
const FILL_MODESTY = "#5c5854";

function rectPath(x: number, y: number, w: number, h: number): string {
  const x0 = roundMm(x);
  const y0 = roundMm(y);
  const x1 = roundMm(x + w);
  const y1 = roundMm(y + h);
  return `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
}

function roundMm(n: number): number {
  return Math.round(n * 100) / 100;
}

function strokeForSize(widthMm: number, depthMm: number): number {
  const m = Math.min(widthMm, depthMm);
  return Math.round(Math.min(28, Math.max(10, m * 0.015)));
}

/**
 * sample-desk-1 structure fitted to fields:
 * - outer frame (stroke only)
 * - worksurface band near top
 * - dual pedestals (optional)
 * - optional modesty between pedestals
 */
export function drawLinearDeskFromTemplate(fields: LinearDeskFields): LinearDeskDrawResult {
  const w = fields.widthMm;
  const d = fields.depthMm;
  const strokeW = strokeForSize(w, d);
  const frameInset = Math.max(strokeW, Math.min(40, w * 0.02));

  const topH = Math.min(fields.topThicknessMm, d * 0.35);
  const topY = frameInset;
  const topX = frameInset;
  const topW = w - frameInset * 2;

  const parts: LinearDeskPart[] = [
    {
      id: "frame",
      role: "frame",
      dPath: rectPath(0, 0, w, d),
      fill: "none",
      stroke: STROKE,
      strokeWidth: strokeW,
    },
    {
      id: "desk-top",
      role: "top",
      dPath: rectPath(topX, topY, topW, topH),
      fill: FILL_TOP,
      stroke: STROKE,
      strokeWidth: Math.max(8, strokeW * 0.6),
    },
  ];

  if (fields.pedestalCount === 2) {
    const pedW = Math.min(
      fields.pedestalWidthMm,
      Math.max(40, (w - fields.pedestalInsetMm * 2 - 40) / 2),
    );
    const pedY = topY + topH + fields.pedestalTopGapMm;
    const pedH = Math.max(
      40,
      d - pedY - fields.pedestalBackInsetMm - frameInset * 0.25,
    );
    const leftX = Math.min(fields.pedestalInsetMm, w - pedW - 40);
    const rightX = Math.max(leftX + pedW + 40, w - fields.pedestalInsetMm - pedW);

    parts.push(
      {
        id: "pedestal-l",
        role: "pedestal",
        dPath: rectPath(leftX, pedY, pedW, pedH),
        fill: FILL_PED,
        stroke: STROKE,
        strokeWidth: Math.max(8, strokeW * 0.55),
      },
      {
        id: "pedestal-r",
        role: "pedestal",
        dPath: rectPath(rightX, pedY, pedW, pedH),
        fill: FILL_PED,
        stroke: STROKE,
        strokeWidth: Math.max(8, strokeW * 0.55),
      },
    );

    if (fields.modesty) {
      const gap = rightX - (leftX + pedW);
      if (gap > 80) {
        const mx = leftX + pedW + gap * 0.15;
        const mw = gap * 0.7;
        const my = pedY + pedH * 0.15;
        const mh = pedH * 0.2;
        parts.push({
          id: "modesty",
          role: "modesty",
          dPath: rectPath(mx, my, mw, mh),
          fill: FILL_MODESTY,
          stroke: STROKE,
          strokeWidth: Math.max(6, strokeW * 0.45),
        });
      }
    }
  }

  return {
    viewBox: { x: 0, y: 0, width: w, height: d },
    parts,
    fields,
  };
}

function escXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Assemble publishable plan SVG (image-safe paints). */
export function linearDeskPartsToSvg(
  draw: LinearDeskDrawResult,
  options?: { readonly title?: string; readonly slug?: string },
): string {
  const { viewBox, parts, fields } = draw;
  const slug = options?.slug ?? fields.slug ?? "linear-desk";
  const title = options?.title ?? fields.name ?? slug;
  const vb = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
  const inner = parts
    .map((part) => {
      const fillAttr =
        part.fill === "none" ? ` fill="none"` : ` fill="${escXml(part.fill)}"`;
      return (
        `<path d="${part.dPath}"${fillAttr}` +
        ` stroke="${escXml(part.stroke)}" stroke-width="${part.strokeWidth}"` +
        ` id="${escXml(part.id)}" class="${escXml(slug)}"/>`
      );
    })
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision"` +
    ` viewBox="${vb}" width="${viewBox.width}" height="${viewBox.height}"` +
    ` data-product-type="linear-desk">` +
    `<title>${escXml(title)}</title>` +
    `<g>${inner}</g></svg>`
  );
}

export function renderLinearDeskSvg(fields: LinearDeskFields): string {
  return linearDeskPartsToSvg(drawLinearDeskFromTemplate(fields));
}
