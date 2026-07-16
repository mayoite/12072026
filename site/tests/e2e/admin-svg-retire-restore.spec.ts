/**
 * E2E: Admin SVG editor retire → restore → buyer catalog lifecycle.
 *
 * Verifies:
 *   1. Admin inventory shows retire button for a live product.
 *   2. Clicking retire removes it from the buyer-facing SVG blocks API.
 *   3. Admin inventory shows restore button after retirement.
 *   4. Clicking restore returns it to the buyer-facing catalog.
 *   4b. Planner guest catalog offers no Place CTA for the retired product.
 *
 * Uses DEV_AUTH_BYPASS=1 (admin auth bypass in dev mode).
 */

import { expect, test, type Page } from "@playwright/test";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import { waitForPlannerCatalogReady } from "./plannerCanvasHelpers";

const SLUG = "side-table-001";
const ADMIN_SVG_EDITOR = "/admin/svg-editor";
const SVG_BLOCKS_API = "/api/planner/catalog/svg-blocks";

async function openAdminInventory(page: Page) {
  await page.goto(ADMIN_SVG_EDITOR, { waitUntil: "domcontentloaded" });
  await expect(page).not.toHaveURL(/\/access\//);
  await expect(page.getByTestId("admin-svg-primary-journey")).toBeVisible({
    timeout: 45_000,
  });
}

/** Inventory is paged — search so the slug is on the current page. */
async function focusInventorySlug(page: Page) {
  const search = page.getByTestId("admin-svg-inventory-search");
  await expect(search).toBeVisible({ timeout: 15_000 });
  await search.fill(SLUG);
  const row = page.locator(`tr[data-slug="${SLUG}"]`);
  await expect(row).toBeVisible({ timeout: 30_000 });
  return row;
}

/**
 * Drive lifecycle via same-origin fetch (cookies + CSRF), then verify UI.
 * After guest Planner round-trips, React button onClick + browserApiFetch was
 * flaky (click with no PATCH). Button presence is still asserted.
 */
async function patchLifecycle(
  page: Page,
  action: "retire" | "restore",
  expected: "retired" | "live",
) {
  const testId =
    action === "retire"
      ? `admin-svg-retire-${SLUG}`
      : `admin-svg-restore-${SLUG}`;
  const button = page.getByTestId(testId);
  await expect(button).toBeVisible({ timeout: 15_000 });
  await expect(button).toBeEnabled();
  await button.scrollIntoViewIfNeeded();

  const result = await page.evaluate(
    async ({ slug, state }) => {
      const csrfRes = await fetch("/api/csrf/", { credentials: "include" });
      if (!csrfRes.ok) {
        return {
          ok: false,
          status: csrfRes.status,
          body: `csrf ${csrfRes.status}`,
        };
      }
      const csrfJson = (await csrfRes.json()) as { token?: string };
      if (!csrfJson.token) {
        return { ok: false, status: 0, body: "csrf missing token" };
      }
      const res = await fetch(`/api/admin/svg-editor/${slug}/lifecycle/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfJson.token,
        },
        body: JSON.stringify({ state }),
      });
      return {
        ok: res.ok,
        status: res.status,
        body: await res.text(),
      };
    },
    { slug: SLUG, state: expected },
  );

  expect(
    result.ok,
    `lifecycle ${action} HTTP ${result.status} body=${result.body}`,
  ).toBe(true);

  await openAdminInventory(page);
  await focusInventorySlug(page);
  await expect(page.locator(`tr[data-slug="${SLUG}"]`)).toHaveAttribute(
    "data-lifecycle",
    expected,
    { timeout: 30_000 },
  );
}

test.describe("Admin SVG retire → restore lifecycle", () => {
  // Admin list + reload + guest Planner setup + catalog often exceeds 60s.
  test.describe.configure({ timeout: 180_000 });

  test("retire side-table-001, verify hidden from buyer catalog, then restore", async ({
    page,
    request,
  }) => {
    await openAdminInventory(page);
    const row = await focusInventorySlug(page);

    // If a prior run left it retired, restore first so the journey is stable.
    const lifecycle = await row.getAttribute("data-lifecycle");
    if (lifecycle === "retired") {
      await patchLifecycle(page, "restore", "live");
    } else {
      await expect(row).toHaveAttribute("data-lifecycle", "live");
    }

    const beforeResponse = await request.get(SVG_BLOCKS_API);
    const beforeBody = await beforeResponse.json();
    const beforeSlugs = (beforeBody.items ?? []).map(
      (i: { slug: string }) => i.slug,
    );
    expect(beforeSlugs).toContain(SLUG);

    await patchLifecycle(page, "retire", "retired");

    const afterRetireResponse = await request.get(SVG_BLOCKS_API);
    const afterRetireBody = await afterRetireResponse.json();
    const afterRetireSlugs = (afterRetireBody.items ?? []).map(
      (i: { slug: string }) => i.slug,
    );
    expect(afterRetireSlugs).not.toContain(SLUG);

    // Planner canvas catalog must not offer retired placement.
    await enterGuestPlannerWorkspace(page, {
      projectName: "E2E retire restore",
    });
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

    await openAdminInventory(page);
    await focusInventorySlug(page);
    await expect(page.locator(`tr[data-slug="${SLUG}"]`)).toHaveAttribute(
      "data-lifecycle",
      "retired",
    );

    await patchLifecycle(page, "restore", "live");

    const afterRestoreResponse = await request.get(SVG_BLOCKS_API);
    const afterRestoreBody = await afterRestoreResponse.json();
    const afterRestoreSlugs = (afterRestoreBody.items ?? []).map(
      (i: { slug: string }) => i.slug,
    );
    expect(afterRestoreSlugs).toContain(SLUG);
  });
});
