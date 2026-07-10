# P07 Draw/Place Journey — CODE-REVIEW-LIVE

| Field | Value |
|-------|--------|
| **Date** | 2026-07-10 |
| **Reviewer** | Code-review agent #2 (live tree, no product edits) |
| **Prior plan review** | `plans1/P07-draw-place-journey/CODE-REVIEW-REPORT.md` (CONDITIONAL APPROVE on plan) |
| **Live subject** | `site/tests/e2e/open3d-world-standard-journey.spec.ts` + `plannerCanvasHelpers.ts` + place/catalog identity |
| **Authority** | CP-07 / W1–W2: phase `Plans/phases/P07-draw-place-journey/`, plan `plans1/P07-draw-place-journey/IMPLEMENTATION-PLAN.md` |
| **Verdict** | **FAIL** — live journey is **not** CP-07; rewrite required before any green claim |

---

## Verdict

**FAIL until full rewrite.**

Prior plan review correctly marked the *plan* as conditional-approve. This live review re-reads the **shipped journey** and confirms it still fails the binding bar:

| CP-07 requirement | Live journey (2026-07-10) | Status |
|-------------------|---------------------------|--------|
| Serial + 120s | Yes | OK keep |
| open3d primary → guest fallback + `routeUsed` | **Guest only** via `enterGuestPlannerWorkspace` → `/planner/guest/?plannerDevTools=1` | **FAIL** |
| `getFurnitureCount` in helpers | **Missing**; local `furnitureCount` / `wallCount` with **body fallback** | **FAIL** |
| W1 wall **Δ** | Yes (two-click + retry) | Partial OK |
| W1 Opening + **objects Δ** | **Absent** | **FAIL** |
| W2 cabinet-v0 via exact place CTA | **No** — searches `"chair"`, generic `/Add .* to canvas/i` | **FAIL** |
| W2 second SKU id recorded | **No** | **FAIL** |
| Configurator not sole W2 green | **Explicit fallback** `placeSeatsFromConfigurator(4)` if catalog fails | **FAIL** |
| Non-blank canvas PNG `byteLength > 5000` | **No** | **FAIL** |
| Screenshots 01–07 CP storyboard | 01–06 different names (guest/wall/furniture/3d/2d/complete) | **FAIL** |
| `playwright-run.json` after asserts | **No** | **FAIL** |
| Evidence artifacts on disk | Folder exists; **no PNGs / json / raw log** | **FAIL** |
| npm `test:e2e:world-standard-w1w2` | **Absent** (only `test:e2e:open3d-world`) | **FAIL** |

A green run of the *current* file would prove **guest chrome + wall Δ + ≥2 furniture (chair and/or configurator seats) + 2D↔3D toggle** — not W1–W2 world-standard. **Do not launder this as CP-07.**

---

## What the journey currently proves

### Entry / surface

- **Route:** guest only (`enterGuestPlannerWorkspace` → `/planner/guest/?plannerDevTools=1` + storage clear).
- **Chrome asserts:** `.pw-topbar`, 2D radio, Drawing tools group, **no** `.pw-step-bar` (honest native open3d chrome).
- **Not proven:** `/planner/open3d` primary entry, `routeUsed` in proof JSON.

### W1 (structure)

- **Proves:** wall count **increases** after Wall tool two-tap draw (with one retry segment).
- **Does not prove:** Opening tool, door/opening placement, objects metric Δ post-wall, coupling of open hit to the wall that grew.
- Local `wallCount` falls back to `body.innerText` if status span miss — weaker than helper `getWallCount` (status-span only, returns 0).

### W2 (place)

- **Proves:** furniture metric ≥ `furnitureBefore + 2` by **any** path:
  1. Prefer catalog after search `"chair"` + two generic `placeCatalogOnCanvas` calls, **or**
  2. **Fallback:** `placeSeatsFromConfigurator(page, 4)` — systems batch, no catalog SKU identity.
- **Does not prove:**
  - `cabinet-v0` / Modular Cabinet place CTA
  - second catalog SKU id (e.g. `sample-desk-1`)
  - place path exclusivity (configurator can be sole green)
- Local `furnitureCount` uses `.pw-status-bar, [class*='status']` then **full body** regex `/(\d+)\s+furniture/i` — false-green-capable if copy elsewhere matches.

### Count / helpers

| Metric | Journey | Shared helper |
|--------|---------|---------------|
| walls | local `wallCount` (body fallback, `-1` miss unused after asserts) | `getWallCount` exists — **unused** |
| objects | **not used** | `getObjectCount` exists — **unused** |
| furniture | local `furnitureCount` (body fallback) | **`getFurnitureCount` does not exist** |

### Screenshots / evidence

- Writes under `process.cwd()/../results/planner/world-standard-wave/02-browser-open3d-journey/` (cwd-sensitive; plan prefers `__dirname` → repo root).
- Names: `01-guest-entered` … `06-journey-complete` — **not** phase 01–07 storyboard.
- **No** `playwright-run.json`, no canvas PNG size gate, no raw log contract in-spec.
- Evidence dir present on disk as empty scaffold — **not** a PASS.

### Configurator / catalog identity (product truth used elsewhere)

| Asset | Live fact | Journey use |
|-------|-----------|-------------|
| `cabinet-v0` | `demoCatalogItems.ts`; `shortName: "Modular Cabinet"`; `geometryMode: "modular-cabinet-v0"`; `MODULAR_CABINET_V0_CATALOG_ID = "cabinet-v0"` | **Not used** |
| Gold place | `open3d-mesh-symbol-live-verify.spec.ts`: search `"cabinet"` + `/Add Modular Cabinet to canvas/i` + `placeCatalogOnCanvas` | **Not stolen into journey** |
| `sample-desk-1` | `shortName: "Executive Standing Desk"` | **Not used** |
| Chair | `sample-chair-1` / search `"chair"` | **Current W2 path** |
| Configurator | `placeSeatsFromConfigurator` | **Allowed sole green** |

---

## Residual rewrite requirements

These are **hard** for next land — match plan + prior B1/B2/H1, tightened for live code:

### R1 — Cabinet-v0 place CTA (identity)

- Search catalog for cabinet (e.g. `"cabinet"` / `"Modular Cabinet"`).
- Arm + place with **exact** CTA: `/Add Modular Cabinet to canvas/i` (same as mesh-symbol gold).
- Proof identity from **the button used to place** (name/id), not:
  - body regex `/Modular Cabinet/` (always true once inventory lists the item),
  - forced `includesCabinetV0 = true`,
  - generic `/Add .* to canvas/i` after multi-result search.
- Assert furniture **Δ ≥ 1** after that place before second SKU.

### R2 — Opening (W1 complete)

- After walls Δ: select tool label **Opening** (not shortcut D).
- Place on a wall midpoint **bound to the segment that actually increased walls** (or re-draw a known span then open mid-span).
- Prefer `tapOnCanvas` (product commits opening on pointerdown wall pick); `placeOpeningOnCanvas` micro-drag only as fallback.
- Assert `objectsAfterOpening > objectsAfterWalls` via **`getObjectCount`** (doors count in objects formula).

### R3 — Second SKU recorded

- Prefer `sample-desk-1` via CTA `/Add Executive Standing Desk to canvas/i` (or visible name derived from the **same** button used in `placeCatalogOnCanvas`).
- Record `secondCatalogId` from observed control / aria-label / data attr — **never** hardcode after search `"desk"` if any Add is visible.
- Furniture final ≥ `furnitureBefore + 2`.

### R4 — No configurator sole green

- **Hard-delete** `placeSeatsFromConfigurator` success path from this spec (keep helper for W4/systems specs only).
- If catalog place fails → journey **red**, not silent batch green.
- Optional: assert proof field `placePath: "catalog"` only.

### R5 — Evidence + helpers + entry bar

- Land `getFurnitureCount` in `plannerCanvasHelpers.ts` (mirror `getWallCount` / `getObjectCount` on `.pw-status-bar > span`; return `0` on miss — **no body fallback**).
- Journey uses helpers only; delete local parsers.
- Entry: clear storage → `/planner/open3d` primary → guest fallback; record `routeUsed`.
- Screenshots **01–07** per phase storyboard; canvas PNG `byteLength > 5000`.
- Write `playwright-run.json` **after** asserts (`result: "pass"`, `failed: 0`, gates W1/W2).
- npm `test:e2e:world-standard-w1w2` (or documented alias); evidence under repo-root `results/planner/world-standard-wave/02-browser-open3d-journey/`.

---

## Ordered implement list (next TDD / e2e agent)

Execute **in order**. Do not claim CP-07 until step 8 green with artifacts on disk.

1. **Helper land (red consumer optional)**  
   - Add `getFurnitureCount(page)` to `plannerCanvasHelpers.ts` (status-bar span `/^\d+ furniture$/`, parse int, else `0`).  
   - Optional: promote `drawWallByTwoClicks` from journey into helpers (dedupe).  
   - Commit: `test(e2e): add getFurnitureCount for CP-07 metrics`.

2. **Rewrite journey scaffold (expect red)**  
   - Replace body of `open3d-world-standard-journey.spec.ts` in place (do not “extend” configurator path).  
   - Serial + 120s keep; evidence path via repo root (not cwd-fragile `process.cwd()/..` alone if avoidable).  
   - Entry helper or inline: open3d → guest; clear storage; `routeUsed`.  
   - Import `getWallCount`, `getObjectCount`, `getFurnitureCount`, `placeCatalogOnCanvas`, `selectPlannerTool`, `tapOnCanvas`, `placeOpeningOnCanvas` (fallback only).  
   - **Delete** imports/use of `placeSeatsFromConfigurator` in this file.

3. **W1 wall Δ**  
   - Capture `wallsBefore` / `objectsBefore`.  
   - Wall two-tap (known coords) + retry; assert `wallsAfter > wallsBefore`.  
   - Screenshot wall step (storyboard name).

4. **W1 Opening + objects Δ**  
   - Bind open coords to successful wall geometry.  
   - Opening tool → tap mid-span → poll `getObjectCount` increase.  
   - Screenshot door/opening.  
   - Record `doorOrOpeningPlaced` only **after** assert.

5. **W2 cabinet-v0**  
   - Search + exact Modular Cabinet CTA + `placeCatalogOnCanvas`.  
   - Poll furniture +1; record `includesCabinetV0` from place CTA success **and** Δ (not body-only).  
   - Screenshot.

6. **W2 second SKU**  
   - Search desk (or clear + desk); exact CTA for Executive Standing Desk (or observed button name).  
   - Place; record `secondCatalogId` from that control; furniture ≥ +2 total.  
   - Screenshot.

7. **Canvas PNG + optional soft 2D/3D**  
   - Capture 2D canvas element screenshot; assert `byteLength > 5000`.  
   - 2D↔3D toggle optional soft post-assert; **do not** claim W4.

8. **Proof + script + re-prove**  
   - After all expects: write `playwright-run.json` (pass only on green path).  
   - 01–07 PNGs existSync loop.  
   - Add `test:e2e:world-standard-w1w2` in site package scripts.  
   - Run against live server; land raw log under evidence folder.  
   - Alias NOTES under `07-browser-journey/` pointer only if phase requires.

9. **Product fix only if systematic red**  
   - Labels, metrics, place no-op, blank canvas, opening hit tolerance — not Fabric cutover, not configurator theater.

### Anti-patterns for implementer (from plan B1/B2 + live)

- Do **not** copy plan snippets that set `includesCabinetV0 = true` after body/hasExact alone.  
- Do **not** set `secondId = "sample-desk-1"` because search `"desk"` showed some Add button.  
- Do **not** leave configurator as catch-all after chair failure.  
- Do **not** pass W1 on absolute seed walls ≥4 without Δ.

---

## False-green traps

| Trap | Live today? | Risk if rewrite is sloppy |
|------|-------------|---------------------------|
| **Body text as furniture/wall count** | **Yes** — local parsers fall back to `page.locator("body").innerText()` | Inventory/marketing copy with “N furniture” / walls can lie; always use status-bar helpers only |
| **Body “Modular Cabinet” = placed cabinet-v0** | Not yet in journey; **gold mesh verify uses body cues** as soft identity | Inventory always lists Modular Cabinet after catalog load → true without place |
| **Force `includesCabinetV0 = true`** | Not in live journey; **open in plan snippets (B1)** | Removes identity proof entirely |
| **Assumed second SKU id** | N/A live (no second id); **open in plan (B2)** | Recorded id can disagree with placed item if rank wrong |
| **Generic `/Add .* to canvas/i`** | **Yes** after `"chair"` search | Places wrong SKU; no cabinet-v0 claim |
| **Configurator sole green** | **Yes** — explicit fallback | ≥2 furniture without any catalog identity |
| **Chair as W2 stand-in** | **Yes** | Passes count, fails manufacturer SKU / modular path bar |
| **Seed walls absolute** | Live uses Δ (good) | Do not regress to `walls ≥ 4` alone |
| **Objects ≥1 without post-wall baseline** | Opening absent | Must baseline objects after walls before Opening |
| **Toast / copy as door proof** | N/A | Use objects Δ only |
| **Missing evidence folder → historical PASS** | Folder empty scaffold | No PASS without PNGs + json + exit 0 |
| **PASS JSON without exit 0** | No writer yet | Writer must run only after asserts |
| **cwd-relative evidence** | **Yes** `process.cwd()/../results/...` | Wrong cwd → screenshots elsewhere; gate thinks missing |
| **open3d “ready” before catalog hydrate** | Guest waits on search later | Entry `routeUsed: open3d` can be optimistic if only topbar race |
| **Opening coords not on grown wall** | N/A (no Opening) | Flaky red or accidental hit elsewhere |
| **Parallel PNG race** | Serial describe (good) | Keep serial |

---

## Structural / quality notes (code-review skill bar)

- **Wrong bar is the structural bug**, not missing nits: one journey file that can green on guest+chair+configurator teaches the wrong contract.
- **Code judo:** delete dual local parsers + configurator branch; one helpers import surface; one catalog place path with exact CTAs; one proof writer. Do not grow a second “identity” abstraction layer — exact `Add ${shortName}` + furniture Δ is enough.
- **Helpers:** `placeCatalogOnCanvas` / `clickCatalogAddToCanvas` (DOM `el.click()` + Place `aria-pressed`) are the canonical place path — reuse; do not invent raw hit-test Add.
- **Do not** push product logic into the journey to paper over metrics; fix product only when status/place/opening systematically fail.
- File size: rewrite keeps one serial test — fine under 1k; avoid pasting plan’s double full-file scaffolds into the repo.

---

## Alignment with prior CODE-REVIEW-REPORT

| Prior finding | Live re-check |
|---------------|---------------|
| B1 cabinet identity | Still open for execute; live journey never attempts cabinet-v0 |
| B2 secondCatalogId assumed | Still open for execute; live has no second id |
| H1 Opening ↔ wall coupling | Still required; Opening absent |
| H3 extend vs rewrite | Live still partial pride path — **rewrite mandatory** |
| Evidence missing | Dir now exists empty; still no artifacts |
| CONDITIONAL APPROVE plan | Stand; **live code remains FAIL** |

---

## Top 5 residual tasks

1. **Rewrite journey to CP-07 bar** — open3d→guest entry, W1 wall Δ + Opening objects Δ, W2 exact cabinet-v0 CTA + second SKU, kill configurator/chair success path.  
2. **Land `getFurnitureCount`** (and use `getWallCount` / `getObjectCount`); remove body-fallback local parsers.  
3. **Honest identity proof** — place via exact Modular Cabinet / desk CTAs; record second id from the control used; no body force-true.  
4. **Evidence contract** — 01–07 PNGs, canvas >5k bytes, `playwright-run.json` after asserts, npm `test:e2e:world-standard-w1w2`, re-prove on disk.  
5. **Opening target coupling** — open only on wall geometry that produced walls Δ (or dedicated re-drawn span); tap-first, micro-drag fallback.

---

## Bottom line

**Live journey ≠ CP-07.** It is a partial guest smoke: wall growth + ≥2 furniture via chair catalog **or** configurator batch + view toggle. That can look green and still miss Opening, cabinet-v0, second SKU identity, helpers, proof JSON, and the storyboard.

**Verdict: FAIL** — next agent rewrites and re-proves; prior plan review’s B1/B2/H1 remain binding before any PASS claim.

---

## Review method (honesty)

- Read: `plans1/P07-draw-place-journey/CODE-REVIEW-REPORT.md`, full live `open3d-world-standard-journey.spec.ts`, full `plannerCanvasHelpers.ts`, guest setup, demo catalog, InventoryPanel CTA pattern, mesh-symbol gold place, package scripts, phase P07 card/suggestions, WorkspaceShell status spans.  
- No product code edits.  
- Evidence folder listed empty of run artifacts at review time.
)
