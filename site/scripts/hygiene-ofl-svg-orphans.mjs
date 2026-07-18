/**
 * H3 hygiene: remove retired OFL plan SVGs that have no live descriptor
 * and are not required by demo catalog, dual-write residual, or known e2e fixtures.
 *
 * Does not touch:
 * - oando-* brand heroes
 * - missing-geom-fallback-001
 * - sample-* demo art
 * - cabinet-v0, workstation-linear (demo / systems v0)
 * - desk-linear-1200-001, side-table-001, chaise-lounge-001 (proof / e2e residual)
 * - inventory/descriptors *.latest.json / *.{n}.json (pipeline version pointers — required)
 *
 * Usage (repo root or site/):
 *   node site/scripts/hygiene-ofl-svg-orphans.mjs
 *   node site/scripts/hygiene-ofl-svg-orphans.mjs --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const catalogDir = path.join(siteRoot, "public", "svg-catalog");
const dryRun = process.argv.includes("--dry-run");

/** Explicit keep set — brand heroes are also kept via oando-* prefix / live rule. */
const KEEP = new Set([
  "missing-geom-fallback-001",
  "cabinet-v0",
  "workstation-linear",
  "desk-linear-1200-001",
  "side-table-001",
  "chaise-lounge-001",
]);

function shouldKeep(slug) {
  if (KEEP.has(slug)) return true;
  if (slug.startsWith("oando-")) return true;
  if (slug.startsWith("sample-")) return true;
  if (slug.startsWith("_")) return true;
  return false;
}

if (!fs.existsSync(catalogDir)) {
  console.error(`missing catalog dir: ${catalogDir}`);
  process.exit(1);
}

const entries = fs.readdirSync(catalogDir).filter((e) => e.endsWith(".svg"));
const removed = [];
const kept = [];

for (const entry of entries) {
  const slug = entry.slice(0, -".svg".length);
  if (shouldKeep(slug)) {
    kept.push(entry);
    continue;
  }
  const abs = path.join(catalogDir, entry);
  if (dryRun) {
    removed.push(entry);
    continue;
  }
  fs.unlinkSync(abs);
  removed.push(entry);
}

console.log(
  JSON.stringify(
    {
      dryRun,
      catalogDir,
      keptCount: kept.length,
      removedCount: removed.length,
      removed,
      kept,
    },
    null,
    2,
  ),
);
console.log(
  dryRun
    ? `hygiene-ofl-svg-orphans: would remove ${removed.length}`
    : `hygiene-ofl-svg-orphans: removed ${removed.length}`,
);
