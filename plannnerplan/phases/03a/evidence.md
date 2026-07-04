# Phase 03A Evidence

Date: 2026-07-03

## Implemented

- Inventory/SVG modules promoted to `site/features/planner/open3d/catalog/` and `site/tests/unit/features/planner/open3d/` (migrated from `OOPlanner/tests/`; staging `src/` removed).
- Preserved exact physical SVG dimensions in main and fallback SVG outputs.

## Verified

- `results/planner/phase-03/benchmark-exceed/`: isolated benchmark run exit 0 — 1K search p95 `14.843ms` (stretch ≤50ms), 10K search p95 `87.135ms` (stretch ≤100ms), SVG generation p95 `0.020ms` (stretch ≤5ms).
- `results/planner/phase-03/benchmark-03a-current/`: prior floor budgets still met.
- `results/planner/phase-00/ooplanner-coverage-benchmark-exceed/`: coverage run exit 1 — global statements `84.16%` (up from ~59%); hard floor `92%` not met.
- OOPlanner, open3d-next-staging, and oando-site typecheck: exit 0 (`results/planner/phase-00/ooplanner-typecheck-benchmark-exceed/`).

## Failed

- Coverage hard floor `92%` / target `95%`: global statements `84.16%`, branches `73.88%`, functions `79.38%`, lines `84.14%`. Remaining gap dominated by `src/editor/*` (WorkspaceShell, PropertiesPanel, InventoryPanel) and partial AI/export branches.

## Open

- Virtualized-grid UI behavior is contract-only; final UI remains Phase 05.
- SVG fixture gallery evidence is still incomplete.
- ~~Accepted modules still need to be mirrored/moved from `open3d-next-staging/` into `site/features/planner/open3d/`~~ **Done** — site is production source; mirrors are archive-only.
