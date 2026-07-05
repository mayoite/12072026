#!/usr/bin/env node
/**
 * UI contract lint — warn-only until UI-0 lands across admin + open3d.
 * See plann/UI-PLAN-REVISED-2026-07-05.md
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_ROOT = fileURLToPath(new URL("..", import.meta.url));
const WARN_ONLY = !process.argv.includes("--strict") && process.env.LINT_UI_STRICT !== "1";

const violations = [];

const RAW_PALETTE = /\b(?:bg|text|border|ring|from|to|via)-(?:slate|blue|zinc|gray|emerald)-/;

function walk(dir, filter) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      entries.push(...walk(full, filter));
    } else if (filter(full)) {
      entries.push(full);
    }
  }
  return entries;
}

function checkAdminPalette() {
  const adminDir = join(SITE_ROOT, "app/admin");
  const files = walk(adminDir, (p) => /\.tsx$/.test(p));
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (RAW_PALETTE.test(text)) {
      violations.push(`${relative(SITE_ROOT, file)}: raw Tailwind palette class`);
    }
  }
}

function checkOpen3dTailwindInTsx() {
  const open3dDir = join(SITE_ROOT, "features/planner/open3d");
  const files = walk(open3dDir, (p) => /\.tsx$/.test(p));
  const utilityPattern = /className=["'`][^"'`]*\b(?:bg|text|border|p-|m-|flex|grid)-/;
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (utilityPattern.test(text)) {
      violations.push(`${relative(SITE_ROOT, file)}: Tailwind utility in open3d TSX`);
    }
  }
}

function checkOpen3dModuleHex() {
  const open3dDir = join(SITE_ROOT, "features/planner/open3d");
  const files = walk(open3dDir, (p) => /\.module\.css$/.test(p));
  const hexPattern = /#[0-9a-fA-F]{3,8}\b/;
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (hexPattern.test(text)) {
      violations.push(`${relative(SITE_ROOT, file)}: hex color in open3d CSS module`);
    }
  }
}

checkAdminPalette();
checkOpen3dTailwindInTsx();
checkOpen3dModuleHex();

if (violations.length === 0) {
  console.log("lint-ui-contract: ok");
  process.exit(0);
}

const header = WARN_ONLY
  ? "lint-ui-contract: warnings (set LINT_UI_STRICT=1 to fail)"
  : "lint-ui-contract: failed";

console.error(`${header}\n${violations.map((v) => `  - ${v}`).join("\n")}`);
process.exit(WARN_ONLY ? 0 : 1);
