# Planner project tree (live canvas host)

## Live 2-D canvas

**`canvas-stage/`** re-exports Fabric from **`features/planner/canvas/`** (`PlannerFabricStage`).

Live routes: `/planner/guest`, `/planner/canvas` (not `/planner/fabric` or `/planner/open3d` — those 301 to canvas).

## What lives here

| Area | Role |
|------|------|
| `model/` | Live project document types / scene |
| `catalog/` | Placement catalog for the live host (includes SVG loader/sanitizer) |
| `store/` | Live project store slice |
| `persistence/` | Session / draft / autosave |
| `shared/` | Export, document bridge, mesh contracts |
| `cleanup/` | Import graph + asset classification |

## Dual trees (honest)

Top-level `features/planner/{catalog-api,model,cloud-store}` are **parallel** domain surfaces for APIs, portal, and older tools. They are **not** the guest/canvas plan host.

Live host imports under `project/*` (and `editor/`, `canvas/`, `3d/`, `ui/`).

## Export

JSON, SVG, PNG, PDF, DXF from the document model (`shared/export/`).

## Retired

| Path | Status |
|------|--------|
| `features/planner/_archive/` | Deleted — never restore as live host |
| `app/planner/open3d` | Deleted — next.config 301 → `/planner/canvas` |
| `site/inventory/descriptors/` | Deleted — use `inventory/descriptors/` |

## Tests

Name-mirror under `tests/unit/features/planner/project/`.
