/**
 * S1 — Normalize BlockDescriptor (admin/disk) into pipelineCore IR.
 *
 * Live publish uses pipelineCore which expects:
 * - blocks[].height (plan Y extent)
 * - variant ∈ union | intersection | difference | xor
 *
 * Admin BlockDescriptor uses:
 * - blocks[].depth (often)
 * - variant fixed | configurable | parametric
 *
 * Without this stage, admin descriptors silently mismatch fixture geometry.
 */

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
  const blocks = rawBlocks
    .map(normalizeBlock)
    .filter((b): b is PipelineBlockRect => b !== null);

  const finalBlocks =
    blocks.length > 0
      ? blocks
      : synthesizeBlocksFromGeometry(geometry ?? dimensions, viewBox);

  const variant = resolveBooleanVariant(root.variant, finalBlocks.length);

  const themeTokens = asRecord(root.themeTokens) as
    | Record<string, string | undefined>
    | undefined;

  return {
    slug,
    name: typeof root.name === "string" ? root.name : undefined,
    description:
      typeof root.description === "string" ? root.description : undefined,
    variant,
    viewBox,
    blocks: finalBlocks,
    themeTokens,
  };
}
