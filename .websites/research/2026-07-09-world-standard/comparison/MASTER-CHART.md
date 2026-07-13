# MASTER comparison chart — who gets what right

**Date:** 2026-07-09  
**Ethics:** Patterns/ideas only — no competitor code, assets, or UI clones.  
**Method:** Part-wise slices (engine · toolbar · inventory · ease · realtime · export · O&O self).  
**Also:** RoomSketcher best-of 2026 public article, Floorplanner/IKEA marketing, prior P5D Firecrawl pack.

**Scale:** 1 = missing/broken · 3 = OK · 5 = class-leading

---

## A. Who wins each parameter

| Parameter | #1 Winner | #2 | O&O live | Steal **pattern** (not UI) |
|-----------|-----------|-----|----------|----------------------------|
| **2D engine / plan accuracy** | RoomSketcher | Floorplanner | 2 | Snap, measure, pro 2D |
| **3D visualization** | Homestyler / Foyr / P5D | Floorplanner | 2 | Presence + orbit; defer photoreal |
| **2D↔3D continuity** | RoomSketcher / Floorplanner | P5D | 3 | Same doc, live dual view |
| **Toolbar / chrome** | Planner5D | RoomSketcher | 2 | Top·left·canvas·right·status |
| **Inventory / place** | P5D / Floorplanner (UX) · **IKEA (SKU truth)** | Homestyler | 2 | Drag place + real products |
| **Ease / 10-min result** | Planner5D | Floorplanner / IKEA | 2 | Zero-friction start + templates |
| **Realtime / cloud save** | P5D / Floorplanner | RoomSketcher | 2 | Cloud + multi-device; honest labels |
| **Collab multiplayer** | Planner5D (claimed) | Figma bar | 1 | Later — not first |
| **Export pro 2D** | RoomSketcher | SmartDraw | 2 | Clean plan PDF |
| **BOQ / buy / quote** | **IKEA** | P5D shopping list | 2 | Catalog → order/quote |
| **Mesh / symbol quality** | Homestyler / Foyr | P5D | 1 | Readable 2D symbols + multi-part mesh |

---

## B. Product overall (average of primary scores — approximate)

| Product | Role | ~Overall | Best at |
|---------|------|----------|---------|
| RoomSketcher | Pro floor plans | **4.3** | Measure, 2D, export, continuity |
| Planner5D | DIY home design | **4.2** | Ease, 3D, collab, catalog UX |
| Floorplanner | Easy space plan | **4.0** | Free access, library size, 2D/3D |
| IKEA | Manufacturer planner | **3.8** | Real SKU, configurators, quote |
| Homestyler | Decor / render | **3.5** | Pretty 3D |
| Foyr Neo | Interior viz | **3.4** | Renders |
| **O&O live** | Manufacturer (target) | **~2.0** | Spine only — not ship |

---

## C. Full score matrix (selected columns)

| Product | 2D | 3D | Cont. | Tools | Invent. | Ease | Save | BOQ | Mesh |
|---------|----|----|-------|-------|---------|------|------|-----|------|
| RoomSketcher | 5 | 4 | 5 | 4 | 3 | 4 | 4 | 3 | 3 |
| Planner5D | 4 | 5 | 4 | 5 | 5 | 5 | 5 | 4 | 4 |
| Floorplanner | 4 | 4 | 5 | 4 | 5 | 5 | 5 | 2 | 4 |
| IKEA | 4 | 4 | 4 | 4 | 5* | 4 | 3 | **5** | 4 |
| Homestyler | 3 | 5 | 3 | 3 | 4 | 3 | 3 | 2 | 5 |
| **O&O live** | 2 | 2 | 3 | 2 | 2 | 2 | 2 | 2 | 1 |

\*IKEA inventory = product truth, not generic library breadth.

---

## D. Engine decision for O&O (from who works well)

| Decision | Choice | Evidence from winners |
|----------|--------|------------------------|
| **2D interactive stage** | **Fabric.js v7 full stage** (Plan A) | Object CAD (select/move/rotate/group) matches RoomSketcher/P5D furniture tooling; beat hand-rolled Canvas for product |
| **2D interim** | Keep FeasibilityCanvas walls until Fabric walls land | Don't freeze product for months |
| **Forbidden** | Canvas+Konva+Fabric hybrid | Thrash — proven painful |
| **3D** | **Three.js + R3F** (keep) | Browser WebGL consensus; model-viewer admin-only |
| **Orbit** | Enable | Every 3D winner has navigate camera |
| **Mesh** | Modular parametric + G5–G8 GLB | Not static designer GLB dump; raise above boxes |
| **2D symbols** | Block2D now → SVG publish as authority later | Inventory fidelity > pretty random meshes |
| **Catalog model** | **IKEA-class** (SKU is product) | O&O moat = real office furniture, not 260k generic models |
| **Save** | IDB honest + cloud next | P5D/Floorplanner multi-device bar |
| **Success metric** | BOQ/quote path | IKEA wins quote; we don't race Foyr on 4K |

### Locked stack (decide once, stop thrashing)

```
Document (UUID, mm)
  ├── 2D: Fabric full stage (target) / Feasibility interim
  ├── 3D: R3F + Three + orbit
  ├── Catalog: real O&O SKUs + Block2D + modular mesh
  └── Persist: IDB → Supabase plans (member)
```

---

## E. Slice files (agent / orchestrator writes)

| Slice | Path |
|-------|------|
| Engine | `01-engine/REPORT.md` |
| Toolbar | `02-toolbar/REPORT.md` |
| Inventory | `03-inventory/REPORT.md` |
| Ease | `04-ease/REPORT.md` |
| Realtime | `05-realtime/REPORT.md` |
| Export/BOQ | `06-export-boq/REPORT.md` |
| O&O self | `07-oando-self/REPORT.md` |
| Engine decision detail | `ENGINE-DECISION.md` |

## F. Firecrawl note
CLI installed; **API key not in env** this session. Used prior paid scrapes + public pages. Add `FIRECRAWL_API_KEY` to scrape RoomSketcher/Homestyler **feature pages only** next.

## G. Next after you approve engines
Implement world-standard gates W1–W8 on locked stack (see repo `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`).
