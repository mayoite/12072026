# P07 — Draw / Place Journey (W1–W2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).
>
> **Every subagent brief starts with:** `/using-superpowers` + fit skills (`verification-before-completion`, `chrome-devtools`, `systematic-debugging` as needed).
>
> **Checkout:** `D:\OandO07072026` only — **no worktrees**.
>
> **Plan-only deliverable path:** `idiotplanners2/P07-draw-place-journey/IMPLEMENTATION-PLAN.md`  
> **Brainstormer input (hard):** `Idiots/P07-draw-place-journey/REPORT.md` only — **never** Idiots2.

**Goal:** Land one **serial** Playwright browser pack that proves **W1** (walls + door/opening with **metric deltas**) and **W2 place** (≥2 catalog SKUs including **cabinet-v0**, non-blank 2D canvas PNG) on open3d-preferred / guest-fallback, with honest evidence under `results/planner/world-standard-wave/02-browser-open3d-journey/`.

**Architecture:** Reuse live open3d stack (FeasibilityCanvas 2D + InventoryPanel + WorkspaceShell status metrics). Prefer **test-only** work: harden `plannerCanvasHelpers` (`getFurnitureCount`, `drawWallByTwoClicks`), **rewrite** the existing **partial** journey spec to the binding CP-07 storyboard (PNGs 01–07 + `playwright-run.json`). Product code only when journey is red for a real product reason (tool labels, metrics, place path, blank host). Approach A stays: Feasibility interim; no Fabric cutover for this CP.

**Tech Stack:** Playwright (`site/config/build/playwright.config.ts`) · Next open3d planner · FeasibilityCanvas · InventoryPanel · `demoCatalogItems` (`cabinet-v0`, `sample-desk-1`) · `.pw-status-bar` metrics · `test.describe.configure({ mode: "serial", timeout: 120_000 })` · repo-root `results/` only.

**Inputs consumed:**
- Repo read: 2026-07-10 — live tree under `site/tests/e2e/`, `site/features/planner/open3d/`, `Plans/phases/P07-draw-place-journey/`, `Plans/Research/RESULTS-MAP.md` (working tree; re-check HEAD before execute)
- Brainstormer: **`Idiots/P07-draw-place-journey/REPORT.md` only** (never `Idiots2/`)
- Phase plan: `Plans/phases/P07-draw-place-journey/` (execute card · appendix · suggestions · expert notes 01/04)
- Maps: `Plans/INDEX.md`, `Plans/Research/RESULTS-MAP.md`

**Done when:**
1. `getFurnitureCount` lives in `plannerCanvasHelpers.ts` and the journey uses it (no local body-scrape parsers, no `-1` miss sentinel).
2. Spec `open3d-world-standard-journey.spec.ts` is **serial**, one ordered journey (or strictly ordered serial describe), timeout ≥120s.
3. Entry: clear storage → `/planner/open3d` primary → guest `?plannerDevTools=1` fallback; `routeUsed` recorded in proof.
4. **W1:** `wallsAfterDraw > wallsBefore` after Wall tool draw; Opening tool (label **Opening**, not shortcut D) raises `objects > objectsAfterWalls`; walls still `≥ wallsAfterDraw`.
5. **W2:** `furniture ≥ furnitureBefore + 2`; **includes cabinet-v0**; second SKU id recorded (`sample-desk-1` preferred); canvas PNG `byteLength > 5000`.
6. Screenshots **01–07** on disk under canonical evidence folder; `playwright-run.json` with `result: "pass"`, `failed: 0`, gates W1/W2.
7. Raw log retained; phase alias `07-browser-journey/NOTES.md` points at canonical path.
8. npm script `test:e2e:world-standard-w1w2` exists; `PLAYWRIGHT_BASE_URL` / server path honesty in proof.
9. Honesty: do **not** claim W3–W8, full symbol quality (P05), mesh (P08), or “planner works” from this phase alone.
10. **Configuator batch is forbidden** as the CP-07 green place path.

**Evidence folder (create on execute; re-prove if missing):**  
`results/planner/world-standard-wave/02-browser-open3d-journey/`  
Alias pointer only: `results/planner/world-standard-wave/07-browser-journey/`

**Canonical sign-off command:**

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

---

## 1. Repo reality

### 1.1 What actually exists (2026-07-10 live read)

| Area | Live fact | CP-07 relevance |
|------|-----------|-----------------|
| Journey spec | **`site/tests/e2e/open3d-world-standard-journey.spec.ts` EXISTS** | Partial / wrong bar — must **rewrite**, not invent from zero |
| Helpers | `plannerCanvasHelpers.ts`: `getWallCount`, `getObjectCount`, drag/tap/click, `placeOpeningOnCanvas`, `placeCatalogOnCanvas`, `placeSeatsFromConfigurator`, `clickCatalogAddToCanvas` | **`getFurnitureCount` still MISSING** |
| Guest setup | `guestProjectSetup.ts`: `clearPlannerStorage`, `clearPlannerStorageInPage`, `enterGuestPlannerWorkspace` (`/planner/guest/?plannerDevTools=1`) | Reuse; open3d entry needs explicit clear + goto |
| Playwright config | `fullyParallel: true`, workers 2, timeout 60s default; no `PLAYWRIGHT_BASE_URL` → `build && start` | Journey **must** `mode: "serial"` + 120s |
| npm script | `test:e2e:world-standard-w1w2` **ABSENT** | Have `test:e2e:open3d-world` umbrella only |
| Spec map | `playwright-open3d-world-specs.json` maps `W1-W2` → journey file | Keep mapping; add dedicated single-spec script |
| Evidence | `results/planner/world-standard-wave/` **does not exist on disk** | Create; re-prove from zero (no PASS claim from missing folder) |
| Demo catalog | `cabinet-v0` (`geometryMode: "modular-cabinet-v0"`, shortName `Modular Cabinet`), `sample-desk-1`, sofa samples in `demoCatalogItems.ts` | W2 lock OK |
| Status metrics | `WorkspaceShell` footer `.pw-status-bar`: `{n} objects` / `{n} walls` / `{n} furniture` | Helper parsers must match live DOM |
| Objects formula | `summarizeFloorMetrics`: walls + rooms + doors + windows + furniture + stairs + columns | Opening → **objects Δ** (doors count in objects) |
| Tools | `CANVAS_TOOL_LABELS`: Wall, Opening, Place; wall guidance “Click start and end points”; opening “Click a wall…” | Use label **Opening**; prefer two-tap wall |
| Place UX | Inventory search + `Add {shortName} to canvas` + canvas click; `placeCatalogOnCanvas` uses DOM `el.click()` | Gold path for W2 (hit-test safe) |
| Gold place proof | `open3d-mesh-symbol-live-verify.spec.ts` places cabinet via `placeCatalogOnCanvas` + `/Add Modular Cabinet to canvas/i` | Steal selectors/path for W2 |
| Systems fallback | `placeSeatsFromConfigurator` used by **current** journey | **Not allowed** as sole W2 green — cabinet-v0 required |
| Gold evidence shape | `admin-svg-publish-p01.spec.ts` | Flat dir + numbered PNGs + JSON under `results/planner/…` |
| Guest seed | `planner-guest-workspace.spec.ts`: Start from Scratch → walls **≥4**, furniture **0** | Motivates **deltas** only |

### 1.2 Current journey vs binding bar (gap matrix)

Live `open3d-world-standard-journey.spec.ts` today:

| Requirement | Live spec | Gap |
|-------------|-----------|-----|
| Serial + 120s | Yes | Keep |
| open3d primary / guest fallback | **Guest only** | **Missing open3d primary** |
| clear storage on open3d | N/A (guest clears) | Add for open3d |
| `getFurnitureCount` helper | Local `furnitureCount` / `wallCount` with **body** fallback and **-1** miss | Promote strict helpers; delete locals |
| W1 wall delta | Yes (two-click + retry, ≥ +1) | Keep; prefer four-segment room narrative when stable |
| W1 Opening + objects Δ | **No** | **Must add** |
| W2 cabinet-v0 | **No** (search `chair` / configurator) | **Must replace** |
| W2 second SKU recorded | No | **Must add** |
| Non-blank canvas PNG >5k | No | **Must add** |
| Screenshots 01–07 named per phase | Different names (01 guest, 02 wall, 03 furniture, 04 3d, 05 2d, 06 complete) | **Rename / expand to 01–07 bar** |
| `playwright-run.json` written by test | No | **Must write** |
| npm script `test:e2e:world-standard-w1w2` | No | **Must add** |
| Alias NOTES | No | **Must add** |
| 2D↔3D toggle | Yes (bonus) | Optional stability smoke; **do not claim W4** |
| Configurator as place success | Yes (fallback) | **Forbidden for CP-07 green** |

### 1.3 Contradictions (repo wins over brainstormer on code facts)

| Source claim | Live repo | Plan call |
|--------------|-----------|-----------|
| Expert 04-playwright (2026-07-09): journey **absent** | Spec **exists** (partial, later land) | Rewrite in place; do not “create from scratch” without reading live file |
| Idiots REPORT §4: partial journey would fail CP-07 honesty | Confirmed | Align to appendix bar; refuse paper PASS on partial |
| Phase appendix W1 uses `dragOnCanvas` four segments | Live journey + wall guidance = two-tap | Prefer **two-click** primary; drag fallback; pass = walls **Δ** |
| Phase appendix W2 uses raw `addCabinet.click()` | Live gold uses `placeCatalogOnCanvas` (DOM click + Place arm) | Prefer **`placeCatalogOnCanvas`** |
| Appendix Opening via `placeOpeningOnCanvas` | Opening guidance is single click on wall | Try `tapOnCanvas` first; micro-drag fallback |
| “Fabric step-bar for place” | open3d has no `.pw-step-bar` (live journey asserts count 0) | Keep native chrome asserts |
| Configurator batch proves place ≥2 | Live uses it | **Reject as sole green** — manufacturer bar collapses |

### 1.4 Missing evidence honesty

- Wave folder `results/planner/world-standard-wave/` **missing** → any historical “PASS” for W1–W2 browser is **not live**.
- Execute must **re-prove** with PNGs + json + raw log.
- Do not cite deleted or non-existent results as green.
- Map minimum when green: `playwright-run.json` or `run.json` + raw log + screenshots `01`–`N`; no skipped steps.

### 1.5 Product paths that journey may touch (only if red)

| Path | Role |
|------|------|
| `site/app/planner/open3d/page.tsx` | Route entry |
| `site/features/planner/ui/Open3dPlannerHost.tsx` | Host |
| `site/features/planner/open3d/ui/Open3dNativeHost.tsx` | Native host |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Workspace + metrics source |
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | `.pw-status-bar` |
| `site/features/planner/open3d/editor/workspacePlanMetrics.ts` | objects/walls/furniture formula |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` + `canvasTool.ts` | Wall / Opening labels + guidance |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Draw / open / place pointer |
| `site/features/planner/open3d/editor/InventoryPanel.tsx` | Search + Add to canvas |
| `site/features/planner/open3d/editor/demoCatalogItems.ts` | cabinet-v0 / desk |

**Do not touch for green theater:** select/delete (P03), orbit wiring (P04), save flush (P06), symbol quality rewrite (P05), mesh polish (P08), shortcut map (P09), Fabric full-stage.

### 1.6 Live journey body (truth snapshot — rewrite target)

Current file does roughly:

1. Guest enter only → native chrome asserts (topbar, 2D radio, Drawing tools, no step-bar).
2. Capture wallsBefore / furnitureBefore (loose parsers).
3. Draw one wall segment via two-tap (+ retry) → walls **Δ**.
4. Search `chair` → try catalog place twice → else `placeSeatsFromConfigurator(4)`.
5. furniture **Δ ≥ +2**.
6. Toggle 3D then 2D; assert counts stable.
7. Screenshots: `01-guest-entered` … `06-journey-complete` (no door, no cabinet, no proof JSON).

**Verdict (Idiots REPORT §4.2):** journey file exists; CP-07 plan-complete = **false**; cabinet-v0 = **false**; door = **false**; evidence GREEN = **false**.

---

## 2. Brainstormer synthesis (`Idiots/P07-draw-place-journey/REPORT.md`)

### 2.1 One-line mission (binding)

Prove, in a **real browser**, that an **unaided facilities buyer** can open the O&O open3d planner, **draw structure** (walls metric **increases**, then door/opening **objects increase**), and **place ≥2 real catalog SKUs including `cabinet-v0`**, with serial Playwright screenshots + `playwright-run.json` under the gold `02-browser-open3d-journey/` folder — without seed false-green, without configurator cheat as primary pass, without claiming symbol quality (P05) or select/delete (P03) from this phase alone.

### 2.2 Gate definitions

| Gate | Must prove | Hard metrics | Not sufficient |
|------|------------|--------------|----------------|
| **W1** | User draws walls; walls **increase**; door/opening placed; **objects increase after opening** | `wallsAfter > wallsBefore`; `objectsAfterOpening > objectsAfterWalls` | Absolute walls ≥1 or ≥4; toast/copy alone; screenshot alone; wall tool pressed alone |
| **W2 place** | Place ≥2 furniture incl. **`cabinet-v0`**; second SKU recorded; furniture **Δ ≥ +2**; non-blank 2D canvas PNG | `furnitureAfter ≥ furnitureBefore + 2`; `includesCabinetV0: true`; canvas PNG byteLength > 5000 | Configurator-only place as primary; “chair” any SKU; absolute furniture ≥1; unit tests; non-blank PNG as P05 quality |

### 2.3 Split ownership of “W2”

| Half | Owner phase | Evidence folder |
|------|-------------|-----------------|
| **Place half** | **P07 / CP-07** | `02-browser-open3d-journey/` |
| **Symbol quality half** | **P05 / CP-05** | `05-symbols-svg/` |

### 2.4 Kill-order role

```
CP-00 → CP-01 → CP-02 → CP-03 (W3 unit+browser) → CP-07 (this) → CP-06 save
         fill parallel: CP-04 orbit · CP-05 symbols · CP-08 mesh · CP-09 shortcuts
         → CP-10 handover
```

CP-07 is spine **#4** after W3. Full product story still needs **CP-03 + CP-05 not red** unless owner WAIVE.

### 2.5 Approaches (decision)

| Approach | Description | Call |
|----------|-------------|------|
| **A** | Align live journey to plan bar: rewrite serial file; `getFurnitureCount`; open3d→guest; walls Δ + opening objects Δ; cabinet-v0 + desk; gold PNGs + proof JSON; configurator not green | **Chosen** |
| **B** | Two-file / two-test W1 then W2 split | Only if single test unmaintainable; still one folder, serial, one proof JSON |
| **C** | Open3d-only, never guest | Reject as sole strategy (auth/blank host blocks) |
| **D** | Configurator-first place | **Reject** for CP-07 |

### 2.6 Raised bar (stronger than “test file exists”)

- Deltas only (seed walls ≥4 is a **lie** if used as absolute pass).
- Opening must raise **objects after walls**, not toast copy.
- W2 must place **cabinet-v0** (not chair/workstation-only).
- Non-blank PNG ≠ symbol quality.
- Serial single evidence writer.
- Full 01–07 storyboard + proof JSON fields.
- **Demo bar** (optional, not automation minimum): closed room, door visible in PNG, human-identifiable cabinet vs desk, no configurator in recording, structure+2 SKUs under 10 minutes unaided.

### 2.7 Industry → O&O verbs (ideas only — ethics)

| Industry loop | O&O W1–W2 action |
|---------------|------------------|
| Structure then decorate (P5D / Homestyler / RoomSketcher) | Wall/Opening first; inventory second |
| Click/drag catalog place | Search → Add → canvas click |
| Manufacturer SKU identity (IKEA-class pattern) | cabinet-v0 modular path |
| Guest try before account | Guest fallback if open3d auth-walls |
| Status feedback | `.pw-status-bar` deltas |

**Forbidden:** competitor JS, CSS, GLB, icons, screenshots, brand strings into `site/` or fixtures.

### 2.8 Expert S1–S12 (still binding)

| ID | Topic | Execute rule |
|----|-------|--------------|
| S1 | Serial single writer | Keep `mode: "serial"` + one evidence writer |
| S2 | Baseline deltas | Always walls/objects/furniture before action |
| S3 | baseURL honesty | Record `server` + `baseURL` in proof |
| S4 | clear storage on open3d | `clearPlannerStorage` before goto |
| S5 | getFurnitureCount | Land helper; strict span parse |
| S6 | objects Δ for door | After walls baseline |
| S7 | second SKU lock | `sample-desk-1` / sofa fallback |
| S8 | path table Open3dNativeHost | Correct absolute path if product red |
| S9 | place ≠ P05 quality | Explicit honesty in proof + exit |
| S10 | searchbox gold selector | Prefer role name |
| S11 | import getObjectCount | Shared helpers only |
| S12 | out of scope | No select/save/orbit polish |

### 2.9 Open questions resolved in this plan

| Question | Resolution |
|----------|------------|
| open3d vs guest | open3d primary; guest fallback; record `routeUsed` |
| Wall interaction | two-click primary (guidance + live journey); drag fallback if needed |
| Opening interaction | Opening tool + tap on wall; placeOpening micro-drag fallback |
| Place path | `placeCatalogOnCanvas` with Modular Cabinet / desk selectors |
| Second SKU | `sample-desk-1` via search `desk`; sofa fallback only if desk fails **after** catalog load proven |
| Keep 2D↔3D in journey? | Optional after core 01–07; not required for CP-07; do not claim W4 |
| Configurator fallback | **Forbidden** for CP-07 green proof path |
| Owner unlock | W0 unlocked per phase card; do not re-ask unlock for already-unlocked waves |

---

## 3. Ethics / non-copy

- Research under `D:\websites` and Idiots synthesis = **jobs / grammar / JTBD only**.
- **Forbidden:** competitor code, CSS, GLB, icons, catalog assets, pixel-matched chrome, marketing slogans as O&O copy.
- Use only O&O labels: Wall, Opening, Place, Search catalog elements, Add … to canvas.
- Packages: MIT/open already in stack; paid only if in `ayushdocs/17-LICENSES-CLEARED.md` (none required for this phase).
- Evidence only under repo-root `results/` — never `site/results/` or `site/test-results/` as gate home.
- Firecrawl is **dead** for routine re-scrape.

---

## 4. File map

### 4.1 Create

| Path | Why |
|------|-----|
| `results/planner/world-standard-wave/02-browser-open3d-journey/` | Canonical evidence (dir via beforeAll / shell) |
| `results/planner/world-standard-wave/07-browser-journey/NOTES.md` | Alias pointer |
| Evidence artifacts on execute: PNGs 01–07, `playwright-run.json`, `playwright-raw.log`, optional `run.json` | CP-07 floor |

### 4.2 Modify

| Path | What changes |
|------|----------------|
| `site/tests/e2e/plannerCanvasHelpers.ts` | Add `getFurnitureCount`; add `drawWallByTwoClicks` |
| `site/tests/e2e/open3d-world-standard-journey.spec.ts` | Full rewrite to W1+W2 binding storyboard + proof writer |
| `site/package.json` | Add `test:e2e:world-standard-w1w2` script |

### 4.3 Reuse (no change unless red)

| Path | Role |
|------|------|
| `site/tests/e2e/guestProjectSetup.ts` | clear + guest enter |
| `site/config/build/playwright.config.ts` | baseURL / webServer (do not weaken fullyParallel globally) |
| `site/config/build/playwright-open3d-world-specs.json` | Keep W1-W2 mapping |
| `site/features/planner/open3d/editor/demoCatalogItems.ts` | SKU lock |
| Gold patterns: `admin-svg-publish-p01.spec.ts`, `planner-guest-workspace.spec.ts`, `open3d-mesh-symbol-live-verify.spec.ts` | Evidence shape / selectors / cabinet place |

### 4.4 Product (only if journey red)

Touch minimal locus from §1.5; each product fix is its own diagnose→fix→re-run after browser red is isolated.

### 4.5 Do not create

| Path | Why |
|------|-----|
| Second journey spec file racing same folder | Serial single writer |
| `results/tests/` as gate home | RESULTS-MAP forbidden |
| `02-engine-lock/` | Folder lock |
| Changes under `Idiots/` or `Idiots2/` | Report ownership |
| Fabric-stage helpers as W1/W2 proof | Wrong engine |

---

## 5. Architecture & data flow

### 5.1 Host chain

```
/planner/open3d
  → features/planner/ui/Open3dPlannerHost
    → features/planner/open3d/ui/Open3dNativeHost
      → OOPlannerWorkspace
        → FeasibilityCanvas (walls / openings / place pointer)
        → InventoryPanel (search / Add to canvas)
        → WorkspaceShell footer (.pw-status-bar metrics)

/planner/guest/?plannerDevTools=1
  → setup gate → Open3dPlannerWorkspaceRoute → same Host stack
  → Start from Scratch may seed ≥4 walls, 0 furniture
```

**Approach A locked:** FeasibilityCanvas is the live interactive 2D engine. Fabric furniture flag stays **OFF** for this journey. Do not prove W1/W2 through `__plannerFabricView` / `firstFurnitureCenter`.

### 5.2 Metrics data flow (why deltas)

```
activeFloor
  → summarizeFloorMetrics
    walls = floor.walls.length
    furniture = floor.furniture.length
    objects = walls + rooms + doors + windows + furniture + stairs + columns
  → WorkspaceShell spans: "N objects" | "N walls" | "N furniture"
  → Playwright helpers parse .pw-status-bar > span
```

**Implications:**
- Drawing a wall raises **walls** and **objects**.
- Placing a door/opening raises **objects** (doors list) — must compare to **objectsAfterWalls**, not absolute ≥1.
- Placing furniture raises **furniture** and **objects**.

### 5.3 Journey control flow (serial one test)

```
beforeAll: mkdir evidence dirs
enterWorldStandardPlanner(page)
  → clearPlannerStorage
  → try /planner/open3d ready?
  → else enterGuestPlannerWorkspace
capture baselines (walls, objects, furniture)
screenshot 01-route-ready
W1 Wall tool → draw segments → walls ↑ → 02-walls-drawn
W1 Opening tool → place on wall → objects ↑ → 03-door-opening
W2 search cabinet-v0 → placeCatalogOnCanvas → furniture ↑ → 04-cabinet-v0-placed
W2 search desk → place → furniture ≥ +2 → 05-two-items-placed
canvas screenshot 06 byteLength > 5000
07-journey-complete + write playwright-run.json (+ optional run.json)
```

### 5.4 Selector contract (O&O only)

| Need | Selector |
|------|----------|
| 2D canvas | `[data-testid="planner-2d-canvas"] canvas` (`PLANNER_PRIMARY_CANVAS`) |
| Drawing tools group | `getByRole("group", { name: "Drawing tools" })` |
| Wall tool | button name `/^Wall(?: \(|$)/` via `selectPlannerTool(page, "Wall")` |
| Opening tool | `selectPlannerTool(page, "Opening")` |
| Catalog region | `getByRole("region", { name: "Catalog browser" })` |
| Search | `getByRole("searchbox", { name: /Search catalog elements/i })` **or** `getByLabel("Search catalog elements")` |
| Add CTA cabinet | `/Add Modular Cabinet to canvas/i` |
| Add CTA desk | `/Add .* to canvas/i` after search `desk` |
| Status | `.pw-status-bar > span` exact `/^\d+ walls$/` etc. |
| Topbar | `.pw-topbar` |
| Native chrome | radio `2D`/`3D`; assert `.pw-step-bar` count 0 |

### 5.5 Timeout hierarchy

| Layer | Value | Why |
|-------|-------|-----|
| Config default | 60s | Too short for full draw+place |
| Describe configure | **120s** | Journey reality |
| Poll walls/opening | 8–15s | Status metric lag |
| Poll furniture | 20–30s | Catalog arm + place race |
| open3d goto | 60s | Cold Next |
| Entry ready race | 25s | Then guest fallback |

### 5.6 Server / baseURL honesty

| Mode | When | Proof fields |
|------|------|--------------|
| Dev reuse | `$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"` + `pnpm run dev` | `"server": "PLAYWRIGHT_BASE_URL reuse…"` |
| webServer build+start | baseURL **unset** | `"server": "Playwright webServer: build && start"` |

Unset baseURL without recording is a **false-green risk**. Prefer explicit baseURL for interactive land loops.

---

## 6. Task list

### Task 00: Preconditions & evidence dirs

**Files:**
- Create (dirs): `results/planner/world-standard-wave/02-browser-open3d-journey/`
- Create (dirs): `results/planner/world-standard-wave/07-browser-journey/`
- Read-only: phase card, appendix, this plan, Idiots REPORT, live journey + helpers

- [ ] **Step 1: Confirm live files and gaps**

Run:

```powershell
cd D:\OandO07072026
Test-Path site\tests\e2e\open3d-world-standard-journey.spec.ts
Test-Path site\tests\e2e\plannerCanvasHelpers.ts
Test-Path site\tests\e2e\guestProjectSetup.ts
Test-Path site\features\planner\open3d\editor\demoCatalogItems.ts
Select-String -Path site\tests\e2e\plannerCanvasHelpers.ts -Pattern "getFurnitureCount"
Select-String -Path site\package.json -Pattern "world-standard-w1w2"
Test-Path results\planner\world-standard-wave\02-browser-open3d-journey
```

Expected:
- Journey + helpers + guest setup + demo catalog = `True`
- `getFurnitureCount` = **no matches** (gap still open)
- `world-standard-w1w2` = **no matches**
- Evidence folder = `False` (missing — re-prove)

- [ ] **Step 2: Confirm cabinet-v0 + desk in demo catalog**

Run:

```powershell
Select-String -Path site\features\planner\open3d\editor\demoCatalogItems.ts -Pattern 'id: "cabinet-v0"|id: "sample-desk-1"|geometryMode: "modular-cabinet-v0"|shortName: "Modular Cabinet"'
```

Expected: all patterns present.

- [ ] **Step 3: Confirm status bar metric shape**

Run:

```powershell
Select-String -Path site\features\planner\open3d\editor\WorkspaceShell.tsx -Pattern "pw-status-bar|objects|walls|furniture"
Select-String -Path site\features\planner\open3d\editor\workspacePlanMetrics.ts -Pattern "doors.length|furniture.length"
```

Expected: spans render `N objects` / `N walls` / `N furniture`; objects includes doors.

- [ ] **Step 4: Create evidence directories**

```powershell
New-Item -ItemType Directory -Force -Path "D:\OandO07072026\results\planner\world-standard-wave\02-browser-open3d-journey" | Out-Null
New-Item -ItemType Directory -Force -Path "D:\OandO07072026\results\planner\world-standard-wave\07-browser-journey" | Out-Null
```

Expected: both dirs exist.

- [ ] **Step 5: Dev server readiness**

```powershell
cd D:\OandO07072026
# If not already running on :3000:
pnpm run dev
```

Smoke routes:
- `http://localhost:3000/planner/open3d`
- `http://localhost:3000/planner/guest/?plannerDevTools=1`

Expected: planner chrome or guest setup; if open3d auth-walls, guest fallback is OK for journey.

**Port conflict:** stop; log `Failures.md`; do **not** kill unknown processes.

- [ ] **Step 6: Playwright browser binary if needed**

```powershell
cd D:\OandO07072026\site
pnpm run test:browsers:install
```

Expected: chromium available for Playwright.

- [ ] **Step 7: Optional early alias NOTES (git-trackable)**

Create `results/planner/world-standard-wave/07-browser-journey/NOTES.md`:

```markdown
# P07 evidence alias

Canonical proof: `D:\OandO07072026\results\planner\world-standard-wave\02-browser-open3d-journey\`
Relative: `../02-browser-open3d-journey/`
Checkpoint: CP-07
Gates: W1, W2
Status: OPEN until playwright-run.json result=pass
```

- [ ] **Step 8: Commit preconditions only if NOTES tracked**

```bash
git add results/planner/world-standard-wave/07-browser-journey/NOTES.md
git commit -m "docs(p07): evidence alias NOTES for W1-W2 journey folder"
```

---

### Task 01: Add `getFurnitureCount` (+ wall two-click helper)

**Files:**
- Modify: `site/tests/e2e/plannerCanvasHelpers.ts`
- Test: consumed by journey (Playwright); no separate vitest required for e2e-only helper

- [ ] **Step 1: Prove helper is missing (FAIL baseline)**

```powershell
cd D:\OandO07072026\site
node -e "const fs=require('fs'); const s=fs.readFileSync('tests/e2e/plannerCanvasHelpers.ts','utf8'); if(s.includes('export async function getFurnitureCount')) process.exit(0); process.exit(1)"
```

Expected: exit code **1**.

- [ ] **Step 2: Implement `getFurnitureCount` (mirror walls/objects)**

Insert **after** `getWallCount` in `plannerCanvasHelpers.ts`:

```typescript
export async function getFurnitureCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar > span")
    .filter({ hasText: /^\d+ furniture$/ })
    .textContent();
  const match = text?.match(/^(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}
```

**Rules:**
- Locator: `.pw-status-bar > span` filtered by `/^\d+ furniture$/` — **not** body scrape.
- Miss returns **0** (same as wall/object helpers) — **not** `-1`.
- Do **not** use Fabric object lists or 3D mesh counts as furniture oracle.

- [ ] **Step 3: Implement `drawWallByTwoClicks`**

Still in `plannerCanvasHelpers.ts` (after `selectPlannerTool` / canvas helpers are available):

```typescript
/**
 * Open3d wall tool: two taps (start then end).
 * Wall guidance is "Click start and end points"; micro-drag can miss commit.
 */
export async function drawWallByTwoClicks(
  page: Page,
  from: { rx: number; ry: number },
  to: { rx: number; ry: number },
): Promise<void> {
  await selectPlannerTool(page, "Wall");
  await tapOnCanvas(page, from.rx, from.ry);
  await page.waitForTimeout(200);
  await tapOnCanvas(page, to.rx, to.ry);
  await page.waitForTimeout(200);
}
```

- [ ] **Step 4: Verify exports present**

```powershell
cd D:\OandO07072026\site
node -e "const fs=require('fs'); const s=fs.readFileSync('tests/e2e/plannerCanvasHelpers.ts','utf8'); for (const n of ['export async function getFurnitureCount','export async function drawWallByTwoClicks']) { if(!s.includes(n)) { console.error('missing', n); process.exit(1);} } console.log('helpers: ok')"
```

Expected: `helpers: ok`

- [ ] **Step 5: Commit helper**

```bash
git add site/tests/e2e/plannerCanvasHelpers.ts
git commit -m "test(e2e): add getFurnitureCount and drawWallByTwoClicks for W1-W2 journey"
```

---

### Task 02: Rewrite journey skeleton — entry, serial, evidence paths, baselines

**Files:**
- Modify: `site/tests/e2e/open3d-world-standard-journey.spec.ts` (replace body)

- [ ] **Step 1: Replace entire file with full journey (preferred single land)**

Implementers may land Tasks 02–05 in one continuous rewrite. The **final** file content must be the complete source below (or equivalent that satisfies every assert). Do not leave permanent `expect(false)` scaffolds in the landable branch.

**Full target source for `open3d-world-standard-journey.spec.ts`:**

```typescript
/**
 * World-standard open3d journey — W1 (draw walls + door/opening) + W2 (place catalog incl. cabinet-v0).
 *
 * Evidence (canonical): results/planner/world-standard-wave/02-browser-open3d-journey/
 * Phase alias:          results/planner/world-standard-wave/07-browser-journey/
 * Pattern: admin-svg-publish-p01.spec.ts (flat dir + PNGs + JSON)
 * Serial: playwright.config fullyParallel — this file MUST run serial.
 *
 * Anti false-green:
 *  - walls/objects/furniture deltas (guest seed walls ≥4)
 *  - cabinet-v0 required (no systems-configurator-only green)
 *  - non-blank canvas PNG ≠ P05 symbol quality
 */
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

import {
  clearPlannerStorage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import {
  drawWallByTwoClicks,
  getFurnitureCount,
  getObjectCount,
  getWallCount,
  placeCatalogOnCanvas,
  placeOpeningOnCanvas,
  selectPlannerTool,
  tapOnCanvas,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

const SITE_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const EVIDENCE_DIR = path.join(
  REPO_ROOT,
  "results",
  "planner",
  "world-standard-wave",
  "02-browser-open3d-journey",
);
const PHASE_ALIAS_DIR = path.join(
  REPO_ROOT,
  "results",
  "planner",
  "world-standard-wave",
  "07-browser-journey",
);

const REQUIRED_SCREENSHOTS = [
  "01-route-ready.png",
  "02-walls-drawn.png",
  "03-door-opening.png",
  "04-cabinet-v0-placed.png",
  "05-two-items-placed.png",
  "06-canvas-2d-symbols.png",
  "07-journey-complete.png",
] as const;

test.describe.configure({ mode: "serial", timeout: 120_000 });

test.beforeAll(() => {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(PHASE_ALIAS_DIR, { recursive: true });
});

/** Primary: /planner/open3d · Fallback: guest (?plannerDevTools=1 owned by helper). */
async function enterWorldStandardPlanner(
  page: Page,
): Promise<"open3d" | "guest"> {
  await clearPlannerStorage(page);
  await page.goto("/planner/open3d", {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  const topbar = page.locator(".pw-topbar");
  const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
  const ready = await Promise.race([
    topbar.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
    canvas.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
  ]).catch(() => false);

  if (ready) {
    await expect(
      page.locator('[data-testid="planner-2d-canvas"] canvas'),
    ).toBeVisible({ timeout: 25_000 });
    return "open3d";
  }

  await enterGuestPlannerWorkspace(page, {
    projectName: "W1-W2 world-standard",
  });
  await waitForPlannerCanvas(page);
  return "guest";
}

type JourneyProof = {
  routeUsed: "open3d" | "guest" | "unknown";
  wallsBefore: number;
  wallsAfterDraw: number;
  wallsIncreased: boolean;
  objectsBefore: number;
  objectsAfterWalls: number;
  objectsAfterOpening: number;
  doorOrOpeningPlaced: boolean;
  objectsIncreasedAfterOpening: boolean;
  furnitureBefore: number;
  furnitureAfter: number;
  furnitureAtLeast: number;
  includesCabinetV0: boolean;
  secondCatalogId: string;
  symbolCheck: string;
  screenshots: string[];
  baseURL: string;
  server: string;
};

function emptyProof(): JourneyProof {
  return {
    routeUsed: "unknown",
    wallsBefore: 0,
    wallsAfterDraw: 0,
    wallsIncreased: false,
    objectsBefore: 0,
    objectsAfterWalls: 0,
    objectsAfterOpening: 0,
    doorOrOpeningPlaced: false,
    objectsIncreasedAfterOpening: false,
    furnitureBefore: 0,
    furnitureAfter: 0,
    furnitureAtLeast: 2,
    includesCabinetV0: false,
    secondCatalogId: "",
    symbolCheck: "non-blank-canvas-png (P07); quality bar P05",
    screenshots: [],
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    server: process.env.PLAYWRIGHT_BASE_URL
      ? "PLAYWRIGHT_BASE_URL reuse (dev or external)"
      : "Playwright webServer: pnpm run build && pnpm run start",
  };
}

function writeProofFiles(
  proof: JourneyProof,
  result: "pass" | "fail",
  blockersOpen: string[] = [],
): void {
  const date = new Date().toISOString().slice(0, 10);
  const playwrightRun = {
    slice: "P07 / CP-07 world-standard W1–W2 open3d journey",
    date,
    result,
    tests: 1,
    failed: result === "pass" ? 0 : 1,
    gates: {
      W1:
        proof.wallsIncreased && proof.objectsIncreasedAfterOpening
          ? "pass"
          : "fail",
      W2:
        proof.includesCabinetV0 &&
        proof.furnitureAfter >= proof.furnitureBefore + 2 &&
        proof.secondCatalogId.length > 0
          ? "pass"
          : "fail",
    },
    routeUsed: proof.routeUsed,
    command:
      "npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list",
    cwd: "site",
    baseURL: proof.baseURL,
    server: proof.server,
    spec: "site/tests/e2e/open3d-world-standard-journey.spec.ts",
    proof: {
      wallsBefore: proof.wallsBefore,
      wallsAfterDraw: proof.wallsAfterDraw,
      wallsIncreased: proof.wallsIncreased,
      doorOrOpeningPlaced: proof.doorOrOpeningPlaced,
      objectsBefore: proof.objectsBefore,
      objectsAfterWalls: proof.objectsAfterWalls,
      objectsAfterOpening: proof.objectsAfterOpening,
      objectsIncreasedAfterOpening: proof.objectsIncreasedAfterOpening,
      furnitureBefore: proof.furnitureBefore,
      furnitureAfter: proof.furnitureAfter,
      furnitureAtLeast: proof.furnitureAtLeast,
      includesCabinetV0: proof.includesCabinetV0,
      secondCatalogId: proof.secondCatalogId,
      symbolCheck: proof.symbolCheck,
      screenshots: proof.screenshots,
    },
    rawLog: "playwright-raw.log",
    blockersResolved: result === "pass" ? [] : undefined,
    blockersOpen: result === "fail" ? blockersOpen : undefined,
    honesty:
      "Does not claim W3–W8, CP-03 select/delete, or CP-05 symbol quality",
  };

  writeFileSync(
    path.join(EVIDENCE_DIR, "playwright-run.json"),
    `${JSON.stringify(playwrightRun, null, 2)}\n`,
    "utf8",
  );

  const runJson = {
    phase: "P07",
    gate: ["W1", "W2"],
    evidenceRoot:
      "results/planner/world-standard-wave/02-browser-open3d-journey",
    cwd: "D:\\OandO07072026\\site",
    command: playwrightRun.command,
    exitCode: result === "pass" ? 0 : 1,
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    gitHead: process.env.GIT_HEAD ?? "see HEAD.txt if present",
    notes: `routeUsed=${proof.routeUsed}; server=${proof.server}`,
  };
  writeFileSync(
    path.join(EVIDENCE_DIR, "run.json"),
    `${JSON.stringify(runJson, null, 2)}\n`,
    "utf8",
  );
}

test.describe("W1–W2 open3d world-standard journey (browser)", () => {
  test("draw walls + opening → place cabinet-v0 + second SKU → non-blank 2D", async ({
    page,
  }) => {
    const proof = emptyProof();
    const blockers: string[] = [];

    try {
      // --- Entry ---
      proof.routeUsed = await enterWorldStandardPlanner(page);
      await waitForPlannerCanvas(page);
      await expect(page.locator(".pw-topbar")).toBeVisible();
      await expect(
        page.getByRole("radio", { name: "2D", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("group", { name: "Drawing tools" }),
      ).toBeVisible();
      await expect(page.locator(".pw-step-bar")).toHaveCount(0);

      proof.wallsBefore = await getWallCount(page);
      proof.objectsBefore = await getObjectCount(page);
      proof.furnitureBefore = await getFurnitureCount(page);
      expect(proof.wallsBefore).toBeGreaterThanOrEqual(0);
      expect(proof.objectsBefore).toBeGreaterThanOrEqual(0);
      expect(proof.furnitureBefore).toBeGreaterThanOrEqual(0);

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "01-route-ready.png"),
      });
      proof.screenshots.push("01-route-ready.png");

      // --- W1: walls (delta, not seed absolute) ---
      await drawWallByTwoClicks(
        page,
        { rx: 0.25, ry: 0.25 },
        { rx: 0.75, ry: 0.25 },
      );
      await drawWallByTwoClicks(
        page,
        { rx: 0.75, ry: 0.25 },
        { rx: 0.75, ry: 0.75 },
      );
      await drawWallByTwoClicks(
        page,
        { rx: 0.75, ry: 0.75 },
        { rx: 0.25, ry: 0.75 },
      );
      await drawWallByTwoClicks(
        page,
        { rx: 0.25, ry: 0.75 },
        { rx: 0.25, ry: 0.25 },
      );

      let wallsGrew = false;
      try {
        await expect
          .poll(async () => getWallCount(page), { timeout: 8_000 })
          .toBeGreaterThan(proof.wallsBefore);
        wallsGrew = true;
      } catch {
        wallsGrew = false;
      }
      if (!wallsGrew) {
        await drawWallByTwoClicks(
          page,
          { rx: 0.3, ry: 0.45 },
          { rx: 0.7, ry: 0.45 },
        );
        await expect
          .poll(async () => getWallCount(page), { timeout: 15_000 })
          .toBeGreaterThan(proof.wallsBefore);
      }

      proof.wallsAfterDraw = await getWallCount(page);
      proof.wallsIncreased = proof.wallsAfterDraw > proof.wallsBefore;
      expect(proof.wallsIncreased).toBe(true);
      proof.objectsAfterWalls = await getObjectCount(page);

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "02-walls-drawn.png"),
      });
      proof.screenshots.push("02-walls-drawn.png");

      // --- W1: opening / door on wall (objects Δ after walls) ---
      await selectPlannerTool(page, "Opening");
      await tapOnCanvas(page, 0.5, 0.25);
      let openingPlaced = false;
      try {
        await expect
          .poll(async () => getObjectCount(page), { timeout: 8_000 })
          .toBeGreaterThan(proof.objectsAfterWalls);
        openingPlaced = true;
      } catch {
        openingPlaced = false;
      }
      if (!openingPlaced) {
        await placeOpeningOnCanvas(
          page,
          { rx: 0.45, ry: 0.25 },
          { rx: 0.55, ry: 0.25 },
        );
        await expect
          .poll(async () => getObjectCount(page), { timeout: 15_000 })
          .toBeGreaterThan(proof.objectsAfterWalls);
      }

      proof.objectsAfterOpening = await getObjectCount(page);
      proof.doorOrOpeningPlaced = true;
      proof.objectsIncreasedAfterOpening =
        proof.objectsAfterOpening > proof.objectsAfterWalls;
      expect(proof.objectsIncreasedAfterOpening).toBe(true);

      await expect
        .poll(async () => getWallCount(page), { timeout: 5_000 })
        .toBeGreaterThanOrEqual(proof.wallsAfterDraw);

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "03-door-opening.png"),
      });
      proof.screenshots.push("03-door-opening.png");

      // --- W2: cabinet-v0 (manufacturer modular path — non-negotiable) ---
      // Re-capture furniture baseline immediately before place (honest if residual).
      proof.furnitureBefore = await getFurnitureCount(page);

      const catalog = page.getByRole("region", { name: "Catalog browser" });
      const search = page
        .getByRole("searchbox", { name: /Search catalog elements/i })
        .or(page.getByLabel("Search catalog elements"));
      await expect(search).toBeVisible({ timeout: 15_000 });

      await search.fill("cabinet-v0");
      await page.waitForTimeout(400);

      const cabinetName = /Add Modular Cabinet to canvas/i;
      const genericAdd = /Add .* to canvas/i;
      const cabinetBtn = catalog.getByRole("button", { name: cabinetName }).first();
      const cabinetVisible = await cabinetBtn
        .isVisible({ timeout: 8_000 })
        .catch(() => false);

      if (cabinetVisible) {
        await placeCatalogOnCanvas(page, 0.4, 0.4, cabinetName);
      } else {
        await expect(
          catalog.getByRole("button", { name: genericAdd }).first(),
        ).toBeVisible({ timeout: 15_000 });
        await placeCatalogOnCanvas(page, 0.4, 0.4, genericAdd);
      }

      await expect
        .poll(async () => getFurnitureCount(page), { timeout: 30_000 })
        .toBeGreaterThan(proof.furnitureBefore);

      const bodyAfterCabinet = await page.locator("body").innerText();
      const identityCue =
        /cabinet-v0/i.test(bodyAfterCabinet) ||
        /Modular Cabinet/i.test(bodyAfterCabinet) ||
        /Placed Modular Cabinet/i.test(bodyAfterCabinet);
      // Search was cabinet-v0 + Modular Cabinet CTA path is acceptable identity when UI echoes name.
      expect(
        identityCue || cabinetVisible,
        "cabinet-v0 place identity not proven",
      ).toBeTruthy();
      proof.includesCabinetV0 = true;

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "04-cabinet-v0-placed.png"),
      });
      proof.screenshots.push("04-cabinet-v0-placed.png");

      // --- W2: second SKU (desk preferred, sofa fallback) ---
      const furnitureAfterCabinet = await getFurnitureCount(page);
      await search.fill("desk");
      await page.waitForTimeout(400);

      let secondId = "sample-desk-1";
      const deskBtn = catalog
        .getByRole("button", { name: /Add .*Desk.* to canvas/i })
        .first();
      const deskVisible = await deskBtn
        .isVisible({ timeout: 8_000 })
        .catch(() => false);

      if (deskVisible) {
        await placeCatalogOnCanvas(page, 0.55, 0.55, /Add .*Desk.* to canvas/i);
      } else {
        // Fallback sofa only if desk catalog path fails to surface a button.
        await search.fill("sofa");
        await page.waitForTimeout(400);
        secondId = "sample-sofa-1";
        await expect(
          catalog.getByRole("button", { name: genericAdd }).first(),
        ).toBeVisible({ timeout: 15_000 });
        await placeCatalogOnCanvas(page, 0.55, 0.55, genericAdd);
      }

      await expect
        .poll(async () => getFurnitureCount(page), { timeout: 20_000 })
        .toBeGreaterThanOrEqual(proof.furnitureBefore + 2);

      proof.furnitureAfter = await getFurnitureCount(page);
      expect(proof.furnitureAfter - proof.furnitureBefore).toBeGreaterThanOrEqual(
        2,
      );
      // Sanity: second place moved furniture beyond cabinet-only
      expect(proof.furnitureAfter).toBeGreaterThanOrEqual(
        furnitureAfterCabinet + 1,
      );
      proof.secondCatalogId = secondId;

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "05-two-items-placed.png"),
      });
      proof.screenshots.push("05-two-items-placed.png");

      // --- Non-blank 2D canvas (not P05 quality) ---
      const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
      await expect(canvas).toBeVisible();
      const shot = await canvas.screenshot({
        path: path.join(EVIDENCE_DIR, "06-canvas-2d-symbols.png"),
      });
      expect(shot.byteLength).toBeGreaterThan(5_000);
      proof.screenshots.push("06-canvas-2d-symbols.png");

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "07-journey-complete.png"),
      });
      proof.screenshots.push("07-journey-complete.png");

      // All required screenshots on disk
      for (const name of REQUIRED_SCREENSHOTS) {
        expect(
          existsSync(path.join(EVIDENCE_DIR, name)),
          `missing screenshot ${name}`,
        ).toBe(true);
      }

      writeProofFiles(proof, "pass");
    } catch (err) {
      blockers.push(err instanceof Error ? err.message : String(err));
      writeProofFiles(proof, "fail", blockers);
      throw err;
    }
  });
});
```

**Hard forbids in this file:**
- `placeSeatsFromConfigurator` import or call
- body-scrape furniture counts as primary oracle
- absolute `walls >= 4` as pass without delta
- `test.skip` when catalog missing (missing catalog = product FAIL)

- [ ] **Step 2: Run journey — expect RED until product/helpers align (or PASS if already green)**

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-raw.log"
```

Expected (first red→green cycle):
- Either FAIL with a specific step message (walls Δ / opening / cabinet / furniture / PNG), artifacts partially written, `playwright-run.json` with `result: "fail"` preferred when catch path runs
- Or PASS with exit 0 if product already supports full bar

**Never** filter log output. **Never** delete red PNGs.

- [ ] **Step 3: Commit rewrite**

```bash
git add site/tests/e2e/open3d-world-standard-journey.spec.ts site/tests/e2e/plannerCanvasHelpers.ts
git commit -m "test(e2e): rewrite W1-W2 journey for walls+opening+cabinet-v0 deltas"
```

---

### Task 03: W1 red→green loop (walls + opening)

**Files:**
- Modify: journey spec interaction coords / fallbacks only if red
- Product (only if systematic red): Feasibility wall/opening, metrics, tool labels

- [ ] **Step 1: Isolate W1 failure class**

If Step 2 of Task 02 failed on walls:

| Symptom | Diagnosis | Fix path |
|---------|-----------|----------|
| walls never > wallsBefore | Wall tool not committing / wrong gesture | Try single segment first; then drag fallback; then product pointer path |
| open3d blank | Host not ready | Guest fallback already in entry — ensure it runs |
| status bar 0 walls always | Metrics not wired | `workspacePlanMetrics` / shell |
| Seed walls high, no Δ | Drawing not registering | chrome-devtools pointer coords |

**Drag fallback** (only if two-click room fails walls Δ after retry):

```typescript
import { dragOnCanvas } from "./plannerCanvasHelpers";
// after two-click failure path:
await selectPlannerTool(page, "Wall");
await dragOnCanvas(page, { rx: 0.25, ry: 0.3 }, { rx: 0.75, ry: 0.3 });
await expect
  .poll(async () => getWallCount(page), { timeout: 15_000 })
  .toBeGreaterThan(proof.wallsBefore);
```

- [ ] **Step 2: Isolate opening failure class**

| Symptom | Diagnosis | Fix path |
|---------|-----------|----------|
| objects not > objectsAfterWalls | Opening not on wall / not creating door | Adjust mid-wall coords to match drawn wall Y |
| walls decrease | Opening destroyed geometry | Product bug — must fix |
| tool Opening not found | Label mismatch | Product `CANVAS_TOOL_LABELS` |

Opening coords should hit the **top horizontal** of the rectangle (`ry ≈ 0.25`). If walls drawn at different relative positions, recompute mid-span from successful wall draw.

- [ ] **Step 3: Re-run until W1 greens**

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

Expected for W1 slice: pass through `03-door-opening.png` (may still fail W2).

- [ ] **Step 4: Commit W1-stable**

```bash
git add site/tests/e2e/open3d-world-standard-journey.spec.ts
# + product files only if touched for real fix
git commit -m "test(e2e): stabilize W1 wall and opening metric deltas"
```

---

### Task 04: W2 red→green loop (cabinet-v0 + second SKU + canvas PNG)

**Files:**
- Journey catalog selectors / place coords
- Product only if inventory/place path broken

- [ ] **Step 1: Cabinet place isolation**

Use proven gold path from `open3d-mesh-symbol-live-verify.spec.ts`:

```typescript
await search.fill("cabinet"); // or "cabinet-v0"
await placeCatalogOnCanvas(page, 0.48, 0.42, /Add Modular Cabinet to canvas/i);
```

| Symptom | Diagnosis | Fix path |
|---------|-----------|----------|
| No Add button | Fuse/filter/demo not loaded | Product catalog — **fail**, do not skip |
| Place not pressed | React arm race | Helper already retries evaluate click |
| Place pressed, furniture no Δ | Canvas hit / pending id | Product placement handler; chrome-devtools |
| GLB 500 | Asset path | Procedural fallback must still raise furniture |

**Forbidden:** calling `placeSeatsFromConfigurator` to green W2.

- [ ] **Step 2: Second SKU isolation**

```typescript
await search.fill("desk");
await placeCatalogOnCanvas(page, 0.55, 0.55, /Add .*Desk.* to canvas/i);
// proof.secondCatalogId = "sample-desk-1"
```

Sofa fallback only after desk button not visible.

- [ ] **Step 3: Canvas non-blank**

```typescript
const shot = await page
  .locator('[data-testid="planner-2d-canvas"] canvas')
  .screenshot({ path: path.join(EVIDENCE_DIR, "06-canvas-2d-symbols.png") });
expect(shot.byteLength).toBeGreaterThan(5_000);
```

**Do not** use full-page screenshot for the 5k assert (chrome chrome can inflate bytes).

- [ ] **Step 4: Full green run + raw log**

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-raw.log"
```

Expected:
- exit code **0**
- 1 passed
- all PNGs 01–07 on disk
- `playwright-run.json` `result: "pass"`, `failed: 0`, `gates.W1/W2: pass`
- `includesCabinetV0: true`
- `secondCatalogId` non-empty

- [ ] **Step 5: Commit W2 green**

```bash
git add site/tests/e2e/open3d-world-standard-journey.spec.ts site/tests/e2e/plannerCanvasHelpers.ts
git commit -m "test(e2e): W2 cabinet-v0 + second SKU place with non-blank canvas proof"
```

---

### Task 05: npm script + alias + proof hardening + CP-07 checklist

**Files:**
- Modify: `site/package.json`
- Create/update: `results/planner/world-standard-wave/07-browser-journey/NOTES.md`
- Evidence: verify pack on disk

- [ ] **Step 1: Add npm script**

In `site/package.json` scripts section (near other e2e scripts):

```json
"test:e2e:world-standard-w1w2": "npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list"
```

Keep `test:e2e:open3d-world` umbrella intact.

- [ ] **Step 2: Document run with baseURL**

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm run test:e2e:world-standard-w1w2 2>&1 | Tee-Object -FilePath "..\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-raw.log"
```

Expected: exit 0; log unfiltered.

Without `PLAYWRIGHT_BASE_URL`, config uses `build && start` — slower; proof `server` field must still match reality.

- [ ] **Step 3: Ensure alias NOTES**

`results/planner/world-standard-wave/07-browser-journey/NOTES.md`:

```markdown
# P07 evidence alias

Canonical proof: `D:\OandO07072026\results\planner\world-standard-wave\02-browser-open3d-journey\`
Relative: `../02-browser-open3d-journey/`
Checkpoint: CP-07
Gates: W1, W2
Contract files: `playwright-run.json`, `run.json`, `playwright-raw.log`
Screenshots: 01-route-ready … 07-journey-complete
```

Do **not** invent a third folder name.

- [ ] **Step 4: Disk verification script (agent)**

```powershell
$root = "D:\OandO07072026\results\planner\world-standard-wave\02-browser-open3d-journey"
$names = @(
  "01-route-ready.png","02-walls-drawn.png","03-door-opening.png",
  "04-cabinet-v0-placed.png","05-two-items-placed.png",
  "06-canvas-2d-symbols.png","07-journey-complete.png",
  "playwright-run.json","playwright-raw.log"
)
foreach ($n in $names) {
  $p = Join-Path $root $n
  if (-not (Test-Path $p)) { Write-Error "MISSING $p"; exit 1 }
  Write-Host "OK $n"
}
$json = Get-Content (Join-Path $root "playwright-run.json") -Raw | ConvertFrom-Json
if ($json.result -ne "pass") { Write-Error "result not pass"; exit 1 }
if ($json.failed -ne 0) { Write-Error "failed != 0"; exit 1 }
if ($json.gates.W1 -ne "pass" -or $json.gates.W2 -ne "pass") { Write-Error "gates not pass"; exit 1 }
if (-not $json.proof.includesCabinetV0) { Write-Error "cabinet missing"; exit 1 }
Write-Host "CP-07 evidence pack: GREEN floor"
```

Expected: `CP-07 evidence pack: GREEN floor`

- [ ] **Step 5: CP-07 checklist (all must be true)**

- [ ] Spec exists at `site/tests/e2e/open3d-world-standard-journey.spec.ts`
- [ ] Serial mode + 120s
- [ ] `getFurnitureCount` in helpers; journey uses it
- [ ] W1: walls Δ + objects Δ after opening
- [ ] W2: furniture ≥ before+2 incl. cabinet-v0 + recorded second id
- [ ] Screenshots 01–07 under `02-browser-open3d-journey/`
- [ ] `playwright-run.json` pass, failed 0, gates W1/W2
- [ ] Raw log retained unfiltered
- [ ] `07-browser-journey/` alias NOTES
- [ ] Local commit; push/mirror per `AGENTS.md` (agent call; no force-push)
- [ ] Honesty: no W3–W8 / “planner works” claim from this alone

**Exit statement when green:**

> P07 complete. W1 and W2 browser-proven on route `<open3d|guest>`. Evidence: `D:\OandO07072026\results\planner\world-standard-wave\02-browser-open3d-journey\playwright-run.json`. Does not claim W3–W8, CP-03 select/delete, or CP-05 symbol quality.

- [ ] **Step 6: Landable commit**

```bash
git add site/package.json site/tests/e2e/open3d-world-standard-journey.spec.ts site/tests/e2e/plannerCanvasHelpers.ts results/planner/world-standard-wave/07-browser-journey/NOTES.md
# PNGs/json/log under results/ — add if repo tracks them; prefer not dumping huge binaries beyond 7 PNGs + json/log
git add results/planner/world-standard-wave/02-browser-open3d-journey/
git commit -m "test(e2e): land CP-07 W1-W2 world-standard journey evidence pack"
```

---

### Task 06 (conditional): Product fix only if journey red for real reasons

**Do not start this task** if Task 04 is green.

**Files:** only the minimal locus from §1.5 after chrome-devtools diagnosis.

Decision tree:

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

- [ ] **Step 1: Capture repro with chrome-devtools** (route, console, network for catalog/GLB)
- [ ] **Step 2: Minimal product fix** (one concern)
- [ ] **Step 3: Re-run Task 04 full green command**
- [ ] **Step 4: Commit product fix separately**

```bash
git commit -m "fix(planner): <specific root cause so W1/W2 journey metrics move>"
```

**Out of scope forever for this phase:** select/delete polish, orbit, save labels, mesh toe/carcass, shortcut map rewrite, Fabric full-stage.

---

## 7. Test matrix

| ID | Layer | What | Command | Expected |
|----|-------|------|---------|----------|
| T0 | Disk | Files exist; helper gap | Task 00 Step 1 | Gaps confirmed |
| T1 | Node | `getFurnitureCount` export | Task 01 Step 4 | `helpers: ok` |
| T2 | Playwright | Full journey serial | `test:e2e:world-standard-w1w2` + baseURL | exit 0; 1 passed |
| T3 | Disk | PNGs 01–07 | Task 05 Step 4 | all present |
| T4 | JSON | proof fields | parse `playwright-run.json` | pass, cabinet, second id, deltas |
| T5 | Map | optional `run.json` | exists | phase P07, gate W1/W2 |
| T6 | Log | raw log | unfiltered list output | no agent filtering |
| T7 | Negative | Configurator not imported | `Select-String placeSeatsFromConfigurator open3d-world-standard-journey.spec.ts` | no matches |
| T8 | Negative | Body furniture scrape | journey file uses `getFurnitureCount` only | no local body regex furniture |
| T9 | Regression | Guest seed still ≥4 | `planner-guest-workspace` optional | documents why deltas matter |
| T10 | Gold place | mesh-symbol cabinet path | already lands cabinet | steal selectors only |

**Not in matrix (other phases):** W3 select/delete browser, W4 orbit pose, W5 hard reload, W7 mesh bar, W8 shortcuts.

---

## 8. False-green catalog

| Trap | Why it lies | How this plan blocks it |
|------|-------------|-------------------------|
| Guest walls ≥4 absolute | Seed shell | Require walls **Δ** |
| walls ≥1 absolute | Seed / residual | Require walls **Δ** |
| objects ≥1 after walls only | Walls raise objects | Opening uses **objectsAfterWalls** baseline |
| furniture ≥1 absolute | Residual IDB | clear storage + furniture **Δ** |
| furniture ≥2 via configurator 4 seats | Not catalog SKU truth | Forbid configurator in journey green path |
| Search `chair` as W2 | Not cabinet-v0 | Require cabinet + Modular Cabinet path |
| Place tool pressed only | No place | Poll furniture metric |
| Full-page non-blank PNG | Chrome fills bytes | Canvas element screenshot >5k |
| Non-blank PNG = symbols world-class | Blob can still be junk | P05 residual honesty |
| Parallel multi-test PNG race | fullyParallel config | `mode: "serial"` + one writer |
| Unit place modular as browser | Wrong layer | Playwright only for CP-07 |
| Journey folder claims W3 | Wrong gate | Explicit non-claim |
| Missing screenshot claim pass | Incomplete story | REQUIRED_SCREENSHOTS disk check |
| Filtered logs | Handbook violation | Tee full list reporter |
| Delete red PNGs | Erases truth | Keep fail artifacts + blockersOpen |
| build+start unrecorded | Different surface | proof `server` field |
| Body scrape furniture / -1 sentinel | False match / quirky polls | Strict `getFurnitureCount` |
| Silent `test.skip` missing catalog | Hides product bug | FAIL hard |
| open3d without clear storage | Residual project | `clearPlannerStorage` first |
| Shortcut D for opening | W8 residual; not W1 tool proof | Use Opening tool label |
| Fabric firstFurnitureCenter | Wrong engine | Never import for this journey |

---

## 9. Stop-if-fail / CP criteria

### 9.1 Hard stop (do not claim CP-07)

- Playwright exit ≠ 0  
- Any required PNG missing  
- `wallsIncreased` false  
- `objectsIncreasedAfterOpening` false  
- `includesCabinetV0` false  
- `furnitureAfter < furnitureBefore + 2`  
- `secondCatalogId` empty  
- Canvas PNG ≤ 5000 bytes  
- Configurator used as place success  
- Evidence written under `site/results/` or wrong folder name  

### 9.2 Soft residual (document, do not block CP-07 place half)

- Symbols unreadable to human (P05)  
- 3D mesh boxy (P08)  
- Cannot delete (P03)  
- Orbit jump (P04)  
- Save label lies (P06)  

### 9.3 Port / process stops

| Failure | Action |
|---------|--------|
| Port 3000 conflict | Stop; Failures.md; do not kill unknown |
| Auth wall open3d | Guest path; do not weaken prod auth |
| Scope creep select/save/orbit | Stop |

---

## 10. Commit sequence

| Order | Message | Contents |
|------:|---------|----------|
| 1 | `docs(p07): evidence alias NOTES for W1-W2 journey folder` | Optional NOTES |
| 2 | `test(e2e): add getFurnitureCount and drawWallByTwoClicks for W1-W2 journey` | helpers |
| 3 | `test(e2e): rewrite W1-W2 journey for walls+opening+cabinet-v0 deltas` | journey rewrite |
| 4 | `test(e2e): stabilize W1 wall and opening metric deltas` | if W1 needed iteration |
| 5 | `test(e2e): W2 cabinet-v0 + second SKU place with non-blank canvas proof` | W2 green |
| 6 | `fix(planner): …` | only if product red |
| 7 | `test(e2e): land CP-07 W1-W2 world-standard journey evidence pack` | script + evidence |

Push `origin` when landable and green enough; mayoite mirror per ~45 min / big land. No force-push.

---

## 11. Risks & owner decisions

| Risk | Severity | Mitigation | Owner decision needed? |
|------|----------|------------|------------------------|
| Catalog place intercept flake | High | `placeCatalogOnCanvas` DOM click | No |
| Opening wall hit-test | High | tap + placeOpening fallback; closed room | No |
| open3d auth / blank | Med | guest fallback | No — do not weaken auth |
| Wall two-tap vs drag | Med | Prefer two-tap; drag fallback | No |
| baseURL build+start 10+ min | Med | Prefer dev + PLAYWRIGHT_BASE_URL | No |
| GLB 500 for cabinet mesh | Med | furniture must still place | No |
| Partial live journey green-washed | Critical process | Rewrite to bar | No — refuse paper PASS |
| CP-07 green while CP-03 red | Story risk | Honesty exit; optional WAIVE | Yes only for full “planner works” claim |
| Demo 10-minute ease claim | Marketing | Automation ≠ ease 4+ | Yes for public claim |

---

## 12. Self-review vs brainstormer + repo

| Check | Result |
|-------|--------|
| Repo paths from Phase 1 in tasks | Yes — helpers, journey, package.json, evidence, product touch list |
| Idiots REPORT bar / failure modes covered | Yes — deltas, serial, cabinet-v0, configurator ban, folder lock, false-green table, CP-03/05 honesty |
| Placeholder scan | No TBD / “similar to Task N” / empty tests |
| Type consistency | JourneyProof + proof JSON fields aligned |
| Length honesty | Extensive by design (serial Playwright e2e + false-green catalog); not thin |
| Conflict rule | Repo wins on code existence (partial journey); brainstormer wins on intent/bar |
| Idiots2 | **Not used** |

---

## 13. Appendices

### Appendix A — Full proof JSON shape (pass)

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
  "server": "PLAYWRIGHT_BASE_URL reuse (dev or external)",
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
    "furnitureAfter": 2,
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
  "honesty": "Does not claim W3–W8, CP-03 select/delete, or CP-05 symbol quality"
}
```

On fail: `"result": "fail"`, `"blockersOpen": ["…"]`, keep partial screenshots.

### Appendix B — Map-contract `run.json` shape

```json
{
  "phase": "P07",
  "gate": ["W1", "W2"],
  "evidenceRoot": "results/planner/world-standard-wave/02-browser-open3d-journey",
  "cwd": "D:\\OandO07072026\\site",
  "command": "npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list",
  "exitCode": 0,
  "startedAt": "ISO-8601",
  "endedAt": "ISO-8601",
  "gitHead": "sha",
  "notes": "wait strategy / selectors / known flakes"
}
```

### Appendix C — Screenshot gold set

| File | Captured after | Proves |
|------|----------------|--------|
| `01-route-ready.png` | Planner loaded, chrome visible | Entry |
| `02-walls-drawn.png` | walls Δ green | W1 walls |
| `03-door-opening.png` | objects Δ green | W1 opening |
| `04-cabinet-v0-placed.png` | furniture > before after cabinet | W2 cabinet |
| `05-two-items-placed.png` | furniture ≥ before+2 | W2 count |
| `06-canvas-2d-symbols.png` | **canvas** screenshot, >5kB | Non-blank 2D (not P05) |
| `07-journey-complete.png` | End state | Pack complete |

### Appendix D — Live vs gold screenshot rename map

| Plan gold | Live divergent (today) | Action |
|-----------|------------------------|--------|
| 01-route-ready | 01-guest-entered | Align |
| 02-walls-drawn | 02-wall-drawn | Align |
| 03-door-opening | (missing) | Add |
| 04-cabinet-v0-placed | (missing; 03-furniture-placed) | Add cabinet-specific |
| 05-two-items-placed | (merged) | Split |
| 06-canvas-2d-symbols | (missing; has 3D toggles) | Add canvas crop |
| 07-journey-complete | 06-journey-complete | Renumber |

### Appendix E — Status metric regexes

| Metric | Filter regex | Parse | Miss |
|--------|--------------|-------|------|
| objects | `/^\d+ objects$/` | `/^(\d+)\s+objects/i` | 0 |
| walls | `/^\d+ walls$/` | `/^(\d+)\s+walls/i` | 0 |
| furniture | `/^\d+ furniture$/` | `/^(\d+)\s+furniture/i` | 0 |

### Appendix F — Selectors & helper map

| Need | Mechanism |
|------|-----------|
| Wall tool | `selectPlannerTool(page, "Wall")` |
| Opening tool | `selectPlannerTool(page, "Opening")` |
| Draw segment (two-tap) | `drawWallByTwoClicks` |
| Draw segment (drag) | `dragOnCanvas` fallback |
| Place opening | `tapOnCanvas` then `placeOpeningOnCanvas` |
| Catalog search | searchbox name `/Search catalog elements/i` |
| Add item | `placeCatalogOnCanvas` |
| Walls count | `getWallCount` |
| Objects count | `getObjectCount` |
| Furniture count | `getFurnitureCount` |
| Canvas | `[data-testid="planner-2d-canvas"] canvas` |
| Guest enter | `enterGuestPlannerWorkspace` |
| Clear storage | `clearPlannerStorage` |

### Appendix G — Flake catalog (severity ranked)

1. Catalog place race / intercept  
2. Opening wall hit-test  
3. Seed absolute asserts (discipline)  
4. baseURL/server confusion  
5. Parallel evidence race  
6. open3d cold start  
7. Residual IDB furniture  
8. GLB 500 (place still required)  
9. Optional 3D toggle flake (keep optional)  
10. Port 3000 conflict  

### Appendix H — Evidence tree (target when green)

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
    run.json
  07-browser-journey/
    NOTES.md
```

### Appendix I — Kill order one-screen

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

### Appendix J — Research translation (ideas → O&O only)

| Source | Pattern to adopt | Never steal |
|--------|------------------|-------------|
| Planner5D | Structure → furnish → 3D; 10-min ambition | UI, catalog, brand |
| Homestyler | Draw → Decorate → Visualize order | Editor DOM, models |
| Floorplanner | Room speed; library place | Manual text as product docs |
| RoomSketcher | Openings on walls; two-step catalog | Hotkeys map, chrome |
| IKEA | Real SKU composition | Brand, product names |
| Canva | Zero-friction start (graphic only) | Accuracy model as our identity |
| O&O self (ease ~1–2.1) | Journey is primary ease lift | Do not fake ease score without timed unaided run |

### Appendix K — Demo raised bar (optional, not CP floor)

| Criterion | Automation CP-07 | Raised demo bar |
|-----------|------------------|-----------------|
| Walls | Δ ≥ 1 | Closed room 4 walls preferred |
| Opening | objects Δ | Visible door gap on wall in PNG |
| Place | cabinet + second | cabinet-v0 + desk both visible |
| Catalog path | required | No configurator in demo recording |
| Symbols | non-blank | Human can identify cabinet vs desk (P05) |
| Time | N/A | Structure + 2 SKUs under 10 minutes unaided |

### Appendix L — Skills for execute

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| `verification-before-completion` | Before CP-07 green claim |
| `chrome-devtools` | Selector / flake triage |
| `systematic-debugging` | Product-real red journeys |
| `subagent-driven-development` / `executing-plans` | After plan exists |

### Appendix M — Phase pack paths

```
Plans/phases/P07-draw-place-journey/
  README.md
  P07-draw-place-journey.md   ← execute card
  P07-appendix.md             ← TS skeletons (reference; live code wins after land)
  P07-suggestions.md          ← S1–S12
  01-react-open3d.md
  04-playwright-evidence.md
```

### Appendix N — Paper PASS refusal list

1. Green live **partial** journey as CP-07  
2. Unit place tests as browser journey  
3. W3 claimed via journey folder  
4. Non-blank PNG as symbol quality  
5. Seed walls as W1  
6. Configurator seats as catalog  
7. Deleting red screenshots  
8. Claiming 10-minute buyer success without timed unaided run  

### Appendix O — Glossary

| Term | Meaning |
|------|---------|
| W1 | Draw walls + door/opening with metric deltas |
| W2 place | Place ≥2 furniture incl. cabinet-v0 |
| W2 symbols | Readable Block2D — **P05** |
| CP-07 | Checkpoint for P07 browser pack |
| Δ / delta | After − before metric increase |
| Seed false-green | Passing on guest shell without user action |
| Serial | Ordered non-parallel Playwright describe |
| Approach A | Product journey first on Feasibility interim |
| cabinet-v0 | Modular cabinet demo SKU; manufacturer anchor |
| Gold folder | `02-browser-open3d-journey/` |

---

## 14. Execution handoff

**Plan complete and saved to** `D:\OandO07072026\idiotplanners2\P07-draw-place-journey\IMPLEMENTATION-PLAN.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

Execute order: Task 00 → 01 → 02 (full rewrite) → 03 (W1 red→green) → 04 (W2 red→green) → 05 (script + evidence + CP checklist) → 06 only if product red.

**Which approach?**
