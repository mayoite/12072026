# O&O LIVE — self score (brutal)

**Product:** O&O planner live (`/planner/open3d`, guest/canvas same shell)  
**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026` (main; no worktrees)  
**Scale:** 1 = broken/missing · 3 = acceptable public product · 5 = class-leading  

**Authority used (read-only):**

| Source | Role |
|--------|------|
| `ayushdocs/04-HONEST-QUALITY.md` | Quality bar — spine ≠ ship |
| `ayushdocs/00-PENDING.md`, `01-RECAP.md`, `02-HOW-TO-PROCEED.md` | Pending + live feel check |
| `ayushdocs/06-A11Y-OPEN3D.md` | Live a11y not clean |
| `Plans/01-execution/core/00A-START.md` | Ground truth engines/routes |
| `Plans/01-execution/core/01A-PHASE-2A.md` | UI gates incomplete |
| `Plans/01-execution/core/02B-PHASE-2B-2C.md` | Canvas/Open3D + asset engine partials |
| `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | W1–W8 world gates (open) |
| `results/planner/world-standard-wave/WAVE.md` | User-visible blockers |
| `Failures.md` (2026-07-09 honesty) | G8 partial; dual-compiler closed |
| `task.md` | Stage honesty table |

**Rule:** Score **live product experience**, not unit-green skeletons. World bar = manufacturer furniture planner (structure → catalog → 2D↔3D → save → quote), not demo of boxes.

---

## Scores (1–5)

| Dimension | Score | Live reality (brutal) |
|-----------|------:|------------------------|
| **2d_engine** | **2** | Target is Fabric.js v7 full stage (00A/02B). **Live default = `FeasibilityCanvas` (raw Canvas 2D)**. Fabric furniture = flag-gated overlay only (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE`, default OFF) — not walls/rooms/tools cutover. Geometry unit net partial; full draw→save→reload browser acceptance open. Fragile pointer math called out in Plan A. |
| **3d_engine** | **2** | Three + R3F live on open3d; scene rebuilds walls + furniture from document UUIDs. Default place path is **procedural stacked boxes / modular multi-box**, not product-grade mesh. G8 GLB viewer load = **unit/async path only** — no signed browser smoke; place still not auto-GLB. “Good mesh” bar (W7/P0.4) open. |
| **toolbar** | **2** | `CanvasToolRail` + TopBar + command palette exist (Phosphor, some RAC). Tools: select/pan/room/wall/opening/dimension/placement. 2A incomplete (RAC/CSS gates, keyboard suite). WAVE: tool/shortcut honesty historically bad; chrome is half-premium, not Planner5D-class. A11y open3d not clean (nested main / hydration history). |
| **inventory** | **2** | `InventoryPanel` + catalog client + double-click place; `cabinet-v0` modular wire landed (unit + UI place path). Not world catalog UX: thin vs drag-from-rail, rich filters, SKU density, variants. Admin SVG catalog ≠ plan-symbol authority. Portal catalog consume partial. |
| **ease** | **1** | Owner + WAVE: product does **not** work for unaided buyer. No Playwright open3d draw→place→3D→save journey. Furniture select/delete/edit on default 2D incomplete vs world gates W3. Mesh apologizes as boxes. “10 minutes to a trustable layout” fails. |
| **realtime_save** | **2** | Document model + **IndexedDB autosave** + unit save/reload envelope continuity. **Cloud/member save unwired** (dead client path per WAVE). No multiplayer/realtime collab. Browser hard-reload proof (W5) open. Status can imply “saved” when only local. |
| **export_boq** | **2** | Shared `buildBoq` + CSV/JSON/PDF helpers exist under `shared/boq` + `shared/export`. Open3d TopBar: JSON/SVG/PDF/PNG preflight — **BOQ not first-class open3d export menu**. Quote path is differentiator on paper, not live buyer journey. India GST/BOQ wedge not productized in workspace. |
| **mesh_symbol** | **2** | Block2D procedural symbols partially on FeasibilityCanvas (`furnitureBlock2D` / render path). Modular cabinet footprint + multi-part box mesh. Designer static GLB **correctly banned**. Honesty bar explicitly: stacked boxes until mesh polish; G5 stamp / G8 load residual. Not manufacturer-catalog readable symbols at world bar. |
| **measure_snap** | **2** | Real code: `snapDrawingPoint` (endpoint / grid / angle), dimension tool on canvas (two-point measure), pick helpers unit-tested (02B.1 partial). Not RoomSketcher-grade continuous dims, wall lengths always-on, or snap UX polish. Acceptable skeleton, not class-leading measure suite. |

**Row average (unweighted):** \(2+2+2+2+1+2+2+2+2\) / 9 ≈ **1.9** — well below “acceptable” (3). Spine exists; public product bar does not.

---

## Evidence anchors (no new claims)

- **~40–50%** asset-engine skeleton/unit; **~20–30%** production place-good-mesh without bypass (`04-HONEST-QUALITY.md`).
- Live 2D = FeasibilityCanvas; Fabric = chosen cutover not live (`00A-START.md`, `02B` checkboxes).
- Modular place → 2D/3D boxes partial; G8 Chrome load **No** / residual (`04`, `task.md`, `Failures.md`).
- World gates W0–W8 blocked / not green (`00-PENDING.md`, design spec).
- WAVE blockers: no browser journey; select/delete weak; boxes; IDB-only save; BOQ not the product loop.

---

## Top 5 deficits vs world bar

1. **Unaided product journey missing (ease / W1–W5)**  
   No browser-proven loop: draw structure → place real SKUs → select/edit/delete → 2D↔3D → save → hard reload. Unit green does not equal buyer-ready. This is the primary gap vs Planner5D / RoomSketcher / Floorplanner public feel.

2. **2D engine not production tooling (2d_engine)**  
   World bar expects one solid plan engine (select, transform, multi-select, walls+furniture). O&O lives on fragile hand-rolled Canvas; Fabric full stage is plan-locked but **not cut over**. Hybrid risk and incomplete select path keep the product in “demo CAD,” not planner.

3. **Mesh + plan symbols below manufacturer bar (mesh_symbol / 3d_engine)**  
   Competitors show catalog-looking furniture in 2D and 3D. O&O default is modular/procedural boxes; G8 GLB path incomplete; Block2D not catalog authority. Correct policy (no designer GLB) does not yet yield good generated mesh.

4. **Save honesty + continuity (realtime_save)**  
   World bar: leave and return tomorrow. O&O has IDB + unit envelope only; cloud save dead; no Playwright reload proof; status copy risk. Collab/realtime is absent (acceptable later), but **durable save that returns** is table stakes.

5. **Quote/BOQ not wired as the O&O wedge (export_boq / inventory)**  
   Research synthesis says BOQ/SKU/mm is the differentiator vs photoreal arms race. Code has BOQ builders; open3d workspace export path does not deliver buyer BOQ/quote from placed inventory as a first-class, trusted output. Catalog place UX also thinner than inventory-first world products.

---

## What *not* to over-claim

| Safe claim | Unsafe claim |
|------------|--------------|
| Hard-path **spine** on main (SVG authority, modular place, crypto entity ids, fail-closed publish path) | “Product done” / ship-quality asset engine |
| Three/R3F scene from document | Photoreal or good cabinetry mesh |
| Fabric installed + furniture flag spike | Fabric is the live 2D product |
| IDB autosave unit continuity | Cloud save / collab / proven reload UX |
| BOQ helpers in tree | Open3d BOQ export journey |

---

## Method note

Scores are **self-assessment against public planner products** (Planner5D, RoomSketcher, Floorplanner, Homestyler, Foyr, IKEA-class ease), using only O&O honesty docs + Plan A + WAVE — not competitor code/assets. Ideas only for comparison context.

**CSV:** `SCORES.csv` — single row `product=O&O_live`.
