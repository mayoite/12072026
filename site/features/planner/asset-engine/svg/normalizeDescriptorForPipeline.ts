/**
 * S1 — Normalize BlockDescriptor (admin/disk) into pipelineCore IR.
 *
 * Live publish uses pipelineCore which expects:
 * - blocks[].height (plan Y extent)
 * - variant ∈ union | intersection | difference | xor
 * - optional `maker` recipe → Maker.js path (S2) before S3 sanitize/optimize
 *
 * Admin BlockDescriptor uses:
 * - blocks[].depth (often)
 * - variant fixed | configurable | parametric
 *
 * Without this stage, admin descriptors silently mismatch fixture geometry.
 */

import type { MakerRecipe } from "./makerJsRecipes";

export type PipelineBooleanVariant =
  | "union"
  | "intersection"
  | "difference"
  | "xor";

export interface PipelineBlockRect {
  x: number;
  y: number;
  width: number;
  height: number;
  id?: string;
}

export interface PipelineCompileDescriptor {
  slug: string;
  name?: string;
  description?: string;
  variant: PipelineBooleanVariant;
  viewBox: { x: number; y: number; width: number; height: number };
  blocks: PipelineBlockRect[];
  themeTokens?: Record<string, string | undefined>;
  /** When set, S2 uses Maker.js path compile instead of polygon-clipping blocks. */
  makerRecipe?: MakerRecipe;
}

const BOOLEAN_VARIANTS = new Set<PipelineBooleanVariant>([
  "union",
  "intersection",
  "difference",
  "xor",
]);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function finiteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function normalizeBlock(raw: unknown): PipelineBlockRect | null {
  const o = asRecord(raw);
  if (!o) return null;
  const x = finiteNumber(o.x);
  const y = finiteNumber(o.y);
  const width = finiteNumber(o.width);
  // Admin uses depth; fixtures/pipeline use height.
  const height = finiteNumber(o.height) ?? finiteNumber(o.depth);
  if (x === null || y === null || width === null || height === null) return null;
  if (width <= 0 || height <= 0) return null;
  const id = typeof o.id === "string" ? o.id : undefined;
  return { x, y, width, height, id };
}

function normalizeBlockFromPart(raw: unknown): PipelineBlockRect | null {
  const o = asRecord(raw);
  if (!o) return null;
  if (o.visible === false) return null;
  const id = typeof o.id === "string" ? o.id : undefined;
  const kind = typeof o.kind === "string" ? o.kind : "rect";

  if (kind === "circle") {
    const cx = finiteNumber(o.cx);
    const cy = finiteNumber(o.cy);
    const r = finiteNumber(o.r);
    if (cx === null || cy === null || r === null || r <= 0) return null;
    return { x: cx - r, y: cy - r, width: r * 2, height: r * 2, id };
  }

  if (kind !== "rect") return null;
  const x = finiteNumber(o.x);
  const y = finiteNumber(o.y);
  const width = finiteNumber(o.width);
  const height = finiteNumber(o.height);
  if (x === null || y === null || width === null || height === null) return null;
  if (width <= 0 || height <= 0) return null;
  return { x, y, width, height, id };
}

function synthesizeBlocksFromGeometry(
  geometry: Record<string, unknown> | null,
  viewBox: { width: number; height: number },
): PipelineBlockRect[] {
  if (!geometry) {
    return [{ x: 0, y: 0, width: viewBox.width, height: viewBox.height }];
  }
  const w =
    finiteNumber(geometry.widthMm) ??
    finiteNumber(geometry.width) ??
    viewBox.width;
  const d =
    finiteNumber(geometry.depthMm) ??
    finiteNumber(geometry.depth) ??
    finiteNumber(geometry.heightMm) ??
    viewBox.height;
  return [{ x: 0, y: 0, width: Math.max(1, w), height: Math.max(1, d) }];
}

function parseMakerRecipe(raw: unknown): MakerRecipe | undefined {
  const o = asRecord(raw);
  if (!o) return undefined;
  const recipe = typeof o.recipe === "string" ? o.recipe.trim() : "";
  if (recipe === "linear-desk") {
    const widthMm = finiteNumber(o.widthMm);
    const depthMm = finiteNumber(o.depthMm);
    if (widthMm === null || depthMm === null) return undefined;
    const topThicknessMm = finiteNumber(o.topThicknessMm) ?? undefined;
    return {
      recipe: "linear-desk",
      widthMm,
      depthMm,
      ...(topThicknessMm !== undefined ? { topThicknessMm } : {}),
    };
  }
  if (recipe === "l-desk") {
    const widthMm = finiteNumber(o.widthMm);
    const depthMm = finiteNumber(o.depthMm);
    const returnWidthMm = finiteNumber(o.returnWidthMm);
    if (widthMm === null || depthMm === null || returnWidthMm === null) return undefined;
    return { recipe: "l-desk", widthMm, depthMm, returnWidthMm };
  }
  return undefined;
}

/**
 * Map product variant labels onto boolean ops for the boolean compiler.
 * Multi-block furniture seeds (tabletop + cutouts) → difference.
 * Single block / unknown → union.
 */
export function resolveBooleanVariant(
  rawVariant: unknown,
  blockCount: number,
): PipelineBooleanVariant {
  if (typeof rawVariant === "string" && BOOLEAN_VARIANTS.has(rawVariant as PipelineBooleanVariant)) {
    return rawVariant as PipelineBooleanVariant;
  }
  if (blockCount >= 2) return "difference";
  return "union";
}

/**
 * Normalize any descriptor-like object into pipelineCore-compatible IR.
 * Throws if slug or viewBox cannot be recovered.
 */
export function normalizeDescriptorForPipeline(
  raw: unknown,
): PipelineCompileDescriptor {
  const root = asRecord(raw);
  if (!root) {
    throw new Error("normalizeDescriptorForPipeline: descriptor must be an object");
  }

  const slug = typeof root.slug === "string" ? root.slug.trim() : "";
  if (!slug) {
    throw new Error("normalizeDescriptorForPipeline: slug is required");
  }

  const vbRaw = asRecord(root.viewBox);
  const geometry = asRecord(root.geometry);
  const dimensions = asRecord(root.dimensions);

  const vbWidth =
    finiteNumber(vbRaw?.width) ??
    finiteNumber(geometry?.widthMm) ??
    finiteNumber(dimensions?.widthMm) ??
    100;
  const vbHeight =
    finiteNumber(vbRaw?.height) ??
    finiteNumber(geometry?.depthMm) ??
    finiteNumber(dimensions?.depthMm) ??
    finiteNumber(geometry?.heightMm) ??
    100;
  const viewBox = {
    x: finiteNumber(vbRaw?.x) ?? 0,
    y: finiteNumber(vbRaw?.y) ?? 0,
    width: Math.max(1, vbWidth),
    height: Math.max(1, vbHeight),
  };

  const rawBlocks = Array.isArray(root.blocks) ? root.blocks : [];
  const rawParts = Array.isArray(root.parts) ? root.parts : [];
  const blocks = rawBlocks
    .map(normalizeBlock)
    .filter((b): b is PipelineBlockRect => b !== null);
  const partBlocks = rawParts
    .map(normalizeBlockFromPart)
    .filter((b): b is PipelineBlockRect => b !== null);

  const finalBlocks =
    partBlocks.length > 0
      ? partBlocks
      : blocks.length > 0
      ? blocks
      : synthesizeBlocksFromGeometry(geometry ?? dimensions, viewBox);

  const variant = resolveBooleanVariant(root.variant, finalBlocks.length);

  const themeTokens = asRecord(root.themeTokens) as
    | Record<string, string | undefined>
    | undefined;

  const makerRecipe = parseMakerRecipe(root.maker);

  return {
    slug,
    name: typeof root.name === "string" ? root.name : undefined,
    description:
      typeof root.description === "string" ? root.description : undefined,
    variant,
    viewBox,
    blocks: finalBlocks,
    themeTokens,
    makerRecipe,
  };
}
