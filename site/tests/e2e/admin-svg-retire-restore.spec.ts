/**
 * E2E: Admin SVG editor retire → restore → buyer catalog lifecycle.
 *
 * Verifies:
 *   1. Admin inventory shows retire button for a live product.
 *   2. Clicking retire removes it from the buyer-facing SVG blocks API.
 *   3. Admin inventory shows restore button after retirement.
 *   4. Clicking restore returns it to the buyer-facing catalog.
 *
 * Uses DEV_AUTH_BYPASS=1 (admin auth bypass in dev mode).
 */

import { expect, test } from "@playwright/test";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import { waitForPlannerCatalogReady } from "./plannerCanvasHelpers";

const SLUG = "side-table-001";
const ADMIN_SVG_EDITOR = "/admin/svg-editor";
const SVG_BLOCKS_API = "/api/planner/catalog/svg-blocks";

test.describe("Admin SVG retire → restore lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin SVG editor inventory and wait for the table
    await page.goto(ADMIN_SVG_EDITOR, { waitUntil: "domcontentloaded" });
    await expect(page).not.toHaveURL(/\/access\//);
    await expect(
      page.getByTestId("admin-svg-primary-journey"),
    ).toBeVisible({ timeout: 45_000 });
  });

  test("retire side-table-001, verify hidden from buyer catalog, then restore", async ({
    page,
    request,
  }) => {
    // ── 1. Locate the product row ────────────────────────────────────
    const row = page.locator(`tr[data-slug="${SLUG}"]`);
    await expect(row).toBeVisible({ timeout: 30_000 });
    await expect(row).toHaveAttribute("data-lifecycle", "live");

    // ── 2. Verify product IS in the buyer-facing catalog ──────────────
    const beforeResponse = await request.get(SVG_BLOCKS_API);
    const beforeBody = await beforeResponse.json();
    const beforeSlugs = (beforeBody.items ?? []).map(
      (i: { slug: string }) => i.slug,
    );
    expect(beforeSlugs).toContain(SLUG);

    // ── 3. Click Retire ──────────────────────────────────────────────
    const retireButton = page.getByTestId(`admin-svg-retire-${SLUG}`);
    await expect(retireButton).toBeVisible();
    await retireButton.click();

    // The admin list page calls window.location.reload() after the PATCH.
    // Wait for the page to reload and the retired state to appear.
    await expect(row).toHaveAttribute("data-lifecycle", "retired", {
      timeout: 15_000,
    });

    // ── 4. Verify product is REMOVED from buyer-facing catalog ───────
    const afterRetireResponse = await request.get(SVG_BLOCKS_API);
    const afterRetireBody = await afterRetireResponse.json();
    const afterRetireSlugs = (afterRetireBody.items ?? []).map(
      (i: { slug: string }) => i.slug,
    );
    expect(afterRetireSlugs).not.toContain(SLUG);

    // ── 4b. Planner canvas catalog must not offer retired placement ───
    await enterGuestPlannerWorkspace(page);
    await waitForPlannerCatalogReady(page);
    const catalogSearch = page.getByLabel("Search catalog elements");
    await expect(catalogSearch).toBeVisible({ timeout: 45_000 });
    await catalogSearch.fill("side-table");
    const catalog = page.getByRole("region", { name: "Catalog browser" });
    await expect(
      catalog.getByRole("button", {
        name: /Place — Add Side Table|Add Side Table to canvas/i,
      }),
    ).toHaveCount(0, { timeout: 15_000 });

    await page.goto(ADMIN_SVG_EDITOR, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("admin-svg-primary-journey")).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.locator(`tr[data-slug="${SLUG}"]`)).toHaveAttribute(
      "data-lifecycle",
      "retired",
    );

    // ── 5. Verify the row now shows the Restore button ───────────────
    const restoreButton = page.getByTestId(`admin-svg-restore-${SLUG}`);
    await expect(restoreButton).toBeVisible();

    // ── 6. Click Restore ─────────────────────────────────────────────
    await restoreButton.click();
    await expect(row).toHaveAttribute("data-lifecycle", "live", {
      timeout: 15_000,
    });

    // ── 7. Verify product is BACK in the buyer-facing catalog ─────────
    const afterRestoreResponse = await request.get(SVG_BLOCKS_API);
    const afterRestoreBody = await afterRestoreResponse.json();
    const afterRestoreSlugs = (afterRestoreBody.items ?? []).map(
      (i: { slug: string }) => i.slug,
    );
    expect(afterRestoreSlugs).toContain(SLUG);
  });
});
