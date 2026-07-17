import { expect, test, type Page } from "@playwright/test";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  dragOnCanvas,
  expectObjectCountAtLeast,
  getObjectCount,
  selectPlannerTool,
  switchPlannerStep,
  switchPlannerViewMode,
  waitForPlannerCanvas,
  firstFurnitureCenter,
  clickAtPoint,
} from "./plannerCanvasHelpers";

test.describe.configure({ timeout: 60_000 });

async function openWorkspace(page: Page) {
  await enterGuestPlannerWorkspace(page);
  await waitForPlannerCanvas(page);
}

// Floating dock chrome was removed in the 2026 fabric-shell redesign (PlannerChromeHost
// is a no-op; dock handles, reset, and keyboard nudge no longer exist). These tests
// assert the current top-bar / sub-top-bar / step-driven panel behavior instead.

test.describe("Planner chrome v2", () => {
  test("Draw step opens the left panel", async ({ page }) => {
    await openWorkspace(page);
    await switchPlannerStep(page, "Draw");

    await expect(page.locator(".pw-left-panel")).toHaveAttribute("data-open", "true");
  });

  test("Place step keeps the left panel open", async ({ page }) => {
    await openWorkspace(page);
    await switchPlannerStep(page, "Place");

    await expect(page.locator(".pw-left-panel")).toHaveAttribute("data-open", "true");
  });

  test("Review step shows the right panel", async ({ page }) => {
    await openWorkspace(page);
    await switchPlannerStep(page, "Review");

    // Right panel is rendered in Review; data-open reflects a manual toggle,
    // not step presence, so assert visibility rather than data-open.
    await expect(page.locator(".pw-right-panel")).toBeVisible({ timeout: 10_000 });
  });

  test("Split view shows the split layout with a ready 3D viewer", async ({ page }) => {
    await openWorkspace(page);
    await selectPlannerTool(page, "Furniture");
    await clickOnCanvas(page, 0.45, 0.42);
    await expectObjectCountAtLeast(page, 1);

    await page.getByRole("button", { name: "Split" }).click();
    await expect(page.locator(".pw-split-view")).toBeVisible({ timeout: 10_000 });
    const viewer = page.locator('[data-testid="planner-3d-viewer"]');
    await expect(viewer).toHaveAttribute("data-webgl-status", "ready");
    await expect(viewer).toHaveAttribute("data-render-evidence", "ready", { timeout: 15_000 });
  });

  test("3D view renders and 2D restores the canvas", async ({ page }) => {
    await openWorkspace(page);
    await selectPlannerTool(page, "Furniture");
    await clickOnCanvas(page, 0.45, 0.42);
    await expectObjectCountAtLeast(page, 1);

    await switchPlannerViewMode(page, "3d");
    await expect(page.locator('[data-testid="planner-3d-renderer"]')).not.toContainText("Fallback mode");

    await switchPlannerViewMode(page, "2d");
    await waitForPlannerCanvas(page);
  });

  test("furniture tool opens the library and places an item", async ({ page }) => {
    await openWorkspace(page);

    const before = await getObjectCount(page);
    await selectPlannerTool(page, "Furniture");
    await expect(page.locator(".pw-left-panel")).toHaveAttribute("data-open", "true");
    await page
      .getByRole("region", { name: "Catalog browser" })
      .getByRole("button", { name: /Add .* to canvas/i })
      .first()
      .click();
    await clickOnCanvas(page, 0.45, 0.42);
    await expectObjectCountAtLeast(page, before + 1);
  });

  test("selecting a placed shape opens the inspector", async ({ page }) => {
    await openWorkspace(page);

    const before = await getObjectCount(page);
    await selectPlannerTool(page, "Furniture");
    await page
      .getByRole("region", { name: "Catalog browser" })
      .getByRole("button", { name: /Add .* to canvas/i })
      .first()
      .click();
    await clickOnCanvas(page, 0.45, 0.42);
    await expectObjectCountAtLeast(page, before + 1);

    await selectPlannerTool(page, "Select");
    await expect
      .poll(async () => firstFurnitureCenter(page), { timeout: 15_000 })
      .not.toBeNull();
    const center = await firstFurnitureCenter(page);
    if (!center) throw new Error("No furniture object to select");
    await clickAtPoint(page, center);

    await expect(page.locator(".pwx-inspector")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(".pwx-inspector")).not.toContainText("Nothing selected");
  });
});

test.describe("Planner chrome WebGL fallback", () => {
  test("3D fallback keeps 2D planner usable when WebGL is unavailable", async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function patched(type: string, ...args: unknown[]) {
        if (type === "webgl" || type === "webgl2") {
          return null;
        }
        return original.call(this, type, ...(args as []));
      };
    });

    await openWorkspace(page);
    const before = await getObjectCount(page);

    await switchPlannerViewMode(page, "3d");
    await expect(page.locator('[data-testid="planner-3d-fallback"]')).toBeVisible();

    await switchPlannerViewMode(page, "2d");
    await selectPlannerTool(page, "Wall");
    await dragOnCanvas(page, { rx: 0.25, ry: 0.5 }, { rx: 0.62, ry: 0.5 });
    await expectObjectCountAtLeast(page, before + 1);
  });
});
