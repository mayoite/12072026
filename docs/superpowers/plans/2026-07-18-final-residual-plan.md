# Plan: Final residual wave

**Spec:** `docs/superpowers/specs/2026-07-18-final-residual-design.md`  
**Branch:** main · **No worktrees** · **Agents:** implement then 3 reviewers

## Tasks

### R1 — Dual-write readiness script
**Files:** `site/scripts/db_dual_write_readiness.ts` (new); optional `package.json` script name only if already pattern  
**Do:** Call `resolveSvgPublishDualWriteDeps({ forceR2Probe: true })`, print mode + r2Probe, exit 0 iff mode===enabled.  
**Verify:** script runs; exit code honest.

### R2 — Admin dual-write mode honesty
**Files:** Admin SVG list source meta — `AdminSvgEditorListView.tsx` and/or page server that can pass dual-write mode; prefer server component/page if dual-write is server-only.  
**Do:** Show "Dual-write: enabled | skipped_*" without claiming cutover.  
**Verify:** unit if pure helper; no client secrets.

### R3 — Guest Playwright smoke
**Files:** `site/tests/e2e/` new or extend guest smoke  
**Do:** guest route loads; Help or first-use or topbar testid visible.  
**Verify:** test file valid; may be skip without baseURL.

### R4 — Dual-write unit completeness
**Files:** resolveSvgPublishDualWrite + svgReleaseAuthority tests only  
**Do:** ensure skipped_schema_missing + enabled with schemaProbe covered.  
**Verify:** vitest green.

### R5 — Failures + report
**Files:** `Failures.md`, optional `agent-reports/2026-07-18-db-svg-residual.md`  
**Do:** exact remaining steps for cutover; pointer applied date.

## After implement
3 code reviewers: (1) correctness, (2) honesty/cutover claims, (3) test/a11y residuals.
