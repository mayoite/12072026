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
  "**/tests/integration/planner-editor-**",
  "**/tests/integration/planner-canvas-fabric-**",
  "**/tests/unit/planner-editor-**",
  "**/tests/unit/planner-canvas-fabric-**",
  "**/tests/unit/planner-fabric-**",
  "**/tests/unit/planner-lib-fabric**",
  "**/tests/unit/planner-ai-fabric**",
  "**/tests/unit/planner-document-plannerDocument**",
  "**/tests/unit/applySuggestedLayout**",
  "**/tests/unit/planner-3d-parity**",
  "**/tests/integration/planner-fabric-**",
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
 * Planner **ship-gate** coverage — **include-first allowlist** (owner/agent call 2026-07-09).
 *
 * Only modules we actively unit-test and own as pure rules. Expand this list when
 * a folder has real suite coverage — do not re-add whole catalog/model trees.
 *
 * OUT of gate by not listing: UI shells, 3d, svg pipeline, inventory UI, _archive,
 * scripts, public, CRM, lib/** dump, shared/export PDF, etc.
 *
 * Inventory (dark product) = `test:coverage:inventory` — no threshold.
 */
export const VITEST_PLANNER_GATE_COVERAGE_INCLUDE = [
  // Systems v0 spine (unit-tested; expand only when suite owns the file)
  "features/planner/project/catalog/workstation*.ts",
  "features/planner/project/catalog/placementAction.ts",
  "features/planner/project/catalog/furnitureBlock2D.ts",
  "features/planner/project/catalog/proofCatalog.ts",
  "features/planner/project/lib/geometry/canvasPicking.ts",
] as const;

/** Carve-outs inside allowlist globs only (keep tiny). */
export const VITEST_PLANNER_GATE_COVERAGE_EXCLUDE = [
  "**/*.d.ts",
  "**/*.test.{ts,tsx}",
  "**/*.spec.{ts,tsx}",
  "**/*.mock.{ts,tsx}",
  "**/node_modules/**",
] as const;

/**
 * Ship floor on the gate allowlist only.
 * Agent call: 70/55/70/70 — matches live systems-spine suite; ratchet after expand.
 */
export const VITEST_PLANNER_GATE_THRESHOLDS = {
  statements: 70,
  branches: 55,
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
