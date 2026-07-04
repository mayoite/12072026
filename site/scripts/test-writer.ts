/**
 * test-writer — STUB (generator removed)
 *
 * IMPORTANT (plan mismatch addressed): This was NOT part of critic/09-detailed-plan.md P0.
 * P0 "test expansions, coverage" = direct edits to test files + evidence-captured runs (run-evidence-cmd.ps1 → results/).
 * Generator + CLI logic fully removed (search_replace) per review (D:\tmp\grok-review-tw001-plan.md) + task.
 * File retained only (archive-over-delete). Inert; emits warnings on use.
 *
 * See: critic/09-detailed-plan.md (updated note), Failures.md (tw001 removal entry).
 * For P0 work use direct test edits only (e.g. blocksResolver.test.ts style).
 *
 * (Original JSDoc/ design claims superseded; no codegen remains.)
 */

export type PlannerTestTarget = "resolver" | "catalog" | "ui" | "persistence";

export type PlannerFocusArea =
  | "happyPath"
  | "errorPaths"
  | "boundaries"
  | "uiGates"
  | "globalStandard";

export interface GeneratePlannerTestSuiteOptions {
  readonly target: PlannerTestTarget;
  readonly moduleName: string; // e.g. "blocksResolver", "guestProjectRepository", "WorkspaceShell"
  readonly focus?: readonly PlannerFocusArea[];
}

const DEFAULT_FOCUS: readonly PlannerFocusArea[] = ["happyPath", "errorPaths", "boundaries"] as const;

// Stubs (test-writer removed per plan mismatch resolution):
// Per critic/09-detailed-plan.md P0 (no generator task), review D:\tmp\grok-review-tw001-plan.md,
// and AGENTS.md "minimum necessary". P0 test expansions = direct edits + run-evidence-cmd wrappers
// to results/ (see P0-2, P0-3). This file retained (archive-over-delete) but generator logic removed.
// File now inert; do not use for P0 work. Types kept for any stray refs (none exist).
function hasFocus(focus: readonly PlannerFocusArea[] | undefined, area: PlannerFocusArea): boolean {
  return false; // generator removed
}

function buildHeader(opts: GeneratePlannerTestSuiteOptions): string {
  return `/* test-writer REMOVED (extraneous to critic/09-detailed-plan.md P0 remediation).
 * See Failures.md, D:\\tmp\\grok-review-tw001-plan.md, critic/09-detailed-plan.md note.
 * Use direct test file edits for coverage/expansions per plan.
 */\n`;
}

// All generator bodies, CLI, and impl removed (test-writer was extraneous to P0 per critic/09-detailed-plan.md).
// Retained file per archive-over-delete + min scope (no delete). No behavior change for callers (none).
// For actual P0 test expansions + coverage: perform direct edits to *.test.ts files then capture via
// scripts/run-evidence-cmd.ps1 (per testing-handbook, AGENTS, P0-2 in the plan).

export function generatePlannerTestSuite(opts: GeneratePlannerTestSuiteOptions): string {
  console.warn("[test-writer] REMOVED: generator not part of critic/09-detailed-plan.md P0 tasks (test expansions = direct edits + evidence runs). See review and plan note.");
  return "";
}

// CLI removed (no-op guard remains for safety)
function main(): void {
  console.warn("[test-writer] CLI removed per plan mismatch address.");
}

// Guard: only auto-run CLI when invoked directly (now warns only)
if (process.argv[1] && (process.argv[1].endsWith("test-writer.ts") || process.argv[1].endsWith("test-writer.js") || process.argv[1].includes("test-writer"))) {
  main();
}
