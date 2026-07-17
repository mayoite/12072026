/**
 * DB-SVG-17 — disk → Products DB migration dry-run (read-only).
 *
 * Inventories on-disk descriptors and public SVG artifacts. Does not write DB rows
 * or mutate canonical catalog files.
 *
 * Run: pnpm --filter oando-site exec tsx scripts/svg-disk-db-dry-run.ts
 */

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { loadAll } from "../features/planner/catalog/svg/svgBlockDescriptorLoader";
import { resolvePublicDir } from "../lib/paths/sitePackageRoot";

interface DryRunRow {
  readonly slug: string;
  readonly descriptorChecksum: string;
  readonly svgPath: string;
  readonly svgPresent: boolean;
  readonly svgChecksum: string | null;
  readonly footprintMm: string;
}

function sha256Utf8(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function main(): void {
  const descriptors = loadAll({ forceReload: true });
  const svgDir = path.join(resolvePublicDir(), "svg-catalog");
  const rows: DryRunRow[] = [];

  for (const descriptor of descriptors) {
    const svgPath = path.join(svgDir, `${descriptor.slug}.svg`);
    let svgChecksum: string | null = null;
    let svgPresent = false;
    try {
      const svg = readFileSync(svgPath, "utf8");
      svgPresent = true;
      svgChecksum = sha256Utf8(svg);
    } catch {
      svgPresent = false;
    }

    rows.push({
      slug: descriptor.slug,
      descriptorChecksum: descriptor.checksum,
      svgPath: `public/svg-catalog/${descriptor.slug}.svg`,
      svgPresent,
      svgChecksum,
      footprintMm: `${descriptor.geometry.widthMm}x${descriptor.geometry.depthMm}x${descriptor.geometry.heightMm}`,
    });
  }

  const missingSvg = rows.filter((row) => !row.svgPresent);
  const report = {
    generatedAt: new Date().toISOString(),
    descriptorCount: rows.length,
    missingSvgCount: missingSvg.length,
    missingSvgSlugs: missingSvg.map((row) => row.slug),
    rows,
  };

  const outDir = path.resolve(process.cwd(), "../results/admin/svg-disk-db-dry-run");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "dry-run.json");
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`DB-SVG-17 dry-run: ${rows.length} descriptor(s), ${missingSvg.length} missing SVG`);
  console.log(`Report: ${outPath}`);
  if (missingSvg.length > 0) {
    process.exitCode = 1;
  }
}

main();