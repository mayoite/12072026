# P07 — Draw / Place Browser Journey (W1–W2)  
## Brainstormer Report · Agent 07/10 · 2026-07-10

**Mode:** Design / brainstorm only · **No product code in this deliverable**  
**Write scope:** `Idiots/P07-draw-place-journey/` only  
**Checkout:** `D:\OandO07072026`  
**Phase folder:** `Plans/phases/P07-draw-place-journey/`  
**Checkpoint:** **CP-07**  
**Gates owned:** **W1** (draw walls + door/opening) · **W2 place half** (place ≥2 incl. `cabinet-v0`, non-blank 2D)  
**Canonical evidence:** `results/planner/world-standard-wave/02-browser-open3d-journey/`  
**Optional alias:** `results/planner/world-standard-wave/07-browser-journey/` (pointer/NOTES only — not a third evidence name)

---

## 0. One-line mission

Prove, in a **real browser**, that an **unaided facilities buyer** can open the O&O open3d planner, **draw structure** (walls metric **increases**, then door/opening **objects increase**), and **place ≥2 real catalog SKUs including `cabinet-v0`**, with serial Playwright screenshots + `playwright-run.json` under the gold `02-browser-open3d-journey/` folder — without seed false-green, without configurator cheat as primary pass, without claiming symbol quality (P05) or select/delete (P03) from this phase alone.

---

## 1. Sources read (exhaustive inventory)

### 1.1 Phase pack (all files)

| File | Role |
|------|------|
| `Plans/phases/P07-draw-place-journey/P07-draw-place-journey.md` | Execute card — gates, tasks 00–5, CP-07 checklist, failure table |
| `Plans/phases/P07-draw-place-journey/P07-appendix.md` | Playwright skeletons: `getFurnitureCount`, serial header, entry helper, W1/W2 scripts, proof JSON, npm script, alias NOTES |
| `Plans/phases/P07-draw-place-journey/P07-suggestions.md` | S1–S12 path-verified suggestions (serial, deltas, baseURL, SKU lock, honesty) |
| `Plans/phases/P07-draw-place-journey/README.md` | Local index |
| `Plans/phases/P07-draw-place-journey/01-react-open3d.md` | React/open3d expert (shared with P03/P04/P06) — metrics helpers valid; guest seed ≥4 walls; host chain truth |
| `Plans/phases/P07-draw-place-journey/04-playwright-evidence.md` | Playwright/evidence expert — serial, deltas, folder lock, false-green table |
| `Plans/phases/EXPERT-PASS.md` | Consolidated must-fix #7–#8: serial journey + getFurnitureCount + folder discipline |

### 1.2 Program maps & design

| File | Role for P07 |
|------|----------------|
| `Plans/INDEX.md` | Kill order: spine **#4** after W3; evidence folder `02-browser-open3d-journey/` |
| `Plans/Research/RESEARCH-MAP.md` | Phase → research pack routing; P07 opens P5D loop + Homestyler ease-of-start |
| `Plans/Research/RESULTS-MAP.md` | Folder lock, forbidden names, map minimum artifacts for CP-07 |
| `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | North star buyer; W1/W2 gate definitions; Approach A locked |
| `Idiots/README.md` | Brainstormer program contract: one REPORT.md per phase |

### 1.3 Live repo facts (re-proved for this report — not trusted from plan alone)

| Path | Fact |
|------|------|
| `site/tests/e2e/open3d-world-standard-journey.spec.ts` | **Exists** — but is a **partial / divergent** journey (see §4) |
| `site/tests/e2e/plannerCanvasHelpers.ts` | `getWallCount`, `getObjectCount`, `placeOpeningOnCanvas`, `placeCatalogOnCanvas`, `placeSeatsFromConfigurator` present; **`getFurnitureCount` missing** |
| `site/tests/e2e/guestProjectSetup.ts` | Clears planner storage; guest `?plannerDevTools=1`; **Start from Scratch** seeds shell |
| `site/tests/e2e/planner-guest-workspace.spec.ts` | Gold proof: Start from Scratch → **≥4 walls**, **0 furniture** |
| `site/tests/e2e/admin-svg-publish-p01.spec.ts` | Gold evidence **shape**: flat dir + numbered PNGs + JSON under `results/planner/…` |
| `site/features/planner/open3d/editor/demoCatalogItems.ts` | `cabinet-v0` (`geometryMode: "modular-cabinet-v0"`) + `sample-desk-1` live |
| `site/package.json` | `test:e2e:open3d-world` exists; **`test:e2e:world-standard-w1w2` not present** (plan name) |
| `site/config/build/playwright-open3d-world-specs.json` | Maps `W1-W2` → journey spec |
| `results/planner/world-standard-wave/` | **Missing on disk at report time** — no GREEN CP-07 artifacts yet |

### 1.4 Research packs (`D:\websites`) — reports + maps (ideas only)

| Pack / path | Use for P07 |
|-------------|-------------|
| `research/2026-07-09-world-standard/SYNTHESIS.md` | Core loop: structure then decorate; drag place; guest zero-friction |
| `research/2026-07-09-world-standard/comparison/MASTER-CHART.md` | Ease / inventory winners vs O&O ~2.0 |
| `research/2026-07-09-world-standard/comparison/04-ease/REPORT.md` | **Primary ease-of-start matrix**; O&O avg **2.1**; patterns for guest + empty triad + 10-min metric |
| `research/2026-07-09-world-standard/comparison/03-inventory/REPORT.md` | Place UX patterns; IKEA SKU truth; O&O must-win sku_mm |
| `research/2026-07-09-world-standard/comparison/07-oando-self/REPORT.md` | Brutal self-score: **ease = 1**; unaided journey missing is deficit #1 |
| `planner5d.com/report/INSPIRATION_REPORT.md` | **P5D loop**: template/blank → structural 2D → furnish → 3D → export; “10 minutes” pitch |
| `planner5d.com/report/TOOLBARS.md` | Chrome regions; furniture placement as first-class |
| `planner5d.com/report/ETHICS_AND_INSPIRATION.md` | Binding non-copy rules |
| `homestyler.com/report/INSPIRATION.md` | **Ease-of-start funnel** Draw → Decorate → Visualize; five-zone shell; scrape honesty |
| `floorplanner.com/report/INSPIRATION.md` | Room wizard / draw room / wall-by-wall; drag-drop library; orbital 3D |
| `roomsketcher.com/report/INSPIRATION.md` | Structure then openings (click wall); catalog two-step place; journey funnel 1–6 |
| `ikea.com/planner-public/report/INSPIRATION.md` | Manufacturer SKU / product-first planning; not photoreal theater |
| `D:\websites\README.md` + `Plans/Research/RESEARCH-MAP.md` | Full pack index; Firecrawl dead for routine re-scrape |

**Ethics lock (repeated because P07 agents will touch catalog UX):** research is **ideas / JTBD only**. No competitor JS, CSS, GLB, icons, screenshots, or brand strings into `site/` or test fixtures.

---

## 2. Binding product truth (what “done” means)

### 2.1 North star (design spec)

> A facilities buyer can, **without a developer**, open the planner, lay out a small office with **real O&O-scale furniture**, switch 2D↔3D with orbit, select/edit/delete, save and return, and trust dimensions enough to quote later.

P07 does **not** prove the full north star. It proves the **first two verbs** of the loop: **Draw structure** and **Place catalog**.

### 2.2 Gate definitions (binding — phase + design + expert)

| Gate | Must prove | Hard metrics | Not sufficient |
|------|------------|--------------|----------------|
| **W1** | User draws walls; walls **increase**; door/opening placed; **objects increase after opening** | `wallsAfter > wallsBefore`; `objectsAfterOpening > objectsAfterWalls` | Absolute walls ≥1 or ≥4; toast/copy alone; screenshot alone; wall tool pressed alone |
| **W2 place** | Place ≥2 furniture incl. **`cabinet-v0`**; second SKU recorded; furniture **Δ ≥ +2**; non-blank 2D canvas PNG | `furnitureAfter ≥ furnitureBefore + 2`; `includesCabinetV0: true`; canvas PNG byteLength > 5000 | Configurator-only place as primary pass; “chair” any SKU; absolute furniture ≥1; unit tests; non-blank PNG as P05 quality |

### 2.3 Split ownership of “W2”

| Half | Owner phase | Evidence folder |
|------|-------------|-----------------|
| **Place half** | **P07 / CP-07** | `02-browser-open3d-journey/` |
| **Symbol quality half** | **P05 / CP-05** | `05-symbols-svg/` |

P07 may land `06-canvas-2d-symbols.png` as **non-blank** proof only. Claiming “readable Block2D / manufacturer symbols” requires CP-05 not red (or owner **WAIVE**). Expert S9 and CHECKPOINTS linkage are non-negotiable.

### 2.4 Kill-order role

```
CP-00 → CP-01 → CP-02 → CP-03 (W3 unit+browser) → CP-07 (this) → CP-06 save
         fill parallel: CP-04 orbit · CP-05 symbols · CP-08 mesh · CP-09 shortcuts
         → CP-10 handover
```

- CP-07 is **spine #4** after W3.  
- Full product story still needs **CP-03 + CP-05 not red** unless owner WAIVE.  
- Do not celebrate “planner works” from CP-07 alone.

### 2.5 Out of scope (hard stop if agent expands)

| Out | Belongs to |
|-----|------------|
| Select / Delete / undo | P03 / W3 |
| Orbit / pose continuity | P04 / W4 |
| Symbol quality / SVG authority | P05 / W2 symbols |
| Save flush / local-vs-cloud labels | P06 / W5–W6 |
| Mesh toe/carcass/door bar | P08 / W7 |
| Shortcut map honesty | P09 / W8 |
| Fabric full-stage cutover | Post-W destination (Approach A) |
| Cloud save, SSR, multiplayer, photoreal | Explicit non-goals |

Product code in P07 **only** when the journey is red for a **real product reason** (tool labels, status metrics, opening hit-test, blank open3d entry, inventory place path broken). No Fabric-only workaround. No chrome polish “while we’re here.”

---

## 3. Live architecture (what the journey actually drives)

### 3.1 Host chain (React expert truth)

```
/planner/open3d
  → features/planner/ui/Open3dPlannerHost
    → features/planner/open3d/ui/Open3dNativeHost
      → OOPlannerWorkspace
        → FeasibilityCanvas (live 2D interim)
        → InventoryPanel (catalog search + Add … to canvas)
        → Lazy3DViewer / Three path (not W4 proof here)
        → WorkspaceShell footer: .pw-status-bar (N walls / N objects / N furniture)

/planner/guest/?plannerDevTools=1
  → Open3dPlannerWorkspaceRoute (+ setup gate)
    → same Host / OOPlannerWorkspace
```

**Approach A locked:** FeasibilityCanvas is the live interactive 2D engine. Fabric furniture flag stays **OFF** for this journey (and for W3). Do not prove W1/W2 through Fabric-stage helpers (`firstFurnitureCenter`, `__plannerFabricView`).

### 3.2 Status metrics (the only honest automated oracle for structure/place counts)

| Metric | Status bar pattern | What increments it |
|--------|--------------------|--------------------|
| walls | `^\d+ walls$` | Wall segments drawn / shell seed |
| objects | `^\d+ objects$` | Structure + openings + furniture aggregate (doors count as objects via `summarizeFloorMetrics`) |
| furniture | `^\d+ furniture$` | Placed catalog / configurator seats |

**Rule:** Reuse status metrics; require **deltas**. Never invent a second oracle (DOM node counts on canvas, toast strings, aria-live fluff).

### 3.3 Catalog truth for W2

| SKU | Search term | Role |
|-----|-------------|------|
| `cabinet-v0` | `cabinet-v0` (or `cabinet` if slug unique enough — prefer exact) | **Required** modular manufacturer path (`geometryMode: "modular-cabinet-v0"`) |
| `sample-desk-1` | `desk` | **Preferred second** |
| `sample-sofa-1` (or equivalent) | `sofa` | **Fallback second** only if desk place fails for product reason |

**Forbidden as primary W2 pass:** systems configurator `Place N seats` alone. That path is a **documented emergency fallback** in the live divergent spec; plan bar says catalog place of named SKUs. Configurator may exist as **debug recovery** in a red investigation log — never as green proof without `includesCabinetV0: true`.

### 3.4 Tool labels (O&O only)

| Tool | UI | Journey use |
|------|-----|-------------|
| Wall | Drawing tools group · label `Wall` / `Wall (W)` | W1 draw |
| Opening | label `Opening` | W1 door/opening — **not** keyboard shortcut D (W8 residual) |
| Place | armed by catalog Add | W2 place |

Selectors locked to O&O strings:

- `getByRole("group", { name: "Drawing tools" })`
- searchbox name `/Search catalog elements/i` (placeholder OR only as fallback)
- `getByRole("button", { name: /Add .* to canvas/i })`
- `[data-testid="planner-2d-canvas"] canvas`
- `.pw-status-bar > span`

---

## 4. Plan vs live code — brutal gap analysis

The plan assumes a **missing** journey spec. Live repo has a **partial** journey that would **fail CP-07 honesty** if agents green-wash it.

### 4.1 What live `open3d-world-standard-journey.spec.ts` does today

| Step | Live behavior | CP-07 plan bar |
|------|---------------|----------------|
| Entry | **Guest only** via `enterGuestPlannerWorkspace` | Prefer `/planner/open3d`; guest fallback OK |
| Storage clear | Via guest helper | open3d path must also clear |
| Serial | `mode: "serial"`, 120s | Match |
| Walls | **One** two-tap wall segment (+ retry); delta ≥ +1 | Prefer **four-segment room** + walls Δ (plan script) |
| Door/opening | **Absent** | **Required** objects Δ after Opening tool |
| Furniture | Search **`chair`**; catalog place with try/catch; else **`placeSeatsFromConfigurator(4)`** | **`cabinet-v0` + second SKU**; configurator not primary |
| Helpers | Inline `furnitureCount` / `wallCount` (body text fallback) | Shared `getFurnitureCount` + strict `.pw-status-bar > span` |
| Screenshots | `01-guest-entered` … `06-journey-complete` (different names; no door/cabinet frames) | Gold set `01`–`07` incl. door + cabinet + two items + symbols |
| Proof JSON | **Not written** by spec | `playwright-run.json` required |
| Evidence mkdir | Implicit via screenshot path | `beforeAll` mkdir both canonical + alias |
| 2D↔3D toggle | Present in same test | Useful smoke; **does not replace W4**; must not steal pass criteria |

### 4.2 Verdict on live spec

| Claim | Truth |
|-------|-------|
| “Journey file exists” | **True** |
| “CP-07 / W1–W2 plan-complete” | **False** |
| “cabinet-v0 placed in browser pack” | **False** (chair/configurator) |
| “Door/opening proven” | **False** |
| “Gold evidence folder GREEN” | **False** (`world-standard-wave/` missing) |
| “getFurnitureCount landed” | **False** |
| “npm script `test:e2e:world-standard-w1w2`” | **False** (have `test:e2e:open3d-world` umbrella) |

**Raised bar for implementers:** Treat the live file as a **scaffold / partial red-green experiment**, not as phase completion. Align it to appendix skeletons or replace body while keeping serial evidence path. Do not paper-PASS.

### 4.3 What already works (reuse, do not rewrite)

| Asset | Status | P07 use |
|-------|--------|---------|
| `getWallCount` / `getObjectCount` | Good | W1 baselines |
| `selectPlannerTool`, `dragOnCanvas`, `tapOnCanvas`, `clickOnCanvas` | Good | Interaction |
| `placeOpeningOnCanvas` | Good | W1 opening |
| `placeCatalogOnCanvas` / `clickCatalogAddToCanvas` | Good — solves hit-test intercept via `el.click()` | W2 place |
| Guest seed knowledge (≥4 walls, 0 furniture) | Proven in guest-workspace e2e | Motivates **deltas** |
| `demoCatalogItems` cabinet-v0 + desk | Live | W2 SKUs |
| Gold pattern admin-svg-publish | Live | Evidence **shape** only |

---

## 5. Serial Playwright design (non-negotiable)

### 5.1 Why serial

`site/config/build/playwright.config.ts` uses **`fullyParallel: true`** with workers > 1.  
Multiple tests writing `01`–`07` PNGs + one proof JSON into the same directory **race → invalid evidence**.

**Binding config (inside the journey file only):**

```text
test.describe.configure({ mode: "serial", timeout: 120_000 })
```

Prefer **one** ordered journey test (or strictly ordered serial describe with single writer). Do not split W1 and W2 into parallel files racing the same folder.

### 5.2 Single evidence writer rules

1. One process owns `EVIDENCE_DIR`.  
2. `beforeAll` creates `02-browser-open3d-journey/` and optional `07-browser-journey/`.  
3. Screenshots written only after the state they prove.  
4. On fail: leave partial PNGs + write `result: "fail"` + `blockersOpen` — **never delete** red artifacts.  
5. Do not filter reporter output. Missing screenshot = FAIL.

### 5.3 Timeout hierarchy

| Layer | Value | Why |
|-------|-------|-----|
| Config default | 60s | Too short for full draw+place |
| Describe configure | **120s** | Journey reality |
| Poll walls/opening | 15s | Status metric lag |
| Poll furniture | 20–30s | Catalog arm + place race |
| open3d goto | 60s | Cold Next |

### 5.4 Entry design (`enterWorldStandardPlanner`)

**Primary:** `/planner/open3d` after `clearPlannerStorage`.  
**Fallback:** guest workspace with `plannerDevTools=1` when open3d not ready (auth wall, blank host, timeout).

Record in proof: `"routeUsed": "open3d" | "guest"`.

Honesty rules:

- Auth wall on open3d → guest path; **do not** weaken prod auth.  
- Guest shell has seed walls → **deltas still required**.  
- Prefer open3d blank when it loads; blank does not excuse absolute assertions if residual project appears — clear storage first.

### 5.5 Server / baseURL honesty

| Mode | When | Proof fields |
|------|------|--------------|
| Dev reuse | `$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"` + `pnpm run dev` | `"server": "dev"`, baseURL recorded |
| webServer build+start | baseURL **unset** | `"server": "build+start"`, slower, different surface |

Unset baseURL without recording is a **false-green risk** (different hydration, assets, env). Plan npm script must document both paths. Prefer explicit baseURL for interactive land loops.

### 5.6 Recommended npm surface

Plan name: `test:e2e:world-standard-w1w2`  
Live umbrella: `test:e2e:open3d-world` (multi-spec runner)

**Recommendation:** Add dedicated single-spec script **and** keep umbrella mapping. Single-spec is the CP-07 sign-off command so agents do not green the whole world pack while W1–W2 red.

Exact command shape (from appendix — implementers land this; this report does not edit package.json):

```text
cwd: site
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

Raw log: copy unfiltered list output to `playwright-raw.log` under evidence root.

---

## 6. Anti seed / place false-green (walls · objects · furniture DELTAS)

This section is the **epistemic core** of P07. Most false greens die here.

### 6.1 Guest seed fact (proven)

`planner-guest-workspace.spec.ts` asserts after Start from Scratch:

- walls **≥ 4**  
- objects **> 0** (shell counts)  
- furniture **= 0**

Therefore:

| Bad assert | Why it lies |
|------------|-------------|
| `walls >= 1` | Seed already ≥4 |
| `walls >= 4` | Seed alone |
| `objects >= 1` | Seed alone |
| `furniture >= 1` after residual project | Prior place / uncleared IDB |
| Toast “Wall created” | Copy can lie; metric must move |

### 6.2 Required baseline capture (always)

Before any draw/place:

```text
wallsBefore     = getWallCount(page)
objectsBefore   = getObjectCount(page)
furnitureBefore = getFurnitureCount(page)
```

Store all three in proof JSON even if W1 fails early.

### 6.3 W1 walls delta

| Step | Action | Assert |
|------|--------|--------|
| 1 | Select Wall | tool `aria-pressed=true` (setup only) |
| 2 | Draw structure | Prefer 4 segment rectangle (appendix) OR minimum one honest new segment if open3d two-tap API differs — but walls **must increase** |
| 3 | Poll | `getWallCount > wallsBefore` within 15s |
| 4 | Capture | `wallsAfterDraw`, screenshot `02-walls-drawn.png` |

**Open3d interaction note:** Live helper uses **two-tap** wall draw (`tap` start, `tap` end) because pointerdown commits without micro-drag. Guest Feasibility drag script (`dragOnCanvas` four corners) is the classic path. Implementers must use the **interaction that actually increments walls** on the route under test, but **never** drop the delta assert to match a broken tool.

**Raised bar:** Prefer a **closed room** (4 segments) so opening placement has a real host wall. One floating segment can pass metric W1 walls while failing realistic door placement.

### 6.4 W1 opening / door objects delta

| Step | Action | Assert |
|------|--------|--------|
| 1 | Capture `objectsAfterWalls` | After walls, before opening |
| 2 | Select **Opening** (not D key) | pressed true |
| 3 | `placeOpeningOnCanvas` on a wall segment | mid-top wall for rectangle rooms |
| 4 | Fallback once | `tapOnCanvas` mid-wall if placeOpening fails |
| 5 | Poll | `getObjectCount > objectsAfterWalls` |
| 6 | Walls stability | `getWallCount >= wallsAfterDraw` (opening must not destroy walls) |
| 7 | Screenshot | `03-door-opening.png` |

**Why objects after walls, not objects before journey:** Walls already raise object counts. Opening proof is **incremental after structure**, not absolute objects ≥ N.

**Do not pass W1 on:**

- UI toast  
- Opening tool selected only  
- Screenshot that “looks like” a gap  
- Objects total ≥1 without post-opening delta

### 6.5 W2 furniture delta

| Step | Action | Assert |
|------|--------|--------|
| 1 | `furnitureBefore` | Capture (expect 0 on clean guest; still use delta) |
| 2 | Search `cabinet-v0` | Add button visible |
| 3 | Catalog Add + canvas click | use `placeCatalogOnCanvas` / clickCatalogAdd (DOM click) |
| 4 | Poll | furniture **> furnitureBefore** |
| 5 | Screenshot | `04-cabinet-v0-placed.png` |
| 6 | Search second SKU | `desk` → `sample-desk-1` preferred |
| 7 | Place second | furniture **≥ furnitureBefore + 2** |
| 8 | Screenshot | `05-two-items-placed.png` |
| 9 | Canvas PNG | `06-canvas-2d-symbols.png`, byteLength > 5000 |
| 10 | Proof | `includesCabinetV0: true`, `secondCatalogId` recorded |

**Anti place false-green:**

| Bad assert | Why it lies |
|------------|-------------|
| furniture ≥ 1 absolute | Residual project |
| furniture ≥ 2 after configurator batch of 4 seats | Not catalog SKU truth; not cabinet-v0 |
| place tool pressed | No place happened |
| non-blank full-page screenshot | Chrome chrome can fill bytes; use **canvas** screenshot |
| canvas byteLength > 5000 | Proves non-blank only — **not** readable symbols (P05) |

### 6.6 Delta matrix (print this next to the keyboard)

| Metric | Before | After action | Pass condition |
|--------|--------|--------------|----------------|
| walls | wallsBefore | after draw | **>** wallsBefore |
| objects | objectsAfterWalls | after opening | **>** objectsAfterWalls |
| furniture | furnitureBefore | after 2 places | **≥** furnitureBefore + 2 |
| walls after opening | wallsAfterDraw | after opening | **≥** wallsAfterDraw |
| furniture after view toggle (optional) | furnitureAfterPlace | after 2D restore | **=** furnitureAfterPlace (stability) |

---

## 7. `getFurnitureCount` (helper design)

### 7.1 Why a shared helper

Today:

- `getWallCount` / `getObjectCount` live in `plannerCanvasHelpers.ts`  
- Live journey inlines a looser `furnitureCount` that falls back to **body** text and returns **-1** on miss  

Body fallback is a flake vector (matches unrelated “furniture” copy). Return -1 can make `toBeGreaterThan(furnitureBefore)` accidentally true if before is -1 and after is 0.

### 7.2 Spec (mirror walls)

| Property | Spec |
|----------|------|
| Location | `site/tests/e2e/plannerCanvasHelpers.ts` (test-only — allowed) |
| Locator | `.pw-status-bar > span` filtered by `/^\d+ furniture$/` |
| Parse | `^(\d+)\s+furniture` case-insensitive |
| Miss | return **0** (same as wall/object helpers — not -1) |
| Consumers | W2 polls; any future place regression |

### 7.3 Forbidden helper patterns

- Scraping entire body for first `\d+ furniture`  
- Using Fabric object list as furniture count (wrong engine)  
- Counting catalog list rows  
- Reading 3D scene mesh count  

### 7.4 Related optional improvements (same PR ok)

- Prefer shared `getWallCount` in journey instead of parallel inline  
- Keep body fallback **out** of gold path; if status bar missing, **fail** (product bug: metrics not rendered)

---

## 8. Cabinet-v0 place (W2 manufacturer anchor)

### 8.1 Why cabinet-v0 is non-optional

| Reason | Detail |
|--------|--------|
| Design gate W2 | Explicitly names cabinet-v0 |
| Modular geometry | `geometryMode: "modular-cabinet-v0"` — same family as mesh bar P08 |
| SKU truth | Manufacturer-planner identity (IKEA-class pattern translation: real article, not “chair-looking prop”) |
| Cross-phase linkage | P05 symbols + P08 mesh both orbit this SKU |

Placing four anonymous seats proves “something landed.” Placing **cabinet-v0** proves the **product catalog path** the company sells.

### 8.2 Place UX pattern (competitive → O&O original)

Industry pattern (P5D / Floorplanner / RoomSketcher / Homestyler):

1. Browse or search catalog  
2. Select item  
3. Click or drag onto plan  

O&O live path:

1. Searchbox **Search catalog elements**  
2. Button **Add {shortName} to canvas** arms Place tool + pending catalog id  
3. Canvas click (`clickOnCanvas` micro-move so pointer events fire)  

Known product flake (already encoded in helpers): status bar / sticky inventory intercepts Playwright hit-testing → **`el.click()` via evaluate** in `clickCatalogAddToCanvas`. Do not “fix” by switching to configurator; fix or use the DOM click path.

### 8.3 Failure modes for cabinet place

| Failure | Diagnosis | Action |
|---------|-----------|--------|
| Search no results | Catalog filter / Fuse / demo items not loaded | Product fix — cabinet must appear in demo catalog |
| Add visible, Place not pressed | React arm race | Retry evaluate click (helper already does) |
| Place pressed, furniture no Δ | Canvas hit / pending id / place handler | Product real — systematic-debug; chrome-devtools |
| GLB 500 for mesh asset | Phase says procedural fallback must still place | Furniture metric still must rise |
| Symbol blank blob | Place may still pass P07 non-blank threshold; quality → P05 | Do not block CP-07 place on photoreal |

### 8.4 Second SKU lock

| Priority | Id | Search |
|----------|----|--------|
| 1 | `sample-desk-1` | `desk` |
| 2 | sofa sample | `sofa` |

Record chosen id in proof as `secondCatalogId`. Do not leave as free text “some furniture.”

---

## 9. Gold evidence folder `02-browser-open3d-journey`

### 9.1 Folder lock (RESULTS-MAP wins)

| Role | Path under `results/planner/world-standard-wave/` |
|------|-----------------------------------------------------|
| **Canonical** | `02-browser-open3d-journey/` |
| **Optional alias** | `07-browser-journey/` with `NOTES.md` pointing absolute path to canonical |
| **Forbidden** | `results/tests/`, `site/results/`, `site/test-results/`, inventing `02-engine-lock/`, dumping W1 under `07-*` as sole proof |

At report time the wave root **does not exist** — preconditions Task 00.6 create both dirs.

### 9.2 Minimum GREEN artifacts (map + phase)

| Artifact | Required |
|----------|----------|
| `playwright-run.json` and/or map `run.json` | Yes — prefer both; if only one, NOTES names the contract |
| `playwright-raw.log` | Yes — unfiltered |
| Screenshots `01`–`07` | Yes — all present for pass |
| `result: "pass"`, `failed: 0` | Yes |
| `gates.W1`, `gates.W2` | pass |
| Deltas in proof object | walls/objects/furniture numbers |
| `includesCabinetV0` | true |
| `secondCatalogId` | non-empty |
| `routeUsed` | open3d \| guest |
| `server` / `baseURL` | recorded |

### 9.3 Screenshot gold set (meaning locked)

| File | Captured after | Proves |
|------|----------------|--------|
| `01-route-ready.png` | Planner loaded, chrome visible | Entry |
| `02-walls-drawn.png` | walls Δ green | W1 walls |
| `03-door-opening.png` | objects Δ green | W1 opening |
| `04-cabinet-v0-placed.png` | furniture > before after cabinet | W2 cabinet |
| `05-two-items-placed.png` | furniture ≥ before+2 | W2 count |
| `06-canvas-2d-symbols.png` | **canvas element** screenshot, >5kB | Non-blank 2D (not P05 quality) |
| `07-journey-complete.png` | End state | Pack complete visual |

Live divergent names (`01-guest-entered`, `02-wall-drawn`, …) must be **renamed/aligned** for CP-07 sign-off so P10 handover and RESULTS-MAP do not fork.

### 9.4 Alias policy

Either:

1. Copy proof + PNGs to `07-browser-journey/`, or  
2. Write `07-browser-journey/NOTES.md`:

```markdown
# P07 evidence alias
Canonical proof: ../02-browser-open3d-journey/
Checkpoint: CP-07
Gates: W1, W2
```

Do not invent a third name.

### 9.5 Gold pattern reference

Copy **discipline** from `admin-svg-publish-p01.spec.ts`:

- Evidence under repo-root `results/planner/…`  
- `mkdirSync` in beforeAll  
- Numbered PNGs  
- Machine-readable result JSON  
- Explicit pass conditions  

Do not copy admin auth bypass mechanics into the planner journey.

---

## 10. Linkage: CP-03 + CP-05 (full story honesty)

### 10.1 Why linkage exists

Buyers do not experience gates in isolation. Kill-order and CHECKPOINTS forbid claiming “the planner works” when:

| Gap | User-visible lie |
|-----|------------------|
| CP-03 red | Can draw/place but cannot delete mistakes |
| CP-05 red | Placed cabinet is an unreadable blob on plan |
| CP-07 red | Cannot even draw/place in browser proof |

### 10.2 What CP-07 may claim when green

**Allowed:**

- W1 browser-proven on route X  
- W2 **place** browser-proven; cabinet-v0 + second SKU; non-blank canvas PNG  
- Evidence path absolute  

**Forbidden without WAIVE / other CPs:**

- “Select/delete works” (CP-03)  
- “Symbols world-class / Block2D authority” (CP-05)  
- “Orbit proven” (CP-04)  
- “Save returns tomorrow” (CP-06)  
- “Mesh quality bar” (CP-08)  
- “W3–W8 green”  

### 10.3 Exit statement template (phase)

> P07 complete. W1 and W2 browser-proven on route `<open3d|guest>`. Evidence: `results/planner/world-standard-wave/02-browser-open3d-journey/playwright-run.json`. Full product story still requires CP-03 and CP-05 not red unless owner WAIVE.

### 10.4 Parallelism note

P03 browser under `03-select-delete/` and P07 journey under `02-…` may run in parallel **after CP-02** with agent coordination — **never two writers on the same package** thrashing the same helpers without serial discipline. Prefer spine order when slots scarce: **W3 browser before celebrating journey**, but journey code can be prepared in parallel.

Journey folder must **not** substitute for W3 evidence.

---

## 11. Competitive journey patterns (ideas only → O&O)

### 11.1 Universal industry funnel (SYNTHESIS + RoomSketcher + P5D)

```
1. Start (blank / template / import)
2. Structure (walls + openings)
3. Furnish (catalog place)
4. Detail / measure (later)
5. Review 2D ↔ 3D
6. Persist / share / quote
```

P07 owns **1–3** in browser proof form (start + structure + furnish). Review toggle is optional smoke; persist is P06; quote is wedge after W.

### 11.2 Planner5D — loop ease (“10 minutes”)

| Pattern | O&O translation |
|---------|-----------------|
| Template **or** blank start | Guest Start from Scratch / open3d blank; templates later product |
| Structural 2D before decorate | Wall + Opening tools first in journey order |
| Catalog furnish | Inventory search + place |
| Instant 3D toggle | Exists in chrome; full orbit continuity = P04 |
| Marketing “10 minutes” | **Instrument** time-to-first-saveable-office; do not claim without proof |

**Do not copy:** editor chrome, catalog assets, AI generator UX, brand.

### 11.3 Homestyler — ease-of-start

| Pattern | O&O translation |
|---------|-----------------|
| **Draw → Decorate → Visualize** narrative | Match journey order; optional coach chips, not modal spam |
| Five-zone shell (catalog · canvas · tools · props · status) | Already partially present; do not pixel-clone |
| Templates / AI upload for start | Out of CP-07 minimum; empty-state triad is product later |
| Auth modal early | O&O **guest-first** for first walls (ease report: do not gate first wall) |

Scrape honesty: Homestyler pack has **no live editor DOM**; forum five-zone description is the usable signal.

### 11.4 Floorplanner — room build speed

| Pattern | O&O translation |
|---------|-----------------|
| Room Wizard / draw rectangle room | Future product wizard; journey may simulate closed room with 4 walls |
| Drag-drop library | O&O click-add + canvas click is acceptable if friction low |
| Orbital 3D | P04 |

### 11.5 RoomSketcher — structure grammar

| Pattern | O&O translation |
|---------|-----------------|
| Walls first, openings on walls by click | Opening tool + place on wall segment |
| Opening cannot exceed wall length | Product constraint later; not CP-07 assert |
| Click catalog then click place | Matches O&O two-step |

### 11.6 IKEA — manufacturer place truth

| Pattern | O&O translation |
|---------|-----------------|
| Plan = real sellable articles | **cabinet-v0** + desk SKUs, not anonymous props |
| Configurator for systems | Systems v0 seats exist — **secondary** to SKU place for W2 |
| Quote path | Differentiator after place works |

### 11.7 Ease scores (research snapshot — not live re-test)

From `04-ease/REPORT.md` (2026-07-09):

| Product | Ease avg |
|---------|----------|
| Canva floor plans | 4.4 (graphic, not SKU-true) |
| IKEA | 4.1 |
| Planner5D | 4.0 |
| Homestyler / RoomSketcher | 3.9 |
| Floorplanner | 3.4 |
| **O&O (research)** | **2.1** (self later ~1.9; ease dimension **1**) |

P07 is the **primary move** to raise ease from “spine only” toward “buyer can draw and place without a developer.”

### 11.8 Patterns to adopt vs anti-patterns

**Adopt (original UX):**

1. Guest-first 10 minutes: draw + place without account  
2. Structure before catalog in the **proof order**  
3. Status metrics as truth for automation  
4. Soft coach later; not required for CP-07  
5. Visible undo exists in chrome (used by W3, not this phase)

**Reject:**

1. Account before first wall  
2. Configurator batch as sole “place proof”  
3. Absolute seed wall counts  
4. Photoreal as W1–W2 bar  
5. Competitor asset injection  

---

## 12. Plan critique (honest, raised bar)

### 12.1 What the plan gets right

| Strength | Why it matters |
|----------|----------------|
| Serial + 120s | Parallel config is real |
| Baseline deltas | Guest seed is real |
| cabinet-v0 named | Manufacturer truth |
| Canonical folder `02-*` | Avoids phase-number renames |
| Appendix skeletons | Agents can execute without inventing structure |
| Explicit non-claim of P05 quality | Honesty |
| Linkage to CP-03/CP-05 | Anti paper PASS |
| Opening via objects Δ | Metrics match `summarizeFloorMetrics` |
| Product touch only if journey red | Minimal scope |

### 12.2 What the plan under-states or risks

| Gap | Risk | Raise |
|-----|------|-------|
| Assumes journey **missing** | Live partial already exists — agents may green-wash | **Rewrite/align live spec** to plan bar; document gap in evidence NOTES if partial retained for debug |
| Four `dragOnCanvas` walls | open3d may need two-tap wall API | Spec both interaction styles; pass condition remains walls Δ |
| “Owner unlock required” footer vs card “W0 UNLOCKED” | Process confusion | Follow INDEX kill order + current program unlock; do not re-ask unlock for already-unlocked waves |
| Configurator not mentioned in plan body | Live code already falls back to seats | **Forbid** seats as green path; document as debug-only |
| Non-blank PNG only | Buyers still see bad symbols | Keep split; **raise demo bar** separately (§13) |
| Optional 2D/3D in live, not plan | Scope creep into W4 | Allow stability smoke; do not claim orbit/pose |
| `run-evidence-cmd.ps1` nesting | Flat proof can get lost | Keep flat files at evidence root |
| No visual diff / golden images | Flakes vs vision | Metric-first; PNG human-readable for owner |

### 12.3 Expert S1–S12 disposition (still binding)

| ID | Topic | Status in plan | Execute rule |
|----|-------|----------------|--------------|
| S1 | Serial single writer | Applied | Keep |
| S2 | Baseline deltas | Applied | Keep |
| S3 | baseURL honesty | Applied | Record in proof |
| S4 | clear storage on open3d | Applied | Keep |
| S5 | getFurnitureCount | Applied in plan, **not in code** | Land helper |
| S6 | objects Δ for door | Applied | Keep |
| S7 | second SKU lock | Applied | Keep |
| S8 | path table Open3dNativeHost | Applied | Keep |
| S9 | place ≠ P05 quality | Applied | Keep |
| S10 | searchbox gold selector | Applied | Prefer role name |
| S11 | import getObjectCount | Applied | Use shared helpers |
| S12 | out of scope | Applied | Hold |

### 12.4 Expert pass overall

Consolidated EXPERT-PASS: **YES WITH FIXES**. P07-specific expert essays: **FIX** (not SHIP — evidence pre-exec; not BLOCK — skeletons enough).  
This brainstormer agrees: **plan is execute-ready; live partial is not ship-ready.**

---

## 13. Raised bar — unaided buyer demo (beyond paper CP-07)

CP-07 minimum is necessary but **not sufficient** for owner confidence that a buyer can run the loop alone. Raise the bar for **demo / video / sales** as follows. These items do **not** all become automated gates in P07; they are the quality north for the same phase execution.

### 13.1 Buyer script (human, ~5–10 minutes)

1. Open planner without account (guest or open3d public path).  
2. Understand first action without a developer: **draw walls** or start from shell.  
3. Draw a closed office outline (rectangle room).  
4. Add a door/opening on one wall.  
5. Search **Modular Cabinet** / cabinet-v0; place once.  
6. Search desk; place once.  
7. See both on 2D without blank blobs (P05 residual if ugly but present).  
8. Toggle 3D briefly; still see massing (orbit polish = P04).  
9. Optionally undo/delete mistake (needs P03 — **do not claim in P07 alone**).  
10. Leave and return (needs P06 — **do not claim in P07 alone**).

### 13.2 Demo pass criteria (stricter than automation minimum)

| Criterion | Automation CP-07 | Raised demo bar |
|-----------|------------------|-----------------|
| Walls | Δ ≥ 1 | **Closed room** 4 walls preferred |
| Opening | objects Δ | Visible door gap on wall in PNG |
| Place | any 2 SKUs if cabinet + second | **cabinet-v0 + desk** both visible |
| Catalog path | required | **No** configurator in demo recording |
| Symbols | non-blank | Human can identify cabinet vs desk (P05) |
| Friction | N/A | No stuck Place tool; no silent fail |
| Time | N/A | Structure + 2 SKUs under **10 minutes** unaided |

### 13.3 What still blocks a trustworthy buyer story after CP-07 green

1. Cannot delete wrong placement (CP-03)  
2. Symbols unreadable (CP-05)  
3. 3D orbit broken / pose jump (CP-04)  
4. Reload loses plan or “Saved” lies (CP-06)  
5. Mesh is apology boxes (CP-08)  
6. Shortcuts lie (CP-09)  

Agents must say this out loud when presenting CP-07 green.

---

## 14. Approaches (2–3) with recommendation

### Approach A — **Align live journey to plan bar (recommended)**

**What:** Keep single serial file `open3d-world-standard-journey.spec.ts`. Rewrite body to appendix order: entry helper → walls Δ (closed room if possible) → opening objects Δ → cabinet-v0 → second SKU → gold PNGs 01–07 → write `playwright-run.json`. Add `getFurnitureCount`. Remove configurator as green path (retain only behind explicit `test.fix` debug or separate debug-only describe **not** in CP-07 sign-off).

| Pros | Cons |
|------|------|
| Matches kill order + RESULTS-MAP | Requires reworking existing partial |
| One evidence writer | open3d wall API may need two-tap vs drag |
| Uses proven catalog helpers | Opening hit-test may need product fix |
| Honest cabinet-v0 | Stricter than current green attempts |

**Recommendation:** **This is the default.**

### Approach B — **Two-file split: W1-only then W2-only serial describe**

**What:** Two tests in one serial describe sharing one page via serial state, or two files with explicit dependency.

| Pros | Cons |
|------|------|
| Easier local debug of W1 vs W2 | State sharing across tests is fragile |
| Partial green messaging | PNG numbering races if not serial |
| | Easy to claim W2 without W1 on same project |

**Use only if** single-test file becomes unmaintainable. Still **one folder, serial, one proof JSON**.

### Approach C — **Open3d-only, never guest**

**What:** Fail if open3d does not load; never enter guest.

| Pros | Cons |
|------|------|
| Cleaner blank baseline | Auth / blank host blocks CI |
| Matches “product route” branding | Phase explicitly allows guest fallback |

**Reject as sole strategy.** Prefer A with open3d primary + guest fallback, always deltas.

### Approach D — **Configuator-first place (reject)**

**What:** Keep live path: seats batch when catalog flaky.

| Pros | Cons |
|------|------|
| High green rate | **False product story** |
| | Fails cabinet-v0 gate |
| | Manufacturer bar collapse |

**Reject for CP-07.** Catalog flakiness → fix product or helper, not substitute SKU.

---

## 15. Execution design (for implementer agents — still no code here)

### 15.1 Task order (phase Tasks 00–5)

| # | Work | Done when |
|---|------|-----------|
| 00 | Preconditions: read INDEX/design; Approach A; cabinet-v0 in catalog; dev server; browsers; mkdir evidence dirs | Checklist green |
| 1 | Land `getFurnitureCount`; serial skeleton + paths; entry helper; commit | Spec compiles; helper unit not required |
| 2 | W1 red→green: walls Δ + opening objects Δ + PNGs 01–03 | Polls pass |
| 3 | W2 red→green: cabinet-v0 + second + furniture Δ + PNGs 04–06 | Polls pass |
| 4 | Proof JSON + npm script + alias NOTES + 07 complete PNG | Full pack on disk |
| 5 | CP-07 checklist + honesty exit statement | No W3–W8 claims |

### 15.2 Product touch decision tree

```
Journey red?
  ├─ Selector/tool label mismatch → product chrome fix (minimal)
  ├─ Metrics not updating → status bar / summarizeFloorMetrics
  ├─ Wall draw no Δ → Feasibility wall tool / open3d pointer path
  ├─ Opening no objects Δ → opening place / door entity creation
  ├─ Catalog place no furniture Δ → InventoryPanel / placementAction / pending id
  ├─ Blank open3d host → host route (prefer guest fallback first)
  ├─ Auth wall → guest fallback; do NOT weaken auth
  └─ Symbol ugly but furniture Δ ok → leave for P05; do not expand P07
```

### 15.3 Commit cadence

- Skeleton commit  
- W1 green commit  
- W2 green commit  
- Proof + script landable slice  

Push/mirror per `AGENTS.md` / Elon standard (agent call). No force-push. No huge binary dumps beyond 7 PNGs + json/log.

### 15.4 Verification before claiming CP-07

1. Exit code 0 on exact command  
2. All 7 PNGs exist on disk  
3. `playwright-run.json` `result: "pass"`, `failed: 0`  
4. Proof deltas true  
5. `includesCabinetV0: true`  
6. Raw log retained unfiltered  
7. Alias or NOTES  
8. Explicit non-claim of other W gates  

Use verification-before-completion skill posture: **repo + disk evidence**, not memory.

---

## 16. Flake risks (catalog)

| Risk | Mechanism | Mitigation |
|------|-----------|------------|
| Parallel PNG race | fullyParallel multi-test | `mode: "serial"`; one writer |
| Guest seed walls | Start from Scratch ≥4 walls | walls **Δ** |
| Opening after walls | objects already high | objects **after walls** baseline |
| Residual IDB | Prior project furniture | `clearPlannerStorage` |
| Catalog hit-test intercept | Sticky chrome steals clicks | `clickCatalogAddToCanvas` DOM click |
| Place tool not armed | React race | aria-pressed wait + retry click |
| Wall two-tap vs drag | Engine differences | Use working gesture; keep Δ assert |
| Opening miss wall | Relative coords off shell | Prefer known wall midpoint; retry once |
| open3d cold start | Next compile | 60s goto; guest fallback |
| baseURL build+start | 5–15 min slower | Document; prefer PLAYWRIGHT_BASE_URL dev |
| furnitureCount body scrape | False match / -1 | Shared strict helper |
| Configurator temptation | Easy green | Forbidden as primary |
| 3D toggle flake | WebGL headless | Optional smoke; isolate if flaky |
| Screenshot timing | Capture before paint | After poll success |
| Port 3000 conflict | Foreign process | Stop; log Failures.md; do not kill unknown |
| GLB 500 | Asset path | Procedural place still increments furniture |
| CI vs local | Different server | Record server field always |
| Fabric flag ON | Dual selection thrash | Keep OFF |
| Silent skip | test.skip on missing catalog | **FAIL** — missing catalog is product bug |
| Filtered logs | Agent cleans “noise” | Handbook: zero filter |

### 16.1 Flake severity ranking for P07

1. **Catalog place race / intercept** (highest product value failure)  
2. **Opening wall hit-test**  
3. **Seed absolute asserts** (process discipline)  
4. **baseURL/server confusion**  
5. **Parallel evidence race**  

---

## 17. Failure handling (phase table expanded)

| Failure | Action | Not allowed |
|---------|--------|-------------|
| Port 3000 conflict | Stop; Failures.md | Kill unknown processes |
| Auth wall open3d | Guest path; record routeUsed | Weaken prod auth |
| Flaky hit-test | Prefer helpers; product fix if systematic | Infinite sleep hacks |
| False-green walls ≥1 | Require walls Δ | Absolute seed pass |
| baseURL unset → build+start | Record or set env | Silent slow green |
| cabinet-v0 GLB 500 | Procedural place still | Skip cabinet |
| Scope creep select/save/orbit | Stop | “While here” P03/P04/P06 |
| Red journey | Keep artifacts; result fail; blockersOpen | Delete PNGs; fake blockersResolved |
| Missing screenshot | FAIL | Claim pass |

---

## 18. Dependencies matrix

| Phase | Relation to P07 |
|-------|-----------------|
| P01 | Product truth context; know Feasibility is live 2D |
| P02 | Engine lock Approach A; no thrash mid-journey |
| P03 | Parallel; full story wants CP-03 browser |
| P04 | Not required for CP-07; optional view toggle smoke |
| P05 | Symbol quality residual; non-blank only here |
| P06 | Not required for CP-07 |
| P08 | Mesh not required for place |
| P09 | Opening tool label honesty adjacent; use Opening not D |
| P10 | Packs `02-*` into handover |

---

## 19. Selectors & helper map (quick reference)

| Need | Mechanism |
|------|-----------|
| Wall tool | `selectPlannerTool(page, "Wall")` |
| Opening tool | `selectPlannerTool(page, "Opening")` |
| Draw segment (drag) | `dragOnCanvas(from, to)` |
| Draw segment (two-tap) | `tapOnCanvas` start + end |
| Place opening | `placeOpeningOnCanvas` |
| Catalog search | `getByRole("searchbox", { name: /Search catalog elements/i })` |
| Add item | `placeCatalogOnCanvas` / Add button regex |
| Walls count | `getWallCount` |
| Objects count | `getObjectCount` |
| Furniture count | **`getFurnitureCount` (to land)** |
| Canvas | `[data-testid="planner-2d-canvas"] canvas` |
| Status | `.pw-status-bar` |
| Guest enter | `enterGuestPlannerWorkspace` |
| Clear storage | `clearPlannerStorage` |

---

## 20. Proof JSON shape (binding fields)

Minimum fields for pass (align appendix + RESULTS-MAP):

```json
{
  "slice": "P07 / CP-07 world-standard W1–W2 open3d journey",
  "date": "YYYY-MM-DD",
  "result": "pass",
  "tests": 1,
  "failed": 0,
  "gates": { "W1": "pass", "W2": "pass" },
  "routeUsed": "open3d",
  "command": "npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list",
  "cwd": "site",
  "baseURL": "http://localhost:3000",
  "server": "pnpm run dev (repo root) or Playwright webServer if configured",
  "spec": "site/tests/e2e/open3d-world-standard-journey.spec.ts",
  "proof": {
    "wallsBefore": 0,
    "wallsAfterDraw": 4,
    "wallsIncreased": true,
    "doorOrOpeningPlaced": true,
    "objectsBefore": 0,
    "objectsAfterWalls": 4,
    "objectsAfterOpening": 5,
    "objectsIncreasedAfterOpening": true,
    "furnitureBefore": 0,
    "furnitureAtLeast": 2,
    "includesCabinetV0": true,
    "secondCatalogId": "sample-desk-1",
    "symbolCheck": "non-blank-canvas-png (P07); quality bar P05",
    "screenshots": [
      "01-route-ready.png",
      "02-walls-drawn.png",
      "03-door-opening.png",
      "04-cabinet-v0-placed.png",
      "05-two-items-placed.png",
      "06-canvas-2d-symbols.png",
      "07-journey-complete.png"
    ]
  },
  "rawLog": "playwright-raw.log",
  "blockersResolved": [],
  "honesty": "Does not claim W3–W8, CP-03, or CP-05 symbol quality"
}
```

On fail: `"result": "fail"`, `"blockersOpen": ["…"]`, keep partial screenshots.

Optional map-contract `run.json` with phase/gate/exitCode/gitHead per RESULTS-MAP — prefer **both**.

---

## 21. Full pack reports inventory (research — for implementers who need primary sources)

### 21.1 World-standard comparison (2026-07-09)

| Slice | Path |
|-------|------|
| Synthesis | `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md` |
| Master chart | `…\comparison\MASTER-CHART.md` |
| Engine | `…\comparison\01-engine\REPORT.md` |
| Toolbar | `…\comparison\02-toolbar\REPORT.md` |
| Inventory | `…\comparison\03-inventory\REPORT.md` |
| **Ease** | `…\comparison\04-ease\REPORT.md` |
| Realtime | `…\comparison\05-realtime\REPORT.md` |
| Export/BOQ | `…\comparison\06-export-boq\REPORT.md` |
| O&O self | `…\comparison\07-oando-self\REPORT.md` |
| Engine decision | `…\comparison\ENGINE-DECISION.md` |
| Firecrawl gaps | `…\FIRECRAWL-GAPS.md` |

### 21.2 Competitor packs

| Pack | Report entry |
|------|----------------|
| Planner5D | `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md` (+ TOOLBARS, PACKAGES, DEEP_STACK, ETHICS) |
| Homestyler | `D:\websites\homestyler.com\report\INSPIRATION.md` |
| Floorplanner | `D:\websites\floorplanner.com\report\INSPIRATION.md` |
| RoomSketcher | `D:\websites\roomsketcher.com\report\INSPIRATION.md` |
| IKEA public | `D:\websites\ikea.com\planner-public\report\INSPIRATION.md` |
| 3dplanner | `D:\websites\3dplanner.com\report\INSPIRATION_REPORT.md` (parked) |
| O&O canvas inventory | `D:\websites\oando-render-options\report\CANVAS_INVENTORY_UI_SVG.md` |

### 21.3 Repo research pointers

| Path | Note |
|------|------|
| `Plans/Research/RESEARCH-MAP.md` | Canonical routing |
| `Plans/Research/RESULTS-MAP.md` | Evidence folders |
| Historical 2026-07-05 notes | Under websites `research/from-repo-Plans-Research/` or Plans Research copies — **2026-07-09 wins on conflict** |

**Firecrawl:** dead for routine work. Do not re-scrape P5D/3dplanner. Ideas already packed.

---

## 22. W1 interaction script (spec narrative)

Human-readable order matching appendix:

1. Enter planner (open3d primary / guest fallback); screenshot 01.  
2. Capture wallsBefore, objectsBefore.  
3. Wall tool → four segments forming a rectangle (or open3d-equivalent gestures that increase wall count by ≥1, prefer closed room).  
4. Poll walls > wallsBefore; capture wallsAfterDraw; screenshot 02.  
5. Capture objectsAfterWalls.  
6. Opening tool → placeOpeningOnCanvas on top wall midpoints; fallback tap once.  
7. Poll objects > objectsAfterWalls; walls still ≥ wallsAfterDraw; screenshot 03.  
8. Do not advance to W2 if W1 red.

---

## 23. W2 interaction script (spec narrative)

1. Capture furnitureBefore.  
2. Search `cabinet-v0`; expect Add button; place via catalog helper; click canvas interior point.  
3. Poll furniture > furnitureBefore; screenshot 04.  
4. Search `desk`; place second; poll furniture ≥ furnitureBefore + 2; screenshot 05.  
5. Canvas element screenshot 06; assert byteLength > 5000.  
6. Journey complete screenshot 07.  
7. Write proof JSON with secondCatalogId and includesCabinetV0.  
8. No pass if configurator used as sole place method.

---

## 24. Skills for execute phase (not this brainstormer)

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| `verification-before-completion` | Before CP-07 green claim |
| `chrome-devtools` | Selector / flake triage in live browser |
| `systematic-debugging` | Product-real red journeys |
| TDD | Only if product pure helpers need unit covers (rare in P07) |

This brainstormer wrote **design only**. Implementation is a separate agent pass.

---

## 25. Risks to “paper PASS” culture (pushback)

1. **Green live partial as CP-07** — currently missing door, missing cabinet-v0, wrong screenshot set, no proof JSON. **Refuse.**  
2. **Unit place tests as browser journey** — refuse.  
3. **W3 claimed via journey folder** — refuse.  
4. **Non-blank PNG as symbol quality** — refuse.  
5. **Seed walls as W1** — refuse.  
6. **Configuator seats as catalog** — refuse.  
7. **Deleting red screenshots to “clean” evidence** — refuse.  
8. **Claiming 10-minute buyer success without timed unaided run** — refuse marketing claim; automation alone ≠ ease score 4+.

---

## 26. Success definition (checklist form)

### 26.1 CP-07 phase checklist

- [ ] Spec exists at locked path  
- [ ] Serial mode + 120s  
- [ ] `getFurnitureCount` in helpers  
- [ ] W1: walls Δ + objects Δ after opening  
- [ ] W2: furniture ≥ before+2 incl. cabinet-v0 + recorded second id  
- [ ] Screenshots 01–07 under `02-browser-open3d-journey/`  
- [ ] `playwright-run.json` pass, failed 0, gates W1/W2  
- [ ] Raw log retained  
- [ ] `07-browser-journey/` alias or NOTES  
- [ ] Local commit; push/mirror per standing rules  
- [ ] Honesty: no W3–W8 / “planner works” claim from this alone  

### 26.2 Raised demo checklist (optional but recommended)

- [ ] Closed room (4 walls) in proof  
- [ ] Door visible on wall in `03-`  
- [ ] cabinet-v0 and desk both identifiable by human in `05`/`06`  
- [ ] No configurator in demo recording  
- [ ] Unaided run timed under 10 minutes once  

---

## 27. Appendices

### Appendix A — Phase file map

```
Plans/phases/P07-draw-place-journey/
  README.md
  P07-draw-place-journey.md   ← execute card
  P07-appendix.md             ← TS skeletons (reference only)
  P07-suggestions.md          ← S1–S12
  01-react-open3d.md          ← expert
  04-playwright-evidence.md   ← expert
```

### Appendix B — Evidence tree (target when green)

```
results/planner/world-standard-wave/
  02-browser-open3d-journey/
    01-route-ready.png
    02-walls-drawn.png
    03-door-opening.png
    04-cabinet-v0-placed.png
    05-two-items-placed.png
    06-canvas-2d-symbols.png
    07-journey-complete.png
    playwright-run.json
    playwright-raw.log
    run.json                    (optional map contract)
  07-browser-journey/
    NOTES.md                    (pointer) OR copies of above
```

### Appendix C — Live vs plan screenshot names

| Plan gold | Live divergent (today) | Action |
|-----------|------------------------|--------|
| 01-route-ready | 01-guest-entered | Align to gold |
| 02-walls-drawn | 02-wall-drawn | Align; prefer plural walls |
| 03-door-opening | (missing) | **Add** |
| 04-cabinet-v0-placed | (missing; 03-furniture-placed) | **Add cabinet-specific** |
| 05-two-items-placed | (merged into furniture-placed) | Split |
| 06-canvas-2d-symbols | (missing; has 04–05 view toggles) | **Add canvas crop** |
| 07-journey-complete | 06-journey-complete | Renumber |

### Appendix D — Status metric regexes

| Metric | Filter regex | Parse |
|--------|--------------|-------|
| objects | `/^\d+ objects$/` | `/^(\d+)\s+objects/i` |
| walls | `/^\d+ walls$/` | `/^(\d+)\s+walls/i` |
| furniture | `/^\d+ furniture$/` | `/^(\d+)\s+furniture/i` |

### Appendix E — Kill order one-screen

| Order | Gate | Phase | Folder |
|------:|------|-------|--------|
| 1 | Baseline | P01 | `00-product-truth/` |
| 2 | Engine | P02 | `01-engine-lock/` |
| 3 | W3 | P03 | `03-select-delete/` |
| 4 | **W1–W2 browser** | **P07** | **`02-browser-open3d-journey/`** |
| 5 | W5–W6 | P06 | `06-save-honesty/` |
| 6 | W4 | P04 | `04-orbit-continuity/` |
| 7 | W2 symbols | P05 | `05-symbols-svg/` |
| 8 | W7 | P08 | `08-mesh-quality/` |
| 9 | W8 | P09 | `09-shortcuts-chrome/` |
| 10 | Pack | P10 | `10-handover/` |

### Appendix F — False-green cheat sheet (print)

| Lie | Truth |
|-----|-------|
| walls ≥ 4 on guest | Seed |
| furniture ≥ 1 after uncleared storage | Residual |
| objects ≥ 1 after walls only | Not a door |
| Place tool pressed | No place |
| 4 seats configurator | Not cabinet-v0 |
| Unit place modular | Not browser CP-07 |
| Non-blank PNG | Not P05 quality |
| Parallel tests “all green” | PNG race invalid |
| Journey folder = W3 | Wrong gate |

### Appendix G — Competitive journey pattern one-liners

| Source | Steal (pattern) | Never steal |
|--------|-----------------|-------------|
| P5D | Structure → furnish → 3D; 10-min ambition | UI, catalog, brand |
| Homestyler | Draw → Decorate → Visualize narrative | Editor DOM, models |
| Floorplanner | Room speed; library drag | Manual text as product docs |
| RoomSketcher | Openings on walls; two-step catalog | Hotkeys map, chrome |
| IKEA | Real SKU composition | Brand, product names |
| Canva | Zero-friction start (graphic only) | Accuracy model as our identity |

### Appendix H — Host & product paths (execute touch list if red)

| Concern | Path |
|---------|------|
| open3d page | `site/app/planner/open3d/page.tsx` |
| Host | `site/features/planner/ui/Open3dPlannerHost.tsx` |
| Native host | `site/features/planner/open3d/ui/Open3dNativeHost.tsx` |
| Workspace | `OOPlannerWorkspace` (features planner) |
| Canvas 2D | FeasibilityCanvas |
| Inventory | InventoryPanel |
| Demo catalog | `demoCatalogItems.ts` |
| Metrics | WorkspaceShell / `summarizeFloorMetrics` |
| Playwright config | `site/config/build/playwright.config.ts` |
| Journey spec | `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| Helpers | `plannerCanvasHelpers.ts`, `guestProjectSetup.ts` |

### Appendix I — Related historical evidence (cite shape only)

| Folder | Use |
|--------|-----|
| `results/planner/p0-1-admin-svg-publish/` | Gold evidence **shape** |
| `results/planner/modular-place*` etc. | Non-regression only; not W1–W2 browser |

### Appendix J — Glossary

| Term | Meaning |
|------|---------|
| W1 | Draw walls + door/opening with metric deltas |
| W2 place | Place ≥2 furniture incl. cabinet-v0 |
| W2 symbols | Readable Block2D — **P05** |
| CP-07 | Checkpoint for P07 browser pack |
| Delta / Δ | After − before metric increase |
| Seed false-green | Passing on guest shell without user action |
| Serial | Ordered non-parallel Playwright describe |
| Approach A | Product journey first on Feasibility interim |
| cabinet-v0 | Modular cabinet demo SKU; manufacturer anchor |
| Gold folder | `02-browser-open3d-journey/` |

### Appendix K — Self-review (this report)

| Check | Result |
|-------|--------|
| Placeholder TBD/TODO | **None intentional** |
| Contradictions | Live partial vs plan: **documented as gap**, plan bar wins for CP-07 |
| Scope | P07 W1–W2 only; raised demo bar clearly labeled optional |
| Ambiguity wall gesture | Two-tap vs drag: **either OK if walls Δ**; prefer closed room |
| Configurator | Explicitly rejected as green path |
| No code deliverable | Report only under Idiots |

---

## 28. Final recommendation (one screen)

1. **Do not ship** the live journey file as CP-07 green.  
2. **Align** it to plan appendix: serial, open3d→guest entry, walls Δ, opening objects Δ, **cabinet-v0 + desk**, `getFurnitureCount`, gold PNGs 01–07, `playwright-run.json`.  
3. **Forbid** configurator seats as W2 primary.  
4. **Keep** place ≠ symbol quality; link CP-03 + CP-05 for full story.  
5. **Raise** demo bar to closed room + human-identifiable SKUs under 10 minutes when showing buyers.  
6. **Evidence only** under `results/planner/world-standard-wave/02-browser-open3d-journey/`.  
7. **Execute Approach A** after preconditions; product fix only when metrics/tools truly red.

**Exit when green:**

> P07 complete. W1 and W2 browser-proven on route `<open3d|guest>`. Evidence: `D:\OandO07072026\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-run.json`. Does not claim W3–W8, CP-03 select/delete, or CP-05 symbol quality.

---

## 29. Brainstormer sign-off

| Item | Status |
|------|--------|
| Phase pack read | Complete |
| Experts 01-react + 04-playwright | Complete |
| EXPERT-PASS | Complete |
| Plans/Research maps | Complete |
| D:\websites ease + Homestyler + P5D + SYNTHESIS + pack inventory | Complete |
| Live journey + helpers + catalog + guest seed re-proved | Complete |
| Deliverable | `Idiots/P07-draw-place-journey/REPORT.md` |
| Product code changed | **None** |
| TBD left | **None** |

**Date:** 2026-07-10  
**Agent:** Brainstormer 07/10 · P07 draw-place-journey  
**Bar:** Elon floor — honesty over comfort; refuse paper PASS.
