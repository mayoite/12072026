#!/usr/bin/env node
/**
 * fix-raw-palette.mjs
 *
 * Replaces raw Tailwind palette classes (bg-gray-200, text-emerald-500, …)
 * with semantic utilities (bg-soft, text-success, …) per the FOCSS token system.
 *
 * Safety model:
 *   - "safe"  mappings are applied automatically with --write
 *   - "review" mappings (decorative colors, ambiguous context) are reported only
 *   - Dry-run by default; prints a full change log
 *
 * Usage:  node scripts/fix-raw-palette.mjs [--write]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SITE_ROOT = join(__dirname, "..");

// ---------------------------------------------------------------------------
// Mapping table — raw palette class → semantic utility
// ---------------------------------------------------------------------------
// Gray scale → surface/text/border tokens
//   gray-50    → bg-page / bg-subtle      (page or subtle surface)
//   gray-100   → bg-soft                  (soft surface)
//   gray-200   → border-soft / bg-muted   (light border or muted bg)
//   gray-300   → border-muted
//   gray-400   → text-subtle / border-muted
//   gray-500   → text-muted
//   gray-600   → text-muted
//   gray-700   → text-body
//   gray-800   → text-strong
//   gray-900   → text-heading
//
// Brand / info
//   blue-500, sky-500  → text-brand / text-primary
//
// Status
//   emerald-400/500, green-500  → text-success
//   amber-400/500, yellow-400/500  → text-warning
//   red-500, rose-500  → text-danger
//
// Decorative (pink, indigo, violet, fuchsia, purple, orange) → REVIEW
// ---------------------------------------------------------------------------

const SAFE_MAP = {
  // backgrounds
  "bg-gray-50": "bg-page",
  "bg-gray-100": "bg-soft",
  "bg-gray-200": "bg-muted",
  "bg-slate-50": "bg-page",
  "bg-slate-100": "bg-soft",
  "bg-slate-200": "bg-muted",
  "bg-neutral-50": "bg-page",
  "bg-neutral-100": "bg-soft",
  "bg-neutral-200": "bg-muted",
  "bg-gray-700": "bg-inverse-soft",
  "bg-gray-800": "bg-inverse",
  "bg-gray-900": "bg-inverse",
  "bg-slate-800": "bg-inverse",
  "bg-slate-900": "bg-inverse",
  "bg-neutral-800": "bg-inverse",
  "bg-neutral-900": "bg-inverse",
  "bg-zinc-900": "bg-inverse",
  "bg-stone-900": "bg-inverse",
  // text
  "text-gray-200": "text-inverse-muted",
  "text-gray-300": "text-inverse-muted",
  "text-gray-400": "text-subtle",
  "text-gray-500": "text-muted",
  "text-gray-600": "text-muted",
  "text-gray-700": "text-body",
  "text-gray-800": "text-strong",
  "text-gray-900": "text-heading",
  "text-slate-400": "text-subtle",
  "text-slate-500": "text-muted",
  "text-slate-600": "text-muted",
  "text-slate-700": "text-body",
  "text-slate-800": "text-strong",
  "text-slate-900": "text-heading",
  "text-neutral-400": "text-subtle",
  "text-neutral-500": "text-muted",
  "text-neutral-700": "text-body",
  "text-neutral-800": "text-strong",
  "text-neutral-900": "text-heading",
  "text-zinc-400": "text-subtle",
  "text-zinc-500": "text-muted",
  "text-zinc-600": "text-muted",
  "text-zinc-900": "text-heading",
  "text-stone-400": "text-subtle",
  "text-stone-500": "text-muted",
  "text-stone-900": "text-heading",
  // borders
  "border-gray-200": "border-soft",
  "border-gray-300": "border-muted",
  "border-gray-400": "border-muted",
  "border-gray-500": "border-strong",
  "border-gray-700": "border-strong",
  "border-slate-200": "border-soft",
  "border-slate-300": "border-muted",
  "border-slate-700": "border-strong",
  "border-neutral-200": "border-soft",
  "border-neutral-300": "border-muted",
  "border-neutral-700": "border-strong",
  "border-neutral-900": "border-strong",
  "border-zinc-300": "border-muted",
  "border-zinc-900": "border-strong",
  "border-stone-300": "border-muted",
  // ring
  "ring-neutral-900": "ring-strong",
  "ring-gray-900": "ring-strong",
  // brand
  "text-blue-500": "text-brand",
  "text-blue-600": "text-brand",
  "text-sky-500": "text-brand",
  "text-sky-600": "text-brand",
  "bg-blue-500": "bg-primary",
  "bg-blue-600": "bg-primary",
  "bg-sky-500": "bg-primary",
  "border-blue-500": "border-accent",
  "border-sky-500": "border-accent",
  // gradient stops (Tailwind v4 generates from-/to- from theme colors)
  "from-blue-500": "from-primary",
  "from-sky-500": "from-primary",
  "to-blue-500": "to-primary",
  "to-sky-500": "to-primary",
  // status — text
  "text-emerald-400": "text-success",
  "text-emerald-500": "text-success",
  "text-emerald-600": "text-success",
  "text-green-500": "text-success",
  "text-green-600": "text-success",
  "text-amber-400": "text-warning",
  "text-amber-500": "text-warning",
  "text-amber-600": "text-warning",
  "text-yellow-400": "text-warning",
  "text-yellow-500": "text-warning",
  "text-yellow-600": "text-warning",
  "text-red-500": "text-danger",
  "text-red-600": "text-danger",
  "text-rose-500": "text-danger",
  "text-rose-600": "text-danger",
  // status — backgrounds (soft variants)
  "bg-emerald-50": "bg-success-soft",
  "bg-green-50": "bg-success-soft",
  "bg-emerald-500": "bg-success",
  "bg-green-500": "bg-success",
  "bg-amber-50": "bg-warning-soft",
  "bg-yellow-50": "bg-warning-soft",
  "bg-amber-500": "bg-warning",
  "bg-yellow-500": "bg-warning",
  "bg-red-50": "bg-danger-soft",
  "bg-rose-50": "bg-danger-soft",
  "bg-red-500": "bg-danger",
  "bg-rose-500": "bg-danger",
  // status — borders
  "border-emerald-200": "border-accent",
  "border-emerald-500": "border-accent",
  "border-green-200": "border-accent",
  "border-green-500": "border-accent",
  "border-amber-200": "border-accent",
  "border-amber-500": "border-accent",
  "border-yellow-200": "border-accent",
  "border-red-200": "border-accent",
  "border-red-500": "border-accent",
  "border-rose-200": "border-accent",
  "border-rose-500": "border-accent",
};

// Decorative colors — report only, do not auto-replace
const REVIEW_COLORS = new Set([
  "pink",
  "fuchsia",
  "purple",
  "violet",
  "indigo",
  "orange",
  "lime",
  "teal",
  "cyan",
]);

// Solid status backgrounds / gradient stops with no token equivalent — review
const REVIEW_TOKENS = new Set([
  "from-emerald-500",
  "to-emerald-500",
  "from-amber-500",
  "to-amber-500",
  "from-red-500",
  "to-red-500",
  "from-yellow-500",
  "to-yellow-500",
]);

// Class token regex: prefix-color-scale  (e.g. bg-gray-200, text-emerald-500)
const PALETTE_RE =
  /\b(bg|text|border|fill|stroke|ring|from|to|via|outline|divide|shadow|caret|placeholder|accent)-([a-z]+)-(\d{2,3})\b/g;

const PREFIX_BG = new Set(["bg", "from", "to", "via", "fill", "stroke"]);
const PREFIX_TEXT = new Set(["text", "caret", "placeholder"]);
const PREFIX_BORDER = new Set(["border", "ring", "outline", "divide"]);

// ---------------------------------------------------------------------------
// Walker
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  "results",
  "outputs",
  ".git",
  "tech-stack-docs",
  "tech-stack-generator",
  "_archive",
]);

import { readdirSync, statSync } from "node:fs";

function walk(dir, acc = []) {
  if (!existsSyncSafe(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (full.endsWith(".tsx") || full.endsWith(".ts")) acc.push(full);
  }
  return acc;
}

function existsSyncSafe(p) {
  try {
    return statSync(p), true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function run() {
  const doWrite = process.argv.includes("--write");
  const files = walk(SITE_ROOT);
  const changes = [];
  const reviews = [];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    let changed = false;
    const out = lines.map((line, i) => {
      // Skip comment lines and import lines
      if (line.trim().startsWith("//") || line.trim().startsWith("*")) return line;

      let newLine = line;
      const lineReviews = [];

      PALETTE_RE.lastIndex = 0;
      let m;
      while ((m = PALETTE_RE.exec(newLine)) !== null) {
        const [full, prefix, color, scale] = m;
        const key = `${prefix}-${color}-${scale}`;

        if (SAFE_MAP[key]) {
          newLine =
            newLine.slice(0, m.index) +
            SAFE_MAP[key] +
            newLine.slice(m.index + full.length);
          changes.push({
            file: relative(SITE_ROOT, file),
            line: i + 1,
            from: full,
            to: SAFE_MAP[key],
            confidence: "safe",
          });
          changed = true;
          PALETTE_RE.lastIndex = m.index + SAFE_MAP[key].length;
        } else if (REVIEW_TOKENS.has(key)) {
          lineReviews.push({ full, prefix, color, scale, line: i + 1, reason: "solid status bg / gradient stop — no token equivalent" });
        } else if (REVIEW_COLORS.has(color)) {
          lineReviews.push({ full, prefix, color, scale, line: i + 1, reason: `decorative ${color} — manual mapping needed` });
        }
      }

      for (const r of lineReviews) {
        reviews.push({
          file: relative(SITE_ROOT, file),
          line: r.line,
          from: r.full,
          to: "REVIEW",
          reason: r.reason,
        });
      }

      return newLine;
    });

    if (doWrite && changed) {
      writeFileSync(file, out.join("\n"), "utf8");
    }
  }

  // --- Report ---
  console.log(`\n=== Raw palette → semantic utility replacement ===\n`);
  console.log(`Safe replacements: ${changes.length}`);
  console.log(`Review needed:     ${reviews.length}\n`);

  if (changes.length) {
    console.log("--- Safe replacements (will apply with --write) ---");
    const byFile = new Map();
    for (const c of changes) {
      if (!byFile.has(c.file)) byFile.set(c.file, []);
      byFile.get(c.file).push(c);
    }
    for (const [file, items] of byFile) {
      console.log(`\n  ${file} (${items.length})`);
      for (const it of items.slice(0, 8)) {
        console.log(`    L${it.line}: ${it.from} → ${it.to}`);
      }
      if (items.length > 8) console.log(`    … +${items.length - 8} more`);
    }
  }

  if (reviews.length) {
    console.log(`\n--- Review needed (decorative / ambiguous) ---`);
    const byColor = new Map();
    for (const r of reviews) {
      if (!byColor.has(r.from)) byColor.set(r.from, []);
      byColor.get(r.from).push(r);
    }
    for (const [token, items] of byColor) {
      console.log(`  ${token} (${items.length} uses in ${new Set(items.map((i) => i.file)).size} files)`);
    }
  }

  if (!doWrite) {
    console.log(`\nDry run — no files changed. Use --write to apply safe replacements.`);
  } else {
    const filesChanged = new Set(changes.map((c) => c.file)).size;
    console.log(`\n✅ Applied ${changes.length} safe replacements across ${filesChanged} files.`);
    console.log(`⚠️  ${reviews.length} decorative uses need manual review — see report above.`);
  }
}

run();
