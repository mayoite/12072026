# Planner Track - Handover

**Last updated:** 2026-07-01
**Branch:** `main` (uncommitted working-tree changes)
**Plan root:** `plans/planner/` - start at [00-start.md](00-start.md)

## Current state

Release-gate run #7 (`site/results/phase10-release-gate-7.log`) remains the last full gate failure snapshot, but the planner lane has now been re-verified locally.

| Gate step | Status |
|-----------|--------|
| test:audit:hollow / gate-skips / eslint-disable | pass |
| lint | pass (after Lenis mock `no-this-alias` fix) |
| typecheck | pass |
| test (Vitest) | pass (after 6 global-mock fixes) |
| build | pass |
| test:a11y | pass |
| test:e2e:nav | pass |
| **test:planner-catalog** | **pass locally (2026-07-01, 40/40)** |
| test:coverage | not reached |
| test:coverage:site | not reached |

## Latest local runs (this session)

- `pnpm --filter oando-site run typecheck` - pass.
- `pnpm run lint` - pass for all planner/area-03 files; one **pre-existing unrelated** error in `site/tests/setup.ts:3` (unused `React` import) blocks the global lint gate (`--max-warnings=0`). Logged in `Failures.md` (Site UI). Needs owner OK to delete one line.
- Playwright (focused): `planner-guest-workspace.spec.ts` **5/5 pass**.
- Playwright (focused): `planner-chrome.spec.ts` **8/8 pass** via `pnpm --filter oando-site exec playwright test -c config/build/playwright.config.ts tests/e2e/planner-chrome.spec.ts`.
- Playwright (focused): `planner-custom-tools.spec.ts` **17/17 pass** (2026-06-30, after area-03 fixes).
- Playwright (gate slice): `pnpm --filter oando-site test:planner-catalog` **40/40 pass**.

## The 16 failures (classified)

**Cat A - removed dock UI (8):** `planner-chrome.spec.ts` 1-7, 10 - floating dock chrome gone (`PlannerChromeHost` returns null); moved to TopBar/SubTopBar.
**Cat B - canvas/wiring (8):**
- #14 `#planner-tool-visibility-mode` not rendered - `PlannerStatusBar` missing `onToolVisibilityModeChange` (FIXED, staged).
- #16 guest "empty canvas" has 6 objects - `buildShellOnlyLayout` seeds walls on "Start from Scratch" (intended).
- #11/#12 Door/Window - opening not placing (keyboard shortcut/focus + 1% drag).
- #13 Select / #15 Erase - click/drag miss (zoom + shell offset suspects).

## What's already done

- **A1 tool-visibility wiring:** `PlannerWorkspace.tsx` staged (+14/-2) - passes `toolVisibilityMode` + `onToolVisibilityModeChange` to StatusBar.
- **A2 SubTopBar cleanup:** removed dead props + passthroughs; kept `_toggleLeftCollapsed` + `_handleResetChromeLayout` (unused allowed).
- **B1 planner-chrome.spec.ts rewrite:** removed dock chrome assertions; now checks step panels, view switching, inspector outside Review, WebGL fallback.
- **B2 planner-guest-workspace.spec.ts:** empty-canvas test rewritten for shell-on-scratch (walls + objects, 0 furniture).
- **B3 planner-custom-tools.spec.ts:** all 5 fixed and **verified 17/17 green**.
- **Door/Window source fix:** added `door`/`window` to `FabricDrawTool`; mapped in `plannerToolFabricBridge`; `fabricDrawTools.ts` inserts a default opening from `FURNISHINGS` at the scene pointer on `mouse:down`; added `DRAW_TOOL_HELP` entries.
- **Select / Erase scene-aware tests:** exposed `window.__plannerFabricView` (client-side canvas handle, no secrets) in `floorplanCanvas.ts`; added `firstFurnitureCenter` + `clickAtPoint`/`tapAtPoint` to `plannerCanvasHelpers.ts` (reads furniture live screen center via `viewportTransform`). `resetZoom` helper now unused (+/-10 buttons can't reach non-multiple-of-10 zoom from `fitToContent`).
- **Lint + typecheck:** green after area-03 edits (minus the pre-existing `tests/setup.ts` lint error noted above).

## Next actions (in order)

1. Decide on pre-existing `site/tests/setup.ts:3` unused `React` lint error (owner OK -> delete one line) so `pnpm run lint` is globally green.
2. `05` - full `pnpm run release:gate` to green; mark phases 07-10; update `Failures.md`; write `phase10-release-gate.json`.
3. ~~`04` reviews~~ **DONE** - code-review + security-review complete (see `archive/04-reviews.md`); `__plannerFabricView` now webdriver-gated.
4. ~~`06` delete `site/nul`~~ **DONE** - `site/nul` is no longer present.

## Archive state

- Completed area files ready to archive: `01-source-wiring.md`, `02-e2e-specs.md`, `03-canvas-live-trace.md`, `04-reviews.md`, `06-cleanup.md`.

## Key files

- Source: `site/features/planner/editor/{PlannerWorkspace,PlannerSubTopBar,PlannerStatusBar,PlannerLeftPanel,usePlannerPanels,plannerToolVisibility}.tsx/ts`
- Specs: `site/tests/e2e/{planner-chrome,planner-custom-tools,planner-guest-workspace}.spec.ts`
- Helpers: `site/tests/e2e/{plannerCanvasHelpers,guestProjectSetup}.ts`
- Config: `site/config/build/{playwright.config.ts,playwright-gate-specs.json}`
- Gate: `site/package.json` `release:gate` / `test:planner-catalog`

## Decisions locked

- Panel collapse/reset affordances: **removed** (test current behavior).
- Door/Window: **source fix** - wire `door`/`window` fabric tools to insert openings on canvas click (chosen over test-only/skip; verified green).
- Select/Erase: **scene-aware helper** (`firstFurnitureCenter` via `window.__plannerFabricView`) - chosen over exposing exact-zoom hook; verified green.
- Shell-on-scratch: **intended** (assert walls).

## Open risks

- ~~`window.__plannerFabricView` exposed in production builds~~ **RESOLVED (D1):** now assigned only when `navigator.webdriver` is true and deleted on dispose. Security-review (D2) confirmed no medium/high/critical issues.
- `resetZoom` helper is now dead code (kept, unused) - candidate for removal in `06` cleanup.
- Pre-existing `site/tests/setup.ts:3` unused `React` import blocks global `pnpm run lint` - unrelated to planner, needs owner OK to fix.
- Coverage thresholds (`test:coverage`/`test:coverage:site`) not yet reached - may surface new gaps.
- Restoring panel affordances is reversible if desired later.
