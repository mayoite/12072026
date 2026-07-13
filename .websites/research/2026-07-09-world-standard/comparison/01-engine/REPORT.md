# 01 — Engine comparison (2D / 3D who gets it right)

**Date:** 2026-07-09  
**Slice:** `comparison/01-engine`  
**Rule:** Patterns and ideas only — no competitor code, assets, shaders, or brand clones.

## Sources

| Source | Use |
|--------|-----|
| `D:\websites\planner5d.com\report\*` | Stack signals (jobs + bundles), 2D/3D UX flow |
| `D:\websites\oando-render-options\*` | O&O Canvas vs WebGL options; package menu |
| `E:\Goodsites\…\07-CAPABILITY-MATRIX.md` (and retired twin) | RoomSketcher measure bar; R3F keep decision |
| `D:\OandO07072026\ayushdocs\01-RECAP.md` | Live O&O engine state (Fabric flag OFF; FeasibilityCanvas + R3F) |
| Public product knowledge (marketing / open docs) | RoomSketcher, Floorplanner, Homestyler, Foyr Neo, IKEA Kreativ, Sweet Home 3D |

---

## 1. Scoring rubric (1–5)

| Score | Meaning |
|------:|---------|
| **1** | Missing / broken for the job |
| **2** | Present but weak or unreliable |
| **3** | Acceptable product bar (usable daily) |
| **4** | Strong — competitive, few friction points |
| **5** | Class-leading for this column |

**Columns**

| Column | What we score |
|--------|----------------|
| **2D engine** | Plan draw quality: walls/rooms, pan-zoom, selection, structure edit |
| **3D engine** | Live 3D: camera, lights, materials, walk/orbit feel |
| **2D↔3D continuity** | Same document; structure change appears in 3D without rebuild friction |
| **Snap / measure** | Grid/wall snap, typed lengths, dimensions, area honesty |
| **Mesh quality** | Furniture/room mesh fidelity (live view, not only async stills) |
| **Perf feel** | Responsiveness on mid laptop; large plan / many objects |

Scores are **public-product feel + research signals**, not reverse-engineered FPS.

---

## 2. Product × engine table

| Product | 2D engine | 3D engine | 2D↔3D | Snap / measure | Mesh quality | Perf feel |
|---------|:---------:|:---------:|:-----:|:--------------:|:------------:|:---------:|
| **Planner5D** | **5** | **5** | **5** | **4** | **4** | **4** |
| **RoomSketcher** | **5** | **4** | **5** | **5** | **3** | **4** |
| **Floorplanner** | **4** | **3** | **4** | **3** | **3** | **4** |
| **Homestyler** | **3** | **5** | **4** | **3** | **5** | **3** |
| **Foyr Neo** | **3** | **5** | **4** | **3** | **5** | **3** |
| **IKEA (Kreativ / room planners)** | **3** | **4** | **3** | **2** | **4** | **4** |
| **Sweet Home 3D** (open) | **4** | **3** | **5** | **4** | **2** | **3** |
| **O&O live** | **3** | **3** | **3** | **3** | **2** | **3** |

### Brief notes (patterns only)

| Product | Engine pattern that wins (or lags) |
|---------|-------------------------------------|
| **Planner5D** | Hybrid **Canvas/SVG 2D + Three/WebGL 3D** (hiring + public signals). Structure in 2D, decorate/orbit in 3D; instant mode toggle; catalog mesh adequate; consumer perf good. Class bar for **hybrid web engine**. |
| **RoomSketcher** | Plan-first rigor: **typed lengths, wall snap, dimension honesty**. 2D floor plans class-leading; 3D solid but not photoreal-first. **Measure/snap column winner**. |
| **Floorplanner** | Browser simplicity: fast plan → 3D preview, lower CAD depth. Good “light engine” reference; mesh mid-tier. |
| **Homestyler** | **3D / catalog mesh / presentation** strength; 2D more of a setup path than CAD. |
| **Foyr Neo** | Designer **visual/render** stack; room visuals over floor-plan CAD. Mesh/3D win with Homestyler. |
| **IKEA** | **SKU-first** placement, guided rooms; not freeform architect CAD. Brand meshes good; measure/snap intentionally limited. Perf OK because domain is constrained. |
| **Sweet Home 3D** | Open **Java Swing 2D + Java3D-class 3D**; legendary **same-plan dual view** continuity. Mesh/UI dated; study **document model + wall→volume** algorithms under GPL (do not paste into MIT product). |
| **O&O live** | **2D:** native Canvas 2D (`FeasibilityCanvas`); Fabric v7 installed, full stage **flag OFF**. **3D:** Three + R3F (`Planner3DViewer` path). Continuity = shared document → scene rebuild (partial product polish). Snap/measure present (geometry + overlays) not RoomSketcher-class. Mesh mostly **procedural / modular** (cabinet-v0 etc.), GLB path partial. Perf acceptable at current catalog scale. |

---

## 3. Winner per column

| Column | Winner(s) | Why (pattern) |
|--------|-----------|----------------|
| **2D engine** | **RoomSketcher** (tie **Planner5D**) | RS: precision plan tools; P5D: fastest structure draw for mass market |
| **3D engine** | **Planner5D** (tie **Homestyler / Foyr Neo**) | P5D: live web 3D + orbit; H/F: presentation mesh/render depth |
| **2D↔3D continuity** | **Planner5D** / **RoomSketcher** / **Sweet Home 3D** | One document; toggle or split without losing placement IDs |
| **Snap / measure** | **RoomSketcher** | Typed lengths, guides, area — market benchmark in capability matrix |
| **Mesh quality** | **Homestyler** / **Foyr Neo** | Catalog + materials for show-quality rooms |
| **Perf feel** | **Planner5D** / **Floorplanner** / **IKEA** | Constrained or well-tuned browser paths; less “heavy DCC” drag |

**Overall engine “who gets the hybrid right”:** **Planner5D** (web hybrid model).  
**Overall “who gets plan accuracy right”:** **RoomSketcher**.  
**Best open reference for dual-view continuity:** **Sweet Home 3D** (study patterns under license).

---

## 4. Recommended O&O stack

Aligned with locked O&O decisions + winners above.

### 2D: **Fabric.js v7 full stage** (target) · **Canvas 2D** (live interim) · **not Konva**

| Option | Verdict | Rationale from winners |
|--------|---------|------------------------|
| **Native Canvas 2D** | **Keep as live / fallback** | Matches Planner5D hiring pattern (Canvas/SVG structure). Lowest dependency; walls/dimensions ownable. Current live path. |
| **Fabric.js v7** | **Recommended full stage cutover** | Winners that feel “select + transform furniture” use a **scene-graph of objects** (hit-test, handles, groups). Fabric is already in repo and owner-locked for full stage — use it for **furniture/selection**, keep precision geometry math in shared document model. |
| **Konva** | **Do not adopt** | Same problem class as Fabric; no winner requires Konva; dual 2D engines = debt. Owner decision already: no Canvas+Konva hybrid. |
| **SVG-only** | Support export / inventory symbols, not sole interactive plan | Crisp print; weak as sole heavy interactive plan with hundreds of hits. |

**Practical split (pattern from P5D + SH3D):**

```
Document model (walls, openings, furniture UUIDs, mm)
        │
        ├─ 2D: FeasibilityCanvas → migrate furniture layer to Fabric stage
        │      structure + measure stay document-driven
        └─ 3D: Three / R3F from same document (extrude + place)
```

### 3D: **Three.js + React Three Fiber (+ drei)**

| Option | Verdict | Rationale |
|--------|---------|-----------|
| **Three + R3F** | **Keep / deepen** | Planner5D-class web planners hire for **Three/WebGL**; Blueprint3D open pattern; already live in O&O; capability matrix: keep R3F. |
| **Babylon / PlayCanvas** | Reject unless Three is proven insufficient | No evidence switch fixes mesh quality — **assets + LODs** do. |
| **model-viewer only** | Admin / single SKU spin only | Not a floor-plan engine. |
| **Async photoreal** | Later, separate from live engine | P5D “Renders” pattern — job queue, not live canvas. |

### Continuity / measure / mesh (engine-adjacent)

| Gap vs winners | O&O move (idea only) |
|----------------|----------------------|
| RoomSketcher measure | Typed length on wall tool; dimension layer always on; area from closed rooms |
| P5D 2D↔3D | Same entity IDs 2D↔3D; toggle/split without full document rewrite |
| Homestyler/Foyr mesh | Raise modular mesh + curated GLB (own catalog), glTF Transform LODs — **not** their assets |
| Perf | One WebGL context; 2D path stays Canvas when WebGL blocked (P5D-style degrade) |

---

## 5. Ethics line

**Patterns only.** Study workflows (2D structure → 3D decorate, snap feedback, dual view). Rebuild with **our** document model, **our** UI, **our** catalog.  
**Do not** ship competitor minified JS, shaders, catalog meshes, icons, or pixel-clone chrome.  
Open source (e.g. Sweet Home 3D, Blueprint3D-class) → read **licenses** before any code-level reuse; prefer reimplementation of algorithms under our license.

---

## 6. Score file

Machine-readable: [`SCORES.csv`](./SCORES.csv)  
Columns: `product,2d,3d,continuity,measure,mesh,perf`

---

## 7. Bottom line for O&O

1. **Do not invent a new 3D engine** — stay **Three/R3F** (winner family).  
2. **Finish 2D object stage with Fabric** (not Konva); keep Canvas geometry until cutover proven.  
3. Chase **RoomSketcher measure** and **P5D continuity** as product quality bars, not as copy targets.  
4. Mesh quality is a **content + LOD** problem, not a “switch to Homestyler’s stack” problem.
