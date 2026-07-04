/**
 * site/scripts/generate-svg.mjs - Phase 03 SVG pipeline.
 *
 * Turns a BlockDescriptor JSON object into a canonical SVG string written to
 * public/svg-catalog/{slug}.svg and a PNG thumbnail uploaded to R2.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createR2CatalogClient, contentTypeForKey } from "../lib/storage/r2Catalog.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

try {
  require("./loadEnvLocal.cjs").loadEnvLocal();
} catch {
  // Env is optional for SVG-only runs.
}

let flattenJs = null;

let polygonClipping;
try {
  polygonClipping = require("polygon-clipping");
} catch {
  throw new Error("Pipeline requires polygon-clipping. Install: pnpm add --filter oando-site polygon-clipping");
}

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

const THUMBS_BUCKET = "site-block-thumbs";

export class Open3dPipelineError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "Open3dPipelineError";
  }
}

export { sanitiseSvg, validateSlug, assertViewBoxStable };

const MAX_ATTR_SIZE = 4096;
const ALLOWED_HREF_PROTOCOLS = ["https:", "http:", "data:image/png;base64", "data:image/svg+xml;"];

function sanitiseSvg(svg) {
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
      if (!ALLOWED_HREF_PROTOCOLS.includes(scheme)) {
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

const SLUG_RE = /^[a-z][a-z0-9-]{1,63}$/;

function validateSlug(slug) {
  if (!SLUG_RE.test(slug)) {
    throw new Open3dPipelineError(
      "invalid",
      `Slug "${slug}" does not match required pattern ^[a-z][a-z0-9-]{1,63}$`,
    );
  }
}

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

function measureGeometry(blocks) {
  if (!flattenJs) return blocks.map(() => ({}));

  const { Polygon, Point } = flattenJs;

  return blocks.map((block) => {
    const { x, y, width, height } = block;
    const poly = new Polygon([
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ]);

    const verts = poly.vertices;
    let perimeter = 0;
    for (let i = 0; i < verts.length; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % verts.length];
      perimeter += Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    const cx = verts.reduce((sum, vertex) => sum + vertex.x, 0) / verts.length;
    const cy = verts.reduce((sum, vertex) => sum + vertex.y, 0) / verts.length;

    const segments = [];
    for (let i = 0; i < verts.length; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % verts.length];
      segments.push(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2));
    }

    const closestTo = (px, py) => {
      const result = poly.distanceTo(new Point(px, py));
      if (Array.isArray(result) && result[1]) {
        return result[1].ps;
      }
      return null;
    };

    return {
      area: poly.area(),
      perimeter,
      bbox: poly.box,
      centroid: { x: cx, y: cy },
      segments,
      closestTo,
    };
  });
}

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
      `Unknown boolean variant "${variant}". Allowed: ${Object.keys(OP_MAP).join(", ")}`,
    );
  }

  if (polygons.length === 1) {
    if (variant === "difference") {
      throw new Open3dPipelineError(
        "invalid",
        "difference variant requires at least two polygons (base + subtrahend)",
      );
    }
    const wrapped = [polygons];
    const result = op(wrapped);
    return Array.isArray(result) && result.length > 0 ? result[0] : [];
  }

  let acc = [[polygons[0]]];
  for (let i = 1; i < polygons.length; i++) {
    const next = [[polygons[i]]];
    const merged = op(acc, next);
    if (!Array.isArray(merged) || merged.length === 0) {
      throw new Open3dPipelineError(
        "invalid",
        `Boolean op "${variant}" produced empty result at polygon index ${i}`,
      );
    }
    acc = merged;
  }

  return Array.isArray(acc) && acc.length > 0 ? acc[0] : [];
}

function polygonsToPath(rings) {
  if (!Array.isArray(rings) || rings.length === 0) return "";

  const parts = [];
  for (const ring of rings) {
    if (!Array.isArray(ring) || ring.length === 0) continue;
    const flatPts = ring.flat();
    if (flatPts.length < 2) continue;
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
  return parseFloat(n.toFixed(4)).toString();
}

async function loadSvgoConfig() {
  return require("./generate-svg/svgo.config.cjs");
}

async function optimiseSvg(svg) {
  const config = await loadSvgoConfig();
  const result = await svgo.optimize(svg, config);
  return result.data;
}

const FALLBACK_D_PATH = "M 10 10 L 90 90 M 90 10 L 10 90 M 50 10 L 50 90 M 10 50 L 90 50";

function buildFallbackSvg(viewBox) {
  const vb = `0 0 ${viewBox.width} ${viewBox.height}`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${viewBox.width}" height="${viewBox.height}">`,
    `<title>Fallback - geometry missing</title>`,
    `<desc>Block geometry not provided; cross-hatched fallback rendered.</desc>`,
    `<path d="${FALLBACK_D_PATH}" fill="none" stroke="currentColor" stroke-width="2"/>`,
    `</svg>`,
  ].join("");
}

function buildSvgString(slug, viewBox, dPath, themeTokens, title, desc, variant) {
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

function renderPng(svgString) {
  const Resvg = resvg.Resvg;
  const img = new Resvg(svgString, {
    fitTo: { mode: "original" },
  });
  return img.render().asPng();
}

function writeSvg(slug, svgString) {
  const outDir = join(__dirname, "..", "public", "svg-catalog");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${slug}.svg`);
  writeFileSync(outPath, svgString, "utf-8");
  return outPath;
}

async function uploadPngToR2(slug, pngBuffer) {
  const client = createR2CatalogClient();
  const key = `${slug}.png`;
  await client.send(
    new PutObjectCommand({
      Bucket: THUMBS_BUCKET,
      Key: key,
      Body: pngBuffer,
      ContentType: contentTypeForKey(key),
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() ?? "";
  return accountId
    ? `https://${accountId}.r2.cloudflarestorage.com/${THUMBS_BUCKET}/${key}`
    : `https://cdn.example.com/${THUMBS_BUCKET}/${key}`;
}

async function initFlattenJs() {
  try {
    flattenJs = await import("@flatten-js/core");
  } catch {
    throw new Error(
      "Pipeline requires @flatten-js/core. Install: pnpm add --filter oando-site @flatten-js/core",
    );
  }
}

export async function runPipeline(descriptor) {
  validateSlug(descriptor.slug);
  const viewBox = assertViewBoxStable(descriptor);

  const rawBlocks = descriptor.blocks ?? descriptor.geometry?.blocks ?? [];
  if (!rawBlocks || rawBlocks.length === 0) {
    const fallbackSvg = buildFallbackSvg(viewBox);
    const safe = sanitiseSvg(fallbackSvg);
    writeSvg(descriptor.slug, safe);
    return {
      svg: safe,
      thumbBuffer: renderPng(safe),
      dimensions: { width: viewBox.width, height: viewBox.height },
      r2Url: null,
    };
  }

  void measureGeometry(rawBlocks, viewBox);

  const polygons = rawBlocks.map((b) => [
    [b.x, b.y],
    [b.x + b.width, b.y],
    [b.x + b.width, b.y + b.height],
    [b.x, b.y + b.height],
  ]);

  const variant = descriptor.variant ?? "union";
  const resultPolygons = applyBooleanOp(polygons, variant);
  const dPath = polygonsToPath(resultPolygons);

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
  const safe = sanitiseSvg(optimised);

  writeSvg(descriptor.slug, safe);

  const thumbBuffer = renderPng(safe);

  let r2Url = null;
  try {
    r2Url = await uploadPngToR2(descriptor.slug, thumbBuffer);
  } catch (r2err) {
    console.warn(
      `[generate-svg] R2 upload skipped (credentials absent or network error): ${r2err.message}`,
    );
  }

  return {
    svg: safe,
    thumbBuffer,
    dimensions: { width: viewBox.width, height: viewBox.height },
    r2Url,
  };
}

async function main() {
  await initFlattenJs();

  const fixtureIdx = process.argv.indexOf("--fixture");
  const fixtureName = fixtureIdx >= 0 ? process.argv[fixtureIdx + 1] : null;

  if (!fixtureName) {
    console.error("Usage: pnpm run scripts:generate-svg -- --fixture <name>");
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

  const hasBlocks = (descriptor.blocks ?? descriptor.geometry?.blocks ?? []).length > 0;
  if (!hasBlocks) {
    console.warn(
      `[generate-svg] Fixture "${fixtureName}" has no geometry blocks - rendering cross-hatched fallback (§03-FIX-05)`,
    );
  }

  try {
    const result = await runPipeline(descriptor);
    console.log(`[generate-svg] Pipeline complete for "${fixtureName}"`);
    console.log(`  SVG written: public/svg-catalog/${descriptor.slug}.svg (${result.svg.length} bytes)`);
    console.log(`  PNG thumb:   ${result.thumbBuffer.length} bytes`);
    console.log(`  R2 URL:      ${result.r2Url ?? "(credentials absent - skipped)"}`);
    console.log(`  Dimensions:  ${result.dimensions.width} x ${result.dimensions.height}`);
    process.exit(hasBlocks ? 0 : 8);
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
