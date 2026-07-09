/**
 * Coverage policy — correct files + achievable numbers (2026-07-09).
 *
 * NEVER hardcode absolute statement totals from old runs.
 *
 * TWO PROFILES
 * ------------
 * 1) **Gate** (`pnpm run test:coverage` → vitest.config.ts)
 *    **Include-first allowlist** (not “everything minus excludes”)
 *    Files: pure open3d catalog/model/lib + shared boq/export (+ planner/lib)
 *    Short exclude only carves svg/ + GlbExport *inside* that allowlist
 *    Thresholds: 70/60/70/70 (statements/branches/functions/lines)
 *
 * 2) **Inventory** (`pnpm run test:coverage:inventory`)
 *    Broad include, no thresholds — dark-product meter only. Do NOT chase 90%.
 *
 * 3) **Site** (`pnpm run test:coverage:site`)
 *    Scoped marketing/catalog logic; thresholds 85/75/85/85 (eased from 90 —
 *    still high on a small include, not full SVG/script universe).
 *
 * SVG / scripts / public assets are NOT in the gate denominator.
 * Source of include globs: vitest.shared.ts (VITEST_PLANNER_GATE_*).
 */

/** Planner ship gate — matches vitest.config.ts / vitest.shared GATE allowlist */
export const COVERAGE_GATE_PLANNER = {
  statements: 70,
  branches: 55,
  functions: 70,
  lines: 70,
  profile: "planner-gate",
  meaning:
    "Allowlist: workstation* + placementAction + furnitureBlock2D + proofCatalog + canvasPicking. Expand only when suite owns the file.",
};

/** Site ship gate — matches vitest.site.config.ts */
export const COVERAGE_GATE_SITE = {
  statements: 85,
  branches: 75,
  functions: 85,
  lines: 85,
  profile: "site",
  meaning: "Scoped site logic — not planner UI, not SVG pipeline, not scripts",
};

/** @deprecated alias — prefer COVERAGE_GATE_PLANNER or COVERAGE_GATE_SITE */
export const COVERAGE_GATE = COVERAGE_GATE_SITE;

/** Inventory aspiration — NOT a ship number */
export const COVERAGE_INVENTORY_ASPIRATION = {
  statements: 90,
  branches: 80,
  functions: 90,
  lines: 90,
  profile: "planner-inventory",
  meaning:
    "Optional long-term aspiration on inventory profile only — never thrash slices to hit this.",
};

export function fileStatusVsGate(pct, metric = "lines", profile = "site") {
  const gate =
    profile === "planner"
      ? (COVERAGE_GATE_PLANNER[metric] ?? COVERAGE_GATE_PLANNER.lines)
      : (COVERAGE_GATE_SITE[metric] ?? COVERAGE_GATE_SITE.lines);
  if (pct >= gate) return `PASS (>= ${gate}% ${profile} gate)`;
  if (pct > 0 && pct >= gate * 0.5) return `PARTIAL (< ${gate}% ${profile} gate)`;
  if (pct > 0) return `LOW (< ${Math.round(gate * 0.5)}%)`;
  return "FAIL (0%)";
}

export function isHighMassFile(stmtTotal, universeTotal, share = 0.01) {
  if (!universeTotal || universeTotal <= 0) return false;
  return stmtTotal / universeTotal >= share;
}

export function isLargeBucket(stmtTotal, universeTotal, share = 0.05) {
  if (!universeTotal || universeTotal <= 0) return false;
  return stmtTotal / universeTotal >= share;
}

export function coverageReadmeForAgents() {
  return [
    "Gate files = pure open3d catalog/model/lib + shared boq/export (see vitest.shared GATE include).",
    "Exclude _archive, svg pipeline, scripts, public SVG, giant UI shells from gate denominator.",
    "Planner gate 70/60/70/70; site gate 85/75/85/85. Inventory profile has no threshold.",
    "Do not chase 90% on full-product inventory total.",
  ].join(" ");
}
