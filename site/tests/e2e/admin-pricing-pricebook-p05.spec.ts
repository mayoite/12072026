import { expect, test } from "@playwright/test";

test.describe("Admin P05 price book journey", () => {
  test("draft → approve → activate → rollback in admin UI", async ({ page }) => {
    await page.goto("/admin/price-books", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/price-books/);
    await expect(page.getByRole("heading", { name: "Price books" })).toBeVisible();

    await expect(page.locator("code", { hasText: "pb-linear-2026-q3" })).toBeVisible();
    await expect(page.getByText("draft")).toBeVisible();

    await page.getByRole("button", { name: "Approve draft" }).click();
    await expect(page.getByText("approve complete", { exact: false })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("approved")).toBeVisible();

    await page.getByRole("button", { name: "Activate", exact: true }).click();
    await expect(page.getByText("activate complete", { exact: false })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("active")).toBeVisible();

    await page.getByRole("button", { name: "Rollback" }).click();
    await expect(page.getByText("rollback complete", { exact: false })).toBeVisible({
      timeout: 15_000,
    });
  });
});