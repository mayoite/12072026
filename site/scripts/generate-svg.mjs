/**
 * Thin SVG publish entry for admin pipeline runner + CLI (S1–S4 + disk).
 *
 * Publish authority: pipelineCore+normalize
 *   S1 normalizeDescriptorForPipeline (asset-engine)
 *   S2/S3 pipelineCore.ts
 *   S4 write public/svg-catalog
 *
 * No-I/O publish compile API: asset-engine compileSvgForPublish (same S1–S3).
 * V1 svgCompiler.server is v1-reference-only — not used here.
 *
 * Usage:
 *   pnpm --filter oando-site run scripts:generate-svg
 *   (tsx loads this file; runSvgPipeline dynamic-imports runPipeline)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {object} descriptor - BlockDescriptor-like (slug, blocks, viewBox, …)
 * @returns {Promise<{ svg: string; svgPath: string }>}
 */
export async function runPipeline(descriptor) {
  if (!descriptor || typeof descriptor.slug !== "string" || !descriptor.slug) {
    throw new Error("runPipeline requires descriptor.slug");
  }

  // S1: normalize admin BlockDescriptor (depth/fixed) → pipeline IR (height/boolean).
  const normalizeUrl = pathToFileURL(
    path.join(
      __dirname,
      "..",
      "features",
      "planner",
      "asset-engine",
      "svg",
      "normalizeDescriptorForPipeline.ts",
    ),
  ).href;
  const { normalizeDescriptorForPipeline } = await import(normalizeUrl);
  const normalized = normalizeDescriptorForPipeline(descriptor);

  const compileUrl = pathToFileURL(
    path.join(
      __dirname,
      "..",
      "features",
      "planner",
      "asset-engine",
      "svg",
      "compileSvgForPublish.ts",
    ),
  ).href;
  const { compileSvgForPublish } = await import(compileUrl);
  const compiled = await compileSvgForPublish(descriptor);
  if (!compiled.ok) {
    throw new Error(
      `compileSvgForPublish failed at ${compiled.failedAt}: ${compiled.error}`,
    );
  }
  const svg = compiled.svg;

  // S4: write public catalog SVG
  const outDir = path.resolve(__dirname, "..", "public", "svg-catalog");
  mkdirSync(outDir, { recursive: true });
  const svgPath = path.join(outDir, `${normalized.slug}.svg`);
  writeFileSync(svgPath, `${svg}\n`, "utf8");

  return { svg, svgPath, normalized };
}

export default { runPipeline };

// CLI: node/tsx scripts/generate-svg.mjs path/to/descriptor.json
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: tsx scripts/generate-svg.mjs <descriptor.json>");
    process.exit(1);
  }
  const { readFileSync } = await import("node:fs");
  const descriptor = JSON.parse(readFileSync(input, "utf8"));
  const result = await runPipeline(descriptor);
  console.log(`Wrote ${result.svgPath} (${result.svg.length} bytes)`);
}
