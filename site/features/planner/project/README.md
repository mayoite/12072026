# Planner project tree (live canvas host model)

## Live 2-D canvas

**`canvas-stage/`** re-exports Fabric from **`features/planner/canvas/`** (`PlannerFabricStage`, testid `planner-fabric-stage`).

## What lives here

| Area | Role |
|------|------|
| `model/` | Live project document types / scene |
| `catalog/` | Placement catalog for the live host |
| `store/` | Live project store slice |
| `persistence/` | Session / draft / autosave for live host |
| `shared/` | Export, document bridge, mesh contracts |
| `cleanup/` | Import graph + asset classification proofs |

## Dual trees (honest)

Top-level `features/planner/{catalog,model,store}` are **parallel domain / legacy surfaces** used by APIs, marketing, portal, and older tools. They are **not** the guest/canvas plan host.

Live host imports under `project/*` (and `editor/`, `canvas/`, `3d/`, `ui/`).

## Export

JSON, SVG, PNG, PDF, DXF from the document model (`shared/export/exportUtils.ts`).

## Retired

| Path | Status |
|------|--------|
| `features/planner/_archive/` | Deleted — never restore as live host |
| `app/planner/open3d` | Deleted — next.config 301 → `/planner/canvas` |
