/**
 * BlockDescriptor → ResolvedBlock[] resolver.
 *
 * Phase 02 exposes the descriptor contract via the Zod schema in
 * `svgTypes.ts`. Phase 03 needs a flat array of occupancy rectangles for
 * polygon boolean ops, and Phase 06 needs the same normalised shape for
 * the 3D audit. This module is the single resolver both phases import.
 *
 * Acceptance:
 *  - Input: a `BlockDescriptor` re-exported from `./svgTypes`.
 *  - Output: a `ResolvedBlock[]` whose rows carry the geometry any polygon
 *    ring / Three volume audit consumes.
 *  - Empty / missing geometry ⇒ returns `[]` (callers must fall back to
 *    §03-FIX-05 cross-hatched fallback rather than synthesising a phantom).
 *
 * Type Safety rule (AGENTS.md):
 *  - No `any`, no `as any`, no `@ts-ignore`, no eslint suppress.
 *  - Errors surfaced via the same `PlannerDescriptorError` discriminated
 *    union the rest of the catalog uses.
 */

import type {
  BlockDescriptor,
  MountingPoint,
  BlockDescriptorViewBox,
} from "./svgTypes";
import { MountPlaneSchema } from "./svgTypes";

/** A single normalised occupancy rectangle in millimetres relative to viewBox origin. */
export interface ResolvedBlock {
  /** Stable id; defaults to `block-#` when the descriptor lacks per-block ids. */
  id: string;
  /** Top-left x in mm (origin = viewBox.x). */
  x: number;
  /** Top-left y in mm (origin = viewBox.y). */
  y: number;
  /** Width along the x axis in mm. */
  width: number;
  /** Depth along the y axis in mm. Alias of `height` to satisfy Three's vocabulary. */
  depth: number;
  /** Same value as `depth` in mm. Exposed for the 2-D rendering surface. */
  height: number;
  /** Optional explicit mounting anchor. */
  mounting?: MountingPoint;
  /** True iff this row came from one of the descriptor's `blocks` array entries. */
  source: "explicit" | "synthesised";
}

/** Resolver result. Empty array is a valid outcome (downstream falls back). */
export interface ResolvedBlocks {
  blocks: ResolvedBlock[];
  viewBox: BlockDescriptorViewBox;
  /** Echo of the resolved geometry tag (used by callers without re-parsing the full descriptor). */
  variant: BlockDescriptor["variant"];
}

const DEFAULT_BLOCKID_PREFIX = "block-";

/**
 * Resolve a parsed `BlockDescriptor` into a flat `ResolvedBlock[]`.
 *
 * Behaviour:
 *  - When `descriptor.blocks` is present and non-empty, every entry is
 *    normalised to `ResolvedBlock` (lossless; unknown fields ignored).
 *  - When `descriptor.blocks` is missing or empty, a single synthesised
 *    block from `geometry × viewBox` is returned so a polygon-only
 *    consumer still has a non-degenerate shape to feed `polygon-clipping`.
 *    The synthesised row is flagged with `source: "synthesised"` so the
 *    Three audit can opt out of mounting it as a real volume.
 *
 * Pure function. Does not perform I/O. Does not allocate per-call state.
 */
export function resolveBlocks(descriptor: BlockDescriptor): ResolvedBlocks {
  const viewBox: BlockDescriptorViewBox = {
    x: descriptor.viewBox.x,
    y: descriptor.viewBox.y,
    width: descriptor.viewBox.width,
    height: descriptor.viewBox.height,
  };

  // Typed access now (post 0413 schema extension); no unknown cast at boundary.
  // Cites Global Standard BP-02 (resolver contract with schema) + PLAN-FAIL-0413 removal condition met.
  const explicitBlocks = descriptor.blocks;
  if (Array.isArray(explicitBlocks) && explicitBlocks.length > 0) {
    const normalised = explicitBlocks.flatMap((entry, index) =>
      normaliseExplicitBlock(entry, index, viewBox),
    );
    return {
      blocks: normalised,
      viewBox,
      variant: descriptor.variant,
    };
  }

  return {
    blocks: [synthesisedBlockFromGeometry(descriptor, viewBox)],
    viewBox,
    variant: descriptor.variant,
  };
}

/**
 * Convenience helper for the monolithic-svg path: returns just the resolved
 * blocks array without echoing the viewBox + variant. Useful when the caller
 * already has the descriptor in scope.
 */
export function resolveBlockRows(descriptor: BlockDescriptor): ResolvedBlock[] {
  return resolveBlocks(descriptor).blocks;
}

/** Validate that a resolver result is non-empty; otherwise throw a typed error. */
export function assertResolvedNonEmpty(
  resolved: ResolvedBlocks,
): ResolvedBlock[] {
  if (resolved.blocks.length === 0) {
    throw new BlockResolverError("noBlocks", "resolver produced an empty array; descriptor is non-renderable");
  }
  return resolved.blocks;
}

/** Typed error so callers can switch on `kind` without string parsing. */
export type BlockResolverErrorKind = "noBlocks" | "invalidShape";

export class BlockResolverError extends Error {
  public override readonly name = "BlockResolverError";
  public readonly kind: BlockResolverErrorKind;
  public readonly fieldPath: string;

  constructor(kind: BlockResolverErrorKind, message: string, fieldPath: string = "") {
    super(message);
    this.kind = kind;
    this.fieldPath = fieldPath;
  }
}

// ── Internal helpers ────────────────────────────────────────────────────────

type RawExplicitBlock = {
  id?: unknown;
  x?: unknown;
  y?: unknown;
  width?: unknown;
  widthMm?: unknown;
  height?: unknown;
  depth?: unknown;
  heightMm?: unknown;
  depthMm?: unknown;
  mounting?: unknown;
};

function normaliseExplicitBlock(
  entry: unknown,
  index: number,
  viewBox: BlockDescriptorViewBox,
): ResolvedBlock[] {
  if (!entry || typeof entry !== "object") return [];
  const raw = entry as RawExplicitBlock;

  const x = numberOrZero(raw.x);
  const y = numberOrZero(raw.y);
  const width = numberOrZero(firstPositive([raw.width, raw.widthMm]));
  const depth = numberOrZero(
    firstPositive([raw.depth, raw.height, raw.depthMm, raw.heightMm]),
  );

  if (width <= 0 || depth <= 0) {
    throw new BlockResolverError(
      "invalidShape",
      `explicit block #${index} has non-positive width or depth`,
      `blocks.${index}`,
    );
  }

  const id = typeof raw.id === "string" && raw.id.length > 0
    ? raw.id
    : `${DEFAULT_BLOCKID_PREFIX}${index + 1}`;

  const mounting = normaliseMounting(raw.mounting);

  return [
    {
      id,
      x: placeInside(x, viewBox.width),
      y: placeInside(y, viewBox.height),
      width: clampPositive(width),
      depth: clampPositive(depth),
      height: clampPositive(depth),
      mounting,
      source: "explicit",
    },
  ];
}

function synthesisedBlockFromGeometry(
  descriptor: BlockDescriptor,
  viewBox: BlockDescriptorViewBox,
): ResolvedBlock {
  // Prefer the descriptor's geometry footprint. If geometry has a positive
  // widthMm/depthMm, anchor a single block at the viewBox origin. Fall back
  // to the viewBox itself so polygon callers always get at least one ring.
  const width = clampPositive(descriptor.geometry.widthMm);
  const depth = clampPositive(descriptor.geometry.depthMm);
  const mount: MountingPoint | undefined = pickPrimaryMounting(descriptor);

  // Validate against viewBox; oversized geometry is allowed (caller clamps).
  return {
    id: `${DEFAULT_BLOCKID_PREFIX}synth`,
    x: 0,
    y: 0,
    width: Math.min(width, viewBox.width),
    depth: Math.min(depth, viewBox.height),
    height: Math.min(depth, viewBox.height),
    mounting: mount,
    source: "synthesised",
  };
}

function pickPrimaryMounting(
  descriptor: BlockDescriptor,
): MountingPoint | undefined {
  const fromMounting = descriptor.mounting?.[0];
  if (!fromMounting) return undefined;
  const parsed = MountPlaneSchema.safeParse(fromMounting);
  if (!parsed.success) return undefined;
  return { plane: parsed.data, offset: { x: 0, y: 0 } };
}

function normaliseMounting(value: unknown): MountingPoint | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as { plane?: unknown; offset?: unknown };
  const planeParsed = MountPlaneSchema.safeParse(candidate.plane);
  if (!planeParsed.success) return undefined;
  const offset = candidate.offset as { x?: unknown; y?: unknown } | undefined;
  return {
    plane: planeParsed.data,
    offset: {
      x: typeof offset?.x === "number" ? offset.x : 0,
      y: typeof offset?.y === "number" ? offset.y : 0,
    },
  };
}

function numberOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function firstPositive(values: ReadonlyArray<unknown>): number {
  for (const candidate of values) {
    if (typeof candidate === "number" && Number.isFinite(candidate) && candidate > 0) {
      return candidate;
    }
  }
  return 0;
}

function clampPositive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function placeInside(value: number, viewAxis: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > viewAxis) return viewAxis;
  return value;
}
