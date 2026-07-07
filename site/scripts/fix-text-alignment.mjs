#!/usr/bin/env node
/**
 * fix-text-alignment.mjs
 *
 * Replaces physical text alignment (text-left/text-right) with logical
 * properties (text-start/text-end) that auto-flip for RTL.
 *
 * Does NOT touch text-center (direction-agnostic).
 * Handles responsive variants: md:text-left → md:text-start
 *
 * Usage:  node scripts/fix-text-alignment.mjs [--write]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SITE_ROOT = join(__dirname, "..");

const SKIP_DIRS = new Set([
  "node_modules", ".next", "dist", "results", "outputs", ".git",
  "tech-stack-docs", "tech-stack-generator", "_archive",
]);

// Match text-left or text-right with optional variant prefix
// Word boundary ensures we don't catch text-leftover or similar
const ALIGN_RE = /(?:(sm|md|lg|xl|2xl):)?text-(left|right)\b/g;

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
  const doWrite = process.argv.includes("--write");
  const files = walk(SITE_ROOT);
  const changes = [];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    let changed = false;
    const out = lines.map((line, i) => {
      if (line.trim().startsWith("//")) return line;
      let newLine = line;
      ALIGN_RE.lastIndex = 0;
      let m;
      while ((m = ALIGN_RE.exec(newLine)) !== null) {
        const [full, variant, align] = m;
        const replacement = `${variant ? variant + ":" : ""}text-${align === "left" ? "start" : "end"}`;
        newLine =
          newLine.slice(0, m.index) +
          replacement +
          newLine.slice(m.index + full.length);
        changes.push({
          file: relative(SITE_ROOT, file).replace(/\\/g, "/"),
          line: i + 1,
          from: full,
          to: replacement,
        });
        changed = true;
        ALIGN_RE.lastIndex = m.index + replacement.length;
      }
      return newLine;
    });

    if (doWrite && changed) {
      writeFileSync(file, out.join("\n"), "utf8");
    }
  }

  console.log(`\n=== Text alignment fix (physical → logical) ===\n`);
  console.log(`Replacements: ${changes.length}`);

  if (changes.length) {
    const byFile = new Map();
    for (const c of changes) {
      if (!byFile.has(c.file)) byFile.set(c.file, []);
      byFile.get(c.file).push(c);
    }
    for (const [file, items] of byFile) {
      console.log(`  ${file} (${items.length})`);
    }
  }

  if (!doWrite) {
    console.log(`\nDry run — no files changed. Use --write to apply.`);
  } else {
    const filesChanged = new Set(changes.map((c) => c.file)).size;
    console.log(`\n✅ Applied ${changes.length} replacements across ${filesChanged} files.`);
  }
}

run();
