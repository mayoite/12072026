# P05 — Symbols / SVG Honesty — Brainstormer Report (Agent 05/10)

**Role:** Brainstormer agent 05 of 10 (Idiots program)  
**Checkout:** `D:\OandO07072026` only  
**Write scope:** `Idiots\P05-symbols-svg\` only — **no product code**  
**Phase:** P05 W2 symbols/SVG — `Plans\phases\P05-symbols-svg\` (execute, appendix, suggestions, `02-canvas-2d`)  
**Date of report synthesis:** 2026-07-10  
**Research status:** Maps + reports + live code truth — **not** re-scrape; Firecrawl is dead for active work  

---

## 0. Executive judgment (brutal, no comfort)

### What P05 is actually about

P05 is **not** “make pretty SVG icons” and **not** “wire public/svg-catalog into FeasibilityCanvas.” It is two coupled honesty problems:

1. **Plan-view furniture symbols must be readable** for the hero modular SKU `cabinet-v0` (stop the empty-box bar).
2. **The SVG story must not lie:** Block2D prims own the **live plan canvas** today; admin/CLI `compileSvgForPublish` owns **publish files** for portal/catalog later — these are not the same authority.

### Live code truth (2026-07-10 re-proof, not stale plan memory)

| Claim | Live fact |
|-------|-----------|
| Canvas furniture draw path | `FeasibilityCanvas` → `furnitureBlock2DFromItem` → `renderBlock2DCentered` |
| Modular cabinet symbol | `modularCabinetBlock` builds **multi-prim** Block2D (carcass, inner, front, back, doorStyle cues) — **raised past the historical 2-prim empty-box bar** |
| `furnitureBlockUsesCenteredPath` | **Always returns `false`** with JSDoc that prims are top-left; canvas centers |
| `generateCabinetV0Footprint` | Still a **centered SVG path string** for mesh/footprint helpers — **not** Feasibility draw authority |
| `/svg-catalog/*.svg` | Publish/portal surface; **not** loaded by Feasibility furniture loop |
| Fabric furniture flag | Default OFF; flag-ON is flat Rect overlay — **not** W2 symbol proof |
| Browser place journey | **P07**, not P05; non-blank PNG ≠ symbol quality |
| Mesh beauty | **P08**, not P05 |

### Plan status vs brainstormer duty

The phase card marks CP-05 historically **PASS** (2026-07-09) with evidence under `results/planner/world-standard-wave/05-symbols-svg/`. At report write time that results tree may be absent or not checked out in this workspace (`results/` missing at root). **Brainstormer rule:** do not re-open thrash; **do** raise the bar on what “readable” and “SVG honesty” must mean going forward, and document residual risks (P07 place proof, visual regression, Fabric cutover rebinding Block2D).

### One-sentence north star

> A buyer looking at plan view must **recognize a cabinet** (front, carcass, door style), not a gray rectangle — and the team must never claim “SVG catalog proves plan symbols” when canvas draws procedural Block2D.

---

## 1. Sources read (path index)

### 1.1 Phase pack (mandatory)

| Path | Role |
|------|------|
| `D:\OandO07072026\Plans\phases\P05-symbols-svg\README.md` | Folder index |
| `D:\OandO07072026\Plans\phases\P05-symbols-svg\P05-symbols-svg.md` | Execute card, authority diagram, tasks 00–6, CP-05 hard stop |
| `D:\OandO07072026\Plans\phases\P05-symbols-svg\P05-appendix.md` | Test/impl skeletons, honesty NOTES templates, CP-05.json shape |
| `D:\OandO07072026\Plans\phases\P05-symbols-svg\P05-suggestions.md` | Expert review: centeredPath lie, doorStyle geometry, smoke vs gate split |
| `D:\OandO07072026\Plans\phases\P05-symbols-svg\02-canvas-2d.md` | Canvas/Fabric expert: Block2D authority, flag OFF, keep fabric stage |
| `D:\OandO07072026\Plans\phases\EXPERT-PASS.md` | Consolidated P0 #9: symbols + centeredPath false |

### 1.2 Plans Research (index + maps)

| Path | Role |
|------|------|
| `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md` | Canonical pack index; P05 routes to oando-render-options + P5D catalog quality bar idea |
| `D:\OandO07072026\Plans\Research\RESULTS-MAP.md` | Evidence ≠ research |
| `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE.md` (and siblings) | Plan structure notes |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-*.md` | Historical package/UI synthesis — world-standard 2026-07-09 wins on conflict |

### 1.3 World-standard research (D:\websites)

| Path | Role |
|------|------|
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Pattern library → O&O translation; anti-copy |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Mesh/symbol quality O&O scored **1**; Block2D now → SVG later |
| `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` | Symbols: Block2D canvas + SVG pipeline |
| `D:\websites\research\2026-07-09-world-standard\comparison\03-inventory\REPORT.md` | Catalog is product; SKU+mm+Block2D |
| `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` | mesh_symbol **2**; admin SVG ≠ plan authority |
| `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md` | SVG-only not sole interactive plan |

### 1.4 O&O render options (SVG pipeline honesty home)

| Path | Role |
|------|------|
| `D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md` | Canvas 2D vs SVG DOM vs WebGL decision table |
| `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md` | **Three SVG-related paths**; Wrong #1 preview ≠ canvas; P5D catalog quality as bar idea |
| `D:\websites\oando-render-options\raw\ui-only\` | p5d-home/editor captures (chrome only; editor auth-walled) |

### 1.5 Competitor packs (inspiration only)

| Pack | Start report | Symbol-relevant pattern |
|------|--------------|-------------------------|
| Planner5D | `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md`, `ETHICS_AND_INSPIRATION.md`, `TOOLBARS.md` | Catalog → place; 2D structure then furnish; freemium catalog depth — **not** their SVG files |
| RoomSketcher | `D:\websites\roomsketcher.com\report\INSPIRATION.md` | W2: place ≥2 incl. cabinet-v0; Block2D must read as product |
| Floorplanner | `D:\websites\floorplanner.com\report\INSPIRATION.md` | Furniture library drag-drop; fixed branded sizes; 2D appearance modes |
| Homestyler | `D:\websites\homestyler.com\report\INSPIRATION.md` | Draw → Decorate → Visualize; mesh/symbol public bar high; editor auth-walled |
| IKEA public | `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | Manufacturer SKU truth; modular system configurators |
| 3dplanner | Parked per SYNTHESIS | Do not expand |

### 1.6 Live product code (truth)

| Path | Role |
|------|------|
| `site/features/planner/open3d/catalog/furnitureBlock2D.ts` | **Primary** modularCabinetBlock + furnitureBlock2DFromItem + centeredPath helper |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | `renderBlock2DToCanvas` / `renderBlock2DCentered` |
| `site/lib/catalog/blocks2d.ts` | Prim vocabulary + `blockToSvg` (inventory DOM preview) |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Furniture layer draw (~L583–623) |
| `site/features/planner/open3d/catalog/parametricBuilder.ts` | `resolveFurniture2DFootprint` (centered path string — mesh/helper) |
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | `generateCabinetV0Footprint` (centered box path) |
| `site/features/planner/asset-engine/README.md` | Canvas vs publish honesty table |
| `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` | Publish compile entry |
| `site/features/planner/asset-engine/stages.ts` | S1–S7 stage map including svg-catalog write |
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | W2 unit home |

### 1.7 Linked phases

| Path | Link |
|------|------|
| `Plans/phases/P07-draw-place-journey/P07-draw-place-journey.md` | Browser place ≥2; non-blank PNG ≠ P05 quality |
| `Plans/phases/P02-engine-lock/` + fabric destination | Flag OFF for W2 proof |
| `Plans/phases/P08-mesh-quality/` | 3D parts bar; not plan symbol |

---

## 2. Authority model — Block2D vs svg-catalog (the spine)

### 2.1 Correct mental model (binding)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ PLAN CANVAS AUTHORITY (W2 / P05 product half)                            │
│                                                                          │
│  Open3dFurnitureItem                                                     │
│       → furnitureBlock2DFromItem(item)                                   │
│            → modularCabinetBlock | workstation | catalog bridge | box    │
│       → Block2D { footprint mm, prims[] }  // authored TOP-LEFT 0..L,0..D│
│       → FeasibilityCanvas transform: translate(screen) · rotate · scale  │
│       → renderBlock2DCentered(ctx, block)  // translates −L/2, −D/2      │
│                                                                          │
│  Inventory thumbnail (related, same prim vocabulary):                    │
│       resolveCatalogItemBlock2D → blockToSvg → DOM (sanitize)            │
│  Same geometry family; different surface (DOM SVG ≠ canvas paint).       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PUBLISH SVG AUTHORITY (admin/CLI / portal — honesty half of P05)         │
│                                                                          │
│  Descriptor JSON                                                         │
│       → compileSvgForPublish (normalize + pipelineCore + optimise)       │
│       → publishDescriptorWithPipeline / generate-svg CLI                 │
│       → public/svg-catalog/{slug}.svg                                    │
│       → /portal/svg-catalog preview                                      │
│                                                                          │
│  NOT wired as Feasibility furniture draw path today.                     │
│  S7 “inventory place consumes published SVG” is future — do not claim.   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ FOOTPRINT PATH STRING (mesh / legacy helper — NOT plan symbol authority) │
│                                                                          │
│  resolveFurniture2DFootprint → generateCabinetV0Footprint                │
│  = centered SVG path d="M -w/2 -d/2 L … Z"                               │
│  Used by mesh stages / parametric helpers.                               │
│  Historical CANVAS_INVENTORY note about Path2D-only furniture is the     │
│  OLD wrong world; live Feasibility now paints Block2D prims.             │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Why the split exists (product honesty)

| Surface | Buyer job | Failure mode if confused |
|---------|-----------|--------------------------|
| Plan canvas Block2D | “Is that a cabinet or a blob?” | Claim SVG pipeline green while canvas is empty boxes |
| Inventory `blockToSvg` | Tile preview matches product family | Preview rich, canvas empty (historical Wrong #1) |
| Publish svg-catalog | Admin asset governance, portal, print later | Treat portal catalog as proof of open3d place |
| Path2D footprint | Mesh envelope / legacy | Double-center or author centered prims by mistake |

### 2.3 What experts locked (quotes distilled)

**From P05 execute card:**

> Plan canvas → `furnitureBlock2DFromItem` → Block2D prims (top-left) → `renderBlock2DCentered`  
> **(AUTHORITY FOR W2 PLAN SYMBOLS TODAY)**  
> Admin/CLI → `compileSvgForPublish` → `public/svg-catalog/{slug}.svg`  
> **(PUBLISH AUTHORITY — NOT Feasibility draw path today)**  
> `generateCabinetV0Footprint` = mesh helper path string — NOT canvas Block2D.

**From 02-canvas-2d expert pass:**

> **Block2D = plan-symbol authority today** — Never claim `/svg-catalog/*.svg` or `compileSvgForPublish` as Feasibility draw path.

**From asset-engine README (landed honesty):**

> W2 acceptance is **Block2D readable**, not “SVG loaded onto FeasibilityCanvas.”  
> Do not mark S7 implemented until inventory place consumes published SVG with evidence.

**From oando-render-options CANVAS_INVENTORY (historical diagnosis — still teaches the class of bug):**

> **Symptom:** “SVG doesn’t render on canvas” — correct: **SVG never goes to canvas**. Only a path `d` string does.  
> **Fix direction:** walk `prims` with Canvas 2D API (shared prim renderer) — which is exactly what `renderBlock2DToCanvas` now is.

**Research-map routing for P05:**

> P05 / W2 symbols → oando-render-options canvas/SVG vocab; P5D catalog quality as **bar idea** → Block2D + O&O pipeline honesty → evidence `05-symbols-svg/`.

### 2.4 False-reverse table (do not ship these lies)

| Lie | Why it is wrong |
|-----|-----------------|
| “SVG is the FeasibilityCanvas authority” | Live paint is Block2D prims |
| “cabinet-v0 plan mark is published SVG” | Modular path is procedural prims in `modularCabinetBlock` |
| “Portal svg-catalog proves planner place symbols” | Portal is publish preview |
| “`furnitureBlockUsesCenteredPath` means modular prims are centered” | Was a dead lie; now fixed always false |
| “Fabric flag-ON Rects prove W2” | Flat Rect ≠ Block2D; dual hit surface |
| “SVG smoke green = W2 green” | Smoke is publish honesty; symbol half is unit+visual Block2D |
| “generateCabinetV0Footprint is the plan symbol” | Centered empty rectangle path for mesh |
| “Non-blank PNG in P07 = P05 quality” | Explicit anti-false-green in P07 |

---

## 3. The empty-box problem (root cause → bar)

### 3.1 What “empty box” meant historically

Per phase baseline and P05-suggestions (live verification at plan time 2026-07-09):

- `modularCabinetBlock` was **exactly 2 prims**: outer rect + one dashed center line.
- Buyer perception: a filled rectangle (or dashed blob) — **not** a cabinet.
- MASTER-CHART scored O&O mesh/symbol quality at **1** (missing/broken) against Homestyler/Foyr public bar.
- oando-self scored mesh_symbol **2**: “Not manufacturer-catalog readable symbols at world bar.”

That is the **empty-box problem**: not a missing draw call, but a **symbol that fails product recognition**.

### 3.2 Why empty boxes are lethal for O&O specifically

O&O’s differentiator is **manufacturer SKU + mm truth + BOQ**, not photoreal (SYNTHESIS). If plan symbols are apologetic boxes:

1. **Trust collapses** — “is this really an 800×400 cabinet?” becomes pure status-bar numbers with no visual cross-check.
2. **Inventory preview vs canvas mismatch** (historical Wrong #1) trains users that the product is broken even when place works.
3. **W2 place green without readable symbols** is a **paper PASS** — P07 explicitly warns non-blank PNG ≠ quality.
4. **B2B dealers** compare against IKEA/Floorplanner fixed-size branded silhouettes; boxes look like student demos.

### 3.3 What raised the bar (live modularCabinetBlock)

Live implementation (condensed semantics, not a code dump for re-implementation theater):

1. **Outer carcass** — light `BLOCK_STYLE.surface` fill + stroke (contrast rule: not opaque inverse blob).
2. **Inner carcass rect** — inset outline, fill none (depth of cabinet body).
3. **Front edge line** — stronger stroke at `frontY = d - inset` (door face).
4. **Back edge line** — weaker stroke at back.
5. **doorStyle branches:**
   - **pair:** mid vertical stile (dashed) + two handle rects at 25% / 75% width.
   - **slab:** **no** mid stile; single handle offset to the front-right.
   - **none:** two horizontal dashed shelf cues at ~33% / 66% depth.
6. **≥4 prims** for slab/pair paths; all geometry clamped inside footprint.
7. **No external SVG/GLB URLs** in symbol construction.

### 3.4 Residual empty-box risk (honesty)

| Risk | Status |
|------|--------|
| Unknown SKU | `boxBlock` / generic still a single rect — **acceptable fallback** if non-empty; not hero SKU |
| Bridge fail | Falls through generic → box; must stay non-empty |
| Fabric flag-ON | Reverts to plain Rect — **symbol regression** if cutover without Block2D rebind |
| Zoom scale | Stroke widths in mm; at tiny `transform.scale` detail collapses — `skipShadow` already at scale < 0.05; min screen-space stroke still a polish risk |
| Other SKUs | Desks/chairs depend on catalog bridge prim quality — cabinet-v0 is the W2 hero, not the whole catalog |
| Material color tint | Feasibility underlays optional `item.color` at 0.15 alpha — can muddy contrast if abused |

### 3.5 Definition: empty-box is DEAD when…

A symbol is **not** empty-box if **all** hold:

1. Outer silhouette + at least one **interior structure** cue (not only a fill).
2. **Front ≠ back** (asymmetric depth cues).
3. **Config variants change geometry** (doorStyle).
4. At working plan zoom, a new user can answer: “cabinet, doors, which way is front?”
5. No competitor art required to achieve (1)–(4).

---

## 4. doorStyle geometry (must actually differ)

### 4.1 Type truth

`Open3dModularCabinetV0Options.doorStyle`: **`none` | `slab` | `pair`** (match plan branches; reject invalid in modular place tests).

### 4.2 Expert failure that almost shipped

**P05-suggestions S2:** early skeleton still drew a vertical center stile for **slab** (same as pair). That would:

- Fail the visual criterion “door style changes geometry.”
- Poison the mid-stile unit test (both styles have mid-X lines).
- Teach buyers that configuration does nothing in 2D.

**Correct contract (binding):**

| doorStyle | Geometry must show |
|-----------|-------------------|
| **pair** | Mid vertical stile at `w/2` (between doors) + **two** handles |
| **slab** | **Zero** mid vertical stile; **one** handle offset |
| **none** | Shelf lines only; no door handles / no stile |

### 4.3 Test authority

Cabinet-v0 unit suite:

- `midVerticalStileCount(pair) ≥ 1`
- `midVerticalStileCount(slab) === 0`
- Prims inside footprint
- Canvas fill+stroke issued
- No `.glb` / `.svg` / `svg-catalog` in serialized block

### 4.4 Link to 3D (P08) — do not conflate

3D mesh also branches doorStyle (toe → carcass → door-slab / pair doors / none). **P05 is plan 2D.** Consistency of *meaning* across 2D/3D is good product grammar; **mesh beauty is out of P05 scope.**

---

## 5. The centeredPath lie (dead API honesty)

### 5.1 What the lie was

| Fact | Detail |
|------|--------|
| Function | `furnitureBlockUsesCenteredPath(item)` |
| Historical return | `true` for modular-cabinet-v0 |
| Actual modular prim authorship | Top-left `0..L, 0..D` |
| Actual canvas centering | `renderBlock2DCentered` does `translate(-L/2, -D/2)` |
| Call sites | Effectively **unused** elsewhere (dead API) |
| Blast | Any future consumer that *trusted* the name would double-center or skip center |

### 5.2 What fixed it

```
// Contract now:
// All furnitureBlock2D prims authored top-left.
// Canvas centers via renderBlock2DCentered.
// Always false.
export function furnitureBlockUsesCenteredPath(_item): boolean {
  return false;
}
```

Unit asserts `furnitureBlockUsesCenteredPath(cabinetItem()) === false`.

### 5.3 Related confusion: `generateCabinetV0Footprint`

This **is** centered (`M -halfW -halfD …`). That is fine **for footprint path consumers** (mesh stages). The lie was claiming **Block2D prims** were centered. Keep both:

| API | Coordinate system | Consumer |
|-----|-------------------|----------|
| Block2D prims | Top-left | Plan canvas + blockToSvg |
| Footprint path string | Centered | Mesh/helper Path2D world |

Never merge them without an explicit transform layer.

### 5.4 Naming debt recommendation (future, not P05 reopen)

If the helper stays forever-false, options later:

1. **Keep** as documented sentinel (smallest blast) — current choice.
2. **Delete** once zero imports and no external docs depend on it.
3. **Rename** to `furnitureBlockPrimsAreTopLeft(): true` if confusion recurs.

Do not thrash mid-spine.

---

## 6. Admin / CLI SVG pipeline (honest story)

### 6.1 Stages (from asset-engine)

| Stage | Meaning | Entry |
|-------|---------|-------|
| S1 | Normalize descriptor | `normalizeDescriptorForPipeline` |
| S2–S3 | pipelineCore + optimise | `runSvgCompileStages` / `compileSvgForPublish` |
| S4 | Write disk | `public/svg-catalog/{slug}.svg` via CLI / runSvgPipeline |
| S6 | Persist | `publishDescriptorWithPipeline` → descriptor + preview URL |
| V1 | `svgCompiler.server.ts` | **v1-reference-only** — not publish authority |

### 6.2 Commands (honesty evidence, not symbol pass)

```powershell
cd D:\OandO07072026\site
pnpm run scripts:smoke:svg          # single fixture
pnpm run scripts:smoke:svg:batch    # all _fixtures
pnpm run scripts:generate-svg -- path/to/descriptor.json
```

### 6.3 Portal surface

- `/portal/svg-catalog` public (proxy tests assert unauthenticated allowed).
- Preview of **published** files — not open3d Feasibility draw.

### 6.4 Gate split (S6 in suggestions — binding)

| Claim | Requires |
|-------|----------|
| W2 symbol quality green | Unit cabinet-v0 + non-empty + doorStyle + centeredPath false + visual prims/PNG + ethics |
| SVG honesty smoke green | batch smoke exit 0 + honesty NOTES |
| “SVG pipeline works” in marketing/docs | Smoke green + publish path evidence |
| S7 place from published SVG | Explicit future inventory consumption evidence — **not** current |

**If smoke fails:** CP-05 may still pass **symbol half** if Block2D is solid and NOTES do **not** claim smoke green. Never paper-pass smoke.

### 6.5 What SVG pipeline honesty NOTES must contain

From appendix template (must be filled with real exit codes, never TBD):

**What is true**

1. Publish compile authority = `compileSvgForPublish` → pipelineCore+normalize  
2. Admin publish wire = `publishDescriptorWithPipeline` → `public/svg-catalog/{slug}.svg`  
3. CLI fixtures: smoke scripts  
4. V1 compiler = reference only  
5. Open3d plan canvas does **not** draw from `/svg-catalog/*.svg` today (Block2D)  
6. `generateCabinetV0Footprint` is mesh/helper — not canvas Block2D  

**What is not true**

1. “SVG is the FeasibilityCanvas authority.”  
2. “cabinet-v0 plan mark is published SVG.”  
3. “Portal svg-catalog proves planner place symbols.”  
4. “furnitureBlockUsesCenteredPath means modular prims are centered.” (fixed false)

### 6.6 Three SVG-related paths (oando-render-options — still the clearest diagram)

Even after Feasibility adopted Block2D paint, the **three-path taxonomy** remains the training document for new agents:

| Path | Name | Output |
|------|------|--------|
| A | Procedural symbol → inventory thumbnail | `blockToSvg` → DOM |
| B | Live plan furniture | **Now:** Block2D → canvas prims (**was:** Path2D footprint only — that was the bug) |
| C | Asset-engine compile | Published SVG files |

Agents who collapse A/B/C will reintroduce the class of bug. Teach the table in every onboarding.

---

## 7. Competitive symbol quality patterns (inspiration only)

### 7.1 What “class-leading” looks like as **jobs** (not assets)

| Job | Who signals it publicly | O&O translation |
|-----|-------------------------|-----------------|
| Catalog item looks like the product in plan | Homestyler / Foyr / P5D mesh+symbol scores high | Multi-prim Block2D + modular mesh (P05 + P08) |
| Fixed-size branded items don’t stretch | Floorplanner branded fixed size | SKU mm lock; no silent free-scale on sellable items |
| Article identity + modules | IKEA kitchen/system planners | cabinet-v0 modular options + real SKU rows |
| Place friction low | P5D / Floorplanner drag or click place | P07 place journey; P05 only ensures **what appears** after place |
| Structure first, then furnish | RoomSketcher funnel | W1 then W2; symbols matter after walls exist |
| Plan export readability | RoomSketcher pro 2D | Later export quality; Block2D is the geometry source of truth |

### 7.2 MASTER-CHART scores (decision aid, not license to clone)

| Product | Mesh/symbol (approx) |
|---------|---------------------|
| Homestyler / Foyr | Highest public viz bar |
| Planner5D / Floorplanner | Strong consumer readability |
| RoomSketcher | Strong 2D plan discipline |
| IKEA | Product-true modules more than free furniture art |
| **O&O live (research self)** | **1–2** — spine only |

**Steal pattern, not pixels:** “readable top-down furniture grammar” and “SKU-true size,” not their SVG paths, icons, or GLBs.

### 7.3 P5D catalog quality as **bar idea** (explicit research routing)

RESEARCH-MAP:

> P05 / W2 symbols \| oando-render-options …; **P5D catalog quality as bar idea** \| Block2D + O&O pipeline honesty

Meaning:

- Use **quality of recognition** as the bar (buyer sees “desk / cabinet / chair” at a glance).
- Do **not** harvest P5D CDN assets (`storage.planner5d.com`, editor bundles in `raw/deep/`).
- Editor scrape is auth-walled (`p5d-editor.png` = sign-up wall only) — **no** deep inventory symbol reverse-engineering.

### 7.4 Patterns to explicitly reject

| Anti-pattern | Why |
|--------------|-----|
| Million generic props | Fails B2B SKU truth (inventory report) |
| Image-to-3D as catalog strategy | Mood ≠ order code |
| Free W/D/H on sellable SKUs | Corrupts mm / BOQ |
| Competitor SVG paste into `public/svg-catalog` | Ethics hard fail |
| Photoreal first | Wrong race; BOQ is wedge |
| Dual CAD engines for W2 proof | Fabric flag-ON dual pointer |

---

## 8. What “readable” means for a buyer

### 8.1 Buyer persona (O&O)

- Dealer / space planner / manufacturer AE placing **real office furniture**.
- Needs to trust **mm** and **SKU** enough to quote.
- Not a game designer chasing photoreal living rooms.

### 8.2 Readable = answer these questions in plan view in < 2 seconds

1. **What is it?** Cabinet vs desk vs workstation assembly.  
2. **Which way is front?** Door face / handle side readable.  
3. **How wide/deep?** Silhouette matches footprint; zoom preserves outline.  
4. **How is it configured?** Slab vs pair vs open shelves looks different.  
5. **Is it selected?** Selection halo distinct from symbol stroke.  
6. **Does inventory match canvas?** Same family of prim language.

### 8.3 Readable is NOT

| Not a bar | Why |
|-----------|-----|
| Pixel-identical to Homestyler | Trade dress + ethics |
| Photoreal top-down textures | Wrong cost; wrong race |
| Full CAD detail at all zoom levels | Stroke collapse at micro zoom is normal; min-stroke is polish |
| SVG file on disk | Wrong authority today |
| Unit test green alone | Buyer never runs vitest |
| Non-blank canvas PNG | Could be a single rect |

### 8.4 Operational readability criteria (P05 Task 5)

From execute card:

- Outer carcass present  
- Front ≠ back  
- doorStyle geometry differs  
- Not undetailed fill  
- No competitor art  

**Raised bar (brainstormer — recommend for future CP language):**

| Criterion | Minimum | Strong |
|-----------|---------|--------|
| Prim count (cabinet-v0) | ≥4 | ≥5 with handles |
| Contrast | Light fill + dark detail stroke | Theme tokens resolve on canvas |
| doorStyle | pair ≠ slab mid stile | none shelves also distinct |
| Zoom | Readable at default open3d transform scale (~0.1 INITIAL) | Readable ±1 zoom step |
| Inventory match | Same Block2D family | Pixel-similar thumbnail |
| Ethics | Original prims | Documented style tokens only |

### 8.5 Accessibility / color

- Canvas must **resolve CSS tokens** (`createCanvasBlockColorResolver`) — CSS vars do not work inside Path2D fills historically; same lesson for prim stroke strings.
- Contrast rule already in modularCabinetBlock comments: avoid opaque inverse-body carcass + same-family stroke = solid blob.
- Selection uses `--color-primary` dashed rect outside footprint — must not obscure door cues.

---

## 9. Plan critique (P05 pack — what is strong / weak / missing)

### 9.1 What the plan got right

| Strength | Why it matters |
|----------|----------------|
| Explicit dual-authority diagram | Prevents the #1 agent hallucination |
| TDD skeleton for cabinet-v0 | Forces ≥4 prims, doorStyle, centeredPath, ethics |
| SVG smoke ≠ automatic W2 fail | Correct gate split |
| Out of scope list (mesh, Fabric, SVGR, CDN, competitor SVG) | Stops thrash |
| Appendix skeletons out of execute card | Hybrid thin structure rewrite |
| Expert suggestions applied (S1–S7) | doorStyle, commit shape, de-dupe Task 3 |
| Link to 02-canvas-2d | Flag OFF, keep fabric stage |
| Evidence folder fixed name | `05-symbols-svg/` |

### 9.2 What the plan under-specified or risked

| Gap | Risk | Raised bar fix |
|-----|------|----------------|
| “Readable” still partly subjective | Paper PASS on prim count alone | Add buyer Q&A checklist + default-zoom visual NOTES |
| Historical results path may vanish | Status claims without evidence | Re-prove units + honesty NOTES before re-assert CP-05 |
| Catalog-wide symbol quality | Only cabinet-v0 hero | Phase says hero first; follow-on matrix for desks/chairs |
| Screen-space stroke min | Detail vanishes at low zoom | Future polish criterion |
| Fabric cutover rebinding | Destination stage drops Block2D | Explicit P02/Fabric task: map Block2D → Fabric objects |
| Units debt (cm vs mm naming) | oando inventory doc | End-to-end mm internal remains hard law |
| S7 confusion | Agents “finish” SVG by loading files on canvas early | Keep S7 blocked until place evidence |
| Browser visual optional | Prefer PNG but allow prim JSON | OK for unit phase; P07 must still place |

### 9.3 Task map quality

| Task | Critique |
|------|----------|
| 00 Baseline | Correct greps; baseline NOTES still valuable as historical truth snapshot even after green |
| 1 RED tests | Strong; appendix skeleton is complete enough for agent TDD |
| 2 GREEN modularCabinetBlock | Skeleton good after S2 doorStyle fix; contrast rule was a real product insight |
| 3 Unknown SKU | Correct de-dupe vs demo-desk |
| 4 SVG honesty | Best honesty slice in the wave; do not skip NOTES |
| 5 Visual | Prim JSON is weaker than browser PNG — accept with NOTES honesty |
| 6 CP-05 pack | Claims object is excellent; keep `browserPlaceJourney: deferred-to-P07` |

### 9.4 Kill-order honesty

P05 is **parallel fill** after CP-02, not spine-blocking alone. Full product story still needs:

- **P07** browser place  
- **P03** select/delete  
- **P08** mesh  

Symbol quality without place is **lab green**. Place without symbols is **demo green**. Buyers need both.

### 9.5 Suggestions disposition (reaffirmed)

| ID | Apply? | Brainstormer note |
|----|--------|-------------------|
| S1 centeredPath false | Yes | Landed live |
| S2 doorStyle differ | Yes | Landed live |
| S3 run.json + commit shape | Yes | Always for evidence |
| S4 Task 3 de-dupe | Yes | |
| S5 types from model | Yes | |
| S6 smoke vs W2 split | Yes | Permanent law |
| S7 nav links | Yes | |
| S8 shared mockContext | Optional noise | Skip |
| S9 out of scope | Confirmed | |

---

## 10. Raised bar for real symbols/SVGs (beyond historical CP-05)

### 10.1 Minimum bar (CP-05 / W2 half) — already plan language

- cabinet-v0 ≥4 prims  
- doorStyle geometry differs  
- centeredPath false  
- non-empty unknown SKU  
- honesty NOTES  
- no competitor SVG  
- unit green + visual artifact  

### 10.2 Raised product bar (recommend next symbol wave — not thrash)

1. **Catalog matrix:** every placeable demo SKU has a named Block2D builder or bridge coverage with prim count ≥ floor by category.  
2. **Thumbnail ↔ canvas parity test:** same `furnitureBlock2DFromItem` / bridge used for both; snapshot hash of prim kinds.  
3. **Zoom readability:** at INITIAL_TRANSFORM scale 0.1, front line still stroke-visible (screen-space min width).  
4. **Orientation grammar:** consistent “front = +Y depth” documented in one place; mesh door faces same side.  
5. **Workstation / systems:** workstationBlock2D already multi-rect; hold to same contrast rules.  
6. **Publish SVG quality:** descriptors produce symbols that match Block2D family when S7 arrives — **same prim source preferred**, not two art tracks.  
7. **Fabric destination:** FurnitureFabricLayer must rebind Block2D or **explicitly** accept temporary regression with gate re-proof.  
8. **Buyer acceptance string:** “I can tell slab vs pair without reading the inspector.”  

### 10.3 SVG quality bar (publish track)

| Check | Bar |
|-------|-----|
| Compile authority single entry | `compileSvgForPublish` only |
| Sanitization | No raw untrusted markup to disk/portal |
| Determinism | Golden tests for fixtures |
| No competitor paths | Ethics + review of fixture sources |
| Preview URL honesty | `/svg-catalog/{slug}.svg` only after S4 write |
| Do not claim plan draw | Until S7 evidence |

### 10.4 What not to raise into P05 thrash

- Full Fabric walls cutover  
- Photoreal 2D materials  
- Competitor icon sets  
- SVGR runtime  
- CDN SVG as live draw  
- Mesh toe polish (P08)

---

## 11. Approaches (2–3) with trade-offs and recommendation

### Approach A — **Procedural Block2D first (RECOMMENDED — live path)**

**Idea:** Author plan symbols as prim lists in mm; paint with `renderBlock2DToCanvas`; inventory uses `blockToSvg` from same vocabulary; publish pipeline remains separate.

| Pros | Cons |
|------|------|
| One geometry family for canvas + thumbnail | Hand-authored prims per product family |
| No competitor assets | Not photoreal |
| Unit-testable without browser | Zoom stroke needs care |
| Aligns with ethics + SKU parametric config (doorStyle) | Catalog scale needs builders/bridge |
| Already wired in Feasibility | Fabric cutover must rebind |

**When:** Now through W2 and until S7 deliberately merges publish into place.

### Approach B — **Rasterize published SVG → drawImage on canvas**

**Idea:** compileSvgForPublish → cache ImageBitmap per slug → canvas drawImage at place.

| Pros | Cons |
|------|------|
| Single publish art track | Async load, cache invalidation |
| Crisp print-like marks | Loses easy doorStyle parametric without recompile |
| Matches some CAD “symbol libraries” | Risk of reintroducing “SVG is canvas authority” confusion |
| | Heavier for modular options matrix |

**When:** Only after S7 product decision and parametric story (regenerate SVG on doorStyle change). **Not** for current W2.

### Approach C — **Fabric objects from prims (destination hybrid)**

**Idea:** Same Block2D prims → Fabric Rect/Line/Path objects for select/transform product CAD.

| Pros | Cons |
|------|------|
| Aligns ENGINE-DECISION Fabric full stage | Not W2 proof (flag OFF) |
| Object model for multi-select | Dual pointer if half-cutover |
| Reuses Approach A geometry | Mapper work; regression if only Rects |

**When:** After W gates; **rebind Block2D**, do not ship plain Rect as permanent symbols.

### Recommendation

**Ship and hold Approach A** as plan authority. Use Approach C as **destination mapping of A**, not a replacement geometry language. Park Approach B until publish and place intentionally share one compiled artifact with option recompile.

---

## 12. Ethics — non-copy (binding)

### 12.1 Allowed

- Study product **behavior** (structure → furnish → 2D|3D → save).  
- Use public marketing/help as **job lists**.  
- Use open packages already in tree (Canvas 2D, Fabric installed, svgo/sharp for **publish**, Phosphor for chrome).  
- Author **original** prim geometry and modular mesh.  
- Treat P5D catalog **quality** as a bar idea.

### 12.2 Forbidden

| Forbidden | Example |
|-----------|---------|
| Competitor SVG/JS/GLB/sprites into `site/` | Paste from `D:\websites\planner5d.com\raw\deep\bundles\app.js` |
| Competitor path `d=` strings | Trace their furniture silhouettes into fixtures |
| Brand / trade dress clone | Look like “their app rebranded” |
| Auth bypass scrapes | Editor inventory private UI |
| Research files as product assets | Commit `p5d-*.png` into public app |

### 12.3 Source quotes (ethics)

**ETHICS_AND_INSPIRATION (Planner5D pack):**

> If a reasonable person would say “you rebuilt the *idea* with your own work” → OK.  
> If they would say “you took *their* implementation or look” → stop.

**SYNTHESIS:**

> Study patterns. Do not copy UI, assets, code, or brands into O&O product.

**P05 execute card:**

> Original O&O prims only. No competitor SVG/JS/GLB. MIT packages already in tree only.

**AGENTS.md research rule:**

> Research/ideas only under `D:\websites` (patterns/JTBD only — **not** paste into `site/`).

### 12.4 Practical review checklist for any symbol PR

1. Prim points hand-authored or derived from **our** modular dims?  
2. Any URL to competitor CDN?  
3. Any new asset binary without license row?  
4. Does README claim “SVG catalog is plan symbols”? If yes, fix honesty.  
5. Did Fabric flag get left ON in tests for “easier” green? Fail.

---

## 13. Linkage to P07 place (and neighbors)

### 13.1 Split of responsibility

| Concern | Phase | Pass means |
|---------|-------|------------|
| Symbol geometry quality | **P05** | Unit + prim visual + honesty |
| Unaided place ≥2 incl. cabinet-v0 | **P07** | Playwright serial journey + PNGs |
| Select/delete | **P03** | Browser + unit |
| Mesh parts | **P08** | Visual + mesh tests |
| Save honesty | **P06** | Flush + labels |

### 13.2 P07 anti-false-green (critical)

From P07 execute card:

> Anti place false-green (W2): `furnitureBefore` then ≥ `+2` incl. **cabinet-v0** + second SKU; **non-blank canvas PNG ≠ P05 symbol quality**.

And CP-07:

> Full product story still needs CP-03 + CP-05 not red unless owner WAIVE.

So:

- P07 can show furniture count + non-blank pixels.  
- P05 proves those pixels are **cabinet-shaped**.  
- Neither alone is the full W2 story.

### 13.3 What P07 must assume from P05

1. `geometryMode: "modular-cabinet-v0"` on demo catalog cabinet-v0.  
2. Feasibility draws Block2D with flag OFF.  
3. Symbols non-empty so place is visible.  
4. Does **not** need to re-assert mid stile math (unit owns that).

### 13.4 What P05 must not pretend about P07

- Browser place journey  
- Drag-drop polish  
- Seed walls ≥ N as W1  
- That CP-05 alone unlocks “world-standard place”

### 13.5 Fabric flag interaction with place tests

Prove place and symbols with **`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` ≠ `"1"`**. Flag-ON hides Feasibility furniture draw and mounts Rect layer — invalid for W2 symbol + can desync pan/zoom.

---

## 14. Live path truth deep-dive (Feasibility furniture loop)

### 14.1 Draw loop (semantic)

For each furniture item when `layerVisibility.furniture`:

1. Project document position → screen center.  
2. Build `block = furnitureBlock2DFromItem(item)`.  
3. `translate(center)` → `rotate(degrees→radians)` → `scale(transform.scale)`.  
4. Optional color underlay at low alpha using footprint half-extents.  
5. `renderBlock2DCentered` (shifts top-left prims so position is center).  
6. If selected: dashed primary rect padded outside footprint.

Comment in source: procedural Block2D, same family as inventory, no external GLB/SVG downloads.

### 14.2 Resolution order inside `furnitureBlock2DFromItem`

1. `geometryMode === "modular-cabinet-v0"` → `modularCabinetBlock`  
2. Workstation config key parse → `workstationBlock2DFromItem`  
3. Catalog bridge via `open3dLikeBuddyCatalogItem` + `resolveCatalogItemBlock2D` (rescale if needed)  
4. `buildGenericBlock2D`  
5. `boxBlock` last resort  

### 14.3 Why this order is correct for O&O

- Modular SKUs get **config-aware** symbols first.  
- Systems furniture gets assembly prims.  
- Generic catalog still gets procedural richness when bridge knows the type.  
- Unknown never draws **zero** prims if box fallback holds.

---

## 15. Units, transforms, and authorship rules

### 15.1 Authorship rule (memorize)

> **Prims top-left in mm. Position is center. Canvas centers. Rotation in degrees on furniture document.**

### 15.2 transform stack

```
document mm position (center)
  → projectToScreen
  → ctx.translate(screen)
  → ctx.rotate(rotation° → rad)
  → ctx.scale(viewScale)
  → renderBlock2DCentered: translate(-L/2, -D/2)
  → draw prims in mm
```

### 15.3 Units debt (from inventory report)

- Some catalog fields historically named `*Mm` but held cm.  
- Bridge may multiply by 10.  
- **Law for symbols:** after resolve, Block2D footprint must match **placed** width/depth mm within 1mm or rescale. Live modular path uses modularOptions mm directly — good.

### 15.4 INITIAL_TRANSFORM note (from 02-canvas-2d)

`{ origin: (-4000,-2500), scale: 0.1 }` — tests and visual NOTES should respect default open3d transform; do not thrash `fitToView` as W2 criterion.

---

## 16. Testing strategy (phase + raised)

### 16.1 Unit (P05 core)

| Suite | Asserts |
|-------|---------|
| `furnitureBlock2D.cabinet-v0.test.ts` | dims, ≥4 prims, bounds, pair/slab stile, centeredPath false, fill+stroke, no external URLs |
| `renderBlock2DToCanvas.test.ts` | paint + unknown SKU non-empty |
| Workstation tests | multi-rect systems |

### 16.2 SVG honesty

| Suite / script | Asserts |
|----------------|---------|
| `runSvgCompileStages` / `compileSvgForPublish` unit | publish compile |
| `scripts:smoke:svg:batch` | fixtures exit 0 |
| Admin e2e publish | portal path (separate) |

### 16.3 Visual

| Mode | Strength |
|------|----------|
| Prim JSON dump | Deterministic, CI-friendly, weak on contrast |
| Playwright place PNG | Strong buyer evidence; owned primarily by P07 |
| Side-by-side slab vs pair PNG | Best doorStyle story |

### 16.4 What “green” must never hide

- Filtered logs  
- Silent skip  
- Fabric flag-ON  
- Claiming smoke without log  
- Claiming place without P07  

---

## 17. Evidence pack shape (canonical)

**Root:** `results/planner/world-standard-wave/05-symbols-svg/`

| Slice | Artifacts |
|-------|-----------|
| `00-baseline/` | vitest-raw.log, run.json, NOTES |
| `01-red/` | failing log + run.json |
| `02-green/` | passing log + run.json |
| `03-nonempty/` | unknown SKU log |
| `04-svg-honesty/` | smoke log + NOTES.md |
| `05-visual/` | prim JSON and/or PNG + NOTES |
| Root | `CP-05.json`, `SUMMARY.md`, optional `CP-05-vitest-raw.log` |

**CP-05.json claims (shape):**

```json
{
  "checkpoint": "CP-05",
  "phase": "P05-symbols-svg",
  "gate": "W2-symbol-quality",
  "status": "pass-or-fail",
  "claims": {
    "cabinetV0Block2DReadable": true,
    "notEmptyBox": true,
    "doorStyleGeometryDiffers": true,
    "canvasAuthorityIsBlock2D": true,
    "furnitureBlockUsesCenteredPathIsFalse": true,
    "svgCatalogIsPublishNotCanvas": true,
    "svgHonestySmoke": "pass-or-fail-or-skipped-with-notes",
    "noCompetitorSvg": true,
    "browserPlaceJourney": "deferred-to-P07"
  }
}
```

**Done language (SUMMARY):**

- Done = ≥4 prims · pair/slab differ · centeredPath false · honesty · ethics  
- Not done = P07 place · P08 mesh · SVG as canvas draw  

---

## 18. Full websites pack inventory (P05-relevant)

### 18.1 Pack map

| Root under `D:\websites` | Contents | P05 use |
|--------------------------|----------|---------|
| `planner5d.com/` | Deep Firecrawl; ethics; toolbars; packages; deep bundles **study-only** | Catalog quality bar idea; chrome IA; **no** assets |
| `roomsketcher.com/` | Help + features | W2 place pattern; measure later |
| `floorplanner.com/` | Manuals + marketing | Library place; fixed size SKUs |
| `homestyler.com/` | Forum + marketing | Decorate readability bar; mesh/symbol public high |
| `ikea.com/planner-public/` | Public planner hub | Manufacturer modular + SKU truth |
| `3dplanner.com/` | Shallow | Parked |
| `oando-render-options/` | Canvas/SVG process | **Primary P05 research home** |
| `research/2026-07-09-world-standard/` | SYNTHESIS + comparison slices | Scores + engine decision |
| `research/from-repo-Plans-Research/` | 2026-07-05 synthesis | Historical SVG Option A lock context |
| `research/oem-systems/` | OEM furniture OEMs | SKU depth ideas later |

### 18.2 oando-render-options deep themes

**CANVAS_RENDER_OPTIONS:** choose Canvas 2D for plan edit; SVG DOM for print/annotation; WebGL for 3D — hybrid product model.

**CANVAS_INVENTORY_UI_SVG wrongs that P05 attacks:**

1. Preview ≠ canvas  
2. Units/naming debt  
3. CSS variables on wrong surface  
4. Dual engines Fabric idle  
5. Sanitize inconsistency  
6. Inventory hydration complexity  
7. Expecting competitor editor screenshots behind auth  

**Correct target architecture (still the right end-state):**

```
CatalogItem / Furniture
  → Block2D (prims mm)     // single truth for 2D symbol
  → Thumbnail: blockToSvg → DOM
  → Canvas: renderBlock2DToCanvas
  → (later) Fabric objects from same prims
  → (later optional) publish SVG from same or related descriptor
```

### 18.3 Long quotes (appendix-grade, for agent training)

#### Quote A — Authority (P05 execute)

```
Plan canvas → furnitureBlock2DFromItem → Block2D prims (top-left) → renderBlock2DCentered
  (AUTHORITY FOR W2 PLAN SYMBOLS TODAY)

Admin/CLI → compileSvgForPublish → public/svg-catalog/{slug}.svg
  (PUBLISH AUTHORITY — NOT Feasibility draw path today)

generateCabinetV0Footprint = mesh helper path string — NOT canvas Block2D.
```

#### Quote B — Empty-box baseline (appendix)

```
- cabinet-v0 modular symbol today: **2 prims** (rect + dashed center line) — not product-readable yet
- furnitureBlockUsesCenteredPath: returns true but modular prims are top-left; unused — fix in Task 2
- SVG catalog path: compileSvgForPublish → public/svg-catalog (not canvas authority)
```

*(Baseline historical; live modular now multi-prim and centeredPath false.)*

#### Quote C — doorStyle must differ (suggestions S2)

```
- pair: vertical stile at mid-X + two handles
- slab: no mid stile; single handle only (offset to one side)
- none: shelf lines only
```

#### Quote D — Canvas expert false-reverse

```
| “SVG catalog proves plan symbols” | Publish ≠ canvas; W2 fails honesty |
| “Centered modular prims” | Live prims top-left; only renderBlock2DCentered centers |
| “Enable flag for W3 proof” | Dual pointer; selection/draw split; false green |
```

#### Quote E — Inventory Wrong #1 (oando-render-options)

```
| Inventory tile | On canvas |
| Rich blockToSvg multi-prim symbol | Flat box Path2D (or cabinet outline) |

Symptom: “SVG doesn’t render on canvas” — correct: SVG never goes to canvas.
```

*(Historical diagnosis; live Feasibility now uses Block2D — keep quote to prevent regression of Path2D-only thinking.)*

#### Quote F — Ethics short answer

```
Study their product behavior … and rebuild in your UI/code → Fine
Copy minified JS, catalog meshes, icons, brand, or pixel-match UI → Not fine
```

#### Quote G — SYNTHESIS catalog pattern

```
| Catalog is the product | Real O&O SKUs + Block2D symbols + modular mesh quality bar |
| BOQ/quote | Keep as differentiator — do not chase photoreal first |
```

#### Quote H — MASTER-CHART 2D symbols decision

```
| 2D symbols | Block2D now → SVG publish as authority later | Inventory fidelity > pretty random meshes |
```

#### Quote I — P07 place vs quality

```
non-blank canvas PNG ≠ P05 symbol quality
```

#### Quote J — asset-engine honesty

```
W2 acceptance is Block2D readable, not “SVG loaded onto FeasibilityCanvas.”
Do not mark S7 implemented until inventory place consumes published SVG with evidence.
furnitureBlockUsesCenteredPath is always false (prims top-left; canvas centers).
```

#### Quote K — oando-self mesh_symbol

```
Admin SVG catalog ≠ plan-symbol authority.
… Not manufacturer-catalog readable symbols at world bar.
```

#### Quote L — RoomSketcher → W2 translation

```
W2 Place ≥2 catalog items incl. cabinet-v0; readable 2D
→ Inventory place … Block2D symbols must read as product, not empty blob.
```

#### Quote M — Footprint is centered box (live helper)

```
/** Top-down SVG path (plan mm, centered). */
generateCabinetV0Footprint → M -halfW -halfD L halfW -halfD L halfW halfD L -halfW halfD Z
```

This is the **empty rectangle** path that must never be rebranded as the plan symbol.

#### Quote N — EXPERT-PASS P0 #9

```
P05 symbols: Block2D = canvas authority; furnitureBlockUsesCenteredPath always false;
keep canvas-fabric-stage/ (destination, not delete).
```

---

## 19. Approaches to future SVG↔canvas convergence (without lying)

When (and only when) product wants one artifact:

| Strategy | Description | Risk |
|----------|-------------|------|
| **Prim-source of truth** | Descriptor → Block2D → (canvas paint \| blockToSvg \| Fabric) | Best honesty |
| **SVG compile from prims** | Same Block2D → SVG string for publish | Aligns portal with plan |
| **SVG load for place** | Fetch published SVG → parse to draw | Only if parse preserves doorStyle parametric; heavy |
| **Hybrid** | Hero modular parametric Block2D; static SKUs published SVG | Document which SKU class uses which |

**Recommendation:** stay prim-source-of-truth; make publish a **projection** of Block2D/descriptor, not a second hand-drawn universe.

---

## 20. Plan critique — kill theater / paper PASS risks

| Theater | Reality check |
|---------|---------------|
| “We have svg-catalog files” | Publish ≠ place |
| “Vitest 17/17” without NOTES | Honesty half missing |
| “PNG non-blank” | Could be empty box |
| “Flag-ON looks like furniture” | Rect overlay |
| “CenteredPath true means quality” | Historical lie |
| “Smoke batch green = W2” | Gate split violation |
| “Research complete = product readable” | Research is ideas only |
| “CP-05 PASS forever” | Re-prove if evidence tree missing |

---

## 21. Recommended agent execute order (if re-running P05)

1. Prove live greps: modularCabinetBlock multi-prim; centeredPath false; Feasibility uses renderBlock2DCentered.  
2. Run cabinet-v0 + renderBlock2D unit suites → raw logs under `05-symbols-svg/`.  
3. Dump slab vs pair prim JSON to `05-visual/`.  
4. Run svg smoke batch; write honesty NOTES with real exit codes.  
5. Confirm asset-engine README canvas vs publish section present.  
6. Write CP-05.json with honest claim booleans; **do not** claim P07.  
7. Stop. Do not open Fabric cutover or mesh thrash.

---

## 22. Handoff messages to other Idiots agents

| Agent | Message |
|-------|---------|
| P03 select-delete | Hit-test uses furniture bounds; symbols denser ≠ different pick API |
| P04 orbit | 2D symbols unrelated to orbit; continuity is document UUIDs |
| P06 save | Save serializes modularOptions doorStyle — symbols must rehydrate same prims |
| **P07 place** | You prove place; we prove readable; non-blank ≠ quality |
| P08 mesh | doorStyle meaning shared; mesh multi-part ≠ plan prims |
| P09 shortcuts | Placement shortcuts don’t change symbol authority |
| P10 evidence | CP-05 folder name fixed; re-index honesty NOTES |

---

## 23. Decision record (brainstormer)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Plan symbol authority | **Block2D prims** | Live, testable, parametric, ethical |
| Publish SVG authority | **compileSvgForPublish** | Separate track; honesty required |
| Empty-box response | Multi-prim modular cabinet + contrast rule | Buyer recognition |
| doorStyle | Geometry must diverge | Config trust |
| centeredPath API | Always false + docs | Kill the lie |
| Fabric for W2 | Flag OFF | Expert pass |
| Competitor assets | Never | Ethics |
| Place browser | P07 | Kill-order |
| Convergence later | Prim-source-of-truth | Avoid dual art |

---

## 24. Final verdict

### Ship stance for P05 domain

**YES — Approach A (Block2D plan authority + honest SVG publish story)** is correct, live-aligned, and expert-backed.

### Raised bar (brainstormer addition)

1. Treat **buyer recognition Q&A** as the real acceptance, not only prim count.  
2. Keep **three SVG-related paths** in every agent brief so Path2D-only / portal-proves-place / centeredPath lies cannot resurrect.  
3. **P07 + P05** together define W2; neither alone.  
4. Fabric destination must **rebind Block2D** or re-gate W2.  
5. Future SVG convergence must be a **projection of prims**, not a second catalog of competitor-shaped paths.

### What this report is not

- Not an unlock to re-scrape competitors  
- Not product code  
- Not a claim that results evidence is present without re-proof  
- Not a Fabric cutover plan  
- Not a mesh beauty plan  

### Done criteria for this brainstormer deliverable

- [x] Phase pack read (execute, appendix, suggestions, 02-canvas-2d)  
- [x] EXPERT-PASS + RESEARCH-MAP + SYNTHESIS + comparison inventory/self  
- [x] oando-render-options full process reports  
- [x] Ethics + websites pack inventory + deep reports (honest depth)  
- [x] Exhaustive: Block2D vs svg-catalog, empty-box, doorStyle, centeredPath, admin SVG, competitive patterns, buyer readable, plan critique, raised bar, approaches, ethics, P07 linkage, appendices path index + long quotes  
- [x] No TBD placeholders  
- [x] Written only under `Idiots\P05-symbols-svg\REPORT.md`  

---

## Appendix A — File path index (absolute)

### Phase

- `D:\OandO07072026\Plans\phases\P05-symbols-svg\P05-symbols-svg.md`
- `D:\OandO07072026\Plans\phases\P05-symbols-svg\P05-appendix.md`
- `D:\OandO07072026\Plans\phases\P05-symbols-svg\P05-suggestions.md`
- `D:\OandO07072026\Plans\phases\P05-symbols-svg\02-canvas-2d.md`
- `D:\OandO07072026\Plans\phases\P05-symbols-svg\README.md`
- `D:\OandO07072026\Plans\phases\EXPERT-PASS.md`
- `D:\OandO07072026\Plans\phases\P07-draw-place-journey\P07-draw-place-journey.md`

### Research (repo)

- `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md`
- `D:\OandO07072026\Plans\Research\RESULTS-MAP.md`

### Research (D:\websites)

- `D:\websites\README.md`
- `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\03-inventory\REPORT.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md`
- `D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md`
- `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md`
- `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md`
- `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md`
- `D:\websites\roomsketcher.com\report\INSPIRATION.md`
- `D:\websites\floorplanner.com\report\INSPIRATION.md`
- `D:\websites\homestyler.com\report\INSPIRATION.md`
- `D:\websites\ikea.com\planner-public\report\INSPIRATION.md`

### Live code

- `D:\OandO07072026\site\features\planner\open3d\catalog\furnitureBlock2D.ts`
- `D:\OandO07072026\site\lib\catalog\renderBlock2DToCanvas.ts`
- `D:\OandO07072026\site\lib\catalog\blocks2d.ts`
- `D:\OandO07072026\site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx`
- `D:\OandO07072026\site\features\planner\open3d\catalog\parametricBuilder.ts`
- `D:\OandO07072026\site\features\planner\open3d\catalog\modularCabinetV0.ts`
- `D:\OandO07072026\site\features\planner\asset-engine\README.md`
- `D:\OandO07072026\site\features\planner\asset-engine\svg\compileSvgForPublish.ts`
- `D:\OandO07072026\site\features\planner\asset-engine\stages.ts`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\catalog\furnitureBlock2D.cabinet-v0.test.ts`

### Evidence (canonical; re-prove if missing)

- `D:\OandO07072026\results\planner\world-standard-wave\05-symbols-svg\`

### This deliverable

- `D:\OandO07072026\Idiots\P05-symbols-svg\REPORT.md`

---

## Appendix B — Glossary

| Term | Meaning |
|------|---------|
| **Block2D** | `{ footprint: {L,D,H}, prims[], label? }` in mm |
| **Prim** | rect \| line \| circle \| arc \| path with stroke/fill |
| **Empty box** | Symbol that fails product recognition (historically 2-prim cabinet) |
| **doorStyle** | none \| slab \| pair modular door configuration |
| **centeredPath lie** | Claiming modular Block2D prims centered when they were top-left |
| **Publish SVG** | Disk/portal catalog via compile pipeline |
| **W2 symbol half** | Readable plan symbols (P05) |
| **W2 place half** | Browser place ≥2 (P07) |
| **S7** | Future: place consumes published SVG with evidence |
| **Approach A** | Feasibility interim + Fabric destination; Block2D symbols now |

---

## Appendix C — CP-05 hard stop reprint (authoritative)

| Check | Pass condition |
|-------|----------------|
| Unit | cabinet-v0 test green + log + run.json |
| Non-empty | Modular + box fallback have prims |
| Door style | pair mid stile; slab none |
| CenteredPath | helper false for modular |
| Honesty | NOTES: Block2D canvas; SVG publish |
| SVG smoke | Optional for symbol half; required if claiming smoke |
| Ethics | No competitor SVG |
| Visual | PNG or prim JSON + NOTES |
| Scope | No mesh redesign, Fabric cutover, SVGR |

If required row fails: stop; log Failures.md; do not mark W2 symbol half green.

---

## Appendix D — Commands cheat sheet

```powershell
cd D:\OandO07072026\site

# Symbol units
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose

# SVG honesty
pnpm run scripts:smoke:svg:batch

# Manual visual
pnpm dev
# open /planner/open3d → place cabinet-v0 → inspect 2D with Fabric flag OFF
```

---

**End of report.** Brainstormer 05/10. No product code modified. Write scope limited to `Idiots\P05-symbols-svg\REPORT.md`.
