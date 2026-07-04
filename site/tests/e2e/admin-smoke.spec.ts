import { expect, test } from "@playwright/test";

const ADMIN_ROUTES = [
  { path: "/admin", next: "%2Fadmin" },
  { path: "/admin/catalog", next: "%2Fadmin%2Fcatalog" },
  { path: "/admin/planner-catalog", next: "%2Fadmin%2Fplanner-catalog" },
  { path: "/admin/customer-queries", next: "%2Fadmin%2Fcustomer-queries" },
  { path: "/admin/analytics", next: "%2Fadmin%2Fanalytics" },
] as const;

test.describe("admin smoke — unauthenticated gate", () => {
  for (const route of ADMIN_ROUTES) {
    test(`${route.path} redirects to access with next=`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(new RegExp(`/access/\\?next=${route.next}`));
      await expect(page.getByRole("heading", { level: 2 })).toContainText(/Welcome to Oando/i);
      await expect(page.getByText(/Continue as Guest/i)).toBeVisible();
    });
  }
});
