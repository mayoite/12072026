W1-W2 open3d journey — PASS 2026-07-12
HEAD: 2c2e9f2b (working tree had layout + helper fixes, uncommitted)
Command: PLAYWRIGHT_BASE_URL=http://localhost:3000 DEV_AUTH_BYPASS=1
  pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts --config=config/build/playwright.config.ts --project=chromium

W1 walls: before=4 after=5 Δ=+1
W1 objects (opening): afterWalls=5 afterOpening=6 Δ=+1
W2 furniture: 0 → 2 (cabinet-v0 + sample-desk-1)
Host: planner-fabric-stage · baseURL localhost:3000

Root cause: planner-route-host missing open3d-route-host height lock → shell ~2k px tall;
selectPlannerTool scrollIntoView shoved upper-canvas to y<0 → drag missed → walls stuck at seed.
Fixes: PlannerHost dual class; shell/stage max-height; helpers force-click + ensurePlannerCanvasOnScreen.
Artifacts: playwright-run.json, 01–07 PNGs, playwright-raw.log, 07-browser-journey alias.
