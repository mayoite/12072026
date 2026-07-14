/**
 * Diagnostic only (not a gate). Explains *why* coverage % looks low.
 *
 * Requires a prior run that wrote results/coverage/coverage-final.json:
 *   pnpm run test:coverage
 * then:
 *   node scripts/analyze-coverage-gap.mjs
 *
 * Fixed 2026-07-09:
 * - no frozen statement totals from old runs (NEVER hardcode mass)
 * - recursive tests/** discovery (not only tests/*.test.ts)
 * - open3d wording (tldraw era removed)
 * - dual rollup: full include vs touched-only (live from this JSON)
 */
import fs from "node:fs";
import path from "node:path";
import { dualRollupFromFinal } from "./coverage-metrics.mjs";

const repoRoot = process.cwd();
const workspaceRoot =
  path.basename(repoRoot) === "site" ? path.resolve(repoRoot, "..") : repoRoot;
const covPath = path.join(workspaceRoot, "results/coverage/coverage-final.json");

if (!fs.existsSync(covPath)) {
  console.error(
    "Missing results/coverage/coverage-final.json — run: pnpm run test:coverage",
  );
  process.exit(1);
}

const cov = JSON.parse(fs.readFileSync(covPath, "utf8"));

// --- Dual rollup: full include vs only files tests actually hit ---
const dual = dualRollupFromFinal(cov);
console.log("=== DUAL ROLLUP (why headline % feels wrong) ===\n");
console.log(
  `Instrumented files: ${dual.filesFull}  |  touched (≥1 stmt hit): ${dual.filesTouched}  |  pure 0%: ${dual.filesZero}`,
);
console.log(
  `FULL include statements:  ${dual.full.statements.covered}/${dual.full.statements.total} = ${dual.full.statements.pct}%`,
);
console.log(
  `TOUCHED files only:       ${dual.touched.statements.covered}/${dual.touched.statements.total} = ${dual.touched.statements.pct}%`,
);
console.log(
  `TOUCHED lines:            ${dual.touched.lines.covered}/${dual.touched.lines.total} = ${dual.touched.lines.pct}%`,
);
console.log(
  "\n→ Per-file % on modules you tested is usually honest; the TOTAL is diluted by force-included zeros.",
);
console.log(
  "→ DO NOT chase 90% of FULL include — virtually impossible; that bar is inventory, not a slice ship gate.",
);
console.log(
  "→ Ship floor (PLAN-FAIL-0408) = site profile thresholds, not this planner total. See coverage-policy.mjs.\n",
);

function norm(f) {
  return f.replace(/\\/g, "/").toLowerCase();
}

function scopeBucket(n) {
  if (n.includes("/features/planner/")) return "features/planner";
  if (n.includes("/features/")) return "features/other";
  if (n.includes("/app/")) return "app";
  if (n.includes("/components/")) return "components";
  if (n.includes("/lib/")) return "lib";
  if (n.includes("/data/")) return "data";
  if (n.includes("/platform/")) return "platform";
  return "other";
}

// --- Source statement inventory ---
const buckets = {};
let grandStmts = 0;
let grandFiles = 0;
for (const [f, d] of Object.entries(cov)) {
  const n = norm(f);
  const bucket = scopeBucket(n);
  const st = d.s || {};
  const total = Object.keys(st).length;
  const covered = Object.values(st).filter((v) => v > 0).length;
  if (!buckets[bucket]) {
    buckets[bucket] = { files: 0, stmts: 0, covered: 0, zeroFiles: 0 };
  }
  buckets[bucket].files++;
  buckets[bucket].stmts += total;
  buckets[bucket].covered += covered;
  if (total > 0 && covered === 0) buckets[bucket].zeroFiles++;
  grandStmts += total;
  grandFiles++;
}

console.log("=== COVERAGE DENOMINATOR (statements in coverage-final.json) ===\n");
const order = [
  "features/planner",
  "app",
  "lib",
  "platform",
  "components",
  "features/other",
  "data",
  "other",
];
for (const key of order) {
  const b = buckets[key];
  if (!b) continue;
  const pct = b.stmts ? ((100 * b.covered) / b.stmts).toFixed(1) : "0";
  const share = grandStmts
    ? ((100 * b.stmts) / grandStmts).toFixed(1)
    : "0";
  console.log(
    `${key.padEnd(20)} ${String(b.stmts).padStart(6)} stmts (${share}% of total) | covered ${pct}% | ${b.zeroFiles}/${b.files} files at 0%`,
  );
}
console.log(
  `\nTotal in report: ${grandStmts} statements across ${grandFiles} files (live totals — not frozen)`,
);

// --- Test import targets (recursive) ---
function walkTestFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTestFiles(abs, out);
    else if (/\.test\.(ts|tsx)$/.test(entry.name)) out.push(abs);
  }
  return out;
}

const testsRoot = path.join(repoRoot, "tests");
const testFiles = walkTestFiles(testsRoot);
const importScopes = {
  planner: 0,
  "features-other": 0,
  lib: 0,
  components: 0,
  app: 0,
  data: 0,
  platform: 0,
  none: 0,
};
const byTest = [];

for (const file of testFiles) {
  const text = fs.readFileSync(file, "utf8");
  const imports = [...text.matchAll(/from ["'](@\/[^"']+)["']/g)].map(
    (m) => m[1],
  );
  const scopes = new Set();
  for (const imp of imports) {
    if (imp.startsWith("@/features/planner")) scopes.add("planner");
    else if (imp.startsWith("@/features/")) scopes.add("features-other");
    else if (imp.startsWith("@/lib/")) scopes.add("lib");
    else if (imp.startsWith("@/components/")) scopes.add("components");
    else if (imp.startsWith("@/app/")) scopes.add("app");
    else if (imp.startsWith("@/platform/")) scopes.add("platform");
    else if (imp.startsWith("@/features/site/data/")) scopes.add("data");
  }
  if (scopes.has("planner")) importScopes.planner++;
  if (scopes.has("features-other")) importScopes["features-other"]++;
  if (scopes.has("lib")) importScopes.lib++;
  if (scopes.has("components")) importScopes.components++;
  if (scopes.has("app")) importScopes.app++;
  if (scopes.has("data")) importScopes.data++;
  if (scopes.has("platform")) importScopes.platform++;
  if (scopes.size === 0) importScopes.none++;
  byTest.push({
    file: path.relative(repoRoot, file).replace(/\\/g, "/"),
    scopes: [...scopes],
    importCount: imports.length,
  });
}

console.log(
  `\n=== TEST TARGETS (${testFiles.length} Vitest files under tests/**) ===\n`,
);
console.log("Files importing from each scope:");
for (const [k, v] of Object.entries(importScopes)) {
  console.log(`  ${k}: ${v} test files`);
}

const noScope = byTest.filter((t) => t.scopes.length === 0);
if (noScope.length) {
  console.log(
    "\nSample test files with no @/feature/lib/app imports:",
    noScope
      .slice(0, 12)
      .map((t) => t.file)
      .join(", "),
    noScope.length > 12 ? `… (+${noScope.length - 12})` : "",
  );
}

const uiTests = byTest.filter(
  (t) => t.scopes.includes("components") || t.scopes.includes("app"),
);
console.log(`\nTest files touching app/ or components/: ${uiTests.length}`);

// --- Planner: tested islands vs desert ---
const plannerFiles = [];
let plannerStmtTotal = 0;
for (const [f, d] of Object.entries(cov)) {
  const n = norm(f);
  if (!n.includes("/features/planner/")) continue;
  const st = d.s || {};
  const total = Object.keys(st).length;
  const covered = Object.values(st).filter((v) => v > 0).length;
  if (!total) continue;
  plannerStmtTotal += total;
  plannerFiles.push({
    rel: f.replace(/\\/g, "/").split("/features/planner/")[1],
    pct: Math.round((1000 * covered) / total) / 10,
    total,
    covered,
  });
}

const plannerTested = plannerFiles.filter((f) => f.pct > 0);
const plannerZero = plannerFiles.filter((f) => f.pct === 0);
const zeroStmts = plannerZero.reduce((a, f) => a + f.total, 0);

console.log("\n=== PLANNER SPLIT ===\n");
console.log(
  `Files with any coverage: ${plannerTested.length}/${plannerFiles.length}`,
);
console.log(
  `Files at 0%: ${plannerZero.length} (${
    plannerFiles.length
      ? Math.round((100 * plannerZero.length) / plannerFiles.length)
      : 0
  }%)`,
);
console.log(
  `Statements in 0% files: ${zeroStmts} (${
    plannerStmtTotal
      ? ((100 * zeroStmts) / plannerStmtTotal).toFixed(1)
      : "0"
  }% of planner stmts)`,
);

const dirs = {};
for (const f of plannerFiles) {
  const dir = f.rel.split("/")[0] || "root";
  if (!dirs[dir]) dirs[dir] = { total: 0, covered: 0, files: 0, zero: 0 };
  dirs[dir].total += f.total;
  dirs[dir].covered += f.covered;
  dirs[dir].files++;
  if (f.pct === 0) dirs[dir].zero++;
}
console.log("\nPlanner by top-level dir:");
for (const [dir, d] of Object.entries(dirs).sort(
  (a, b) => b[1].total - a[1].total,
)) {
  const pct = d.total ? ((100 * d.covered) / d.total).toFixed(1) : "0.0";
  console.log(
    `  ${dir.padEnd(16)} ${pct.padStart(5)}% | ${d.zero}/${d.files} files at 0% | ${d.total} stmts`,
  );
}

console.log("\n=== ROOT CAUSES (current model) ===");
console.log(
  "1. vitest.config coverage.include force-includes untested files as 0% (correct honesty, lowers %).",
);
console.log(
  "2. Planner tests hit pure modules heavily; editor/open3d UI and hooks often stay at 0%.",
);
console.log(
  "3. Many tests exercise the same well-covered libs — file count ≠ unique covered surface.",
);
console.log(
  "4. Playwright e2e is excluded from V8 coverage — browser journeys do not raise %.",
);
console.log(
  "5. PLAN-FAIL-0408: gate % is policy (coverage-policy.mjs), not a frozen mass total — this script diagnoses only.",
);
