# Phase 07 — Structure mirror (OOPlanner ↔ site/features/planner)

Date: 2026-07-03

## Summary

Restructured `OOPlanner/src/` (and synced `open3d-next-staging/src/`) to align top-level folder names with `site/features/planner/` for Phase 07 promotion into `site/features/planner/open3d/`.

## Before → after (top 2 levels)

### Before (`OOPlanner/src/`)

```
adapters/          ai/               catalog/
commands/          components/       export/
geometry/          import/           inventory/
model/             operations/       persistence/
store/             svg/              three-lazy/
```

### After (`OOPlanner/src/`)

```
3d/                ai/               canvas-fabric/
catalog/           editor/           lib/
model/             persistence/      shared/
store/
```

Nested mirrors:

| Site | OOPlanner (after) |
|------|-------------------|
| `catalog/` | `catalog/` (+ `catalog/inventory/`, `catalog/svg/`) |
| `model/` | `model/` (+ `model/actions/`, `model/operations/`) |
| `editor/` | `editor/` (was `components/` + `components/workspace/`) |
| `canvas-fabric/` | `canvas-fabric/` (`FeasibilityCanvas.tsx`) |
| `3d/` | `3d/` (was `three-lazy/`) |
| `shared/export/` | `shared/export/` (was `export/`) |
| `shared/document/` | `shared/document/` (was `adapters/`) |
| `lib/` | `lib/` (+ `lib/geometry/`, `lib/commands/`) |
| `lib/geometry/` | `lib/geometry/` (was `geometry/`) |

## Mapping table

| `site/features/planner/` | Was (`OOPlanner/src/`) | Now (`OOPlanner/src/`) |
|--------------------------|------------------------|------------------------|
| `ai/` | `ai/` | `ai/` |
| `catalog/` | `catalog/` | `catalog/` |
| `catalog/` (inventory UI data) | `inventory/` | `catalog/inventory/` |
| `catalog/` (SVG symbols) | `svg/` | `catalog/svg/` |
| `model/` | `model/` | `model/` |
| `model/` (imperative actions) | `operations/` | `model/actions/` |
| `model/` (pure reducers) | `model/operations/` | `model/operations/` |
| `persistence/` | `persistence/` | `persistence/` |
| `store/` | `store/` | `store/` |
| `editor/` | `components/`, `components/workspace/` | `editor/` |
| `canvas-fabric/` | `components/FeasibilityCanvas.tsx` | `canvas-fabric/FeasibilityCanvas.tsx` |
| `3d/` | `three-lazy/` | `3d/` |
| `shared/export/` | `export/` | `shared/export/` |
| `shared/document/` | `adapters/` | `shared/document/` |
| `lib/` | `import/` | `lib/` (`imageImport.ts`) |
| `lib/geometry/` | `geometry/` | `lib/geometry/` |
| `lib/` (commands registry) | `commands/` | `lib/commands/` |

## Files moved

- **~79** production `src/` files reorganized (moves + import rewrites across **54** TypeScript modules + **23** test files).
- Barrel `index.ts` added: `3d/`, `catalog/`, `editor/`, `shared/`, `shared/export/`, `shared/document/`.

## Import migration (pattern)

| Old prefix | New prefix |
|------------|------------|
| `@/src/components/OOPlannerWorkspace` | `@/src/editor/OOPlannerWorkspace` |
| `../src/components/workspace/` | `../src/editor/` |
| `../src/components/FeasibilityCanvas` | `../src/canvas-fabric/FeasibilityCanvas` |
| `../src/three-lazy/` | `../src/3d/` |
| `../src/export/` | `../src/shared/export/` |
| `../src/adapters/` | `../src/shared/document/` |
| `../src/import/` | `../src/lib/` |
| `../src/geometry/` | `../src/lib/geometry/` |
| `../src/inventory/` | `../src/catalog/inventory/` |
| `../src/svg/` | `../src/catalog/svg/` |
| `../src/commands/` | `../src/lib/commands/` |
| `../src/operations/` | `../src/model/actions/` |

`OOPlanner/app/planner/**` route paths unchanged; imports updated to `@/src/editor/OOPlannerWorkspace`.

## Gates

| Command | Exit | Notes |
|---------|------|-------|
| `npm run typecheck` | 2 | `src/` clean; 3 pre-existing test-only errors (`coverageGap`, `persistence`) |
| `npm test` | 1 | 896/899 pass; 3 failures in `threeViewerInner.test.tsx` (three.js mock; not import-related) |

Evidence: `results/planner/phase-07/structure-mirror/`

## Could not mirror (and why)

| Site area | Reason |
|-----------|--------|
| `app/` routes, `OOPlanner/app/planner/**` | Next.js package boundary — routes stay in `app/`; logic in `src/` |
| `admin/`, `help/`, `landing/`, `onboarding/`, `portal/`, `templates/`, `ui/`, `hooks/` | Not yet implemented in Open3D slice |
| `document/` (top-level) | Site planner document lives in `model/` + `shared/document/`; Open3D uses `shared/document/` bridge only |
| `viewer/` | Site uses `3d/Planner3DViewer`; Open3D uses `3d/ThreeLazyViewer` (lazy-load pattern) |
| `canvas-fabric/` depth | Site has hooks/models/lib subtree; Open3D has single `FeasibilityCanvas` feasibility slice |
| `components/` (site) | Site theme providers; Open3D has no equivalent yet |
| `shared/boq/`, `shared/types/` | BOQ/quote not in Phase 06 slice |

## Sync

`open3d-next-staging/src/` replaced from restructured `OOPlanner/src/`; staging tests import paths updated.

## Tests (2026-07-03)

- Production tests: `site/tests/unit/features/planner/open3d/` (migrated from `OOPlanner/tests/`).
- Import pattern: `@/features/planner/open3d/...` and `@/features/planner/model/...` for document bridge tests.
- Route coverage: `site/tests/unit/features/planner/open3d/routesCoverage.test.tsx` (site `app/planner/**` paths).
- Do not add co-located `*.test.*` under `features/planner/open3d/`.

## Next

Production modules and tests live in `site/`. `OOPlanner/` and `open3d-next-staging/` are archive mirrors only.
