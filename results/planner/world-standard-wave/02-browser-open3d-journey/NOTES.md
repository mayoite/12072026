# W1–W2 open3d journey — browser (2026-07-09)

## Scope
- Guest enter → draw wall (delta) → place ≥2 catalog items (prefer cabinet search) → 2D/3D toggle
- Open3d **native chrome** only (CanvasToolRail + TopBar view radios)
- **Not** fabric step-bar (assert `.pw-step-bar` count 0)

## Spec
- `site/tests/e2e/open3d-world-standard-journey.spec.ts`
- Pattern: `open3d-w3-select-delete.spec.ts`, `open3d-save-honesty.spec.ts`

## Browser
- Route: `/planner/guest/?plannerDevTools=1`
- Wall: open3d two-click draw (Wall tool → click start → click end)
- Furniture: search `cabinet` when available, else two generic catalog adds
- Counts: status-bar `N walls` / `N furniture` deltas
- View: radio 3D (`planner-3d-canvas`) → radio 2D

## Result
- 1 passed (playwright-raw.log)
- Screenshots 01–06

## Run
```
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```
