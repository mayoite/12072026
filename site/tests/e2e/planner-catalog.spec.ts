import { expect, test } from "@playwright/test";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";

test.describe("planner catalog panel", () => {
  test("desktop rail, catalog, and canvas do not overlap", async ({ page }) => {
    await enterGuestPlannerWorkspace(page);

    const rail = page.locator(".pw-tool-rail");
    const catalog = page.locator("aside.pw-left-panel");
    const canvas = page.locator(".pw-canvas-surface");

    await expect(rail).toBeVisible();
    await expect(catalog).toBeVisible();
    await expect(canvas).toBeVisible();

    const railBox = await rail.boundingBox();
    const catalogBox = await catalog.boundingBox();
    const canvasBox = await canvas.boundingBox();

    expect(railBox).not.toBeNull();
    expect(catalogBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();

    expect(catalogBox!.x + catalogBox!.width).toBeLessThanOrEqual(railBox!.x + 4);
    expect(railBox!.x + railBox!.width).toBeLessThanOrEqual(canvasBox!.x + 4);
  });

  test("guest workspace exposes searchable catalog", async ({ page }) => {
    await enterGuestPlannerWorkspace(page);

    // Wait for catalog to be hydrated (check for any visible catalog item)
    await expect(
      page.locator('.pw-catalog-card, [data-catalog-item], .catalog-panel .pw-catalog-panel__item').first(),
    ).toBeVisible({ timeout: 15_000 });

    const search = page.getByLabel("Search catalog elements");
    await expect(search).toBeVisible();

    // Search for "meeting" which exists in the static curated catalog
    await search.fill("meeting");

    // Look within the catalog browser region for the add button
    await expect(
      page
        .getByRole("region", { name: "Catalog browser" })
        .getByRole("button", { name: /Add .* to canvas/i })
        .first(),
    ).toBeVisible({
      timeout: 15_000,
    });
  });
});
