import { expect, test } from "@playwright/test";
import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import path from "path";
import fs from "fs";

test.describe("Planner Workspace Responsiveness", () => {
  const screenshotsDir = path.resolve(
    "e:/12072026/.agents/teamwork_preview_challenger_layout_4/screenshots"
  );

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test("Check header layout and element visibility across viewports", async ({ page }) => {
    // 1. Desktop Viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await enterGuestPlannerWorkspace(page);

    const topBar = page.locator(".pw-topbar");
    await expect(topBar).toBeVisible();

    // Verify Grid/Snap buttons are visible on desktop
    const gridBtn = page.locator('button:has-text("Grid")');
    const snapBtn = page.locator('button:has-text("Snap")');
    await expect(gridBtn).toBeVisible();
    await expect(snapBtn).toBeVisible();

    // Verify no horizontal overflow in header on desktop
    const desktopMetrics = await topBar.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      offsetHeight: el.offsetHeight,
    }));
    expect(desktopMetrics.scrollWidth).toBeLessThanOrEqual(desktopMetrics.clientWidth);

    // Save screenshot
    await page.screenshot({ path: path.join(screenshotsDir, "desktop.png") });

    // 2. Tablet Viewport (< 48rem / 768px)
    await page.setViewportSize({ width: 700, height: 1024 });
    // Allow styles to apply
    await page.waitForTimeout(500);

    // Grid and Snap buttons should be hidden (display: none !important)
    await expect(gridBtn).toBeHidden();
    await expect(snapBtn).toBeHidden();

    // Verify header does not overflow
    const tabletMetrics = await topBar.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      offsetHeight: el.offsetHeight,
    }));
    expect(tabletMetrics.scrollWidth).toBeLessThanOrEqual(tabletMetrics.clientWidth);

    // Save screenshot
    await page.screenshot({ path: path.join(screenshotsDir, "tablet.png") });

    // 3. Mobile Viewport (< 48rem / 768px)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    // Grid/Snap should still be hidden
    await expect(gridBtn).toBeHidden();
    await expect(snapBtn).toBeHidden();

    // Verify header does not overflow
    const mobileMetrics = await topBar.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      offsetHeight: el.offsetHeight,
    }));
    expect(mobileMetrics.scrollWidth).toBeLessThanOrEqual(mobileMetrics.clientWidth);

    // Save screenshot
    await page.screenshot({ path: path.join(screenshotsDir, "mobile.png") });
  });
});
