# First-class open3d BOQ export (benchmark-quality)

**Date:** 2026-07-09  
**Slice:** BOQ first-class in open3d TopBar export menu  
**Bar:** Real furniture BOQ JSON/CSV for current project — no fake PDF/PNG, no workstation-only menu theater

## What landed

| Surface | Change |
|---------|--------|
| Pure module | `site/features/planner/open3d/shared/export/projectFurnitureBoq.ts` |
| TopBar Export menu | **Export BOQ (JSON)** · **Export BOQ (CSV)** · workstation BOQ kept as secondary |
| Workspace handler | `OOPlannerWorkspace.handleExport` wires `boq` / `boq-json` / `boq-csv` |
| Download helpers | `downloadFurnitureBoqJSON` / `downloadFurnitureBoqCSV` in `exportUtils.ts` |
| Unit test | `site/tests/unit/features/planner/open3d/projectFurnitureBoq.test.ts` (2/2 green) |

## Behavior (honest)

- Aggregates **all** placed furniture on the active floor (option: all floors).
- Groups by catalogId + footprint + geometryMode + unit price.
- **Workstation systems-v0** rows: list INR + 18% GST (same schedule as `workstationBoqV0`).
- **Other furniture:** qty + footprint + identity; `unitPriceInr = 0`, `priced: false` — **no fabricated prices**.
- Empty plan → status message, no download.

## Menu IDs

| Menu label | format key | Output |
|------------|------------|--------|
| Export BOQ (JSON) | `boq-json` (also `boq`) | `*-furniture-boq-v1.json` |
| Export BOQ (CSV) | `boq-csv` | `*-furniture-boq-v1.csv` |
| Export workstation BOQ | `workstation-boq` | systems-only `*-workstation-boq-v0.json` |

## Evidence in this folder

| File | Meaning |
|------|---------|
| `vitest-raw.log` | Unit green: projectFurnitureBoq + exportPhase06 + workstationBoqExport |
| `sample-furniture-boq-v1.json` | Real pure-function payload (4 seats + 1 cabinet) |
| `sample-furniture-boq-v1.csv` | Same payload as CSV |
| `run.json` | Summary counters from sample build |

## Not claimed

- On-canvas quote panel / live ERP prices  
- RoomSketcher-class plan PDF  
- Public product bar 3 on BOQ/buy (still short of IKEA-class loop)

## Verdict

**export_boq menu gap closed for first-class JSON/CSV.** Workstation BOQ remains available; general furniture BOQ is now the primary export path.
