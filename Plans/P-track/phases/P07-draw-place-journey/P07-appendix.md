# P07 Appendix — Playwright skeletons

## Structure rewrite 2026-07-09

Companion to **[P07-draw-place-journey.md](../P07-draw-place-journey/P07-draw-place-journey.md)**. Multi-page TypeScript skeletons live here. **Not a second CP.** Canonical evidence remains `results/planner/world-standard-wave/02-browser-open3d-journey/`.

---

## getFurnitureCount

```typescript
// plannerCanvasHelpers.ts — mirror getWallCount
export async function getFurnitureCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar > span")
    .filter({ hasText: /^\d+ furniture$/ })
    .textContent();
  const match = text?.match(/^(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : 0;
}
```

---

## Spec header

```typescript
/**
 * World-standard open3d journey — W1 (draw walls + door/opening) + W2 (place catalog incl. cabinet-v0).
 *
 * Evidence (canonical): results/planner/world-standard-wave/02-browser-open3d-journey/
 * Phase alias:          results/planner/world-standard-wave/07-browser-journey/
 * Pattern: admin-svg-publish-p01.spec.ts
 * Serial: config fullyParallel — this file MUST run serial.
 */
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { clearPlannerStorage, enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  dragOnCanvas,
  getFurnitureCount,
  getObjectCount,
  getWallCount,
  placeOpeningOnCanvas,
  selectPlannerTool,
  tapOnCanvas,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

const SITE_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const EVIDENCE_DIR = path.join(
  REPO_ROOT, "results", "planner", "world-standard-wave", "02-browser-open3d-journey",
);
const PHASE_ALIAS_DIR = path.join(
  REPO_ROOT, "results", "planner", "world-standard-wave", "07-browser-journey",
);

test.describe.configure({ mode: "serial", timeout: 120_000 });

test.beforeAll(() => {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(PHASE_ALIAS_DIR, { recursive: true });
});
```

---

## Entry helper

```typescript
/** Primary: /planner/open3d · Fallback: guest (?plannerDevTools=1 owned by helper). */
async function enterWorldStandardPlanner(page: Page): Promise<"open3d" | "guest"> {
  await clearPlannerStorage(page);
  await page.goto("/planner/open3d", { waitUntil: "domcontentloaded", timeout: 60_000 });
  const topbar = page.locator(".pw-topbar");
  const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
  const ready = await Promise.race([
    topbar.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
    canvas.waitFor({ state: "visible", timeout: 25_000 }).then(() => true),
  ]).catch(() => false);

  if (ready) {
    await expect(page.locator('[data-testid="planner-2d-canvas"] canvas')).toBeVisible({
      timeout: 25_000,
    });
    return "open3d";
  }

  await enterGuestPlannerWorkspace(page, { projectName: "W1-W2 world-standard" });
  await waitForPlannerCanvas(page);
  return "guest";
}
```

---

## W1 interaction script

```typescript
const wallsBefore = await getWallCount(page);
const objectsBefore = await getObjectCount(page);

await selectPlannerTool(page, "Wall");
await dragOnCanvas(page, { rx: 0.25, ry: 0.25 }, { rx: 0.75, ry: 0.25 });
await dragOnCanvas(page, { rx: 0.75, ry: 0.25 }, { rx: 0.75, ry: 0.75 });
await dragOnCanvas(page, { rx: 0.75, ry: 0.75 }, { rx: 0.25, ry: 0.75 });
await dragOnCanvas(page, { rx: 0.25, ry: 0.75 }, { rx: 0.25, ry: 0.25 });

await expect
  .poll(async () => getWallCount(page), { timeout: 15_000 })
  .toBeGreaterThan(wallsBefore);
const wallsAfterDraw = await getWallCount(page);
const objectsAfterWalls = await getObjectCount(page);

await selectPlannerTool(page, "Opening");
await placeOpeningOnCanvas(page, { rx: 0.45, ry: 0.25 }, { rx: 0.55, ry: 0.25 });
// fallback: tapOnCanvas(page, 0.5, 0.25) once if placeOpening fails

await expect
  .poll(async () => getObjectCount(page), { timeout: 15_000 })
  .toBeGreaterThan(objectsAfterWalls);
await expect.poll(async () => getWallCount(page), { timeout: 5_000 }).toBeGreaterThanOrEqual(wallsAfterDraw);
```

Do **not** pass W1 on toast/copy alone. Do **not** use absolute walls ≥1 without delta (guest seed).

---

## W2 interaction script

```typescript
const furnitureBefore = await getFurnitureCount(page);

const search = page
  .getByRole("searchbox", { name: /Search catalog elements/i })
  .or(page.getByPlaceholder(/Search furniture/i));
await search.fill("cabinet-v0");
const addCabinet = page.getByRole("button", { name: /Add .* to canvas/i }).first();
await expect(addCabinet).toBeVisible({ timeout: 15_000 });
await addCabinet.click();
await clickOnCanvas(page, 0.4, 0.4);

await expect
  .poll(async () => getFurnitureCount(page), { timeout: 30_000 })
  .toBeGreaterThan(furnitureBefore);

await search.fill("desk");
const addSecond = page.getByRole("button", { name: /Add .* to canvas/i }).first();
await expect(addSecond).toBeVisible({ timeout: 15_000 });
await addSecond.click();
await clickOnCanvas(page, 0.55, 0.55);
await expect
  .poll(async () => getFurnitureCount(page), { timeout: 20_000 })
  .toBeGreaterThanOrEqual(furnitureBefore + 2);

const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
await expect(canvas).toBeVisible();
const shot = await canvas.screenshot({
  path: path.join(EVIDENCE_DIR, "06-canvas-2d-symbols.png"),
});
expect(shot.byteLength).toBeGreaterThan(5_000);
```

Record `secondCatalogId` in proof JSON (`sample-desk-1` primary; sofa fallback).

---

## playwright-run.json

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
  "blockersResolved": []
}
```

Rules: pass only when exit 0 and every screenshot exists; on fail use `blockersOpen` not fake blockersResolved; never delete failed artifacts.

---

## npm script

```json
"test:e2e:world-standard-w1w2": "npm run test:clean && playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list"
```

```powershell
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
cd site
pnpm run test:e2e:world-standard-w1w2
```

Unset `PLAYWRIGHT_BASE_URL` → config `build && start`; record which path ran.

---

## Phase alias NOTES

```markdown
# P07 evidence alias

Canonical proof: `../02-browser-open3d-journey/`  
Checkpoint: CP-07  
Gates: W1, W2
```

---

## Expert revision archive (2026-07-09)

**S1** serial evidence writer · **S2** baseline deltas · **S3/S4** server + entry honesty · **S5/S6** getFurnitureCount + objects Δ for door · **S7–S9** catalog lock + path + CP honesty (place/non-blank ≠ P05 quality). Full: [P07-suggestions.md](./P07-suggestions.md).
