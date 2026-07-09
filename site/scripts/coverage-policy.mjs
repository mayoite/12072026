/**
 * Coverage **policy** targets (from Failures.md / quality gates).
 *
 * These are intentional gate bars — NOT frozen run artifacts.
 *
 * NEVER put absolute statement totals, file counts, or historical
 * denominators here (e.g. "19924 stmts"). Always derive mass from
 * coverage-final.json on disk for the current run.
 */

/** PLAN-FAIL-0408 / quality-gates hard floor intent */
export const COVERAGE_GATE = {
  statements: 90,
  branches: 80,
  functions: 90,
  lines: 90,
};

/** HTML/CSV file status bands — relative to gate, not a second frozen bar */
export function fileStatusVsGate(pct, metric = "lines") {
  const gate = COVERAGE_GATE[metric] ?? COVERAGE_GATE.lines;
  if (pct >= gate) return `PASS (>= ${gate}% gate)`;
  if (pct > 0 && pct >= gate * 0.5) return `PARTIAL (< ${gate}% gate)`;
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
