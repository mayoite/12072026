/**
 * W5 browser proof — place furniture → flush save → hard reload → restore (open3d native chrome).
 * Evidence: results/planner/world-standard-wave/06-save-honesty/save-reload/
 *
 * Uses one-shot in-page storage clear (not init-script wipe) so page.reload keeps IDB.
 */
import { expect, test } from "@playwright/test";
import path from "node:path";

import {
  clearPlannerStorageInPage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import {
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
  "06-save-honesty",
  "save-reload",
);

const PROJECT_NAME = "W5 save-reload";

async function furnitureCount(page: import("@playwright/test").Page): Promise<number> {
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

/** Wait until autosave / explicit Save reports local saved (TopBar or status bar). */
async function waitForSavedLocally(page: import("@playwright/test").Page): Promise<void> {
  await expect
    .poll(
      async () => {
        const body = await page.locator("body").innerText();
        if (/Saved locally|Draft saved locally/i.test(body)) return "saved";
        return "pending";
      },
      { timeout: 25_000 },
    )
    .toBe("saved");
}

test.describe("W5 save honesty / hard reload (browser)", () => {
  test("place furniture, save, hard reload restores furniture count", async ({ page }) => {
    // Origin + one-shot clear — no addInitScript so reload preserves planner-workspace-db.
    await page.goto("/planner/guest/?plannerDevTools=1", {
      waitUntil: "domcontentloaded",
    });
    await clearPlannerStorageInPage(page);

    await enterGuestPlannerWorkspace(page, {
      projectName: PROJECT_NAME,
      preservePlannerState: true,
    });
    await waitForPlannerCanvas(page);

    const furnitureBefore = await furnitureCount(page);
    expect(furnitureBefore).toBeGreaterThanOrEqual(0);

    // Proven place path (systems v0 batch) — catalog+canvas was flaky (W4 notes).
    await placeSeatsFromConfigurator(page, 4);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(furnitureBefore + 4);

    const afterPlace = await furnitureCount(page);
    await page.screenshot({ path: path.join(EVIDENCE, "01-before-save.png") });

    // Explicit Save draft → flushPersist (not 5s debounce alone).
    await page.getByRole("button", { name: /Save draft|Save/i }).first().click();
    await waitForSavedLocally(page);
    await page.screenshot({ path: path.join(EVIDENCE, "02-saved-local.png") });

    // Hard reload — same origin storage (IDB + setup flags).
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(".pw-topbar")).toBeVisible({ timeout: 25_000 });
    await waitForPlannerCanvas(page);

    // Restore is async after first paint of default room — poll furniture count.
    // Guest open3d title often stays "Untitled plan" (workspace prop); furniture count is the restore signal.
    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(afterPlace);

    const restored = await furnitureCount(page);
    expect(restored).toBe(afterPlace);
    expect(restored).toBeGreaterThan(furnitureBefore);

    await page.screenshot({ path: path.join(EVIDENCE, "03-after-hard-reload.png") });
  });
});
