# project/ — live planner host data

Live guest/canvas host model: placement catalog, project document, store, persistence, export, cleanup proofs.

## Map

| Subfolder | Role |
|-----------|------|
| `model/` | Live project types / scene |
| `catalog/` | Placement + inventory catalog for host |
| `store/` | Live project store |
| `persistence/` | Session / draft / autosave |
| `shared/` | Export, document bridge, mesh contract |
| `cleanup/` | Import graph + asset classification |
| `canvas-stage/` | Re-export of `features/planner/canvas/` |
| `ai/` | Project-side AI helpers |

## Dual tree note

Parallel top-level `features/planner/{catalog,model,store}` serve domain/API/tools — not this host. See `features/planner/CONTENTS.md`.

## Naming leftovers

Wire formats may still say `open3d-floorplan-project` / `engine: "open3d"` for saved JSON compatibility. CDN textures still under `public/cdn/planner/open3d/` until cutover.
