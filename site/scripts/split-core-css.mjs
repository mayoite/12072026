#!/usr/bin/env node
/**
 * split-core-css.mjs
 *
 * Splits merged core CSS files (utilities.css, components.css) back into
 * per-use files under core/utilities/ and core/components/, using the
 * `/* --- filename.css --- *\/` section markers that were preserved during
 * the merge.
 *
 * Rules:
 *   - Target max 350 lines per file.
 *   - Mandatory split if a section exceeds 500 lines (sub-split by `/* ââââ`
 *     sub-headers or `@utility`/`@keyframes` block boundaries).
 *   - Regenerates app/css/index.css with ordered imports.
 *   - theme.css is a single @theme block — left as-is (474 lines, under 500).
 *
 * Usage:  node scripts/split-core-css.mjs [--write]
 *   Default: dry-run (prints plan, no file changes).
 *   --write: actually create files and update index.css.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CORE_DIR = join(__dirname, "..", "app", "css", "core");
const INDEX_PATH = join(__dirname, "..", "app", "css", "index.css");

const MAX_SOFT = 350;
const MAX_HARD = 500;

const SECTION_RE = /^\/\* --- ([a-zA-Z0-9_-]+\.css) --- \*\//;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readLines(rel) {
  return readFileSync(join(CORE_DIR, rel), "utf8").split(/\r?\n/);
}

/**
 * Split a merged file into sections keyed by the `/* --- name.css --- *\/`
 * marker. Returns [{ name, lines[] }] preserving order. Content before the
 * first marker becomes a `_header` section (banner comment).
 */
function splitByMarkers(lines) {
  const sections = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(SECTION_RE);
    if (m) {
      if (current) sections.push(current);
      current = { name: m[1], lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      // preamble before first marker
      if (!sections.length) sections.push({ name: "_preamble", lines: [] });
      sections[0].lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

/**
 * Sub-split an oversized section by `/* ââââ ... ââââ *\/` sub-headers or
 * `@utility`/`@keyframes` block starts. Returns [{ name, lines[] }].
 */
function subSplit(section, baseName) {
  const out = [];
  let current = { name: baseName.replace(/\.css$/, "-1.css"), lines: [] };
  let idx = 1;
  let depth = 0;
  let buf = [];

  for (const line of section.lines) {
    // A new sub-section starts on a `/* ââââ` comment or an `@utility`/`@keyframes`
    // at column 0, but only when the current buffer is getting large.
    const isSubHeader =
      /^\s*\/\*\s*ââââ/.test(line) ||
      /^@utility\s+\S+\s*\{/.test(line) ||
      /^@keyframes\s+\S+\s*\{/.test(line);

    if (isSubHeader && current.lines.length > MAX_SOFT && depth === 0) {
      out.push(current);
      idx += 1;
      current = {
        name: baseName.replace(/\.css$/, `-${idx}.css`),
        lines: [],
      };
    }
    if (/^\s*[@{]/.test(line) && /[{]/.test(line)) depth += 1;
    if (/^[}]/.test(line)) depth -= 1;
    current.lines.push(line);
  }
  if (current.lines.length) out.push(current);
  return out;
}

function trimTrailingBlank(lines) {
  const out = [...lines];
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  return out;
}

function planFile(name, lines) {
  const trimmed = trimTrailingBlank(lines);
  const count = trimmed.length;
  // Strip redundant directory-name prefix (utilities-foo.css -> foo.css)
  const cleanName = name
    .replace(/^utilities-/, "")
    .replace(/^components-/, "")
    .replace(/^type\.css$/, "typography.css");
  let pieces;
  if (count <= MAX_HARD) {
    pieces = [{ name: cleanName, lines: trimmed }];
  } else {
    pieces = subSplit({ name: cleanName, lines: trimmed }, cleanName);
  }
  return pieces.map((p) => ({
    name: p.name,
    lines: trimTrailingBlank(p.lines),
    lineCount: trimTrailingBlank(p.lines).length,
  }));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function run() {
  const doWrite = process.argv.includes("--write");
  const plan = [];
  const imports = [];

  // theme.css stays as-is (single @theme block, 474 lines < 500)
  imports.push("./core/theme.css");

  // --- utilities.css ---
  {
    const sections = splitByMarkers(readLines("utilities.css"));
    for (const sec of sections) {
      if (sec.name === "_preamble") continue; // skip banner
      const pieces = planFile(sec.name, sec.lines);
      for (const p of pieces) {
        plan.push({
          dest: join(CORE_DIR, "utilities", p.name),
          lines: p.lines,
          lineCount: p.lineCount,
        });
        imports.push(`./core/utilities/${p.name}`);
      }
    }
  }

  // --- components.css ---
  {
    const sections = splitByMarkers(readLines("components.css"));
    for (const sec of sections) {
      if (sec.name === "_preamble") continue;
      const pieces = planFile(sec.name, sec.lines);
      for (const p of pieces) {
        plan.push({
          dest: join(CORE_DIR, "components", p.name),
          lines: p.lines,
          lineCount: p.lineCount,
        });
        imports.push(`./core/components/${p.name}`);
      }
    }
  }

  // --- Report ---
  const violations = plan.filter((p) => p.lineCount > MAX_HARD);
  const warnings = plan.filter(
    (p) => p.lineCount > MAX_SOFT && p.lineCount <= MAX_HARD,
  );

  console.log(`\nSplit plan (${plan.length} files):`);
  for (const p of plan) {
    const flag = p.lineCount > MAX_HARD ? "  ❌" : p.lineCount > MAX_SOFT ? "  ⚠️ " : "  ✅";
    console.log(`  ${flag} ${p.lineCount.toString().padStart(4)}  core/${p.dest
      .replace(CORE_DIR + "\\", "")
      .replace(/\\/g, "/")}`);
  }
  if (warnings.length) {
    console.log(`\n⚠️  ${warnings.length} file(s) between ${MAX_SOFT}-${MAX_HARD} lines (soft limit).`);
  }
  if (violations.length) {
    console.log(`\n❌ ${violations.length} file(s) exceed ${MAX_HARD} lines — needs manual review.`);
  }

  // --- Write ---
  if (!doWrite) {
    console.log("\nDry run — no files written. Use --write to apply.");
    return;
  }

  for (const p of plan) {
    mkdirSync(dirname(p.dest), { recursive: true });
    writeFileSync(p.dest, p.lines.join("\n") + "\n", "utf8");
  }

  // Remove old merged files
  const oldMerged = ["utilities.css", "components.css"];
  for (const f of oldMerged) {
    const fp = join(CORE_DIR, f);
    if (existsSync(fp)) rmSync(fp);
  }

  // Regenerate index.css
  const indexContent = [
    '@import "tailwindcss";',
    "",
    ...imports.map((i) => `@import "${i}";`),
    "",
  ].join("\n");
  writeFileSync(INDEX_PATH, indexContent, "utf8");
  console.log(`\n✅ Wrote ${plan.length} files + regenerated index.css`);
}

run();
