# Global-standard revision — **module folders**

**Not** CP-00…CP-10 theater. **Product modules** own the raised bar.  
**Program law:** `Plans/trustdata/GLOBAL-STANDARD-REVISION.md`

## Modules (only these roots)

| Module folder | Owns (product) | Old CP map (history only) |
|---------------|----------------|---------------------------|
| `modules/foundation/` | Unlock honesty, buyer contract, authority map, claim language | CP-00, bits of CP-01 |
| `modules/shell-chrome/` | Top bar, tools, shortcuts, a11y chrome, status honesty | CP-09, a11y residual |
| `modules/canvas-2d/` | Walls, draw, FeasibilityCanvas plan | CP-07 W1 half |
| `modules/symbols-svg/` | **SVG files on disk** + Block2D literacy | CP-05 (raised) |
| `modules/catalog-place/` | Catalog, place, systems configurator | CP-07 W2 place |
| `modules/select-edit/` | Select, delete, undo | CP-03 |
| `modules/view-3d-orbit/` | 3D view, orbit, 2D↔3D pose | CP-04 |
| `modules/mesh-3d/` | Modular mesh quality (cabinet, workstation) | CP-08 + mesh raises |
| `modules/save-persist/` | Local/cloud honesty, reload | CP-06 |
| `modules/export-boq/` | Export, BOQ, quote path | BOQ demos / later |
| `modules/admin-svg-pipeline/` | Admin publish → `svg-catalog` | Asset engine S4 |
| `modules/evidence-handover/` | Pack + backup honesty | CP-10 |

## Per module (when revising)

```
modules/<name>/
  README.md          # what “global standard complete” means for THIS module
  BRAINSTORM.md      # product bar (when run)
  UI-EXPERT.md        # UI bar (when run)
  SYNTHESIS.md        # raised PASS + OPEN residuals
  TASK-LIST.md        # implementation only after synthesis
  evidence/           # optional logs/PNGs for this module only
```

**Kill order for work:** finish one **module** completely (experts → synthesis → implement proof) before the next.  
Historical trustdata CP folders stay under `world-standard-wave/` — do not invent parallel CP-XX under this tree.

## Status

| Module | Experts | Product complete |
|--------|---------|------------------|
| foundation | DONE (from old CP-00) | **OPEN** (F2–F4 docs still thin) |
| symbols-svg | pending | **OPEN** (~4 SVGs) |
| mesh-3d | pending | **HALF** (parts exist, not global) |
| shell-chrome | pending | **HALF** |
| others | pending | OPEN |
