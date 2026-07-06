# Unified Planner — Scope

**Archived:** 2026-06-29 → `archive/plans/done/planner-unified-3-file-plan/`. Live status: root [`Failures.md`](../../../Failures.md).

Read **`01-execution-plan.md`** for pending proof work.

## Section order (do not reorder)

1. Runtime cleanup → 2. Startup performance → 3. State/persistence + baseline AI → 4. Catalog/DB → 5. Close

## Scope locks

- **Sketch recovery** → `archive/plans/done/sketch-to-plan-3-file-plan/` only (not §3 E2E here).
- Do not reopen `archive/plans/wip/planner-unified-10-file-plan/` for execution steps.
- No Playwright or `release:gate` until known failures in `Failures.md` are cleared (gate policy).

## Rules

Paths under `site/`. Log gaps in `Failures.md`.
