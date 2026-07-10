# P04 — Orbit Continuity (W4) — Brainstormer Report

**Agent:** Brainstormer 04/10  
**Checkout:** `D:\OandO07072026`  
**Write root (only):** `D:\OandO07072026\Idiots\P04-orbit-continuity\`  
**Mode:** Plan / research synthesis only — **no product code** in this deliverable  
**Date of synthesis:** 2026-07-10  
**Skills posture:** `/using-superpowers` + brainstorming discipline; evidence-first; honesty over comfort  

---

## 0. Executive judgment (read this first)

| Question | Answer |
|----------|--------|
| What is W4? | Facilities buyer places furniture in **2D**, switches to **3D**, sees the **same entity ids + mm pose**, can **orbit immediately**, switches back without document rewrite, and the console stays clean. |
| What is *not* W4? | Photoreal mesh (P08/W7), walk/first-person, camera bookmarks, Fabric cutover, select/delete (P03), save honesty (P06), competitor chrome clone. |
| Architecture lock | **Document** is sole pose authority. View mode is chrome. 3D is a **rebuild** of `buildOpen3dSceneNodes` → meshes. Unmount on 2D is expected. |
| Orbit lock | **Three-layer rule:** (1) code defaults ON · (2) workspace **explicit** `enableControls` · (3) Playwright-visible `data-orbit-enabled` + unit construct-spy. Layer 1 alone = **false green**. |
| Rotation lock | **Document furniture rotation = degrees.** Scene **nodes** convert to **radians** at adapter boundary. Mesh `rotation.y = -node.rotation` is intentional plan-Y→world-Z, **not** pose drift. Do **not** convert furniture document to radians mid-spine. |
| Engine honesty | ENGINE-DECISION says “Three + R3F.” Live open3d product 3D path is **imperative Three** + `OrbitControls.js` in `ThreeViewerInner`. R3F is family/legacy (`Planner3DViewer`); **do not thrash** open3d to R3F mid-W4/W7. |
| Research → product | Instant 2D↔3D + orbit-as-default is industry grammar (P5D, Floorplanner, Sketchfab-style). O&O rebuilds with **our** document, radios, Phosphor chrome, MIT Three controls. |
| Status honesty (this checkout) | **Code path for three-layer + degrees/radians adapter + e2e spec is present in `site/`.** Phase card claims **PASS 2026-07-09**. Owner pending also marks W4 **GATE PASS**. **`results/` tree is absent in this workspace snapshot** — treat gate-PASS as **claimed elsewhere / not re-proven here**. Gate PASS ≠ product finished. |

**Handover one-liner (plan + experts):**  
**W4 = document pose continuity + OrbitControls ON by default with explicit workspace wiring + `data-orbit-enabled`; prove under `results/planner/world-standard-wave/04-orbit-continuity/` with Vitest then Playwright left-drag + radio toggle; stay imperative Three; furniture degrees in document.**

---

## 1. Scope, north star, and non-goals

### 1.1 Product north star (design authority)

From `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`:

> A facilities buyer can, **without a developer**, open the planner, lay out a small office with **real O&O-scale furniture**, switch **2D↔3D** with orbit, **select/edit/delete**, **save and return** the next day, and trust dimensions enough to **quote** later.

**W4 slice of that sentence:** *switch 2D↔3D with orbit* — proven, not demoware.

| Gate | Criterion | Proof class |
|------|-----------|-------------|
| **W4** | 2D↔3D toggle preserves pose; **3D orbit** enabled | Playwright + console clean (+ units under `04-orbit-continuity/`) |

### 1.2 P04 phase goal (execute card)

A facilities buyer on `/planner/open3d` or `/planner/guest` (same open3d stack) can:

1. Place furniture in **2D**, switch to **3D**, see **same entity ids, position (mm), and rotation** (document-level).  
2. Switch **3D → 2D → 3D** without pose drift or id rewrite (3D unmounts on 2D; **document** remains sole pose authority).  
3. **Orbit** the 3D scene immediately (no hidden “enable orbit” toggle; workspace **explicitly** enables controls).  
4. Leave a **clean console** on the 2D↔3D path.

### 1.3 Explicit non-goals (do not expand P04 into these)

| Non-goal | Why deferred |
|----------|----------------|
| Mesh photoreal / toe-carcass-door polish | **P08 / W7** |
| Save honesty / flush / cloud labels | **P06 / W5–W6** |
| Select/delete/undo spine | **P03 / W3** |
| Fabric full-stage cutover | Approach A destination later; not W4 |
| Walk / first-person camera | Industry has it; O&O later |
| Camera bookmark across view modes | Nice-to-have; not entity pose |
| Auto-rotate showcase | Anti-product for inspection |
| Competitor UI/CSS/GLB/icons | Ethics fence forever |
| Rewrite open3d 3D onto R3F `<Canvas>` | Expert false-reverse; kills W schedule |
| Fix J4 legacy e2e as W4 proof | Wrong chrome grammar |

### 1.4 Approach lock

**Approach A — Product Journey First** (owner 2026-07-09):

```
Document (open3d project, UUID entities, mm)
    ├── FeasibilityCanvas (2D interim)
    ├── Inventory place / modular
    ├── ThreeViewerInner (orbit ON; procedural + optional generated GLB)
    └── Autosave IDB + honest status (other phases)
```

W4 sits on Feasibility + document + Lazy3D rebuild. It does **not** wait for Fabric walls.

---

## 2. Phase folder inventory (every file read)

**Folder:** `D:\OandO07072026\Plans\phases\P04-orbit-continuity\`

| File | Role | Verdict contribution |
|------|------|----------------------|
| `P04-orbit-continuity.md` | Execute card — tasks, acceptance, CP-04, three-layer, anti-J4 | Primary program truth for *what* to ship |
| `P04-suggestions.md` | Plan-only path verify + S1–S12 | Drove expert revision; still best critique of soft spots |
| `01-react-open3d.md` | React/Next workspace expert (shared P03/P04/P06/P07) | Degrees lock; workspace orbit gap (at plan date); host chain |
| `03-r3f-3d.md` | 3D expert (P04 + P08) | Three-layer; imperative Three; mesh bar for W7 |
| `README.md` | Local index | Points to execute card + EXPERT-PASS |

**Consolidated authority:** `D:\OandO07072026\Plans\phases\EXPERT-PASS.md`  
**Program index:** `D:\OandO07072026\Plans\INDEX.md`  
**Evidence map:** `D:\OandO07072026\Plans\Research\RESULTS-MAP.md` → `04-orbit-continuity/`  
**Research map:** `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md` → Instant 2D↔3D → P04  

### 2.1 Status banner vs expert baseline vs this checkout

| Layer | Plan baseline (2026-07-09 expert) | Live code (this checkout, grep/read) | Evidence folder |
|-------|-----------------------------------|--------------------------------------|-----------------|
| Defaults ON | ON in Lazy + Inner | `OPEN3D_ORBIT_DEFAULT_ENABLED = true` via `orbitDefaults.ts` | Claimed under `results/.../04-orbit-continuity/` |
| Workspace explicit | **Gap** — omit prop ~L756 | **Closed:** `{...getOpen3dViewerControlProps()}` in `OOPlannerWorkspace.tsx` | |
| `data-orbit-enabled` | **Missing** | **Present** on `three-viewer-container` | |
| Units | Partial continuity unit | `orbitControlsDefault.test.tsx`, `poseContinuityW4.test.ts`, `documentViewContinuity.test.ts` | |
| Playwright | Spec planned / anti-J4 | `open3d-w4-orbit-continuity.spec.ts` exists (configurator Place 4 seats) | |
| `results/` tree | Required for green claim | **Absent in this workspace snapshot** | Re-prove before trusting PASS |

**Honesty rule:** Do not collapse “code has the hooks” with “browser evidence folder green on this disk.” Owner pending marks residual **W4 browser closed**; this brainstormer did **not** re-run Playwright.

---

## 3. Three-layer orbit rule (exhaustive)

### 3.1 Why three layers exist

Industry and O&O both fail the same way: **a default prop that “works” until someone removes a prop, mocks a viewer without controls, or greps “OrbitControls” in a unit test and declares victory.** Buyers do not care about defaults. They drag the scene. CI must see **construction**, **wiring**, and **DOM truth**.

| Layer | Meaning | Pass condition | Fail mode if alone |
|-------|---------|----------------|--------------------|
| **1. Code defaults** | Lazy + Inner `enableControls` default = true; OrbitControls constructed when true | Reading defaults + construct path | Silent workspace omit still “works”; product can ship without explicit contract; no DOM hook |
| **2. Workspace wiring** | Product 3D branch **must** pass `enableControls={true}` or spread `getOpen3dViewerControlProps()` | Type-forced `{ enableControls: true }` on product path | Default alone; silent prop deletion still compiles if optional |
| **3. Proof** | Unit construct-spy + `data-orbit-enabled="true"|"false"` + Playwright wait + optional left-drag + evidence under `04-orbit-continuity/` | Artifacts + green run | “I clicked 3D once” anecdote; WAVE silence; unit-only |

**Merged expert P0 (EXPERT-PASS):**

> W4 orbit three-layer: defaults ON **and** workspace passes `enableControls={true}` **and** `data-orbit-enabled` + unit construct-spy. **Defaults alone ≠ W4 green.**

### 3.2 Layer 1 — product defaults (implementation shape)

| Concern | Locked product behavior |
|---------|-------------------------|
| Default | `enableControls = true` / `OPEN3D_ORBIT_DEFAULT_ENABLED` |
| Construction | When true: dynamic import `three/examples/jsm/controls/OrbitControls.js`, `new OrbitControls(camera, renderer.domElement)` |
| Damping | `enableDamping = true`, `dampingFactor = 0.08` |
| Polar clamp | `maxPolarAngle = Math.PI / 2 - 0.05` (ground-friendly; do not flip under floor) |
| Distance | `minDistance = 1`, `maxDistance = 40` (room-scale) |
| Rotate | **Left-button** drag (Three default) — **not** middle-only |
| Pan | Right-button / ctrl-drag (Three defaults) — do not disable |
| Zoom | Wheel enabled |
| Auto-rotate | **Off** for product open3d |

**Opt-out:** `enableControls={false}` allowed for **tests/stories only**, never product workspace branch.

### 3.3 Layer 2 — workspace explicit contract

Preferred pure helper (live + plan):

```text
getOpen3dViewerControlProps(): { enableControls: true }
  → return { enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED }
```

Product mount:

```text
viewMode === "2d" → FeasibilityCanvas tree
viewMode === "3d" → Lazy3DViewer projectData={live project} {...getOpen3dViewerControlProps()}
```

**Rules:**

1. Always pass **current** `workspaceCanvas.project` (floors + furniture pose).  
2. Do **not** clone/strip furniture pose when entering 3D.  
3. Do **not** clear selection solely because viewMode changed unless another phase defines it — **do not wipe entity pose**.  
4. `setViewMode` / TopBar radiogroup is the only mode switch.  
5. Unmount on 2D is OK; remount must not rewrite entity ids/poses.

**Why type `enableControls: true` (literal) matters:** silent `{ enableControls: boolean }` allows false without product review. The helper is the **contract**, not a convenience.

### 3.4 Layer 3 — proof surfaces

| Surface | What it proves |
|---------|----------------|
| `data-orbit-enabled="true"|"false"` on `data-testid="three-viewer-container"` | Playwright can wait without brittle private fields |
| OrbitControls constructor spy in Vitest | Construction when default/omit and when false |
| `OPEN3D_ORBIT_DEFAULT_ENABLED === true` unit | Constant cannot flip silently |
| Playwright: radio 3D → attr true → left-drag → radio 2D → count/id continuity | Buyer path |
| Evidence filenames under `04-orbit-continuity/` | Gate audit trail (P10) |

### 3.5 Anti-patterns (reject in review)

- `enableControls={false}` from `OOPlannerWorkspace`.  
- Relying on default alone without explicit workspace prop/helper.  
- Auto-rotate as the only motion.  
- Copying Planner5D/Floorplanner DOM structure or CSS for “orbit UI.”  
- Importing R3F orbit/camera memory from `Planner3DViewer` into open3d for W4.  
- Claiming “orbit works” from WAVE silence or from Layer 1 alone.  
- Using middle-button-only drag as product or e2e grammar (J4).

### 3.6 WAVE.md contradiction pattern

Historical WAVE-style claim: **“no orbit controls.”**  
Code may still construct OrbitControls. **P01 inventory rule** (reused for W4 honesty):

| Claim class | How to record |
|-------------|----------------|
| Code-present | OrbitControls import/construct path exists |
| Product-usable | Layers 2+3 closed + buyer drag works |
| Docs claim | WAVE may lag code — never treat docs as code-truth without path proof |

---

## 4. Document pose authority (architecture law)

### 4.1 Data flow diagram

```
Open3dProject (UUID entities, mm, furniture.rotation in DEGREES)
    │
    │  position + rotation on furniture / wall geometry
    │
    ├── 2D: FeasibilityCanvas reads project
    │       (viewMode === "2d")
    │
    └── 3D: Lazy3DViewer (ThreeLazyViewer.tsx)
              └── ThreeViewerInner
                    └── buildOpen3dSceneNodes(project)
                          → nodes: id, xMm, yMm, rotation (RADIANS), dims…
                    └── createSceneObjectFromNode / addNodesToGroup
                          → meshes tagged userData.entityId
                          → mesh.rotation.y = -node.rotation  (plan Y → world Z)
                    └── OrbitControls when enableControls === true
                    └── data-orbit-enabled on three-viewer-container
```

### 4.2 Continuity rule (normative)

| Statement | Force |
|-----------|-------|
| View mode is **chrome only** | Normative |
| **Document** is the **only** pose authority | Normative |
| Switching modes must **not** mutate furniture `position` / `rotation` / `id` | Normative |
| 3D rebuilds from `buildOpen3dSceneNodes`; it must **not invent** new poses | Normative |
| Returning to 2D **unmounts** Lazy3DViewer — expected | Normative |
| Remount re-reads the **same** project | Normative |
| Camera position across toggles is **non-goal** for W4 | Normative non-goal |
| Mesh sign flip is **not** document drift | Normative interpretation |

### 4.3 Unit bar for pose (what to assert)

From plan Task 01 + live tests (`documentViewContinuity`, `poseContinuityW4`):

1. **Stable ids across rebuild:** After place + pose update, two consecutive `buildOpen3dSceneNodes(project)` return identical `id`, `xMm`, `yMm` and **consistent** `rotation` (node radians from same document degrees).  
2. **Simulated view toggle (double rebuild):** Mutate nothing; rebuild twice; deep-equal furniture pose fields on nodes (models unmount/remount).  
3. **Pose edit survives “return to 2D”:** `updateFurniture` position/rotation in **degrees** on document; rebuild; node pose equals `degreesToRadians(document.rotation)`. Document still holds degrees.  
4. **Wall + furniture continuous:** wall id and furniture id unchanged after pose-only furniture update.

**Important correction vs early plan wording:**  
Early P04 line claimed “document + scene nodes = radians.” **False for furniture document.** Live adapter:

- Document: degrees (`normalizeDegrees`, pureActions `% 360`).  
- Nodes: radians (`degreesToRadians` in `buildOpen3dSceneNodes`).  
- Equality bar is **document fields stable** + **nodes deterministic from document**, not “raw number equality document.rotation === node.rotation.”

### 4.4 What may unmount / remount without counting as “drift”

| Object | Remount OK? | Pose authority |
|--------|-------------|----------------|
| Three scene graph | Yes | Rebuild from document |
| OrbitControls instance | Yes | New controls; camera may reset |
| WebGL renderer | Yes | Expected with Lazy3D unmount |
| Furniture UUID / mm / deg | **No change** | Document only |
| Wall geometry ids | **No rewrite** on mode toggle | Document only |

### 4.5 Selection vs pose (boundary with P03)

W4 must not thrash selection stores. Prefer: selection ids may hide in 3D chrome; **entity pose must not wipe**. Fabric furniture flag **OFF** for spine proofs (P03 expert). Dual selection (document + Fabric overlay) is thrash.

---

## 5. Degrees vs radians honesty (full stack)

### 5.1 Locked conventions (post expert pass)

| Layer | Unit | Functions / notes |
|-------|------|-------------------|
| Furniture **document** | **Degrees** | `normalizeDegrees`; properties UI; pureActions; Fabric mapper angle |
| Pick hit-test math | Radians (ephemeral) | `pickFurnitureAtPoint` converts degrees→rad for geometry only |
| Wall **scene** rotation from segment | Radians | `atan2(dy, dx)` at wall node build |
| Furniture **scene node** | **Radians** | `degreesToRadians(item.rotation)` in `buildOpen3dSceneNodes` |
| Mesh / GLB group | Three radians about Y | `rotation.y = -node.rotation` intentional |
| Orbit polar angles | Radians (Three API) | `maxPolarAngle = π/2 − 0.05` |

Live `units.ts` documents the contract:

```text
normalizeDegrees(value) → [0, 360)
degreesToRadians(degrees) → radians   // "Plan / document rotation is degrees; Three scene nodes use radians."
```

### 5.2 Why “convert furniture document to radians” is a false reverse

Expert table (fatal):

| Trap | Why fatal |
|------|-----------|
| Convert furniture document rotation → radians for “plan wording” | Rewrites pick, furniture actions, pureActions, fabric mapper, fixtures, properties UX |
| Treat mesh `-rotation.y` as pose drift | Document↔adapter equality is the bar; sign flip is coordinate system |
| Assert `document.rotation === node.rotation` without conversion | False FAIL forever after correct adapter |
| Store wall atan2 radians into furniture document | Contaminates 2D UI with Three units |

### 5.3 Where older plan text was wrong

| Source | Claim | Correction |
|--------|-------|------------|
| Early P04 architecture paragraph | Document + scene nodes use radians about vertical | **Document furniture = degrees**; nodes = radians after adapter |
| Expert revision still had residual “radians” lock in one P04 revision note | Conflicting | Prefer EXPERT-PASS + `01-react-open3d` + live `units.ts` + tests |
| Suggestions pose adapter table | “xMm/yMm/rotation (radians about vertical)” for document path | Partially true for **nodes**, false for **document furniture** |

### 5.4 Test contracts that lock honesty

| Test | Assertion |
|------|-----------|
| `orbitControlsDefault` | `normalizeDegrees(90)===90`, wrap 360→0, −90→270 |
| `documentViewContinuity` | Document stays degrees; node ≈ `degreesToRadians(doc)` |
| `poseContinuityW4` | Double rebuild; document rotation unchanged after rebuilds |
| Mesh factory regression | `-node.rotation` still intentional after adapter |

### 5.5 Display / BOQ note

Human-facing rotation in properties should remain **degrees**. BOQ/export paths must not silently emit radians as “angle °”. That is not a W4 deliverable but a **continuity hygiene** rule if export touches pose.

---

## 6. Imperative Three vs R3F (engine family honesty)

### 6.1 What ENGINE-DECISION says

From `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`:

| Layer | Decision |
|-------|----------|
| 3D | **Three + @react-three/fiber** |
| Orbit | Enable |
| Hybrid ban | No Konva + Fabric simultaneous interactive |

MASTER-CHART locked stack diagram:

```
Document (UUID, mm)
  ├── 2D: Fabric full stage (target) / Feasibility interim
  ├── 3D: R3F + Three + orbit
  ├── Catalog: real O&O SKUs + Block2D + modular mesh
  └── Persist: IDB → Supabase plans (member)
```

### 6.2 What open3d actually ships (path truth)

| Path | Reality |
|------|---------|
| Product open3d 3D | `ThreeViewerInner.tsx` — imperative Three module import, manual scene/renderer/camera, **OrbitControls.js** |
| Lazy boundary | `ThreeLazyViewer.tsx` exports `Lazy3DViewer`; `data-testid="planner-3d-canvas"` on **div** |
| Legacy / parallel | `Planner3DViewer` R3F path exists historically; **do not copy camera memory** into open3d for W4 |
| Packages installed | `three`, `@react-three/fiber`, `@react-three/drei` in stack research — **family**, not mandate to rewrite open3d viewer this phase |

### 6.3 Expert verdict: stay imperative for open3d mid-gate

From `03-r3f-3d.md` P0:

> Stay imperative Three for open3d: Live path is `ThreeViewerInner` + `OrbitControls.js`, **not** R3F `<Canvas>`. Do not thrash to @react-three/fiber mid-W4/W7 to satisfy ENGINE wording.

From EXPERT-PASS false-reverse #3:

> Port open3d 3D to R3F mid-gate — live path is imperative Three.

### 6.4 How to reconcile “ENGINE says R3F” with “open3d is imperative”

| Interpretation | Guidance |
|----------------|----------|
| **Family lock** | Stay in Three ecosystem; no Babylon/Unity switch |
| **R3F as optional React binding** | Valid for legacy viewer / future unification — **not** W4 acceptance |
| **Orbit ON** | Product requirement regardless of R3F vs imperative |
| **W4 acceptance** | Imperative OrbitControls + three-layer + continuity |

**Raised bar recommendation:** In CP-02 engine lock notes and P02 docs, state explicitly: *“Three family; open3d viewer = imperative Three + OrbitControls until a deliberate migration phase; R3F not required for W4 green.”* Prevents thrash from ENGINE wording alone.

### 6.5 Imperative vs R3F trade table (for future migration only)

| Concern | Imperative Three (open3d now) | R3F Canvas |
|---------|-------------------------------|------------|
| Lifecycle | Explicit dispose, content group clear | React tree + useFrame |
| Orbit | Manual OrbitControls construct | drei `<OrbitControls />` typical |
| SSR | Lazy dynamic already | Still needs client-only |
| Testability | Mock constructors / spies (W4 does this) | RTL + mock Canvas heavier |
| Thrash risk mid-W | Low if frozen | High if forced for wording |
| Consistency with ENGINE text | Family-yes, API-no | Literal match |

**Decision for P04:** Freeze imperative. Migration is a **separate** phase with its own proof, not a W4 task.

---

## 7. Competitive orbit / navigation patterns (inspiration only)

**Ethics fence (binding):** Patterns and JTBD only. No competitor JS, CSS, GLB, icons, screenshots in product, no pixel clone of chrome, no brand. Research lives under `D:\websites`. Firecrawl is **historical / dead** for routine re-scrape.

### 7.1 SYNTHESIS pattern library (binding summary)

From `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` and RESEARCH-MAP:

| Industry pattern | O&O translation | Gate |
|------------------|-----------------|------|
| Instant 2D↔3D | Same document UUIDs; browser proof; orbit in 3D | **P04 / W4** |
| 2D structure then decorate | Walls first; inventory second | P07 |
| Catalog-first place | Inventory place | P07 / W2 |
| Select + transform | Hit-test + delete | P03 |
| Save that returns | IDB + honesty | P06 |
| BOQ > photoreal | Differentiator | Engine decision |

### 7.2 Planner5D (toolbar / flow patterns)

Sources: `D:\websites\planner5d.com\report\TOOLBARS.md`, `INSPIRATION_REPORT.md`, `ETHICS_AND_INSPIRATION.md`, `DEEP_STACK_AND_PACKAGES.md`.

| Pattern (idea) | O&O mapping |
|----------------|-------------|
| Top bar **2D \| 3D** always visible | TopBar radiogroup `role="radio"` labels **2D** / **3D** |
| 2D for structure; 3D for furnish / inspect | Approach A: 2D Feasibility authoring; 3D inspect+orbit (edit-in-3D later) |
| Camera / render in top bar | O&O: **orbit default**; render/photoreal **out of W4** |
| Lazy modern browser WebGL | Lazy3DViewer + loading state |
| Hybrid Canvas/SVG 2D + Three/WebGL 3D (hiring/stack signals) | Feasibility/Fabric family + Three family — **our** implementations |

**Forbidden:** app.js/fastboot reuse, editor HTML/CSS clone, brand, GLB theft (ETHICS file binding).

### 7.3 Floorplanner (orbital vs walkthrough)

Source: `D:\websites\floorplanner.com\report\INSPIRATION.md` (manual-derived).

| Pattern | W4 adopt? |
|---------|-----------|
| One document, two camera paradigms, explicit 2D↔3D switch | **Yes** (switch + document) |
| **Orbital** inspect (dollhouse) | **Yes — product default** |
| Walkthrough eye-level + arrow keys | **Defer** |
| Double-click surface to move camera interest | Optional later |
| Edit objects in 3D | Later; W4 needs continuity + orbit, not full 3D authoring |
| Saved cameras / flythrough / 8K photoreal | **Out of Approach A** |

### 7.4 Homestyler (3D presence / walk)

Source: `D:\websites\homestyler.com\report\INSPIRATION.md`.

| Pattern | W4 adopt? |
|---------|-----------|
| Draw → Decorate → Visualize funnel | Product narrative only |
| 3D / roam with WASD + left-drag look | Roam = later; left-drag orbit/look grammar = industry default |
| Display modes solid/wire/x-ray | Later |
| Cloud render one-click | **Non-goal** (photoreal race) |
| Five-zone editor shell | Already O&O IA class; no pixel clone |

Scrape honesty: no live editor DOM; forum tutorials best signal; support scrape polluted.

### 7.5 RoomSketcher (continuity claim, thin orbit detail)

Source: `D:\websites\roomsketcher.com\report\INSPIRATION.md`.

| Pattern | Strength | W4 note |
|---------|----------|---------|
| Single project → 2D + 3D | Medium marketing | Matches document authority |
| Instant update both views | Medium claim | O&O proves with rebuild equality + browser |
| Exact orbit chrome | **Not in scrapes** | Design O&O-native |
| Photoreal / 360 | Marketing | Out of W4 |

### 7.6 Sketchfab-class navigation (from UI benchmark research)

Source: `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-benchmark.md`.

| Pattern | O&O |
|---------|-----|
| Orbit vs First-Person modes with explicit switch | Orbit default now; FP later |
| Standard orbit / pan / zoom | Three OrbitControls defaults |
| Custom chrome, not Sketchfab watermark layout | Phosphor + tokens |

### 7.7 Sweet Home 3D (open reference — algorithms, not paste)

Engine report notes dual-view continuity as class bar; license-aware study only; **do not paste GPL into MIT product**.

### 7.8 IKEA planners

SKU-first guided rooms; 2D↔3D continuity not their brand strength. O&O steals **SKU truth**, not orbit chrome.

### 7.9 3dplanner.com

**Parked domain / HugeDomains** — zero product inspiration (`D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md`). Do not treat as competitor.

### 7.10 Competitive continuity scoring (research snapshot)

From `comparison/01-engine/REPORT.md` and MASTER-CHART:

| Product | 2D↔3D continuity score (research) | Pattern O&O steals |
|---------|-----------------------------------:|--------------------|
| Planner5D | 5 / 4-class | Instant toggle, same doc |
| RoomSketcher | 5 | Measure + continuity narrative |
| Floorplanner | 4–5 | Orbital inspect + switch |
| Homestyler | 3–4 | 3D presence (not W4 bar alone) |
| O&O live (research day) | ~3 | Spine rebuild; polish + proof incomplete then |

Scores are **decision aids**, not license to clone, not live product truth today.

### 7.11 O&O-native interaction grammar (W4 ship shape)

| Control | O&O grammar |
|---------|-------------|
| Mode switch | `getByRole("radio", { name: "3D" })` / `"2D"` |
| 3D root | `data-testid="planner-3d-canvas"` (**div**) |
| Orbit truth | `data-testid="three-viewer-container"` + `data-orbit-enabled="true"` |
| Orbit drag | **Left** button ~40–50px |
| Host | `/planner/guest/?plannerDevTools=1` or `/planner/open3d` |
| Place for e2e | Prefer stable path (live e2e uses configurator **Place 4 seats**) |

---

## 8. Playwright / browser proof (contract + anti-flakes)

### 8.1 Spec locations

| Spec | Role |
|------|------|
| `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` | **Primary W4 browser** |
| Optional block in `open3d-world-standard-journey.spec.ts` | Shared journey if P07 pack owns serial path |
| Manifest | `site/config/build/playwright-open3d-world-specs.json` (W4 → w4 spec) |
| Unit guard | `playwrightOpen3dWorldSpecs.test.ts` expects W4 filename |

### 8.2 Live W4 e2e shape (honesty about what it proves)

The shipped e2e (read this checkout) does:

1. Enter guest planner via `enterGuestPlannerWorkspace`.  
2. Read furniture count from status text (`N furniture`).  
3. Place via **Workstation systems configurator → Place 4 seats** (avoids flaky catalog click).  
4. Assert count +4.  
5. Radio **3D** → wait `planner-3d-canvas` → wait orbit attr true.  
6. Optional **left-drag** on orbit container; assert canvas still visible.  
7. Radio **2D** → count restored.  
8. 3D again → orbit still true → 2D → count still same.  
9. Screenshots `01-2d-after-place.png`, `02-3d-orbit-on.png`, `03-2d-restored.png` + `browser-run.json`.  
10. Console error filter (exclude DevTools / favicon / net::ERR_).

**What this proves well:**

- Orbit attribute product path.  
- Toggle does not drop furniture count.  
- Left-drag does not crash shell.  
- Console hard errors captured.

**What this does not fully prove (raised bar):**

- Exact **UUID + mm + rotation degrees** round-trip in browser (count is proxy; units own pose equality).  
- Mesh presence / silhouette quality (P08).  
- Pose after hard reload (P06).  
- Selection continuity (P03).  

**Raised bar option (do not block historical PASS if already accepted):** add a testid or harness that exposes selected furniture id + pose for one entity after 3D→2D — still **document** fields, not Three internals.

### 8.3 Evidence directory contract

Canonical (RESULTS-MAP + phase card):

`D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\`

| Artifact | Source |
|----------|--------|
| `NOTES.md` | HEAD, approach A, three-layer table, pass/fail |
| `pose-continuity-vitest-raw.log` + `pose-continuity-run.json` | Task 01 |
| `orbit-default-vitest-raw.log` + `orbit-default-run.json` | Task 02 |
| `adapter-regression-vitest-raw.log` | Task 05 |
| `playwright-raw.log` / `browser-run.json` | Task 06 |
| `01-*.png` … `03-*.png` | Browser |
| `console-messages.txt` or filtered errors in run.json | Console clean claim |
| `THREE-LAYER-AUDIT.md` | Phase card claims audit landed |

**Layout law (AGENTS.md):** evidence only under repo-root `results/`. Never `site/results/`.

### 8.4 Commands (from phase cheat sheet)

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.ts --reporter=verbose
# actual file may be orbitControlsDefault.test.tsx
npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose
npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=line
```

Prefer `scripts/run-evidence-cmd.ps1` when piping into evidence.

### 8.5 Deferral honesty (status vocabulary)

| Word | Meaning |
|------|---------|
| Planned | Plan file only |
| Unit-green | Vitest under `04-orbit-continuity/` + layers 1–2 closed |
| Browser-green | Playwright + screenshots + console artifact |
| Done (W4) | Unit-green **and** browser-green (or owner-accepted browser deferral **in NOTES**) |

Do not use “done” for code-complete without evidence paths. Do not claim browser-green without PNGs.

### 8.6 Chrome-devtools manual path (when e2e blocked)

If Playwright harness fails environment:

1. Guest `?plannerDevTools=1`.  
2. Place ≥1 furniture.  
3. Radio 3D; DevTools assert `data-orbit-enabled="true"`.  
4. Left-drag; no console error.  
5. 2D→3D; document furniture unchanged (properties / status).  
6. Dump screenshots + console log into **04-** folder.  

Manual notes **must not** replace automated gate without owner waiver language.

---

## 9. Anti-J4 (legacy selector ban)

### 9.1 Why J4 is poison for open3d W4

Legacy `planner-j4-3d-parity.spec.ts` targets a **different chrome grammar**:

| J4 grammar | Open3d W4 grammar |
|------------|-------------------|
| `getByRole("button", { name: "3D" })` | `getByRole("radio", { name: "3D" })` |
| Split / parity chrome | TopBar radiogroup 2D\|3D |
| **Middle-button** drag | **Left-button** orbit |
| `canvas[data-testid="planner-3d-canvas"]` | `planner-3d-canvas` is a **div** wrapping viewer |
| Copy-paste selectors | **Forbidden** as W4 proof |

### 9.2 Locked open3d selectors

| Step | Selector / action |
|------|-------------------|
| Host | `/planner/guest/?plannerDevTools=1` **or** `/planner/open3d` |
| Mode 3D | `getByRole("radio", { name: "3D", exact: true })` |
| Mode 2D | `getByRole("radio", { name: "2D", exact: true })` |
| Mount | `[data-testid="planner-3d-canvas"]` then `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` |
| Orbit drag | Left button on viewer surface |
| Continuity | Furniture count and/or document ids after 3D→2D→3D |

### 9.3 Do-not-edit list for W4 proof thrash

| Path | Rule |
|------|------|
| `Planner3DViewer.tsx` | Do not thrash for W4 |
| `planner-j4-3d-parity.spec.ts` | Do not rewrite as open3d W4 proof |
| Competitor mock HTML under `D:\websites\...\toolbar-mock` | Study only; not product |

---

## 10. Buyer inspection journey (W4 storyboard)

### 10.1 Persona

**Facilities buyer / space planner** — not a developer, not a 3D artist. Job: “Can I see the layout in 3D to check clearances and presence of furniture I placed?”

### 10.2 Happy path (Approach A)

```
1. Open guest or open3d planner (zero-friction start preferred)
2. (Optional pre-W4) walls/room already present or template
3. Place ≥1 real O&O-scale furniture (cabinet-v0 / systems seats / desk)
4. Confirm 2D: ids live on document; status shows furniture count
5. Click TopBar radio "3D"
6. Wait: loading → three-viewer-container with data-orbit-enabled=true
7. Left-drag orbit; wheel zoom; right-drag pan if needed
8. Mentally verify furniture exists at expected room positions
9. Click "2D" — plan still has same furniture count/ids/poses
10. Optional: 3D again — remount rebuilds; no re-author
11. Console remains free of app errors
```

### 10.3 Failure journeys buyers feel (and how W4 prevents them)

| Buyer symptom | Root class | W4 countermeasure |
|---------------|------------|-------------------|
| “3D is empty” | Place never landed / project not passed | Live `projectData`; place before toggle |
| “Furniture jumped” | Pose rewrite / wrong units / mesh sign misread | Document authority + degrees→rad adapter tests |
| “I can’t rotate the view” | Orbit off / middle-only / no controls | Three-layer + left-drag e2e |
| “It crashed when I switched” | Console error / WebGL dispose race | Console capture; dispose discipline |
| “I lost my work switching views” | Mode switch mutates document | Continuity units; no pose mutate on setViewMode |
| “Pretty boxes but can’t inspect” | Auto-rotate only / locked camera | Auto-rotate off; free orbit |
| “Looks different every toggle” | Non-deterministic rebuild / random ids | UUID stable; pure rebuild |

### 10.4 JTBD framing (research-aligned)

| JTBD | Gate |
|------|------|
| Structure the room | W1 / P07 |
| Furnish with real SKUs | W2 / P07 |
| Fix mistakes (select/delete) | W3 / P03 |
| **Inspect in 3D without redoing layout** | **W4 / P04** |
| Come back tomorrow | W5–W6 / P06 |
| Trust product silhouettes | W7 / P08 |
| Trust tool labels | W8 / P09 |

W4 is the **inspection** gate, not the authoring gate. Authoring remains 2D-primary on Approach A.

### 10.5 Accessibility notes (boundary)

- Radiogroup 2D/3D is correct ARIA pattern.  
- Canvas/WebGL remains pointer-primary; keyboard orbit is **not** W4 minimum (document later if required).  
- Do not block W4 on full site a11y clean (separate residuals).  

---

## 11. Plan critique (brutal)

### 11.1 What the plan got right

1. **Three-layer orbit** — correctly anticipates default-only false green.  
2. **Document as sole pose authority** + remount rule.  
3. **Anti-J4** selectors locked early.  
4. **Evidence re-home** under `04-orbit-continuity/` not historical `document-view-continuity/`.  
5. **TDD task order** RED units → GREEN wiring → Playwright.  
6. **Non-goals** (camera bookmark, walk, photoreal) prevent scope cancer.  
7. **File map minimal** — touch list disciplined.  
8. **Ethics** section present.  
9. **Acceptance table W4.1–W4.6** is auditable.  
10. Expert suggestions S1–S12 closed soft spots before execute.

### 11.2 What the plan got wrong or left dangerous

| Issue | Severity | Detail |
|-------|----------|--------|
| **Radians-for-furniture wording** | **High** | Early plan locked document+nodes as radians; experts and live code contradict for document. Residual revision notes still mixed. **EXPERT-PASS wins.** |
| **R3F naming of expert file `03-r3f-3d.md`** | Medium | File name implies R3F; content correctly says stay imperative. Rename risk confuses agents. |
| **ENGINE “R3F” vs product imperative** | Medium | Without explicit reconciliation, thrash agents will “fix” W4 by porting to R3F. |
| **Status banner PASS vs missing results tree** | High for this checkout | Phase card header PASS + THREE-LAYER-AUDIT; **this disk has no `results/`**. Agents must re-prove. |
| **Browser pose = count proxy** | Medium | e2e furniture count ≠ mm/rotation equality; units carry real pose. Acceptable if NOTES admit it; dangerous if “pose continuity browser-green” over-claimed. |
| **Task checkbox state** | Low | Some task checkboxes still open in body while header says PASS — doc hygiene drift. |
| **“No git push unless owner asks” in phase vs AGENTS push when right** | Low | AGENTS.md allows agent push when landable; phase end is more conservative. Prefer AGENTS for git. |
| **Playwright place path** | Low–Med | Plan said inventory place or seed; live e2e uses configurator seats — **good flake fix**, document it as accepted variance. |
| **Parallel fill timing** | Medium | Experts: parallel orbit only after CP-02; spine W3→journey→save before scarce slots. Plan allows unit work without P03 — correct for pure continuity, but browser journey benefits from place path (configurator). |

### 11.3 Suggestions file quality

`P04-suggestions.md` is **excellent**: path verification table, priority order for revision, no TBD. It should remain the model for plan-only reviews.

### 11.4 Expert essay quality

| Essay | Strength | Gap |
|-------|----------|-----|
| `03-r3f-3d.md` | Three-layer, false-reverse table, path truth, mesh P08 handoff | Title “R3F” vs content |
| `01-react-open3d.md` | Degrees lock, host chain, save/select adjacency | Shared multi-phase — agents must filter P04 rows |

### 11.5 Kill-order fitness

INDEX spine: `CP-00 → CP-01 → CP-02 → CP-03 W3 → CP-07 journey → CP-06 save` then parallel fill (orbit · symbols · mesh · shortcuts).

**Critique:** Orbit as “parallel fill” is correct **if** pure units + wiring. Browser W4 needs **place**. Live e2e solved place without full P07 by using configurator. That is smart. Do not re-order entire spine for orbit alone.

---

## 12. Raised bar (above phase minimum)

Phase minimum is enough for **gate PASS**. Raised bar is for **buyer trust** and **anti-regression**:

### 12.1 Product raised bar

1. **Pose browser assertion** — at least one furniture UUID + x/y/rotation(deg) visible via test harness after round-trip (not only count).  
2. **Visual 3D presence** — screenshot shows non-empty room (not black canvas); optional pixel non-blank check.  
3. **Damping feel** — keep 0.08; document max polar so orbit never under-floor.  
4. **Loading UX** — “Initializing 3D…” then content; no infinite spinner.  
5. **WebGL fail path** — honest fallback message (not silent blank).  
6. **No auto-rotate** — locked off.  
7. **Selection id preservation** across mode (optional P03 collab).  
8. **Walls + furniture both visible** in 3D after place (not furniture-only empty room if walls exist).  

### 12.2 Engineering raised bar

1. **Single export** `orbitDefaults.ts` — no third parallel constant file.  
2. **Construct-spy unit** stays green under StrictMode double-mount (assert ≥1 construct carefully).  
3. **Dispose** on unmount — no GPU leaks across 20 toggles (manual stress optional).  
4. **Adapter pure** — `buildOpen3dSceneNodes` never reads React state.  
5. **Degrees property UX** — never show raw radians in inspector.  
6. **Evidence filenames locked** — P10 can harvest without archaeology.  
7. **THREE-LAYER-AUDIT.md** regeneratable from code + tests (not prose-only).  

### 12.3 Research raised bar (ethics)

1. Competitive “orbit default” is **idea**, not UI.  
2. No re-scrape for W4 re-open.  
3. Scores in MASTER-CHART do not override live path truth.  

### 12.4 Process raised bar (Elon standard floor)

1. **Proof over claim** — PASS only with paths that exist on disk.  
2. **Root cause** if orbit attr true but drag dead (pointer events, z-index, damping, camera).  
3. **No paper PASS** — unit-only is unit-green, not Done.  
4. **Commit as you go**; push when landable; mayoite ~45m.  

---

## 13. Approaches considered (implementation strategy)

### 13.1 Approach A (locked product journey) — W4 realization

| Pros | Cons |
|------|------|
| Fastest buyer inspection | 2D still Feasibility interim |
| Uses live Lazy3D path | Dual engines until Fabric later |
| Matches expert path truth | R3F wording confusion remains |

**Recommendation:** **Ship W4 on A.** Do not wait for Fabric.

### 13.2 Orbit implementation options

| Option | Description | Verdict |
|--------|-------------|---------|
| **A1** Defaults only | enableControls default true | **Reject** as sole W4 |
| **A2** Explicit prop + defaults + attr + units | Three-layer | **Accept (shipped shape)** |
| **A3** Always-on OrbitControls, delete prop | Removes opt-out for tests | Reject — tests need false |
| **A4** Custom camera math without OrbitControls | NIH | Reject — MIT Three controls fine |
| **A5** drei OrbitControls via R3F rewrite | ENGINE literal | **Reject for W4** |
| **A6** Middle-button orbit only | Matches some DCC | Reject for web buyers + J4 trap |

### 13.3 Continuity implementation options

| Option | Description | Verdict |
|--------|-------------|---------|
| **C1** Keep both 2D and 3D mounted, hide CSS | Faster toggle; dual cost | Optional later; not required |
| **C2** Unmount 3D on 2D; document authority | Current | **Accept** |
| **C3** Camera bookmark store on toggle | Nice | Non-goal W4 |
| **C4** Serialize Three scene into document | Madness | Reject |
| **C5** Split dual view always | SH3D-class | Later product; not W4 minimum |

### 13.4 Rotation unit options

| Option | Verdict |
|--------|---------|
| Document degrees, node radians (adapter) | **Accept — live** |
| Document radians everywhere | False reverse — massive rewrite |
| Document degrees, node degrees, convert at mesh only | Possible alternate; live chose node radians — **do not thrash mid-gate** |

### 13.5 Playwright place options

| Option | Verdict |
|--------|---------|
| Inventory catalog click + canvas | Flaky historically |
| Configurator Place N seats | **Live W4 e2e — accept** |
| Pure seed inject via test API | Fine for unit; weaker buyer story |
| Depend on full P07 journey only | Delays W4 unnecessarily if configurator works |

---

## 14. Failure modes (catalog)

### 14.1 Product / UX failures

| ID | Failure | Detection | Fix class |
|----|---------|-----------|-----------|
| F1 | Orbit disabled in product | Attr false; cannot left-drag | Layer 2+3 |
| F2 | Orbit works in unit, dead in browser | Pointer events / overlay / z-index | Chrome layout |
| F3 | Pose jumps on toggle | Continuity unit red | Adapter / accidental mutate |
| F4 | New UUIDs each 3D entry | Id equality unit | Stop re-place on mount |
| F5 | Degrees shown as radians in UI | Manual / unit properties | Display path |
| F6 | Mesh appears rotated 90° wrong | Visual | Sign flip vs document bug separation |
| F7 | Black WebGL canvas | Console + screenshot | Context / size 0 / theme |
| F8 | Infinite “Initializing 3D…” | Timeout | three import fail |
| F9 | Console errors on toggle | Playwright listener | Dispose / React key thrash |
| F10 | Auto-rotate confuses inspection | Visual | Force autoRotate false |
| F11 | Under-floor camera | Polar clamp missing | Restore maxPolarAngle |
| F12 | Orbit too zoomed / clipped | min/max distance | Keep 1–40 room scale |

### 14.2 Process / gate failures

| ID | Failure | Detection |
|----|---------|-----------|
| G1 | Layer-1-only PASS | Missing attr / workspace prop / evidence |
| G2 | J4 selectors copied | e2e fails or tests wrong product |
| G3 | Evidence under `site/results` | `pnpm run check:layout` |
| G4 | R3F rewrite mid-gate | Diff thrash; W delayed |
| G5 | Furniture→radians document rewrite | Mass test fail in pick/actions |
| G6 | Claiming PASS without `results/` on disk | Inventory |
| G7 | Unit-green called Done | Status vocabulary |
| G8 | Photoreal scope creep as “3D works” | Non-goals |

### 14.3 Adjacency failures (not W4 but cascade)

| ID | Failure | Phase |
|----|---------|-------|
| A1 | Cannot place furniture → cannot prove continuity | P07 / configurator |
| A2 | Select broken → buyer cannot edit before inspect | P03 |
| A3 | Save drops pose overnight | P06 |
| A4 | Apology boxes → orbit works but product still “not real” | P08 |
| A5 | Shortcut labels lie about 3D | P09 |

---

## 15. Linkage to W7 / P08 mesh quality

### 15.1 Shared expert file

`03-r3f-3d.md` is **primary for P04** and **also for P08**. That is intentional: same viewer path, different bar.

| Concern | P04 / W4 | P08 / W7 |
|---------|----------|----------|
| Pose / ids | **In scope** | Consume stable pose |
| Orbit | **In scope** | Needed to inspect mesh |
| Toe → carcass → door | Out of scope | **In scope** |
| Photoreal | Out | Out |
| Imperative Three | Lock both | Lock both |
| Evidence folder | `04-orbit-continuity/` | `08-mesh-quality/` |
| Headless mesh PNG | Optional | Default smoke for CP-08 |

### 15.2 Dependency direction

```
P04 orbit + continuity
    │
    │  buyer can orbit and see *something* at correct pose
    ▼
P08 mesh quality
    │  something becomes readable toe/carcass/door
    ▼
Buyer inspection journey becomes manufacturer-trustable
```

**P08 does not require** P04 browser if headless mesh PNG is used — but **product story** requires both: correct pose **and** readable parts.

### 15.3 Shared false reverses

| Trap | P04 | P08 |
|------|-----|-----|
| R3F thrash | Yes | Yes |
| Designer static GLB | Ethics | Ethics |
| Photoreal to “pass” | Yes | Yes |
| J4 selectors | Yes | Less relevant |
| Height overshoot with toe | No | Yes |

### 15.4 createSceneObjectFromNode bridge

W4 regression Task 05 reads mesh factory only to ensure **pose mapping** (`xMm/yMm`, `-rotation.y`) still holds. P08 may change **children** of modular groups without changing pose contract. **Blast tests** must keep pose units green when mesh children grow toe→door.

### 15.5 Handover sentence for mesh agents

> Do not reopen orbit defaults or document rotation units while adding toe. Pose authority and OrbitControls three-layer are **closed contracts**. Raise silhouette only.

---

## 16. File map (touch / read) for execute agents

### 16.1 Primary touch list (W4)

| Role | Absolute path |
|------|----------------|
| Orbit host | `D:\OandO07072026\site\features\planner\open3d\3d\ThreeViewerInner.tsx` |
| Lazy wrapper | `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx` |
| Orbit contract | `D:\OandO07072026\site\features\planner\open3d\3d\orbitDefaults.ts` |
| Workspace wiring | `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` |
| Units | `D:\OandO07072026\site\features\planner\open3d\model\units.ts` |
| Pose adapter | `D:\OandO07072026\site\features\planner\open3d\3d\buildOpen3dSceneNodes.ts` |
| Mesh factory | `D:\OandO07072026\site\features\planner\open3d\3d\createSceneObjectFromNode.ts` |
| Orbit unit | `D:\OandO07072026\site\tests\unit\features\planner\open3d\orbitControlsDefault.test.tsx` |
| Continuity units | `...\documentViewContinuity.test.ts`, `...\poseContinuityW4.test.ts` |
| Playwright | `D:\OandO07072026\site\tests\e2e\open3d-w4-orbit-continuity.spec.ts` |
| Evidence | `D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\` |

### 16.2 Read-only expected

| Path | Why |
|------|-----|
| `TopBar.tsx` | Radios already labeled; edit only if testid needed |
| `model/types.ts` | Pose fields expected stable |
| `Planner3DViewer.tsx` | Legacy R3F — do not thrash |
| Hosts | `Open3dPlannerHost`, `Open3dNativeHost`, routes |

### 16.3 Host chain (from React expert)

```
app/planner/open3d → features/planner/ui/Open3dPlannerHost
  → open3d/ui/Open3dNativeHost → OOPlannerWorkspace

guest/canvas → Open3dPlannerWorkspaceRoute (+ gate) → same Host
```

Prefer guest `?plannerDevTools=1` for clean IDB during e2e.

---

## 17. Acceptance matrix (W4) — operationalized

| ID | Criterion | Unit | Browser | Notes |
|----|-----------|------|---------|-------|
| W4.1 | Entity ids stable across 2D↔3D rebuild | Double rebuild | Count / optional id harness | Document UUIDs |
| W4.2 | Position + rotation match document after rebuild | degrees + rad convert | Count proxy today | Raise bar: explicit pose |
| W4.3 | Orbit default ON three-layer | Helper + construct + attr | attr true | All three required |
| W4.4 | Left-drag without crash | — | e2e drag | Not middle |
| W4.5 | Console clean | — | filtered errors | Artifact required |
| W4.6 | No competitor code/assets | Review | — | Three MIT OrbitControls only |

---

## 18. Task checklist (plan Tasks 00–07) — agent map

| Task | Intent | Done shape |
|------|--------|------------|
| 00 | Evidence scaffold + NOTES | Folder + baseline layers recorded |
| 01 | RED/GREEN pose continuity units | Double rebuild under 04- |
| 02 | RED/GREEN orbit default units | Helper + construct-spy |
| 03 | GREEN Inner/Lazy + `data-orbit-enabled` | Attr true/false |
| 04 | GREEN workspace explicit props | `getOpen3dViewerControlProps` |
| 05 | Adapter regression suite | build + createScene green |
| 06 | Playwright contract | PNGs + run.json or honest deferral |
| 07 | Commit + CP-04 | Local commits; CP checkboxes |

Live code suggests **01–05 and 06 shape already landed in `site/`**; re-verify evidence tree before claiming green on a clean machine.

---

## 19. Ethics / licenses

| Allowed | Forbidden |
|---------|-----------|
| Orbit as default 3D navigation pattern | Competitor JS/CSS/GLB/logos |
| Explicit top-bar 2D\|3D toggle idea | Cloning trade dress |
| Lazy-load 3D on first activation | Re-scraping into `site/` |
| O&O Phosphor + CSS modules | “Make it look like brand X” |
| Three.js MIT OrbitControls | Shipping scraped bundles |
| Study SH3D dual-view under license | Paste GPL into MIT product |

Cleared packages: `ayushdocs/17-LICENSES-CLEARED.md` (pointer). No new paid seats for W4.

---

## 20. Kill order & adjacency summary

```
CP-00 ethics
  → CP-01 product truth (orbit code vs WAVE)
  → CP-02 engine lock (Three family; Feasibility interim)
  → CP-03 W3 select/delete
  → CP-07 journey (place)
  → CP-06 save
  → parallel: CP-04 orbit · CP-05 symbols · CP-08 mesh · CP-09 shortcuts
  → CP-10 handover
```

**P04 unit work** can proceed without P03 browser.  
**P04 browser** needs a place path (configurator or inventory).  
**P08** needs P04 contracts frozen, not reopened.

---

## 21. Recommended agent execute order (if re-opening W4)

1. Inventory three-layer on disk (workspace prop, attr, constants).  
2. Run orbit + pose units; capture logs into `04-orbit-continuity/`.  
3. Run `open3d-w4-orbit-continuity.spec.ts`; capture PNGs + browser-run.json.  
4. Write/update NOTES + THREE-LAYER-AUDIT with HEAD.  
5. If any red: fix with TDD; do **not** convert degrees; do **not** port R3F.  
6. Commit slices; push when green enough; do not force-push.  

---

## 22. Brutal pushback (honesty section)

1. **“GATE PASS” without `results/` on this machine is not re-proven.** Do not ship confidence from markdown headers alone.  
2. **Furniture count continuity is weaker than pose continuity.** Admit the proxy or raise the e2e.  
3. **Calling the expert file “r3f-3d” while forbidding R3F rewrite is self-inflicted confusion.** Rename or add a banner in the file.  
4. **ENGINE-DECISION “Three+R3F” without open3d imperative note is a thrash magnet.** Fix the decision text when next editing P02.  
5. **Orbit without mesh quality still feels like a toy.** W4 is necessary but not sufficient for “product works.”  
6. **Do not re-scrape competitors to “improve orbit.”** The grammar is known; the work is proof.  
7. **Defaults-only PASS is a known industry and internal lie.** Three-layer is non-negotiable.  
8. **Camera bookmark is a feature request dressed as continuity.** Reject for W4.  

---

## Appendix A — Full path index

### A.1 Phase & plan

| Path |
|------|
| `D:\OandO07072026\Plans\phases\P04-orbit-continuity\P04-orbit-continuity.md` |
| `D:\OandO07072026\Plans\phases\P04-orbit-continuity\P04-suggestions.md` |
| `D:\OandO07072026\Plans\phases\P04-orbit-continuity\01-react-open3d.md` |
| `D:\OandO07072026\Plans\phases\P04-orbit-continuity\03-r3f-3d.md` |
| `D:\OandO07072026\Plans\phases\P04-orbit-continuity\README.md` |
| `D:\OandO07072026\Plans\phases\EXPERT-PASS.md` |
| `D:\OandO07072026\Plans\INDEX.md` |
| `D:\OandO07072026\Plans\README.md` |
| `D:\OandO07072026\Plans\phases\P08-mesh-quality\P08-mesh-quality.md` |
| `D:\OandO07072026\Plans\phases\P08-mesh-quality\03-r3f-3d.md` |
| `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md` |
| `D:\OandO07072026\Plans\Research\RESULTS-MAP.md` |
| `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE.md` |
| `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE-2.md` |
| `D:\OandO07072026\Plans\Research\Others\00-PENDING.md` |
| `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` |

### A.2 Product / tests (open3d W4-relevant)

| Path |
|------|
| `D:\OandO07072026\site\features\planner\open3d\3d\ThreeViewerInner.tsx` |
| `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx` |
| `D:\OandO07072026\site\features\planner\open3d\3d\orbitDefaults.ts` |
| `D:\OandO07072026\site\features\planner\open3d\3d\buildOpen3dSceneNodes.ts` |
| `D:\OandO07072026\site\features\planner\open3d\3d\createSceneObjectFromNode.ts` |
| `D:\OandO07072026\site\features\planner\open3d\3d\loadGeneratedGlbObject.ts` |
| `D:\OandO07072026\site\features\planner\open3d\3d\index.ts` |
| `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` |
| `D:\OandO07072026\site\features\planner\open3d\editor\TopBar.tsx` |
| `D:\OandO07072026\site\features\planner\open3d\model\units.ts` |
| `D:\OandO07072026\site\features\planner\open3d\model\actions\furniture.ts` |
| `D:\OandO07072026\site\features\planner\open3d\canvas-fabric-stage\furnitureFabricMapper.ts` |
| `D:\OandO07072026\site\tests\unit\features\planner\open3d\orbitControlsDefault.test.tsx` |
| `D:\OandO07072026\site\tests\unit\features\planner\open3d\documentViewContinuity.test.ts` |
| `D:\OandO07072026\site\tests\unit\features\planner\open3d\poseContinuityW4.test.ts` |
| `D:\OandO07072026\site\tests\e2e\open3d-w4-orbit-continuity.spec.ts` |
| `D:\OandO07072026\site\tests\e2e\planner-j4-3d-parity.spec.ts` (anti-pattern reference) |
| `D:\OandO07072026\site\tests\unit\config\playwrightOpen3dWorldSpecs.test.ts` |

### A.3 Evidence (canonical — may be missing on clean checkout)

| Path |
|------|
| `D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\` |
| `D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\` |
| Historical: `results/planner/document-view-continuity/` (re-home only; not CP-04 home) |

### A.4 D:\websites research (3D / orbit / continuity relevant)

| Path | Use |
|------|-----|
| `D:\websites\README.md` | Research home map |
| `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` | Instant 2D↔3D pattern |
| `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` | Three+R3F lock |
| `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` | Continuity winners |
| `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md` | Engine deep dive |
| `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md` | Brutal self-score |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-ui-benchmark.md` | 2D/3D mode switch rules; Sketchfab nav |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-packages.md` | three/r3f/drei package notes |
| `D:\websites\research\from-repo-Plans-Research\RESEARCH-2026-07-05-synthesis.md` | Prior synthesis |
| `D:\websites\planner5d.com\report\TOOLBARS.md` | 2D\|3D chrome zones |
| `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` | Product loop |
| `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md` | Fence |
| `D:\websites\planner5d.com\report\DEEP_STACK_AND_PACKAGES.md` | Three stack signals |
| `D:\websites\floorplanner.com\report\INSPIRATION.md` | Orbital vs walkthrough |
| `D:\websites\homestyler.com\report\INSPIRATION.md` | 3D presence / WASD |
| `D:\websites\roomsketcher.com\report\INSPIRATION.md` | Continuity claims; thin orbit |
| `D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md` | Parked — skip |
| `D:\websites\oando-render-options\CANVAS_RENDER_OPTIONS.md` | 2D vs WebGL options |
| `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` | SKU-first (adjacent) |

### A.5 Idiots deliverable

| Path |
|------|
| `D:\OandO07072026\Idiots\README.md` |
| `D:\OandO07072026\Idiots\P04-orbit-continuity\REPORT.md` (**this file**) |

---

## Appendix B — Long research notes (condensed primary sources)

### B.1 SYNTHESIS — Instant 2D↔3D

Industry web planners sell **one mental model**: the plan you draw is the world you inspect. The implementation pattern is not “two documents,” it is **one document, two projections**. O&O translation is mechanical:

1. UUID entities in mm on `Open3dProject`.  
2. 2D projection = FeasibilityCanvas draw/hit-test.  
3. 3D projection = scene node rebuild + mesh factory.  
4. Toggle must not rewrite (1).  
5. 3D must allow free orbit to inspect.

Without (5), 3D is a screenshot generator. Without (4), 3D is a re-authoring tax.

### B.2 ENGINE-DECISION — 3D family

Decision table freezes **Three + R3F**, enables orbit, bans Unity, keeps model-viewer for admin single-SKU spin, bans photoreal race. For open3d **execute**, interpret as:

- **Stay Three.**  
- **Orbit ON.**  
- **R3F = family / optional React binding**, not a forced rewrite of `ThreeViewerInner` during W gates.  
- Mesh quality is content (modular parts), not engine switch.

### B.3 Engine comparison report — continuity column

Winners (P5D, RoomSketcher, SH3D, Floorplanner) share:

- Same placement IDs across views.  
- Toggle or split without rebuild friction for the **user** (engine may rebuild internally).  
- Structure authored primarily in 2D; 3D is presence + navigation + later decorate.

O&O live scored ~3: shared document rebuild exists; product polish + orbit proof incomplete on research day. W4 closes the **proof + orbit default** gap, not the mesh gap.

### B.4 Floorplanner orbital grammar

Manual-derived product grammar separates:

- **Orbital** — inspect around model (W4).  
- **Walkthrough** — eye-level (later).  

Also: deselect returns to camera mode; edit-in-3D is secondary. O&O Approach A matches: **2D author, 3D inspect**, not full dual-authoring CAD.

### B.5 Planner5D chrome zones

Top bar carries **2D|3D** next to project/share/account. Left tools, center canvas, right catalog. O&O already maps to TopBar radios + WorkspaceShell. Do not import their red FAB or catalog assets.

### B.6 Homestyler 3D navigation

Left-drag look + WASD roam is consumer 3D grammar. W4 adopts **left-drag orbit** via OrbitControls, not full roam product. Cloud render is a different product loop (Visualize) — not W4.

### B.7 RoomSketcher honesty

Strong for measure/openings; **weak for orbit control docs**. Do not invent RoomSketcher orbit claims. Continuity marketing line is enough: same project drives both views.

### B.8 UI benchmark 2D/3D mode switch rules

From 2026-07-05 UI research:

| Rule | W4 apply |
|------|----------|
| Explicit toggle in top bar | Radiogroup |
| Lazy-load 3D on first activation | Lazy3DViewer |
| Preserve object IDs | Document authority |
| Preserve camera intent | **Non-goal** (explicitly deferred) |
| Loading progress + fallback | Loading state + error state in Inner |

### B.9 O&O self-score (brutal) — 3D slice

Self report scored 3d_engine **2**: rebuild from UUIDs exists; mesh is procedural boxes; G8 GLB incomplete. **Orbit/continuity proof** was open on research day. W4 does not raise mesh score; it raises **navigability and continuity proof**. Expect overall product feel to remain “spine not ship” until W7 + journey + save also feel real.

### B.10 Canvas render options — hybrid model

`CANVAS_RENDER_OPTIONS.md` recommends hybrid: 2D Canvas/SVG for plan; WebGL Three for volume. Failures differ (2d context null vs WebGL blocked). W4 assumes WebGL path works; if not, product must fail **honestly**, not claim orbit.

### B.11 Package inventory notes

three + r3f + drei are keep/family. OrbitControls from `three/examples/jsm/controls` is the open3d path — no new dependency required for W4.

### B.12 3dplanner.com

Zero value. Domain sale page. Do not schedule re-crawl.

---

## Appendix C — Glossary

| Term | Meaning |
|------|---------|
| **Document** | `Open3dProject` — sole pose authority |
| **Scene node** | Pure adapter output of `buildOpen3dSceneNodes` |
| **Mesh** | Three object from node (procedural or generated GLB) |
| **Three-layer orbit** | Defaults + workspace explicit + proof attr/units |
| **W4** | World gate: pose continuity + orbit ON |
| **CP-04** | Checkpoint for P04 |
| **Approach A** | Product journey on Feasibility + document first |
| **J4** | Legacy planner journey/chrome with wrong selectors for open3d |
| **Imperative Three** | Manual scene/renderer without R3F Canvas |
| **R3F** | `@react-three/fiber` React binding to Three |
| **degrees** | Furniture document rotation unit |
| **radians** | Node/mesh/OrbitControls angular unit |

---

## Appendix D — One-page execute card (for subagents)

```
GOAL: W4 orbit + 2D↔3D continuity proof
STACK: Feasibility 2D + document + Lazy3D imperative Three + OrbitControls
DO:
  1) three-layer orbit (defaults, getOpen3dViewerControlProps, data-orbit-enabled)
  2) pose units: document degrees stable; nodes rad via degreesToRadians; double rebuild
  3) Playwright: radio 2D|3D, div planner-3d-canvas, left-drag, count/pose, console
  4) evidence only under results/planner/world-standard-wave/04-orbit-continuity/
DON'T:
  - convert furniture document to radians
  - port open3d to R3F mid-gate
  - copy J4 selectors / middle-only drag
  - claim green from defaults alone
  - thrash mesh photoreal / save / select in this phase
  - competitor assets
PROOF: units + browser artifacts or honest NOTES deferral
```

---

## Appendix E — Contradiction register (resolve with live path)

| # | Claim A | Claim B | Resolution |
|---|---------|---------|------------|
| 1 | P04 early: document+nodes radians | Expert: furniture document degrees | **Degrees document; radians nodes** |
| 2 | ENGINE: Three+R3F | Expert: imperative Three for open3d | **Family R3F; product path imperative** |
| 3 | WAVE: no orbit | Code: OrbitControls when enabled | **Inventory code-present vs product-proven** |
| 4 | Phase header PASS | This checkout missing `results/` | **Re-prove evidence before trusting** |
| 5 | Plan e2e inventory place | Live e2e Place 4 seats | **Accepted flake-resistant place path** |
| 6 | Research O&O continuity score 3 | Owner W4 GATE PASS | **Gate can pass while product half** |
| 7 | Floorplanner/R3F wording in inspiration | Open3d OrbitControls.js | **Pattern only; implementation ours** |

---

## Appendix F — Sample NOTES.md skeleton (for execute, not created here)

When writing evidence NOTES (execute phase — not this brainstormer deliverable), include:

1. HEAD commit hash  
2. Approach A confirmation  
3. Three-layer table with path:line or test names  
4. Degrees/radians contract sentence  
5. Unit command results  
6. Playwright command results + screenshot list  
7. Known gaps (count proxy vs full pose e2e)  
8. Explicit non-claims (mesh quality, cloud save)  

---

## Appendix G — Message to P05 / P06 / P07 / P08 / P09 agents

| Phase | What P04 freezes for you |
|-------|--------------------------|
| **P05** | View mode does not rewrite furniture ids; Block2D can assume stable document |
| **P06** | Pose must survive save/reload — same document fields W4 protects across views |
| **P07** | Journey may include radio 3D step; use open3d selectors not J4 |
| **P08** | Orbit works for inspection; raise mesh children only; keep `-rotation.y` contract |
| **P09** | 2D/3D are radios; do not rebind mode switch to wrong keys without tests |
| **P10** | Harvest `04-orbit-continuity/` only; refuse PASS without artifacts |

---

## Appendix H — Closing verdict

**P04 is the inspection gate.** Architecture is sound: document authority, rebuild 3D, three-layer orbit, degrees in furniture document, imperative Three, anti-J4 browser grammar, ethics fence clear.

**The only honest Done** is evidence under `results/planner/world-standard-wave/04-orbit-continuity/` plus non-contradictory live wiring. Code in this checkout **appears** to implement the contract; **this brainstormer did not re-run the gate**. Owner narrative correctly separates **GATE PASS** from **product finished**.

**Next human/agent action if unsure:** run the unit + Playwright commands in §8.4, land artifacts, update NOTES with HEAD. Do not rewrite engines. Do not convert degrees. Do not clone competitors.

---

*End of REPORT.md — Brainstormer 04/10 · P04 Orbit Continuity · write-only `Idiots\P04-orbit-continuity\` · no product code.*
