# P08 — Mesh Quality (W7 / CP-08) — Exhaustive Brainstorm Report

**Agent:** Brainstormer 08/10  
**Checkout:** `D:\OandO07072026` (main tree only; no worktrees)  
**Mode:** Research + plan critique only · **no product code in this deliverable**  
**Write target (only):** `Idiots\P08-mesh-quality\REPORT.md`  
**Date of report assembly:** 2026-07-10  
**Skills context:** `/using-superpowers` + brainstorming discipline applied as design-depth pass (exhaustive design brief for implementers, not interactive Q&A — head brief fixed the deliverable).

---

## 0. Executive verdict (one screen)

| Claim | Verdict |
|-------|---------|
| Phase plan P08 is path-true and execution-ready | **YES** — formulas, blast list, non-goals, evidence path locked |
| Expert pass (3D/R3F + consolidated) agrees | **YES — FIX** (not BLOCK, not SHIP from paper alone) |
| Photoreal is the W7 goal | **NO — explicit non-goal** |
| Success metric | **BOQ / quote path + buyer-readable modular silhouette** > pretty PNG race |
| Live code (2026-07-10) vs plan honesty baseline (2026-07-09 “no toe”) | **Code has already landed toe→carcass→door, shared constants, plan===mesh tests** |
| CP-08 / W7 green today | **NO** — `results/` tree (and thus `08-mesh-quality/` NOTES + PNGs + run.json) **absent** from this checkout |
| What P08 still must do if code is ahead | **Evidence pack + NOTES bar doc + graded visual smoke + honest residual** — do not claim W7 from unit green alone |
| Raised quality beyond apology boxes | **Toe band + carcass mass + door face** is the W7 bar; handles/reveals/PBR remain residual |

**One sentence for the head agent:**  
P08 is not “invent mesh architecture” — architecture is correct and largely coded — it is **freeze the bar in NOTES, prove silhouette with visual smoke, keep plan===mesh, never overshoot height, never photoreal-fake, land proof only under `results/planner/world-standard-wave/08-mesh-quality/`.**

---

## 1. Scope, authority, ethics

### 1.1 Phase scope (what P08 owns)

| In | Out |
|----|-----|
| Modular **cabinet-v0** mesh quality bar | Photoreal materials / 4K race |
| Named parts: exact `toe`, `carcass`, door-* | Full kitchen L/U library |
| Height integrity (toe replaces carcass bottom) | Designer static GLB under `site/public/**` product dumps |
| plan parts === mesh children | Non–cabinet-v0 SKUs (workstation-v0 is sibling, not P08 primary gate) |
| GlbExport constants single source | R3F rewrite of open3d viewer mid-gate |
| Headless visual smoke (default) | Claiming W1–W6/W8 from this phase |
| Evidence under sole primary `08-mesh-quality/` | Mixing artifacts into P09 `09-shortcuts-chrome/` |
| Unit + blast tests 2/3/4 matrix | Firecrawl re-scrape as routine |

### 1.2 Authority stack (binding)

1. Owner current message / product intent  
2. `AGENTS.md` + `Agents/Agents-ELON-STANDARD.md`  
3. Live plan: `Plans/phases/P08-mesh-quality/*` + `Plans/INDEX.md` + RESULTS-MAP  
4. Design gates: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W7  
5. Expert: `Plans/phases/EXPERT-PASS.md` + `03-r3f-3d.md` + `P08-suggestions.md`  
6. Research **ideas only:** `D:\websites` (IKEA manufacturer depth, SYNTHESIS, ENGINE-DECISION, pack reports)  
7. Repo honesty docs under `Plans/Research/Others/` and product context  

**Research ≠ pass.** Scores and competitive PNGs never close W7. Evidence closes W7.

### 1.3 Ethics fence (non-negotiable)

From RESEARCH-MAP, ETHICS_AND_INSPIRATION, IKEA INSPIRATION, AGENTS:

- Competitive research is **patterns / jobs / bars as ideas**.  
- **Forbidden in product:** competitor JS, CSS, GLB, icons, logos, brand names, marketing copy, pixel-clone chrome, scraped furniture meshes.  
- **Allowed:** abstract industry patterns (readable base/toe, multi-part carcass, door face, SKU-true fixed sizes, quote path).  
- IKEA: **manufacturer SKU depth idea** → O&O SKUs only; never IKEA product names, planner chrome, or imagery.  
- Homestyler / Foyr: **mesh beauty is not the O&O wedge** for W1–W8; do not race photoreal.  
- MIT/open packages only if a dep is required; prefer zero new deps for P08.

---

## 2. What W7 actually means (product language)

### 2.1 Gate wording (design + phase)

From world-standard design:

> **W7** — Mesh quality **bar doc** + visual: modular not “apology boxes” for cabinet-v0 (**toe / door / carcass readable**).

From phase execute card:

> Raise modular **cabinet-v0** so a **facilities buyer** can read **toe / door / carcass** in 3D (and matching 2D footprint truth) — not a single apology box.

### 2.2 Buyer-readable silhouette (definition used in this report)

A facilities buyer (not a 3D artist) at a **three-quarter front view**, without reading wireframe labels or child name dumps, can answer:

1. Where is the **floor band / kick / toe** (the thing that recesses and sits on the floor)?  
2. Where is the **body / carcass** (the main volume that carries height and depth)?  
3. Where is the **door face** (the vertical panel on the front, not full-height over the kick)?  

If the answer is “it’s just a beige box,” W7 **fails** even if units assert three BoxGeometries.

### 2.3 Success metric hierarchy (locked)

| Rank | Metric | Why |
|------|--------|-----|
| 1 | **SKU / mm truth → place → BOQ/quote path** | O&O is manufacturer planner; ENGINE-DECISION + export BOQ slice + product context |
| 2 | **Readable modular parts** | Trust without photoreal; W7 |
| 3 | **Orbit / 2D↔3D continuity** | W4 (adjacent; not P08) |
| 4 | Pretty materials / PBR | Explicit later; never blocks W7 PASS |
| 5 | Competitor lifestyle 4K | Non-goal for program |

**Phrase to tattoo on NOTES:**  
`BOQ/quote path > photoreal; readable parts beat pretty noise.`

---

## 3. Live product truth (repo fact, 2026-07-10)

### 3.1 Honesty baseline drift (important)

| Date | Claim | Status now |
|------|-------|------------|
| Plan expert revision 2026-07-09 | Cabinet-v0 = carcass full H + optional doors; **no toe**; counts 1/2/3; private `DOOR_THICKNESS_MM` duplicated | **Stale as code fact** |
| Live `modularCabinetV0.ts` | Exports `TOE_HEIGHT_MM=100`, `TOE_INSET_MM=50`, `DOOR_THICKNESS_MM=18`; mesh builds toe→carcass→door; darker toe materials; counts 2/3/4 | **Present** |
| Live `modularCabinetV0GlbExport.ts` | **Imports** TOE_*/DOOR_* from mesh module; `buildModularCabinetV0PartPlans` mirrors layout | **Present** |
| Unit tests modularCabinetV0* | Order, geometry, door above toe, Box3 height integrity, plan===mesh size/pos | **Present** |
| Blast createSceneObjectFromNode | slab toe+carcass+door; pair four children incl. toe | **Present** |
| Blast meshStages | pair `runtimeMeshChildren` / `partCount` **4** | **Present** |
| Evidence `results/planner/world-standard-wave/08-mesh-quality/` | NOTES, vitest logs, PNGs, run.json | **Missing** — entire `results/` root absent in this checkout |
| Headless smoke script | `site/scripts/p08-cabinet-v0-visual-smoke.mjs` (SVG orthographic-ish from plan formulas → PNG via sharp) | **Present as tool**; artifacts not landed under evidence |

**Brutal implication:** Implementers must not re-do mesh from zero without reading live files. They must:

1. Diff plan formulas vs live mesh (expect match).  
2. Close **CP-08 evidence** and any residual honesty (stages note, NOTES residual).  
3. If geometry already matches bar, **do not “improve” into photoreal** to feel productive.

### 3.2 Architecture (locked path)

```
ModularCabinetV0Options (JSON / place stamp)
        │
        ├─ generateCabinetV0Footprint  → 2D path (outer W×D, centered) — BOQ envelope
        ├─ generateCabinetV0Mesh       → THREE.Group children (runtime / G5)
        └─ buildModularCabinetV0PartPlans → pure metres plan (G4) === mesh children
                    │
                    └─ exportModularGlbBinary → generated path only (catalog-assets/generated/*)
```

Viewer consumption:

- `createSceneObjectFromNode` when `geometryMode === "modular-cabinet-v0"` → `generateCabinetV0Mesh`  
- Imperative Three path: `ThreeViewerInner` + OrbitControls — **not** R3F `<Canvas>` rewrite for P08  

Policy:

- `glbAssetPolicy`: empty | blob: | `catalog-assets/generated/*` only  
- No designer static product GLB as primary place path  

### 3.3 Part-count matrix (normative)

| `doorStyle` | Parts | Exact child `name` order |
|-------------|------:|--------------------------|
| `none` | **2** | `toe`, `carcass` |
| `slab` | **3** | `toe`, `carcass`, `door-slab` |
| `pair` | **4** | `toe`, `carcass`, `door-left`, `door-right` |

**Locked name:** child string is exactly **`toe`** — never `toe-kick`, never `plinth`, never dual aliases mid-phase.

### 3.4 Default options (buyer demo SKU)

| Field | Default |
|-------|---------|
| widthMm | 600 |
| depthMm | 580 |
| heightMm | 720 |
| doorStyle | `slab` |
| material | `white` |

Outer 2D footprint for 600×580 must remain:

`M -300 -290 L 300 -290 L 300 290 L -300 290 Z`

Toe inset does **not** shrink the legal BOQ footprint rectangle.

---

## 4. Toe / carcass / door bar (normative geometry)

### 4.1 Constants (single source of truth)

Export from `site/features/planner/open3d/catalog/modularCabinetV0.ts`:

| Constant | Value | Role |
|----------|------:|------|
| `TOE_HEIGHT_MM` | **100** | Kick/toe band height |
| `TOE_INSET_MM` | **50** | Front recess (depth shrink of toe box) |
| `DOOR_THICKNESS_MM` | **18** | Door slab thickness |
| `MM` | **0.001** | mm → metres |

**GlbExport rule:** **import** these three — **delete** any second private magic copy. Live code already imports; any future PR that re-introduces a private `DOOR_THICKNESS_MM = 18` in GlbExport is a **plan===mesh regression**.

### 4.2 Derived quantities

Let:

- `w = widthMm * MM`  
- `d = depthMm * MM`  
- `h = heightMm * MM`  
- `toeH = TOE_HEIGHT_MM * MM`  
- `inset = TOE_INSET_MM * MM`  
- `carcassH = h - toeH`  
- `doorT = DOOR_THICKNESS_MM * MM`  
- `carcassY = toeH + carcassH / 2`  

### 4.3 Part formulas (copy into NOTES)

| Part | sizeM | positionM | Readability job |
|------|-------|-----------|-----------------|
| **`toe`** | `{ x: w, y: toeH, z: d - inset }` | `{ x: 0, y: toeH/2, z: -inset/2 }` | Floor band; back-aligned so front is recessed |
| **`carcass`** | `{ x: w, y: carcassH, z: d }` | `{ x: 0, y: carcassY, z: 0 }` | Main body mass; sits **on** toe top |
| **`door-slab`** | `{ x: w*0.96, y: carcassH*0.92, z: doorT }` | `{ x: 0, y: carcassY, z: d/2 + doorT/2 }` | Front face on carcass band only |
| **`door-left` / `door-right`** | `{ x: w*0.47, y: carcassH*0.92, z: doorT }` | x = ±(leafW/2 + 0.005); y = carcassY; z = d/2 + doorT/2 | Pair leaves with centre gap |

### 4.4 Height integrity (the anti-lie rule)

**Rule:** Toe **replaces** the bottom of the carcass. It is **never** stacked as extra height on top of a full-height carcass.

**Unit truth:**  
`THREE.Box3().setFromObject(group)` → `(max.y − min.y) ≈ heightMm * MM`  
and typically `min.y ≈ 0` (floor origin).

| Fail mode | Why it is a BOQ lie |
|-----------|---------------------|
| Carcass height = full `heightMm` **and** toe added below | Total span > SKU height |
| Door height tracks full `h` covering kick | Buyer sees floor-to-top door; toe unreadable |
| Toe height added above carcass | Same overshoot |

### 4.5 Door rules (readability)

- Door height ≈ **`carcassH * 0.92`**, **not** full `h`.  
- Door **y** centered on carcass (`carcassY`).  
- Door bottom ≥ toe top (no full-height slab painting over kick).  
- Door thickness sits **in front** of carcass (`z = d/2 + doorT/2`).  

### 4.6 Materials (minimal readable differentiation)

Live pattern (acceptable for W7):

| Part | Material family | Intent |
|------|-----------------|--------|
| Toe | Same family, **slightly darker** (oak/white toe hexes) | Band reads without second material system |
| Carcass | oak `#c4a574` / white `#f3f4f6` | Body mass |
| Door | Same as carcass family; slightly different roughness OK | Face plane |

**Not required for W7:** wood grain maps, IOR, clearcoat, environment HDR dependency, handle GLBs.

### 4.7 2D footprint truth

- Outer plan W×D remains **dimension-true** for BOQ path.  
- Toe recess is a **3D silhouette** cue, not a footprint shrink.  
- Optional later: front-edge mark / door swing arc — **not** P08 requirement if outer envelope tests stay green.

---

## 5. plan === mesh (G4 / G5 contract)

### 5.1 Why this is load-bearing

If runtime mesh has `toe` but export plan omits it (or uses different sizes), G5 GLB, stages pipeline, and any future packing/BOQ part lines **lie**. W7 is not “viewer pretty”; it is **one part list, two renderings**.

### 5.2 Identity checks (must hold)

For every doorStyle:

1. `parts.map(p => p.name)` === `group.children.map(c => c.name)` (order)  
2. For each index: sizeM ≈ BoxGeometry parameters; positionM ≈ mesh.position  
3. `partCount` === children.length === `countCabinetV0Parts(options)`  
4. `relativePath` under `catalog-assets/generated/` and `assertNoDesignerStaticGlb`  

### 5.3 GlbExport constants law

| Do | Do not |
|----|--------|
| Import `TOE_HEIGHT_MM`, `TOE_INSET_MM`, `DOOR_THICKNESS_MM` from modularCabinetV0 | Local `const DOOR_THICKNESS_MM = 18` in GlbExport |
| Keep `buildModularCabinetV0PartPlans` pure (no THREE) | Import THREE into GlbExport “just to measure” |
| Share formulas with mesh | Drift “approximately same looking” |

### 5.4 G-stage honesty (asset-engine)

From stages map (conceptual):

| Stage | Job | P08 touch |
|-------|-----|-----------|
| G1 options | ModularCabinetV0Options | Stable |
| G2 footprint | Outer path | Outer envelope unchanged |
| G3 runtime mesh | generateCabinetV0Mesh | Toe present; stages **note** may still say partial/generic — honesty bump if status text would lie |
| G4 part plan | GlbExport plans | Include toe |
| G5 binary | exportModularGlbBinary | Re-run tests; no designer path |
| G6 validate | structure | Non-reg |
| G8 load | browser product load | **Not** CP-08 requirement |

---

## 6. Photoreal is a non-goal (expanded)

### 6.1 Explicit non-goals from authorities

| Source | Non-goal |
|--------|----------|
| ENGINE-DECISION | Photoreal 4K race (Homestyler/Foyr) |
| Design W1–W8 out-of-scope | Photoreal renders |
| P08 execute card | Photoreal materials, designer GLB, full part library |
| EXPERT 03-r3f-3d | “No Foyr/Homestyler photoreal race” |
| SYNTHESIS / RESEARCH-MAP | BOQ/quote > photoreal first |
| Product context | Not Foyr photoreal race |
| IKEA public inspiration | Deprioritize photoreal room theater for manufacturer |

### 6.2 Why agents still try to photoreal (and must not)

| Temptation | Why it fails this phase |
|------------|-------------------------|
| “Homestyler mesh score 5 — we need PBR” | Mesh score was research snapshot; O&O wedge is SKU+BOQ |
| “Screenshot looks boxy — add HDRI and oak maps” | W7 grades **part readability**, not material fandom |
| “Ship vendor GLB from public/models” | Ethics + policy fail; static designer path banned |
| “R3F + drei environment for pretty PNG” | Thrash; open3d is imperative Three for W gates |
| “Async cloud render like P5D” | Later product; not CP-08 |

### 6.3 What “good enough materials” means at W7

- Distinct oak vs white carcass/door.  
- Darker toe band.  
- MeshStandardMaterial defaults acceptable.  
- Residual honesty in NOTES: *no handles, no side reveals, simple materials, not photoreal*.

If a reviewer needs labels to find the toe, materials/geometry failed — fix **silhouette geometry**, not texture packs.

---

## 7. Competitive mesh bars as **ideas only**

### 7.1 Score context (research snapshot — not live O&O truth)

From MASTER-CHART / RESEARCH-MAP (2026-07-09):

| Product | Mesh column idea | Steal pattern (not assets) |
|---------|------------------|----------------------------|
| Homestyler / Foyr | High visual mesh / catalog presence | Presence + material storytelling **later**; not W7 |
| Planner5D | Adequate catalog mesh + strong 3D presence | Multi-part enough for recognition |
| Floorplanner | Mid-tier library look | Fixed-size branded items honesty |
| IKEA | Brand meshes good; **SKU truth** wins | Configurator depth + item list; not lifestyle 4K |
| RoomSketcher | Plan/export first; mesh mid | Measure honesty > mesh beauty |
| O&O research self | Mesh ~1–2 | Modular bar is the climb; not million props |

Engine REPORT line worth keeping:

> Mesh quality is a **content + LOD** problem, not a “switch to Homestyler’s stack” problem.

### 7.2 IKEA manufacturer-depth (primary P08 research route)

From `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` (public landings only; **no live planner canvas scraped**):

| Pattern | O&O translation for mesh / catalog |
|---------|-------------------------------------|
| Product-system configurators | One modular system (cabinet-v0 first) with real options, not freeform sculpture |
| Design = composition of real catalog items | Parts map to sellable/orderable identity later; mesh parts should not invent non-catalog hardware yet |
| Configuration → item list / PDF | BOQ path > moodboard |
| 3D home / photoreal scan deprioritized | Readable modular silhouette is enough for trust at W7 |
| Desktop honesty for heavy tools | Headless smoke OK; browser place optional |

**Confidence honesty:** High for IA/positioning; **low** for in-tool mesh construction details (not scraped). Do not invent “IKEA uses 100mm toe” as scraped fact — O&O locks **100 / 50 / 18** as **own** bar constants.

### 7.3 Homestyler / Foyr idea (what to refuse)

- Cloud photoreal as product differentiator → **refuse for W1–W8**.  
- Million generic models → **refuse** as catalog strategy (inventory slice).  
- Five-zone editor chrome → **not P08**; P09 if at all.  

### 7.4 Planner5D / Floorplanner idea

- Catalog place → 2D/3D same document: continuity is W4/W2, not mesh.  
- Mesh “good enough to recognize furniture class” — **yes**, that is W7’s spirit without their assets.  
- White-label SKU admin → post-W enterprise story.

### 7.5 OEM systems (Featherlite / HON / Haworth / Steelcase — category peers)

Product context points at systems manufacturers, not home DIY:

- Systems → shape → size grid → modules → generate 2D + modular 3D.  
- **Wrong path:** free GLB dump per size×shape×client.  
- P08 cabinet-v0 is the **smallest modular slice** that proves generate-first depth before workstation matrices explode.

### 7.6 Anti-copy checklist for mesh work

- No GLB from `D:\websites\**` into `site/public` or features.  
- No competitor SVG path blobs as “toe profiles.”  
- Screenshots in `results/` must be **O&O** app or **O&O-generated** headless smoke — competitor shots stay under `D:\websites`.  
- Icons remain Phosphor elsewhere; mesh has no brand chrome.

---

## 8. Buyer-readable silhouette — grading rubric

### 8.1 Pass rubric (human + NOTES checklist)

Use default slab white 600×580×720.

| View | Must see | Fail if |
|------|----------|---------|
| Three-quarter front | Darker/receded **toe band**, larger **carcass**, front **door** slab floating slightly proud | One continuous block; door full-height into floor |
| Side | Toe **shallower in Z** (inset), carcass full depth, door proud of front | Toe same depth as carcass with no recess cue; height overshoot |

Checklist language for `visual-smoke.md` (every row yes/no + one sentence evidence):

1. Named parts present (toe, carcass, door-slab).  
2. Readable silhouette without labels (even if smoke script draws labels for QA, grade as if labels hidden).  
3. Height integrity plausible (toe not stacked).  
4. Door does not cover toe.  
5. No designer static GLB used for the shot.  
6. Materials oak/white distinct if both shown; at least white default clear.  
7. Residual honesty listed.

### 8.2 Fail examples (explicit)

1. Single `BoxGeometry` furniture.  
2. Door covering floor-to-top including kick.  
3. Carcass full `heightMm` + toe additive overshoot.  
4. Part plan missing `toe` while mesh has it (or reverse).  
5. Hand-made `.glb` from `public/` static dumps used as “proof.”  
6. Renaming toe to second alias mid-phase.  
7. Claiming CP-08 green with units only and no PNG.  
8. Photoreal PNG of unrelated product substituted for cabinet-v0.

### 8.3 Silhouette design principles (beyond the locked numbers)

These guide residual improvements **without** expanding scope:

| Principle | Application |
|-----------|-------------|
| **Contrast band** | Darker toe vs lighter carcass |
| **Depth hierarchy** | Toe recessed, door proud |
| **Proportion** | Toe ~100mm of total ~720mm reads as ~14% base — industry-plausible kick range for readability (own constant, not competitor copy) |
| **Avoid label dependency** | Names help tests; buyers do not read `userData` |
| **Consistency across door styles** | none/slab/pair share toe+carcass; only door count changes |

---

## 9. Raised quality beyond boxes (what “beyond apology” means)

### 9.1 Spectrum

| Level | Description | W7 status |
|-------|-------------|-----------|
| L0 | Single apology box | **FAIL** |
| L1 | Carcass + door glued full height | **FAIL** (pre-toe honesty baseline) |
| **L2** | **Toe + carcass + door(s), height integrity, plan===mesh** | **W7 PASS bar** |
| L3 | Side panels / gables, top thickness, visible shelf void | Post-W residual (nice) |
| L4 | Handles, hinges, soft-close cues | Residual |
| L5 | PBR wood, environment reflections | Non-goal now |
| L6 | Designer hero GLB / scanned mesh | Policy-hostile as primary path |

**P08 raises L0/L1 → L2.** It does **not** require L3–L6.

### 9.2 What still looks boxy (honest residual — put in NOTES)

- No handles or pulls.  
- No side reveals / shadow gaps between doors and carcass sides.  
- No countertop / worktop part.  
- No plinth material distinct from “darker same family.”  
- Doors are slabs, not shaker/profile.  
- Pair gap is a constant 10mm-ish world gap (±0.005 m), not hardware.  
- Walls and other furniture may still be parametric boxes.  
- Lighting is viewer default, not studio setup.  

**Saying residual out loud is PASS behavior.** Claiming “world-standard cabinetry mesh” from L2 is **FAIL honesty**.

### 9.3 Relationship to workstation-v0

Repo has richer multi-part desk meshes (legs, stretchers) and `ws-v0-visual-smoke.mjs`. That proves generate-first multi-part works elsewhere. **P08 gate remains cabinet-v0 only** — do not move CP-08 evidence into workstation folders or claim W7 from desk smoke.

---

## 10. Plan critique (brutal, useful)

### 10.1 What the plan gets right

| Strength | Why it matters |
|----------|----------------|
| Exact name `toe` locked | Stops agent alias thrash |
| Formulas frozen | plan===mesh possible |
| Height integrity Box3 | Stops BOQ height lie |
| Blast tests named | Hard-coded 3→4 would false-red green mesh |
| Headless smoke default | Decouples from P07 browser |
| Evidence sole `08-mesh-quality/` | RESULTS-MAP folder lock |
| Non-goals explicit | Blocks photoreal / public GLB “help” |
| TDD red→green tasks | Right order for geometry |
| NOTES first (Task 01) | Bar doc is part of gate, not optional prose |
| CP-08 table path-required | Missing screenshot = red |

STRUCTURE-ADVICE: P08 size (~380 lines) is **healthy** — do not split bar doc from implement mesh.

### 10.2 Plan weaknesses / update needs

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Honesty baseline table still says “no toe / counts 1/2/3” | High for agents | Prepend **live code verification** step; do not implement from stale baseline blindly |
| Visual smoke “headless Three render” vs landed script is **SVG plan projection** via sharp | Medium | Accept as default if PNGs prove silhouette; optional true WebGL still OK; document which path NOTES freezes |
| `results/` absent in checkout | High for CP-08 | Task 00 must create evidence tree; layout check expects root `results/` |
| stages.ts note may lag toe language | Low | Optional honesty bump |
| Parallel-fill scarcity | Process | Spine W3→journey→save still before scarce mesh polish per EXPERT-PASS — mesh can land early if code already green, but do not starve browser spine |
| Definition of done cites `Plans/trustdata/phases/...` path | Low | Live path is `Plans/phases/P08-mesh-quality/` — same content family; agents should follow actual tree |

### 10.3 Expert pass alignment

Consolidated EXPERT-PASS P0 #10:

> Default slab children `toe` → `carcass` → `door-slab` (+ pair doors); height integrity (toe replaces bottom of carcass); GlbExport **imports** shared constants.

03-r3f-3d:

- Stay imperative Three; no R3F thrash.  
- Headless PNG; slightly darker toe.  
- False reverse: photoreal to pass W7; designer GLB pretty PNG; full-height door after toe; additive height.

**Verdict:** Plan + expert essays are **aligned**. Live code **implements** the must-fix mesh bar. Remaining gap is **evidence + formal NOTES + residual honesty**, not geometry invention.

### 10.4 Kill-order interaction

INDEX / EXPERT: parallel fill after CP-02; scarce slots → spine before mesh/chrome.

| If | Then |
|----|------|
| Code already green for mesh | Land evidence pack quickly (cheap win) without claiming whole product ship |
| Browser journey still red | Still allowed to close CP-08 (P07 not required) |
| Someone wants “pretty office scene” | Redirect to L2 bar only |

---

## 11. Approaches (2–3) with recommendation

### Approach A — **Evidence-first closeout** (recommended if mesh already matches bar)

**Steps:**

1. Verify live formulas vs normative section 4 (expect match).  
2. Run core + blast vitest pack → `vitest-raw.log` / nonreg log under `08-mesh-quality/`.  
3. Write `NOTES.md` (full bar, fail modes, residual).  
4. Run `node scripts/p08-cabinet-v0-visual-smoke.mjs --out …/08-mesh-quality`.  
5. Write `visual-smoke.md` grading checklist.  
6. Write `run.json` schema fields.  
7. Self-grade CP-08 table.  
8. Optional stages honesty note.

| Pros | Cons |
|------|------|
| Fast; matches reality of code | Does not re-prove TDD theater if someone demands red logs historically |
| Closes real gap (missing evidence) | Risk of rubber-stamping if visual still unreadable |

**When:** Live mesh already 2/3/4 with toe.

### Approach B — **Strict TDD re-walk** (recommended if any formula drift found)

**Steps:**

1. Task 02 red assertions if anything missing.  
2. Task 03 green geometry + blast.  
3. Then Approach A packaging.

| Pros | Cons |
|------|------|
| Discipline if drift | Wasteful thrash if already green |

**When:** Diff shows missing toe, duplicate constants, or height overshoot.

### Approach C — **Photoreal / designer GLB shortcut** (rejected)

Ship pretty assets from public vendor trees or competitor-style PBR packs to “look done.”

| Pros | Cons |
|------|------|
| Pretty screenshots | Ethics fail, policy fail, BOQ lie risk, wrong product strategy |

**Reject.** Always.

### Recommendation

**Approach A** as default on this checkout (code ahead of evidence). Fall back to **B** only on geometric drift. Never **C**.

---

## 12. Blast tests (full inventory)

### 12.1 Primary unit pack

| File | Assert focus |
|------|----------------|
| `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` | Names order, counts 2/3/4, toe geom, carcass on toe, door above toe, Box3 height, materials distinct, footprint path |
| `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts` | plan parts === mesh, constants, generated path, designer static rejected |
| `site/tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts` | Outer envelope stable |

### 12.2 Blast pack (same landable slice)

| File | Hard-code risk | Expectation after toe |
|------|----------------|------------------------|
| `createSceneObjectFromNode.test.ts` | Child counts/names | slab 3 with toe; pair 4 |
| `meshStages.test.ts` | pair partCount / runtimeMeshChildren | **4** not 3 |
| `modularPlaceMesh.test.ts` | count helper length | Follows `countCabinetV0Parts` |

### 12.3 Commands (canonical)

Evidence dir:

```powershell
New-Item -ItemType Directory -Force -Path D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality | Out-Null
```

Core + blast (phase non-reg):

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  tests/unit/features/planner/open3d/modularPlaceMesh.test.ts `
  tests/unit/features/planner/asset-engine/meshStages.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-nonreg-raw.log
```

Visual smoke (landed script path):

```powershell
cd D:\OandO07072026\site
node scripts/p08-cabinet-v0-visual-smoke.mjs --out D:/OandO07072026/results/planner/world-standard-wave/08-mesh-quality
```

### 12.4 run.json minimum schema

```json
{
  "phase": "P08",
  "gate": "W7",
  "checkpoint": "CP-08",
  "date": "YYYY-MM-DD",
  "head": "<short sha>",
  "w7": "pass|fail",
  "partNamesDefaultSlab": ["toe", "carcass", "door-slab"],
  "partCountMatrix": { "none": 2, "slab": 3, "pair": 4 },
  "vitestPassed": true,
  "visualSmoke": "pass|fail",
  "policyNoDesignerGlb": true,
  "residualHonest": "no handles; simple materials; not photoreal"
}
```

---

## 13. CP-08 hard stop table (grading)

| Check | Pass condition | Evidence path |
|-------|----------------|---------------|
| **Bar doc** | NOTES defines toe/door/carcass, locked name, numbers, fail modes | `…/08-mesh-quality/NOTES.md` |
| **Unit footprint** | Outer W×D path stable | vitest log + footprint tests |
| **Unit parts** | Default slab toe+carcass+door; matrix 2/3/4; plan===mesh; height span | vitest log + GlbExport tests |
| **Blast units** | createSceneObjectFromNode + meshStages (+ place) green | nonreg or raw log |
| **Visual smoke** | Human-readable parts on PNG; checklist yes; headless OK | PNGs + `visual-smoke.md` |
| **No designer GLB** | No new static product GLB; policy intact | code review + policy tests |
| **Height integrity** | Total height = options.heightMm | Box3 unit |
| **Honest residual** | NOTES lists non-photoreal residuals | NOTES section |

**Green only if every required row has a path.**  
**Missing screenshot = red even if units green.**  
**Today (this checkout):** rows that need `results/…` are **unproven** → **W7 not claimable**.

---

## 14. NOTES.md content contract (Task 01 — write exactly this substance)

When implementers create NOTES, include **no empty placeholders**:

1. **Gate** — W7 / CP-08 wording.  
2. **Pass criteria** — normative list (exact `toe`, formulas, plan===mesh, no designer GLB).  
3. **Fail criteria** — apology box, height overshoot, policy breach, wrong alias.  
4. **Part name table** — order strings.  
5. **Part-count matrix** — 2/3/4.  
6. **Commands** — unit pack + frozen visual smoke command.  
7. **Artifacts** — expected filenames.  
8. **Honest residual** — handles, materials, not photoreal.  
9. **Success metric** — BOQ/quote > photoreal sentence.

---

## 15. Task map (execute order) — mapped to reality

| Task | Plan intent | Reality-adjusted action |
|------|-------------|-------------------------|
| 00 Setup | Evidence shell + baseline vitest | Create `results/.../08-mesh-quality/`; baseline should already be green if mesh landed |
| 01 NOTES | Bar doc | **Must write** — still missing |
| 02 Unit red | TDD fail on missing toe | Skip re-red if green; if owner wants theater, snapshot historical only — prefer honest green proof |
| 03 Green mesh | Implement formulas + blast | Verify/diff only; edit only if drift |
| 04 Visual smoke | Headless PNG | Run `p08-cabinet-v0-visual-smoke.mjs`; grade checklist |
| 05 Non-reg + policy | Pack log + run.json | Required |
| 06 CP-08 closeout | Self-grade | Report residual; do not claim world product complete |

---

## 16. False-reverse risks (mesh-specific)

| Trap | Reality |
|------|---------|
| Photoreal materials to “pass” W7 | Non-goal; readable parts win |
| Designer static GLB for pretty PNG | Policy + ethics fail |
| Full-height door after adding toe | Door tracks carcassH only |
| Toe additive height | Overshoots SKU; BOQ lie |
| Port open3d to R3F for pretty | Imperative Three is product path |
| Rename toe → plinth “for clarity” | Breaks plan===mesh contracts |
| Claim W7 from unit green without PNG | CP-08 table forbids |
| Use workstation smoke as cabinet evidence | Wrong product surface |
| Invent second mesh builder | Single modularCabinetV0 + export mirror |
| Write under `site/public/**` product trees for “assets” | Explicit ban |
| Re-scrape Firecrawl for mesh | Dead for routine; packs already enough |
| Treat research mesh score 1 as “still no toe” after code landed | Re-verify code; update mental model |

---

## 17. Related phases (boundaries)

| Phase | Boundary with P08 |
|-------|-------------------|
| P01 product truth | What place/mesh path actually is |
| P02 engine lock | Three family; BOQ>photoreal; no thrash |
| P04 orbit | Viewability of mesh; not part geometry |
| P05 symbols | 2D Block2D authority; not 3D toe |
| P07 journey | Browser place of cabinet-v0 optional for visual fidelity |
| P09 chrome | Do not park mesh evidence under shortcuts folders |
| P10 handover | Index that W7 path is sole `08-mesh-quality/` |

---

## 18. Appendices

### Appendix A — Phase folder inventory

| File | Role |
|------|------|
| `Plans/phases/P08-mesh-quality/P08-mesh-quality.md` | Execute card (bar, tasks, CP-08) |
| `Plans/phases/P08-mesh-quality/P08-suggestions.md` | S1–S10 applied suggestions |
| `Plans/phases/P08-mesh-quality/03-r3f-3d.md` | Expert 3D/mesh path |
| `Plans/phases/P08-mesh-quality/README.md` | Local index |
| `Plans/phases/EXPERT-PASS.md` | Consolidated P0 including mesh |

### Appendix B — Primary code touch list

| Path | Role |
|------|------|
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Mesh + constants + footprint + counts |
| `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` | Pure part plans + generated path |
| `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` | Place/runtime consume |
| `site/features/planner/asset-engine/mesh/exportModularGlbBinary.ts` | G5 |
| `site/features/planner/lib/glbAssetPolicy.ts` | Policy |
| `site/features/planner/asset-engine/stages.ts` | Honesty status notes |
| `site/scripts/p08-cabinet-v0-visual-smoke.mjs` | Headless PNG generator |

### Appendix C — Test touch list

Listed in §12.

### Appendix D — Evidence folder contract

Canonical only:

`D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\`

Required artifacts:

| Artifact | Required |
|----------|----------|
| `NOTES.md` | Yes |
| `vitest-raw.log` | Yes |
| `run.json` | Yes |
| `01-cabinet-v0-three-quarter.png` | Yes |
| `02-cabinet-v0-side.png` | Yes |
| `visual-smoke.md` | Yes |
| `vitest-nonreg-raw.log` | Preferred |
| `visual-smoke-meta.json` | From smoke script (optional support) |

Forbidden names for this gate: `07-mesh-quality/`, `09-mesh-*`, historical `modular-*` as CP-08 home, P09 under dual `08-shortcuts-chrome/` confusion (W8 is `09-shortcuts-chrome/` per current RESULTS-MAP — mesh alone owns sole primary `08-*`).

### Appendix E — Research sources consumed (ideas only)

| Source | Use for P08 |
|--------|-------------|
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Catalog is product; BOQ > photoreal |
| `…\comparison\ENGINE-DECISION.md` | Mesh = modular-cabinet-v0 first; non-goals |
| `…\comparison\MASTER-CHART.md` | Mesh winners vs O&O; IKEA SKU win |
| `…\comparison\01-engine\REPORT.md` | Mesh is content/LOD, not engine switch |
| `…\comparison\03-inventory\REPORT.md` | Fixed-size SKU honesty |
| `…\comparison\06-export-boq\REPORT.md` | Quote path wedge |
| `…\comparison\07-oando-self\REPORT.md` | Live mesh_symbol deficit honesty (dated) |
| `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | Manufacturer depth patterns |
| `D:\websites\homestyler.com\report\INSPIRATION.md` | Photoreal non-goal reinforcement |
| `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` | Inspiration vs copy |
| `D:\websites\README.md` + RESEARCH-MAP | Pack index + phase routing |
| `Plans/Research/Others/18-PRODUCT-CONTEXT.md` | Systems manufacturer; generate not free GLB |
| `Plans/Research/Others/04-HONEST-QUALITY.md` | Stacked boxes residual historically |
| `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | W7 definition |

### Appendix F — Geometry worked example (default slab)

Options: 600 × 580 × 720 mm, slab, white.

| Qty | Value |
|-----|------:|
| w | 0.600 m |
| d | 0.580 m |
| h | 0.720 m |
| toeH | 0.100 m |
| inset | 0.050 m |
| carcassH | 0.620 m |
| doorT | 0.018 m |
| carcassY | 0.410 m |
| toe size | 0.600 × 0.100 × 0.530 |
| toe pos | (0, 0.050, −0.025) |
| carcass size | 0.600 × 0.620 × 0.580 |
| door-slab size | 0.576 × 0.5704 × 0.018 |
| door z | 0.290 + 0.009 = 0.299 m |
| Box3 Y span | 0.720 m |

### Appendix G — Part name anti-alias dictionary

| Forbidden | Required |
|-----------|----------|
| plinth | `toe` |
| toe-kick | `toe` |
| kick | `toe` |
| base | `toe` (if meaning kick band) |
| body / cabinet | `carcass` |
| front / panel | `door-slab` or pair names |
| door (ambiguous) | `door-slab` / `door-left` / `door-right` |

### Appendix H — Agent split (optional, max 2)

| Agent | Owns | Must not |
|-------|------|----------|
| A — TDD mesh | Geometry verify/fix + unit evidence + blast | Browser chrome; other SKUs; public GLB |
| B — Visual + NOTES | NOTES, smoke PNGs, CP packaging | Rewrite mesh without re-running A units |

Both: superpowers; trust data; no competitor GLB; no worktrees.

### Appendix I — Commit message shapes (from plan)

- `docs(planner): W7 mesh quality bar NOTES for cabinet-v0 (P08)`  
- `fix(planner): cabinet-v0 toe+carcass+door mesh quality (W7/P08)`  
- `test(planner): W7 mesh quality evidence pack (P08/CP-08)`  

### Appendix J — Definition of done (phase)

P08 done when:

1. Execute card followed with checkboxes.  
2. Mesh exposes `toe` + `carcass` + door (readable), exact names/order.  
3. Unit footprint + parts + height integrity green under evidence (primary + blast).  
4. Visual smoke PNGs graded against NOTES.  
5. CP-08 table fully evidenced under `08-mesh-quality/`.  
6. No designer static GLB introduced.  

Next phase: **P09** shortcuts/chrome (W8) unless owner reorders — do not mix evidence folders.

### Appendix K — What this brainstormer deliberately did **not** do

- No product code edits.  
- No evidence PNG generation (write-only Idiots path).  
- No Firecrawl re-scrape.  
- No competitor asset import.  
- No claim that CP-08 is green.  
- No expansion into workstation library or photoreal materials.

### Appendix L — Head-agent one-pager (pasteable)

```
P08/W7 = cabinet-v0 readable toe→carcass→door; height integrity; plan===mesh;
constants TOE 100 / INSET 50 / DOOR 18 from modularCabinetV0 only;
photoreal non-goal; BOQ>pretty; evidence only 08-mesh-quality/;
live mesh likely already coded — close NOTES+smoke+run.json;
blast tests 2/3/4; no designer GLB; residual: no handles/not photoreal.
```

---

## 19. Final recommendation

1. **Treat the phase plan as correct product law.**  
2. **Treat photoreal and designer GLB as permanent refuse for this gate.**  
3. **Treat live code as likely already L2** — verify, do not thrash.  
4. **Treat missing `results/08-mesh-quality/` as the real CP-08 gap** on this checkout.  
5. **Grade buyer silhouette, not engine fashion.**  
6. **Keep competitive mesh scores as inspiration for ambition, not as a license to clone Homestyler materials.**  
7. **Raise quality to multi-part readable modular furniture — stop at honest residual rather than infinite cabinetry CAD.**

---

*End of Brainstormer 08/10 report. No TBD. Implementation is a separate execute pass with TDD + verification skills.*
