/**
 * W3 browser proof — select furniture → Delete → undo (open3d native chrome).
 * Evidence: results/planner/world-standard-wave/03-select-delete/
 */
import { expect, test } from "@playwright/test";
import path from "node:path";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  placeSeatsFromConfigurator,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "03-select-delete",
);

async function furnitureCount(page: import("@playwright/test").Page): Promise<number> {
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

test.describe("W3 select / delete / undo (browser)", () => {
  test("place furniture, select, Delete removes, Ctrl+Z restores", async ({ page }) => {
    await enterGuestPlannerWorkspace(page, { projectName: "W3 select-delete" });
    await waitForPlannerCanvas(page);

    const furnitureBefore = await furnitureCount(page);
    expect(furnitureBefore).toBeGreaterThanOrEqual(0);

    // Proven place path (systems v0 batch) — catalog+canvas was flaky (W4 notes).
    await placeSeatsFromConfigurator(page, 4);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(furnitureBefore + 4);

    const afterPlace = await furnitureCount(page);
    await page.screenshot({ path: path.join(EVIDENCE, "01-placed.png") });

    // Select tool (open3d rail) — batch places near origin; tap center-ish plan
    await page.getByRole("button", { name: /Select/i }).first().click();
    await clickOnCanvas(page, 0.5, 0.5);

    // Properties: not empty selection
    await expect(
      page.getByRole("heading", { name: /No Selection/i }),
    ).toHaveCount(0, { timeout: 10_000 });
    await page.screenshot({ path: path.join(EVIDENCE, "02-selected.png") });

    await page.keyboard.press("Delete");
    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBeLessThan(afterPlace);
    await page.screenshot({ path: path.join(EVIDENCE, "03-deleted.png") });

    const afterDelete = await furnitureCount(page);
    await page.keyboard.press("Control+z");
    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBeGreaterThan(afterDelete);
    await page.screenshot({ path: path.join(EVIDENCE, "04-undone.png") });
  });
});
