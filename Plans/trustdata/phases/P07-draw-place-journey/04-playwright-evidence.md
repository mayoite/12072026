# Expert pass — Playwright / evidence / QA (04)

**Date:** 2026-07-09 · **Role:** Playwright + evidence QA · **Mode:** plan-only · **No product code**  
**Read:** P03 (+ appendix) · P07 (+ appendix) · RESULTS-MAP · CHECKPOINTS · live `site/config/build/playwright.config.ts` · `tests/e2e/*` helpers  
**Authority:** Owner > trustdata plans > live repo facts

---

## Verdict: **FIX**

Plans (P03/P07 + maps) correctly hard-gate **W3 browser**, **serial W1–W2 journey**, **seed deltas**, and **folder lock**. Not **SHIP**: evidence pipeline is still **pre-exec** (no journey spec, no `getFurnitureCount`, no `test:e2e:world-standard-w1w2`, no `02-*` / `03-*` gate folders). Not **BLOCK**: governance + skeletons are enough to execute after owner unlock — residual risks are execute discipline, not plan rewrite.

| Live fact | Status |
|-----------|--------|
| Config `fullyParallel: true`, workers 2, default timeout 60s; unset `PLAYWRIGHT_BASE_URL` → `build && start` | Hazard if journey not `mode: "serial"` / 120s |
| Helpers: walls/objects/drag/placeOpening/selectTool OK | `getFurnitureCount` **missing** |
| Guest seed: Start from Scratch → ≥4 walls, 0 furniture (`planner-guest-workspace`) | **False-green if absolute walls ≥1** |
| Spec `open3d-world-standard-journey.spec.ts` | **Absent** |
| Evidence `…/02-browser-open3d-journey/`, `…/03-select-delete/` | **Missing** (only WAVE + COMPARISON at wave root) |
| Gold shape | `admin-svg-publish-p01.spec.ts` → flat dir + PNGs + JSON |
| W3 unit pack | pick/delete/preventDefault suites still **thin/missing** |

---

## Must-fix P0

1. **W3 browser hard gate (no self-waive)** — CP-03 green only when `results/planner/world-standard-wave/03-select-delete/` has: canonical `run.json` + unfiltered vitest raw + **browser** select→Delete/Backspace→undo (PNGs **or** trace) + `browser-w3-raw.log`. Unit-green alone = **FAIL**. Journey folder must **not** substitute for W3.
2. **Serial journey pack** — Single ordered path (prefer one test or serial describe): `test.describe.configure({ mode: "serial", timeout: 120_000 })`. Config is fully parallel; multi-test writers racing `01`–`07` PNGs = invalid evidence.
3. **Anti seed false-green (W1)** — Capture `wallsBefore` / `objectsBefore`; assert **increase** after draw / opening. Never pass on seed walls ≥1/≥4 alone. Prefer `/planner/open3d` blank; guest still uses deltas.
4. **Anti place false-green (W2)** — `furnitureBefore` then ≥ `+2` incl. **cabinet-v0**; second SKU recorded (`sample-desk-1` / sofa fallback). Non-blank canvas PNG (byteLength > 5k) ≠ P05 symbol quality.
5. **Canonical folders only** — W1–W2 → `02-browser-open3d-journey/` (+ optional `07-browser-journey/` NOTES pointer). W3 browser → `03-select-delete/`. Never `02-engine-lock/`, never dump W gates under `results/tests/` or `site/results/`.
6. **No silent skip** — Missing screenshot / skipped step / filtered log = FAIL (testing-handbook). Fail → keep red artifacts; `result: "fail"` + `blockersOpen`.

---

## Should-fix P1

1. Land `getFurnitureCount` in `plannerCanvasHelpers.ts` (mirror `getWallCount`); use in W2 polls.
2. npm `test:e2e:world-standard-w1w2` + record **server path** in proof (`PLAYWRIGHT_BASE_URL` dev vs webServer build+start).
3. Entry: `clearPlannerStorage` before open3d; guest keeps `?plannerDevTools=1` via helper.
4. W3 browser: Feasibility path, Fabric flag **OFF**; do **not** treat `firstFurnitureCenter` / `__plannerFabricView` as W3 proof (Fabric-stage helper, wrong engine).
5. W3 narrow scope only (select→delete→undo); do not expand into full draw/place in Task 08.
6. Prefer both `playwright-run.json` **and** map-contract `run.json` (or NOTES naming the contract file).
7. Opening proof via **objects Δ**, not toast copy; tool label **Opening** (not shortcut D — W8 debt).

---

## False-reverse risks (false-green)

| Risk | Why it lies | Hard assert |
|------|-------------|-------------|
| Guest shell walls | Seed ≥4 walls | walls **Δ** after draw |
| Absolute furniture ≥1 | Residual project / prior place | clear storage + furniture **Δ** |
| Objects ≥1 for door | Walls already raise objects | objects **after opening** > objects after walls |
| Unit-only W3 | Handler exists / vitest green | browser artifacts under `03-select-delete/` |
| Journey claims W3 | Draw/place ≠ select/delete/undo | separate CP-03 browser |
| Non-blank PNG = full W2 | Blob ≠ readable symbols | place half ≠ P05 |
| Fabric select e2e as W3 | `firstFurnitureCenter` needs Fabric hook | Feasibility + status metrics / screenshots |
| Parallel workers | PNG/json race | serial mode + single writer |
| build+start unrecorded | Different surface than dev | proof `baseURL` + `server` fields |
| CP-07 green while CP-03 red | CHECKPOINTS forbid full story claim | partial scope needs **owner WAIVE** |

---

## Folder lock compliance

| Gate | Canonical under `world-standard-wave/` | Alias only |
|------|----------------------------------------|------------|
| W1 + W2 place | **`02-browser-open3d-journey/`** | `07-browser-journey/` pointer |
| W3 | **`03-select-delete/`** | — (not journey root) |
| W2 symbols | `05-symbols-svg/` | journey PNGs secondary |
| Engine | `01-engine-lock/` | never `02-engine-lock/` |
| Mesh / chrome | `08-mesh-quality/` · `09-shortcuts-chrome/` | not dual-`08` |

**Minimum green artifacts:**  
- `02-…`: `playwright-run.json`/`run.json` + raw log + PNGs `01`–`07`, failed=0, gates W1/W2, deltas in proof.  
- `03-…`: `run.json` + vitest raw + browser log + select/deleted/undone PNGs or trace.

---

## Execute order (evidence spine)

1. CP-03 unit → **browser under `03-select-delete/`** (hard).  
2. CP-07 serial journey → `02-browser-open3d-journey/` (deltas; cabinet-v0 + second SKU).  
3. Do not celebrate “planner works” until CP-03 + journey (+ CP-05 for full W2) not red.

**Handover one-liner:** FIX — plans right; enforce serial + seed deltas + W3 browser-in-`03-*` or agents will ship false-green.
