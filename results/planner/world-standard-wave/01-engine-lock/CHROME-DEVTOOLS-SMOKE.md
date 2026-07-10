# P02 chrome-devtools smoke

**Date:** 2026-07-10  
**URL:** `http://localhost:3000/planner/guest/?plannerDevTools=1`  
**Fabric:** `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` unset (OFF)

## Checks

| Check | Result |
|-------|--------|
| Guest workspace loads | PASS |
| 2D tools rail (Select, Wall, …) | PASS |
| Inventory + Modular Cabinet CTA | PASS |
| Status bar walls/furniture | PASS (4 walls, 0 furniture on load) |
| Local save label | PASS (`Saving locally…` / `Draft saved locally`) |
| Toggle **3D** radio | PASS (`Wall · 3D` chrome) |
| Console errors/warnings (filtered) | **none** |
| Screenshot | `chrome-devtools-3d.png` |
| A11y snapshot | `chrome-devtools-a11y.txt` |

## Honesty

- Smoke **proves host + 2D/3D chrome live**, not full W4 orbit pose e2e.
- Freeze unit pack is separate (`unit-freeze-pack.log` / orbit / host / fabric mapper).
- No product code changed for this smoke.
