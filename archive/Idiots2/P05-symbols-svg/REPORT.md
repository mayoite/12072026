# Idiots2 / P05 — Exhaustive Symbols & SVG Report

**Role:** Brainstormer 05/10 (wave 2)  
**Deliverable:** This file only — `Idiots2\P05-symbols-svg\REPORT.md`  
**Date of synthesis:** 2026-07-10  
**Scope:** Plan-view **symbols**, **SVG paths**, catalog fidelity, ethics, industry bar, O&O architecture truth, and P05 (W2 / CP-05) decision surface.  
**Hard constraints from brief:** NO product code. NO competitor assets. Unlimited length. Ideas → original O&O only.  
**Source order (mandatory):** (1) `D:\websites` first · (2) `Plans\Research` · (3) `Plans\phases\P05-symbols-svg\` ALL.

---

## 0. Executive thesis (read this first)

### The single most important fact

O&O has **three separate “SVG / symbol” worlds**. Confusing them is the root bug class of P05, of inventory “SVG doesn’t show on canvas” complaints, and of dishonest claims that “SVG catalog proves plan symbols.”

| World | What it is | Authority for plan symbols today? |
|-------|------------|-----------------------------------|
| **A. Inventory thumbnail (DOM SVG)** | `Block2D` → `blockToSvg` → sanitized inline SVG in catalog cards | **No** — preview only |
| **B. Live plan canvas (Canvas 2D prims)** | `furnitureBlock2DFromItem` → `Block2D` prims → `renderBlock2DCentered` / `renderBlock2DToCanvas` | **YES — W2 / CP-05 authority** |
| **C. Publish pipeline (disk SVG)** | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` (admin/CLI) | **No for Feasibility draw** — publish authority only |

**W2 does not mean “load SVG onto FeasibilityCanvas.”**  
**W2 means:** placed furniture — especially **cabinet-v0** — is **readable as a product** on the plan (carcass, front, door cues, not empty box), via **original O&O Block2D prims**.

### Second most important fact

Industry winners (Planner5D, Floorplanner, RoomSketcher, Homestyler, IKEA planners) all treat **catalog-looking 2D marks** as table stakes when furniture is placed. Research scores put O&O **mesh/symbol quality at ~1–2/5** historically: procedural boxes, thin Block2D, admin SVG ≠ plan authority. P05 exists to close the **plan-symbol half** of that gap without:

- shipping competitor SVG/GLB/icons,
- claiming publish SVG is canvas draw,
- redesigning 3D mesh (that is **P08**),
- shipping browser place journey proof (that is **P07**),
- cutting over Fabric full stage (that is post-W / P02 destination).

### Third most important fact (ethics)

**Inspiration is not cheating.** Copying minified JS, catalog meshes, sprites, icons, brand, or pixel-matched chrome **is**. Binding ethics docs:

- `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md`
- `D:\websites\README.md` (ethics line)
- `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md` §1
- Phase card ethics: original O&O prims only; MIT packages already in tree.

---

## 1. Mission of this report

This report is the **brain dump** for phase **P05-symbols-svg** so any implementer, reviewer, or later agent can answer without re-scraping:

1. What “symbol quality” means for a manufacturer office planner (not a photoreal game).  
2. What competitors do at the **pattern** level for 2D marks, catalog thumbnails, SVG export.  
3. What O&O already has, what it lies about, and what the locked authority graph is.  
4. What P05 tasks, gates, evidence, and hard stops were designed to prove.  
5. What must never be claimed.  
6. How SVG, Canvas, Fabric, Block2D, inventory, and mesh relate and **do not** substitute for each other.  
7. Recommended approaches for future symbol work after CP-05 (if reopened or extended).

This is **not** an implementation plan rewrite of `Plans\phases\P05-symbols-svg\`. It **consumes** that phase + all research packs and produces an exhaustive narrative decision surface.

---

## 2. Source inventory (ordered, absolute paths)

### 2.1 Tier 1 — `D:\websites` (FIRST)

| Pack / file | Why it matters for P05 |
|-------------|------------------------|
| `D:\websites\README.md` | Canonical research home; ethics; layout of all packs |
| `D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md` | Render tech options: Canvas 2D, SVG DOM, WebGL/Three, hybrid, server render, when each applies |
| `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md` | **Core O&O process doc:** three SVG paths, inventory vs canvas mismatch, packages, wrongs, fix direction |
| `D:\websites\oando-render-options\raw\ui-only\` | Public P5D home/editor screenshots only (auth-walled editor; no inventory scrape) |
| `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` | Inspiration vs copy fence |
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Product loop: structure → furnish catalog → 2D/3D → export |
| `D:\websites\planner5d.com\report\PACKAGES_INSPIRATION.md` | Package categories; SVG sprite path observed on their CDN (do not copy) |
| `D:\websites\planner5d.com\report\DEEP_STACK_AND_PACKAGES.md` | Hiring stack: **SVG + Canvas 2D + Three/WebGL**; open peers; never ship their app.js |
| `D:\websites\planner5d.com\report\TOOLBARS.md` | Chrome zones; catalog right/left; 2D structure vs 3D decorate |
| `D:\websites\roomsketcher.com\report\INSPIRATION.md` | W2 pattern: readable plan symbols; categorized catalog place |
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | Library 2D top / 3D thumb; drag place; **SVG export** as deliverable (not live engine) |
| `D:\websites\floorplanner.com\raw\updates.floorplanner.com.md` | “SVG Export (vector images)” for HD+ projects — export pattern |
| `D:\websites\homestyler.com\report\INSPIRATION.md` | Catalog modules; 2D plane / RCP / elevation; mesh strength (3D bar, not P05) |
| `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | Manufacturer SKU + system catalog as product truth (SKU bar for symbols’ **identity**) |
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Pattern library: “Catalog is the product → real SKUs + **Block2D** + modular mesh” |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Mesh/symbol quality winners; **2D symbols: Block2D now → SVG publish later** |
| `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` | Locked: Symbols = Block2D canvas + SVG pipeline (O&O), not competitor SVG |
| `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md` | Hybrid Canvas/SVG + Three; SVG-only weak for heavy interactive plan |
| `D:\websites\research\2026-07-09-world-standard\comparison\03-inventory\REPORT.md` | Catalog place UX; SKU/mm must-win; fixed-size branded SKUs |
| `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` | Brutal self-score: mesh_symbol **2**; admin SVG ≠ plan authority |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-packages.md` | svgo, resvg, sharp, fabric SVG export CVE notes, Phosphor, unused svg.js |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-synthesis.md` | Historical SVG architecture Option A lock; defer pipeline vs shell |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-plann-compare.md` | Catalogue-first; parametric blocks = admin SVG semantics only |

### 2.2 Tier 2 — `Plans\Research` (repo index)

| File | Role |
|------|------|
| `Plans\Research\RESEARCH-MAP.md` | Phase → research pack routing: **P05 / W2 → oando-render-options + P5D catalog quality as bar idea → Block2D + O&O pipeline honesty**; evidence lands in `05-symbols-svg/` |
| `Plans\Research\RESULTS-MAP.md` | Evidence ≠ research (if present; research is not a pass) |

### 2.3 Tier 3 — phase folder (ALL)

| File | Role |
|------|------|
| `Plans\phases\P05-symbols-svg\README.md` | Index of phase files |
| `Plans\phases\P05-symbols-svg\P05-symbols-svg.md` | Execute card: W2 + SVG honesty; CP-05; tasks 00–6; hard stop |
| `Plans\phases\P05-symbols-svg\P05-appendix.md` | Test/impl skeletons; honesty NOTES templates; CP-05.json shape |
| `Plans\phases\P05-symbols-svg\P05-suggestions.md` | Expert review: centeredPath lie; doorStyle must differ; smoke ≠ W2 fail |
| `Plans\phases\P05-symbols-svg\02-canvas-2d.md` | Expert pass: SHIP Approach A; Block2D authority; Fabric flag OFF for proof |

### 2.4 Out of research scope (explicit)

- Re-scraping Planner5D editor behind auth  
- Competitor CDN asset harvest  
- Writing product code in this brainstormer pass  
- P07 place browser journey, P08 mesh beauty, Fabric full-stage cutover  

---

## 3. Ethics & anti-copy fence (binding for all symbol work)

### 3.1 Allowed

| Action | Why OK |
|--------|--------|
| Study product **behavior** (place → readable plan mark; catalog tile ≈ plan symbol) | Ideas/methods not copyright |
| Match **category of feature** every planner has (2D furniture marks, doors/windows symbols) | Industry convention |
| Hire-stack signals (Canvas, SVG, Three) to choose **open** packages | Public job posts |
| Study **open-source** planners (react-planner, Blueprint3D-class) under their licenses | Legal code study; rewrite for O&O |
| Invent original Block2D prim geometry for O&O SKUs | Our expression |
| Use Phosphor icons for **UI chrome**, not as furniture plan art | Own icon policy |

### 3.2 Forbidden

| Action | Why not OK |
|--------|------------|
| Paste competitor minified JS / shaders / sprite sheets | Their code/expression |
| Ship their furniture GLBs / textures / SVG catalog art | Their assets |
| Pixel-clone catalog grid chrome / brand colors | Trade dress risk |
| Scrape authenticated editor inventory | Private surface |
| “Steal package.json and vendored code” | Not inspiration |
| Hand-paste competitor path `d=` strings into `modularCabinetBlock` | Still their art |

### 3.3 Rule of thumb (from ETHICS_AND_INSPIRATION)

> If a reasonable person would say “you rebuilt the *idea* with your own work” → OK.  
> If they would say “you took *their* implementation or look” → stop.

### 3.4 Phase ethics line (P05)

- Original O&O prims only.  
- No competitor SVG/JS/GLB.  
- MIT packages **already in tree** only for this phase.  
- Unit test explicitly forbids external URL / `.glb` / `.svg` / `svg-catalog` in symbol generation string path.

---

## 4. What “symbol quality” means (product definition)

### 4.1 User job (JTBD)

When a dealer or designer places **cabinet-v0** (or any catalog SKU) on a floor plan, they must instantly answer:

1. **What is this object?** (cabinet vs desk vs chair-class footprint)  
2. **Which way is front?** (door/face vs back vs wall side)  
3. **How big is it relative to the room?** (true mm envelope, not free-scale prop)  
4. **Does door style / config change the mark?** (slab vs pair vs open)  
5. **Is the inventory tile the same idea as the plan mark?** (fidelity of identity)

If the plan shows a **semi-transparent empty rectangle**, the product fails W2 even if place/select/save work.

### 4.2 Manufacturer planner bar vs consumer prop bar

| Dimension | Consumer DIY (P5D-class props) | Manufacturer (IKEA / O&O target) |
|-----------|--------------------------------|----------------------------------|
| Identity | “Looks like a sofa” | **SKU / article / modular options** |
| Scale | Often free resize | **Fixed manufacturer mm** default |
| 2D mark | Decorative silhouette OK | **Technical-readable** footprint + front cue |
| 3D mesh | Pretty catalog GLB | Modular parts / honest LODs (P08) |
| Export | Pretty PDF / render | BOQ lines from same IDs (post-W wedge) |

O&O **must-win** (inventory research): `sku_mm` and BOQ path — not million generic models. Symbols serve that win: **the plan is a commercial document**, not a mood board.

### 4.3 “Readable” criteria (from P05 Task 5 + appendix)

A cabinet-v0 plan symbol is readable when:

1. **Outer carcass** is visible (stroke + fill differentiation).  
2. **Front ≠ back** (front line / face cue at depth edge; not symmetric empty box).  
3. **doorStyle geometry differs** (pair has mid stile; slab has none; handles differ).  
4. **Not undetailed fill-only** blob.  
5. **No competitor art**.  
6. Evidence: Playwright PNG if place works, else **prim-JSON dump** is valid W2 evidence for the symbol half.

### 4.4 What symbol quality is *not*

| Not this | Belongs to |
|----------|------------|
| Photoreal 4K stills | Async render / Homestyler race — non-goal |
| Perfect multi-part GLB beauty | **P08** mesh quality |
| Full browser place ≥2 SKUs journey | **P07** |
| Fabric object stage polish | P02 destination / later |
| Loading `/svg-catalog/*.svg` into Feasibility | Future S7-class work; **not** W2 pass condition |
| Measurement rigor RoomSketcher-class | Later / not W2 |
| UI icon set quality | Phosphor chrome policy |

---

## 5. Industry patterns (symbols, catalog marks, SVG) — ideas only

### 5.1 Planner5D (class bar for hybrid + catalog UX)

**Sources:** INSPIRATION_REPORT, TOOLBARS, DEEP_STACK, PACKAGES_INSPIRATION, ETHICS, oando-render raw UI-only.

| Pattern | Observation | O&O translation |
|---------|-------------|-----------------|
| Hybrid 2D+3D | Structure in 2D; decorate/orbit in 3D | Keep Canvas 2D + Three; same document UUIDs |
| Hiring stack | **SVG + Canvas + Three.js/WebGL** | Our Canvas + optional SVG export + Three already |
| Catalog place | Click or drag from catalogue; huge library freemium | Inventory place friction (P07); depth via **SKU truth** not 8k props |
| Consumer symbols | Adequate “looks like furniture” for DIY | We need **more technical** readability for B2B |
| SVG sprites on CDN | `/assets/sprite/*.svg#…` for **UI**, not plan geometry proof | Use Phosphor; never their sprites |
| Auth wall | Public scrape cannot document live inventory symbols | Do not invent their symbol system from marketing |

**Do not take:** app.js (~17.7MB), GLBs, textures, sprite assets, UI pixels.

### 5.2 Floorplanner (library thumbs + SVG *export*)

**Sources:** INSPIRATION.md, updates SVG export note.

| Pattern | Observation | O&O translation |
|---------|-------------|-----------------|
| Library list | **2D top or 3D thumbnail** preview per item | Catalog preview = our Block2D/`blockToSvg` or product image |
| Place | Drag-drop from list into plan | Our drag or double-click place |
| Fixed branded sizes | Branded items often fixed size | Default lock manufacturer mm |
| SVG export | Vector **export** for HD+ projects | Export path later; **not** live draw engine |
| Information tools | Text, symbols, dimension lines as sidebar categories | Dimensions/symbols as plan **layers**, separate from furniture Block2D |

**Key distinction:** Floorplanner’s “SVG” marketing hit is **export of the plan**, not “the editor is an SVG DOM scene graph only.” O&O should keep that distinction: **publish/export SVG ≠ interactive plan authority.**

### 5.3 RoomSketcher (readable 2D + pro documents)

**Sources:** INSPIRATION.md (W2 row).

| Pattern | Observation | O&O translation |
|---------|-------------|-----------------|
| Symbols library | Large furniture + symbols library (marketing) | Our catalog + original marks |
| Place grammar | Click item then click canvas (doors on wall) | Inventory place grammar |
| Prefer real sizes | “Choose door close to size needed” for better 3D | Place true modular mm |
| W2 explicit mapping | Readable plan symbols, not empty blob | **Exactly P05 goal language** |

### 5.4 Homestyler (mesh / presentation winner)

| Pattern | Observation | O&O translation |
|---------|-------------|-----------------|
| Mesh quality #1 | Catalog-looking 3D | P08 modular mesh, not P05 |
| 2D views | Plane, RCP, elevation | Plan first; pro views later |
| Catalog modules | Structure vs furnishings vs finishes vs personal | Own taxonomy tabs |

Homestyler wins **3D pretty**; P05 does **not** chase that. P05 raises **2D technical marks** so the plan is trustworthy before mesh polish.

### 5.5 IKEA planners (SKU identity gold)

| Pattern | Observation | O&O translation |
|---------|-------------|-----------------|
| Design = composition of real catalog items | Modules, fronts, constraints | cabinet-v0 modular options + real SKUs |
| Fixed module sizes | cm-class real product system | mm footprint on Block2D |
| Item list / quote | Sellable identity | BOQ after place — not symbol art |

IKEA does not “win SVG.” IKEA wins **identity**. Symbols must carry that identity visually (module shape + front), not just a box with a SKU string in the inspector.

### 5.6 World-standard MASTER chart — mesh/symbol column

| Product | Mesh/symbol research score (approx) | Note |
|---------|-------------------------------------|------|
| Homestyler / Foyr | 5 | Pretty 3D + catalog look |
| P5D / Floorplanner | 4 | Adequate consumer |
| RoomSketcher | 3 | Plan-first, less glam |
| **O&O live (research self)** | **1–2** | Boxes; Block2D partial |

**Steal pattern:** Readable 2D symbols + multi-part mesh — **not** their meshes.  
**Decision row:** *2D symbols: Block2D now → SVG publish as authority later.*

### 5.7 Open-source peers (legal study, not P5D)

From DEEP_STACK_AND_PACKAGES:

| Project | Use for |
|---------|---------|
| cvdlab/react-planner | Catalog + 2D draw model ideas |
| Blueprint3D / modern rewrites | Floor plan → 3D room patterns |
| Sweet Home 3D | Dual-view continuity algorithms (GPL — reimplement, don’t paste) |

---

## 6. Render technology options (from oando-render-options)

### 6.1 Decision table for plan symbols

| Need | Prefer | Not |
|------|--------|-----|
| Interactive floor plan edit | **Canvas 2D** (live Feasibility) or Fabric destination | SVG-only with thousands of nodes as sole engine |
| Inventory thumbnail | **DOM SVG** from same Block2D | Competitor tile art |
| Printable / publish asset | **SVG pipeline** (svgo/resvg) | Claiming that file is live canvas |
| 3D room | **Three/R3F** | Using GLB as 2D plan symbol |
| Photoreal marketing | Async server job later | Live editor requirement |

### 6.2 Canvas 2D (Option 1)

- Pros: simple, wide support, pixel control for plans.  
- Cons: own hit-test, pan/zoom, selection; large scenes need care.  
- **Our status:** Live path for structure + furniture Block2D paint.

### 6.3 SVG DOM (Option 2)

- Pros: crisp zoom, CSS, a11y/select.  
- Cons: heavy DOM at scale; weak for photoreal 3D.  
- **When:** thumbnails, annotations, PDF/SVG export.  
- **Not:** full substitute for interactive WebGL 3D; weak as sole heavy interactive plan with hundreds of hits (engine report).

### 6.4 Hybrid product model (recommended industry pattern)

```
2D mode  → Canvas 2D (structure, measure, Block2D furniture)
3D mode  → WebGL Three (volume, modular mesh, orbit)
Export   → SVG/PDF/PNG from document model (not from competitor files)
Publish  → admin SVG catalog for managed assets / portal
```

### 6.5 Diagnostic confusion: “canvas won’t render SVG”

From CANVAS_INVENTORY_UI_SVG **Wrong #1**:

| Inventory tile | On canvas (historical bug class) |
|----------------|----------------------------------|
| Rich `blockToSvg` multi-prim | Flat box Path2D / empty-ish mark |
| CSS token fills | Single primary fill @ low alpha |

**Symptom:** “SVG doesn’t render on canvas.”  
**Truth:** SVG markup was never the canvas path — only path `d` or (after fixes) shared prim renderer.

**Correct fix directions (ours):**

1. Shared **prim → Canvas 2D** renderer (preferred; aligns with P05 `renderBlock2DToCanvas`).  
2. Rasterize `blockToSvg` → ImageBitmap → `drawImage` (cache by catalogId).  
3. Fabric objects from same prim list when Fabric lane is on (later; flag-ON Rects are **not** W2).  

**Never:** copy their furniture art.

---

## 7. O&O architecture truth — the three paths in full

### 7.1 Path A — Inventory preview (full SVG in DOM)

```
CatalogItem
  → resolveCatalogItemBlock2D / Block2D (prims in mm)
  → blockToSvg(block, pad)
  → sanitizeInlineSvg
  → CatalogBlockPreview (dangerouslySetInnerHTML)
```

- Primitives: rect, line, circle, arc, path, gradients (`blocks2d`).  
- Colors: CSS variables `var(--block-surface)` etc. — work because markup sits in page CSS tree.  
- Fallback: colored box if no prims.  
- **Not** FeasibilityCanvas draw.

### 7.2 Path B — Live plan furniture (Block2D → Canvas)

```
Open3dFurnitureItem (document entity)
  → furnitureBlock2DFromItem(item)
       ├── modular-cabinet-v0 → modularCabinetBlock (prims top-left)
       ├── known catalog bridges → Block2D
       └── unknown → non-empty box fallback
  → renderBlock2DCentered(ctx, block, …)
       (translate -L/2, -D/2 then paint prims)
  → FeasibilityCanvas furniture layer (when layerVisibility.furniture)
```

**Authority for W2 plan symbols today = Path B.**

Historical / related helpers that are **not** authority:

| Helper | Role | Canvas authority? |
|--------|------|-------------------|
| `generateCabinetV0Footprint` | Centered path string for mesh/footprint helper | **No** |
| `resolveFurniture2DFootprint` → Path2D (older inventory doc) | Simple box/cabinet path fill | Superseded by Block2D paint for W2 |
| Fabric `FurnitureFabricLayer` Rects | Flag-ON overlay | **Not W2**; temporary symbol regression if used as proof |
| `/svg-catalog/*.svg` files | Admin/CLI publish | **No** |

### 7.3 Path C — Asset-engine compile (publish)

```
Descriptor
  → S1 normalize → S2 pipelineCore → S3 svgo-ish
  → compileSvgForPublish
  → public/svg-catalog/{slug}.svg
  → Portal preview at /portal/svg-catalog
```

- Packages: `svgo`, `sharp`, `@resvg/resvg-js`, DOMPurify / isomorphic path, jsdom tests.  
- V1 `svgCompiler.server.ts` marked v1-reference-only (honesty NOTES).  
- **Smoke scripts:** `pnpm run scripts:smoke:svg` / `scripts:smoke:svg:batch` prove **publish** path for honesty — not W2 symbol quality.

### 7.4 Authority graph (must stay honest)

```
Plan canvas → furnitureBlock2DFromItem → Block2D prims (top-left)
           → renderBlock2DCentered
           = AUTHORITY FOR W2 PLAN SYMBOLS TODAY

Admin/CLI → compileSvgForPublish → public/svg-catalog/{slug}.svg
          = PUBLISH AUTHORITY — NOT Feasibility draw path today

generateCabinetV0Footprint = mesh/helper path string — NOT canvas Block2D

Portal SVG = published URL preview — NOT open3d place symbol proof

Inventory blockToSvg = thumbnail DOM — NOT canvas
```

### 7.5 Coordinate / origin honesty

| Concept | Truth |
|---------|-------|
| Prim authorship | **Top-left** within footprint (0..L, 0..D) |
| Canvas placement | **Center** via `renderBlock2DCentered` (−L/2, −D/2) |
| `furnitureBlockUsesCenteredPath` | Must be **always false**; historical `true` for modular was a **dead lie** (prims were top-left; helper unused / misnamed) |
| Units | **mm internal**; cm naming debt called out in CANVAS_INVENTORY (widthMm sometimes cm — unit audit is ongoing debt) |
| Footprint fields | L / D / H from modular options or item dims |

### 7.6 CSS variables on wrong surface

- DOM SVG: `var(--block-*)` works.  
- Canvas Path2D / fills: **must resolve** colors (`getComputedStyle` / resolve callback).  
- P05 tests use `resolve: (t) => …` style injection for unit paint.

### 7.7 Security inconsistency (inventory doc Wrong #5)

- `CatalogBlockPreview`: sanitize.  
- Some `renderBlockPrims` paths: raw innerHTML without sanitize.  
- Prefer one helper; publish path must stay fail-closed.

### 7.8 Dual engine debt

| Engine | Role |
|--------|------|
| FeasibilityCanvas | Interim interactive 2D (Approach A) — W gates ship here |
| Fabric v7 full stage | Destination after W (Plan A 2B.2) — keep code, default OFF |
| Fabric furniture flag | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"` only; ON hides Feasibility furniture and mounts Rect layer |
| Konva | **Hard ban** as simultaneous hybrid |

**W2/W3 proof must use Fabric flag OFF.** Flag-ON is not product dual-CAD.

---

## 8. Catalog & inventory relationship to symbols

### 8.1 Catalog is the product (SYNTHESIS)

Industry pattern → O&O:

| Industry | O&O |
|----------|-----|
| Drag catalog furniture | Inventory drag or double-click place + snap |
| Catalog is the product | Real O&O SKUs + **Block2D** + modular mesh quality |
| Million props | Anti-pattern if zero order codes |

### 8.2 Inventory UX scores (research snapshot)

| Dimension | O&O research | Bar winner pattern |
|-----------|--------------|--------------------|
| search | 3 | P5D / AI search later; SKU filters first |
| categories | 3 | Floorplanner cat/subcat/brand |
| drag_place | 3 | Click or drag mature |
| variants | 2 | IKEA option matrices → SKU lines |
| sku_mm | **5 strategic** | Must keep |
| b2b | 4 potential | Private manufacturer packs |

### 8.3 Catalog tile ≈ on-canvas symbol (pattern)

Allowed **idea**: the thumbnail should **look like** the plan mark (same Block2D truth).  
Forbidden: their tile art files.

**Target architecture (CANVAS_INVENTORY recommended):**

```
CatalogItem
   → Block2D (prims in mm)     // single truth for 2D symbol
   → Thumbnail: blockToSvg → DOM (or cached PNG)
   → Canvas: renderPrimsToCanvas2D(ctx, prims, transform)
   → (optional later) Fabric object from same prims
```

### 8.4 Hydration complexity (Wrong #6)

Multiple bridges: buddy catalog, managed products, generated parts, shapeTypeRegistry.  

**Symptom:** missing preview (`!block?.prims`) → empty gray tile; place still works as box → **UI/canvas mismatch**.

**P05 Task 3** addresses the **canvas** non-empty guard for unknown SKU; inventory hydration polish is broader than W2 unit gate.

### 8.5 Fixed-size branded SKUs

Floorplanner pattern: branded items fixed size; free resize corrupts commercial truth.  
O&O: modular options carry widthMm/depthMm/heightMm; Block2D footprint must use **placed** modular dimensions (P05 test case).

---

## 9. Package & pipeline landscape (symbols/SVG)

### 9.1 Live / relevant packages (from packages research + inventory doc)

| Package | Role | Planner symbols note |
|---------|------|----------------------|
| Browser Canvas 2D | Live 2D | Keep for plan |
| `fabric` 7.4.0 | Destination stage; flag furniture | Not W2 authority; 7.4 SVG export CVE fix historical |
| `three` + r3f + drei | 3D | Out of P05 focus |
| `svgo` 4 | Publish optimize | Pipeline only |
| `@resvg/resvg-js` | SVG → PNG server | Thumbs without Chromium |
| `sharp` | Raster ops server | Post-resvg |
| `dompurify` / isomorphic | Sanitize | Server needs shim |
| `@phosphor-icons/react` | UI icons | Not furniture plan art |
| `fuse.js` | Catalog search | Place UX |
| `@svgdotjs/*` | Installed historically | **Unused** — defer/remove; not live path |
| Konva / Pixi / D3 | Not live plan engine | Do not adopt for hybrid thrash |

### 9.2 Server pipeline boundary (recommended documentation)

```
geometry helpers (flatten / boolean)
  → svgo
  → dompurify / isomorphic-dompurify
  → @resvg/resvg-js
  → sharp
```

Mark each server-only vs client-only; Next `serverExternalPackages` for native modules.

### 9.3 Competitor-adjacent vendors (inspiration only)

P5D ships jQuery, hammer, tippy, huge webpack app with three/React string hits.  
**We use modern React/Next stack already.** Do not vendor their scripts.

### 9.4 Optional open helpers (if needed later)

- `svg-path-bounds`, path parsers — **not required** if prim list is authority.  
- `earcut` for floor mesh — geometry, not furniture symbols.  
- Open icon sets only if license-cleared; furniture marks remain procedural O&O.

---

## 10. P05 phase design — full unpack

### 10.1 Identity

| Field | Value |
|-------|-------|
| Phase | P05-symbols-svg |
| Gate | **W2 symbol quality half** / **CP-05** |
| Depends | P01 + P02 (does not require P03 for unit symbol work) |
| Prev | P04 orbit continuity |
| Next | P06 save honesty |
| Place journey | **P07** |
| Mesh beauty | **P08** |
| Evidence root (design) | `results/planner/world-standard-wave/05-symbols-svg/` |

**Phase card status note (2026-07-09):** Execute card marks W2/CP-05 **PASS** with unit 17/17 and honesty NOTES. Brainstormer does **not** re-run tests here. Any later claim of PASS must re-prove against live evidence under repo `results/` (layout rule: root `results/` only). If evidence tree is missing in a checkout, status is **unproven in that checkout** until re-generated — honesty over stale markdown.

### 10.2 Goal (from execute card)

1. Make open3d plan-view furniture symbols **readable** for **cabinet-v0** (stop empty-box marks).  
2. Write an honest SVG story: **Block2D = canvas authority now; admin/CLI SVG = publish authority** — not competitor assets.  
3. Fix dead lie `furnitureBlockUsesCenteredPath`.  
4. Unknown-SKU non-empty fallback.  
5. Ethics preserved.

### 10.3 File map (product paths — reference only)

| Path | Responsibility |
|------|----------------|
| `site/features/planner/open3d/catalog/furnitureBlock2D.ts` | Primary: richer `modularCabinetBlock`; centeredPath → false |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Paint prim kinds |
| `site/lib/catalog/blocks2d.ts` | Styles / prim types |
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Optional shared dims |
| `site/features/planner/open3d/model/types.ts` | `Open3dModularCabinetV0Options` |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Wire already correct if Path B used |
| `site/features/planner/asset-engine/README.md` | Canvas vs publish honesty |
| `site/public/svg-catalog/*.svg` | CLI/admin only |
| Unit tests | `furnitureBlock2D.cabinet-v0.test.ts`; `renderBlock2DToCanvas.test.ts` |

### 10.4 Task ladder (00 → 6)

| Task | Intent | Evidence folder (design) |
|------|--------|---------------------------|
| **00 Baseline** | Grep inventory; modular ~2 prims; centeredPath wrong; NOTES | `00-baseline/` |
| **1 RED** | TDD: cabinet-v0 not empty box; full skeleton in appendix | `01-red/` |
| **2 GREEN** | Readable modularCabinetBlock; centeredPath false | `02-green/` |
| **3 Unknown SKU** | Non-empty box fallback only (no demo-desk de-dupe) | `03-nonempty/` |
| **4 SVG honesty** | Smoke batch + NOTES + asset-engine README section | `04-svg-honesty/` |
| **5 Visual** | PNG or prim-JSON; readable criteria | `05-visual/` |
| **6 CP-05 pack** | Vitest both files; CP-05.json + SUMMARY.md | root of `05-symbols-svg/` |

### 10.5 Cabinet-v0 symbol design intent (appendix skeleton meaning)

Not code to paste blindly — **design semantics**:

| Element | Meaning |
|---------|---------|
| Outer rect | Carcass footprint L×D |
| Inner rect | Inset body / carcass inner |
| Front line at larger Y | **Front of cabinet** in plan (depth axis) |
| Back line | Opposite face cue |
| **pair** | Mid vertical stile + two handles |
| **slab** | **No** mid stile; single handle offset |
| **none** (or other) | Shelf-ish dashed lines; no pair stile |
| Top-left coords | Authorship convention |
| Inset proportional | Scales with size without runaway |

**Expert S2 critical:** slab must **not** draw the same center stile as pair — otherwise “door style changes geometry” is theater.

### 10.6 Unit acceptance cases (W2)

1. Footprint uses placed modular dimensions (e.g. 800×400×900).  
2. ≥4 prims with carcass + front + door cue (not 2-prim empty-box bar).  
3. All prim geometry inside footprint (no runaway coords).  
4. Pair mid stile ≥1; slab mid stile = 0.  
5. `furnitureBlockUsesCenteredPath` === false.  
6. Canvas paint issues fill + stroke without throw.  
7. No external SVG/GLB URLs / svg-catalog dependency in generation.

### 10.7 CP-05 hard stop table

| Check | Pass condition |
|-------|----------------|
| Unit | cabinet-v0 test green + log + run.json |
| Non-empty | Modular + box fallback have prims |
| Door style | pair mid stile; slab none |
| CenteredPath | helper false for modular |
| Honesty | NOTES: Block2D canvas; SVG publish |
| SVG smoke | Optional for symbol half; required if claiming smoke green |
| Ethics | No competitor SVG |
| Visual | PNG or prim JSON + NOTES |
| Scope | No mesh redesign, Fabric cutover, SVGR |

If required row fails: stop; log Failures.md; do not mark W2 symbol half green.

### 10.8 CP-05.json claims shape (design)

- `cabinetV0Block2DReadable`  
- `notEmptyBox`  
- `doorStyleGeometryDiffers`  
- `canvasAuthorityIsBlock2D`  
- `furnitureBlockUsesCenteredPathIsFalse`  
- `svgCatalogIsPublishNotCanvas`  
- `svgHonestySmoke` pass|fail|skipped-with-notes  
- `noCompetitorSvg`  
- `browserPlaceJourney` **deferred-to-P07**

### 10.9 Expert pass verdict (02-canvas-2d)

**SHIP** Approach A:

- FeasibilityCanvas = interim interactive 2D for W1–W8.  
- Fabric full stage = destination after W.  
- Flag furniture overlay = migration spike only.  
- Do not re-open Konva hybrid.  
- Block2D = plan-symbol authority; never claim svg-catalog as Feasibility draw.  
- Keep canvas-fabric-stage/ code; do not delete destination slice.

### 10.10 Expert suggestions disposition (P05-suggestions)

| ID | Topic | Apply? |
|----|-------|--------|
| S1 | Kill/fix centeredPath honesty | Yes |
| S2 | doorStyle geometry must differ | Yes |
| S3 | run.json + commit shape | Yes |
| S4 | Task 3 de-dupe unknown SKU only | Yes |
| S5 | Type honesty modular options | Yes |
| S6 | SVG smoke ≠ automatic W2 fail | Yes |
| S7 | Nav links + baseline facts | Yes |
| S8 | Shared mockContext | Optional no |
| S9 | Out of scope list | Confirmed |

### 10.11 Out of scope (hard)

- FeasibilityCanvas loading published SVG as draw path  
- Mesh toe/door beauty (P08)  
- Competitor SVG/path paste  
- Fabric cutover / SVGR  
- Full W2 browser place ≥2 (P07)  
- CDN SVG  
- Confusing `generateCabinetV0Footprint` with Block2D canvas authority  

---

## 11. SVG honesty — claims that are true vs false

### 11.1 True

1. Publish compile authority = `compileSvgForPublish` → pipelineCore + normalize.  
2. Admin publish wire = `publishDescriptorWithPipeline` → `public/svg-catalog/{slug}.svg`.  
3. CLI fixtures: smoke:svg / smoke:svg:batch.  
4. V1 svgCompiler.server may be reference-only.  
5. Open3d plan canvas does **not** draw from `/svg-catalog/*.svg` for W2 (Block2D).  
6. `generateCabinetV0Footprint` is mesh/helper — not canvas Block2D.  
7. Inventory DOM SVG can show rich marks while canvas lagged historically.  
8. Fabric installed ≠ Fabric is live plan product.

### 11.2 False (do not ship these sentences)

1. “SVG is the FeasibilityCanvas authority.”  
2. “cabinet-v0 plan mark is published SVG.”  
3. “Portal svg-catalog proves planner place symbols.”  
4. “furnitureBlockUsesCenteredPath means modular prims are centered.”  
5. “Unit green on Block2D = browser place journey done.” (P07)  
6. “Readable 2D = good 3D mesh.” (P08)  
7. “SVG smoke green = W2 symbol quality.” (smoke is honesty evidence only)  
8. “We use Planner5D’s SVG sprites / catalog.” (forbidden)  

### 11.3 Gate split (S6)

| Gate half | Evidence |
|-----------|----------|
| **Symbol quality** | Unit Block2D + visual prims/PNG + ethics |
| **SVG honesty** | NOTES + optional smoke log; README canvas vs publish |

CP may pass symbol half with smoke skipped **if** NOTES do not claim smoke green.  
CP must **not** claim “SVG pipeline works” without exit 0 log.

---

## 12. Approaches for plan symbols (2–3 options + recommendation)

This brainstormer presents approaches as a durable design surface. P05 already chose Approach 1 for W2.

### Approach 1 — Shared Block2D prim → Canvas (RECOMMENDED / P05)

**Idea:** Single prim list is truth for thumbnail (via blockToSvg) and canvas (via renderBlock2DToCanvas). Raise modular cabinet prim count and semantics.

| Pros | Cons |
|------|------|
| One geometry language | Must paint all prim kinds correctly |
| Unit-testable without browser | Less “pretty SVG art” than freehand SVG |
| No competitor assets | Authoring skill required for each SKU family |
| Aligns ENGINE-DECISION | Does not by itself fix inventory hydration |

**When:** Now and for W2. **Default recommendation forever** for O&O plan marks until a deliberate publish-SVG consume project ships with evidence.

### Approach 2 — Rasterize SVG string → drawImage on canvas

**Idea:** `blockToSvg` → Image/ImageBitmap cache → `ctx.drawImage` at place.

| Pros | Cons |
|------|------|
| Pixel parity with thumbnail | Cache invalidation; blur at extreme zoom |
| Reuses SVG CSS styling pipeline carefully | CSS vars still need bake-in for off-DOM raster |
| Good for complex multi-prim later | Heavier than prim paint for simple cabinets |

**When:** If prim set becomes too rich for hand Canvas API, or export parity requires exact SVG raster. Secondary to Approach 1.

### Approach 3 — Load published `/svg-catalog` into plan

**Idea:** Place uses published SVG URL as plan mark.

| Pros | Cons |
|------|------|
| Admin publish becomes plan authority | **Not true today**; large honesty rewrite |
| Portal and plan unify | Network/async place complexity |
| | Risk of treating portal catalog as product without SKU bridge |
| | Easy to fake W2 by showing any SVG file |

**When:** Only as a **future S7-class** program with explicit CP, not as silent P05. Phase docs: do not mark S7 implemented until inventory place consumes published SVG with evidence.

### Approach 4 — Fabric objects from prims (later, not W2)

**Idea:** After full stage cutover, Fabric `Path`/`Group` from same Block2D.

| Pros | Cons |
|------|------|
| Select/transform handles | Flag-ON today is plain Rect — regression |
| Scene graph for furniture | Dual hit surface if mixed with Feasibility |

**When:** Post-W Fabric destination. Flag-ON must **not** be used to green W2.

### Recommendation

**Stay on Approach 1** for all W-gate symbol work. Use Approach 2 only if measured need. Approach 3 requires a new phase with honesty re-baseline. Approach 4 is destination-stage, not CP-05.

---

## 13. Quality bar detail — cabinet-v0 and beyond

### 13.1 Empty-box bar (failure mode)

Baseline (pre-P05 expert fact): `modularCabinetBlock` ≈ **2 prims** (rect + dashed center line). That is the “empty-box bar” product failure: user sees a vague rectangle with a line, not a cabinet.

### 13.2 Minimum readable cabinet language

Think like a **plan symbol language** (original O&O, not a standard download):

| Layer | Purpose |
|-------|---------|
| Envelope | True L×D |
| Carcass | Outer stroke |
| Worktop/body inset | Depth of construction |
| Front plane | Orientation for docking against walls / aisles |
| Door division | pair vs slab vs open |
| Handles | Small high-contrast cues (optional but strong readability) |

### 13.3 Door style matrix

| doorStyle | Required geometry difference |
|-----------|------------------------------|
| `pair` | Mid vertical stile (+ dual handles preferred) |
| `slab` | **No** mid stile; single handle side-biased |
| `none` (or open) | Shelf/open cues; not pair stile |

### 13.4 Unknown SKU policy

Never place **silent empty** prims. Box fallback with ≥1 rect is honest: “we know size, not product art.” Inventory should eventually surface “no 2D symbol” explicitly (broader than Task 3).

### 13.5 Multi-SKU roadmap (post P05, not thrash)

After cabinet-v0:

1. Desks / tables (leg/top cues without fake brand silhouettes)  
2. Seating (backrest orientation)  
3. Storage families sharing modular language  
4. Keep **fixed mm** for sellable SKUs  

Do **not** expand SKU art while W place/select/save journeys are red.

### 13.6 Zoom / stroke readability

CANVAS checklist: zoom keeps stroke readable — use screen-space stroke or min stroke after scale. P05 unit gate does not fully prove visual zoom; browser/visual evidence does.

### 13.7 Hit-test vs draw

P03 owns pick; symbols should eventually hit prim bounds, not only box. W2 unit does not require hit-test change if draw authority is Block2D.

---

## 14. Sequencing relative to other phases

| Phase | Relationship to symbols/SVG |
|-------|-----------------------------|
| **P01 product truth** | Inventory claims vs code; research is input not pass |
| **P02 engine lock** | Fabric dest + Feasibility interim + Block2D symbols decision |
| **P03 select/delete** | Select on Feasibility with flag OFF; symbols must still pick |
| **P04 orbit continuity** | 2D mark and 3D mesh share entity IDs; different beauty bars |
| **P05 symbols/SVG** | This report; W2 symbol half + honesty |
| **P06 save honesty** | Persist furniture IDs/options so symbols reload same |
| **P07 place journey** | Browser proof place ≥2 including cabinet-v0 **with** readable 2D |
| **P08 mesh quality** | 3D modular readable parts; not plan SVG |
| **P09 shortcuts/chrome** | Labels match tools; catalog chrome not symbol art |
| **P10 handover** | Evidence index |

RESEARCH-MAP routing line:

> **P05 / W2 symbols** → oando-render-options canvas/SVG vocab; P5D catalog quality as **bar idea** → Block2D + O&O pipeline honesty → evidence `05-symbols-svg/`

---

## 15. Risks, false reverses, failure modes

### 15.1 False reverse table (from 02-canvas-2d)

| Reverse | Why wrong |
|---------|-----------|
| Ship Fabric full stage before W gates | Breaks Approach A; thrash |
| Delete fabric stage slice as “only insurance” | Violates engine lock destination |
| Enable Fabric flag for W2/W3 proof | Dual pointer; Rect ≠ Block2D |
| SVG catalog proves plan symbols | Publish ≠ canvas |
| Centered modular prims | Live prims top-left; canvas centers |
| Konva + Fabric hybrid | Hard ban |
| `/planner/fabric` archive is live 2D | Archive ≠ open3d Feasibility |

### 15.2 Product risks

| Risk | Mitigation |
|------|------------|
| Unit green, browser still boxes | P07 visual place; don’t claim W2 browser half |
| Unit green, 3D still boxes | Expected until P08 |
| Smoke fails, CP claims pipeline works | Honesty NOTES split |
| Unit pass via weak prims (≥4 garbage lines) | Visual criteria + stile tests |
| Competitor path paste to “look pro” | Ethics + test forbids URLs; code review |
| cm/mm 10× size bug | Unit footprint + place audit |
| CSS vars invisible on canvas | Resolve colors |
| Inventory rich / canvas poor returns | Single Block2D truth discipline |
| Flag-ON demos in screenshots | Policy: demos flag OFF for W |

### 15.3 Process risks

| Risk | Mitigation |
|------|------------|
| Paper PASS without results/ | Re-run vitest; layout `check:layout` |
| Re-open symbol thrash after CP | Phase card: evidence supersedes; no thrash |
| Second CP for SVG honesty | Forbidden; one CP-05 pack |
| Research treated as evidence | RESEARCH-MAP: research ≠ W-gate pass |

---

## 16. Evidence & proof standards

### 16.1 Minimum evidence design (phase)

Per automated slice: unfiltered `*-raw.log` + `run.json` (command, exitCode, timestamp, HEAD).  
NOTES.md for baseline/honesty.  
Visual: PNG **or** prim-JSON.  
CP-05.json + SUMMARY.md.

### 16.2 Layout rule (AGENTS)

Evidence only under repo-root `results/` — never `site/results/` or `site/test-results/`.

### 16.3 What counts as “readable” proof

| Strength | Artifact |
|----------|----------|
| Strong unit | cabinet-v0 tests + paint mock |
| Strong honesty | NOTES that refuse false claims |
| Medium visual | prim-JSON dump with ≥4 structured prims |
| Strong visual | Playwright place screenshot of cabinet-v0 on plan |
| Strong product | P07 journey green with same symbol path |

### 16.4 Honesty about this brainstormer pass

This report **synthesizes research and phase design**. It does not:

- re-run vitest,  
- capture new screenshots,  
- modify product code,  
- or re-score live product beyond research self-score context.

Implementers must treat phase PASS claims as **evidence-backed only when files exist under `results/`**.

---

## 17. Glossary (exhaustive for this domain)

| Term | Meaning in O&O |
|------|----------------|
| **Block2D** | Procedural 2D symbol: footprint L/D/H + list of prims |
| **Prim** | Primitive draw op: rect, line, circle, arc, path, … |
| **footprint** | mm envelope of furniture on plan |
| **modular-cabinet-v0** | First modular product geometry mode |
| **doorStyle** | none / slab / pair (options type) |
| **furnitureBlock2DFromItem** | Document furniture → Block2D |
| **renderBlock2DToCanvas** | Paint Block2D to CanvasRenderingContext2D |
| **renderBlock2DCentered** | Center footprint then paint |
| **furnitureBlockUsesCenteredPath** | Historical misnamed helper; must be false |
| **blockToSvg** | Block2D → SVG markup string for DOM thumb |
| **sanitizeInlineSvg** | XSS-safe inline SVG for preview |
| **compileSvgForPublish** | Admin/CLI publish authority entry |
| **svg-catalog** | Public published SVG files folder/route |
| **FeasibilityCanvas** | Live interim Canvas 2D plan editor |
| **Fabric stage** | Destination interactive 2D object stage |
| **Fabric furniture flag** | Optional Rect overlay; default OFF |
| **Path2D footprint** | Older simple path fill approach |
| **generateCabinetV0Footprint** | Mesh/helper path string; not Block2D canvas |
| **W2** | World gate: place catalog items with readable 2D (browser half P07; symbol half P05) |
| **CP-05** | Checkpoint pack for P05 |
| **SKU/mm** | Manufacturer identity + true dimensions |
| **BOQ** | Bill of quantities from placed SKUs |
| **Approach A** | Ship W on Feasibility + document model before Fabric cutover |
| **Empty-box bar** | Failure: plan furniture looks like blank rectangles |
| **Publish ≠ canvas** | Core honesty slogan for SVG |

---

## 18. Competitor pattern → O&O symbol checklist (no copy)

| # | Industry pattern | O&O original action | Phase |
|---|------------------|---------------------|-------|
| 1 | Catalog tile previews item | Block2D / blockToSvg thumb | Inventory |
| 2 | Plan shows furniture-looking mark | Block2D paint on Feasibility | P05 |
| 3 | Orientation readable | Front line / handles | P05 |
| 4 | Size matches product | modular mm footprint | P05 + catalog |
| 5 | Drag/click place | placementAction | P07 |
| 6 | Fixed branded size | lock sellable mm | inventory policy |
| 7 | 2D↔3D same item | UUID continuity | P04 |
| 8 | SVG export of plan | later export from document | post-W |
| 9 | Publish asset library | svg-catalog pipeline | honesty / admin |
| 10 | Pretty 3D mesh | modular mesh | P08 |
| 11 | Quote from placed items | BOQ | wedge |
| 12 | UI sprites | Phosphor | chrome |

---

## 19. Recommended coding process (when code is allowed — guidance only)

From CANVAS_INVENTORY §7 + P05 (no code here):

1. Resolve catalog id → Block2D (or explicit no-symbol).  
2. Store on furniture entity: catalogId, size mm, rotation, modular options, generator key.  
3. Draw with **same prims** as thumbnail language, transformed to screen.  
4. Hit-test prim or footprint bounds.  
5. Unit-test geometry before browser polish.  
6. Document canvas vs publish in asset-engine README.  
7. Never load competitor assets.  
8. Prove with flag OFF.

Priority order if reopening work:

1. Shared `renderBlock2DToCanvas` completeness.  
2. Unit audit mm-only inside.  
3. Cache paths/ImageBitmaps if needed.  
4. Align Fabric stage later to same Block2D.  
5. Only then consider published SVG consume (new phase).

---

## 20. UI shell context (symbols live inside zones)

Industry chrome (TOOLBARS / SYNTHESIS) — reimplemented O&O:

```
TOP: project · save · 2D|3D · share
LEFT: structure tools
CENTER: canvas (Block2D furniture draws here)
RIGHT/LEFT dock: inventory catalog (thumbnails Path A)
BOTTOM: status / floors / zoom
```

Symbols work is **center canvas fidelity** + **catalog thumb parity**, not a new chrome redesign in P05.

Public P5D screenshots available only for marketing home + auth-walled editor — **no** live inventory symbol scrape. Learning inventory marks comes from **our product + open peers + honesty**, not their private canvas.

---

## 21. Historical research notes (2026-07-05) relevant to SVG

From from-repo Plans research (reconcile with 2026-07-09 world-standard; **later wins** on engine):

- SVG architecture historically locked as Option A in older plann revision docs.  
- Advice to defer full SVG pipeline completion until 2D shell accepts — still wise: **shell place + Block2D first**.  
- Parametric “dynamic blocks” semantics = **admin SVG model**, not AutoCAD Web clone.  
- Catalog search cap ≤24 (UX), Fuse search — inventory, not symbol geometry.  
- Phosphor for open3d chrome; Lucide admin legacy.  
- Unused `@svgdotjs` — do not build P05 on it.

When 2026-07-05 and 2026-07-09 conflict on hybrid engines: **2026-07-09 ENGINE-DECISION wins** (Feasibility interim, Fabric destination, Block2D symbols).

---

## 22. Brutal O&O self-score context (why P05 exists)

From comparison `07-oando-self` (research date 2026-07-09):

- **mesh_symbol ≈ 2:** Block2D partial; modular multi-box; not manufacturer-catalog readable at world bar.  
- **inventory ≈ 2:** place path thin; admin SVG ≠ plan authority.  
- Top deficit #3: mesh + plan symbols below manufacturer bar.

P05 attacks **plan symbol readability + honesty**, not the entire mesh deficit.

---

## 23. Decision record (this brainstormer)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Plan symbol authority | **Block2D + Canvas paint** | Live path; testable; ENGINE-DECISION; P05 |
| Publish SVG role | Admin/CLI/portal only until new phase | Honesty; smoke split |
| Thumbnail role | Same Block2D → SVG DOM | Parity pattern |
| Fabric role | Destination; flag OFF for W2 proof | Expert pass |
| Competitor assets | Forbidden | Ethics packs |
| cabinet-v0 bar | ≥4 prims; doorStyle differs; front cue | Readable product mark |
| centeredPath API | Always false + honest JSDoc | Kill dead lie |
| Unknown SKU | Non-empty box fallback | No silent nothing |
| Browser place | P07 | Scope |
| Mesh | P08 | Scope |
| SVG export of whole plan | Later deliverable pattern (Floorplanner-class idea) | Not live engine |
| Photoreal | Non-goal now | MASTER chart |

---

## 24. Open questions (do **not** block P05 unit design)

These are product questions for later phases or owner intent — brainstormer does not invent new product scope:

1. When (if ever) does published svg-catalog become place authority?  
2. Should every SKU require human-authored Block2D or generator rules by family?  
3. Minimum stroke policy at extreme zoom for print PDF?  
4. Do wall-mounted items share cabinet symbol language?  
5. How do multi-select groups render compound symbols?  
6. Should BOQ PDF embed the same Block2D as legend icons?

If goal changes to “SVG is canvas authority,” stop and re-align — that is a **goal change**, not a P05 tweak.

---

## 25. One-page cheat sheet (print this)

**P05 in one breath:**  
Make **cabinet-v0** look like a cabinet on the **Canvas plan** using **original Block2D prims**, prove it with **vitest + visual**, and write down that **published SVG is not the plan engine** — without stealing anyone’s art.

**Authority:**

`furnitureBlock2DFromItem` → prims → `renderBlock2DCentered`  
≠ `/svg-catalog`  
≠ Fabric flag Rects  
≠ competitor SVG  

**Pass:** ≥4 prims · pair≠slab · centeredPath false · honesty NOTES · ethics · unit green  

**Not pass:** P07 place · P08 mesh · smoke alone · portal SVG alone  

**Ethics:** Inspiration yes · assets no  

**Next after symbols half:** save honesty (P06), then browser place (P07), then mesh (P08).

---

## 26. Full absolute path bibliography

### Websites / research packs

- `D:\websites\README.md`
- `D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md`
- `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md`
- `D:\websites\oando-render-options\raw\ui-only\p5d-home.png`
- `D:\websites\oando-render-options\raw\ui-only\p5d-editor.png`
- `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md`
- `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md`
- `D:\websites\planner5d.com\report\PACKAGES_INSPIRATION.md`
- `D:\websites\planner5d.com\report\DEEP_STACK_AND_PACKAGES.md`
- `D:\websites\planner5d.com\report\TOOLBARS.md`
- `D:\websites\roomsketcher.com\report\INSPIRATION.md`
- `D:\websites\floorplanner.com\report\INSPIRATION.md`
- `D:\websites\floorplanner.com\raw\updates.floorplanner.com.md`
- `D:\websites\homestyler.com\report\INSPIRATION.md`
- `D:\websites\ikea.com\planner-public\report\INSPIRATION.md`
- `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\03-inventory\REPORT.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md`
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-packages.md`
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-synthesis.md`
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-plann-compare.md`
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-benchmark.md`

### Repo research index + phase

- `Plans\Research\RESEARCH-MAP.md`
- `Plans\phases\P05-symbols-svg\README.md`
- `Plans\phases\P05-symbols-svg\P05-symbols-svg.md`
- `Plans\phases\P05-symbols-svg\P05-appendix.md`
- `Plans\phases\P05-symbols-svg\P05-suggestions.md`
- `Plans\phases\P05-symbols-svg\02-canvas-2d.md`

### This deliverable

- `Idiots2\P05-symbols-svg\REPORT.md` (this file)
- `Idiots2\README.md` (wave 2 index rule)

---

## 27. Closing statement

P05 is not “add SVG to the app.”  
P05 is **stop lying about what draws furniture on the plan**, and **raise cabinet-v0 from empty-box theater to a manufacturer-readable mark**, using **our** Block2D language, under a hard ethics fence.

Industry proves the **job** (catalog → place → readable 2D).  
Research proves O&O’s **gap** (mesh_symbol low; admin SVG ≠ canvas).  
Phase design proves the **testable bar** (prims, doorStyle, honesty NOTES, CP-05).  
Engine decision proves the **stack** (Canvas interim, Fabric later, Three for 3D, Block2D now, SVG publish later).

Ship and prove that — then stop thrashing symbols and move to save honesty and place journey.

---

*End of Idiots2 P05-symbols-svg REPORT.md — brainstormer 05/10, no product code, sources ordered websites → Plans Research → phase ALL.*
