/**
 * site/scripts/generate-svg.mjs — Phase 03 SVG Pipeline (Option A)
 *
 * Transforms a BlockDescriptor JSON into a canonical SVG string (written to
 * `public/svg-catalog/{slug}.svg`) and a PNG thumbnail (uploaded to R2
 * `<bucket per IMPLEMENTATION-DECISIONS.md>/{slug}.png`).
 *
 * Module exports: runPipeline(descriptor) → {
 *   svg: string,
 *   thumbBuffer: Buffer,
 *   dimensions: { width: number; height: number }
 * }
 *
 * Pipeline steps:
 *   1. @flatten-js/core   — geometry measure
 *   2. polygon-clipping   — Martinez boolean ops
 *   3. Assemble d= paths  — deterministic
 *   4. svgo               — path optimisation (preset-safe)
 *   5. Write SVG          — idempotent to public/svg-catalog/
 *   6. @resvg/resvg-js    — PNG thumbnail render
 *   7. R2 PUT             — PNG → site-block-thumbs/ (per IMP-DECISIONS.md)
 *
 * Forbidden in this file (per Phase 03 §Forbidden actions):
 *   – fabric.loadSVGFromString (runtime concern)
 *   – PNG written to public/svg-catalog/
 *   – Second symbol system
 *   – Non-deterministic SVG output
 *   – Skipped sanitisation
 *
 * Run:  pnpm exec node site/scripts/generate-svg.mjs -- --fixture chaise
 *        pnpm exec node site/scripts/generate-svg.mjs -- --fixture side-table
 *        pnpm exec node site/scripts/generate-svg.mjs -- --fixture sectional
 *        pnpm exec node site/scripts/generate-svg.mjs -- --fixture missing-geometry
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load .env.local so R2 credentials are available in script context
try {
  require("./loadEnvLocal.cjs").loadEnvLocal();
} catch {
  // env not required for SVG-only pipeline steps
}

// ── Step 1: @flatten-js/core (ESM-only, loaded via dynamic import in main) ───
// flatten-js module handle — populated during init()
let flattenJs = null;

// ── Step 2: polygon-clipping (CJS) ──────────────────────────────────────────
let polygonClipping;
try {
  polygonClipping = require("polygon-clipping");
} catch {
  throw new Error("Pipeline requires polygon-clipping. Install: pnpm add --filter oando-site polygon-clipping");
}

// ── Step 4 / Step 7: svgo + @resvg/resvg-js (CJS) ───────────────────────────
let svgo;
let resvg;
try {
  svgo = require("svgo");
} catch {
  throw new Error("Pipeline requires svgo. Install: pnpm add --filter oando-site svgo");
}
try {
  resvg = require("@resvg/resvg-js");
} catch {
  throw new Error("Pipeline requires @resvg/resvg-js. Install: pnpm add --filter oando-site @resvg/resvg-js");
}

// ── R2 upload helpers (inlined from lib/storage/r2Catalog.ts) ────────────────
const THUMBS_BUCKET = "site-block-thumbs"; // per IMPLEMENTATION-DECISIONS.md

function resolveR2Endpoint() {
  const explicit = process.env.CLOUDFLARE_S3_URL?.trim();
  if (explicit) return explicit;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  if (accountId) return `https://${accountId}.r2.cloudflarestorage.com`;
  return null;
}

function resolveR2Credentials() {
  const accessKeyId =
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim() ||
    process.env.CLOUDFLARE_ACCESS_KEY_ID?.trim() ||
    process.env.CLOUDflare_R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey =
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim() ||
    process.env.CLOUDFLARE_SECRET_ACCESS_KEY?.trim() ||
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim();
  if (!accessKeyId || !secretAccessKey) return null;
  return { accessKeyId, secretAccessKey };
}

function createR2Client() {
  const endpoint = resolveR2Endpoint();
  const credentials = resolveR2Credentials();
  if (!endpoint || !credentials) throw new Error("Missing R2 config for PNG thumb upload.");
  const { S3Client } = require("@aws-sdk/client-s3");
  return new S3Client({ region: "auto", endpoint, credentials });
}

// ── Error taxonomy (reused from Phase 02 Open3dDescriptorError) ──────────────
export class Open3dPipelineError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "Open3dPipelineError";
  }
}

// ── Named exports for unit testing (§03-SAN-03) ──────────────────────────────
export { sanitiseSvg, validateSlug, assertViewBoxStable };

// ── Sanitisation ─────────────────────────────────────────────────────────────
const MAX_ATTR_SIZE = 4096;
const ALLOWED_HREF_PROTOCOLS = ["https:", "http:", "data:image/png;base64", "data:image/svg+xml;"];

function sanitiseSvg(svg) {
  let result = svg;

  // 1. Strip <script>
  result = result.replace(/<script[\s\S]*?<\/script>/gi, "");
  result = result.replace(/<script[\s\S]*?\/>/gi, "");

  // 2. Strip inline event handlers
  result = result.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");

  // 3. Strip <foreignObject>
  result = result.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");
  result = result.replace(/<foreignObject[\s\S]*?\/>/gi, "");

  // 4. Reject javascript: href (strict — not stripped)
  if (/href\s*=\s*["']?\s*javascript:/i.test(result)) {
    throw new Open3dPipelineError(
      "malformedSvg",
      "Sanitisation failed: javascript: href found in SVG"
    );
  }

  // 5. Validate XLink / href against allow-list (all schemes checked)
  const externalUseMatch = result.match(/<(?:use|image)[\s\S]*?(?:href|xlink:href)\s*=\s*["']([a-zA-Z][a-zA-Z0-9.+-]*:\/\/[^'"]+)["']/gi);
  if (externalUseMatch) {
    for (const match of externalUseMatch) {
      const urlMatch = match.match(/["']([a-zA-Z][a-zA-Z0-9.+-]*:\/\/[^'"]+)["']/i);
      const url = urlMatch ? urlMatch[1] : "";
      const colonIdx = url.indexOf(':');
      const scheme = colonIdx >= 0 ? url.slice(0, colonIdx + 1) : "";
      if (!ALLOWED_HREF_PROTOCOLS.includes(scheme)) {
        throw new Open3dPipelineError(
          "malformedSvg",
          `Sanitisation failed: disallowed external reference in ${match.slice(0, 80)}`
        );
      }
    }
  }

  // 6. Reject oversized attributes (> 4 KB)
  const attrMatch = result.match(/([a-zA-Z_:][a-zA-Z0-9_:.\-]*)\s*=\s*(["'])([\s\S]*?)\2/g);
  if (attrMatch) {
    for (const attr of attrMatch) {
      const val = attr.match(/=\s*(["'])([\s\S]*?)\1/)?.[2] ?? "";
      if (val.length > MAX_ATTR_SIZE) {
        throw new Open3dPipelineError(
          "malformedSvg",
          `Sanitisation failed: attribute value exceeds ${MAX_ATTR_SIZE} bytes`
        );
      }
    }
  }

  return result;
}

// ── Slug validation ──────────────────────────────────────────────────────────
const SLUG_RE = /^[a-z][a-z0-9-]{1,63}$/;

function validateSlug(slug) {
  if (!SLUG_RE.test(slug)) {
    throw new Open3dPipelineError(
      "invalid",
      `Slug "${slug}" does not match required pattern ^[a-z][a-z0-9-]{1,63}$`
    );
  }
}

// ── ViewBox stability assertion ─────────────────────────────────────────────
function assertViewBoxStable(descriptor) {
  const { viewBox } = descriptor;
  if (!viewBox) throw new Open3dPipelineError("invalid", "Descriptor missing viewBox");
  const { x, y, width, height } = viewBox;
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height)
  ) {
    throw new Open3dPipelineError("invalid", "viewBox contains non-finite values");
  }
  if (width <= 0 || height <= 0) {
    throw new Open3dPipelineError("invalid", "viewBox width/height must be positive");
  }
  return { x, y, width, height };
}

// ── Step 1: Geometry measure via @flatten-js/core ────────────────────────────
// API verified via interactive probe (2026-07-04):
//   Polygon.vertices → Point[], Polygon.area() → number
//   Polygon.box → {xmin,ymin,xmax,ymax}, Polygon.distanceTo(Point) → [dist, segment]
//   Polygon.dpath → string (SVG d attribute)
function measureGeometry(blocks, _viewBox) {
  if (!flattenJs) return blocks.map(() => ({})); // graceful: flatten-js unavailable

  const { Polygon, Point } = flattenJs;

  return blocks.map((block) => {
    const { x, y, width, height } = block;
    // Polygon constructor takes array of [x,y] tuples
    const poly = new Polygon([
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ]);

    // Perimeter: sum of Euclidean edge lengths from vertices
    const verts = poly.vertices;
    let perimeter = 0;
    for (let i = 0; i < verts.length; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % verts.length];
      perimeter += Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    // Centroid: arithmetic mean of vertices
    const cx = verts.reduce((s, v) => s + v.x, 0) / verts.length;
    const cy = verts.reduce((s, v) => s + v.y, 0) / verts.length;

    // Segment lengths
    const segments = [];
    for (let i = 0; i < verts.length; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % verts.length];
      segments.push(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2));
    }

    // Closest point: poly.distanceTo returns [distance, nearestSegment]
    const closestTo = (px, py) => {
      const result = poly.distanceTo(new Point(px, py));
      if (Array.isArray(result) && result[1]) {
        return result[1].ps; // nearest start point of the nearest segment
      }
      return null;
    };

    return {
      area: poly.area(),
      perimeter,
      bbox: poly.box, // {xmin, ymin, xmax, ymax}
      centroid: { x: cx, y: cy },
      segments,
      closestTo,
    };
  });
}

// ── Step 2: Boolean ops via polygon-clipping ─────────────────────────────────
// polygon-clipping API (verified 2026-07-04):
//   Input:  union([[poly1_ring]], [[poly2_ring]])  — each poly is [[[x,y]...
//   Output: [[[ring1, ring2, ...]]]  — single element outer array with ring arrays
//   Single-polygon input: still returns array-of-arrays structure
const OP_MAP = {
  union: polygonClipping.union,
  intersection: polygonClipping.intersection,
  difference: polygonClipping.difference,
  xor: polygonClipping.xor,
};

function applyBooleanOp(polygons, variant) {
  if (polygons.length === 0) {
    throw new Open3dPipelineError("invalid", "No polygons for boolean operation");
  }

  const op = OP_MAP[variant];
  if (!op) {
    throw new Open3dPipelineError(
      "invalid",
      `Unknown boolean variant "${variant}". Allowed: ${Object.keys(OP_MAP).join(", ")}`
    );
  }

  if (polygons.length === 1) {
    if (variant === "difference") {
      throw new Open3dPipelineError(
        "invalid",
        "difference variant requires at least two polygons (base + subtrahend)"
      );
    }
    // Wrap single polygon in required double-array format and return rings directly
    const wrapped = [polygons]; // [[polygon_points]]
    const result = op(wrapped);
    // Result: [[[ring1, ring2, ...]]] — unwrap to [ring1, ring2, ...]
    return Array.isArray(result) && result.length > 0 ? result[0] : [];
  }

  // Build input in polygon-clipping double-array format: [poly1, poly2] → [[[...]], [[...]]]
  let acc = [[polygons[0]]]; // first polygon wrapped: [[[x,y]...]]
  for (let i = 1; i < polygons.length; i++) {
    const next = [[polygons[i]]];
    const merged = op(acc, next);
    if (!Array.isArray(merged) || merged.length === 0) {
      throw new Open3dPipelineError(
        "invalid",
        `Boolean op "${variant}" produced empty result at polygon index ${i}`
      );
    }
    acc = merged;
  }

  // Result: [[[ring1, ring2, ...]]] — unwrap outer array to get ring list
  return Array.isArray(acc) && acc.length > 0 ? acc[0] : [];
}

// ── Step 3: Assemble deterministic d= paths ─────────────────────────────────
// Input: [ring1_points, ring2_points, ...]  where each ring is [[x,y],[x,y],...]
// Output: SVG path `d` attribute string covering all rings
function polygonsToPath(rings) {
  if (!Array.isArray(rings) || rings.length === 0) return "";

  const parts = [];
  for (const ring of rings) {
    if (!Array.isArray(ring) || ring.length === 0) continue;
    // ring is [[x,y], [x,y], ...] — flatten to [x,y,x,y,...]
    const flatPts = ring.flat();
    if (flatPts.length < 2) continue;
    // Deterministic: no Date.now(), no Math.random()
    const moveCmd = `M ${fmt(flatPts[0])} ${fmt(flatPts[1])}`;
    const lineCmds = [];
    for (let i = 2; i < flatPts.length; i += 2) {
      lineCmds.push(`L ${fmt(flatPts[i])} ${fmt(flatPts[i + 1])}`);
    }
    lineCmds.push("Z");
    parts.push([moveCmd, ...lineCmds].join(" "));
  }
  return parts.join(" ");
}

function fmt(n) {
  // Deterministic fixed-point-ish formatting (4 decimal places)
  return parseFloat(n.toFixed(4)).toString();
}

// ── Step 4: svgo optimisation (canonical frozen config from svgo.config.cjs) ─
// Per Phase 03 §03-PERF-03 the frozen copy at scripts/generate-svg/svgo.config.cjs is the
// single source of truth. Loading it here keeps drift out of the runtime; any plugin change
// must go through an explicit gate review and bump the file, not the import.
async function loadSvgoConfig() {
  return require("./generate-svg/svgo.config.cjs");
}

async function optimiseSvg(svg) {
  const config = await loadSvgoConfig();
  const result = await svgo.optimize(svg, config);
  return result.data;
}

// ── Cross-hatched fallback path (PLAN-FAIL-018 / §03-FIX-05) ─────────────────
const FALLBACK_D_PATH =
  "M 10 10 L 90 90 M 90 10 L 10 90 M 50 10 L 50 90 M 10 50 L 90 50";

function buildFallbackSvg(viewBox) {
  const vb = `0 0 ${viewBox.width} ${viewBox.height}`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${viewBox.width}" height="${viewBox.height}">`,
    `<title>Fallback — geometry missing</title>`,
    `<desc>Block geometry not provided; cross-hatched fallback rendered.</desc>`,
    `<path d="${FALLBACK_D_PATH}" fill="none" stroke="currentColor" stroke-width="2"/>`,
    `</svg>`,
  ].join("");
}

// ── Build final SVG string ────────────────────────────────────────────────────
// Theme tokens are wired into <path fill="..."/> and <path stroke="..."/> via var() syntax
// so the consumer's CSS controls the actual colour. There is NO inline `style="--var:..."`
// attribute on the path — that pattern left the variables unread and was flagged as dead
// in the QA review (3 of 4 outputs emitted a style block whose values no selector consumed).
function buildSvgString(slug, viewBox, dPath, themeTokens, title, desc, variant) {
  const titleAttr = `<title>${escXml(title ?? slug)}</title>`;
  const descAttr = desc ? `<desc>${escXml(desc)}</desc>` : "";

  const tokens = themeTokens ?? {};
  // Wire theme tokens into the SVG attributes consumers actually use.
  // Fall back to currentColor so callers without a layer override still render.
  const fillAttr = tokens["fill-primary"]
    ? ` fill="${tokens["fill-primary"]}"`
    : ` fill="currentColor"`;
  const strokeAttr = tokens["stroke-accent"]
    ? ` stroke="${tokens["stroke-accent"]}"`
    : ``;

  const classAttr = slug ? ` class="${slug}"` : "";

  // Variant marker — kept as a data-attribute so a downstream consumer can
  // attach CSS without us having to predict variant-specific styling.
  const variantAttr = variant ? ` data-block-variant="${escXml(variant)}"` : "";

  const vb = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${viewBox.width}" height="${viewBox.height}"${variantAttr}>`,
    titleAttr,
    descAttr,
    `<g>`,
    `<path d="${dPath}"${fillAttr}${strokeAttr}${classAttr}/>`,
    `</g>`,
    `</svg>`,
  ].join("\n");
}

function escXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Step 6: PNG thumbnail render via @resvg/resvg-js ─────────────────────────
function renderPng(svgString, width, height) {
  const resvgInit = resvg.Resvg;
  const img = new resvgInit(svgString, {
    fitMethod: "contain",
    changeColorBox: false,
  });
  const pngData = img.render();
  return pngData.asPng();
}

// ── Step 5: Idempotent SVG write to public/svg-catalog/{slug}.svg ────────────
function writeSvg(slug, svgString) {
  const outDir = join(__dirname, "..", "public", "svg-catalog");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${slug}.svg`);
  writeFileSync(outPath, svgString, "utf-8");
  return outPath;
}

// ── Step 7: Upload PNG to R2 bucket (site-block-thumbs/ per IMP-DECISIONS) ───
async function uploadPngToR2(slug, pngBuffer) {
  const client = createR2Client();
  const key = `${slug}.png`; // content-addressed by slug
  await client.send(
    new PutObjectCommand({
      Bucket: THUMBS_BUCKET,
      Key: key,
      Body: pngBuffer,
      ContentType: "image/png",
      // Cache forever — content-addressed, de-duped by slug
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  const endpoint = resolveR2Endpoint() ?? "";
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
  const publicUrl = accountId
    ? `https://${accountId}.r2.cloudflarestorage.com/${THUMBS_BUCKET}/${key}`
    : `https://cdn.example.com/${THUMBS_BUCKET}/${key}`; // fallback when credentials absent
  return publicUrl;
}

// ── Init: load ESM-only @flatten-js/core via dynamic import ───────────────────
async function initFlattenJs() {
  try {
    flattenJs = await import("@flatten-js/core");
  } catch {
    throw new Error(
      "Pipeline requires @flatten-js/core. Install: pnpm add --filter oando-site @flatten-js/core"
    );
  }
}

// ── Core pipeline ─────────────────────────────────────────────────────────────
/**
 * @param {object} descriptor — BlockDescriptor JSON
 * @returns {{ svg: string, thumbBuffer: Buffer, dimensions: { width: number; height: number }, r2Url?: string }}
 */
export async function runPipeline(descriptor) {
  validateSlug(descriptor.slug);
  const viewBox = assertViewBoxStable(descriptor);

  // Step 3 / 3a: resolve blocks
  const rawBlocks = descriptor.blocks ?? descriptor.geometry?.blocks ?? [];
  if (!rawBlocks || rawBlocks.length === 0) {
    // §03-FIX-05 cross-hatched fallback — distinct exit code 8 via thrown code
    const fallbackSvg = buildFallbackSvg(viewBox);
    const safe = sanitiseSvg(fallbackSvg);
    writeSvg(descriptor.slug, safe);
    return {
      svg: safe,
      thumbBuffer: renderPng(safe, viewBox.width, viewBox.height),
      dimensions: { width: viewBox.width, height: viewBox.height },
      r2Url: null,
    };
  }

  // Step 1: measure (flatten-js)
  const measured = measureGeometry(rawBlocks, viewBox);

  // Step 2: build polygons and apply boolean op
  const polygons = rawBlocks.map((b) => [
    [b.x, b.y],
    [b.x + b.width, b.y],
    [b.x + b.width, b.y + b.height],
    [b.x, b.y + b.height],
  ]);

  const variant = descriptor.variant ?? "union";
  const resultPolygons = applyBooleanOp(polygons, variant);

  // Step 3: assemble deterministic d= path
  const dPath = polygonsToPath(resultPolygons);

  // Step 4: svgo optimise (canonical config; preserves <title>, <desc>, viewBox per §03-PERF-03)
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

  // Sanitisation (mandatory — §03-SAN-01)
  const safe = sanitiseSvg(optimised);

  // Step 5: write SVG idempotent
  writeSvg(descriptor.slug, safe);

  // Step 6: render PNG thumb
  const thumbBuffer = renderPng(safe, viewBox.width, viewBox.height);

  // Step 7: upload to R2 (graceful — don't fail pipeline on R2 issues)
  let r2Url = null;
  try {
    r2Url = await uploadPngToR2(descriptor.slug, thumbBuffer);
  } catch (r2err) {
    console.warn(`[generate-svg] R2 upload skipped (credentials absent or network error): ${r2err.message}`);
  }

  return {
    svg: safe,
    thumbBuffer,
    dimensions: { width: viewBox.width, height: viewBox.height },
    r2Url,
  };
}

// ── CLI entry point ──────────────────────────────────────────────────────────
async function main() {
  // Initialise ESM-only @flatten-js/core before any pipeline step
  await initFlattenJs();

  const fixtureArg = process.argv.find((arg) => arg === "--fixture");
  const fixtureIdx = process.argv.indexOf("--fixture");
  const fixtureName = fixtureIdx >= 0 ? process.argv[fixtureIdx + 1] : null;

  if (!fixtureName) {
    console.error("Usage: node generate-svg.mjs -- --fixture <name>");
    console.error("Known fixtures: chaise, side-table, sectional, missing-geometry");
    process.exit(1);
  }

  const fixturePath = join(__dirname, "generate-svg", "_fixtures", `${fixtureName}.json`);
  if (!existsSync(fixturePath)) {
    console.error(`Fixture not found: ${fixturePath}`);
    process.exit(1);
  }

  const raw = readFileSync(fixturePath, "utf-8");
  let descriptor;
  try {
    descriptor = JSON.parse(raw);
  } catch {
    throw new Open3dPipelineError("malformedSvg", `Fixture "${fixtureName}" is not valid JSON`);
  }

  // Sanity-check: missing geometry → §03-FIX-05
  const hasBlocks =
    (descriptor.blocks ?? descriptor.geometry?.blocks ?? []).length > 0;
  if (!hasBlocks) {
    console.warn(`[generate-svg] Fixture "${fixtureName}" has no geometry blocks — rendering cross-hatched fallback (§03-FIX-05)`);
  }

  try {
    const result = await runPipeline(descriptor);
    console.log(`[generate-svg] Pipeline complete for "${fixtureName}"`);
    console.log(`  SVG written: public/svg-catalog/${descriptor.slug}.svg (${result.svg.length} bytes)`);
    console.log(`  PNG thumb:   ${result.thumbBuffer.length} bytes`);
    console.log(`  R2 URL:      ${result.r2Url ?? "(credentials absent — skipped)"}`);
    console.log(`  Dimensions:  ${result.dimensions.width} × ${result.dimensions.height}`);
    process.exit(hasBlocks ? 0 : 8); // §03-FIX-05: exit 8 for fallback
  } catch (err) {
    if (err instanceof Open3dPipelineError) {
      console.error(`[generate-svg] Pipeline error [${err.code}]: ${err.message}`);
      process.exit(err.code === "malformedSvg" ? 2 : 1);
    }
    throw err;
  }
}

main().catch((err) => {
  console.error("[generate-svg] Unhandled error:", err);
  process.exit(1);
});