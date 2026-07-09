/**
 * W4 browser — place seats (configurator) → 3D orbit attr → 2D same furniture count.
 * Place path uses proven systems-v0 "Place N seats" (catalog click was flaky).
 * Evidence: results/planner/world-standard-wave/04-orbit-continuity/
 */
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import { waitForPlannerCanvas } from "./plannerCanvasHelpers";

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
  const body = await page.locator("body").innerText();
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

test.describe("W4 orbit + 2D↔3D continuity (browser)", () => {
  test("place furniture → 3D orbit attr → 2D same count", async ({ page }) => {
    fs.mkdirSync(EVIDENCE, { recursive: true });

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await enterGuestPlannerWorkspace(page, { projectName: "W4 continuity" });
    await waitForPlannerCanvas(page);
    await expect(page.locator(".pw-topbar")).toBeVisible();

    const before = await furnitureCount(page);
    expect(before).toBeGreaterThanOrEqual(0);

    // Proven place path (systems v0 batch) — avoids flaky catalog + canvas click.
    const configurator = page.getByRole("region", {
      name: "Workstation systems configurator",
    });
    await expect(configurator).toBeVisible({ timeout: 15_000 });
    await configurator.getByRole("button", { name: "Place 4 seats" }).click();

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(before + 4);
    const afterPlace = await furnitureCount(page);

    await page.screenshot({ path: path.join(EVIDENCE, "01-2d-after-place.png") });

    await page.getByRole("radio", { name: "3D", exact: true }).click();
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible({
      timeout: 20_000,
    });

    const orbit = page.locator(
      '[data-testid="three-viewer-container"][data-orbit-enabled="true"]',
    );
    await expect(orbit.first()).toBeVisible({ timeout: 15_000 });

    // Optional light left-drag — orbit should not crash the page.
    const box = await orbit.first().boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 40, cy + 10, { steps: 5 });
      await page.mouse.up();
    }
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible();

    await page.screenshot({ path: path.join(EVIDENCE, "02-3d-orbit-on.png") });

    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await waitForPlannerCanvas(page);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBe(afterPlace);

    await page.getByRole("radio", { name: "3D", exact: true }).click();
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.locator(
        '[data-testid="three-viewer-container"][data-orbit-enabled="true"]',
      ),
    ).toBeVisible({ timeout: 15_000 });

    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await waitForPlannerCanvas(page);
    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBe(afterPlace);

    await page.screenshot({ path: path.join(EVIDENCE, "03-2d-restored.png") });

    const hardAppErrors = consoleErrors.filter(
      (t) =>
        !t.includes("Download the React DevTools") &&
        !t.includes("favicon") &&
        !/net::ERR_/i.test(t),
    );

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
          placePath: "configurator Place 4 seats",
          consoleErrorCount: hardAppErrors.length,
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
