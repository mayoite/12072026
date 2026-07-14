import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const EVIDENCE_DIR = path.resolve(
  __dirname,
  "../../../results/admin/production-auth",
);

const ADMIN_ROUTES = [
  { path: "/admin", next: "%2Fadmin" },
  { path: "/admin/catalog", next: "%2Fadmin%2Fcatalog" },
  { path: "/admin/planner-catalog", next: "%2Fadmin%2Fplanner-catalog" },
  { path: "/admin/customer-queries", next: "%2Fadmin%2Fcustomer-queries" },
  { path: "/admin/analytics", next: "%2Fadmin%2Fanalytics" },
  { path: "/admin/svg-editor", next: "%2Fadmin%2Fsvg-editor" },
] as const;

/** When DEV_AUTH_BYPASS=1 the server is intentionally open; unauth gates do not apply. */
const authBypassOn = process.env.DEV_AUTH_BYPASS === "1";

test.describe("admin smoke — unauthenticated gate", () => {
  test.beforeAll(() => {
    mkdirSync(EVIDENCE_DIR, { recursive: true });
    expect(
      authBypassOn,
      "unauth admin smoke requires DEV_AUTH_BYPASS!=1 (bypass disables redirect gates)",
    ).toBe(false);
  });

  for (const route of ADMIN_ROUTES) {
    test(`${route.path} redirects to access with next=`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(new RegExp(`/access/\\?next=${route.next}`));
      await expect(page.getByRole("heading", { level: 2 })).toContainText(
        /Welcome to Oando/i,
      );
      await expect(page.getByText(/Continue as Guest/i)).toBeVisible();
      if (route.path === "/admin/svg-editor") {
        await page.screenshot({
          path: path.join(EVIDENCE_DIR, "admin-svg-editor-rejected.png"),
          fullPage: true,
          caret: "initial",
        });
      }
    });
  }

  test("admin SVG publish API rejects an anonymous request", async ({
    request,
  }) => {
    const response = await request.post("/api/admin/svg-editor", {
      data: { slug: "unauthorized-probe" },
    });
    const body = (await response.json()) as {
      readonly success?: boolean;
      readonly error?: { readonly code?: string };
    };
    const evidence = {
      status: response.status(),
      success: body.success ?? false,
      errorCode: body.error?.code ?? null,
    };
    writeFileSync(
      path.join(EVIDENCE_DIR, "admin-svg-api-rejected.json"),
      `${JSON.stringify(evidence, null, 2)}\n`,
      "utf8",
    );

    // Mutating requests fail at the CSRF gate before session resolution.
    expect(response.status()).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe("INSUFFICIENT_PERMISSIONS");
  });

  test("production ignores the development auth bypass flag", async ({
    request,
  }) => {
    const response = await request.get("/api/dev/auth-bypass-status/");
    const body = (await response.json()) as {
      readonly bypassEnabled?: boolean;
      readonly nodeEnv?: string;
      readonly flagSet?: boolean;
    };
    writeFileSync(
      path.join(EVIDENCE_DIR, "production-bypass-status.json"),
      `${JSON.stringify(body, null, 2)}\n`,
      "utf8",
    );

    expect(response.ok()).toBe(true);
    expect(body.nodeEnv).toBe("production");
    expect(body.bypassEnabled).toBe(false);
  });
});
