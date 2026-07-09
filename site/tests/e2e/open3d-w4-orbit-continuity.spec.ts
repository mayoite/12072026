/**
 * W4 browser residual — 2D place → 3D (orbit on) → 2D same furniture count.
 * Evidence: results/planner/world-standard-wave/04-orbit-continuity/
 */
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "04-orbit-continuity",
);

async function furnitureCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar, [class*='status']")
    .filter({ hasText: /\d+\s+furniture/i })
    .first()
    .textContent()
    .catch(() => null);
  const body = text ?? (await page.locator("body").innerText());
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

test.describe("W4 orbit + 2D↔3D continuity (browser)", () => {
  test("place furniture → 3D orbit attr → 2D same count", async ({ page }) => {
    fs.mkdirSync(EVIDENCE, { recursive: true });

    await enterGuestPlannerWorkspace(page, { projectName: "W4 continuity" });
    await waitForPlannerCanvas(page);
    await expect(page.locator(".pw-topbar")).toBeVisible();

    const before = await furnitureCount(page);
    expect(before).toBeGreaterThanOrEqual(0);

    const catalog = page.getByRole("region", { name: "Catalog browser" });
    const search = page.getByLabel("Search catalog elements");
    await expect(search).toBeVisible({ timeout: 15_000 });
    await search.fill("workstation");
    await page.waitForTimeout(400);

    // Prefer aria-label; force click — status bar / inventory chrome often intercepts.
    const addBtn = catalog.getByRole("button", {
      name: /Add Workstation.* to canvas/i,
    });
    await expect(addBtn.first()).toBeVisible({ timeout: 10_000 });
    await addBtn.first().click({ force: true });
    await page.waitForTimeout(200);
    await clickOnCanvas(page, 0.48, 0.45);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBeGreaterThan(before);
    const afterPlace = await furnitureCount(page);

    await page.screenshot({ path: path.join(EVIDENCE, "01-2d-after-place.png") });

    await page.getByRole("radio", { name: "3D", exact: true }).click();
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible({ timeout: 20_000 });

    const orbit = page.locator("[data-orbit-enabled]");
    await expect(orbit.first()).toHaveAttribute("data-orbit-enabled", "true", {
      timeout: 15_000,
    });

    await page.screenshot({ path: path.join(EVIDENCE, "02-3d-orbit-on.png") });

    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await waitForPlannerCanvas(page);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBe(afterPlace);

    await page.screenshot({ path: path.join(EVIDENCE, "03-2d-restored.png") });

    fs.writeFileSync(
      path.join(EVIDENCE, "browser-run.json"),
      JSON.stringify(
        {
          phase: "P04",
          gate: "W4",
          status: "browser-green",
          furnitureBefore: before,
          furnitureAfterPlace: afterPlace,
          furnitureAfterToggle: afterPlace,
          orbitEnabled: true,
          screenshots: [
            "01-2d-after-place.png",
            "02-3d-orbit-on.png",
            "03-2d-restored.png",
          ],
        },
        null,
        2,
      ),
      "utf8",
    );
  });
});
