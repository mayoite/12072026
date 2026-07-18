/**
 * Regenerate __goldens__ from _fixtures via runPipelineCore (Task 2′ paint procedure).
 *
 * From repo root:
 *   pnpm --filter oando-site exec tsx scripts/generate-svg/_regen-goldens.mts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  runPipelineCore,
  type PipelineDescriptor,
} from "./pipelineCore.ts";

const root = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(root, "_fixtures");
const goldensDir = join(root, "__goldens__");

const names = ["chaise", "side-table", "sectional"] as const;

for (const name of names) {
  const raw = readFileSync(join(fixturesDir, `${name}.json`), "utf-8");
  const descriptor = JSON.parse(raw) as PipelineDescriptor;
  const svg = await runPipelineCore(descriptor);
  const out = join(goldensDir, `${name}-golden.svg`);
  writeFileSync(out, `${svg.trim()}\n`, "utf-8");
  const unsafe = /currentColor|fill\s*=\s*["']var\(|stroke\s*=\s*["']var\(/i.test(
    svg,
  );
  console.log(
    `wrote ${name}-golden.svg (${svg.length} chars)${unsafe ? " WARNING: unsafe paint" : ""}`,
  );
}
