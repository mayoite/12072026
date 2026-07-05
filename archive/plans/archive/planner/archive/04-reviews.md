# Area D — Reviews

## D1. code-review (performed directly)

Focus: staged `site/features/planner/editor/PlannerWorkspace.tsx` diff + adjacent wiring (`PlannerSubTopBar`, `PlannerStatusBar`, `usePlannerPanels`, `plannerToolVisibility`).

Prioritize: **bugs, behavioral regressions, security issues, missing tests**. Findings table sorted by severity.

### D1 findings (2026-06-30)

| Severity | Location | Finding | Status |
|---|---|---|---|
| Medium | `fabricDrawTools.ts` | Door/Window click placement could bypass wall proximity checks and create floating openings. | ✅ Fixed (nearest wall distance guard `<=20` before insert). |
| Low | `floorplanCanvas.ts` | `window.__plannerFabricView` exposed in all sessions. | ✅ Fixed (exposed only when `navigator.webdriver` is true, cleared on dispose). |
| Low | `plannerToolFabricBridge.ts` | Switches used `default` without exhaustive never checks. | ✅ Fixed (`assertNever` + explicit `Tool`/`FabricDrawTool` cases). |
| Low | `PlannerWorkspace.tsx` | Dead code `_toggleLeftCollapsed`, `_handleResetChromeLayout`. | Deferred (reversible keep-by-plan; no functional/security impact). |
| Info | tests | Door/window source covered only by E2E; no unit test for snap/remove. | Open (test debt, non-blocking). |

## D2. review-security (subagent)

Launch exactly one `security-review` subagent:

- `readonly: true`
- `run_in_background: false`
- `subagent_type: "security-review"`
- Prompt:
  ```
  Full Repository Path: D:\OOFPLWeb
  Diff: uncommitted changes
  Custom Instructions: focus on planner production source (site/features/planner/editor/PlannerWorkspace.tsx and adjacent chrome/panel/visibility wiring)
  ```

After completion, summarize:

- No diff → one sentence.
- No issues → one-line status.
- Issues → compact markdown table: Severity | Location (file:line) | Finding, sorted by severity (highest first).

### D2 findings (2026-06-30)

**No medium, high, or critical security issues.** Subagent reviewed the uncommitted planner/canvas diff and confirmed no auth, data-leak, or cross-tenant boundary regressions. Optional note: webdriver gating is convenience hardening, not a strict security boundary.

## Scope note

Diff is **uncommitted** (we're on `main`, merge-base = HEAD). Current planner review/fix scope: `fabricDrawTools.ts`, `floorplanCanvas.ts`, `plannerToolFabricBridge.ts`, and planner E2E helper/spec updates.
