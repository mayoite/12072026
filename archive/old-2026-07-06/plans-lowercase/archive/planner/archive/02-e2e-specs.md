# Area B - Planner E2E Specs -> Green

16 failures across 3 specs. Detail in `01-source-wiring.md` (wiring) and `03-canvas-live-trace.md` (canvas).

## B1. Rewrite `site/tests/e2e/planner-chrome.spec.ts` (8 tests)

Drop dock-handle / reset / nudge / legacy-storage tests (removed UI). Assert current behavior:

- [x] Verified green: `pnpm --filter oando-site exec playwright test -c config/build/playwright.config.ts tests/e2e/planner-chrome.spec.ts` -> 8/8 pass

## B2. Update `site/tests/e2e/planner-guest-workspace.spec.ts` (1 test)

Test "empty canvas shows RoomSketcher-style starter actions" (line 21) expects 0 objects. `buildShellOnlyLayout` (`site/features/planner/ai/spaceSuggest.ts`) seeds 1 room + 4 perimeter walls on "Start from Scratch".

**Action:**
- Rewrite to assert `getWallCount(page) >= 4`, `getObjectCount(page) > 0`, no furniture
- Drop "Empty canvas guidance"/"Draw walls"/"Use template" assertions (canvas no longer empty)

## B3. Fix `site/tests/e2e/planner-custom-tools.spec.ts` (5 tests)

- #14 tool-visibility dropdown - fixed by A1
- #11 Door - source fix (Area C): added `door`/`window` fabric tools; rail button now inserts a default opening at the click.
- #12 Window - same source fix as #11.
- #13 Select - scene-aware: `firstFurnitureCenter` reads the furniture's live screen center via `viewportTransform` (replaces broken `resetZoom` + fixed coords).
- #15 Erase - scene-aware: tap at `firstFurnitureCenter`.

## Helpers

`site/tests/e2e/plannerCanvasHelpers.ts` - `clickOnCanvas`, `placeOpeningOnCanvas`, `getObjectCount`, `getWallCount`, `setToolVisibilityMode`, `switchPlannerStep`. Added `firstFurnitureCenter` + `clickAtPoint`/`tapAtPoint` (scene-aware, Area C). `resetZoom` kept but unused (+/-10 buttons can't reach non-multiple-of-10 zoom).

## Verify

- [x] `pnpm --filter oando-site test:planner-catalog` green for all 4 specs - 40/40 pass
