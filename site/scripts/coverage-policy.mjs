/**
 * Coverage policy — honest dual metrics (2026-07-09).
 *
 * NEVER hardcode absolute statement totals / file counts from old runs.
 * Always derive mass from coverage-final.json on disk.
 *
 * WHY DUAL METRICS
 * ----------------
 * Vitest planner profile uses coverage.all + broad include (planner/**, lib/**, …).
 * That makes the HEADLINE total a "how much of the product is still dark" inventory.
 * Chasing **90% of that total** is virtually impossible and misleads agents who only
 * read the report footer — they thrash on zeros they never imported.
 *
 * GATES (what can fail CI / PLAN-FAIL-0408)
 * ----------------------------------------
 * - **Site profile** (`vitest.site.config.ts`): scoped include + thresholds 90/80/90/90.
 *   This is the enforceable ship floor when evidence is present.
 * - **Planner full-include total**: NOT a 90% ship gate. Report + dual rollup only.
 * - **Touched-files %**: diagnostic ("how thorough were the tests that ran?") — not a gate
 *   (would look artificially high if only a few files are imported).
 *
 * Per-file % on code under test remains the truth for "did this slice land?"
 */

/** Enforceable site-scope gate (matches vitest.site.config.ts thresholds). */
export const COVERAGE_GATE_SITE = {
  statements: 90,
  branches: 80,
  functions: 90,
  lines: 90,
  profile: "site",
  meaning: "Scoped site logic only — ship floor when proven with artifacts",
};

/**
 * Inventory target for full-include planner profile — aspirational, NOT ship.
 * Do not fail release solely because full-include total is below this.
 */
export const COVERAGE_INVENTORY_ASPIRATION = {
  statements: 90,
  branches: 80,
  functions: 90,
  lines: 90,
  profile: "planner-full-include",
  meaning:
    "Dark-product inventory only. Virtually unreachable while all:true + huge include. Not a chase number for slice work.",
};

/** @deprecated use COVERAGE_GATE_SITE — kept so older callers don't explode */
export const COVERAGE_GATE = COVERAGE_GATE_SITE;

/** HTML/CSV file status — vs **site** gate % (not frozen mass). */
export function fileStatusVsGate(pct, metric = "lines") {
  const gate = COVERAGE_GATE_SITE[metric] ?? COVERAGE_GATE_SITE.lines;
  if (pct >= gate) return `PASS (>= ${gate}% site gate)`;
  if (pct > 0 && pct >= gate * 0.5) return `PARTIAL (< ${gate}% site gate)`;
  if (pct > 0) return `LOW (< ${Math.round(gate * 0.5)}%)`;
  return "FAIL (0%)";
}

/**
 * Relative mass: is this file "large" in *this* run?
 * @param {number} stmtTotal file statements
 * @param {number} universeTotal all statements in same analysis
 * @param {number} share threshold share of universe (default 1%)
 */
export function isHighMassFile(stmtTotal, universeTotal, share = 0.01) {
  if (!universeTotal || universeTotal <= 0) return false;
  return stmtTotal / universeTotal >= share;
}

/**
 * Relative bucket mass: top share of universe (default 5%).
 */
export function isLargeBucket(stmtTotal, universeTotal, share = 0.05) {
  if (!universeTotal || universeTotal <= 0) return false;
  return stmtTotal / universeTotal >= share;
}

/** One-line agent instruction. */
export function coverageReadmeForAgents() {
  return [
    "Read coverage with two numbers:",
    "1) FULL include total = inventory of dark product (do NOT thrash to hit 90% here).",
    "2) Per-file / dual TOUCHED = did this slice's tests hit the modules under change.",
    "Ship gate for 0408 = site profile thresholds (scoped), not planner full-include total.",
  ].join(" ");
}
