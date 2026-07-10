# Idiots2 · P04 — Orbit Continuity (W4) — Exhaustive Brainstorm Report

**Agent:** BRAINSTORMER 04/10  
**Mode:** Research → synthesis only · **NO product code** · **NO implementation**  
**Write path only:** `Idiots2/P04-orbit-continuity/REPORT.md`  
**Date of research pass:** 2026-07-10  
**Gate:** **W4** — 2D↔3D toggle preserves entity pose; **3D orbit enabled by default** with proof  
**Phase folder authority:** `Plans/phases/P04-orbit-continuity/`  
**Design authority:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W4  
**Research home (canonical):** `D:\websites`  
**Evidence home (product proof — not research):** `results/planner/world-standard-wave/04-orbit-continuity/`  

---

## 0. Executive one-pager (read this first)

### What W4 is

A facilities buyer on the open3d planner can:

1. Place furniture in **2D**, switch to **3D**, and see the **same entity ids**, **position (mm)**, and **rotation**.
2. Switch **3D → 2D → 3D** without pose drift or id rewrite.
3. **Orbit** the 3D scene immediately (no hidden “enable orbit” toggle; no orbit-off product default).
4. Leave a **clean console** on the 2D↔3D path.

### What W4 is not

| Out of scope | Why |
|--------------|-----|
| Mesh photoreal / toe-door-carcass bar | **P08 / W7** |
| Save honesty / cloud labels | **P06 / W5–W6** |
| Select / delete / undo | **P03 / W3** |
| Fabric full-stage cutover | Destination later; Approach A does not require it for W4 |
| Walk / first-person camera | Explicit non-goal |
| Camera bookmark across view modes | Non-goal; document is pose authority, not camera |
| Competitor UI clone | Ethics hard ban |
| R3F rewrite of open3d 3D mid-gate | Live path is **imperative Three + OrbitControls** |

### Industry pattern → O&O translation (binding)

| Industry pattern (research) | O&O original translation | Gate |
|-----------------------------|--------------------------|------|
| Instant 2D↔3D from **one document** | Same `Open3dProject` UUIDs; view mode is chrome only | **W4** |
| Orbit as default 3D navigation | `OrbitControls` ON by default + **explicit** workspace prop + `data-orbit-enabled` | **W4** |
| Explicit top-bar 2D \| 3D toggle | TopBar `role="radiogroup"` radios labeled **2D** / **3D** | **W4** |
| Lazy-load 3D on first activation | `Lazy3DViewer` / `ThreeLazyViewer.tsx` | Perf hygiene (already pattern) |
| Dual camera paradigms (orbit vs walk) | **Orbit only** for W4; walk later | Scope freeze |

### Hard three-layer orbit rule (never collapse)

| Layer | Meaning | “Orbit works” claim allowed? |
|-------|---------|------------------------------|
| **1. Code defaults** | `enableControls = true` in Lazy + Inner | Alone: **NO** |
| **2. Workspace wiring** | Product path passes `enableControls={true}` or `{...getOpen3dViewerControlProps()}` | Alone: **NO** |
| **3. Proof** | Unit construct-spy + `data-orbit-enabled` + browser left-drag + console log under `04-orbit-continuity/` | **YES only with layer 3 artifacts** |

Layer-1 alone is how products silently regress: remove the prop, default still “works” until Playwright dies.

### Handover one-liner (phase-aligned)

**W4 = document pose continuity + OrbitControls ON by default with explicit workspace wiring + `data-orbit-enabled`; prove with Vitest under `results/planner/world-standard-wave/04-orbit-continuity/`, then Playwright left-drag + radio toggle; superpowers; no worktrees; commit as you go.**

---

## 1. Mission, constraints, and method

### 1.1 Assigned brief

| Item | Value |
|------|--------|
| Role | BRAINSTORMER 04/10 |
| Output | **Only** `Idiots2/P04-orbit-continuity/REPORT.md` |
| Length | Unlimited / exhaustive W4 |
| Code | **Forbidden** in this pass |
| Superpowers | `/using-superpowers` acknowledged; subagent executes assigned research deliverable |

### 1.2 Mandatory research order (followed)

1. **`D:\websites` FIRST — full deep**  
   Emphasis: **2D↔3D**, **orbit**, **SYNTHESIS**, **ENGINE**, **3D**, **all pack reports**.
2. **`Plans/Research`** (map + historical + product context pointers).
3. **`Plans/phases/P04-orbit-continuity/` ALL**  
   - `P04-orbit-continuity.md`  
   - `P04-suggestions.md`  
   - `01-react-open3d.md`  
   - `03-r3f-3d.md`  
   - `README.md`

### 1.3 What this report is for

- Give **execute agents** a single, dense, phase-scoped brain dump so they do not re-open engine thrash or invent a second continuity model.
- Separate **research ideas** from **repo truth** from **evidence truth**.
- Surface **contradictions** (plan wording vs live code vs expert pass) so implementers do not “fix” rotation into a false-reverse rewrite.
- Encode **anti-J4** browser grammar so W4 Playwright does not copy legacy selectors.

### 1.4 What this report is not

- Not a substitute for `results/…/04-orbit-continuity/` artifacts.
- Not permission to re-scrape competitors.
- Not a re-open of ENGINE-DECISION (Fabric dest / Three family already decided).
- Not P03/P05/P06/P08 scope expansion dressed as “orbit polish.”

### 1.5 Ethics fence (always on)

From `D:\websites\README.md`, every pack report, SYNTHESIS, ENGINE, RESEARCH-MAP:

| Allowed | Forbidden |
|---------|-----------|
| Interaction **patterns** (toggle, orbit default, same-document continuity) | Competitor JS, CSS, GLB, icons, logos, screenshots in product |
| Industry **grammar** (left-drag orbit, top bar 2D\|3D) | Pixel-clone chrome / trade dress |
| Open packages already in O&O stack (Three MIT OrbitControls) | Shipping Planner5D `app.js` / deep bundles |
| Studying Sweet Home 3D dual-view **idea** under license awareness | Pasting GPL algorithms into MIT product without reimplementation policy |

**Firecrawl is dead for routine work.** Packs dated 2026-07-09 are historical ideas only. Do not re-scrape Planner5D or parked 3dplanner.com.

---

## 2. Product why (why W4 exists)

From `Plans/Research/Others/18-PRODUCT-CONTEXT.md` + design north star:

| Fact | Implication for W4 |
|------|---------------------|
| O&O = premium **manufacturer** office furniture planner | Buyer must **trust** that 3D is the same layout as 2D — not a different scene |
| Projects take **days** of recon; scale to **thousands** of workstations | Continuity must be **document-level**, not camera gimmick |
| Vendor stacks cost ~$40k + $10k/yr | Own roadmap; do not rent “pretty 3D” as substitute for pose truth |
| Success = plan accuracy + systems + place + save + **quote path** | W4 is table-stakes for “I can show the room” before BOQ depth |
| Photoreal is **not** the 3–6 month bar | Orbit + continuity beat Homestyler/Foyr render race |

**North star sentence (design spec):**

> A facilities buyer can, without a developer, open the planner, lay out a small office with real O&O-scale furniture, switch **2D↔3D with orbit**, select/edit/delete, save and return the next day, and trust dimensions enough to quote later.

W4 owns the bold clause. Without it, the product feels like two disconnected demos.

---

## 3. Deep research from `D:\websites` (ordered by W4 relevance)

### 3.1 Research home map

| Path | Role for W4 |
|------|-------------|
| `D:\websites\README.md` | Canonical research root; ethics; no E: mirror |
| `research/2026-07-09-world-standard/SYNTHESIS.md` | Instant 2D↔3D + orbit pattern line |
| `research/2026-07-09-world-standard/comparison/01-engine/REPORT.md` | Continuity scoring; hybrid engine winners |
| `research/2026-07-09-world-standard/comparison/ENGINE-DECISION.md` | 3D Three/R3F family + orbit enable |
| `research/2026-07-09-world-standard/comparison/MASTER-CHART.md` | Who wins continuity column |
| `research/from-repo-Plans-Research/RESEARCH-2026-07-05-ui-benchmark.md` | Explicit 2D/3D switch rules; Sketchfab orbit grammar |
| `research/from-repo-Plans-Research/RESEARCH-2026-07-05-ui-plann-compare.md` | Planner5D toggler; Floorplanner continuity |
| `planner5d.com/report/*` | Class bar for web hybrid 2D structure → 3D decorate/orbit |
| `floorplanner.com/report/INSPIRATION.md` | Orbital vs walkthrough; same document |
| `roomsketcher.com/report/INSPIRATION.md` | Continuity marketing; **thin** on exact toggle/orbit |
| `homestyler.com/report/INSPIRATION.md` | Walk/orbit presence; photoreal **not** W4 goal |
| `ikea.com/planner-public/report/INSPIRATION.md` | Manufacturer depth; SKU truth > room theater |
| `3dplanner.com/report/INSPIRATION_REPORT.md` | **Parked** — domain for sale; zero product value |
| `oando-render-options/*` | 2D Canvas vs WebGL failure modes (continuity adjacent) |

### 3.2 SYNTHESIS (world-standard, 2026-07-09)

Source: `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`

| Pattern (industry) | O&O translation |
|--------------------|-----------------|
| 2D structure then decorate | Walls/openings first; inventory second |
| **Instant 2D↔3D** | **Same document UUIDs; prove in browser; orbit in 3D** |
| Drag catalog furniture | Inventory place with snap |
| Select + transform | Hit-test + Delete (P03) |
| Save that returns | IDB + honest labels (P06) |
| Catalog is the product | O&O SKUs + Block2D + modular mesh |
| BOQ/quote | Differentiator — not photoreal first |

**Do not re-scrape:** planner5d.com (covered), 3dplanner.com (parked).

**W4 distillation:** Continuity is a **document identity** problem first, a **camera** problem second. Industry winners share one plan model; mode is a view.

### 3.3 ENGINE comparison (slice 01) — continuity is a scored column

Source: `comparison/01-engine/REPORT.md` + `SCORES.csv`

#### Scoring columns (engine)

| Column | Definition |
|--------|------------|
| 2D engine | Plan draw quality |
| 3D engine | Live 3D camera/lights/materials/walk/orbit feel |
| **2D↔3D continuity** | Same document; structure change appears without rebuild friction |
| Snap/measure | Grid, typed lengths, dimensions |
| Mesh quality | Live view fidelity |
| Perf feel | Mid laptop responsiveness |

#### Scores (continuity highlighted)

| Product | 2D | 3D | **Cont.** | Measure | Mesh | Perf |
|---------|:--:|:--:|:---------:|:-------:|:----:|:----:|
| Planner5D | 5 | 5 | **5** | 4 | 4 | 4 |
| RoomSketcher | 5 | 4 | **5** | 5 | 3 | 4 |
| Floorplanner | 4 | 3 | **4** | 3 | 3 | 4 |
| Homestyler | 3 | 5 | **4** | 3 | 5 | 3 |
| Foyr Neo | 3 | 5 | **4** | 3 | 5 | 3 |
| IKEA | 3 | 4 | **3** | 2 | 4 | 4 |
| Sweet Home 3D | 4 | 3 | **5** | 4 | 2 | 3 |
| **O&O live (research snapshot)** | 3 | 3 | **3** | 3 | 2 | 3 |

#### Winner patterns for W4

| Winner class | Pattern to steal (ideas only) |
|--------------|-------------------------------|
| **Planner5D** | Hybrid Canvas/SVG 2D + Three/WebGL 3D; structure 2D, decorate/orbit 3D; **instant mode toggle** |
| **RoomSketcher** | Plan rigor; marketing claim “changes update in 2D and 3D” |
| **Sweet Home 3D** | Legendary **same-plan dual view** continuity (study algorithm ideas under license; reimplement) |
| **Floorplanner** | Explicit 2D↔3D switch; **orbital** inspect vs walkthrough |

**Overall hybrid web engine:** Planner5D.  
**Overall plan accuracy:** RoomSketcher.  
**Best open dual-view reference:** Sweet Home 3D (patterns only).

#### Recommended stack (aligned with O&O lock)

```
Document model (walls, openings, furniture UUIDs, mm)
        │
        ├─ 2D: FeasibilityCanvas → migrate furniture layer to Fabric stage later
        │      structure + measure stay document-driven
        └─ 3D: Three / R3F family from same document (extrude + place)
```

**Critical W4 note from ENGINE + expert 3D pass:**  
ENGINE-DECISION says “Three + R3F.” Live **open3d product 3D path** ships **imperative Three + OrbitControls**, not R3F `<Canvas>` inside Lazy3DViewer. Treat R3F as **family / destination language**, not a mid-W4 port mandate. Porting open3d to R3F mid-gate is a **false-reverse risk** (`03-r3f-3d.md`).

### 3.4 ENGINE-DECISION record

Source: `comparison/ENGINE-DECISION.md`

| Layer | Decision | W4 relevance |
|-------|----------|--------------|
| 2D destination | Fabric.js v7 full stage | Not required to close W4 |
| 2D bridge | FeasibilityCanvas | **Live 2D host for pose** |
| 3D | Three + `@react-three/fiber` | Family lock; orbit enable |
| Orbit | **Enable** | **Core W4** |
| Admin asset | model-viewer | Not W4 |
| Hybrid ban | No Konva+Fabric simultaneous | Do not thrash engines for continuity |
| Mesh | modular-cabinet-v0 first | P08 |
| Catalog | Manufacturer SKU first | Identity of placed entities |
| Non-goals now | Photoreal 4K, multiplayer CRDT, LiDAR/AR | Keep out of W4 |

### 3.5 MASTER-CHART — continuity column in context

Source: `comparison/MASTER-CHART.md`

| Parameter | #1 Winner | O&O research score | Steal pattern |
|-----------|-----------|--------------------|---------------|
| **2D↔3D continuity** | RoomSketcher / Floorplanner | **3** | Same doc, live dual view |
| 3D visualization | Homestyler / Foyr / P5D | 2 | Presence + orbit; defer photoreal |
| Mesh / symbol quality | Homestyler / Foyr | 1 | Readable symbols + multi-part mesh later |

**O&O overall ~2.0** in research snapshot = “spine only — not ship.” W4 is one of the gates that moves continuity from “partial” to “proven.”

Locked stack diagram (MASTER):

```
Document (UUID, mm)
  ├── 2D: Fabric full stage (target) / Feasibility interim
  ├── 3D: R3F + Three + orbit
  ├── Catalog: real O&O SKUs + Block2D + modular mesh
  └── Persist: IDB → Supabase plans (member)
```

For W4 execute: **document + Feasibility + Three orbit path** only.

---

## 4. Competitor pack digests (patterns only → W4 translation)

### 4.1 Planner5D (primary web hybrid bar)

**Reports:**  
`INSPIRATION_REPORT.md`, `TOOLBARS.md`, `DEEP_STACK_AND_PACKAGES.md`, `PACKAGES_INSPIRATION.md`, `ETHICS_AND_INSPIRATION.md`

#### Product loop (inspiration)

1. Template or blank  
2. **Structural 2D** — walls, doors, windows  
3. Furnish — catalog  
4. **3D preview / toggle**  
5. Export / share (later for O&O)

FAQ workflow explicit: **2D for walls/doors/windows/measurements → 3D for furniture/textures**.

#### Chrome zones (pattern, not clone)

```
TOP BAR: project · share · 2D|3D · camera/render · account
LEFT tools | CENTER canvas (2D plan / 3D view) | RIGHT catalog/props
BOTTOM / status
```

**W4 mapping:** O&O already uses TopBar radiogroup **2D | 3D**. Do not copy P5D red FAB, Smart Wizard branding, or render camera tiers.

#### Stack signals (hiring + CDN fingerprints — ideas only)

| Signal | Observation |
|--------|-------------|
| Jobs | TypeScript, Canvas/SVG 2D, **Three.js / WebGL** 3D |
| Bundles | Proprietary minified `app.js` (~17MB) — **never ship** |
| Vendors | jQuery legacy, hammer, tippy — do not adopt for legacy reasons |
| Fail path | “3D mode not supported” → upgrade browser |

**O&O package translation:** Keep `three` + OrbitControls (MIT examples path). Optional R3F elsewhere. Lazy-load 3D chunk.

#### 3D tools they market (out of W4 minimum)

- 360 walkthrough + WASD  
- Async 4K renders gallery  
- AR/VR / Vision Pro  

**W4 keeps:** live orbit inspect. **Defers:** walkthrough product, photoreal queue.

#### Ethics from pack

No app.js, no brand, no catalog meshes, no editor HTML/CSS clone. Toolbar mock under research is layout study only.

### 4.2 Floorplanner (orbital vs walk; same document)

Source: `floorplanner.com/report/INSPIRATION.md` (manual-grade scrapes)

#### 3D navigation pattern (high value for W4)

| Mode | Intent | W4 decision |
|------|--------|-------------|
| **Orbital** | Inspect from above / around (dollhouse overview) | **Ship as product default** |
| **Walkthrough** | Eye-level in rooms | **Defer** |

Additional 3D settings (ceilings, shadows, floors below, hide closest walls) are **product polish later**, not W4 gates.

#### Continuity pattern

- One document, two camera paradigms, **explicit 2D↔3D switch**.  
- Edit in 3D is secondary; Approach A needs **select continuity + orbit**, not full 3D authoring.

#### O&O translation table (from pack, W4 rows)

| Floorplanner pattern | O&O action | Gate |
|----------------------|------------|------|
| 2D↔3D same document | Toggle preserves entity poses; no re-author | **W4** |
| Orbital 3D inspect | Orbit ON in Three viewer (default product 3D) | **W4** |
| Walkthrough | Defer | — |
| Photoreal / 8K / VR | Out of Approach A | — |

#### Anti-copy

No Floorplanner chrome, mega-tabs, Floxi branding, FML reverse-engineer, library assets. Prior O&O research already REJ’d Build/Decorate/Furnish mega-tab trade dress.

### 4.3 RoomSketcher (continuity claim; thin orbit docs)

Source: `roomsketcher.com/report/INSPIRATION.md`

#### 2D↔3D section honesty

| Pattern | Evidence strength | Note |
|---------|-------------------|------|
| Single project → both 2D and 3D | Medium marketing | “Changes update instantly in both 2D and 3D” |
| Generate / show after layout | Medium | Funnel step |
| 3D snapshots from camera aim | Medium | Separate product from live orbit |
| Live walkthrough / 360 / AI photoreal | Marketing only | **Out of W4** |

**Explicit gap from pack:** Scrapes do **not** document exact 2D/3D toggle, orbit controls, or pose-preservation behavior. **W4 must be designed O&O-native**, not reverse-inferred from RoomSketcher chrome.

#### Gate mapping row (pack)

| Gate | Competitor pattern | O&O action |
|------|--------------------|------------|
| **W4** | Same project drives 2D and 3D; camera snapshot separate | Toggle keeps entity poses; Orbit in ThreeViewerInner; clean console; no Live3D/360/AI |

**Strong pack value for other gates** (measure, doors, select) — not the primary W4 control design source.

### 4.4 Homestyler (3D presence winner; not continuity king)

Source: `homestyler.com/report/INSPIRATION.md`

| Signal | W4 takeaway |
|--------|-------------|
| Five-zone editor shell | Industry IA; O&O already has workspace zones |
| 3D / walk: arrows + WASD + **left-drag look** | Left-drag as primary 3D pointer grammar aligns with OrbitControls rotate default |
| Cloud rendering one-click | **Do not** make W4 “done” = photoreal |
| Scrape quality | Marketing + forum; no live editor DOM — do not invent their orbit API |

MASTER scores Homestyler high on **3D/mesh**, only mid-high on continuity. O&O should chase **presence + orbit feel**, not material library.

### 4.5 IKEA public planners (manufacturer bar — not orbit bar)

Source: `ikea.com/planner-public/report/INSPIRATION.md`

| Pattern | W4 relevance |
|---------|--------------|
| Product-system configurators | Placed entities must remain **SKU-true** across 2D↔3D (id + pose) |
| Design → products → document | Continuity is commercial trust, not vanity 3D |
| Photoreal scan / home design | **Deprioritize** vs configuration + BOQ |
| Mobile caveats honesty | Device policy honesty > broken canvas (adjacent product honesty culture) |

IKEA wins **BOQ/SKU** columns, not web hybrid continuity. Still reinforces: **3D must show the same catalog instances**.

### 4.6 3dplanner.com — parked dead end

Source: `3dplanner.com/report/INSPIRATION_REPORT.md`

| Check | Result |
|-------|--------|
| Product site? | **No** — HugeDomains parking / for sale |
| Inspiration for W4? | **Zero** |
| Policy | SYNTHESIS + RESEARCH-MAP: **do not prioritize**; do not re-scrape |

### 4.7 O&O render options (failure modes adjacent to continuity)

Source: `oando-render-options/CANVAS_RENDER_OPTIONS.md`

| Layer | API | Failure mode relevant to W4 |
|-------|-----|------------------------------|
| 2D plan | Canvas 2D | Blank 2D ≠ 3D continuity bug |
| 3D viewer | WebGL | WebGL blocked / context lost → need honest fallback, not silent orbit claim |
| Hybrid / split | Both | Dual context limits; open3d uses **mode switch unmount** rather than forced dual live contexts |

**W4 architecture choice (product):** View mode **unmounts** 3D when returning to 2D. That is intentional. Continuity is **document remount rebuild**, not dual-viewport camera lock.

### 4.8 UI benchmark (2026-07-05) — 2D/3D switch rules

Source: `research/from-repo-Plans-Research/RESEARCH-2026-07-05-ui-benchmark.md`

#### Rules table (industry)

| Rule | Evidence class |
|------|----------------|
| **Explicit toggle in top bar** — not implicit camera drift | Planner 5D 3D Mode help; Floorplanner embed API view |
| **Lazy-load 3D on first activation** | Perf best practice |
| **Preserve selection, floor, units, object IDs, camera intent** | PHASE-2 §4 class requirements |
| Edit properties in both modes where sensible | P5D catalogue tip |
| Loading progress + fallback on 3D activation | PHASE-2 §4 |

#### Sketchfab navigation grammar (ideas)

- Standard **orbit / pan / zoom**  
- Optional walk/WASD later  
- Recenter / focus on geometry  

**O&O mapping:** Orbit default; custom chrome (Phosphor + tokens); no Sketchfab watermark layout.

#### Performance budgets (aspirational for journey phases)

| Budget | Value |
|--------|-------|
| First usable 2D | ~2.5s |
| 3D after activation | ~4s |
| Frame target | 60fps target / 45fps floor |

W4 unit work does not require meeting these; browser journey should not ignore black screens.

### 4.9 UI plann-compare — continuity already named in older program

Source: `RESEARCH-2026-07-05-ui-plann-compare.md`

- Planner 5D: **2D/3D toggler; continuous editing across modes**.  
- Floorplanner: 2D canvas dominant; 2D/3D toggle; drag-drop furnish.  
- PHASE-2 owns “3D continuity”; lazy load exists; mode switch already exposed in older plans.  

**Historical note:** Older plann PHASE language may mention R3F memory / camera intent. **P04 expert lock overrides:** open3d W4 does **not** require camera bookmark; entity pose on document only.

### 4.10 Packages research (3D stack keep)

Sources: `RESEARCH-2026-07-05-packages.md`, `packages-plann-compare.md`

| Package | Role | Decision class |
|---------|------|----------------|
| `three` | 3D engine | Keep |
| `@react-three/fiber` | React 3D (elsewhere / family) | Keep family; open3d viewer may stay imperative |
| `@react-three/drei` | Helpers | Tier discipline; not required for basic OrbitControls |
| OrbitControls | `three/examples/jsm/controls/OrbitControls.js` | **W4 navigation** |

Browser-only: `'use client'` + dynamic import / lazy viewer for 3D.

---

## 5. Plans/Research layer (repo index + routing)

### 5.1 RESEARCH-MAP routing for P04 / W4

Source: `Plans/Research/RESEARCH-MAP.md`

| Phase / gate | Open first (ideas) | Translate to O&O | Evidence (not research) |
|--------------|--------------------|------------------|-------------------------|
| **P04 / W4** | Instant 2D↔3D pattern (SYNTHESIS) | Same UUIDs + orbit ON proof | `04-orbit-continuity/` |

Pattern library row:

| Industry pattern | O&O translation | Phase / gate |
|------------------|-----------------|--------------|
| Instant 2D↔3D | Same document UUIDs; browser proof; orbit in 3D | **P04 / W4** |

**Critical map rule:** Research folders are **not** evidence folders. WAVE.md “no orbit” is starting debt — re-verify against code. Scores are decision aids, not live product truth.

### 5.2 Engine decision echo (map)

| Layer | Decision |
|-------|----------|
| 3D | Three + R3F + **orbit ON** |
| Non-goals | Photoreal 4K, multiplayer, LiDAR/AR |

### 5.3 Others/ product + honesty culture

- `18-PRODUCT-CONTEXT.md` — manufacturer systems, not free GLB dump.  
- `20-ELON-STANDARD.md` → points at `Agents/Agents-ELON-STANDARD.md` (proof bar).  
- Historical 2026-07-05 synthesis: UI direction validated; blockers were execution, not “need different benchmarks.”

### 5.4 RESULTS-MAP relationship

RESEARCH-MAP states: Research ≠ W-gate pass. Evidence → RESULTS-MAP / phase evidence dirs.

**Brainstorm-time honesty (2026-07-10 disk check):**  
`results/planner/` (and thus `world-standard-wave/04-orbit-continuity/`) was **not present** in this workspace scan. Phase file header claims W4 **PASS** with evidence paths. Execute/verification agents must **re-prove** against disk, not trust plan status tables alone. Idiots2 brainstorm does not invent PASS.

---

## 6. Full digestion of `Plans/phases/P04-orbit-continuity/`

### 6.1 Folder inventory

| File | Role |
|------|------|
| `README.md` | Index into execute card + expert passes |
| `P04-orbit-continuity.md` | **Execute card** — goals, architecture, tasks, CP-04, acceptance |
| `P04-suggestions.md` | Plan-only suggestions S1–S12 (pre-revision input) |
| `01-react-open3d.md` | React/workspace expert pass (P03/P04/P06/P07) |
| `03-r3f-3d.md` | 3D expert pass (P04 orbit + P08 mesh) |

### 6.2 Goal (buyer story)

Hosts: `/planner/open3d` or `/planner/guest` (same open3d stack).

1. 2D place → 3D same ids / mm pose / rotation.  
2. 3D → 2D → 3D without drift (3D unmounts; document sole authority).  
3. Orbit immediately; workspace **explicit** enable.  
4. Clean console on path.

### 6.3 Architecture (data as truth)

```
Open3dProject (UUID entities, mm)
    │  position + rotation on furniture / wall geometry
    ├── 2D: FeasibilityCanvas (viewMode === "2d")
    └── 3D: Lazy3DViewer (ThreeLazyViewer.tsx) → ThreeViewerInner
              └── buildOpen3dSceneNodes(project) → meshes tagged userData.entityId
              └── OrbitControls when enableControls === true
              └── data-orbit-enabled="true"|"false" on three-viewer-container
```

**Continuity rule:** View mode is chrome only. Document is the only pose authority. Switching modes must **not** mutate furniture position / rotation / id. 3D rebuilds from `buildOpen3dSceneNodes`; must not invent poses. Returning to 2D unmounts Lazy3DViewer — expected; remount re-reads same project.

### 6.4 Tech stack locked (phase)

| Layer | Choice |
|-------|--------|
| Workspace | `OOPlannerWorkspace` + TopBar 2D\|3D radiogroup |
| Hosts | open3d + guest same stack |
| 2D interim | FeasibilityCanvas |
| 3D | Three.js + OrbitControls via ThreeViewerInner |
| Lazy | ThreeLazyViewer exports Lazy3DViewer |
| Pose model | furniture position/rotation + wall geometry in types |
| Unit | Vitest |
| Browser | Playwright — **open3d selectors only** |

### 6.5 Honest baseline (as written in phase — planning-time)

Three-layer table from plan:

| Layer | Planning-time status | Notes |
|-------|----------------------|-------|
| 1 Defaults | ON | Lazy + Inner `enableControls = true`; damping 0.08; polar clamp; distances 1–40 |
| 2 Workspace | **Gap** (at plan writing) | Omit explicit prop |
| 3 Proof | **Absent** | No orbit unit; no attribute; no `04-` folder |

**Brainstorm live reconciliation (code skim 2026-07-10 — not browser proof):**

| Layer | Live observation | Still need for honest Done |
|-------|------------------|----------------------------|
| 1 | Defaults + OrbitControls construct path present | Keep |
| 2 | Workspace uses `{...getOpen3dViewerControlProps()}` + `orbitDefaults.ts` exists | Keep; unit must lock |
| 3 | `data-orbit-enabled` present on container in Inner | **Evidence dir + vitest/playwright logs** must exist under root `results/` |

Plan header “PASS 2026-07-09” is **not re-validated** here as browser-green without artifacts on disk.

### 6.6 File map (touch list discipline)

| Role | Path |
|------|------|
| Orbit host | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` |
| Lazy wrapper | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` |
| Orbit constant/helper | `site/features/planner/open3d/3d/orbitDefaults.ts` |
| Workspace wiring | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` |
| Toggle chrome | `TopBar.tsx` (read; radios labeled) |
| Types | `model/types.ts` (read) |
| Pose adapter | `buildOpen3dSceneNodes.ts` |
| Mesh factory | `createSceneObjectFromNode.ts` (regression) |
| Continuity unit | `documentViewContinuity.test.ts` (+ optional sibling) |
| Orbit unit | `orbitControlsDefault.test.ts` |
| Playwright | `open3d-w4-orbit-continuity.spec.ts` or journey W4 block |
| Evidence | `results/planner/world-standard-wave/04-orbit-continuity/` |

**Do not thrash:** `Planner3DViewer.tsx` (legacy R3F), rewrite of `planner-j4-3d-parity.spec.ts` as W4 proof.

### 6.7 Task list spine (TDD first)

| Task | Intent | Evidence names |
|------|--------|----------------|
| **00** | Scaffold `04-orbit-continuity/` + NOTES (HEAD, approach A, three-layer baseline) | NOTES.md |
| **01** | RED pose continuity: stable ids, double rebuild, pose edit survives, wall+furniture | pose-continuity-vitest-raw.log + pose-continuity-run.json |
| **02** | RED orbit default ON: constant/helper, construct spy, false opt-out only | orbit-default-vitest-raw.log + orbit-default-run.json |
| **03** | GREEN OrbitControls + `data-orbit-enabled` | Units green |
| **04** | GREEN workspace explicit enable + live projectData | Units green |
| **05** | Adapter regression suite | adapter-regression-vitest-raw.log |
| **06** | Playwright radio toggle + left-drag + console | playwright-raw.log, run.json, 01–03 PNGs, console-messages.txt |
| **07** | Commit slices + CP-04 | Local commits; NOTES final table |

### 6.8 Acceptance matrix (W4.1–W4.6)

| ID | Criterion | Proof |
|----|-----------|--------|
| **W4.1** | Entity ids stable across 2D↔3D rebuild | Vitest incl. double rebuild under `04-` |
| **W4.2** | Position + rotation match document after rebuild | Vitest + Playwright when run |
| **W4.3** | Orbit enabled by default | Default true **AND** workspace explicit **AND** construct **AND** `data-orbit-enabled="true"` |
| **W4.4** | Left-drag orbit without crash | Playwright drag or honest deferral (no false pass) |
| **W4.5** | Console clean on toggle path | Playwright console capture or chrome-devtools log in evidence |
| **W4.6** | No competitor code/assets | Review: Three MIT OrbitControls only |

### 6.9 CP-04 hard stop gate

Checkboxes (conceptual):

- [ ] Pose continuity units green + evidence under `04-`
- [ ] Orbit default ON green + `data-orbit-enabled` wired
- [ ] Workspace explicit enable + live projectData
- [ ] Adapter regression green
- [ ] Playwright green **or** deferred with honest NOTES (no false “works”)
- [ ] Console-clean claim only with artifact
- [ ] Local commits; no worktrees; push policy per AGENTS
- [ ] W4 not done if orbit disabled, silent-default only, or pose drifts

**Unlock next:** P05 symbols only after CP-04 or owner written waiver.

### 6.10 Status vocabulary

| Word | Meaning |
|------|---------|
| Planned | Docs only |
| Unit-green | Vitest in `04-` + layers 1–2 closed |
| Browser-green | Playwright + screenshots + console log |
| Done (W4) | Unit-green **and** browser-green (or owner-accepted browser deferral only) |

### 6.11 Suggestions file (S1–S12) — all still binding as design intent

| ID | Suggestion | Status vs execute card |
|----|------------|------------------------|
| S1 | Explicit workspace orbit contract | Applied in plan Task 04 |
| S2 | `data-orbit-enabled` | Applied Task 03 |
| S3 | Extend continuity tests; double rebuild; re-home evidence | Task 01 |
| S4 | One primary orbit unit file | Task 02 |
| S5 | Playwright open3d selectors; ban J4 | Task 06 |
| S6 | Honest three-layer baseline | Baseline section |
| S7 | Remount rule; no camera-as-pose | Architecture |
| S8 | Evidence filenames locked | Task 00–06 |
| S9 | CP-04 requires explicit prop + attribute | CP-04 |
| S10 | Minimal file map; no Planner3DViewer thrash | File map |
| S11 | Superpowers / no worktrees | Header |
| S12 | No TBD language | Expert revision claim |

### 6.12 Expert pass — React/open3d (`01-react-open3d.md`)

**Verdict:** FIX (plan-ready with corrections).

**P0 for W4:**

1. Orbit three-layer rule — do not claim from defaults alone.  
2. **Rotation unit lock:** Live furniture **document rotation = degrees** (`normalizeDegrees`, pureActions `% 360`); pick converts degrees→rad for hit math; wall scene rotation atan2 radians; mesh factory treats **node.rotation as radians**.  
   - **Plan wording that says “document + scene nodes = radians” for furniture is FALSE.**  
   - Document↔node equality bar must respect **conversion at adapter** (`degreesToRadians` in `buildOpen3dSceneNodes`).  
   - **Do not** convert furniture document storage to radians mid-spine (false-reverse risk).  
3. Hosts: open3d + guest same stack; prefer guest `?plannerDevTools=1` for clean IDB when testing multi-gate.

**False-reverse traps (W4 subset):**

| Trap | Why fatal |
|------|-----------|
| Convert furniture rotation document → radians for P04 wording | Rewrites pick, actions, fabric mapper, fixtures |
| Treat mesh `-rotation.y` as pose drift | Intentional plan Y→world Z |
| Claim W4 from default prop only | Silent omit still “works” |
| Port open3d 3D to R3F mid-gate | Live = imperative Three + OrbitControls |
| J4 e2e grammar | Wrong chrome (button 3D, middle-drag, canvas testid as canvas) |

### 6.13 Expert pass — 3D (`03-r3f-3d.md`)

**Verdict:** FIX — execution-ready architecture; product baseline not W4-green until layers land with evidence.

**P0 W4:**

1. Three-layer orbit rule.  
2. Pose continuity = document only; double rebuild deep-equal on id / xMm / yMm / rotation (node fields after adapter).  
3. Stay imperative Three for open3d.  

**P1:** Keep polar clamp / damping / distances; left-drag rotate; auto-rotate off; camera bookmark non-goal.

**Mesh (P08) must not leak into W4 commits.**

### 6.14 Internal plan contradictions to resolve before writing tests

| Topic | Phase body (early) | Expert pass / live code | Correct W4 test stance |
|-------|--------------------|-------------------------|------------------------|
| Furniture document rotation units | “radians about vertical” in architecture section | **Degrees** in document + properties; nodes **radians** via adapter | Assert document degrees → node radians via known conversion; assert double rebuild equality on **node fields** after adapter |
| Mesh `-rotation.y` | Intentional | Intentional | Never fail W4 on mesh sign alone if document/node match |
| ENGINE “R3F” | Keep R3F | open3d ships imperative Three | Do not rewrite viewer for wording |
| Status PASS vs evidence | Header PASS + evidence paths | `results/planner` missing in 2026-07-10 scan | Re-prove; do not inherit PASS blindly |

---

## 7. Design-spec W4 (program level)

Source: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`

| ID | Gate | Proof |
|----|------|--------|
| **W4** | 2D↔3D toggle preserves pose; **3D orbit** enabled | Playwright + console clean |

Approach **A** locked: Product Journey First on FeasibilityCanvas + document model.

Architecture line:

```
Document → FeasibilityCanvas → Inventory place → ThreeViewerInner (orbit ON) → Autosave
```

Workstream #3: **3D orbit + continuity assert** (chrome-devtools, TDD).

Testing strategy: red/green unit → Playwright gold pattern → no claim without screenshots + run JSON.

---

## 8. Continuity model — deep product design (brainstorm)

### 8.1 Single source of truth

```
                    ┌─────────────────────────┐
                    │     Open3dProject       │
                    │  walls + furniture UUIDs│
                    │  position mm, rotation  │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │ viewMode chrome only              │
              v                                   v
     FeasibilityCanvas                    Lazy3DViewer
     (reads project)                      (reads project)
              │                                   │
              │                                   v
              │                         buildOpen3dSceneNodes
              │                                   │
              │                                   v
              │                         createSceneObjectFromNode
              │                         (mesh transforms)
              │                                   │
              └────────── same ids ───────────────┘
```

### 8.2 What may change on toggle

| May change | Must not change |
|------------|-----------------|
| Mounted React tree (2D vs 3D) | Furniture `id` |
| WebGL context presence | Furniture `position` mm |
| Camera matrix / orbit target | Furniture `rotation` (document degrees) |
| Selection chrome visibility | Wall entity ids |
| Which renderer is active | Catalog identity of placed items |

### 8.3 Rebuild semantics

- Entering 3D: **build nodes from project → create meshes**.  
- Leaving 3D: **dispose scene / unmount viewer**.  
- Re-entering 3D: **identical node pose fields** if project unchanged.  
- Editing pose only in 2D (or pure actions): nodes must track document after rebuild.

### 8.4 Double-rebuild unit (models remount)

```
snapshot1 = buildOpen3dSceneNodes(project)
// no mutation
snapshot2 = buildOpen3dSceneNodes(project)
assert deepEqual furniture pose fields (id, xMm, yMm, rotation)
```

This is the pure stand-in for unmount/remount without WebGL.

### 8.5 What continuity is not

- Not “pixel-identical 2D and 3D screenshots.”  
- Not “camera angle preserved.”  
- Not “selection always visible in 3D.”  
- Not “dual live split view” (unless product later adds it; not W4).  
- Not “3D edit writes back differently than 2D” (if 3D edit exists later, still document authority).

### 8.6 Sweet Home 3D lesson (open reference idea)

Class-leading continuity comes from **one plan model → two projections**. O&O already has that structure. W4’s job is to **prove** it and **enable navigation**, not invent a second model.

---

## 9. Orbit model — deep product design (brainstorm)

### 9.1 Industry grammar → Three OrbitControls defaults

| User intent | Typical gesture | Three OrbitControls default | W4 policy |
|-------------|-----------------|-----------------------------|-----------|
| Orbit / rotate view | **Left-drag** | Rotate | **Use** |
| Pan | Right-drag / ctrl-drag | Pan | **Keep enabled** |
| Zoom | Wheel | Dolly/zoom | **Keep** |
| Walk first-person | WASD + look | Not OrbitControls | **Out of scope** |
| Auto-rotate showcase | Timer | Optional | **OFF for product** |

**Anti-J4:** Legacy parity used **middle-button** drag. Do **not** require middle-only for W4.

### 9.2 Product orbit parameters (phase lock)

| Control | Setting |
|---------|---------|
| enableControls default | true |
| Workspace product path | must pass true / helper |
| Damping | enableDamping true, factor 0.08 |
| Polar clamp | maxPolarAngle ≈ π/2 − 0.05 (ground-friendly) |
| Distance | min 1 · max 40 (room-scale) |
| Auto-rotate | off |

These numbers are **product choices already in code/plan**, not competitor copies.

### 9.3 DOM contract for Playwright

| Hook | Element | Notes |
|------|---------|-------|
| `data-testid="planner-3d-canvas"` | Lazy root **div** | **Not** an HTMLCanvasElement requirement |
| `data-testid="three-viewer-container"` | Inner host | Orbit attribute lives here |
| `data-orbit-enabled="true"\|"false"` | Inner container | Set after OrbitControls construction |

Attribute is **truth for automation**, not a visible gizmo (do not invent competitor-style orbit UI chrome).

### 9.4 Explicit props helper (contract shape)

Concept (already in repo as `orbitDefaults.ts`):

- `OPEN3D_ORBIT_DEFAULT_ENABLED = true`  
- `getOpen3dViewerControlProps(): { enableControls: true }`  

Type forces product path cannot silently type-check an opt-out.

### 9.5 Opt-out allowed only for

- Unit tests / stories that need static camera  
- Never product `OOPlannerWorkspace` 3D branch  

### 9.6 Failure modes of “orbit feels broken”

| Symptom | Likely layer | Fix class |
|---------|--------------|-----------|
| No left-drag response | Layer 1/2: controls not constructed | Construct + enable |
| Drag works in unit mock only | Layer 3: no browser | Playwright |
| Drag crashes page | Controls + dispose race | systematic-debug dispose |
| Orbit enabled but black scene | WebGL/context/project empty | Not “orbit off” — scene/content |
| Toggle loses furniture | Continuity / project ref | Pose tests |
| Console errors on toggle | Dispose/import race | W4.5 |

---

## 10. Rotation & coordinate conventions (must not thrash)

### 10.1 Locked honest model (expert + live adapter comments)

| Layer | Furniture rotation unit | Notes |
|-------|-------------------------|-------|
| **Document** (`Open3dFurnitureItem.rotation`) | **Degrees** | Properties panel, pureActions normalize, 2D canvas `rotate(... * π/180)` |
| **Scene nodes** (`buildOpen3dSceneNodes`) | **Radians** | `degreesToRadians(item.rotation)` |
| **Mesh** (`createSceneObjectFromNode`) | Node radians → `rotation.y = -node.rotation` | Sign flip intentional for plan Y→world Z |

### 10.2 Wall nodes

Wall rotation often from geometry (`atan2`) already in radians at node level — do not force wall document fields into furniture degree rules blindly.

### 10.3 W4 unit assertions (recommended)

1. After place/update, **document** still has expected **degree** rotation.  
2. Node.rotation equals **radians conversion** of document.  
3. Two builds equal on node pose fields.  
4. Do **not** assert mesh.worldQuaternion against document degrees without transform math.

### 10.4 Why early plan “radians everywhere” is dangerous

If execute agent “fixes” document to radians to match outdated plan prose:

- pickFurniture hit math breaks  
- pureActions % 360 breaks  
- properties panel UX breaks  
- fixtures cascade  

Expert pass labeled this **false-reverse**. Brainstorm **agrees**: treat expert + live adapter as authority over early architecture prose.

---

## 11. Browser contract (anti-J4) — exhaustive

### 11.1 Hosts

| Host | Notes |
|------|-------|
| `/planner/guest/?plannerDevTools=1` | Preferred for clean IDB when multi-gate |
| `/planner/open3d` | Same open3d stack |

### 11.2 Mode switch selectors

| Correct (open3d) | Forbidden (legacy J4) |
|------------------|------------------------|
| `getByRole("radio", { name: "3D" })` | `getByRole("button", { name: "3D" })` |
| `getByRole("radio", { name: "2D" })` | Split-chrome assumptions |
| Wait `planner-3d-canvas` **div** | `canvas[data-testid="planner-3d-canvas"]` |
| Wait `three-viewer-container[data-orbit-enabled="true"]` | Internal Three object spies only |
| **Left**-button drag ~50px | Middle-button only |

### 11.3 Journey steps (Task 06 shape)

1. Open host.  
2. Ensure ≥1 furniture entity (inventory place or seed).  
3. Record furniture id + pose from document UI/harness.  
4. Click **3D** radio.  
5. Wait canvas root + orbit-enabled container.  
6. Left-drag orbit; screenshot `02-orbit-drag.png`.  
7. **2D** then **3D** again; furniture still present; console clean.  
8. Pose assert: same id in document after toggles.

### 11.4 Evidence artifacts when browser runs

| File | Content |
|------|---------|
| playwright-raw.log | full run |
| playwright-run.json | exit, names, status |
| 01-3d-mount.png | 3D visible |
| 02-orbit-drag.png | after left-drag |
| 03-back-to-2d.png | 2D restored |
| console-messages.txt | no app errors |

### 11.5 Honesty clause

If Playwright harness not ready until P07 journey lands:

- Land **unit + DOM hooks** now.  
- Leave Playwright open **or** block in Failures.md.  
- NOTES must say deferred — **never** claim browser-green without PNGs.

### 11.6 Why J4 is toxic for W4

| J4 assumption | open3d truth |
|---------------|--------------|
| Button labeled 3D | Radio in radiogroup |
| Split view chrome | Mode unmount swap |
| Middle-button orbit | Left-drag OrbitControls |
| canvas testid | div root |

Copy-paste produces **false red** forever.

---

## 12. Testing strategy (W4-only)

### 12.1 Pyramid

```
        ┌──────────────────┐
        │ Playwright W4    │  left-drag, radio, console
        └────────┬─────────┘
                 │
        ┌────────v─────────┐
        │ Orbit unit       │  construct spy + data-orbit-enabled
        │ Continuity unit  │  double rebuild pure
        │ Adapter regress  │  build nodes + mesh factory
        └──────────────────┘
```

### 12.2 Pure-first bias

WebGL is flaky in CI. Pose continuity must be **pure functions** first. Orbit construction can be mocked. Browser is the **integration seal**, not the only seal.

### 12.3 Commands (from phase)

| Purpose | Command (from `site/`) |
|---------|------------------------|
| Pose continuity | `npx vitest run tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose` |
| Orbit default | `npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.ts --reporter=verbose` |
| Adapter regress | `npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts … createSceneObjectFromNode.test.ts` |
| Playwright W4 | `npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts` |

Evidence via `scripts/run-evidence-cmd.ps1` when available → **repo-root** `results/…` only (never `site/results/`).

### 12.4 Skills for execute

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| test-driven-development | Tasks 01–04 |
| verification-before-completion | Evidence, CP-04 |
| systematic-debugging | Dispose/race, WebGL |
| chrome-devtools | Live orbit / console |

---

## 13. Cross-phase interfaces (do not expand, do not break)

| Phase | Interface with W4 |
|-------|-------------------|
| **P03 select/delete** | Not required for pure continuity units; browser may need a placed item (seed OK) |
| **P05 symbols** | 2D readability; does not change 3D pose contract |
| **P06 save** | Save must not rewrite ids on reload — different gate, same document identity culture |
| **P07 journey** | May absorb W4 Playwright block; selectors still open3d |
| **P08 mesh** | Improves what you see while orbiting; not required for orbit ON |
| **P02 engine lock** | Already decided Three family + orbit enable |

---

## 14. Risk register (W4)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Claim PASS without `results/` artifacts | High if doc-driven | Trust collapse | Re-run evidence; honest status |
| Rotation unit rewrite | Medium if plan prose wins | Cascade break | Degrees document lock |
| R3F port thrash | Medium if ENGINE literalism | Weeks lost | Imperative Three lock for open3d |
| J4 selector copy | High if agents reuse old e2e | Permanent false red | Anti-J4 table in every e2e PR |
| Silent default-only orbit | Medium | Regression without tests | Explicit prop + unit |
| Camera bookmark scope creep | Medium | Extra complexity | Non-goal list |
| Photoreal “to make 3D good” | Medium | W4 never closes | BOQ > photoreal culture |
| Dual writer on open3d package | Process | Merge thrash | One writer per package |
| Evidence under `site/results` | Process | Layout gate fail | `check:layout` / root results only |

---

## 15. Anti-patterns catalog (reject list)

1. `enableControls={false}` from product workspace.  
2. Relying on default alone without explicit workspace prop/helper.  
3. Auto-rotate as only motion.  
4. Copying Planner5D/Floorplanner DOM or CSS.  
5. Importing R3F orbit memory from Planner3DViewer for open3d W4.  
6. Treating mesh `-rotation.y` as continuity failure.  
7. Converting furniture document rotation to radians to “match plan.”  
8. Middle-button-only orbit e2e.  
9. Asserting `canvas[data-testid=planner-3d-canvas]`.  
10. Calling WAVE silence “orbit works.”  
11. Re-scraping competitors for W4 chrome.  
12. Fabric full-stage cutover mid-W4.  
13. Walk mode as W4 acceptance.  
14. Photoreal materials as W4 acceptance.  
15. Committing competitor screenshots into `site/`.  

---

## 16. Ideation: what “world-class W4” feels like (O&O original)

Not a clone of any pack — product feel targets:

1. **Instant confidence:** After 3D radio click, room structure + furniture appear without re-placing.  
2. **Zero surprise IDs:** Properties panel still shows the same piece after round-trip.  
3. **Mouse literacy:** Left-drag orbits like every modern 3D web viewer; wheel zooms; pan available.  
4. **Ground-friendly camera:** Polar clamp avoids going under floor (phase parameters).  
5. **No drama console:** No dispose errors, no React key storms, no WebGL context spam.  
6. **Honest empty states:** If no furniture, orbit still works on walls/floor; do not fake content.  
7. **Lazy without dead-end:** First 3D load may show loading; never permanently blank without message.  
8. **Manufacturer trust:** Cabinet that was placed at 1200×600 still sits at that pose in 3D — quote path credibility starts here.

---

## 17. Ideation: optional later (explicitly not W4)

| Idea | Why later |
|------|-----------|
| Camera bookmarks per floor | Nice; not entity pose |
| Dual split 2D|3D | Perf and UX cost |
| Walk / eye-level mode | Floorplanner secondary paradigm |
| Edit furniture in 3D with gizmo | Authoring scope |
| Sync selection highlight 2D↔3D | Polish |
| Fit-all / standard views palette | Sketchfab-class helper |
| Shadow / ceiling toggles | Floorplanner view settings |
| 360 panorama export | Marketing feature |
| Multiplayer presence in 3D | P5D later |

---

## 18. Evidence directory contract (when execute runs)

**Root only:** `D:\OandO07072026\results\planner\world-standard-wave/04-orbit-continuity/`

| Artifact | Source |
|----------|--------|
| NOTES.md | HEAD, approach A, W4 wording, three-layer pass/fail, honest deferrals |
| pose-continuity-vitest-raw.log + pose-continuity-run.json | Task 01 |
| orbit-default-vitest-raw.log + orbit-default-run.json | Task 02 |
| adapter-regression-vitest-raw.log | Task 05 |
| THREE-LAYER-AUDIT.md | Optional but useful (phase claims one) |
| Playwright set | Task 06 |

**Layout rule:** Never `site/results/` or `site/test-results/`. Prefer `pnpm run check:layout` awareness.

---

## 19. Git / process constraints (phase + AGENTS)

| Rule | Value |
|------|--------|
| Checkout | `D:\OandO07072026` only |
| Worktrees | **Forbidden** |
| Commit | Landable slices as you go |
| Push | Per AGENTS (origin when right; mayoite mirror policy) |
| Parallel agents | ≤8 default; no two writers on same package |
| Firecrawl | Dead for routine |

---

## 20. Brainstorm conclusions (brutal honesty)

### 20.1 Research is enough to execute W4 without new scrapes

Every needed **pattern** exists in:

- SYNTHESIS + ENGINE continuity column  
- Floorplanner orbital vs walk  
- UI benchmark explicit toggle + lazy 3D + orbit grammar  
- P5D structure→3D loop  

RoomSketcher does **not** give orbit implementation detail — and that is fine.

### 20.2 Architecture is already correct

Document → 2D projection / 3D rebuild is the winner architecture. O&O does not need a new continuity framework.

### 20.3 The real W4 work is contract + proof

Not inventing orbit from zero:

1. Explicit enable contract (helper + workspace).  
2. Playwright-visible `data-orbit-enabled`.  
3. Pure double-rebuild continuity tests.  
4. Browser left-drag + console.  
5. Degrees/radians honesty in tests.

### 20.4 Plan status vs disk evidence

Phase file may claim PASS; this brainstorm pass did **not** find `results/planner/.../04-orbit-continuity/`.  
**Agents must re-prove.** Documentation PASS without artifacts is paper.

### 20.5 Biggest self-inflicted injuries to avoid

1. Rotation unit thrash.  
2. R3F rewrite thrash.  
3. J4 e2e thrash.  
4. Photoreal scope thrash.  
5. Claiming orbit from defaults alone.

### 20.6 What “done” must mean for W4

| Minimum Done | Stretch Done |
|--------------|--------------|
| Layers 1–2 locked in code | Layer 3 browser-green |
| Unit green under `04-` | Journey shared with P07 still uses open3d selectors |
| NOTES honest about any deferral | THREE-LAYER-AUDIT + clean console artifact |

---

## 21. Recommended execute order (if implementing after this brainstorm)

1. Verify disk: evidence folder, unit files, workspace wiring, `data-orbit-enabled`.  
2. If units missing/red: TDD Task 01 → 02 → 03/04.  
3. Adapter regression Task 05.  
4. Playwright Task 06 with anti-J4 selectors.  
5. CP-04 checkboxes only with paths.  
6. Commit slices. Do not open P05 until CP-04 honest.

---

## 22. Source index (absolute paths)

### 22.1 D:\websites — synthesis & comparison

- `D:\websites\README.md`  
- `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`  
- `D:\websites\research\2026-07-09-world-standard\FIRECRAWL-GAPS.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md`  
- `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\SCORES.csv`  
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-benchmark.md`  
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-plann-compare.md`  
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-packages.md`  
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-packages-plann-compare.md`  
- `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-synthesis.md`  

### 22.2 D:\websites — product packs

- `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md`  
- `D:\websites\planner5d.com\report\TOOLBARS.md`  
- `D:\websites\planner5d.com\report\DEEP_STACK_AND_PACKAGES.md`  
- `D:\websites\floorplanner.com\report\INSPIRATION.md`  
- `D:\websites\roomsketcher.com\report\INSPIRATION.md`  
- `D:\websites\homestyler.com\report\INSPIRATION.md`  
- `D:\websites\ikea.com\planner-public\report\INSPIRATION.md`  
- `D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md`  
- `D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md`  

### 22.3 Plans Research + design

- `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md`  
- `D:\OandO07072026\Plans\Research\Others\18-PRODUCT-CONTEXT.md`  
- `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md`  

### 22.4 Phase P04

- `D:\OandO07072026\Plans\phases\P04-orbit-continuity\README.md`  
- `D:\OandO07072026\Plans\phases\P04-orbit-continuity\P04-orbit-continuity.md`  
- `D:\OandO07072026\Plans\phases\P04-orbit-continuity\P04-suggestions.md`  
- `D:\OandO07072026\Plans\phases\P04-orbit-continuity\01-react-open3d.md`  
- `D:\OandO07072026\Plans\phases\P04-orbit-continuity\03-r3f-3d.md`  

### 22.5 Live product anchors (read-only references for brainstorm honesty)

- `D:\OandO07072026\site\features\planner\open3d\3d\ThreeViewerInner.tsx`  
- `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx`  
- `D:\OandO07072026\site\features\planner\open3d\3d\orbitDefaults.ts`  
- `D:\OandO07072026\site\features\planner\open3d\3d\buildOpen3dSceneNodes.ts`  
- `D:\OandO07072026\site\features\planner\open3d\3d\createSceneObjectFromNode.ts`  
- `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx`  

### 22.6 Evidence (expected product proof)

- `D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\` (**expected; not found in 2026-07-10 scan**)  

---

## 23. Glossary (W4)

| Term | Meaning |
|------|---------|
| **W4** | World-standard gate: pose continuity + orbit ON + proof |
| **CP-04** | Checkpoint checklist for P04 hard stop |
| **Continuity** | Same entity ids/poses across view modes via one document |
| **Orbit** | Dolly/orbit/pan camera via OrbitControls |
| **Three-layer orbit rule** | Defaults + explicit workspace + proof |
| **Approach A** | Product journey on Feasibility + document before Fabric full stage |
| **open3d stack** | Hosts sharing OOPlannerWorkspace / Lazy3DViewer path |
| **J4** | Legacy planner-j4-3d-parity e2e grammar — forbidden for W4 |
| **data-orbit-enabled** | DOM attribute Playwright truth |
| **Double rebuild** | Two pure `buildOpen3dSceneNodes` calls modeling remount |
| **Paper PASS** | Status claim without results artifacts |

---

## 24. Final handover block

```
PHASE:    P04-orbit-continuity (W4)
GOAL:     Document pose continuity + default orbit with explicit wiring + proof
IN:       D:\websites (2D↔3D/orbit/SYNTHESIS/ENGINE/packs) → Plans/Research → P04 folder
OUT:      This REPORT only (Idiots2/P04-orbit-continuity/REPORT.md)
CODE:     None this pass
LOCKS:    Imperative Three orbit path; document degrees; nodes radians; no J4; no photoreal
PROOF:    results/planner/world-standard-wave/04-orbit-continuity/ (must re-prove on disk)
NEXT:     Execute agents close any residual unit/browser gaps; CP-04; then P05
```

---

## 25. Appendix A — Industry continuity scoreboard (research snapshot)

Compact copy of engine continuity scores for agents who only open this report:

| Product | Continuity score | Pattern summary |
|---------|:----------------:|-----------------|
| Planner5D | 5 | Instant toggle; hybrid web |
| RoomSketcher | 5 | Same project updates both views (claimed) |
| Sweet Home 3D | 5 | Dual projection of one plan (open classic) |
| Floorplanner | 4–5 | Explicit switch; orbital inspect |
| Homestyler / Foyr | 4 | 3D-strong; 2D more setup |
| IKEA | 3 | Constrained domain continuity |
| O&O research snapshot | 3 | Shared document → rebuild; polish/proof incomplete |

**Target:** Move O&O from research “3” to **product-proven** continuity (not a marketing score — browser + unit evidence).

---

## 26. Appendix B — Mode switch product grammar (O&O original verbs)

Use in UI / tests / docs — never competitor brand names:

| Verb | Meaning |
|------|---------|
| Switch to 2D | Plan edit view |
| Switch to 3D | Live inspect view |
| Orbit | Left-drag rotate camera |
| Pan | Right/ctrl-drag move target |
| Zoom | Wheel dolly |
| Same layout | Continuity promise to buyer |

---

## 27. Appendix C — Three-layer audit template (for NOTES.md)

Execute agents can paste into evidence NOTES:

```
## Three-layer orbit audit

| Layer | Claim | Path / artifact | Pass? |
|-------|-------|-----------------|-------|
| 1 Defaults | enableControls default true Lazy+Inner | file:line / unit |  |
| 2 Workspace | getOpen3dViewerControlProps or enableControls true | OOPlannerWorkspace |  |
| 3 Proof unit | OrbitControls construct spy + data-orbit-enabled | orbit-default-* |  |
| 3 Proof browser | left-drag + radio toggle + console | playwright-* + PNGs |  |

HEAD: <sha>
Date: <iso>
```

---

## 28. Appendix D — Continuity pure-test case matrix

| Case | Arrange | Act | Assert |
|------|---------|-----|--------|
| C1 Stable ids | addFurniture | build twice | same id |
| C2 Pose fields | set xMm/yMm/rot | build twice | equal node pose |
| C3 After update | updateFurniture pose | rebuild | node matches converted document |
| C4 Wall + furniture | both present | furniture pose update only | both ids stable |
| C5 No invent | empty mutation | remount simulation | no new furniture ids |
| C6 Degrees honesty | document rot 90 | build | node rot ≈ π/2 |

---

## 29. Appendix E — Orbit pure/component-test case matrix

| Case | Arrange | Act | Assert |
|------|---------|-----|--------|
| O1 Default constant | import helper | read | true |
| O2 Control props | call helper | return | `{ enableControls: true }` |
| O3 Construct when true/omit | mount Inner mock three | construct | OrbitControls called |
| O4 No construct when false | enableControls false | mount | not called |
| O5 Attribute true | controls on | DOM | data-orbit-enabled=true |
| O6 Attribute false | controls off | DOM | data-orbit-enabled=false |

---

## 30. Closing statement

W4 is the moment the planner stops being “a 2D toy with a 3D preview somewhere” and becomes **one layout the buyer can walk around with the mouse**. Research winners agree on the pattern; O&O already chose the right architecture. The gate is closed only when **document continuity** and **orbit three-layer proof** live under `results/planner/world-standard-wave/04-orbit-continuity/` with no paper PASS, no competitor chrome, no rotation thrash, and no R3F rewrite cosplay.

**End of Idiots2 P04 REPORT (BRAINSTORMER 04/10).**
