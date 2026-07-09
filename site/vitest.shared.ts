import path from "path";

/** Site package root (same folder as vitest.config.ts). */
export const VITEST_REPO_ROOT = path.resolve(__dirname);
export const VITEST_WORKSPACE_ROOT = path.resolve(VITEST_REPO_ROOT, "..");

export const VITEST_RESULTS_DIR = path.resolve(VITEST_WORKSPACE_ROOT, "results/tests");

export const VITEST_REPORT_PATHS = {
  full: {
    json: path.resolve(VITEST_RESULTS_DIR, "vitest-results.json"),
    console: path.resolve(VITEST_RESULTS_DIR, "vitest-console.json"),
    csv: path.resolve(VITEST_RESULTS_DIR, "vitest-results.csv"),
    html: path.resolve(VITEST_RESULTS_DIR, "vitest-results.html"),
  },
  site: {
    json: path.resolve(VITEST_RESULTS_DIR, "vitest-site-results.json"),
    console: path.resolve(VITEST_RESULTS_DIR, "vitest-site-console.json"),
    csv: path.resolve(VITEST_RESULTS_DIR, "vitest-site-results.csv"),
    html: path.resolve(VITEST_RESULTS_DIR, "vitest-site-results.html"),
  },
} as const;

export const VITEST_CONSOLE_REPORTER = path.resolve(
  VITEST_REPO_ROOT,
  "config/build/vitest-console-reporter.ts",
);

export const VITEST_COVERAGE_DIRS = {
  full: path.resolve(VITEST_WORKSPACE_ROOT, "results/coverage"),
  site: path.resolve(VITEST_WORKSPACE_ROOT, "results/coverage-site"),
} as const;

/** Human-readable coverage reports (CSV/HTML/JSON) — separate from raw Vitest output. */
export const VITEST_COVERAGE_REPORT_DIRS = {
  full: path.resolve(VITEST_WORKSPACE_ROOT, "results/coverage-reports/planner"),
  site: path.resolve(VITEST_WORKSPACE_ROOT, "results/coverage-reports/site"),
} as const;

export const VITEST_SETUP_FILE = path.resolve(VITEST_REPO_ROOT, "tests/setup.ts");

export const VITEST_COMMON_EXCLUDE = [
  "**/node_modules/**",
  "**/.cursor/**",
  "**/.vscode/**",
  "**/.next/**",
  "**/.git/**",
  "**/.github/**",
  "**/.playwright-cli/**",
  "**/.turbo/**",
  "**/.vercel/**",
  "**/.swc/**",
  "**/.output/**",
  "**/__snapshots__/**",
  "**/__mocks__/**",
  "**/*.md",
  "**/*.log",
  "**/*.txt",
  "**/*.csv",
  "**/*.svg",
  "**/*.stories.*",
  "**/archive/**",
  "**/public/**",
  "**/results/**",
  "**/scripts/**",
  "**/Plans/**",
  "**/docs/**",
  "**/Agents/**",
  "**/tech-stack-docs/**",
  "**/tech-stack-generated/**",
] as const;

export const VITEST_COMMON_COVERAGE_REPORTERS = [
  "text",
  "json",
  "json-summary",
  "html",
] as const;

/**
 * Planner **ship-gate** coverage — **include-first (allowlist)**, not exclude-from-everything.
 *
 * Why include beats exclude:
 * - Broad `features/planner/**` + exclude always leaks SVG, _archive, UI shells into the denominator.
 * - 90% on that universe is fantasy; agents thrash on a broken scoreboard.
 *
 * Gate include = pure / ownable modules we actually unit-test.
 * Not in the list = not in the gate (UI shells, 3d viewers, svg pipeline, scripts, public).
 *
 * Exclude list is only for carving noise *inside* allowlisted globs (e.g. catalog/svg/**).
 * Inventory of dark product = `test:coverage:inventory` (broader include, no threshold).
 */
export const VITEST_PLANNER_GATE_COVERAGE_INCLUDE = [
  // Allowlist only — anything not listed is out of the gate denominator
  "features/planner/open3d/catalog/**/*.ts",
  "features/planner/open3d/model/**/*.ts",
  "features/planner/open3d/lib/**/*.{ts,tsx}",
  "features/planner/shared/boq/**/*.ts",
  "features/planner/shared/export/**/*.ts",
  "features/planner/lib/**/*.ts",
] as const;

/** Carve-outs only for paths that match the allowlist globs above (keep short). */
export const VITEST_PLANNER_GATE_COVERAGE_EXCLUDE = [
  "**/open3d/catalog/svg/**",
  "**/*GlbExport*",
  "**/*.d.ts",
  "**/*.test.{ts,tsx}",
  "**/*.spec.{ts,tsx}",
  "**/*.mock.{ts,tsx}",
  "**/node_modules/**",
] as const;

/**
 * Achievable ship floor on the gate include (not full-product inventory).
 * Ratchet up only when dual rollup + per-file evidence shows headroom.
 */
export const VITEST_PLANNER_GATE_THRESHOLDS = {
  statements: 70,
  branches: 60,
  functions: 70,
  lines: 70,
} as const;

/** Broader inventory include — report only, no thresholds (dark-product meter). */
export const VITEST_PLANNER_INVENTORY_COVERAGE_INCLUDE = [
  "app/api/**/*.{ts,tsx}",
  "features/planner/**/*.{ts,tsx}",
  "features/crm/**/*.{ts,tsx}",
  "lib/**/*.{ts,tsx}",
  "platform/**/*.{ts,tsx}",
] as const;
