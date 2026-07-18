/**
 * K1: single Maker.js pen for parametric linear desk.
 * Fields → LinearDeskMakerRecipe → compileMakerRecipeToPaths → multipath SVG.
 * Form / CLI / publish must call only this drawer (not template multipath).
 */

import { compileMakerRecipeToPaths } from "../makerJsToPath";
import type { LinearDeskMakerRecipe } from "../makerJsRecipes";
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
  readonly viewBox: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly parts: readonly LinearDeskPart[];
  readonly fields: LinearDeskFields;
};

/** Image-safe hex (sample-desk language). No currentColor / CSS vars. */
const STROKE = "#2c2a28";
const FILL_TOP = "#4a4642";
const FILL_PED = "#6b6660";
const FILL_MODESTY = "#5c5854";

function strokeForSize(widthMm: number, depthMm: number): number {
  const m = Math.min(widthMm, depthMm);
  return Math.round(Math.min(28, Math.max(10, m * 0.015)));
}

function roleForPartId(id: string): LinearDeskPartRole {
  if (id === "desk-top") return "top";
  if (id === "modesty") return "modesty";
  if (id.startsWith("pedestal")) return "pedestal";
  if (id === "frame") return "frame";
  return "top";
}

function paintForRole(
  role: LinearDeskPartRole,
  strokeW: number,
): { fill: string | "none"; stroke: string; strokeWidth: number } {
  switch (role) {
    case "frame":
      return { fill: "none", stroke: STROKE, strokeWidth: strokeW };
    case "top":
      return {
        fill: FILL_TOP,
        stroke: STROKE,
        strokeWidth: Math.max(8, strokeW * 0.6),
      };
    case "pedestal":
      return {
        fill: FILL_PED,
        stroke: STROKE,
        strokeWidth: Math.max(8, strokeW * 0.55),
      };
    case "modesty":
      return {
        fill: FILL_MODESTY,
        stroke: STROKE,
        strokeWidth: Math.max(6, strokeW * 0.45),
      };
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

/** Map Zod fields → Maker recipe (schema is authority for insets / modesty). */
export function fieldsToLinearDeskMakerRecipe(
  fields: LinearDeskFields,
): LinearDeskMakerRecipe {
  return {
    recipe: "linear-desk",
    widthMm: fields.widthMm,
    depthMm: fields.depthMm,
    topThicknessMm: fields.topThicknessMm,
    pedestalWidthMm: fields.pedestalWidthMm,
    pedestalInsetMm: fields.pedestalInsetMm,
    pedestalTopGapMm: fields.pedestalTopGapMm,
    pedestalBackInsetMm: fields.pedestalBackInsetMm,
    pedestals: fields.pedestalCount === 2,
    modesty: fields.modesty === true && fields.pedestalCount === 2,
  };
}

/**
 * One API: LinearDeskFields → Maker multipath parts (desk-top, pedestals, modesty).
 */
export function drawLinearDesk(fields: LinearDeskFields): LinearDeskDrawResult {
  const recipe = fieldsToLinearDeskMakerRecipe(fields);
  const { parts: makerParts, viewBox } = compileMakerRecipeToPaths(recipe);
  const strokeW = strokeForSize(fields.widthMm, fields.depthMm);

  const parts: LinearDeskPart[] = makerParts.map((part) => {
    const role = roleForPartId(part.id);
    const paint = paintForRole(role, strokeW);
    return {
      id: part.id,
      role,
      dPath: part.dPath,
      fill: paint.fill,
      stroke: paint.stroke,
      strokeWidth: paint.strokeWidth,
    };
  });

  return { viewBox, parts, fields };
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
  return linearDeskPartsToSvg(drawLinearDesk(fields));
}
