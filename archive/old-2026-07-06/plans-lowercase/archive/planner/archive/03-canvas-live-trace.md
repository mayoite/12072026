# Area C — Canvas Hit-Testing Live-Trace (incl. zoom)

Investigate the 4 canvas-interaction failures that aren't pure wiring/staleness:

- **#11 Door / #12 Window** — opening placement didn't increment count (stayed 7, expected ≥8).
- **#13 Select** — click at placed coords → inspector still "Nothing selected".
- **#15 Erase** — drag over object → count didn't decrease.

## Hypotheses

- **Zoom ≠ 1 (primary, per user steer):** `canvasPoint` maps `rx*box.width` to **screen pixels**, but fabric hit-tests in **canvas coordinates**. If `useFloorplan().zoom` != 1 on load, screen→canvas mapping is off and clicks/drags miss objects. Check `ZoomControl` / `useFloorplan` initial zoom. (Mitigated in B3 via `resetZoom`.)
- **Shell offset:** "Start from Scratch" seeds a room at `PLANNER_LAYOUT_ORIGIN_UNITS`; placed furniture + click coords (0.45/0.42) may not overlap the furniture hit-box. (Adjusted coords in B3.)
- **Door/Window activation:** tests press keyboard `d`/`Shift+D` without focusing canvas/tool-rail; shortcut may not fire. (Addressed in B3 by using tool buttons instead.)

## Steps

- Build once: `pnpm --filter oando-site build` + `pnpm --filter oando-site start`. (Playwright webServer builds+starts automatically.)
- Run failing specs with trace and inspect `results/test-results/**/error-context.md`.
- Read initial `zoom` from the page — `fitToContent` sets non-multiple-of-10 zoom (39% / 101%); `resetZoom` ±10 buttons can't reach 100. Replaced by scene-aware coords (no exact-zoom requirement).
- Recompute Select/Erase coordinates to land on the placed furniture — done via `firstFurnitureCenter` (reads live `viewportTransform`).

## Outcome

Split each failure into **real regression (source fix)** vs **test-coordinate/zoom flake (test fix)**. Apply minimal fix; re-run.

### Findings (2026-06-30 live-trace)

- **resetZoom helper bug (test fix):** `ZoomControl` steps ±10, but `fitToContent` sets zoom to a non-multiple-of-10 value (observed **39%**, and **101%** after placement). ±10 clicks can never land on exactly 100 → Select/Erase abort at `resetZoom` (got 101, expected 100). Replaced by scene-aware helper (no exact-zoom requirement); `resetZoom` no longer used.
- **#11/#12 Door/Window (REAL product gap → source fix):** `plannerToolToFabricTool` mapped `door`/`window` → `"select"`; rail button + canvas drag selected the wall, no opening placed. `FabricLibraryPanel` (only door/window inserter) not rendered. **Fix:** added `"door"`/`"window"` to `FabricDrawTool`; mapped them in `plannerToolFabricBridge`; on `mouse:down` in `fabricDrawTools`, insert a default opening (from `FURNISHINGS`) at the scene pointer. Existing `isDW` snap/remove logic handles the rest.
- **#13/#15 Select/Erase (test-coordinate → scene-aware helper):** after placing furniture, `fitToContent` re-centers objects and `restoreFromState` discards the active object, so fixed coords + `getActiveObject` both miss. **Fix:** exposed `window.__plannerFabricView` (client-side canvas handle, no secrets) and added `firstFurnitureCenter` to read the furniture's live screen center via `viewportTransform`; Select clicks and Erase taps there.

### Result (2026-06-30)

- `tests/e2e/planner-custom-tools.spec.ts` — **17/17 pass** (Door, Window, Select, Erase green).
- `pnpm run typecheck` — green.
- `pnpm run lint` — green for all area-03 files; one pre-existing unrelated error in `tests/setup.ts` (unused `React` import) logged in `Failures.md`.


## Verify

- [ ] `pnpm --filter oando-site test:planner-catalog` — full planner E2E green (next step).
