/**
 * W1–W2 browser proof — guest enter → draw wall → place ≥2 catalog items → 2D/3D
 * (open3d native chrome; NOT fabric step-bar).
 *
 * Evidence: results/planner/world-standard-wave/02-browser-open3d-journey/
 */
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  selectPlannerTool,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "02-browser-open3d-journey",
);

async function furnitureCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar, [class*='status']")
    .filter({ hasText: /\d+\s+furniture/i })
    .first()
    .textContent()
    .catch(() => null);
  // status may be a single line: "4 objects 4 walls 0 furniture ..."
  const body = text ?? (await page.locator("body").innerText());
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

async function wallCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar > span")
    .filter({ hasText: /^\d+\s+walls$/i })
    .first()
    .textContent()
    .catch(() => null);
  const body = text ?? (await page.locator("body").innerText());
  const match = body.match(/(\d+)\s+walls/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

/** Open3d wall tool: click start, then click end (not fabric drag). */
async function drawWallByTwoClicks(
  page: Page,
  from: { rx: number; ry: number },
  to: { rx: number; ry: number },
): Promise<void> {
  await selectPlannerTool(page, "Wall");
  await clickOnCanvas(page, from.rx, from.ry);
  await page.waitForTimeout(120);
  await clickOnCanvas(page, to.rx, to.ry);
  await page.waitForTimeout(120);
}

async function placeCatalogItem(
  page: Page,
  addButtonName: RegExp | string,
  rx: number,
  ry: number,
): Promise<void> {
  const catalog = page.getByRole("region", { name: "Catalog browser" });
  await catalog.getByRole("button", { name: addButtonName }).first().click();
  await clickOnCanvas(page, rx, ry);
}

test.describe("W1–W2 open3d world-standard journey (browser)", () => {
  test("guest enter → draw wall → place ≥2 catalog items → 2D/3D", async ({ page }) => {
    // --- Guest enter (open3d native chrome) ---
    await enterGuestPlannerWorkspace(page, { projectName: "W1-W2 journey" });
    await waitForPlannerCanvas(page);
    await expect(page.locator(".pw-topbar")).toBeVisible();
    // Native chrome: view mode radios (not fabric step-bar)
    await expect(page.getByRole("radio", { name: "2D", exact: true })).toBeVisible();
    await expect(page.getByRole("group", { name: "Drawing tools" })).toBeVisible();
    await expect(page.locator(".pw-step-bar")).toHaveCount(0);

    const wallsBefore = await wallCount(page);
    const furnitureBefore = await furnitureCount(page);
    expect(wallsBefore).toBeGreaterThanOrEqual(0);
    expect(furnitureBefore).toBeGreaterThanOrEqual(0);
    await page.screenshot({ path: path.join(EVIDENCE, "01-guest-entered.png") });

    // --- W1: draw wall (delta walls) ---
    // Guest shell may already have perimeter walls; assert +1 from our draw.
    await drawWallByTwoClicks(page, { rx: 0.28, ry: 0.55 }, { rx: 0.72, ry: 0.55 });
    await expect
      .poll(async () => wallCount(page), { timeout: 20_000 })
      .toBeGreaterThan(wallsBefore);
    const wallsAfterDraw = await wallCount(page);
    expect(wallsAfterDraw).toBe(wallsBefore + 1);
    await page.screenshot({ path: path.join(EVIDENCE, "02-wall-drawn.png") });

    // --- W2: place ≥2 catalog items (prefer search cabinet / cabinet-v0) ---
    const catalog = page.getByRole("region", { name: "Catalog browser" });
    const search = page.getByLabel("Search catalog elements");
    await expect(search).toBeVisible({ timeout: 15_000 });

    await search.fill("cabinet");
    await page.waitForTimeout(400);

    const cabinetAdd = catalog.getByRole("button", {
      name: /Add .*[Cc]abinet.* to canvas/i,
    });
    const cabinetVisible = await cabinetAdd
      .first()
      .isVisible({ timeout: 5_000 })
      .catch(() => false);

    if (cabinetVisible) {
      await cabinetAdd.first().click();
      await clickOnCanvas(page, 0.42, 0.4);
      await expect
        .poll(async () => furnitureCount(page), { timeout: 20_000 })
        .toBeGreaterThan(furnitureBefore);

      // Second item: clear search → first remaining catalog add
      await search.fill("");
      await page.waitForTimeout(300);
      await catalog
        .getByRole("button", { name: /Add .* to canvas/i })
        .first()
        .click();
      await clickOnCanvas(page, 0.58, 0.48);
    } else {
      // Fallback: two generic catalog adds (no step-bar Place step)
      await search.fill("");
      await page.waitForTimeout(200);
      await placeCatalogItem(page, /Add .* to canvas/i, 0.42, 0.4);
      await expect
        .poll(async () => furnitureCount(page), { timeout: 20_000 })
        .toBeGreaterThan(furnitureBefore);
      await placeCatalogItem(page, /Add .* to canvas/i, 0.58, 0.48);
    }

    await expect
      .poll(async () => furnitureCount(page), { timeout: 20_000 })
      .toBeGreaterThanOrEqual(furnitureBefore + 2);

    const furnitureAfterPlace = await furnitureCount(page);
    expect(furnitureAfterPlace - furnitureBefore).toBeGreaterThanOrEqual(2);
    await page.screenshot({ path: path.join(EVIDENCE, "03-furniture-placed.png") });

    // --- 2D ↔ 3D toggle (open3d top bar) ---
    await page.getByRole("radio", { name: "3D", exact: true }).click();
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible({ timeout: 20_000 });
    await page.screenshot({ path: path.join(EVIDENCE, "04-view-3d.png") });

    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await waitForPlannerCanvas(page);
    await page.screenshot({ path: path.join(EVIDENCE, "05-view-2d-restored.png") });

    // Furniture / wall counts still hold after view toggle
    await expect
      .poll(async () => furnitureCount(page), { timeout: 10_000 })
      .toBe(furnitureAfterPlace);
    await expect
      .poll(async () => wallCount(page), { timeout: 10_000 })
      .toBe(wallsAfterDraw);

    await page.screenshot({ path: path.join(EVIDENCE, "06-journey-complete.png") });
  });
});
