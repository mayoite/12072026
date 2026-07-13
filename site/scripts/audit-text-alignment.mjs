#!/usr/bin/env node
/**
 * audit-text-alignment.mjs
 *
 * Scans TSX for text alignment classes and classifies:
 *   - LOGICAL (ok)    — text-start/text-end (auto-flip for RTL)
 *   - RESPONSIVE (ok) — text-left/right with md:/lg: override (adapts per breakpoint)
 *   - FIXED (review)  — text-left/right with no responsive override (no auto-adjust)
 *   - CENTER (ok)     — text-center (direction-agnostic)
 *
 * Output: results/text-alignment-audit.csv
 * Usage:  node scripts/audit-text-alignment.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { REPO_ROOT, SITE_PACKAGE_ROOT } from "./lib/repoRoot.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SITE_ROOT = SITE_PACKAGE_ROOT;
const OUT = join(REPO_ROOT, "results", "text-alignment-audit.csv");

const SKIP_DIRS = new Set([
  "node_modules", ".next", "dist", "results", "outputs", ".git",
  "generated-documents", "tech-docs-generator", "_archive",
]);

// Match text-left, text-right, text-center, text-start, text-end (with optional variant)
const ALIGN_RE = /(?:(sm|md|lg|xl|2xl):)?text-(left|right|center|start|end)\b/g;

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

function run() {
  const files = walk(SITE_ROOT);
  const rows = [];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("//")) continue;

      // Collect all alignment classes on this line
      const lineClasses = [];
      ALIGN_RE.lastIndex = 0;
      let m;
      while ((m = ALIGN_RE.exec(line)) !== null) {
        const [, variant, align] = m;
        lineClasses.push({ variant, align, start: m.index });
      }

      // Check if line has a responsive override for alignment
      const hasResponsive = lineClasses.some((c) => c.variant);

      for (const c of lineClasses) {
        let category;
        if (c.align === "center") category = "center";
        else if (c.align === "start" || c.align === "end") category = "logical";
        else if (c.variant) category = "responsive";
        else if (hasResponsive) category = "responsive";
        else category = "fixed";

        // For fixed text-left/right, suggest logical replacement
        let suggestion = "";
        if (category === "fixed") {
          if (c.align === "left") suggestion = "text-start";
          else if (c.align === "right") suggestion = "text-end";
        }

        rows.push({
          file: relative(SITE_ROOT, file).replace(/\\/g, "/"),
          line: i + 1,
          class: `${c.variant ? c.variant + ":" : ""}text-${c.align}`,
          align: c.align,
          category,
          suggestion,
        });
      }
    }
  }

  // Write CSV
  const header = "file,line,class,align,category,suggestion\n";
  const csv = header + rows.map((r) =>
    `${r.file},${r.line},${r.class},${r.align},${r.category},${r.suggestion}`,
  ).join("\n");
  writeFileSync(OUT, csv, "utf8");

  // Summary
  const byCat = {};
  for (const r of rows) byCat[r.category] = (byCat[r.category] || 0) + 1;
  console.log(`\n=== Text alignment audit ===\n`);
  console.log(`Total alignment classes: ${rows.length}`);
  for (const [cat, count] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    const flag = cat === "fixed" ? "  ❌" : "  ✅";
    console.log(`  ${flag} ${cat.padEnd(12)} ${count}`);
  }

  // FIXED detail
  const fixed = rows.filter((r) => r.category === "fixed");
  if (fixed.length) {
    console.log(`\n--- FIXED text-left/right (should be text-start/text-end for RTL) ---\n`);
    const byFile = {};
    for (const r of fixed) {
      if (!byFile[r.file]) byFile[r.file] = [];
      byFile[r.file].push(r);
    }
    for (const [file, items] of Object.entries(byFile).sort()) {
      console.log(`  ${file} (${items.length})`);
      for (const it of items.slice(0, 6)) {
        console.log(`    L${it.line}: ${it.class}  →  ${it.suggestion}`);
      }
      if (items.length > 6) console.log(`    … +${items.length - 6} more`);
    }
  }

  console.log(`\nCSV: ${OUT}`);
}

run();
