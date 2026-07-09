/**
 * Systems v0 configurator — size/shape/modules → place (not fixed 8 SKUs only).
 * Evidence: results/planner/world-standard-wave/07-systems-v0/
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
  "07-systems-v0",
);

async function furnitureCount(page: Page): Promise<number> {
  const body = await page.locator("body").innerText();
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

test.describe("Systems v0 configurator", () => {
  test("pick L-shape 1500×600 + overhead → place → furniture +1", async ({
    page,
  }) => {
    fs.mkdirSync(EVIDENCE, { recursive: true });

    await enterGuestPlannerWorkspace(page, {
      projectName: "Systems configurator",
    });
    await waitForPlannerCanvas(page);

    const before = await furnitureCount(page);
    expect(before).toBeGreaterThanOrEqual(0);

    const configurator = page.getByRole("region", {
      name: "Workstation systems configurator",
    });
    await expect(configurator).toBeVisible({ timeout: 15_000 });
    await page.screenshot({
      path: path.join(EVIDENCE, "30-configurator-open.png"),
    });

    await configurator.getByRole("button", { name: "L-shape" }).click();
    await configurator.getByRole("button", { name: "1500×600" }).click();
    // Toggle overhead on if not already active
    const overhead = configurator.getByRole("button", { name: "Overhead" });
    if ((await overhead.getAttribute("aria-pressed")) !== "true") {
      await overhead.click();
    }
    // Pedestal off for non-default combo
    const pedestal = configurator.getByRole("button", { name: "Pedestal" });
    if ((await pedestal.getAttribute("aria-pressed")) === "true") {
      await pedestal.click();
    }

    await page.screenshot({
      path: path.join(EVIDENCE, "31-configurator-configured.png"),
    });

    await configurator
      .getByRole("button", { name: "Place this workstation" })
      .click();
    await clickOnCanvas(page, 0.5, 0.45);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(before + 1);

    const body = await page.locator("body").innerText();
    expect(body).toMatch(/L-shape|ws-v0-l-shape|Furniture selected|1\s+seats/i);

    await page.screenshot({
      path: path.join(EVIDENCE, "32-configurator-placed.png"),
    });

    fs.writeFileSync(
      path.join(EVIDENCE, "configurator-run.json"),
      JSON.stringify(
        {
          ok: true,
          furnitureBefore: before,
          furnitureAfter: before + 1,
          at: new Date().toISOString(),
        },
        null,
        2,
      ),
      "utf8",
    );
  });
});
