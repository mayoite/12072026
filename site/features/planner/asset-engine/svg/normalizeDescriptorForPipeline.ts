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

/** One imported/authored freeform path in plan space (custom furniture). */
export interface PipelinePathPart {
  readonly id: string;
  readonly dPath: string;
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
  /**
   * When set, S2 emits these freeform `d` paths directly (custom furniture from
   * SVG import or path authoring). Preferred over `blocks` when present so an
   * arbitrary outline is not reduced to its bounding rect. `path` scene parts
   * have no rect IR, so this is the only carrier that preserves their geometry.
   */
  pathParts?: PipelinePathPart[];
}

const BOOLEAN_VARIANTS = new Set<PipelineBooleanVariant>([
  "union",
  "intersection",
  "difference",
  "xor",
]);

/** Positive furniture part tokens (include plurals). Cutout tokens win over these. */
const POSITIVE_TOKENS = new Set([
  "leg",
  "legs",
  "arm",
  "arms",
  "base",
  "door",
  "drawer",
  "seat",
  "backrest",
  "tabletop",
  "top",
  "body",
  "carcass",
  "screen",
  "run",
  "pedestal",
  "modesty",
  "worksurface",
  "handle",
  "core",
  "post",
  "support",
  "panel",
  "cushion",
  "return",
  "main",
  "desk",
]);

const CUTOUT_TOKENS = new Set([
  "cutout",
  "hole",
  "void",
  "subtract",
  "knockout",
  "cut",
]);

/** Wave 1 known maker recipes — expand only with types + Zod + buildMakerModel lockstep. */
const KNOWN_RECIPES = new Set(["linear-desk", "l-desk", "desk-assembly"]);

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

/**
 * Extract a freeform `d` path from a scene part that has no rect IR.
 * `path` parts carry `d` directly; `line` parts become a two-point `d` (a line
 * has no width/height so it cannot survive as a block). rect/circle return null
 * here because they are already handled by {@link normalizeBlockFromPart}.
 */
function pathPartFromPart(raw: unknown): PipelinePathPart | null {
  const o = asRecord(raw);
  if (!o) return null;
  if (o.visible === false) return null;
  const kind = typeof o.kind === "string" ? o.kind : "rect";
  const id = typeof o.id === "string" && o.id.trim() !== "" ? o.id : undefined;

  if (kind === "path") {
    const d = typeof o.d === "string" ? o.d.trim() : "";
    if (d === "") return null;
    return { id: id ?? "path-part", dPath: d };
  }

  if (kind === "line") {
    const x1 = finiteNumber(o.x1);
    const y1 = finiteNumber(o.y1);
    const x2 = finiteNumber(o.x2);
    const y2 = finiteNumber(o.y2);
    if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
    return { id: id ?? "line-part", dPath: `M${x1} ${y1} L${x2} ${y2}` };
  }

  return null;
}

/** Persisted `importedPaths[]` entry ({ id, d }) → pipeline path part. */
function importedPathToPathPart(raw: unknown): PipelinePathPart | null {
  const o = asRecord(raw);
  if (!o) return null;
  const d = typeof o.d === "string" ? o.d.trim() : "";
  if (d === "") return null;
  const id = typeof o.id === "string" && o.id.trim() !== "" ? o.id.trim() : "imported-path";
  return { id, dPath: d };
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

function idTokens(id: string | undefined): string[] {
  if (!id) return [];
  return id.toLowerCase().split(/[-_./]+/).filter(Boolean);
}

function blockIdSuggestsCutout(id: string | undefined): boolean {
  return idTokens(id).some((t) => CUTOUT_TOKENS.has(t));
}

function blockIdSuggestsPositiveFurniture(id: string | undefined): boolean {
  if (blockIdSuggestsCutout(id)) return false;
  return idTokens(id).some((t) => POSITIVE_TOKENS.has(t));
}

/**
 * Decide whether multi-block fixed geometry looks like cutouts (difference)
 * vs positive furniture parts (union).
 *
 * If any positive furniture id is present, difference only when every small
 * block is explicitly cutout-named. Otherwise fall back to area + cutout tokens.
 */
function blocksLookLikeCutouts(blocks: readonly PipelineBlockRect[]): boolean {
  if (blocks.length < 2) return false;
  const areas = blocks.map((b) => b.width * b.height);
  const maxArea = Math.max(...areas);
  if (maxArea <= 0) return false;

  const hasPositive = blocks.some((b) => blockIdSuggestsPositiveFurniture(b.id));
  if (hasPositive) {
    const small = blocks.filter((b) => (b.width * b.height) / maxArea < 0.15);
    if (small.length === 0) return false;
    // Difference only if every small part is explicitly cutout-named
    return small.every((b) => blockIdSuggestsCutout(b.id));
  }

  if (blocks.some((b) => blockIdSuggestsCutout(b.id))) return true;
  const minArea = Math.min(...areas);
  return minArea / maxArea < 0.15;
}

/**
 * Parse optional maker block. Unknown / incomplete recipes hard-fail
 * (no silent undefined that drops maker path).
 */
function parseMakerRecipe(raw: unknown): MakerRecipe | undefined {
  const o = asRecord(raw);
  if (!o) return undefined;
  const recipe = typeof o.recipe === "string" ? o.recipe.trim() : "";
  if (!recipe) return undefined;
  if (!KNOWN_RECIPES.has(recipe)) {
    throw new Error(`Unknown maker recipe: ${recipe}`);
  }

  if (recipe === "linear-desk") {
    const widthMm = finiteNumber(o.widthMm);
    const depthMm = finiteNumber(o.depthMm);
    if (widthMm === null || depthMm === null || widthMm <= 0 || depthMm <= 0) {
      throw new Error(
        `Invalid maker recipe: linear-desk requires positive widthMm and depthMm`,
      );
    }
    const topThicknessMm = finiteNumber(o.topThicknessMm) ?? undefined;
    const pedestalWidthMm = finiteNumber(o.pedestalWidthMm) ?? undefined;
    const pedestalInsetMm = finiteNumber(o.pedestalInsetMm) ?? undefined;
    const pedestalTopGapMm = finiteNumber(o.pedestalTopGapMm) ?? undefined;
    const pedestalBackInsetMm = finiteNumber(o.pedestalBackInsetMm) ?? undefined;
    const pedestals = typeof o.pedestals === "boolean" ? o.pedestals : undefined;
    const modesty = typeof o.modesty === "boolean" ? o.modesty : undefined;
    return {
      recipe: "linear-desk",
      widthMm,
      depthMm,
      ...(topThicknessMm !== undefined && topThicknessMm > 0
        ? { topThicknessMm }
        : {}),
      ...(pedestalWidthMm !== undefined && pedestalWidthMm > 0
        ? { pedestalWidthMm }
        : {}),
      ...(pedestalInsetMm !== undefined && pedestalInsetMm >= 0
        ? { pedestalInsetMm }
        : {}),
      ...(pedestalTopGapMm !== undefined && pedestalTopGapMm >= 0
        ? { pedestalTopGapMm }
        : {}),
      ...(pedestalBackInsetMm !== undefined && pedestalBackInsetMm >= 0
        ? { pedestalBackInsetMm }
        : {}),
      ...(pedestals !== undefined ? { pedestals } : {}),
      ...(modesty !== undefined ? { modesty } : {}),
    };
  }

  if (recipe === "l-desk") {
    const widthMm = finiteNumber(o.widthMm);
    const depthMm = finiteNumber(o.depthMm);
    const returnWidthMm = finiteNumber(o.returnWidthMm);
    if (
      widthMm === null ||
      depthMm === null ||
      returnWidthMm === null ||
      widthMm <= 0 ||
      depthMm <= 0 ||
      returnWidthMm <= 0
    ) {
      throw new Error(
        `Invalid maker recipe: l-desk requires positive widthMm, depthMm, and returnWidthMm`,
      );
    }
    return { recipe: "l-desk", widthMm, depthMm, returnWidthMm };
  }

  if (recipe === "desk-assembly") {
    const layout = o.layout === "u" || o.layout === "linear" ? o.layout : null;
    const workstationCount = finiteNumber(o.workstationCount);
    const runLengthMm = finiteNumber(o.runLengthMm);
    const returnLengthMm = finiteNumber(o.returnLengthMm);
    const deskDepthMm = finiteNumber(o.deskDepthMm);
    const aisleMm = finiteNumber(o.aisleMm);
    if (
      layout === null ||
      workstationCount === null ||
      runLengthMm === null ||
      returnLengthMm === null ||
      deskDepthMm === null ||
      aisleMm === null ||
      workstationCount < 1 ||
      runLengthMm <= 0 ||
      returnLengthMm <= 0 ||
      deskDepthMm <= 0 ||
      aisleMm <= 0
    ) {
      throw new Error(
        `Invalid maker recipe: desk-assembly requires layout, workstationCount, and positive length fields`,
      );
    }
    return {
      recipe: "desk-assembly",
      layout,
      workstationCount: Math.trunc(workstationCount),
      runLengthMm,
      returnLengthMm,
      deskDepthMm,
      aisleMm,
      powerRail: o.powerRail === true,
      cableManagement: o.cableManagement === true,
      modesty: o.modesty === true,
      partitions: o.partitions === true,
    };
  }

  // KNOWN_RECIPES and branches must stay lockstep
  throw new Error(`Unknown maker recipe: ${recipe}`);
}

/**
 * Map product variant labels onto boolean ops for the boolean compiler.
 * Multi-block with cutout-scale children → difference; adjacent parts → union.
 */
export function resolveBooleanVariant(
  rawVariant: unknown,
  blocks: readonly PipelineBlockRect[],
): PipelineBooleanVariant {
  const blockCount = blocks.length;
  if (typeof rawVariant === "string" && BOOLEAN_VARIANTS.has(rawVariant as PipelineBooleanVariant)) {
    return rawVariant as PipelineBooleanVariant;
  }
  if (
    typeof rawVariant === "string" &&
    (rawVariant === "fixed" || rawVariant === "configurable" || rawVariant === "parametric")
  ) {
    if (blockCount >= 2 && blocksLookLikeCutouts(blocks)) return "difference";
    return "union";
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

  // Freeform path/line parts have no rect IR. When present they are the geometry
  // authority (custom furniture); rect/circle parts still ride along as paths so
  // a mixed scene (imported outline + a placed rect) publishes every shape.
  const rawImported = Array.isArray(root.importedPaths) ? root.importedPaths : [];
  const pathParts = [
    ...rawParts.map(pathPartFromPart),
    ...rawImported.map(importedPathToPathPart),
  ].filter((p): p is PipelinePathPart => p !== null);

  const finalBlocks =
    partBlocks.length > 0
      ? partBlocks
      : blocks.length > 0
        ? blocks
        : synthesizeBlocksFromGeometry(geometry ?? dimensions, viewBox);

  const variant = resolveBooleanVariant(root.variant, finalBlocks);

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
    ...(pathParts.length > 0 ? { pathParts } : {}),
  };
}
