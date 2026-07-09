/**
 * site/scripts/generate-svg/pipelineCore.ts
 *
 * LIVE publish compile core (S2/S3): boolean BlockDescriptor IR → SVG string
 * (sanitize + optimise). Paired with asset-engine normalizeDescriptorForPipeline (S1).
 * generate-svg.mjs is the thin CLI/write wrapper; compileSvgForPublish is the
 * no-I/O publish entry. V1 svgCompiler.server is reference-only — not this path.
 * GS: BP-03, anti-copy.
 */

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Resolve __dirname in ES-module context.
const _require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── External deps (required via CJS bridge — same pattern as generate-svg.mjs) ──

const polygonClipping = _require("polygon-clipping") as {
  union: typeof import("polygon-clipping").union;
  intersection: typeof import("polygon-clipping").intersection;
  difference: typeof import("polygon-clipping").difference;
  xor: typeof import("polygon-clipping").xor;
};

const svgo = _require("svgo") as typeof import("svgo");

// ── Public error class (mirrors generate-svg.mjs) ─────────────────────────────

export class Open3dPipelineError extends Error {
  public readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "Open3dPipelineError";
  }
}

// ── Sanitizer (same logic as generate-svg.mjs sanitiseSvg) ───────────────────

const MAX_ATTR_SIZE = 4096;

/**
 * Sanitize an SVG string; throws Open3dPipelineError for unsafe content.
 * Mirrors generate-svg.mjs sanitiseSvg exactly.
 */
export function sanitiseSvg(svg: string): string {
  let result = svg;

  result = result.replace(/<script[\s\S]*?<\/script>/gi, "");
  result = result.replace(/<script[\s\S]*?\/>/gi, "");
  result = result.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");
  result = result.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");
  result = result.replace(/<foreignObject[\s\S]*?\/>/gi, "");

  if (/href\s*=\s*["']?\s*javascript:/i.test(result)) {
    throw new Open3dPipelineError("malformedSvg", "Sanitisation failed: javascript: href found in SVG");
  }

  const externalUseMatch = result.match(
    /<(?:use|image)[\s\S]*?(?:href|xlink:href)\s*=\s*["']([a-zA-Z][a-zA-Z0-9.+-]*:\/\/[^'"]+)["']/gi,
  );
  if (externalUseMatch) {
    for (const match of externalUseMatch) {
      const urlMatch = match.match(/["']([a-zA-Z][a-zA-Z0-9.+-]*:\/\/[^'"]+)["']/i);
      const url = urlMatch ? urlMatch[1] : "";
      const scheme = url.includes(":") ? url.slice(0, url.indexOf(":") + 1) : "";
      const ALLOWED: string[] = ["https:", "http:", "data:image/png;base64", "data:image/svg+xml;"];
      if (!ALLOWED.includes(scheme)) {
        throw new Open3dPipelineError(
          "malformedSvg",
          `Sanitisation failed: disallowed external reference in ${match.slice(0, 80)}`,
        );
      }
    }
  }

  const attrMatch = result.match(/([a-zA-Z_:][a-zA-Z0-9_:.\-]*)\s*=\s*(["'])([\s\S]*?)\2/g);
  if (attrMatch) {
    for (const attr of attrMatch) {
      const val = attr.match(/=\s*(["'])([\s\S]*?)\1/)?.[2] ?? "";
      if (val.length > MAX_ATTR_SIZE) {
        throw new Open3dPipelineError(
          "malformedSvg",
          `Sanitisation failed: attribute value exceeds ${MAX_ATTR_SIZE} bytes`,
        );
      }
    }
  }

  return result;
}

// ── Slug / viewBox validation ─────────────────────────────────────────────────

const SLUG_RE = /^[a-z][a-z0-9-]{1,63}$/;

export function validateSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) {
    throw new Open3dPipelineError(
      "invalid",
      `Slug "${slug}" does not match required pattern ^[a-z][a-z0-9-]{1,63}$`,
    );
  }
}

export interface ViewBox { x: number; y: number; width: number; height: number }

export function assertViewBoxStable(descriptor: { viewBox?: unknown }): ViewBox {
  const vb = descriptor.viewBox as Record<string, unknown> | undefined;
  if (!vb) throw new Open3dPipelineError("invalid", "Descriptor missing viewBox");
  const { x, y, width, height } = vb as { x: unknown; y: unknown; width: unknown; height: unknown };
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Open3dPipelineError("invalid", "viewBox contains non-finite values");
  }
  if ((width as number) <= 0 || (height as number) <= 0) {
    throw new Open3dPipelineError("invalid", "viewBox width/height must be positive");
  }
  return { x: x as number, y: y as number, width: width as number, height: height as number };
}

// ── Boolean operations (mirrors generate-svg.mjs applyBooleanOp) ─────────────
// polygon-clipping geometry: Pair → Ring → Polygon → MultiPolygon
//   Pair = [number, number]
//   Ring = Pair[]
//   Polygon = Ring[]   (outer + holes)
//   MultiPolygon = Polygon[]
//   Geom = Polygon | MultiPolygon

/** Closed ring of plan-space points (polygon-clipping Ring). */
type PolygonRing = [number, number][];
/** One polygon: outer ring + optional holes (polygon-clipping Polygon). */
type Polygon = PolygonRing[];
/** polygon-clipping MultiPolygon — array of Polygons. */
type MultiPolygon = Polygon[];

const OP_MAP = {
  union: polygonClipping.union,
  intersection: polygonClipping.intersection,
  difference: polygonClipping.difference,
  xor: polygonClipping.xor,
} as const;

export type BooleanVariant = keyof typeof OP_MAP;

/**
 * Apply a boolean op across input Polygons.
 * Returns rings of the first result Polygon (sufficient for rect-block IR).
 */
export function applyBooleanOp(polygons: Polygon[], variant: BooleanVariant): PolygonRing[] {
  if (polygons.length === 0) {
    throw new Open3dPipelineError("invalid", "No polygons for boolean operation");
  }
  const op = OP_MAP[variant];
  if (!op) {
    throw new Open3dPipelineError("invalid", `Unknown boolean variant "${variant}"`);
  }
  // Pass MultiPolygon Geoms: [Polygon] — not [[Polygon]] (one nesting level).
  if (polygons.length === 1) {
    if (variant === "difference") {
      throw new Open3dPipelineError("invalid", "difference variant requires at least two polygons");
    }
    const result = (op as typeof polygonClipping.union)([polygons[0]!]);
    return Array.isArray(result) && result.length > 0 ? result[0]! : [];
  }
  let acc: MultiPolygon = [polygons[0]!];
  for (let i = 1; i < polygons.length; i++) {
    const next: MultiPolygon = [polygons[i]!];
    const merged = (op as typeof polygonClipping.union)(acc, next);
    if (!Array.isArray(merged) || merged.length === 0) {
      throw new Open3dPipelineError("invalid", `Boolean op "${variant}" produced empty result at index ${i}`);
    }
    acc = merged;
  }
  return Array.isArray(acc) && acc.length > 0 ? acc[0]! : [];
}

// ── Path construction ─────────────────────────────────────────────────────────

function fmt(n: number): string {
  return parseFloat(n.toFixed(4)).toString();
}

/** Convert polygon rings (outer + holes) into a single SVG path `d` string. */
export function polygonsToPath(rings: PolygonRing[]): string {
  if (!Array.isArray(rings) || rings.length === 0) return "";
  const parts: string[] = [];
  for (const ring of rings) {
    if (!Array.isArray(ring) || ring.length === 0) continue;
    const first = ring[0];
    if (!first || first.length < 2) continue;
    const moveCmd = `M ${fmt(first[0])} ${fmt(first[1])}`;
    const lineCmds: string[] = [];
    for (let i = 1; i < ring.length; i++) {
      const pt = ring[i]!;
      lineCmds.push(`L ${fmt(pt[0])} ${fmt(pt[1])}`);
    }
    lineCmds.push("Z");
    parts.push([moveCmd, ...lineCmds].join(" "));
  }
  return parts.join(" ");
}

// ── SVG assembly (mirrors generate-svg.mjs buildSvgString) ──────────────────

function escXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface ThemeTokens {
  "fill-primary"?: string;
  "stroke-accent"?: string;
  [key: string]: string | undefined;
}

export function buildSvgString(
  slug: string,
  viewBox: ViewBox,
  dPath: string,
  themeTokens: ThemeTokens | undefined,
  title: string | undefined,
  desc: string | undefined,
  variant: string | undefined,
): string {
  const titleAttr = `<title>${escXml(title ?? slug)}</title>`;
  const descAttr = desc ? `<desc>${escXml(desc)}</desc>` : "";
  const tokens = themeTokens ?? {};
  const fillAttr = tokens["fill-primary"]
    ? ` fill="${escXml(tokens["fill-primary"])}"`
    : ` fill="currentColor"`;
  const strokeAttr = tokens["stroke-accent"]
    ? ` stroke="${escXml(tokens["stroke-accent"])}"`
    : "";
  const classAttr = slug ? ` class="${slug}"` : "";
  const variantAttr = variant ? ` data-block-variant="${escXml(variant)}"` : "";
  const vb = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" viewBox="${vb}" width="${viewBox.width}" height="${viewBox.height}"${variantAttr}>`,
    titleAttr,
    descAttr,
    `<g>`,
    `<path d="${dPath}"${fillAttr}${strokeAttr}${classAttr}/>`,
    `</g>`,
    `</svg>`,
  ].join("\n");
}

// ── SVGO optimization ─────────────────────────────────────────────────────────

const SVGO_CONFIG = { plugins: [], multipass: true };

export async function optimiseSvg(svg: string): Promise<string> {
  const result = await svgo.optimize(svg, SVGO_CONFIG);
  return result.data;
}

// ── Block → polygon conversion ────────────────────────────────────────────────

export interface BlockRect { x: number; y: number; width: number; height: number }

/** Rect block → polygon-clipping Polygon (one outer ring, no holes). */
export function blockToPolygon(b: BlockRect): Polygon {
  const ring: PolygonRing = [
    [b.x, b.y],
    [b.x + b.width, b.y],
    [b.x + b.width, b.y + b.height],
    [b.x, b.y + b.height],
  ];
  return [ring];
}

// ── Full pipeline (SVG-only, no file I/O, no R2, no PNG) ─────────────────────

export interface PipelineDescriptor {
  slug: string;
  name?: string;
  description?: string;
  variant?: string;
  viewBox: { x: number; y: number; width: number; height: number };
  blocks?: BlockRect[];
  themeTokens?: ThemeTokens;
}

/** Fallback cross-hatched SVG for descriptors with no blocks (§03-FIX-05). */
export function buildFallbackSvg(viewBox: ViewBox): string {
  const vb = `0 0 ${viewBox.width} ${viewBox.height}`;
  const FALLBACK_D_PATH = "M 10 10 L 90 90 M 90 10 L 10 90 M 50 10 L 50 90 M 10 50 L 90 50";
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" viewBox="${vb}" width="${viewBox.width}" height="${viewBox.height}">`,
    `<title>Fallback - geometry missing</title>`,
    `<desc>Block geometry not provided; cross-hatched fallback rendered.</desc>`,
    `<path d="${FALLBACK_D_PATH}" fill="none" stroke="currentColor" stroke-width="2"/>`,
    `</svg>`,
  ].join("");
}

/**
 * Run the pipeline up to and including SVGO + sanitizer.
 * Does NOT write files, render PNG, or upload to R2.
 * Used by golden round-trip tests (03-TEST-01).
 */
export async function runPipelineCore(descriptor: PipelineDescriptor): Promise<string> {
  validateSlug(descriptor.slug);
  const viewBox = assertViewBoxStable(descriptor);

  const rawBlocks = Array.isArray(descriptor.blocks) ? descriptor.blocks : [];
  if (rawBlocks.length === 0) {
    const fallback = buildFallbackSvg(viewBox);
    return sanitiseSvg(fallback);
  }

  const polygons: Polygon[] = rawBlocks.map(blockToPolygon);
  const variant = (descriptor.variant ?? "union") as BooleanVariant;
  const resultRings = applyBooleanOp(polygons, variant);
  const dPath = polygonsToPath(resultRings);

  const assembled = buildSvgString(
    descriptor.slug,
    viewBox,
    dPath,
    descriptor.themeTokens,
    descriptor.name,
    descriptor.description,
    descriptor.variant,
  );

  const optimised = await optimiseSvg(assembled);
  return sanitiseSvg(optimised);
}
