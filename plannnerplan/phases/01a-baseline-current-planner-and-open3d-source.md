# 01A: Baseline

## Paths

- Donor: `open3d-floorplan/`
- **Production (build here):** `site/features/planner/open3d/`
- **Tests:** `site/tests/unit/features/planner/open3d/`
- **Routes:** `site/app/planner/` — guest/canvas → Fabric `PlannerWorkspaceRoute`; `/planner/open3d` → native pilot (`Open3dPlannerHost`)
- Archive mirrors: `OOPlanner/`, `open3d-next-staging/` (reference only)

## Rules

- Donor supplies behavior, not UI design.
- Build and test in **`site/`** (`pnpm --filter oando-site`); do not treat `OOPlanner/` as the working copy.
- Fabric fallback remains at `/planner/fabric/*` until explicit cleanup approval.
- Use canonical `site/app/css/` tokens.
- Production code: no `any`, ignores, skipped lines, or test bypasses.
- Coverage: 95% statements, branches, functions, and lines, globally and per file.

## Checklist

- [x] Verify donor package, source, and MIT license.
- [x] Create `OOPlanner` from the React staging source.
- [x] Add `/planner`, `/planner/guest`, `/planner/canvas`, `/planner/help`, and feature routes.
- [x] Verify unit choices: `mm`, `cm`, `m`, `in`, `ft-in`.
- [x] Capture browser baseline and console state.
- [x] Audit benchmark, theme, type safety, and coverage configuration.
- [ ] Repair recorded quality failures.
- [ ] Pass typecheck, tests, coverage, build, and browser workflow checks.

## Exit

01A is complete only when `evidence.md` has no unresolved blocking failure.
