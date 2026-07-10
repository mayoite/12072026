# Idiots2 / P08 — Mesh quality bar (W7) — Exhaustive brainstorm report

**Agent:** BRAINSTORMER 08/10  
**Date:** 2026-07-10  
**Mode:** Research synthesis + design truth · **NO CODE** · no product edits outside this folder  
**Deliverable:** this file only under `Idiots2/P08-mesh-quality/`  
**Gate:** **W7** — Mesh quality **bar doc** + visual: modular not “apology boxes” for cabinet-v0 (**toe / door / carcass readable**)  
**Checkpoint:** **CP-08**  
**Evidence home (execution, not this report):** `results/planner/world-standard-wave/08-mesh-quality/`  
**Checkout:** `.` main only · no worktrees  

**Skills invoked:** `/using-superpowers` · brainstorming (design/spec synthesis; no implementation)  

**Read order obeyed (binding for this report):**

1. **`D:\websites` FIRST** — IKEA public planner pack, manufacturer / OEM depth, mesh scores, SYNTHESIS, ENGINE-DECISION, MASTER-CHART, all competitor pack reports  
2. **`Plans/Research`** — RESEARCH-MAP, RESULTS-MAP pointers, historical synthesis  
3. **`Plans/phases/P08-mesh-quality/` ALL** — README, P08-mesh-quality.md, P08-suggestions.md, 03-r3f-3d.md · plus EXPERT-PASS mesh bullets  

**Ethics fence (binding):** Competitive research = **ideas / JTBD / patterns only**. No competitor code, CSS, GLB, logos, product names, or brand chrome in product, tests, or evidence screenshots. MIT/open packages only if a dep is ever needed (prefer **zero new deps** for P08).

---

## 0. One-page verdict (read this if you only have 90 seconds)

| Question | Answer |
|----------|--------|
| **What is W7?** | Prove cabinet-v0 is a **readable multi-part product mesh** (toe + carcass + door), not a single apology box — with a **written quality bar**, **unit geometry truth**, and **visual smoke**. Not photoreal. Not full kitchen library. |
| **Why does it matter commercially?** | O&O is a **manufacturer planner**. Buyers trust SKUs when the 3D object looks like a **real article class** (base band, body, door face). Homestyler/Foyr win prettiness; **IKEA wins product depth**. O&O must win **readable SKU mesh + BOQ**, not 4K renders. |
| **What did research say mesh winners are?** | Homestyler / Foyr = mesh **5** (presentation). IKEA mesh **4** with SKU truth **5**. O&O research self-score mesh **1–2** (“boxes”). Engine decision: **modular-cabinet-v0 quality bar first**. |
| **What does the phase plan lock?** | Exact child name **`toe`** (not plinth/toe-kick). Order: `toe` → `carcass` → door(s). Matrix 2/3/4. Formulas for toe inset, carcass on toe, doors on carcassH. Height integrity via Box3. plan === mesh. No designer static GLB. |
| **Live code honesty (2026-07-10 re-proof)?** | **`modularCabinetV0.ts` already implements toe + carcass + doors**, exports `TOE_*` / `DOOR_THICKNESS_MM`, darker toe materials. GlbExport **imports** shared constants and mirrors parts. Unit tests assert matrix, geometry, Box3 height integrity. **Plan docs dated 2026-07-09 still describe “no toe”** — those honesty baselines are **stale relative to code**. |
| **Is CP-08 green?** | **Not proven.** Repo-root `results/` evidence tree for `08-mesh-quality/` was **not present** at report time. Units in tree ≠ NOTES + PNGs + visual-smoke.md + run.json. **Do not claim W7 pass without evidence folder.** |
| **What remains for executors?** | (1) Freeze NOTES from normative bar. (2) Re-run vitest packs → raw logs. (3) Headless visual smoke PNGs graded against NOTES. (4) run.json + CP-08 table. (5) Only then mark green. Do **not** re-implement mesh if units already match formulas — **verify, evidence, residual honesty**. |
| **What not to do?** | Photoreal race. Designer GLB dump under `public/`. R3F rewrite mid-gate. Expand beyond cabinet-v0. Rename `toe`. Make toe **additive** over full carcass height. Fake pretty screenshots with static assets. |

**Brutal pushback:** W7 is the **smallest honest manufacturer-depth slice** that makes “we have modular cabinets” true to the eye. Shipping units without NOTES+PNG is **paper PASS**. Shipping prettier boxes without named parts is **still boxes**. Shipping Photoreal without BOQ is **wrong product**.

---

## 1. Source map (what was read; what each is for)

### 1.1 `D:\websites` — competitive / manufacturer research (ideas only)

| Path | Role for P08 / W7 |
|------|-------------------|
| `D:\websites\README.md` | Canonical research home; ethics; layout |
| `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | **Primary manufacturer-depth pattern** for catalog-as-product |
| `D:\websites\ikea.com\planner-public\raw\*.md` | Public hub / kitchen / PAX landings (marketing only; no live canvas) |
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Pattern library → O&O translation; **modular mesh quality bar** |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Who wins mesh/SKU/BOQ; O&O mesh ~1 |
| `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` | **Mesh = modular-cabinet-v0 first**; IKEA-like product depth |
| `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md` + `SCORES.csv` | Mesh quality column: Homestyler/Foyr 5; IKEA 4; O&O 2 |
| `D:\websites\research\2026-07-09-world-standard\comparison\03-inventory\REPORT.md` | SKU/mm + variants; IKEA gold for article truth |
| `D:\websites\research\2026-07-09-world-standard\comparison\06-export-boq\REPORT.md` | BOQ > photoreal; IKEA items-list pattern |
| `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` | Brutal mesh_symbol ~2; boxes until polish |
| `D:\websites\planner5d.com\report\*` | Hybrid engine; catalog mesh “adequate”; ethics; packages inspiration |
| `D:\websites\roomsketcher.com\report\INSPIRATION.md` | Measure rigor; 3D solid not photoreal-first; mesh mid |
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | Library + orbital 3D; branded fixed sizes; mesh mid-tier |
| `D:\websites\homestyler.com\report\INSPIRATION.md` | Presentation/mesh winner family; **do not race photoreal** for W7 |
| `D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md` | **Parked** — domain for sale; zero product signal |
| `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md` | 2D symbol path ≠ 3D mesh path (authority split) |
| `D:\websites\research\oem-systems\*` | Steelcase / Haworth / HON / Featherlite marketing scrapes — **portfolio language**, not mesh formulas |
| `D:\websites\research\from-repo-Plans-Research\*` | Historical 2026-07-05 UI/package notes — **world-standard 2026-07-09 wins** on conflict |

### 1.2 `Plans/Research` (repo index into research)

| Path | Role |
|------|------|
| `Plans/Research/RESEARCH-MAP.md` | **Phase → pack routing**: P08/W7 → IKEA manufacturer-depth idea; mesh bar not photoreal; evidence `08-mesh-quality/` |
| `Plans/Research/RESULTS-MAP.md` | Evidence vs research separation (research ≠ W-gate pass) |
| Historical synthesis (also under `D:\websites\research\from-repo-Plans-Research\`) | Older package/UI; do not revive discarded hybrids |

### 1.3 Phase pack (execute authority for P08)

| Path | Role |
|------|------|
| `Plans/phases/P08-mesh-quality/README.md` | Folder index |
| `Plans/phases/P08-mesh-quality/P08-mesh-quality.md` | **Full execute card** — quality bar, tasks 00–06, CP-08 table |
| `Plans/phases/P08-mesh-quality/P08-suggestions.md` | Expert suggestions S1–S10 applied into plan |
| `Plans/phases/P08-mesh-quality/03-r3f-3d.md` | 3D expert: FIX; toe order; stay imperative Three; no photoreal |
| `Plans/phases/EXPERT-PASS.md` | Merged P0 #10 mesh bar; headless PNG P1 |

### 1.4 Design / product authority (above phase)

| Path | Role |
|------|------|
| `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | **W7 gate wording**; Approach A; mesh file target `modularCabinetV0.ts` |
| `AGENTS.md` / `Agents/Agents-ELON-STANDARD.md` | Evidence under root `results/`; honesty; no Firecrawl routine |

### 1.5 Live product files (re-proof only; this report does not edit them)

| Path | Live fact (2026-07-10) |
|------|------------------------|
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | **Has toe**; formulas; exported constants; darker toe mats |
| `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` | Imports `TOE_*` / `DOOR_THICKNESS_MM`; part plans mirror mesh |
| Unit tests under `site/tests/unit/features/planner/open3d/modularCabinetV0*.ts` | Assert names, counts, geometry, Box3 height integrity, plan===mesh |
| Blast tests (createSceneObjectFromNode, meshStages, modularPlaceMesh) | Must stay aligned with 2/3/4 matrix (verify at execute) |

---

## 2. What W7 is — and what it is not

### 2.1 Gate text (authoritative)

From world-standard design:

> **W7** — Mesh quality **bar doc** + visual: modular not “apology boxes” for cabinet-v0 (**toe/door/carcass readable**) · Proof: **Visual smoke + NOTES**

From P08 execute card:

> Raise modular **cabinet-v0** so a facilities buyer can read **toe / door / carcass** in 3D (and matching 2D footprint truth) — not a single apology box. Freeze the quality bar in NOTES, prove it with unit footprint/parts + visual smoke, land evidence under CP-08.

### 2.2 Pass means (normative checklist — copy into NOTES at execute)

1. **Named parts** on default slab: exact strings **`toe`**, **`carcass`**, **`door-slab`** (pair → `door-left` + `door-right`).  
2. **Locked order:** `toe` → `carcass` → door part(s).  
3. **Readable silhouette** from three-quarter front: base band, body mass, door face distinguishable without wireframe labels.  
4. **Geometry formulas** (locked numbers — §6).  
5. **Height integrity:** Box3 Y span ≈ `heightMm` (toe **replaces** carcass bottom — not stacked past SKU height).  
6. **Doors track carcassH**, not full enclosure height; door bottom ≥ toe top.  
7. **2D footprint** outer W×D **unchanged** (dimension-true for BOQ).  
8. **Part plan === mesh children** (names, order, sizes m, positions).  
9. **No designer static GLB**; generated paths only `catalog-assets/generated/*`.  
10. **Materials:** toe slightly darker same family; oak vs white distinct.  
11. **Honest residual** written (no handles, no side reveals, not photoreal).  
12. **Evidence pack** complete under `results/planner/world-standard-wave/08-mesh-quality/`.

### 2.3 Fail means (explicit anti-patterns)

| Fail | Why it kills W7 |
|------|-----------------|
| Single `BoxGeometry` furniture | Apology box |
| Door floor-to-top covering kick | Base unreadable |
| Toe stacked on full-height carcass | Height lie; BOQ envelope lie |
| plan missing `toe` while mesh has it | Export/G4/G5 drift |
| Hand-made `.glb` from `public/` for pretty PNG | Policy + ethics fail |
| Alias rename mid-phase (`plinth`, `toe-kick`) | Agent/test thrash; plan≠mesh |
| Units green, no screenshot graded | Paper PASS |
| Photoreal materials claimed as W7 | Wrong metric |

### 2.4 Out of scope (do not “helpfully” expand)

- Photoreal materials / PBR packs / cloud renders  
- Full part library (L/U kitchens, hardware SKUs, handles, worktops)  
- Fabric cutover  
- Cloud catalog  
- Designer-authored GLB reintroduction  
- Non–cabinet-v0 SKUs  
- Writes under `site/public/**` product trees  
- Claiming W1–W6/W8 from this phase  
- Depending on P07 browser green to close CP-08 (headless default is OK)  
- R3F `<Canvas>` rewrite of open3d viewer mid-gate  

### 2.5 Success metric hierarchy (binding product truth)

```
BOQ / quote path  >  readable manufacturer parts  >  pretty noise / photoreal
SKU mm truth      >  free-scale prop catalog
plan === mesh     >  “looks fine in one camera”
NOTES + PNG       >  “tests passed so ship”
```

SYNTHESIS + ENGINE-DECISION + export/BOQ slice all agree: **do not race Homestyler on 4K**.

---

## 3. Industry pattern library → O&O translation (from `D:\websites`)

### 3.1 SYNTHESIS (world-standard 2026-07-09)

| Industry pattern | O&O translation (original) | P08 relevance |
|------------------|----------------------------|---------------|
| 2D structure then decorate | Walls/openings first; inventory second | Context only (P07) |
| Instant 2D↔3D | Same document UUIDs; orbit | Context (P04) |
| Drag catalog furniture | Place + snap | Context (P07) |
| Select + transform | Hit-test + Delete | Context (P03) |
| Save that returns | IDB + honest labels | Context (P06) |
| **Catalog is the product** | Real O&O SKUs + Block2D + **modular mesh quality bar** | **P08 core** |
| BOQ/quote | Differentiator; not photoreal first | Mesh must not corrupt mm envelope |

**Anti-copy:** No competitor JS, GLB, icons, screenshots in repo.

### 3.2 ENGINE-DECISION — mesh row

| Layer | Decision | Rationale |
|-------|----------|-----------|
| Mesh | **modular-cabinet-v0 quality bar first** | **IKEA-like product depth > generic box library** |
| Catalog | Manufacturer SKU first | IKEA wins this parameter |
| 3D | Three + R3F family | Keep; no Unity; open3d ships **imperative Three** (expert fix) |
| Non-goals now | Photoreal 4K, multiplayer CRDT, LiDAR/AR | Explicit |

**Implication for W7:** Engine choice is settled. Mesh quality is a **content/procedural geometry** problem, not “switch engines.” 01-engine report: *“Mesh quality is a content + LOD problem, not a switch to Homestyler’s stack problem.”*

### 3.3 MASTER-CHART — mesh / SKU / BOQ

| Parameter | #1 | O&O research live | Steal **pattern** |
|-----------|----|-------------------|-------------------|
| Mesh / symbol quality | Homestyler / Foyr | **1** (research chart) | Readable 2D symbols + **multi-part mesh** |
| Inventory SKU truth | **IKEA** | strategy high / UX mid | Real article + fixed module |
| BOQ / buy / quote | **IKEA** | 2 | Catalog → order/quote |

O&O overall research ~**2.0** — spine, not ship. Mesh column is the **worst symbol of “demo of boxes.”**

### 3.4 Engine slice mesh scores (01-engine SCORES.csv)

| Product | mesh |
|---------|-----:|
| Homestyler | 5 |
| Foyr Neo | 5 |
| Planner5D | 4 |
| IKEA | 4 |
| Floorplanner | 3 |
| RoomSketcher | 3 |
| Sweet Home 3D | 2 |
| **O&O live (research)** | **2** |

**Winners of mesh prettiness ≠ winners of manufacturer trust.** O&O targets **IKEA-class product depth** with **procedural multi-part mesh**, not Homestyler materials.

### 3.5 IKEA public planner — manufacturer depth (PRIMARY for P08)

Evidence: `ikea.com/planner-public/report/INSPIRATION.md` + kitchen landing raw.

#### Patterns (abstracted — do not clone brand/UI)

1. **Split architecture:** hub → room planners | **product/system planners** | human services | optional 3D home.  
2. **Product-system configurators** for modular systems (frames, interiors, doors, finishes) — not freeform art alone.  
3. **Design = composition of real catalog items** → durable design → PDF / expert handoff / item list.  
4. **Self-serve first, assisted ladder second.**  
5. **Desktop honesty** for heavy kitchen tools (hub: kitchen planner not mobile-compatible).  
6. **SKU truth lives inside tools** (landings sell capability, not full SKU grids).

#### O&O translation (from IKEA pack — manufacturer north star)

| Market pattern | O&O |
|----------------|-----|
| Product-system configurators | One configurator / series on **O&O SKUs** |
| Design → products | Configuration → **BOQ → quote** |
| Photoreal room theater | **Deprioritize** |
| Catalog truth | SKU master is truth; planner never invents non-catalog parts |

**P08-sized slice of that north star:**  
A single modular product family (**cabinet-v0**) must **look like a product** in 3D: **toe / carcass / door** readable. That is the minimum “manufacturer depth” bar before any finish matrix or full kitchen system.

#### Fence (hard)

- No IKEA brand, blue/yellow, product names, photography tropes, copy, planner embeds.  
- If a design review feels “too close,” change structure/visual/copy until only JTBD remains similar.

#### Scrape honesty

- Landings only; **no live kitchen canvas internals**.  
- Services page 404.  
- Confidence **high** for IA/positioning; **low** for in-tool constraint UX; **none** for unscraped services page.  
- Do not over-claim IKEA toe-kick geometry from marketing pages — O&O formulas are **original locked numbers**, not reverse-engineered IKEA meshes.

### 3.6 Inventory slice (03) — why mesh and SKU are siblings

IKEA wins **variants** and **sku_mm**. Pattern for O&O:

1. Catalog row = **SKU + brand + mm envelope + Block2D + mesh**  
2. Fixed-size branded by default  
3. Variants change **line items**, not free paint  
4. BOQ consumes same SKU IDs as place  

**P08 does not implement full variant matrix.** It makes the **mesh leg** of that catalog row honest for cabinet-v0 so place→3D does not apologize.

Anti-patterns to avoid forever:

- Million generic props, zero order codes  
- Free W/D/H on sellable SKUs without custom flag  
- Image-to-3D as catalog strategy  
- Variants as pure material paint  

### 3.7 Export / BOQ slice (06) — why height integrity is commercial

IKEA pattern: **items list with live retail pricing**; multi-part PDF (summary + items + views). Not photoreal arms race.

O&O wedge: **INR + GST BOQ + branded PDF + quote cart**.

**Mesh implication:** If toe is stacked and total height overshoots SKU `heightMm`, the 3D silhouette **lies** relative to the BOM dimension. Height integrity is not aesthetics — it is **trust**.

### 3.8 O&O self-score (07) — mesh deficit

Research self-score **mesh_symbol ~2**:

- Procedural stacked boxes / modular multi-box  
- Designer static GLB correctly banned  
- G8 GLB load incomplete  
- Honesty: boxes until mesh polish  

Top deficit #3: *“Mesh + plan symbols below manufacturer bar… Correct policy (no designer GLB) does not yet yield good generated mesh.”*

**P08 is the fix for the 3D half of that sentence for cabinet-v0.** (P05 owns Block2D symbols.)

### 3.9 Competitor pack reports — mesh-relevant distillates

#### Planner5D

- Hybrid Canvas/SVG 2D + Three/WebGL 3D class bar for **hybrid web engine**.  
- Catalog mesh **adequate** (score 4), not Homestyler photoreal.  
- Packages inspiration: `three`, loaders, `earcut` for **floor** meshes — furniture still **our catalog**.  
- Ethics: do not scrape catalog meshes/textures.  
- **O&O take:** Continuity + place UX ideas; **not** their furniture GLBs. Mesh bar is **our modular**.

#### RoomSketcher

- Plan accuracy / measure winner.  
- Mesh score **3** — solid 3D, not photoreal-first.  
- Prefer catalog size near real size for better 3D (thin tip).  
- **O&O take:** Dimension honesty culture; mesh mid-tier is **OK if plan is true** — aligns with BOQ-first.

#### Floorplanner

- 260k+ library marketing; drag-drop; **branded items fixed size**.  
- Mesh mid-tier; orbital vs walkthrough camera paradigms.  
- Enterprise private libraries.  
- **O&O take:** Fixed-size SKU discipline; private manufacturer library later. Mesh polish optional relative to library scale — O&O scale is small, so **each mesh must read**.

#### Homestyler

- Mesh/presentation **winner family**.  
- Draw → Decorate → Visualize; cloud photoreal differentiator.  
- Forum: five-zone editor; custom kitchen/wardrobe modeling for power users.  
- **O&O take:** **Do not set W7 success = Homestyler stills.** Stealing “readable furniture in 3D” is OK; stealing materials library is not.

#### 3dplanner.com

- **Parked domain for sale.** Zero inspiration. Do not expand scrape.

#### O&O render options (canvas/SVG)

- Critical architecture honesty: **2D path ≠ 3D mesh path**.  
  - Inventory preview: Block2D → SVG markup  
  - Canvas furniture: footprint path only  
  - Asset-engine: compile pipeline  
  - 3D: procedural modular / optional generated GLB  
- P08 must not try to “fix 2D by changing mesh” or vice versa beyond footprint envelope stability.

### 3.10 OEM systems scrapes (Steelcase, Haworth, HON, Featherlite)

**What they give:** Marketing language of **modular workstations**, series portfolios, specification/planning showrooms, GSA/education/healthcare verticals, dealer partnerships.

**What they do not give:** Procedural mesh formulas, toe heights, door thickness standards for O&O code.

**Translation for manufacturer bar:**

| OEM signal | O&O mesh bar translation |
|------------|--------------------------|
| Series / modular systems | cabinet-v0 as **first modular family** with named parts |
| Spec / planning / dealer | Readable 3D for facilities buyer review before quote |
| Portfolio photography | **Not** a license to ship lifestyle GLBs; residual honesty: simple materials OK |
| India OEM (Featherlite) | Local B2B install quality narrative supports **BOQ + install-ready dimensions** over viz theater |

Featherlite office-furniture scrape hit a 404 on one URL — honesty: thin secondary signal only.

### 3.11 Pattern library summary for W7 only

```
Manufacturer depth (IKEA-class idea)
    → real SKUs + fixed mm + configurator parts
         → for v0: procedural multi-part mesh (toe/carcass/door)
              → readable silhouette + height integrity
                   → same part list for runtime + G4 plan + G5 binary
                        → BOQ envelope (outer W×D, heightMm) never lies
```

---

## 4. Plans/Research routing for P08

From `Plans/Research/RESEARCH-MAP.md`:

| Phase / gate | Open first (ideas) | Then translate to O&O | Evidence lands in |
|--------------|--------------------|----------------------|-------------------|
| **P08 / W7** | **IKEA manufacturer-depth idea; mesh bar not photoreal** | modular cabinet-v0 readable parts | **`08-mesh-quality/`** |

Binding summary row:

| Industry pattern | O&O translation | Gate |
|------------------|-----------------|------|
| Manufacturer depth (IKEA-class) | cabinet-v0 modular bar + SKU truth | P08 / W7 |
| Catalog is the product | Real O&O SKUs + Block2D + modular mesh quality | P05 + P08 |

**Research ≠ pass:** Opening inspiration MDs does not green CP-08. Only `results/planner/world-standard-wave/08-mesh-quality/` artifacts do.

Historical 2026-07-05 synthesis (packages/UI) is **not authoritative** for mesh geometry. When conflict: **2026-07-09 world-standard wins**.

---

## 5. Phase pack dissection (`Plans/phases/P08-mesh-quality/`)

### 5.1 README

Minimal index: execute card, program INDEX, EXPERT-PASS. Files: P08-mesh-quality.md, P08-suggestions.md, README.md (plus co-located `03-r3f-3d.md` expert essay).

### 5.2 Expert pass P0 (top of execute card + 03-r3f-3d + EXPERT-PASS)

Must-fix mesh:

1. Default slab children exact order: **`toe` → `carcass` → `door-slab`** (pair adds door-left/right).  
2. Height integrity: Box3 span ≈ `heightMm`; toe **replaces** carcass bottom.  
3. Doors track **carcassH**, not full `h`.  
4. plan === mesh; GlbExport **imports** constants; blast tests same landable slice.  
5. Stay **imperative Three** / procedural cabinet-v0 — no designer GLB, no photoreal race, no R3F rewrite for pretty PNG.  

Expert essay verdict: **FIX** (plans ready; product must prove W7 with evidence). Not BLOCK. Not SHIP from plan alone.

### 5.3 Architecture (execute card)

```
ModularCabinetV0Options (JSON)
        │
        ├─ generateCabinetV0Footprint → 2D path (outer W×D)
        ├─ generateCabinetV0Mesh → THREE.Group (runtime)
        └─ buildModularCabinetV0PartPlans → pure metres part list (G4)
                 └─ exportModularGlbBinary (G5) under catalog-assets/generated/*
```

Viewer path: `createSceneObjectFromNode` when `geometryMode === "modular-cabinet-v0"`.  
Policy: `glbAssetPolicy` / `assertNoDesignerStaticGlb`.

### 5.4 Honesty baseline in plan (2026-07-09) vs live code (2026-07-10)

| Plan claim (2026-07-09) | Live re-proof (2026-07-10) |
|-------------------------|----------------------------|
| Mesh = carcass + optional door only | **FALSE now** — toe present in `generateCabinetV0Mesh` |
| No toe / plinth / kick | **FALSE now** — child `name: "toe"` |
| Counts none=1, slab=2, pair=3 | **FALSE now** — helpers return **2 / 3 / 4** |
| Duplicate `DOOR_THICKNESS_MM` in GlbExport | **FALSE now** — import from modularCabinetV0 |
| Evidence dir missing | **Still true at report time** — no root `results/` tree found |
| Unit suite asserts quality bar | **TRUE now** — extensive toe/geometry/Box3 tests exist |

**Executor implication:** Do **not** blindly re-run Task 03 “implement toe” as if greenfield. Run Task 00–01 + **verify** Task 02/03 against live tree; update only if drift; **finish Task 04–06 evidence** if units already green.

### 5.5 Suggestions applied (S1–S10) — still normative

| ID | Suggestion | Status in plan |
|----|------------|----------------|
| S1 | Lock name exact `toe` | Normative |
| S2 | Blast-radius tests in-scope | Named in touch list |
| S3 | Freeze size/position formulas | In quality bar |
| S4 | Default visual smoke = headless | Task 04 |
| S5 | Height integrity Box3 | Unit requirement |
| S6 | Skills / authority / ethics | Header |
| S7 | No `site/public/**` mesh dump | Explicit |
| S8 | run.json minimum schema | Task 05 |
| S9 | Evidence folder name fixed | `08-mesh-quality/` |
| S10 | Child order locked | Tests + bar |

### 5.6 Task map (execute sequence — for implementation agents later)

| Task | Intent | Artifacts |
|------|--------|-----------|
| **00** | Evidence shell + baseline vitest log | dir + `vitest-baseline-raw.log` optional |
| **01** | **NOTES.md** bar doc | Required for CP-08 |
| **02** | TDD red (if code lacked toe) | `vitest-red-raw.log` preferred |
| **03** | Green mesh + blast updates | code + `vitest-raw.log` |
| **04** | Visual smoke (default headless) | PNGs + `visual-smoke.md` |
| **05** | Non-reg + run.json | `vitest-nonreg-raw.log` + `run.json` |
| **06** | CP-08 closeout | checklist complete |

**If mesh already green:** Tasks 02–03 become **verification + blast re-run**, not rewrite. Tasks 01/04/05/06 remain mandatory for gate.

### 5.7 Primary files touch list (still correct paths)

| Role | Path |
|------|------|
| Runtime mesh + footprint | `site/features/planner/open3d/catalog/modularCabinetV0.ts` |
| Pure part plan G4 | `…/modularCabinetV0GlbExport.ts` |
| Scene factory | `…/3d/createSceneObjectFromNode.ts` |
| G5 binary | `…/asset-engine/mesh/exportModularGlbBinary.ts` |
| Policy | `…/lib/glbAssetPolicy.ts` |
| Stages note | `…/asset-engine/stages.ts` |
| Units primary | `modularCabinetV0.test.ts`, `modularCabinetV0GlbExport.test.ts`, footprint resolver |
| Blast | `createSceneObjectFromNode.test.ts`, `modularPlaceMesh.test.ts`, `meshStages.test.ts` |

### 5.8 Agent split (max 2)

| Agent | Owns | Must not |
|-------|------|----------|
| A — TDD mesh | 02–03 units + blast | Browser chrome / other SKUs / public GLB |
| B — Visual + NOTES | 01, 04, 06 packaging | Rewrite mesh without re-running A’s units |

Both: superpowers; no worktrees; W0 unlocked for product work.

---

## 6. Normative geometry (locked formulas — original O&O numbers)

Constants (export from mesh module; import in GlbExport — single source of truth):

| Constant | Value | Meaning |
|----------|------:|---------|
| `TOE_HEIGHT_MM` | **100** | Toe / base band height |
| `TOE_INSET_MM` | **50** | Front recess of toe (depth reduced, back-aligned) |
| `DOOR_THICKNESS_MM` | **18** | Door slab thickness |
| `MM` | **0.001** | mm → metres |

Let:

- `w = widthMm * MM`, `d = depthMm * MM`, `h = heightMm * MM`  
- `toeH = TOE_HEIGHT_MM * MM`, `inset = TOE_INSET_MM * MM`  
- `carcassH = h - toeH`, `doorT = DOOR_THICKNESS_MM * MM`  
- `carcassY = toeH + carcassH/2`

| Part | sizeM | positionM | Notes |
|------|-------|-----------|-------|
| **`toe`** | `{ x: w, y: toeH, z: d - inset }` | `{ x: 0, y: toeH/2, z: -inset/2 }` | Back-aligned recess; front kicks under door |
| **`carcass`** | `{ x: w, y: carcassH, z: d }` | `{ x: 0, y: carcassY, z: 0 }` | Sits **on** toe; not full `h` |
| **door-slab** | `{ x: w*0.96, y: carcassH*0.92, z: doorT }` | `{ x: 0, y: carcassY, z: d/2 + doorT/2 }` | Height tracks carcass; z on front face |
| **door-left / door-right** | leafW `w*0.47`, leafH `carcassH*0.92`, doorT | x ± `(leafW/2 + 0.005)`, y `carcassY`, z same as slab | Pair gap ±0.005 m |

**Height integrity:** `Box3.setFromObject(group)` → `max.y - min.y ≈ h`; `min.y ≈ 0` (floor origin).

**Footprint (2D):** centered outer rectangle for default 600×580:

```
M -300 -290 L 300 -290 L 300 290 L -300 290 Z
```

Outer envelope must remain dimension-true for BOQ even if future optional front-edge marks appear.

### 6.1 Part-count matrix (post-bar)

| `doorStyle` | Parts | Names (order) |
|-------------|------:|---------------|
| `none` | **2** | `toe`, `carcass` |
| `slab` | **3** | `toe`, `carcass`, `door-slab` |
| `pair` | **4** | `toe`, `carcass`, `door-left`, `door-right` |

### 6.2 Materials (v0)

| Part | Family | Distinctive rule |
|------|--------|------------------|
| carcass / door | oak `#c4a574` or white `#f3f4f6` | oak ≠ white hex |
| toe | darker same family oak `#a88858` / white `#d1d5db` | band readable without texture maps |
| roughness | toe slightly higher roughness | subtle; not PBR showpiece |

### 6.3 Default options (smoke + default place)

| Field | Default |
|-------|--------:|
| widthMm | 600 |
| depthMm | 580 |
| heightMm | 720 |
| doorStyle | `slab` |
| material | `white` |

Group name: `modular-cabinet-v0`.  
`userData.modular = "cabinet-v0"` + options snapshot.

---

## 7. Approaches for CP-08 completion (brainstorm — pick one)

Research + phase + live code imply **three residual strategies**. Only one is recommended.

### Approach A — **Evidence finish on live mesh** (RECOMMENDED)

**Assume:** live modularCabinetV0 already matches normative bar.  
**Work:** NOTES → vitest raw → headless PNG smoke → nonreg → run.json → CP-08 grade.  
**Touch code only if** blast tests or drift found.

| Pros | Cons |
|------|------|
| Matches “verify repo facts” culture | If units are lying or incomplete, discovery late |
| Fastest path to honest W7 | Requires actual headless PNG pipeline if missing |
| Avoids rewrite thrash | Must re-read code; not trust plan’s “no toe” baseline |

### Approach B — **Full red→green mesh rewrite as if Task 02/03 virgin**

Re-implement toe from plan formulas even if present.

| Pros | Cons |
|------|------|
| Ritual TDD story clean | Wasteful if already green; thrash risk |
| Catches silent drift | Merge noise; agent may break good code |

**Reject unless** live geometry fails formulas or units red for wrong reasons.

### Approach C — **Photoreal / designer GLB shortcut**

Load pretty static cabinet for screenshots.

| Pros | Cons |
|------|------|
| Looks good in a PNG | **Ethics + policy fail**; fake W7; BOQ/part plan lie |

**Hard reject.**

### Recommendation

**Approach A.** The manufacturer-depth win is already encoded in procedural parts; the gate fails on **documentation + visual proof + machine-readable run.json**, not on engine choice.

---

## 8. Design of the quality bar (product design, not code)

### 8.1 What a facilities buyer should see in 3 seconds

From a **three-quarter front** view of default white slab 600×580×720:

1. **Darker thin base band** (toe) recessed slightly under the body  
2. **Main rectangular body** (carcass) sitting on that band  
3. **Front door face** slightly proud of carcass front, not covering the toe band  
4. Optional side view: toe **depth shorter** than carcass (inset), so kick reads  

If any of those four fail, CP-08 is red even if all units pass.

### 8.2 Why named children matter beyond cosmetics

- G4/G5 pipelines enumerate parts  
- Tests assert contracts without screenshots  
- Future variants attach finishes to **parts** not one box  
- Debugging “why does export height wrong?” needs part names  

Ambiguous names (`plinth` vs `toe-kick` vs `toe`) create multi-agent flaky green. **One string: `toe`.**

### 8.3 Relationship to 2D symbols (P05)

| Concern | Owner | W7 interaction |
|---------|-------|----------------|
| Plan footprint outer W×D | cabinet-v0 footprint | Must stay true |
| Block2D plan symbol quality | P05 | Separate gate; non-blank PNG ≠ W7 |
| 3D multi-part readability | **P08** | This report |

Do not claim W7 from a nice 2D symbol. Do not claim P05 from a 3D PNG.

### 8.4 Relationship to place journey (P07)

- Place of cabinet-v0 in browser is **optional fidelity** for CP-08.  
- Default smoke is **headless** `generateCabinetV0Mesh` → PNG.  
- If P07 green, optional browser place shot still grades against NOTES — never against a static GLB.

### 8.5 Relationship to orbit (P04)

- Orbit lets a human inspect the silhouette.  
- Expert: stay imperative Three; do not thrash to R3F for mesh pretty.  
- W4 green is **not** required to write NOTES or unit-test geometry; helpful for human optional browser smoke.

### 8.6 Relationship to BOQ / inventory

- Placed modular options feed commercial dimensions.  
- Outer footprint + heightMm must match options.  
- Mesh parts are **not** separate BOQ line items in v0 (still one SKU) — they are **visual trust** that the SKU class is cabinetry, not a prop cube.

---

## 9. Testing strategy (exhaustive — for executors)

### 9.1 Unit contract (primary)

**File:** `modularCabinetV0.test.ts`

| Assertion class | Example |
|-----------------|---------|
| Names + order slab | `["toe","carcass","door-slab"]` |
| Counts | none 2 / slab 3 / pair 4 |
| Toe geometry | h=0.1 m; z=-inset/2; depth = (depthMm-50)*MM |
| Carcass on toe | carcassH = (height-100)*MM; position.y = toeH+carcassH/2 |
| Door above toe | door bottom ≥ toeH; door h tracks carcassH*0.92 |
| Height integrity | Box3 spanY ≈ heightMm*MM; min.y ≈ 0 |
| Materials | oak carcass hex ≠ white |
| Footprint | outer path stable for 600×580 |

**File:** `modularCabinetV0GlbExport.test.ts`

| Assertion class | Example |
|-----------------|---------|
| plan parts names | match mesh order |
| sizes/positions | metres match formulas |
| partCount | matrix 2/3/4 |
| relativePath | under generated marker |
| policy | assertNoDesignerStaticGlb passes |

**File:** footprint resolver — outer envelope regression only.

### 9.2 Blast pack (non-optional for green)

| File | Likely hard-coded risk |
|------|------------------------|
| `createSceneObjectFromNode.test.ts` | child counts/names |
| `meshStages.test.ts` | pair partCount 3→4 |
| `modularPlaceMesh.test.ts` | count helper alignment |

Same landable slice as mesh change if any drift.

### 9.3 Visual smoke (default headless)

Document in `visual-smoke.md`:

- Command (exact)  
- Options: default slab white 600×580×720  
- Camera: three-quarter front + side  
- Checklist vs NOTES: each criterion **yes/no** + one sentence  

PNG names preferred:

- `01-cabinet-v0-three-quarter.png`  
- `02-cabinet-v0-side.png`  

**Fail closed:** still looks like one box → red, return to geometry.

### 9.4 What “unit green without PNG” is

**FAIL for CP-08.** Gate text requires visual + NOTES. Units alone are spine proof, not product bar.

### 9.5 Commands (copy-paste from phase — keep as executor truth)

```powershell
New-Item -ItemType Directory -Force -Path results\planner\world-standard-wave\08-mesh-quality | Out-Null

cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log
```

Non-reg expands blast files (see phase Task 05).

### 9.6 run.json minimum schema

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

## 10. CP-08 hard stop table (grade only with paths)

| Check | Pass condition | Evidence path |
|-------|----------------|---------------|
| **Bar doc** | NOTES defines toe/door/carcass, locked name, numbers, fail modes | `…/08-mesh-quality/NOTES.md` |
| **Unit footprint** | Outer W×D stable | vitest-raw + footprint tests |
| **Unit parts** | slab toe+carcass+door; matrix 2/3/4; plan===mesh; height span | vitest-raw + GlbExport tests |
| **Blast units** | createSceneObjectFromNode + meshStages (+ place) green | nonreg or raw log |
| **Visual smoke** | Human-readable parts; checklist yes; headless OK | PNGs + visual-smoke.md |
| **No designer GLB** | No new static product GLB; policy intact | review + policy tests |
| **Height integrity** | total height = options.heightMm | Box3 unit |
| **Honest residual** | NOTES lists non-photoreal | NOTES section |

**CP-08 green only if every required row has a path.** Missing screenshot = red even if units green.

### Required artifacts checklist

| Artifact | Required |
|----------|----------|
| `NOTES.md` | Yes |
| `vitest-raw.log` | Yes |
| `run.json` | Yes |
| `01-cabinet-v0-three-quarter.png` (or NOTES-named) | Yes |
| `02-cabinet-v0-side.png` | Yes |
| `visual-smoke.md` | Yes |
| `vitest-nonreg-raw.log` | Preferred |

---

## 11. NOTES.md skeleton (executor fills — content already known)

When Task 01 runs, NOTES must include **no empty placeholders**:

1. **Gate** — W7 / CP-08 wording  
2. **Pass criteria** — full normative list §2.2 + formulas §6  
3. **Fail criteria** — §2.3  
4. **Part name table** — exact strings + order  
5. **Part-count matrix** — 2/3/4  
6. **Commands** — unit + headless smoke  
7. **Artifacts** — expected filenames  
8. **Honest residual** — no handles, no side reveals, simple MeshStandardMaterial, not photoreal; BOQ path still the north star  
9. **Success metric** — BOQ/quote > photoreal; readable parts beat pretty noise  

Reviewer must grade a screenshot against NOTES without opening the plan file.

---

## 12. False-reverse risks (expert + this brainstorm)

| Trap | Why false | Correct |
|------|-----------|---------|
| Port open3d to R3F because ENGINE says R3F | Product path is imperative Three | Stay `ThreeViewerInner` + OrbitControls |
| Photoreal materials to “pass” W7 | Explicit non-goal | Readable parts win |
| Full-height door after adding toe | Door covers kick | Door on carcassH only |
| Toe additive height | Overshoots SKU | Toe replaces carcass bottom |
| Designer static GLB for PNG | Policy + ethics | Procedural only |
| Alias `plinth` / `toe-kick` | plan≠mesh thrash | Only `toe` |
| Trust plan “no toe” baseline blindly | Code already has toe | Re-proof files |
| Claim W7 from units without PNG | Gate requires visual | NOTES + smoke |
| Expand to all SKUs | Scope creep | cabinet-v0 only |
| Mix evidence into P09 folder | Contaminates gates | Only `08-mesh-quality/` |
| Copy IKEA chrome/product names | Ethics fail | Abstract patterns only |
| Use Homestyler mesh score as target | Wrong product | Manufacturer depth + BOQ |

---

## 13. Cross-phase dependency map

```
P01 product truth ──► what place/mesh path actually is
P02 engine lock ────► Three family kept; no engine thrash for mesh
P03 select/delete ──► independent
P04 orbit ──────────► optional human inspect; not CP-08 hard dep
P05 symbols ────────► 2D Block2D sibling; footprint envelope shared concern
P06 save ───────────► independent
P07 journey ────────► optional browser place of cabinet-v0
P08 mesh ◄────────── THIS GATE
P09 shortcuts ──────► no mesh
P10 handover ───────► indexes 08-mesh-quality evidence
```

**Does not require P07 green.** Headless is default.

**Kill order (EXPERT-PASS):** spine select → journey → save before scarce-slot mesh polish when slots scarce — but when executing P08, finish it completely.

---

## 14. Mesh pipeline honesty (G1–G6 / policy)

Conceptual stages (asset-engine):

| Stage idea | P08 demand |
|------------|------------|
| Procedural runtime mesh | `generateCabinetV0Mesh` includes toe |
| G4 pure plan | `buildModularCabinetV0PartPlans` includes toe; same order/sizes |
| G5 binary | `exportModularGlbBinary` uses runtime mesh + plan; path generated only |
| G8 load | Not required green for CP-08; residual OK |
| Policy | reject designer static paths |

**plan === mesh** is the contract that keeps export from becoming a second lying mesh.

Optional stages.ts one-line honesty: “cabinet-v0 includes toe+carcass+door (W7 bar)” — only if status text would otherwise lie.

---

## 15. What “manufacturer depth” means at v0 (brutal honesty)

IKEA kitchen planner depth includes:

- Cabinet systems (base/wall/high)  
- Fronts, handles, interiors, worktops  
- Bulk finish apply  
- Item list / PDF / purchase path  

O&O **v0 W7** depth includes:

- **One** modular family: cabinet-v0  
- **Three part classes:** toe, carcass, door  
- Two materials oak/white  
- Three door styles none/slab/pair  
- Fixed mm options  
- Readable 3D + true outer footprint  

**Not included at W7:** handles, soft-close, fillers, countertops, snap-to-run kitchen walls, multi-SKU BOM explosion per part.

Anyone claiming “IKEA parity” from W7 is lying. Claiming “no longer apology boxes for the modular SKU we ship” is honest.

---

## 16. Competitor score → O&O action matrix (mesh only)

| Competitor strength | Steal pattern? | O&O action in P08 |
|---------------------|----------------|-------------------|
| Homestyler materials 5 | **No** photoreal | Darker toe only |
| Foyr viz 5 | No | — |
| Planner5D mesh 4 | Continuity/place later | Keep Three family |
| IKEA mesh 4 + SKU 5 | **Yes product depth** | Named parts + SKU mm |
| RoomSketcher mesh 3 | Measure culture later | Height honesty |
| Floorplanner fixed branded sizes | **Yes** | Outer footprint locked |
| O&O research 1–2 | Fix | Multi-part + NOTES + PNG |

---

## 17. Ethics checklist for any mesh work / evidence

- [ ] No competitor GLB, texture, icon, screenshot as product asset  
- [ ] No IKEA / Homestyler / P5D brand in UI or evidence captions  
- [ ] Research paths stay under `D:\websites` — not copied into `site/`  
- [ ] Screenshots are **our** procedural mesh only  
- [ ] Evidence only under root `results/planner/world-standard-wave/08-mesh-quality/`  
- [ ] Never `site/results/` or `site/test-results/`  
- [ ] No Firecrawl re-scrape as routine for this phase  

---

## 18. Implementation decision record (brainstorm freeze)

| Decision | Choice | Why |
|----------|--------|-----|
| Target SKU mesh | cabinet-v0 only | Smallest manufacturer-depth proof |
| Geometry style | Procedural multi-box parts | Policy-safe; no designer GLB |
| Part names | Exact `toe` / `carcass` / `door-*` | Agent + plan stability |
| Toe dimensions | 100 mm H, 50 mm front inset | Locked readable band |
| Door thickness | 18 mm | Existing convention exported |
| Height rule | Toe replaces carcass bottom | SKU height truth |
| Door height basis | carcassH × 0.92 | Kick remains visible |
| Smoke default | Headless Three render | Independent of P07 |
| Engine | Imperative Three path | Expert + live open3d |
| Photoreal | Out of scope | BOQ > pretty |
| Evidence | `08-mesh-quality/` only | Gate isolation |
| Residual | No handles, simple mats | Honesty |

---

## 19. Executor playbook (ordered — no code in this report)

1. **Re-read** live `modularCabinetV0.ts` + GlbExport + unit files (do not trust plan honesty table).  
2. **Create** evidence dir if missing.  
3. **Write NOTES.md** from §2 + §6 + residual.  
4. **Run** primary vitest pack → `vitest-raw.log`.  
5. **Run** blast/nonreg pack → `vitest-nonreg-raw.log`.  
6. If red: fix geometry/tests (TDD); if green: do not thrash.  
7. **Headless smoke** → two PNGs + `visual-smoke.md` graded.  
8. **Write run.json**.  
9. **Self-grade CP-08 table** — fail closed on missing PNG.  
10. Commit slices with honest messages; do not claim world-standard complete — only W7 cabinet-v0 bar.

Commit message shapes (from phase):

- `docs(planner): W7 mesh quality bar NOTES for cabinet-v0 (P08)`  
- `fix(planner): cabinet-v0 toe+carcass+door mesh quality (W7/P08)` (only if code changes)  
- `test(planner): W7 mesh quality evidence pack (P08/CP-08)`  

---

## 20. Residual after CP-08 green (honest backlog — not this phase)

| Residual | Why deferred |
|----------|--------------|
| Handles / pulls | Part count explosion; not needed for silhouette bar |
| Side reveals / panel gaps | Visual polish beyond readable base |
| Soft materials / wood grain textures | Photoreal path |
| Full kitchen systems (base/wall/high, fillers) | Multi-SKU program |
| G8 browser auto-GLB place | Separate pipeline honesty |
| All catalog SKUs multi-part | Only cabinet-v0 is the bar SKU |
| Photoreal cloud renders | Wrong north star |
| Fabric full stage | P02 destination after W gates |

---

## 21. Questions deliberately not asked (goal is clear)

Brainstorming skill prefers Q&A for ambiguous product asks. **Here the product ask is locked by W7 + P08:** readable toe/carcass/door + NOTES + visual. No goal ambiguity remains.

Not reopening:

- Engine family  
- Photoreal vs BOQ priority  
- Whether to clone IKEA UI  
- Whether cabinet-v0 is the right first modular family  

---

## 22. Pushback (brutal — owner should want this)

1. **If evidence is missing, W7 is red** even if the mesh code already looks correct in a casual browser glance.  
2. **If you skip NOTES**, future agents will re-litigate `plinth` vs `toe` and break plan===mesh.  
3. **If you ship only unit green**, you are replaying the spine theater WAVE already called out.  
4. **If you “upgrade” to designer GLB** for a prettier CP-08 screenshot, you destroy the modular policy that makes BOQ-scale catalogs maintainable.  
5. **If you expand P08 to all furniture meshes**, you miss the kill-order and delay spine gates.  
6. **If you chase Homestyler scores**, you abandon the manufacturer wedge research already paid for.  
7. **If plan docs still say “no toe” after code has toe**, someone will re-implement and thrash — **fix honesty baselines during closeout**.

---

## 23. Definition of done (phase P08)

P08 is done when **all** hold:

1. Execute card followed with honest checkboxes (adjusted for live code state).  
2. Cabinet-v0 exposes **`toe` + `carcass` + door** with exact names/order.  
3. Unit footprint + parts + height integrity + blast green under evidence.  
4. Visual smoke PNGs graded against NOTES (headless OK).  
5. CP-08 table fully evidenced under `results/planner/world-standard-wave/08-mesh-quality/`.  
6. No designer static GLB introduced.  
7. Residual honesty written (not photoreal).  

**Next phase after CP-08:** P09 shortcuts/chrome (**W8**), unless owner reorders. Do not mix artifacts.

---

## 24. Absolute path index (quick open)

### Research

- `D:\websites\ikea.com\planner-public\report\INSPIRATION.md`  
- `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\03-inventory\REPORT.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\06-export-boq\REPORT.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md`  
- `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md`  
- `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md`  
- `D:\websites\roomsketcher.com\report\INSPIRATION.md`  
- `D:\websites\floorplanner.com\report\INSPIRATION.md`  
- `D:\websites\homestyler.com\report\INSPIRATION.md`  
- `D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md`  
- `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md`  

### Plans

- `Plans\Research\RESEARCH-MAP.md`  
- `Plans\phases\P08-mesh-quality\P08-mesh-quality.md`  
- `Plans\phases\P08-mesh-quality\P08-suggestions.md`  
- `Plans\phases\P08-mesh-quality\03-r3f-3d.md`  
- `Plans\phases\EXPERT-PASS.md`  
- `docs\superpowers\specs\2026-07-09-world-standard-planner-design.md`  

### Product (verify only)

- `site\features\planner\open3d\catalog\modularCabinetV0.ts`  
- `site\features\planner\open3d\catalog\modularCabinetV0GlbExport.ts`  
- `site\tests\unit\features\planner\open3d\modularCabinetV0.test.ts`  
- `site\tests\unit\features\planner\open3d\modularCabinetV0GlbExport.test.ts`  

### Evidence (create at execute)

- `results\planner\world-standard-wave\08-mesh-quality\`  

### This report

- `Idiots2\P08-mesh-quality\REPORT.md`  

---

## 25. Closing synthesis (W7 in one paragraph)

World-standard research scored O&O mesh as **boxes** and pointed manufacturer planners at **IKEA-class product depth**, not Homestyler photoreal. ENGINE-DECISION froze **modular-cabinet-v0** as the first quality bar. P08 turns that into a **normative contract**: exact part names (`toe`/`carcass`/`door-*`), locked geometry (100/50/18 mm family), height integrity, plan===mesh, no designer GLB, and **proof** via NOTES + headless visual smoke. Live code (2026-07-10) appears to already encode the mesh side of that contract; **CP-08 still fails until evidence lands**. Success is a facilities buyer reading a **real base / body / door** on a real-mm modular SKU — not a prettier cube and not a stolen catalog mesh.

---

*End of BRAINSTORMER 08/10 report. No product code written. Write path: `Idiots2/P08-mesh-quality/REPORT.md` only.*
