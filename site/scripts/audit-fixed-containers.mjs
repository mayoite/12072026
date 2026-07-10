#!/usr/bin/env node
/**
 * audit-fixed-containers.mjs
 *
 * Scans TSX for fixed container dimensions and classifies them:
 *   - FIXED (bad)       — w-[Npx/rem] or h-[Npx/rem] with no responsive variant
 *   - RESPONSIVE (ok)   — same but has md:/lg:/sm: breakpoint override
 *   - MIN (ok)          — min-w/min-h (minimums, usually touch targets or collapse guards)
 *   - MAX (ok)          — max-w/max-h (user confirmed maximums are fine)
 *   - VIEWPORT (ok)     — w-[Nvw]/h-[Nvh] (auto-adjusts to viewport)
 *
 * Output: results/fixed-containers-audit.csv
 * Usage:  node scripts/audit-fixed-containers.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { REPO_ROOT, SITE_PACKAGE_ROOT } from "./lib/repoRoot.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SITE_ROOT = SITE_PACKAGE_ROOT;
const OUT = join(REPO_ROOT, "results", "fixed-containers-audit.csv");

const SKIP_DIRS = new Set([
  "node_modules", ".next", "dist", "results", "outputs", ".git",
  "tech-stack-docs", "tech-stack-generator", "_archive",
]);

// Match w-[...], h-[...], min-w-[...], min-h-[...], max-w-[...], max-h-[...]
const CONTAINER_RE =
  /(?:(sm|md|lg|xl|2xl):)?(w|h|min-w|min-h|max-w|max-h)-\[([^\]]+)\]/g;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (full.endsWith(".tsx")) acc.push(full);
  }
  return acc;
}

function classify(variant, prop, val) {
  const isViewport = /[vh][wh]$/.test(val) || val.includes("vw") || val.includes("vh");
  const isCalc = val.startsWith("calc(");
  const isFraction = /^\d+\/\d+$/.test(val);
  const isMinMax = prop.startsWith("min-") || prop.startsWith("max-");
  const hasResponsive = Boolean(variant);

  if (isViewport || isCalc || isFraction) return "viewport";
  if (prop.startsWith("max-")) return "max";
  if (prop.startsWith("min-")) return "min";
  // w- or h- with fixed unit
  if (hasResponsive) return "responsive";
  return "fixed";
}

function run() {
  const files = walk(SITE_ROOT);
  const rows = [];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("//")) continue;

      // Collect all container classes on this line first, so we can correlate
      const lineClasses = [];
      CONTAINER_RE.lastIndex = 0;
      let m;
      while ((m = CONTAINER_RE.exec(line)) !== null) {
        const [, variant, prop, val] = m;
        if (!/^\d+(\.\d+)?(px|rem|em)$/.test(val)) continue;
        lineClasses.push({ variant, prop, val, start: m.index });
      }

      // Build a lookup: does this line have a responsive variant for prop X?
      // Does it have a max-w/max-h guard?
      const hasResponsive = (prop) =>
        lineClasses.some(
          (c) => c.variant && c.prop === prop,
        );
      const hasMaxGuard = (prop) => {
        if (prop === "w" || prop === "min-w") return /\bmax-w-\[/.test(line);
        if (prop === "h" || prop === "min-h") return /\bmax-h-\[/.test(line);
        return false;
      };

      for (const c of lineClasses) {
        const cls = classify(c.variant, c.prop, c.val);
        let final = cls;
        // Reclassify: if a "fixed" w/h has a responsive override or max guard on same line
        if (cls === "fixed") {
          if (hasResponsive(c.prop)) final = "responsive";
          else if (hasMaxGuard(c.prop)) final = "guarded";
        }
        rows.push({
          file: relative(SITE_ROOT, file).replace(/\\/g, "/"),
          line: i + 1,
          class: `${c.variant ? c.variant + ":" : ""}${c.prop}-[${c.val}]`,
          prop: c.prop,
          val: c.val,
          category: final,
        });
      }
    }
  }

  // Write CSV
  const header = "file,line,class,prop,val,category\n";
  const csv = header + rows.map((r) =>
    `${r.file},${r.line},${r.class},${r.prop},${r.val},${r.category}`,
  ).join("\n");
  writeFileSync(OUT, csv, "utf8");

  // Summary
  const byCat = {};
  for (const r of rows) byCat[r.category] = (byCat[r.category] || 0) + 1;
  console.log(`\n=== Fixed container audit ===\n`);
  console.log(`Total container classes found: ${rows.length}`);
  for (const [cat, count] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    const flag = cat === "fixed" ? "  ❌" : "  ✅";
    console.log(`  ${flag} ${cat.padEnd(12)} ${count}`);
  }

  // Detail: FIXED only (the problem cases)
  const fixed = rows.filter((r) => r.category === "fixed");
  if (fixed.length) {
    console.log(`\n--- FIXED containers (no responsive override, no auto-adjust) ---\n`);
    const byFile = {};
    for (const r of fixed) {
      if (!byFile[r.file]) byFile[r.file] = [];
      byFile[r.file].push(r);
    }
    for (const [file, items] of Object.entries(byFile).sort()) {
      console.log(`  ${file} (${items.length})`);
      for (const it of items) {
        console.log(`    L${it.line}: ${it.class}`);
      }
    }
  }

  console.log(`\nCSV: ${OUT}`);
}

run();
