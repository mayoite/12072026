# Engine decision record (O&O)

**Date:** 2026-07-09  
**Based on:** MASTER-CHART.md + Plan A 00A  
**Status:** PROPOSED — owner confirm

## Decisions

| Layer | Decision | Rationale from comparison |
|-------|----------|---------------------------|
| 2D | **Fabric.js v7 full stage** as product destination | Winners need select/transform furniture; Fabric is Plan A locked choice |
| 2D bridge | FeasibilityCanvas until walls/tools on Fabric | Ship select/delete/Block2D on current canvas if faster for W gates |
| 3D | **Three + @react-three/fiber** | Keep; enable orbit; no Unity |
| Admin single asset | model-viewer | Keep |
| Hybrid ban | No Konva + Fabric simultaneous interactive | Historical thrash |
| Symbols | Block2D canvas + SVG pipeline | Match inventory, not competitor SVG |
| Mesh | modular-cabinet-v0 quality bar first | IKEA-like product depth > generic box library |
| Catalog | Manufacturer SKU first | IKEA wins this parameter |

## Explicit non-goals (now)
- Photoreal 4K race (Homestyler/Foyr)
- Multiplayer CRDT (P5D later)
- LiDAR / AR (IKEA Kreativ later)

## Owner checkbox
- [ ] Approve Fabric + R3F lock  
- [ ] Approve IKEA-class catalog strategy  
- [ ] Approve BOQ > photoreal priority  
- [ ] Then implement W1–W8
