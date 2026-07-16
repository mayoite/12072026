import { expect, test } from "@playwright/test";

test.describe("Admin P01 inventory preview", () => {
  test("list shows svg-catalog img for published symbol", async ({ page }) => {
    await page.goto("/admin/svg-editor", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/svg-editor/);

    const row = page.locator('tr[data-slug="side-table-001"]');
    await expect(row).toBeVisible({ timeout: 45_000 });

    const img = row.locator('[data-testid="admin-svg-preview-img"]');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("src", /\/svg-catalog\/side-table-001\.svg/);
  });

  test("descriptor mm footprint aligns with viewBox", async ({ page }) => {
    await page.goto("/admin/svg-editor/desk-linear-1200-001", {
      waitUntil: "domcontentloaded",
    });
    const footprint = page.getByTestId("admin-svg-studio-status-footprint");
    await expect(footprint).toBeVisible({ timeout: 45_000 });
    await expect(footprint).toHaveText(/Footprint 1200×600 mm/);
  });

  test("studio stage is legible at default and zoomed-out viewport", async ({ page }) => {
    await page.goto("/admin/svg-editor/desk-linear-1200-001", {
      waitUntil: "domcontentloaded",
    });
    const stage = page.locator(".svg-studio__stage");
    await expect(stage).toBeVisible({ timeout: 45_000 });

    const fullBox = await stage.boundingBox();
    expect(fullBox?.width ?? 0).toBeGreaterThan(100);
    expect(fullBox?.height ?? 0).toBeGreaterThan(100);

    await page.setViewportSize({ width: 400, height: 300 });
    const zoomedBox = await stage.boundingBox();
    expect(zoomedBox?.width ?? 0).toBeGreaterThan(50);
    await expect(page.getByRole("toolbar", { name: "Canvas tools" })).toBeVisible();
  });
});