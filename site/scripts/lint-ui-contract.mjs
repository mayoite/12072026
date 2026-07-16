#!/usr/bin/env node
/**
 * UI contract lint — anti-drift for current scheme (MODULE-UI-CONTRACT).
 * Strict: pnpm --filter oando-site run lint:ui:strict
 *
 * Surfaces:
 * - open3d TSX: no Tailwind utilities (CSS modules + tokens only)
 * - open3d CSS modules: no raw hex
 * - admin + planner: no raw Tailwind palette (slate/blue/zinc/gray/emerald)
 * - planner CSS: no raw hex/rgb literals outside the token source
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_ROOT = fileURLToPath(new URL("..", import.meta.url));
const WARN_ONLY = !process.argv.includes("--strict") && process.env.LINT_UI_STRICT !== "1";

const violations = [];

/** Avoid matching "translate" (contains letters s-l-a-t-e). */
const RAW_PALETTE =
  /\b(?:bg|text|border|ring|from|to|via|fill|stroke)-(?:slate|blue|zinc|gray|emerald|neutral|stone)-(?:\d{2,3}|black|white)\b/;

const PLANNER_TAILWIND_UTIL =
  /className=["'`][^"'`]*\b(?:bg|text|border|p-|m-|flex|grid|gap-|px-|py-|pt-|pb-|pl-|pr-|mt-|mb-|ml-|mr-|w-|h-|min-h-|max-h-|rounded|shadow)-/;

function walk(dir, filter) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return [];
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === ".next" || name === "_archive") continue;
      entries.push(...walk(full, filter));
    } else if (filter(full)) {
      entries.push(full);
    }
  }
  return entries;
}

function checkSurfacePalette() {
  const roots = [
    join(SITE_ROOT, "app/admin"),
    join(SITE_ROOT, "features/admin"),
    join(SITE_ROOT, "features/planner"),
    join(SITE_ROOT, "app/planner"),
  ];
  for (const root of roots) {
    const files = walk(root, (p) => /\.tsx$/.test(p));
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (RAW_PALETTE.test(text)) {
        violations.push(`${relative(SITE_ROOT, file)}: raw Tailwind palette class`);
      }
    }
  }
}

function checkOpen3dTailwindInTsx() {
  const plannerDir = join(SITE_ROOT, "features/planner/workspace");
  const files = walk(plannerDir, (p) => /\.tsx$/.test(p));
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (PLANNER_TAILWIND_UTIL.test(text)) {
      violations.push(`${relative(SITE_ROOT, file)}: Tailwind utility in open3d TSX`);
    }
  }
}

function checkPlannerCssRawColors() {
  const roots = [
    join(SITE_ROOT, "features/planner"),
    join(SITE_ROOT, "app/css/core/locked/planner"),
  ];
  const files = roots.flatMap((root) => walk(root, (p) => /\.css$/.test(p)));
  const rawColorPattern = /#[0-9a-fA-F]{3,8}\b|rgba?\s*\(/;
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (rawColorPattern.test(text)) {
      violations.push(`${relative(SITE_ROOT, file)}: raw color in planner CSS`);
    }
  }
}

function checkNoLucideInPlanner() {
  const roots = [
    join(SITE_ROOT, "features/planner"),
    join(SITE_ROOT, "app/planner"),
  ];
  for (const root of roots) {
    const files = walk(root, (p) => /\.(tsx|ts)$/.test(p));
    for (const file of files) {
      if (file.includes(`${join("features", "planner", "_archive")}`)) continue;
      const text = readFileSync(file, "utf8");
      if (text.includes("lucide-react")) {
        violations.push(`${relative(SITE_ROOT, file)}: lucide-react forbidden (Phosphor only)`);
      }
    }
  }
}

checkSurfacePalette();
checkOpen3dTailwindInTsx();
checkPlannerCssRawColors();
checkNoLucideInPlanner();

if (violations.length === 0) {
  console.log("lint-ui-contract: ok (scheme freeze)");
  process.exit(0);
}

const header = WARN_ONLY
  ? "lint-ui-contract: warnings (set LINT_UI_STRICT=1 or --strict to fail)"
  : "lint-ui-contract: failed";

console.error(`${header}\n${violations.map((v) => `  - ${v}`).join("\n")}`);
process.exit(WARN_ONLY ? 0 : 1);
