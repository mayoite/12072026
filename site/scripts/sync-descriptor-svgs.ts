/**
 * Compile every block-descriptor to public/svg-catalog/{slug}.svg (maker or blocks path).
 *
 * Run: pnpm --filter oando-site run sync:descriptor-svgs
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { compileSvgForPublish } from "../features/planner/asset-engine/svg/compileSvgForPublish";
import { resolveBlockDescriptorsDir, resolvePublicDir } from "../lib/paths/sitePackageRoot";
import { clearLoaderCache, loadAll } from "../features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";

async function main(): Promise<void> {
  clearLoaderCache();
  const descriptors = loadAll({ forceReload: true });
  const outDir = path.join(resolvePublicDir(), "svg-catalog");
  mkdirSync(outDir, { recursive: true });

  let ok = 0;
  let fail = 0;

  for (const descriptor of descriptors) {
    const jsonPath = path.join(resolveBlockDescriptorsDir(), `${descriptor.slug}.json`);
    const raw = JSON.parse(readFileSync(jsonPath, "utf8")) as unknown;
    const result = await compileSvgForPublish(raw);
    if (!result.ok) {
      console.error(`FAIL ${descriptor.slug}: ${result.error}`);
      fail += 1;
      continue;
    }
    const outPath = path.join(outDir, `${descriptor.slug}.svg`);
    writeFileSync(outPath, `${result.svg}\n`, "utf8");
    console.log(`wrote ${outPath} (${result.stages.join(" → ")})`);
    ok += 1;
  }

  console.log(`sync:descriptor-svgs done ok=${ok} fail=${fail}`);
  if (fail > 0) process.exitCode = 1;
}

void main();
