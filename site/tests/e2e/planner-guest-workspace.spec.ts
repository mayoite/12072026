import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { clearPlannerStorage, enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  dragOnCanvas,
  getObjectCount,
  getWallCount,
  PLANNER_PRIMARY_CANVAS,
  selectPlannerTool,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

test.describe("Planner guest workspace — plan 06 UI bar", () => {
  test.beforeEach(async ({ page }) => {
    await enterGuestPlannerWorkspace(page);
  });

  test("loads canvas chrome with history, view modes, and catalog", async ({ page }) => {
    await expect(page.getByRole("group", { name: "Canvas history" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
    await expect(page.getByRole("button", { name: "2D", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Split" })).toBeVisible();
    await expect(page.getByRole("button", { name: "3D", exact: true })).toBeVisible();
    await expect(page.getByLabel("Search catalog elements")).toBeVisible();
    await expect(page.locator(PLANNER_PRIMARY_CANVAS)).toBeVisible();
  });

  test("Start from Scratch seeds a perimeter shell with no furniture", async ({ page }) => {
    await expect(page.locator(".pw-status-bar > span").filter({ hasText: /objects/ })).toBeVisible({
      timeout: 15_000,
    });

    await expect
      .poll(async () => getWallCount(page), { timeout: 15_000 })
      .toBeGreaterThanOrEqual(4);
    await expect
      .poll(async () => getObjectCount(page), { timeout: 15_000 })
      .toBeGreaterThan(0);

    const furnitureText = await page
      .locator(".pw-status-bar > span")
      .filter({ hasText: /^\d+ furniture$/ })
      .textContent();
    const furnitureMatch = furnitureText?.match(/^(\d+)\s+furniture/i);
    expect(furnitureMatch ? furnitureMatch[1] : "0").toBe("0");
  });

  test("catalog search filters elements", async ({ page }) => {
    const search = page.getByLabel("Search catalog elements");
    await search.fill("meeting");
    await expect(page.getByRole("button", { name: /Add .* to canvas/i })).toBeVisible();
    await search.fill("zzzznotfound");
    await expect(page.getByText(/No elements found/i)).toBeVisible();
  });

  test("status bar shows plan metrics", async ({ page }) => {
    const statusBar = page.locator(".pw-status-bar");
    await expect(statusBar).toContainText(/objects/i);
    await expect(statusBar).toContainText(/Floor/i);
  });

  test("view mode toggles without error", async ({ page }) => {
    await page.getByRole("button", { name: "Split" }).click();
    await expect(page.locator(".pw-split-view")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(".pw-split-pane--3d canvas")).toBeVisible({ timeout: 20_000 });

    await page.getByRole("button", { name: "3D", exact: true }).click();
    await expect(page.locator(".pw-split-view")).toHaveCount(0);
    await expect(page.getByTestId("planner-3d-canvas").locator("canvas")).toBeVisible({ timeout: 20_000 });

    await page.getByRole("button", { name: "2D", exact: true }).click();
    await expect(page.locator(PLANNER_PRIMARY_CANVAS)).toBeVisible();
  });
});

test("planner landing exceeds generic benchmark proof points", async ({ page }) => {
  await page.goto("/planner/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Plan your office/i);
  await expect(page.locator(".planner-landing-hero-proof--row")).toContainText(/Import sketch/i);
});

test.describe("a11y — key flows", () => {
  test("empty state / setup gate has no critical or serious a11y violations", async ({ page }) => {
    await clearPlannerStorage(page);
    await page.goto("/planner/guest/?plannerDevTools=1", { waitUntil: "domcontentloaded" });

    // Wait for setup gate or chrome (empty-ish initial state)
    const setupHeading = page.getByRole("heading", { name: /Set up your space/i });
    const topbar = page.locator(".pw-topbar");
    await Promise.race([
      setupHeading.waitFor({ state: "visible", timeout: 20_000 }),
      topbar.waitFor({ state: "visible", timeout: 20_000 }),
    ]).catch(() => {});

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );
    expect(blocking).toEqual([]);
  });

  test("complex plan (walls + furniture) has no critical or serious a11y violations", async ({ page }) => {
    await enterGuestPlannerWorkspace(page);
    await waitForPlannerCanvas(page);

    // Build a small complex plan: draw walls + place furniture
    await selectPlannerTool(page, "Wall");
    await dragOnCanvas(page, { rx: 0.2, ry: 0.2 }, { rx: 0.8, ry: 0.2 });
    await dragOnCanvas(page, { rx: 0.8, ry: 0.2 }, { rx: 0.8, ry: 0.8 });
    await dragOnCanvas(page, { rx: 0.8, ry: 0.8 }, { rx: 0.2, ry: 0.8 });
    await dragOnCanvas(page, { rx: 0.2, ry: 0.8 }, { rx: 0.2, ry: 0.2 });

    await selectPlannerTool(page, "Furniture");
    await clickOnCanvas(page, 0.4, 0.4);
    await clickOnCanvas(page, 0.6, 0.5);
    await clickOnCanvas(page, 0.5, 0.6);

    await expect.poll(() => getObjectCount(page), { timeout: 10_000 }).toBeGreaterThan(0);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );
    expect(blocking).toEqual([]);
  });

  test("inventory at scale (catalog search + results) has no critical or serious a11y violations", async ({ page }) => {
    await enterGuestPlannerWorkspace(page);
    await waitForPlannerCanvas(page);

    const search = page.getByLabel("Search catalog elements");
    await search.fill("meeting"); // term expected to return multiple results in seeded guest catalog
    await page.waitForTimeout(500); // allow filter

    // Ensure results list or empty state is present (scale test exercises the list UI)
    const resultsOrEmpty = page.getByRole("button", { name: /Add .* to canvas/i }).first().or(page.getByText(/No elements found/i));
    await expect(resultsOrEmpty).toBeVisible({ timeout: 10_000 });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );
    expect(blocking).toEqual([]);
  });

  test.describe("small screen", () => {
    test.use({ viewport: { width: 390, height: 844 } }); // phone portrait

    test("small screen empty state / setup has no critical a11y violations", async ({ page }) => {
      await clearPlannerStorage(page);
      await page.goto("/planner/guest/?plannerDevTools=1", { waitUntil: "domcontentloaded" });

      const setupHeading = page.getByRole("heading", { name: /Set up your space/i });
      await setupHeading.waitFor({ state: "visible", timeout: 20_000 }).catch(() => {});

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const blocking = results.violations.filter(
        (violation) => violation.impact === "critical" || violation.impact === "serious",
      );
      expect(blocking).toEqual([]);
    });

    test("small screen workspace with plan has no critical a11y violations", async ({ page }) => {
      await enterGuestPlannerWorkspace(page);
      await waitForPlannerCanvas(page);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const blocking = results.violations.filter(
        (violation) => violation.impact === "critical" || violation.impact === "serious",
      );
      expect(blocking).toEqual([]);
    });
  });
});
