# P07 suggestions — plan review (path-verified)

**Date:** 2026-07-09  
**Plan:** `Plans/trustdata/phases/P07-draw-place-journey/P07-draw-place-journey.md`  
**Reviewer role:** planning expert (path verify → suggest → revise in place)  
**Checkout:** `.` · no product code in this review  

## Verification summary (repo truth)

| Claim in P07 | Live path / fact | Verdict |
|--------------|------------------|---------|
| Playwright config | `site/config/build/playwright.config.ts` | **OK** — `testDir: ../../tests` → `site/tests`; match `tests/e2e/**/*.spec.ts` |
| Helpers | `site/tests/e2e/guestProjectSetup.ts`, `plannerCanvasHelpers.ts` | **OK** — exports: `enterGuestPlannerWorkspace`, `clearPlannerStorage`, `selectPlannerTool`, `dragOnCanvas`, `placeOpeningOnCanvas`, `tapOnCanvas`, `clickOnCanvas`, `getWallCount`, `getObjectCount`, `waitForPlannerCanvas` |
| `getFurnitureCount` | **missing** from helpers | **GAP** — W2 inlines status-bar parse; guest specs do same |
| Gold pattern | `admin-svg-publish-p01.spec.ts` + `results/planner/p0-1-admin-svg-publish/` | **OK** |
| Guest entry | helper `goto("/planner/guest/?plannerDevTools=1")` | **OK** — plan says `/planner/guest/` only; must cite `plannerDevTools=1` |
| open3d entry | `site/app/planner/open3d/page.tsx` → `Open3dPlannerHost` → `site/features/planner/open3d/ui/Open3dNativeHost.tsx` | **OK path; fix plan wording** — plan cited vague `Open3dNativeHost` under host folder |
| Tool labels | `CANVAS_TOOL_LABELS`: Wall / Opening / Place; aria `Wall (W)` etc. | **OK** — `plannerToolNamePattern` matches |
| Opening runtime | `runtimeToolFor("opening") === "door"` | **OK** |
| Inventory search | `InventoryPanel`: role searchbox label **Search catalog elements**; placeholder **Search furniture (Fuse + RAC)** | **OK** — dual selector correct; gold guest uses same |
| Add button | `aria-label={`Add ${item.shortName} to canvas`}` | **OK** |
| cabinet-v0 | `demoCatalogItems.ts` id/slug `cabinet-v0`, `geometryMode: "modular-cabinet-v0"` | **OK** |
| Second item | demo has `sample-desk-1` (search `desk`) | **OK** — lock id in plan |
| Status metrics | `.pw-status-bar`: `N objects` / `N walls` / `N furniture`; doors count in **objects** via `summarizeFloorMetrics` | **OK** — door proof = objects Δ preferred |
| webServer | config: if no `PLAYWRIGHT_BASE_URL` → `pnpm run build && pnpm run start` | **RISK** — npm script must set base URL or document required env |
| Default timeout | config 60s; plan 120s describe | **OK** if describe.configure kept |
| `run-evidence-cmd.ps1` | `scripts/run-evidence-cmd.ps1` nests under `…/phase/name/` | **OK** — plan already notes flat proof copy |
| `test:clean` / `test:browsers:install` | `site/package.json` | **OK** |
| Guest shell seed | Start from Scratch → ≥4 walls, 0 furniture (guest-workspace e2e) | **FALSE-GREEN RISK** — W1 must assert walls **increase**, not only ≥1 |
| CHECKPOINTS vs P07 | CP-07 full claim waits CP-03+CP-05 not red unless waive | **ALIGN** — place/draw vs full W2 symbol honesty |

## Suggestions (priority order)

### S1 — Serial journey + single evidence writer (HIGH)
`playwright.config.ts` has `fullyParallel: true`. Multiple tests writing `01-…07` PNGs into one dir race.  
**Apply:** `test.describe.configure({ mode: "serial", timeout: 120_000 })` and prefer **one** serial journey test (or ordered serial describe) for W1→W2.

### S2 — Baseline deltas (HIGH — false green)
Guest path clicks **Start from Scratch** and may already have ≥4 walls.  
**Apply:** capture `wallsBefore` / `furnitureBefore` / `objectsBefore`; assert **increase** after draw/place/opening. Prefer open3d blank when possible; if guest, still use deltas.

### S3 — `PLAYWRIGHT_BASE_URL` honesty in npm script (HIGH)
Without env, Playwright spins **build+start** (slow, different from `pnpm run dev`).  
**Apply:** document required env; script example sets `PLAYWRIGHT_BASE_URL=http://localhost:3000` when reusing dev, or accept webServer build path explicitly in proof JSON `server` field.

### S4 — Entry helper harden (MED-HIGH)
open3d path does not clear planner storage → residual project flakiness.  
**Apply:** call `clearPlannerStorage(page)` before open3d goto; guest already clears via `enterGuestPlannerWorkspace`. Cite guest URL with `?plannerDevTools=1` (owned by helper).

### S5 — `getFurnitureCount` helper (MED)
Mirror `getWallCount` / `getObjectCount` in `plannerCanvasHelpers.ts` (test-only file; allowed). Use in W2 polls. Optional same-PR as journey spec.

### S6 — W1 door/opening assertion tighten (MED)
Doors increment `planMetrics.objects` (`summarizeFloorMetrics`).  
**Apply:** after opening place, poll `getObjectCount(page) > objectsAfterWalls` (or ≥ walls baseline + 1 structure delta). Do not accept vague “UI message.”

### S7 — Lock second catalog SKU (MED)
**Apply:** second item = demo `sample-desk-1` via search `desk` (or `sample-sofa-1` / `sofa` fallback). Record chosen id in proof JSON.

### S8 — Product path table accuracy (LOW-MED)
**Apply:** fix `Open3dNativeHost` to `site/features/planner/open3d/ui/Open3dNativeHost.tsx`. Keep product touch table; no expansion unless journey red.

### S9 — Checkpoint honesty for full W2 (MED)
P07 can green **browser place + non-blank canvas PNG**. Full **W2 symbol quality** still owned by P05/CP-05.  
**Apply:** explicit note: CP-07 place half ≠ photoreal symbols; do not claim P05. Align with CHECKPOINTS “full W1–W2” wording: journey passes place gates; symbol bar residual if P05 red.

### S10 — Search selector gold (LOW)
Prefer guest gold first:  
`page.getByRole("searchbox", { name: /Search catalog elements/i })`  
Keep placeholder OR as fallback only.

### S11 — Imports in skeleton (LOW)
Skeleton must import/use `getObjectCount` (and optional `getFurnitureCount`) from helpers; avoid dynamic import only for guest setup if static import works.

### S12 — Out of scope hold (LOW)
No product code until owner unlock. Product touch only from existing tables. chrome-devtools for triage OK. Evidence root remains `02-browser-open3d-journey/`.

## Disposition

| ID | Action |
|----|--------|
| S1–S9 | **Apply into P07 plan** (2026-07-09 expert revision) |
| S10–S12 | Apply lightly / already mostly true |

**Product code:** none in this review.  
**Next:** revise `phases/P07-draw-place-journey/P07-draw-place-journey.md` in place; Expert revision note 2026-07-09.
