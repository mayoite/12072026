/**
 * Evidence capture for canvas UX fixes — results/planner/canvas-ux-fix/
 */
import fs from "node:fs";
import path from "node:path";
import { test } from "@playwright/test";

import {
  clearPlannerStorageInPage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import { waitForPlannerCanvas } from "./plannerCanvasHelpers";

const REPO_ROOT = path.resolve(__dirname, "../..", "..");
const OUT = path.join(REPO_ROOT, "results", "planner", "canvas-ux-fix");

const VIEWPORTS = [
  { width: 1280, height: 800, label: "1280x800" },
  { width: 700, height: 800, label: "700x800" },
  { width: 375, height: 812, label: "375x812" },
] as const;

test.describe.configure({ mode: "serial", timeout: 180_000 });

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
});

for (const vp of VIEWPORTS) {
  test(`capture ${vp.label}`, async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("oando-onboarding-complete-planner-guest", "true");
    });
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/planner/guest/?plannerDevTools=1", {
      waitUntil: "domcontentloaded",
    });
    await clearPlannerStorageInPage(page);
    await enterGuestPlannerWorkspace(page, {
      projectName: `Canvas UX ${vp.label}`,
      navigate: false,
      preservePlannerState: true,
    });
    await waitForPlannerCanvas(page, { timeoutMs: 90_000 });

    const dir = path.join(OUT, vp.label);
    fs.mkdirSync(dir, { recursive: true });

    await page.screenshot({
      path: path.join(dir, "workspace-default.png"),
      fullPage: false,
    });

    await page.getByRole("button", { name: /Toggle layers panel/i }).click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(dir, "layers-open.png"),
      fullPage: false,
    });
    await page.getByRole("button", { name: /Toggle layers panel/i }).click();

    const libraryTab = page.getByRole("tab", { name: /library/i });
    if (await libraryTab.isVisible().catch(() => false)) {
      await libraryTab.click();
    } else {
      const inventoryBtn = page.getByRole("button", {
        name: /Toggle inventory panel/i,
      });
      if (await inventoryBtn.isVisible().catch(() => false)) {
        await inventoryBtn.click();
      }
    }
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(dir, "inventory-panel.png"),
      fullPage: false,
    });

    const gridOverlay = page.getByTestId("planner-grid-overlay");
    if (!(await gridOverlay.isVisible().catch(() => false))) {
      const gridBtn = page.getByRole("button", { name: /Enable grid/i });
      if (await gridBtn.isVisible().catch(() => false)) {
        await gridBtn.click();
      }
    }
    await page.screenshot({
      path: path.join(dir, "grid-visible.png"),
      fullPage: false,
    });
  });
}
