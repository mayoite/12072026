# P05 — Symbols / SVG Honesty (W2 symbol half · CP-05) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Re-prove (and only then restore/extend) open3d plan-view furniture symbols so **cabinet-v0 is manufacturer-readable** on FeasibilityCanvas via original **Block2D prims**, and permanently document that **Block2D = canvas authority today · admin/CLI SVG = publish only** — without competitor assets, Fabric flag-ON theater, or claiming portal `/svg-catalog` proves plan symbols.

**Architecture:** FeasibilityCanvas (Fabric furniture flag **OFF**) draws placed furniture with `furnitureBlock2DFromItem` → top-left prims in mm → `renderBlock2DCentered`. Modular cabinet-v0 is multi-prim (outer carcass, inner outline, front/back edges, doorStyle cues). Inventory thumbnails may share the same prim vocabulary via `blockToSvg` (DOM only). Publish path is `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` and is **not** the Feasibility draw path. `generateCabinetV0Footprint` is a **centered mesh/helper path string** — never rebranded as plan symbol. Fabric furniture layer (default OFF) is destination spike — plain Rects are **not** W2.

**Tech Stack:** TypeScript · Vitest · Canvas 2D · Block2D (`blocks2d` prim vocabulary) · modular-cabinet-v0 · asset-engine SVG pipeline (`compileSvgForPublish` / smoke fixtures) · optional Playwright · evidence under repo-root `results/planner/world-standard-wave/05-symbols-svg/`.

**Inputs consumed:**
- Repo read: 2026-07-10 — workspace `D:\OandO07072026` — key paths in §1 Repo reality
- HEAD: treat as **dirty / unproven evidence** (`results/` **absent** at root → historical CP-05 PASS is **paper until re-proved**)
- Brainstormer: **`Idiots/P05-symbols-svg/REPORT.md` only** (idiotplanners2 wave — **never** `Idiots2/`)
- Phase plan: `Plans/phases/P05-symbols-svg/` (execute card + appendix + suggestions + `02-canvas-2d.md`)
- Research index: `Plans/Research/RESULTS-MAP.md` · `Plans/Research/RESEARCH-MAP.md` · `Plans/INDEX.md`
- Design gate: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` **W2**

**Done when:**
1. Vitest green for cabinet-v0 Block2D suite + `renderBlock2DToCanvas` suite (unfiltered logs under evidence root).
2. cabinet-v0 is **not** empty-box: ≥4 prims; front ≠ back; doorStyle `pair` ≠ `slab` ≠ `none`; light surface fill (not inverse-body blob).
3. Buyer-recognition bar (Idiots raised bar): a new user can answer “cabinet?”, “which way is front?”, “slab vs pair?” from geometry — not status bar alone.
4. `furnitureBlockUsesCenteredPath` always `false`.
5. Unknown SKU never yields empty prims.
6. Honesty NOTES + asset-engine README refuse the eight false SVG/canvas claims.
7. Visual: prim-JSON (pair/slab/none) and/or Playwright PNG prove multi-prim readability (unit count alone insufficient).
8. CP-05.json + SUMMARY.md with split `symbolQuality` vs `svgHonestySmoke`; `browserPlaceJourney: deferred-to-P07`.
9. No competitor SVG/JS/GLB; no Fabric flag-ON as W2 proof; no Feasibility load of `/svg-catalog/*.svg`.

**Evidence folder:** `results/planner/world-standard-wave/05-symbols-svg/`  
(create on execute; **re-prove if missing** — it is missing at plan write)

**Canonical save path for this plan:** `plans2/P05-symbols-svg/IMPLEMENTATION-PLAN.md`

---

## 1. Repo reality (live 2026-07-10)

### 1.1 Product code already raised (do not thrash)

Live `site/features/planner/open3d/catalog/furnitureBlock2D.ts` is **already past** the historical 2-prim empty-box bar documented in stale expert prose:

| Fact | Live truth |
|------|------------|
| `modularCabinetBlock` | Multi-prim: outer carcass + inner rect + front line + back line + doorStyle branches (pair stile + dual handles / slab single offset handle / none open-shelf dashes) |
| Fill contrast | Outer uses `BLOCK_STYLE.surface` (light) + `glyphDark` detail — **not** `BLOCK_STYLE.storage` inverse-body blob |
| Prim origin | Top-left `(0..L, 0..D)`; canvas centers via `renderBlock2DCentered` |
| `furnitureBlockUsesCenteredPath` | **Always returns `false`** with honest JSDoc |
| Unknown SKU path | `furnitureBlock2DFromItem` falls through bridge → generic → `boxBlock` (≥1 rect) |
| Feasibility wire | `FeasibilityCanvas.tsx` ~583–630: `layerVisibility.furniture` → `furnitureBlock2DFromItem` → `renderBlock2DCentered` with `createCanvasBlockColorResolver` |
| SVG honesty README | `site/features/planner/asset-engine/README.md` has **Canvas vs publish SVG (P05 honesty)** section |
| Publish path | `compileSvgForPublish` + admin `publishDescriptorWithPipeline`; public files under `site/public/svg-catalog/` (`chaise-lounge-001`, `sectional-sofa-001`, `side-table-001`, `missing-geom-fallback-001`) — **no cabinet-v0 SVG as plan authority** |
| Mesh helper | `generateCabinetV0Footprint` in `modularCabinetV0.ts` = centered `M -halfW -halfD … Z` — **not** Feasibility Block2D |
| Stroke floor | `resolveCanvasStrokeWidthMm` floors thin mm strokes under plan zoom (~0.1) |

### 1.2 Tests already present (strong unit bar)

| File | Live cases |
|------|------------|
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | **13** cases: footprint, modularOptions prefer, ≥4 prims, outer carcass, light fill lock, bounds, front>back, pair stile vs slab, handle counts, doorStyle none shelves, centeredPath false, canvas fill+stroke, no external URL |
| `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` | stroke floor helper; rect paint; centered translate; demo-desk; modular basic; contrast; unknown SKU nonempty + canvas fill; equipment unknown; degenerate dims clamp |
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.workstation-v0.test.ts` | multi-rect systems (desk/pedestal/panel) — adjacent, not CP-05 hero |
| E2E (related, not CP-05 alone) | `site/tests/e2e/open3d-mesh-symbol-live-verify.spec.ts` places cabinet-v0 + zoom — evidence path often under `results/planner/benchmark-quality/mesh-symbol/` (**not** substitute for `05-symbols-svg/`) |

### 1.3 Contradictions (plan claims vs code vs evidence)

| Source claim | Live repo | Verdict for this plan |
|--------------|-----------|------------------------|
| Phase card: CP-05 **PASS** 2026-07-09 | `results/` **missing** at repo root | **Unproven** — re-prove; do not paper-green |
| `02-canvas-2d.md` / appendix baseline: modular ≈ **2 prims** | Live modular is multi-prim ≥4 | **Stale expert prose** — code wins |
| Phase card: create cabinet-v0 test file | File **exists** and is richer than appendix skeleton | Prefer live tests; only add if gap |
| Phase card: fix centeredPath true→false | Already `false` | Verify + keep regression lock |
| Expert S2: slab must not share pair stile | Live slab has **no** mid stile; single offset handle | Satisfied in code + tests |
| Appendix Task 2 skeleton uses `BLOCK_STYLE.storage` fill | Live uses **surface** (contrast root-cause fix) | **Do not** re-apply storage fill — would re-blob |
| Historical “SVG catalog proves plan symbols” | Feasibility never loads `/svg-catalog` for furniture draw | Honesty still required in NOTES every CP |
| Idiots §3.1 historical empty-box | Live multi-prim | Idiots report already notes raised code; plan re-proves |

### 1.4 Missing evidence (hard)

```
D:\OandO07072026\results   → does not exist at plan write
```

Per `AGENTS.md` + `Plans/Research/RESULTS-MAP.md` + Idiots REPORT §16–§17 / §20:

**Any PASS claim without live artifacts under root `results/` is invalid for this checkout.**

Execute must create `results/planner/world-standard-wave/05-symbols-svg/` and fill slices.

### 1.5 Authority graph (repo-verified)

```
Path B (AUTHORITY FOR W2 PLAN SYMBOLS TODAY)
  Open3dFurnitureItem
    → furnitureBlock2DFromItem(item)
         ├── geometryMode === "modular-cabinet-v0" → modularCabinetBlock
         ├── workstation config key → workstationBlock2DFromItem
         ├── resolveCatalogItemBlock2D (buddy bridge) → scale if needed
         ├── buildGenericBlock2D
         └── boxBlock fallback
    → FeasibilityCanvas: translate(center) · rotate · scale(transform.scale)
    → renderBlock2DCentered(ctx, block, { resolve: createCanvasBlockColorResolver })

Path A (inventory preview only — not W2 authority)
  CatalogItem → resolveCatalogItemBlock2D → blockToSvg → sanitize → DOM

Path C (publish only — not Feasibility draw)
  Descriptor → compileSvgForPublish → public/svg-catalog/{slug}.svg → /portal/svg-catalog

NOT authority
  generateCabinetV0Footprint  → centered SVG path string for mesh/helper
  FurnitureFabricLayer Rects → flag ON only; plain Rect ≠ Block2D
  Competitor CDN SVG / sprites
```

This matches Idiots REPORT §2 “three SVG-related paths” (A inventory DOM · B plan canvas Block2D · C publish disk). Confusing them is the root bug class of P05.

### 1.6 Related types (live)

```typescript
// site/features/planner/open3d/model/types.ts
export type Open3dFurnitureGeometryMode =
  | "box"
  | "modular-cabinet-v0"
  | "workstation-v0";

export interface Open3dModularCabinetV0Options {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  doorStyle: "none" | "slab" | "pair";
  material: "oak" | "white";
}

export interface Open3dFurnitureItem {
  // ...
  geometryMode?: Open3dFurnitureGeometryMode;
  modularOptions?: Open3dModularCabinetV0Options;
  // position = plan center mm; rotation degrees
}
```

```typescript
// site/lib/catalog/blocks2d.ts (prim authorship)
export interface Block2D {
  footprint: Dim; // L, D, H mm
  prims: Prim[];  // top-left origin
  label: string;
}
// Prim kinds: rect | line | circle | arc | path
// BLOCK_STYLE.surface = "var(--block-surface)"  // light carcass for cabinet plan
// BLOCK_STYLE.glyphDark = "var(--block-glyph-dark)" // detail
```

### 1.7 Fabric flag (must stay OFF for proof)

- `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"` only enables flag (`fabricFurnitureFlag.ts`).
- ON: OOPlannerWorkspace forces furniture layer off on Feasibility and mounts `FurnitureFabricLayer` (plain Rects).
- **W2 symbol proof = flag OFF.** Screenshots with flag ON are false-green for symbol quality.
- Keep `canvas-fabric-stage/` — destination after W; do not delete (P02 / ENGINE-DECISION).

### 1.8 Stroke floor (already shipped)

`resolveCanvasStrokeWidthMm` floors thin mm strokes under plan zoom so multi-prim detail stays visible:

```typescript
// typical Feasibility scale ~0.1 → 1.5mm stroke needs ≥12.5 user units for 1.25px
export function resolveCanvasStrokeWidthMm(
  strokeWidthMm: number,
  contextScale: number,
  minScreenPx = 1.25,
): number {
  const s = Math.abs(contextScale) || 1;
  const mm = Number.isFinite(strokeWidthMm) && strokeWidthMm > 0 ? strokeWidthMm : 1;
  return Math.max(mm, minScreenPx / s);
}
```

Covered in unit tests. Do not remove.

### 1.9 Public svg-catalog inventory (publish track only)

| File under `site/public/svg-catalog/` | Role |
|--------------------------------------|------|
| `chaise-lounge-001.svg` | Published fixture |
| `sectional-sofa-001.svg` | Published fixture |
| `side-table-001.svg` | Published fixture |
| `missing-geom-fallback-001.svg` | Fallback fixture |

**None of these are Feasibility furniture draw sources.** Portal `/portal/svg-catalog` is public preview of published files.

### 1.10 Feasibility draw loop (semantic, live)

When `layerVisibility.furniture`:

1. Project document position → screen center (`projectToScreen`).
2. `block = furnitureBlock2DFromItem(item)`.
3. `translate(center)` → `rotate(degrees→rad)` → `scale(transform.scale)`.
4. Optional `item.color` underlay at 0.15 alpha over footprint half-extents.
5. `renderBlock2DCentered` → `translate(-L/2, -D/2)` then paint top-left prims.
6. If selected: dashed primary rect padded outside footprint.

Source comment: procedural Block2D, same family as inventory, no external GLB/SVG downloads.

### 1.11 Resolution order inside `furnitureBlock2DFromItem`

1. `geometryMode === "modular-cabinet-v0"` → `modularCabinetBlock`
2. Workstation config key parse → `workstationBlock2DFromItem`
3. Catalog bridge via `open3dLikeBuddyCatalogItem` + `resolveCatalogItemBlock2D` (rescale if needed)
4. `buildGenericBlock2D`
5. `boxBlock` last resort

Why correct for O&O: modular config-aware first; systems assembly next; generic catalog richness; unknown never zero prims.

---

## 2. Brainstormer synthesis (`Idiots/P05-symbols-svg/REPORT.md`)

> **Input rule:** This plan consumes **Idiots** wave-1 report only. Do **not** open or cite `Idiots2/P05-symbols-svg/REPORT.md` as authority for this file.

### 2.1 Single most important fact (Idiots §0)

P05 is **not** “make pretty SVG icons” and **not** “wire public/svg-catalog into FeasibilityCanvas.” It is two coupled honesty problems:

1. Plan-view furniture symbols must be **readable** for hero modular SKU `cabinet-v0` (stop empty-box bar).
2. The SVG story must **not lie:** Block2D prims own the live plan canvas today; admin/CLI `compileSvgForPublish` owns publish files — **not the same authority**.

### 2.2 North star (Idiots one-sentence)

> A buyer looking at plan view must **recognize a cabinet** (front, carcass, door style), not a gray rectangle — and the team must never claim “SVG catalog proves plan symbols” when canvas draws procedural Block2D.

### 2.3 Buyer / JTBD (acceptance language — Idiots §8)

Dealer/designer must answer on plan in **&lt; 2 seconds**:

1. What object? (cabinet vs desk vs chair-class)
2. Which way is front?
3. How big relative to room (true mm silhouette)?
4. Does doorStyle change the mark?
5. Does inventory tile identity match plan mark idea?
6. Is it selected? (halo distinct from symbol stroke)

Semi-transparent empty rectangle = **W2 fail** even if place/select/save work.

**Readable is NOT:** pixel-identical Homestyler, photoreal textures, full CAD at all zooms, SVG file on disk, unit green alone, non-blank PNG alone.

### 2.4 Empty-box definition (Idiots §3.5) — DEAD when all hold

1. Outer silhouette + at least one **interior structure** cue (not only a fill).
2. **Front ≠ back** (asymmetric depth cues).
3. **Config variants change geometry** (doorStyle).
4. At working plan zoom, a new user can answer: “cabinet, doors, which way is front?”
5. No competitor art required to achieve (1)–(4).

### 2.5 doorStyle geometry contract (Idiots §4 + suggestions S2)

| doorStyle | Geometry must show |
|-----------|-------------------|
| **pair** | Mid vertical stile at `w/2` + **two** handles |
| **slab** | **Zero** mid vertical stile; **one** handle offset |
| **none** | Shelf lines only; no door handles / no stile |

Early skeleton risk: drawing mid stile on slab = theater. Live code + tests already enforce pair ≠ slab.

### 2.6 Raised bar (Idiots §10 — stronger than process PASS)

| Bar item | Why stronger than “unit count ≥4” |
|----------|-----------------------------------|
| Light fill + dark detail | Opaque storage fill makes multi-prim unreadable (blob) |
| Front line deeper (+Y) than back | Orientation for wall docking |
| pair mid stile; slab **zero** mid stile | doorStyle must **actually** differ |
| pair dual handles; slab single offset | Geometry not theater |
| none = shelf dashes, zero handles | Third distinct language |
| Buyer Q&A checklist | Unit alone can green weak geometry |
| Prim-JSON or PNG visual | Buyer never runs vitest |
| Honesty NOTES refuse false claims | Prevents SVG/portal false marketing |
| Fabric flag OFF | Rect overlay is not Block2D proof |
| Evidence on disk | Markdown PASS without `results/` is paper |
| P07 + P05 together = full W2 | Neither alone |

### 2.7 Approaches (Idiots §11) — choice

| ID | Approach | Decision |
|----|----------|----------|
| **A** | Procedural Block2D prim → Canvas (`renderBlock2DToCanvas`) | **CHOSEN** (live + ENGINE-DECISION + Idiots recommendation) |
| B | Rasterize published SVG → `drawImage` | Defer; only after S7 product decision + parametric recompile story |
| C | Fabric objects from same prims | Post-W destination; flag-ON today is Rect regression; must **rebind Block2D** |

**Recommendation (Idiots):** Ship and hold Approach A. Use C as destination mapping of A, not a replacement geometry language. Park B until publish and place intentionally share one compiled artifact.

### 2.8 Failure modes → plan controls (Idiots §3.4, §16, §20)

| Failure | Plan control |
|---------|--------------|
| Unit green, browser still boxes | Visual prim-JSON + optional Playwright; P07 owns place journey half |
| SVG smoke green claimed as W2 | Gate split in CP-05.json |
| Weak ≥4 garbage lines | Stile/handle/front-back/fill contrast tests |
| Competitor path paste | Ethics + string/URL assertions + review |
| CSS vars invisible on canvas | `createCanvasBlockColorResolver` + resolve mocks in unit |
| Inventory rich / canvas poor | Single Block2D truth discipline (historical Wrong #1) |
| Paper PASS | Mandatory evidence tree recreate |
| Flag-ON screenshots | Policy + NOTES forbid |
| Re-apply storage fill “from appendix” | Repo wins — surface fill locked by tests |
| Confuse `generateCabinetV0Footprint` with Block2D | Explicit out-of-scope; mesh helper only |
| Non-blank PNG as quality | Idiots/P07 anti-false-green |
| “CP-05 PASS forever” | Re-prove if evidence tree missing |

### 2.9 Open questions (do **not** expand P05)

1. When (if ever) published svg-catalog becomes place authority → **goal change** (S7)
2. Every SKU authored Block2D vs family generators → post-W roadmap
3. Print PDF min-stroke policy → later
4. Wall-mounted symbol language → later
5. Multi-select compound symbols → later
6. BOQ PDF legend icons from Block2D → later
7. Rename/delete forever-false `furnitureBlockUsesCenteredPath` → future naming debt only

### 2.10 Conflict rule applied

| Topic | Winner |
|-------|--------|
| What code does today | **Repo** |
| Prim count baseline “2” in old expert docs | **Repo** (already multi-prim) |
| Intent/bar/failure modes/honesty/buyer Q&A | **Idiots REPORT** (when repo silent on bar) |
| Competitor copy | **Forbidden** (ethics packs + phase + Idiots §12) |

### 2.11 P07 linkage (Idiots §13)

| Concern | Phase | Pass means |
|---------|-------|------------|
| Symbol geometry quality | **P05** | Unit + prim visual + honesty |
| Unaided place ≥2 incl. cabinet-v0 | **P07** | Playwright serial journey + PNGs |
| Select/delete | **P03** | Browser + unit |
| Mesh parts | **P08** | Visual + mesh tests |

P07 anti-false-green: **non-blank canvas PNG ≠ P05 symbol quality**. Full product W2 story needs P05 + P07 (and place needs select etc.).

### 2.12 SVG honesty NOTES must contain (Idiots §6.5)

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

### 2.13 Competitive patterns (inspiration only — Idiots §7)

| Job | O&O translation |
|-----|-----------------|
| Catalog item looks like the product in plan | Multi-prim Block2D + modular mesh (P05 + P08) |
| Fixed-size branded items don’t stretch | SKU mm lock |
| Place friction low | P07 place journey; P05 ensures **what appears** after place |
| Structure first, then furnish | W1 then W2 |

**Steal pattern, not pixels.** No competitor SVG/path paste. P5D catalog quality is a **bar idea** only.

### 2.14 Decision record (Idiots §23)

| Decision | Choice |
|----------|--------|
| Plan symbol authority | Block2D prims |
| Publish SVG authority | compileSvgForPublish |
| Empty-box response | Multi-prim modular + contrast rule |
| doorStyle | Geometry must diverge |
| centeredPath API | Always false + docs |
| Fabric for W2 | Flag OFF |
| Competitor assets | Never |
| Place browser | P07 |
| Convergence later | Prim-source-of-truth |

---

## 3. Ethics / non-copy

**Allowed:** study industry **behavior** (catalog → place → readable plan mark); invent original O&O prim geometry; use packages already in tree; Phosphor for **UI chrome** only; treat P5D catalog quality as bar idea.

**Forbidden:** competitor minified JS, GLBs, textures, sprite sheets, pixel-cloned chrome, hand-pasted competitor path `d=` into `modularCabinetBlock`, authenticated editor inventory scrape, research files as product assets.

**Phase line:** Original O&O prims only. MIT packages already in tree only. Unit test forbids external URL / `.glb` / `.svg` / `svg-catalog` in plan-symbol generation payload.

Research under `D:\websites` = **ideas only** — never paste into `site/`.

### PR review checklist (Idiots §12.4)

1. Prim points hand-authored or derived from **our** modular dims?  
2. Any URL to competitor CDN?  
3. Any new asset binary without license row?  
4. Does README claim “SVG catalog is plan symbols”? If yes, fix honesty.  
5. Did Fabric flag get left ON in tests for “easier” green? Fail.

---

## 4. File map

### 4.1 Read-only (authority proof — touch only if broken)

| Path | Role |
|------|------|
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Path B wire (~583–630) |
| `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | Flag OFF default |
| `site/features/planner/open3d/canvas-fabric-stage/FurnitureFabricLayer.tsx` | Rect overlay — not W2 |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Flag wire |
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | `generateCabinetV0Footprint` mesh helper (not canvas) |
| `site/features/planner/open3d/catalog/parametricBuilder.ts` | `resolveFurniture2DFootprint` uses footprint helper |
| `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` | Publish entry |
| `site/features/planner/asset-engine/stages.ts` | S1–S7 stage map |
| `site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts` | Admin publish wire |
| `site/public/svg-catalog/*.svg` | Published assets only |
| `site/lib/catalog/blocks2d.ts` | `BLOCK_STYLE`, `Prim`, `blockToSvg`, generics |
| `site/app/(site)/portal/svg-catalog/` | Portal preview of published SVG |

### 4.2 Modify only if tests fail or honesty gap found

| Path | Expected change |
|------|-----------------|
| `site/features/planner/open3d/catalog/furnitureBlock2D.ts` | **Prefer no thrash** — restore only if RED |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Prefer no thrash; stroke floor already present |
| `site/features/planner/asset-engine/README.md` | Verify honesty section present; append only if missing |

### 4.3 Tests (run always; extend only for residual gaps)

| Path | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | **W2 unit home** |
| `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` | Paint + unknown SKU + contrast |
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.workstation-v0.test.ts` | Optional adjacent multi-prim systems check |

### 4.4 Evidence (create)

```
results/planner/world-standard-wave/05-symbols-svg/
  00-baseline/
  01-unit-reprove/
  02-green/              # or alias NOTES if unit already green
  03-nonempty/
  04-svg-honesty/
  05-visual/
  06-cp-pack/
  CP-05-vitest-raw.log
  CP-05.json
  SUMMARY.md
  NOTES.md               # optional root pointer
```

Canonical name from RESULTS-MAP: **`05-symbols-svg/`** only (never invent `05-symbols/` aliases without NOTES pointer).

### 4.5 Out of scope paths (do not edit for P05)

- Mesh beauty / toe / door 3D → P08  
- Browser place ≥2 journey → P07  
- Fabric full-stage cutover  
- SVGR / CDN SVG consume  
- Konva hybrid  
- Competitor scrapes  
- S7 inventory place from published SVG  

---

## 5. Architecture & data flow

### 5.1 Place → paint (happy path)

```
User places cabinet-v0 (geometryMode modular-cabinet-v0 + modularOptions)
  → document furniture entity on activeFloor.furniture[]
  → FeasibilityCanvas paint loop (layerVisibility.furniture === true)
  → projectToScreen(item.position)
  → furnitureBlock2DFromItem(item)
       modularCabinetBlock:
         footprint from modularOptions (prefer) else item dims
         prims top-left mm
  → ctx.translate(center); rotate; scale(transform.scale)
  → optional item.color wash under symbol
  → renderBlock2DCentered(ctx, block, { resolve: colorResolve, skipShadow if tiny scale })
  → selection dashed rect if selected
```

### 5.2 Coordinate contract

| Layer | Convention |
|-------|------------|
| Prim authorship | Top-left of footprint, mm, `x∈[0,L]`, `y∈[0,D]` |
| Furniture `position` | Plan **center** in document mm |
| `renderBlock2DCentered` | `translate(-L/2, -D/2)` then top-left paint |
| Front of cabinet | Larger Y (`frontY = d - inset`) |
| Back | Smaller Y (`inset`) |
| Plan scale | Often ~0.05–0.15 → stroke floor required |
| INITIAL_TRANSFORM (open3d) | `{ origin: (-4000,-2500), scale: 0.1 }` — do not thrash fitToView as W2 criterion |

### 5.3 Transform stack (Idiots §15)

```
document mm position (center)
  → projectToScreen
  → ctx.translate(screen)
  → ctx.rotate(rotation° → rad)
  → ctx.scale(viewScale)
  → renderBlock2DCentered: translate(-L/2, -D/2)
  → draw prims in mm
```

### 5.4 doorStyle geometry contract

| doorStyle | Required geometry |
|-----------|-------------------|
| `pair` | Mid vertical stile at `w*0.5` (x0≈x1≈mid); **two** small handle rects |
| `slab` | **Zero** mid vertical stile; **one** handle offset from mid-X |
| `none` | **Zero** mid stile; **zero** handles; ≥2 dashed horizontal shelf lines |

### 5.5 Contrast contract

| Element | Token family |
|---------|--------------|
| Outer carcass fill | `var(--block-surface)` / `BLOCK_STYLE.surface` |
| Outer stroke | `BLOCK_STYLE.surfaceStroke` |
| Detail lines / handles | `BLOCK_STYLE.glyphDark` |
| **Forbidden outer** | `block-storage`, `text-inverse-body` as solid carcass |

### 5.6 Publish path (honesty only)

```
Descriptor JSON
  → compileSvgForPublish (S1–S3, no I/O)
  → runSvgPipeline S4 write public/svg-catalog/{slug}.svg
  → portal /portal/svg-catalog
```

Smoke: `pnpm run scripts:smoke:svg:batch` from `site/` — **honesty evidence**, not automatic W2 symbol fail if skipped **and** NOTES do not claim smoke green.

### 5.7 Units debt note (Idiots §15.3)

Some catalog fields historically named `*Mm` but held cm; bridge may multiply by 10. **Law for symbols:** after resolve, Block2D footprint must match **placed** width/depth mm within 1mm or rescale. Live modular path uses `modularOptions` mm directly — keep that.

---

## 6. Task list

> **Execution policy:** Repo code is largely green. Tasks **00–01** always run. Tasks **02–03** implement **only if RED**. Tasks **04–07** always produce honesty/visual/CP evidence. Prefer commit after each landable slice.  
> **Do not** rewrite `modularCabinetBlock` “from appendix storage fill” — that re-introduces the blob bug.  
> **Checkout:** `D:\OandO07072026` only · no worktrees.

---

### Task 00: Baseline inventory + evidence tree

**Files:**
- Create: `results/planner/world-standard-wave/05-symbols-svg/00-baseline/NOTES.md`
- Create: `results/planner/world-standard-wave/05-symbols-svg/00-baseline/run.json`
- Create: `results/planner/world-standard-wave/05-symbols-svg/00-baseline/rg-raw.log`
- Modify: none (product)

- [ ] **Step 1: Confirm checkout**

```powershell
cd D:\OandO07072026
pwd
# Expect: D:\OandO07072026
# Never use worktrees
```

Expected: path is main checkout only.

- [ ] **Step 2: Create evidence tree**

```powershell
cd D:\OandO07072026
$base = "results\planner\world-standard-wave\05-symbols-svg"
@(
  "00-baseline","01-unit-reprove","02-green","03-nonempty",
  "04-svg-honesty","05-visual","06-cp-pack"
) | ForEach-Object { New-Item -ItemType Directory -Force -Path (Join-Path $base $_) | Out-Null }
```

Expected: directories exist under repo-root `results/` (not `site/results/`).

- [ ] **Step 3: Authority greps → raw log**

```powershell
cd D:\OandO07072026\site
rg -n "furnitureBlock2DFromItem|modularCabinetBlock|furnitureBlockUsesCenteredPath|compileSvgForPublish|renderBlock2DCentered|svg-catalog|generateCabinetV0Footprint" `
  features/planner/open3d lib/catalog features/planner/asset-engine `
  2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\00-baseline\rg-raw.log
```

Expected (honesty checks on log content):

- `FeasibilityCanvas` imports/calls `furnitureBlock2DFromItem` + `renderBlock2DCentered`
- `furnitureBlockUsesCenteredPath` returns false in source
- `compileSvgForPublish` lives under asset-engine / admin publish — **not** Feasibility draw loop
- `generateCabinetV0Footprint` in modularCabinetV0 / parametricBuilder — **not** furnitureBlock2D canvas path
- No Feasibility assignment loading `/svg-catalog` as furniture draw

- [ ] **Step 4: Write baseline NOTES.md**

Write this content (fill ISO date + HEAD if available):

```markdown
# P05 baseline (re-prove checkout)

- Date: (ISO)
- Checkout: D:\OandO07072026
- results/ prior existence: MISSING at plan write; tree recreated
- Canvas draw path: FeasibilityCanvas → furnitureBlock2DFromItem → renderBlock2DCentered
- Live modularCabinetBlock: multi-prim (≥4) with doorStyle branches + light surface fill
- Historical expert “2 prims” prose: STALE vs live code
- furnitureBlockUsesCenteredPath: always false (top-left authorship)
- SVG catalog path: compileSvgForPublish → public/svg-catalog (not canvas authority)
- generateCabinetV0Footprint: centered path string helper — not Feasibility Block2D
- Fabric furniture flag: default OFF; W2 proof must keep OFF
- Three paths (Idiots): A inventory blockToSvg · B plan Block2D · C publish svg-catalog
- Ethics: no competitor SVG
- Baseline rg log: rg-raw.log
- Brainstormer input: Idiots/P05-symbols-svg/REPORT.md (idiotplanners2 wave)
```

- [ ] **Step 5: Write 00-baseline/run.json**

```json
{
  "phase": "P05-symbols-svg",
  "slice": "00-baseline",
  "command": "rg authority inventory",
  "exitCode": 0,
  "timestamp": "(ISO)",
  "head": "(git rev-parse HEAD or dirty)",
  "notes": "results tree recreated; historical CP-05 unproven until unit re-prove"
}
```

- [ ] **Step 6: Commit baseline**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/00-baseline
git commit -m "trustdata(P05): baseline NOTES for W2 symbols re-prove (results tree)"
```

---

### Task 01: Unit re-prove (expect PASS — fail-closed if not)

**Files:**
- Test (existing): `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`
- Test (existing): `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts`
- Create: `results/.../01-unit-reprove/vitest-raw.log`
- Create: `results/.../01-unit-reprove/run.json`

- [ ] **Step 1: Run both suites unfiltered**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\01-unit-reprove\vitest-raw.log
echo "EXIT=$LASTEXITCODE"
```

Expected if code matches plan-time read:

- Exit code **0**
- cabinet-v0 describe: all **13** tests PASS
- renderBlock2DToCanvas file: stroke + render + furnitureBlock2DFromItem cases PASS
- Log unfiltered (no pipe to `Select-Object -First` that hides failures)

- [ ] **Step 2: Write run.json with real exitCode**

```json
{
  "phase": "P05-symbols-svg",
  "slice": "01-unit-reprove",
  "command": "pnpm exec vitest run furnitureBlock2D.cabinet-v0.test.ts renderBlock2DToCanvas.test.ts --reporter=verbose",
  "exitCode": 0,
  "timestamp": "(ISO)",
  "expected": "PASS all unit symbol cases",
  "ifNonZero": "STOP — go Task 02/03 fix path; do not write CP-05 pass"
}
```

- [ ] **Step 3: Branch on result**

| Result | Next |
|--------|------|
| exit 0 | Copy log pointer to `02-green/`; continue Task 04 |
| exit ≠ 0 | **Stop** green path; execute Task 02 (RED analysis) → Task 03 (minimal fix) |

- [ ] **Step 4: Commit evidence only if exit 0**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/01-unit-reprove
git commit -m "trustdata(P05): unit re-prove logs for cabinet-v0 Block2D + render"
```

If exit 0, also:

```powershell
Copy-Item `
  results\planner\world-standard-wave\05-symbols-svg\01-unit-reprove\vitest-raw.log `
  results\planner\world-standard-wave\05-symbols-svg\02-green\vitest-raw.log
Set-Content -Encoding utf8 `
  results\planner\world-standard-wave\05-symbols-svg\02-green\NOTES.md `
  "Unit already green at re-prove; no product code change. See 01-unit-reprove."
```

---

### Task 02: RED analysis (only if Task 01 failed)

**Files:**
- Create: `results/.../01-unit-reprove/FAILURE-NOTES.md`
- Read: failing assertion messages in vitest-raw.log

- [ ] **Step 1: Classify failure**

| Class | Symptom | Owner fix |
|-------|---------|-----------|
| A Contrast | outer fill is storage / inverse-body | restore surface fill |
| B Empty-box | prims.length < 4 | restore multi-prim modularCabinetBlock |
| C doorStyle | pair/slab same stile | restore pair-only mid stile |
| D centeredPath | helper true | return false |
| E Bounds | runaway coords | clamp prims to footprint |
| F Unknown SKU | empty prims | restore boxBlock fallback |
| G Stroke floor | resolveCanvasStrokeWidthMm wrong | restore floor math |
| H Import/path | module not found | fix imports only |

- [ ] **Step 2: Write FAILURE-NOTES.md**

Include failing test names, expected vs actual, class letter, and **do not** mark CP-05 pass.

- [ ] **Step 3: Commit failure notes**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/01-unit-reprove/FAILURE-NOTES.md
git commit -m "trustdata(P05): unit re-prove RED notes (no paper green)"
```

---

### Task 03: GREEN restore (only if Task 01/02 RED) — TDD + full code of record

**Files:**
- Modify: `site/features/planner/open3d/catalog/furnitureBlock2D.ts` (if symbol geometry wrong)
- Modify: `site/lib/catalog/renderBlock2DToCanvas.ts` (if paint/stroke wrong)
- Test: existing suites above

> If Task 01 was already green, **skip Task 03 entirely**. Do not “improve” storage fill.

#### 3A — If cabinet-v0 geometry / centeredPath / contrast is wrong

- [ ] **Step 1: Confirm failing tests still RED**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose
```

Expected: FAIL with specific assertion (capture message).

- [ ] **Step 2: Minimal implementation — modularCabinetBlock of record**

Replace / restore `modularCabinetBlock` + `furnitureBlockUsesCenteredPath` in  
`site/features/planner/open3d/catalog/furnitureBlock2D.ts` to this **live-aligned** form (**surface** fill, not storage):

```typescript
/**
 * Readable plan-view cabinet-v0 symbol (W2 / P05 / MASTER-CHART mesh_symbol).
 * Top-left mm origin (0..L, 0..D): carcass, inner, front/back, doorStyle cues.
 * Canvas centers via renderBlock2DCentered — prims are never authored centered.
 *
 * Contrast rule (benchmark): light fill + dark stroke so multi-prim detail reads
 * at plan zoom. Opaque inverse-body carcass + same-family stroke = solid blob.
 */
function modularCabinetBlock(item: Open3dFurnitureItem): Block2D {
  const opts = item.modularOptions;
  const w = opts?.widthMm ?? item.width ?? DEFAULT_MM;
  const d = opts?.depthMm ?? item.depth ?? DEFAULT_MM;
  const h = opts?.heightMm ?? item.height ?? 900;
  const doorStyle = opts?.doorStyle ?? "slab";
  const inset = Math.min(16, Math.max(6, Math.min(w, d) * 0.04));
  const frontY = d - inset; // plan: +Y depth; front at larger Y
  // Light carcass + dark outline (not storage inverse-body fill).
  const fill = BLOCK_STYLE.surface;
  const stroke = BLOCK_STYLE.surfaceStroke;
  const detailStroke = BLOCK_STYLE.glyphDark;
  const strokeW = BLOCK_STYLE.surfaceStrokeWidth;

  const prims: Prim[] = [
    {
      kind: "rect",
      x: 0,
      y: 0,
      w,
      h: d,
      fill,
      stroke,
      strokeWidth: strokeW,
      radius: 4,
    },
    {
      kind: "rect",
      x: inset,
      y: inset,
      w: Math.max(1, w - inset * 2),
      h: Math.max(1, d - inset * 2),
      fill: "none",
      stroke: detailStroke,
      strokeWidth: 1.25,
      radius: 2,
    },
    {
      kind: "line",
      points: [inset, frontY, w - inset, frontY],
      stroke: detailStroke,
      strokeWidth: 2.5,
    },
    {
      kind: "line",
      points: [inset, inset, w - inset, inset],
      stroke: detailStroke,
      strokeWidth: 1.5,
    },
  ];

  if (doorStyle === "pair") {
    prims.push({
      kind: "line",
      points: [w * 0.5, inset, w * 0.5, frontY],
      stroke: detailStroke,
      strokeWidth: 1.5,
      dash: [6, 4],
    });
    const handleW = Math.min(28, w * 0.06);
    const handleH = Math.min(10, d * 0.06);
    const handleY = frontY - handleH - 4;
    prims.push({
      kind: "rect",
      x: w * 0.25 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: detailStroke,
      radius: 2,
    });
    prims.push({
      kind: "rect",
      x: w * 0.75 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: detailStroke,
      radius: 2,
    });
  } else if (doorStyle === "slab") {
    const handleW = Math.min(36, w * 0.08);
    const handleH = Math.min(12, d * 0.07);
    prims.push({
      kind: "rect",
      x: w - inset - handleW - 8,
      y: frontY - handleH - 4,
      w: handleW,
      h: handleH,
      fill: detailStroke,
      radius: 2,
    });
  } else {
    // doorStyle "none" — open shelves cue
    prims.push({
      kind: "line",
      points: [inset, d * 0.33, w - inset, d * 0.33],
      stroke: detailStroke,
      strokeWidth: 1.25,
      dash: [8, 4],
    });
    prims.push({
      kind: "line",
      points: [inset, d * 0.66, w - inset, d * 0.66],
      stroke: detailStroke,
      strokeWidth: 1.25,
      dash: [8, 4],
    });
  }

  return {
    footprint: { L: w, D: d, H: h },
    prims,
    label: item.catalogId || "cabinet-v0",
  };
}

/**
 * Historical name. All furnitureBlock2D prims are authored top-left (0..L, 0..D).
 * Canvas centers via renderBlock2DCentered — never via centered prim authorship.
 * Always false (was a dead lie when modular returned true with top-left prims).
 */
export function furnitureBlockUsesCenteredPath(_item: Open3dFurnitureItem): boolean {
  return false;
}
```

**Rules while editing:**

- Keep modular branch first in `furnitureBlock2DFromItem` when `geometryMode === "modular-cabinet-v0"`.
- Do not call `generateCabinetV0Footprint` for canvas prims.
- Do not fetch `/svg-catalog`.
- Do not import competitor assets.
- Do **not** use `BLOCK_STYLE.storage` as outer fill (appendix skeleton is stale).

- [ ] **Step 3: Re-run cabinet-v0 suite — expect PASS**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\02-green\vitest-cabinet-raw.log
```

Expected: all tests PASS; exit 0.

- [ ] **Step 4: Commit product fix**

```bash
git add site/features/planner/open3d/catalog/furnitureBlock2D.ts results/planner/world-standard-wave/05-symbols-svg/02-green
git commit -m "fix(open3d): restore readable cabinet-v0 Block2D plan symbol for W2 (P05)"
```

#### 3B — If unknown SKU / render path is wrong

- [ ] **Step 1: Ensure box fallback at end of `furnitureBlock2DFromItem`**

The of-record tail (already live) must remain:

```typescript
  const generic = buildGenericBlock2D("rect", widthMm, depthMm);
  if (generic?.prims.length) {
    return { ...generic, label, footprint: { L: widthMm, D: depthMm, H: heightMm } };
  }

  return boxBlock(widthMm, depthMm, heightMm, label);
```

With `boxBlock` always emitting ≥1 rect at `(0,0,w,d)`:

```typescript
function boxBlock(widthMm: number, depthMm: number, heightMm: number, label: string): Block2D {
  const w = Math.max(1, widthMm);
  const d = Math.max(1, depthMm);
  const prims: Prim[] = [
    {
      kind: "rect",
      x: 0,
      y: 0,
      w,
      h: d,
      fill: BLOCK_STYLE.surface,
      stroke: BLOCK_STYLE.surfaceStroke,
      strokeWidth: BLOCK_STYLE.surfaceStrokeWidth,
      radius: BLOCK_STYLE.cornerRadius,
    },
  ];
  return { footprint: { L: w, D: d, H: heightMm }, prims, label };
}
```

- [ ] **Step 2: Ensure stroke floor helper**

```typescript
export function resolveCanvasStrokeWidthMm(
  strokeWidthMm: number,
  contextScale: number,
  minScreenPx = 1.25,
): number {
  const s = Math.abs(contextScale) || 1;
  const mm = Number.isFinite(strokeWidthMm) && strokeWidthMm > 0 ? strokeWidthMm : 1;
  return Math.max(mm, minScreenPx / s);
}
```

- [ ] **Step 3: Ensure centered helper**

```typescript
export function renderBlock2DCentered(
  ctx: CanvasRenderingContext2D,
  block: Block2D,
  options: RenderBlock2DToCanvasOptions = {},
): void {
  ctx.save();
  ctx.translate(-block.footprint.L / 2, -block.footprint.D / 2);
  renderBlock2DToCanvas(ctx, block, options);
  ctx.restore();
}
```

- [ ] **Step 4: Re-run render suite**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\03-nonempty\vitest-raw.log
```

Expected: PASS including unknown SKU nonempty + fill.

- [ ] **Step 5: Commit**

```bash
git add site/lib/catalog/renderBlock2DToCanvas.ts site/features/planner/open3d/catalog/furnitureBlock2D.ts results/planner/world-standard-wave/05-symbols-svg/03-nonempty
git commit -m "fix(open3d): non-empty unknown SKU Block2D + canvas paint guard (P05)"
```

#### 3C — If unit tests themselves are missing (should not happen)

Recreate full cabinet-v0 test file from **Appendix A** (full of-record source). Do **not** use weaker phase-appendix skeleton without contrast/handle cases.

---

### Task 04: SVG honesty (publish ≠ canvas)

**Files:**
- Create: `results/.../04-svg-honesty/NOTES.md`
- Create: `results/.../04-svg-honesty/svg-batch-raw.log` (if smoke run)
- Create: `results/.../04-svg-honesty/run.json`
- Modify only if missing: `site/features/planner/asset-engine/README.md` honesty section

- [ ] **Step 1: Verify README honesty section exists**

Read `site/features/planner/asset-engine/README.md` for heading `## Canvas vs publish SVG (P05 honesty)`.

If **missing**, append:

```markdown
## Canvas vs publish SVG (P05 honesty)

| Surface | Authority today | Entry |
|---------|-----------------|-------|
| open3d plan furniture symbols | **Block2D prims** (top-left; canvas centers) | `furnitureBlock2DFromItem` → `renderBlock2DToCanvas` / `renderBlock2DCentered` |
| Admin/CLI published SVG files | **pipelineCore+normalize** | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` |
| Portal preview | Published SVG URL | `/portal/svg-catalog` |

W2 acceptance is **Block2D readable**, not “SVG loaded onto FeasibilityCanvas.”
Do not mark S7 implemented until inventory place consumes published SVG with evidence.
`furnitureBlockUsesCenteredPath` is always `false` (prims top-left; canvas centers).
```

If **present** (live at plan write: yes), do not rewrite for style thrash.

- [ ] **Step 2: Run SVG smoke batch (honesty optional for symbol half)**

```powershell
cd D:\OandO07072026\site
pnpm run scripts:smoke:svg:batch 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\04-svg-honesty\svg-batch-raw.log
echo "EXIT=$LASTEXITCODE"
```

| Exit | Honesty claim allowed |
|------|------------------------|
| 0 | NOTES may say smoke green |
| ≠0 | NOTES must say smoke failed/blocked; **do not** claim pipeline works; symbol half may still pass |

- [ ] **Step 3: Write honesty NOTES.md**

```markdown
# SVG path honesty (P05)

## What is true
1. Publish compile authority = compileSvgForPublish → pipelineCore+normalize
2. Admin publish wire = publishDescriptorWithPipeline → public/svg-catalog/{slug}.svg
3. CLI fixtures: pnpm run scripts:smoke:svg / scripts:smoke:svg:batch
4. V1 svgCompiler.server.ts = v1-reference-only (if still marked)
5. Open3d plan canvas does not draw from /svg-catalog/*.svg today (Block2D)
6. generateCabinetV0Footprint is mesh/helper — not canvas Block2D
7. Fabric flag-ON Rects are not W2 symbol proof
8. Inventory blockToSvg is DOM preview — not Feasibility authority
9. Three paths (Idiots): A inventory · B plan Block2D · C publish catalog

## What is not true
1. “SVG is the FeasibilityCanvas authority.”
2. “cabinet-v0 plan mark is published SVG.”
3. “Portal svg-catalog proves planner place symbols.”
4. “furnitureBlockUsesCenteredPath means modular prims are centered.” (always false)
5. “Unit green on Block2D = browser place journey done.” (P07)
6. “Readable 2D = good 3D mesh.” (P08)
7. “SVG smoke green = W2 symbol quality.”
8. “We use competitor SVG sprites / catalog.”

## Smoke result this run
- scripts:smoke:svg:batch exit: (code or skipped)
- Claim pipeline works: (yes only if exit 0)
```

- [ ] **Step 4: run.json**

```json
{
  "phase": "P05-symbols-svg",
  "slice": "04-svg-honesty",
  "command": "pnpm run scripts:smoke:svg:batch",
  "exitCode": "(real)",
  "symbolQualityDependsOnSmoke": false,
  "timestamp": "(ISO)"
}
```

- [ ] **Step 5: Commit**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty site/features/planner/asset-engine/README.md
git commit -m "trustdata(P05): SVG honesty NOTES (Block2D canvas ≠ publish catalog)"
```

---

### Task 05: Visual evidence (prim-JSON required; Playwright optional)

**Files:**
- Create: `results/.../05-visual/cabinet-v0-prims-pair.json`
- Create: `results/.../05-visual/cabinet-v0-prims-slab.json`
- Create: `results/.../05-visual/cabinet-v0-prims-none.json`
- Create: `results/.../05-visual/NOTES.md`
- Optional: Playwright PNG under same folder

- [ ] **Step 1: Dump pair/slab/none prim JSON**

```powershell
cd D:\OandO07072026\site
pnpm exec tsx -e "
import { writeFileSync, mkdirSync } from 'node:fs';
import { furnitureBlock2DFromItem } from './features/planner/open3d/catalog/furnitureBlock2D.ts';

const base = {
  id: 'vis',
  catalogId: 'cabinet-v0',
  position: { x: 0, y: 0 },
  rotation: 0,
  scale: { x: 1, y: 1, z: 1 },
  width: 800, depth: 400, height: 900,
  geometryMode: 'modular-cabinet-v0',
};
function item(doorStyle) {
  return {
    ...base,
    modularOptions: {
      widthMm: 800, depthMm: 400, heightMm: 900,
      doorStyle, material: 'white',
    },
  };
}
const out = '../results/planner/world-standard-wave/05-symbols-svg/05-visual';
mkdirSync(out, { recursive: true });
for (const style of ['pair','slab','none']) {
  const block = furnitureBlock2DFromItem(item(style));
  writeFileSync(
    out + '/cabinet-v0-prims-' + style + '.json',
    JSON.stringify(block, null, 2),
  );
  if (block.prims.length < 4) throw new Error(style + ' prims < 4');
}
console.log('dumped pair/slab/none prim JSON');
"
```

Expected: three JSON files; each `prims.length >= 4`; pair has mid stile line; slab does not.

If `tsx -e` import fails, write a temporary dump script under evidence only:

`results/planner/world-standard-wave/05-symbols-svg/05-visual/dump-prims.ts` (not under `site/`) and run via path that resolves `@/` — or add a one-off vitest that writes files then delete it after dump. Prefer not polluting product tests permanently.

- [ ] **Step 2: Manual doorStyle diff check**

```powershell
# pair mid-X stile present; slab absent — human or jq
# pair handles: 2 small filled rects; slab: 1; none: 0
```

Assert by reading JSON:

- pair vs slab: `JSON.stringify(pair.prims) !== JSON.stringify(slab.prims)`
- none has ≥2 dashed horizontal lines

- [ ] **Step 3: Write 05-visual/NOTES.md**

```markdown
# Visual criteria (P05)

Buyer Q&A (Idiots raised bar) — answer from geometry alone:
1. What is it? → cabinet carcass + door cues
2. Which way is front? → stronger line at larger Y
3. doorStyle? → pair stile+2 handles / slab 1 offset handle / none shelves
4. Size? → footprint L×D matches placed mm

Readable when:
1. Outer carcass present (full footprint rect)
2. Front edge Y > back edge Y
3. doorStyle geometry differs across pair/slab/none JSON
4. Light surface fill on outer (not block-storage blob)
5. No competitor art / no svg-catalog URL in JSON

Artifacts:
- cabinet-v0-prims-pair.json
- cabinet-v0-prims-slab.json
- cabinet-v0-prims-none.json
- (optional) Playwright place PNG — flag OFF

Browser place journey remains P07 for full W2 place half.
non-blank PNG ≠ symbol quality.
```

- [ ] **Step 4 (optional strong visual): Playwright place PNG with flag OFF**

Only if place path is stable enough; else skip without failing symbol half:

```powershell
cd D:\OandO07072026\site
# Ensure NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE is NOT "1"
pnpm exec playwright test tests/e2e/open3d-mesh-symbol-live-verify.spec.ts --reporter=line 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\05-visual\playwright-raw.log
```

Copy relevant PNGs into `05-visual/` if produced elsewhere. Document flag OFF in NOTES.

- [ ] **Step 5: Commit**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/05-visual
git commit -m "trustdata(P05): cabinet-v0 prim-JSON visual evidence (pair/slab/none)"
```

---

### Task 06: CP-05 pack

**Files:**
- Create: `results/.../CP-05-vitest-raw.log`
- Create: `results/.../CP-05.json`
- Create: `results/.../SUMMARY.md`
- Create: `results/.../06-cp-pack/run.json`

- [ ] **Step 1: Final combined vitest**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\CP-05-vitest-raw.log
echo "EXIT=$LASTEXITCODE"
```

Expected: exit 0; all cases PASS.

- [ ] **Step 2: Write CP-05.json**

```json
{
  "checkpoint": "CP-05",
  "phase": "P05-symbols-svg",
  "gate": "W2-symbol-quality",
  "status": "pass",
  "claims": {
    "cabinetV0Block2DReadable": true,
    "notEmptyBox": true,
    "doorStyleGeometryDiffers": true,
    "lightSurfaceContrast": true,
    "canvasAuthorityIsBlock2D": true,
    "furnitureBlockUsesCenteredPathIsFalse": true,
    "svgCatalogIsPublishNotCanvas": true,
    "svgHonestySmoke": "pass-or-fail-or-skipped-with-notes",
    "noCompetitorSvg": true,
    "browserPlaceJourney": "deferred-to-P07",
    "meshBeauty": "deferred-to-P08",
    "fabricFlagOffForProof": true
  },
  "evidence": [
    "results/planner/world-standard-wave/05-symbols-svg/01-unit-reprove/vitest-raw.log",
    "results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/NOTES.md",
    "results/planner/world-standard-wave/05-symbols-svg/05-visual/",
    "results/planner/world-standard-wave/05-symbols-svg/CP-05-vitest-raw.log"
  ],
  "timestamp": "(ISO)",
  "head": "(git rev-parse HEAD or dirty)"
}
```

Set `"status": "fail"` if any required hard-stop row fails. Set `svgHonestySmoke` to actual outcome string.

- [ ] **Step 3: Write SUMMARY.md**

```markdown
# CP-05 SUMMARY — P05 symbols / SVG honesty

## Done
- cabinet-v0 ≥4 prims, not empty box
- pair mid stile; slab none; none = shelves
- light surface fill + dark detail (not inverse-body blob)
- furnitureBlockUsesCenteredPath === false
- unknown SKU non-empty
- honesty NOTES: Block2D canvas ≠ publish SVG
- visual prim-JSON (pair/slab/none)
- ethics: original O&O prims only
- evidence under results/planner/world-standard-wave/05-symbols-svg/

## Not done (explicit)
- P07 browser place ≥2 journey
- P08 mesh beauty
- SVG as Feasibility draw path / S7
- Fabric full-stage cutover
- Catalog-wide every-SKU symbol matrix (raised bar residual)

## Gate split
- symbolQuality: (pass|fail)
- svgHonestySmoke: (pass|fail|skipped-with-notes)

## Buyer Q&A (Idiots raised bar)
- Can tell cabinet from blob: yes/no
- Can tell front: yes/no
- Can tell slab vs pair: yes/no
```

- [ ] **Step 4: 06-cp-pack/run.json**

```json
{
  "phase": "P05-symbols-svg",
  "slice": "06-cp-pack",
  "command": "CP-05 final vitest + json + summary",
  "exitCode": 0,
  "timestamp": "(ISO)"
}
```

- [ ] **Step 5: Final commit**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/
git commit -m "trustdata(P05): CP-05 W2 symbol quality + SVG honesty pack"
```

- [ ] **Step 6: Stop**

Do not open Fabric cutover, mesh thrash, competitor research re-scrape, or S7 wiring.

---

### Task 07 (optional residual): Authority regression unit (only if gap)

If greps show risk of future “SVG as canvas” confusion and no static lock exists, add **only**:

**Files:**
- Create: `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.authority-honesty.test.ts`

- [ ] **Step 1: Write failing test first** if source regressions are suspected

```typescript
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  furnitureBlock2DFromItem,
  furnitureBlockUsesCenteredPath,
} from "@/features/planner/open3d/catalog/furnitureBlock2D";

describe("P05 authority honesty locks", () => {
  it("furnitureBlockUsesCenteredPath is always false", () => {
    expect(
      furnitureBlockUsesCenteredPath({
        id: "x",
        catalogId: "cabinet-v0",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 800,
        depth: 400,
        height: 900,
        geometryMode: "modular-cabinet-v0",
      }),
    ).toBe(false);
  });

  it("cabinet plan symbol payload never references svg-catalog", () => {
    const block = furnitureBlock2DFromItem({
      id: "x",
      catalogId: "cabinet-v0",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 800,
      depth: 400,
      height: 900,
      geometryMode: "modular-cabinet-v0",
      modularOptions: {
        widthMm: 800,
        depthMm: 400,
        heightMm: 900,
        doorStyle: "slab",
        material: "white",
      },
    });
    expect(JSON.stringify(block)).not.toMatch(/svg-catalog|\.svg|\.glb|https?:\/\//);
  });

  it("FeasibilityCanvas source still wires Block2D not svg-catalog furniture draw", () => {
    const p = resolve(
      process.cwd(),
      "features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx",
    );
    const src = readFileSync(p, "utf8");
    expect(src).toMatch(/furnitureBlock2DFromItem/);
    expect(src).toMatch(/renderBlock2DCentered/);
    expect(src).not.toMatch(/\/svg-catalog\/.*\.svg/);
  });
});
```

- [ ] **Step 2: Run**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.authority-honesty.test.ts --reporter=verbose
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.authority-honesty.test.ts
git commit -m "test(open3d): P05 authority honesty locks (Block2D ≠ svg-catalog)"
```

Skip Task 07 if Task 01 already covers these claims sufficiently (prefer YAGNI).

---

## 7. Test matrix

| ID | Suite / command | Asserts | Expected |
|----|-----------------|---------|----------|
| U1 | `furnitureBlock2D.cabinet-v0.test.ts` | footprint, modularOptions prefer, ≥4 prims, outer, contrast, bounds, front>back, pair/slab stile, handles, none shelves, centeredPath false, fill+stroke, no URL | all PASS |
| U2 | `renderBlock2DToCanvas.test.ts` | stroke floor, paint, centered translate, demo-desk, modular, contrast, unknown SKU, equipment unknown, degenerate clamp | all PASS |
| U3 | optional workstation suite | multi-rect systems | PASS if run |
| U4 | optional authority-honesty | static Feasibility wire + false centeredPath | PASS if added |
| S1 | `pnpm run scripts:smoke:svg:batch` | publish fixtures compile | 0 preferred; non-zero → honesty skip claim |
| V1 | prim-JSON pair/slab/none | ≥4 prims; doorStyle differ | files exist |
| V2 | optional Playwright mesh-symbol | place + zoom PNG | flag OFF; optional |
| B1 | Feasibility manual | `/planner/open3d` place cabinet-v0 | human readable; not CP alone |

### Commands cheat sheet

```powershell
cd D:\OandO07072026\site

# Symbol units
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose

# SVG honesty smoke
pnpm run scripts:smoke:svg:batch

# Dev inspect
pnpm dev
# open /planner/open3d · ensure NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE ≠ 1 · place cabinet-v0
```

### Expected unit counts (plan-time)

| File | Approx tests |
|------|----------------|
| cabinet-v0 | 13 |
| renderBlock2DToCanvas | 8 (stroke + 2 paint + 5 furnitureBlock2DFromItem) |

Do not assert exact total if suites grow; assert **zero failures** and unfiltered logs.

---

## 8. False-green catalog

| Trap | Why it looks green | How this plan blocks it |
|------|--------------------|-------------------------|
| SVG catalog files exist on disk | “We have symbols” | Honesty NOTES + authority tests |
| Vitest green without `results/` | Historical PASS claim | Recreate evidence tree mandatory |
| Prim count ≥4 garbage lines | Unit greened theater | front>back, stile, handles, contrast tests |
| Storage fill multi-prim | Count green, blob visual | light surface fill assertion |
| SVG smoke green = W2 | Pipeline ≠ canvas | Gate split in CP-05.json |
| Portal page loads | Publish preview ≠ place | Explicit false claim list |
| Fabric flag-ON Rects | Looks like furniture | Flag OFF policy |
| Non-blank PNG | Could be empty rect | prim-JSON + P07 anti-false-green |
| centeredPath true | Name sounds smart | Always false + unit lock |
| generateCabinetV0Footprint | “SVG path” | Documented mesh helper only |
| Appendix storage skeleton re-applied | “following plan” | Repo wins; surface fill of record |
| P07 place without P05 quality | Place works | Split responsibilities |
| Filtered vitest logs | Hidden failures | Tee full raw logs |
| Competitor path paste | Pretty symbols | Ethics + URL assertions |
| “CP-05 PASS forever” | Phase card status | Re-prove when evidence missing |

---

## 9. Stop-if-fail / CP criteria

### CP-05 hard stop (required rows)

| Check | Pass condition |
|-------|----------------|
| Unit | cabinet-v0 + render suites green + raw log + run.json |
| Non-empty | Modular + box fallback have prims |
| Door style | pair mid stile; slab none; none shelves |
| Contrast | outer fill `var(--block-surface)` not storage/inverse-body |
| CenteredPath | helper false for modular |
| Honesty | NOTES: Block2D canvas; SVG publish; 8 false claims refused |
| SVG smoke | Optional for symbol half; required if claiming smoke green |
| Ethics | No competitor SVG |
| Visual | prim JSON (pair/slab/none) + NOTES; optional PNG |
| Fabric | Proof with flag OFF |
| Scope | No mesh redesign, Fabric cutover, SVGR, S7 |

If required row fails: stop; log `Failures.md`; **do not** mark W2 symbol half green.

### Gate split (binding)

| Claim | Requires |
|-------|----------|
| W2 symbol quality green | Unit + non-empty + doorStyle + centeredPath false + contrast + visual + ethics + honesty prose |
| SVG honesty smoke green | batch smoke exit 0 + NOTES |
| “SVG pipeline works” in docs | Smoke green + publish path evidence |
| S7 place from published SVG | Future evidence — **not** current |
| Full W2 place story | P05 + **P07** |

---

## 10. Commit sequence

| Order | Message | When |
|-------|---------|------|
| 1 | `trustdata(P05): baseline NOTES for W2 symbols re-prove (results tree)` | Task 00 |
| 2 | `trustdata(P05): unit re-prove logs for cabinet-v0 Block2D + render` | Task 01 green |
| 2b | `trustdata(P05): unit re-prove RED notes (no paper green)` | Task 02 if RED |
| 3 | `fix(open3d): restore readable cabinet-v0 Block2D plan symbol for W2 (P05)` | Task 03A if needed |
| 4 | `fix(open3d): non-empty unknown SKU Block2D + canvas paint guard (P05)` | Task 03B if needed |
| 5 | `trustdata(P05): SVG honesty NOTES (Block2D canvas ≠ publish catalog)` | Task 04 |
| 6 | `trustdata(P05): cabinet-v0 prim-JSON visual evidence (pair/slab/none)` | Task 05 |
| 7 | `trustdata(P05): CP-05 W2 symbol quality + SVG honesty pack` | Task 06 |
| 8 | `test(open3d): P05 authority honesty locks (Block2D ≠ svg-catalog)` | Task 07 optional |

Push origin when landable green slice exists; mayoite mirror per AGENTS ~45 min / big land (agent call).

---

## 11. Risks & owner decisions

| Risk | Severity | Mitigation |
|------|----------|------------|
| Evidence tree missing → false historical PASS | High | Re-prove always when `results/` absent |
| Agent re-applies storage fill from appendix | High | Plan of-record uses surface; tests lock |
| Smoke fails, agent claims W2 fail wrongly | Med | Gate split |
| Smoke fails, agent claims pipeline works | Med | NOTES require exit 0 |
| Fabric flag left ON in e2e | High | Document; fail proof |
| Scope creep to full catalog SKUs | Med | Hero cabinet-v0 only; residual noted |
| S7 early wiring of svg-catalog to canvas | High | Explicit ban until goal change |
| Confuse P08 mesh with P05 plan | Med | Out of scope |
| Confuse P07 place with P05 quality | High | Split + anti-false-green |
| tsx dump import fails | Low | Alternate dump path; still require JSON |
| Stroke collapse at tiny zoom | Low | stroke floor already; residual polish |
| Color wash muddies contrast | Low | alpha 0.15 only; do not raise |

### Owner decisions (none required to execute re-prove)

| Question | Default without owner |
|----------|----------------------|
| Re-prove CP-05 when evidence missing? | **Yes** |
| Expand to all catalog SKUs this phase? | **No** |
| Wire svg-catalog to Feasibility? | **No** |
| Enable Fabric furniture flag for proof? | **No** |

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Live path / fact | Task coverage |
|------------------|---------------|
| `furnitureBlock2D.ts` multi-prim | 01 re-prove · 03 restore |
| `renderBlock2DToCanvas.ts` | 01 · 03B |
| `FeasibilityCanvas` Block2D wire | 00 greps · optional 07 |
| `furnitureBlockUsesCenteredPath` false | 01 · 03A · CP claims |
| asset-engine README honesty | 04 |
| `compileSvgForPublish` / smoke | 04 |
| `public/svg-catalog` publish only | 04 NOTES |
| `generateCabinetV0Footprint` not canvas | 00 · 04 |
| cabinet-v0 tests | 01 · 06 |
| render tests unknown SKU | 01 · 03B |
| results `05-symbols-svg/` | 00–06 |
| Fabric flag OFF | 00 NOTES · 05 · 08 catalog |

### 12.2 Brainstormer (Idiots) coverage

| Idiots bar / failure | Plan response |
|----------------------|---------------|
| Dual honesty problems | Goal + Task 04 + 05 |
| Three SVG paths A/B/C | §1.5 · §2 · NOTES |
| Empty-box dead criteria | §2.4 · unit · visual |
| doorStyle must differ | §5.4 · U1 · V1 |
| centeredPath lie | always false lock |
| Buyer Q&A readable | Done when · SUMMARY · visual NOTES |
| Approaches A/B/C | A chosen |
| Gate split smoke vs symbol | CP-05.json · §9 |
| P07 linkage | deferred claims |
| Ethics non-copy | §3 · unit URL assert |
| Paper PASS if results missing | Task 00 recreate |
| Fabric flag OFF | hard stop |
| Raised residual catalog matrix | Not done / residual |
| Prim-source convergence later | Architecture note |

### 12.3 Placeholder scan

No TBD / “similar to Task N” / missing code for restore path. Optional Playwright and Task 07 are explicit skip-safe with criteria.

### 12.4 Type consistency

- `doorStyle: "none" | "slab" | "pair"`
- `material: "oak" | "white"`
- Prim kinds match `blocks2d.ts`
- Footprint L/D/H mm; position center

### 12.5 Length honesty

Plan is long because: (1) code already green but evidence missing requires full re-prove choreography; (2) dual authority + false-green catalog is the actual product risk; (3) restore path needs full of-record source so agents do not re-blob with storage fill; (4) Idiots raised bar exceeds thin phase card.

---

## 13. Appendices

### Appendix A — Full of-record cabinet-v0 unit test source

Path: `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`

```typescript
/**
 * P05 / W2 — cabinet-v0 Block2D plan symbol quality (not empty-box bar).
 */
import { describe, expect, it } from "vitest";
import {
  furnitureBlock2DFromItem,
  furnitureBlockUsesCenteredPath,
} from "@/features/planner/open3d/catalog/furnitureBlock2D";
import type { Open3dFurnitureItem } from "@/features/planner/open3d/model/types";
import { renderBlock2DToCanvas } from "@/lib/catalog/renderBlock2DToCanvas";
import type { Prim } from "@/lib/catalog/blocks2d";

function cabinetItem(
  partial?: Partial<Open3dFurnitureItem>,
): Open3dFurnitureItem {
  return {
    id: "cab-1",
    catalogId: "cabinet-v0",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    width: 800,
    depth: 400,
    height: 900,
    geometryMode: "modular-cabinet-v0",
    modularOptions: {
      widthMm: 800,
      depthMm: 400,
      heightMm: 900,
      doorStyle: "slab",
      material: "white",
    },
    ...partial,
  };
}

function mockContext(): CanvasRenderingContext2D {
  const calls: string[] = [];
  const ctx = {
    calls,
    save: () => {
      calls.push("save");
    },
    restore: () => {
      calls.push("restore");
    },
    translate: () => {
      calls.push("translate");
    },
    rotate: () => {
      calls.push("rotate");
    },
    scale: () => {
      calls.push("scale");
    },
    beginPath: () => {
      calls.push("beginPath");
    },
    rect: () => {
      calls.push("rect");
    },
    roundRect: () => {
      calls.push("roundRect");
    },
    arc: () => {
      calls.push("arc");
    },
    moveTo: () => {
      calls.push("moveTo");
    },
    lineTo: () => {
      calls.push("lineTo");
    },
    fill: () => {
      calls.push("fill");
    },
    stroke: () => {
      calls.push("stroke");
    },
    setLineDash: () => {
      calls.push("setLineDash");
    },
    createLinearGradient: () => ({ addColorStop: () => undefined }),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    lineCap: "butt" as CanvasLineCap,
    shadowColor: "",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  };
  return ctx as unknown as CanvasRenderingContext2D;
}

function countByKind(prims: Prim[], kind: Prim["kind"]): number {
  return prims.filter((p) => p.kind === kind).length;
}

function midVerticalStileCount(prims: Prim[], midX: number): number {
  return prims.filter((p) => {
    if (p.kind !== "line" || p.points.length < 4) return false;
    const x0 = p.points[0]!;
    const x1 = p.points[2]!;
    return Math.abs(x0 - midX) < 2 && Math.abs(x1 - midX) < 2;
  }).length;
}

/** Small filled rects (handles) — exclude outer/inner carcass. */
function handleRectCount(prims: Prim[]): number {
  return prims.filter((p) => {
    if (p.kind !== "rect") return false;
    if (p.fill === "none" || p.fill === undefined) return false;
    return p.w < 80 && p.h < 40;
  }).length;
}

function horizontalLineYs(prims: Prim[]): number[] {
  const ys: number[] = [];
  for (const p of prims) {
    if (p.kind !== "line" || p.points.length < 4) continue;
    const y0 = p.points[1]!;
    const y1 = p.points[3]!;
    if (Math.abs(y0 - y1) < 2) ys.push(y0);
  }
  return ys;
}

describe("cabinet-v0 Block2D plan symbol (W2)", () => {
  it("uses placed modular dimensions for footprint", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(block.footprint.L).toBe(800);
    expect(block.footprint.D).toBe(400);
    expect(block.footprint.H).toBe(900);
  });

  it("prefers modularOptions dims over item width/depth/height when set", () => {
    const block = furnitureBlock2DFromItem(
      cabinetItem({
        width: 1200,
        depth: 600,
        height: 700,
        modularOptions: {
          widthMm: 900,
          depthMm: 350,
          heightMm: 880,
          doorStyle: "slab",
          material: "white",
        },
      }),
    );
    expect(block.footprint.L).toBe(900);
    expect(block.footprint.D).toBe(350);
    expect(block.footprint.H).toBe(880);
  });

  it("is not an empty-box symbol: ≥4 prims with carcass + front + door cue", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(block.prims.length).toBeGreaterThanOrEqual(4);
    expect(countByKind(block.prims, "rect")).toBeGreaterThanOrEqual(1);
    expect(countByKind(block.prims, "line")).toBeGreaterThanOrEqual(2);
  });

  it("draws outer carcass covering full footprint origin (0,0)", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const { L, D } = block.footprint;
    const outer = block.prims.find(
      (p) =>
        p.kind === "rect" &&
        Math.abs(p.x) < 1 &&
        Math.abs(p.y) < 1 &&
        Math.abs(p.w - L) < 1 &&
        Math.abs(p.h - D) < 1,
    );
    expect(outer).toBeDefined();
    expect(outer?.kind).toBe("rect");
    if (outer?.kind === "rect") {
      expect(outer.fill).not.toBe("none");
    }
  });

  it("outer fill is light surface token, not block-storage; multi-prim lines present", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const { L, D } = block.footprint;
    const outer = block.prims.find(
      (p) =>
        p.kind === "rect" &&
        Math.abs(p.x) < 1 &&
        Math.abs(p.y) < 1 &&
        Math.abs(p.w - L) < 1 &&
        Math.abs(p.h - D) < 1,
    );
    expect(outer).toBeDefined();
    if (!outer || outer.kind !== "rect") throw new Error("outer carcass missing");

    expect(outer.fill).toBe("var(--block-surface)");
    expect(outer.fill).not.toMatch(/block-storage/);
    expect(outer.fill).not.toMatch(/text-inverse-body/);
    expect(outer.stroke).not.toMatch(/block-storage/);

    expect(block.prims.length).toBeGreaterThanOrEqual(4);
    const lines = block.prims.filter((p) => p.kind === "line");
    expect(lines.length).toBeGreaterThanOrEqual(2);
    for (const line of lines) {
      if (line.kind === "line") {
        expect(line.stroke).toBeDefined();
        expect(line.stroke).not.toMatch(/block-storage/);
        expect(String(line.stroke)).not.toMatch(/text-inverse-body/);
      }
    }
  });

  it("keeps all prim geometry inside footprint (no runaway coords)", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const { L, D } = block.footprint;
    for (const p of block.prims) {
      if (p.kind === "rect") {
        expect(p.x).toBeGreaterThanOrEqual(-1);
        expect(p.y).toBeGreaterThanOrEqual(-1);
        expect(p.x + p.w).toBeLessThanOrEqual(L + 1);
        expect(p.y + p.h).toBeLessThanOrEqual(D + 1);
      }
      if (p.kind === "line") {
        for (let i = 0; i < p.points.length; i += 2) {
          expect(p.points[i]).toBeGreaterThanOrEqual(-1);
          expect(p.points[i]).toBeLessThanOrEqual(L + 1);
          expect(p.points[i + 1]).toBeGreaterThanOrEqual(-1);
          expect(p.points[i + 1]).toBeLessThanOrEqual(D + 1);
        }
      }
    }
  });

  it("front edge is deeper (+Y) than back edge (readable door face)", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const hs = horizontalLineYs(block.prims);
    expect(hs.length).toBeGreaterThanOrEqual(2);
    const backY = Math.min(...hs);
    const frontY = Math.max(...hs);
    expect(frontY).toBeGreaterThan(backY);
    expect(frontY).toBeGreaterThan(block.footprint.D * 0.7);
  });

  it("pair doors get a center stile; slab does not", () => {
    const midX = 400;
    const pair = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "pair",
          material: "oak",
        },
      }),
    );
    expect(midVerticalStileCount(pair.prims, midX)).toBeGreaterThanOrEqual(1);

    const slab = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "slab",
          material: "white",
        },
      }),
    );
    expect(midVerticalStileCount(slab.prims, midX)).toBe(0);
  });

  it("pair has dual handle cues; slab has single offset handle (no mid stile)", () => {
    const midX = 400;
    const pair = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "pair",
          material: "oak",
        },
      }),
    );
    const slab = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "slab",
          material: "white",
        },
      }),
    );

    expect(pair.prims.length).toBeGreaterThanOrEqual(4);
    expect(slab.prims.length).toBeGreaterThanOrEqual(4);
    expect(JSON.stringify(pair.prims)).not.toEqual(JSON.stringify(slab.prims));

    expect(handleRectCount(pair.prims)).toBe(2);
    expect(handleRectCount(slab.prims)).toBe(1);
    expect(midVerticalStileCount(slab.prims, midX)).toBe(0);

    const slabHandle = slab.prims.find(
      (p) => p.kind === "rect" && p.w < 80 && p.h < 40 && p.fill !== "none",
    );
    expect(slabHandle?.kind).toBe("rect");
    if (slabHandle?.kind === "rect") {
      const handleCx = slabHandle.x + slabHandle.w / 2;
      expect(Math.abs(handleCx - midX)).toBeGreaterThan(40);
    }
  });

  it("doorStyle none has open-shelf cues and zero mid stile", () => {
    const midX = 400;
    const open = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "none",
          material: "white",
        },
      }),
    );
    expect(open.prims.length).toBeGreaterThanOrEqual(4);
    expect(midVerticalStileCount(open.prims, midX)).toBe(0);
    expect(handleRectCount(open.prims)).toBe(0);

    const dashedHoriz = open.prims.filter((p) => {
      if (p.kind !== "line" || p.points.length < 4) return false;
      const y0 = p.points[1]!;
      const y1 = p.points[3]!;
      const isHoriz = Math.abs(y0 - y1) < 2;
      return isHoriz && Array.isArray(p.dash) && p.dash.length > 0;
    });
    expect(dashedHoriz.length).toBeGreaterThanOrEqual(2);
  });

  it("reports top-left prim authorship (centeredPath helper is false)", () => {
    expect(furnitureBlockUsesCenteredPath(cabinetItem())).toBe(false);
    expect(
      furnitureBlockUsesCenteredPath(
        cabinetItem({
          modularOptions: {
            widthMm: 800,
            depthMm: 400,
            heightMm: 900,
            doorStyle: "pair",
            material: "oak",
          },
        }),
      ),
    ).toBe(false);
  });

  it("renders to canvas without throwing and issues fill+stroke", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const ctx = mockContext();
    renderBlock2DToCanvas(ctx, block, {
      resolve: (t) => (t && t !== "none" ? String(t) : "#ccc"),
    });
    const calls = (ctx as unknown as { calls: string[] }).calls;
    expect(calls).toContain("fill");
    expect(calls).toContain("stroke");
    expect(calls.filter((c) => c === "beginPath").length).toBeGreaterThanOrEqual(2);
  });

  it("never depends on external SVG/GLB URLs for plan symbol", () => {
    const src = furnitureBlock2DFromItem.toString();
    expect(src).not.toMatch(/https?:\/\//);
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(JSON.stringify(block)).not.toMatch(/\.glb|\.svg|svg-catalog/);
  });
});
```

### Appendix B — Research translation table (ideas → O&O)

| Research idea (D:\websites) | O&O translation | Not allowed |
|----------------------------|-----------------|-------------|
| P5D catalog quality bar | Buyer recognition of placed items | CDN assets / editor scrape |
| RoomSketcher structure then furnish | W1 then W2 | Their 2D sprites |
| Floorplanner fixed branded sizes | SKU mm lock | Free stretch on sellable SKUs |
| Homestyler high mesh/symbol bar | Multi-prim Block2D + P08 mesh | Photoreal race first |
| IKEA modular configurators | doorStyle / modularOptions | Brand clone |
| oando-render-options three paths | A inventory · B plan · C publish | Collapse paths |
| ENGINE-DECISION Block2D now SVG later | This phase | Early SVG-as-canvas |

### Appendix C — Selector / path truth table (02-canvas-2d)

| Role | Path |
|------|------|
| Interim 2D | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| Flag | `…/canvas-fabric-stage/fabricFurnitureFlag.ts` — `=== "1"` only |
| Symbols | `…/catalog/furnitureBlock2D.ts` |
| Paint | `site/lib/catalog/renderBlock2DToCanvas.ts` |
| Publish | `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` |
| Portal | `site/app/(site)/portal/svg-catalog/` |
| Mesh footprint helper | `site/features/planner/open3d/catalog/modularCabinetV0.ts` |

### Appendix D — Recommended execute order (Idiots §21)

1. Prove live greps: multi-prim; centeredPath false; Feasibility uses `renderBlock2DCentered`.  
2. Run cabinet-v0 + render unit suites → raw logs under `05-symbols-svg/`.  
3. Dump slab vs pair vs none prim JSON to `05-visual/`.  
4. Run svg smoke batch; write honesty NOTES with real exit codes.  
5. Confirm asset-engine README canvas vs publish section present.  
6. Write CP-05.json with honest claim booleans; **do not** claim P07.  
7. Stop. Do not open Fabric cutover or mesh thrash.

### Appendix E — Neighbor phase handoff (Idiots §22)

| Phase | Message |
|-------|---------|
| P03 select-delete | Hit-test uses furniture bounds; denser symbols ≠ different pick API |
| P04 orbit | 2D symbols unrelated to orbit; continuity is document UUIDs |
| P06 save | Save serializes modularOptions doorStyle — symbols must rehydrate same prims |
| **P07 place** | You prove place; we prove readable; non-blank ≠ quality |
| P08 mesh | doorStyle meaning shared; mesh multi-part ≠ plan prims |
| P09 shortcuts | Placement shortcuts don’t change symbol authority |
| P10 evidence | CP-05 folder name fixed; re-index honesty NOTES |

### Appendix F — Key quotes (training anchors)

**Authority (phase execute):**

```
Plan canvas → furnitureBlock2DFromItem → Block2D prims (top-left) → renderBlock2DCentered
  (AUTHORITY FOR W2 PLAN SYMBOLS TODAY)

Admin/CLI → compileSvgForPublish → public/svg-catalog/{slug}.svg
  (PUBLISH AUTHORITY — NOT Feasibility draw path today)

generateCabinetV0Footprint = mesh helper path string — NOT canvas Block2D.
```

**P07 anti-false-green:**

```
non-blank canvas PNG ≠ P05 symbol quality
```

**asset-engine honesty:**

```
W2 acceptance is Block2D readable, not “SVG loaded onto FeasibilityCanvas.”
```

**Historical empty-box baseline (STALE — code has moved):**

```
cabinet-v0 modular symbol: 2 prims (rect + dashed center line) — was not product-readable
```

Live modular is multi-prim + contrast rule. Keep historical quote only to prevent regression of Path2D-only / empty-box thinking.

### Appendix G — Residual raised bar (explicitly NOT this CP thrash)

From Idiots §10.2 — document as follow-on, do not expand P05:

1. Catalog matrix: every placeable demo SKU named Block2D builder / bridge floor by category  
2. Thumbnail ↔ canvas parity snapshot of prim kinds  
3. Zoom readability formal criterion at INITIAL_TRANSFORM 0.1  
4. Orientation grammar doc front = +Y shared with mesh doors  
5. Workstation contrast rules held to same light/dark standard  
6. Publish SVG projection of same prim source when S7 arrives  
7. Fabric destination rebinds Block2D or re-gates W2  
8. Buyer acceptance string: “I can tell slab vs pair without reading the inspector”

---

## Execution handoff

**Plan complete and saved to `plans2/P05-symbols-svg/IMPLEMENTATION-PLAN.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

---

*End of P05 IMPLEMENTATION-PLAN (idiotplanners2 · Idiots wave-1 brainstormer · repo-first · no length cap).*
