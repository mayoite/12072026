/**
 * P0.1 — Admin SVG publish E2E (dev auth bypass).
 *
 * Requires server env:
 *   DEV_AUTH_BYPASS=1
 *   Playwright dev server
 *
 * Proves the browser exposes the publish journey and the real compiler/persist
 * path publishes only inside a temporary workspace.
 */
import { expect, test } from "@playwright/test";
import { existsSync, statSync } from "node:fs";
import {
  canonicalSvgPaths,
  createIsolatedAdminSvgWorkspace,
  sha256File,
} from "./helpers/isolatedAdminSvgPublish";

const SLUG = "side-table-001";

test.describe("P0.1 admin SVG publish (dev auth bypass)", () => {
  test("keeps the browser journey read-only and publishes into temporary paths", async ({
    page,
  }) => {
    const canonical = canonicalSvgPaths(SLUG);
    expect(existsSync(canonical.descriptor)).toBe(true);
    expect(existsSync(canonical.svg)).toBe(true);
    const descriptorHashBefore = sha256File(canonical.descriptor);
    const svgHashBefore = sha256File(canonical.svg);
    const workspace = createIsolatedAdminSvgWorkspace(SLUG);

    try {
      await page.goto("/admin/svg-editor", { waitUntil: "domcontentloaded" });
      await expect(page).not.toHaveURL(/\/access\//);
      const row = page.locator(`tr[data-slug="${SLUG}"]`);
      const editLink = row.getByRole("link", { name: "Edit", exact: true });
      await expect(editLink).toHaveAttribute("href", `/admin/svg-editor/${SLUG}/`);
      const editHref = await editLink.getAttribute("href");
      expect(editHref).not.toBeNull();
      await page.goto(editHref ?? `/admin/svg-editor/${SLUG}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page).toHaveURL(new RegExp(`/admin/svg-editor/${SLUG}`));
      await expect(page.getByRole("button", { name: "Publish", exact: true })).toBeVisible();

      const beforeBytes = statSync(workspace.svgPath).size;
      const result = await workspace.publish(workspace.load());
      expect(result).toMatchObject({ success: true });
      expect(statSync(workspace.svgPath).size).toBeGreaterThan(100);
      expect(statSync(workspace.svgPath).size).toBeGreaterThanOrEqual(beforeBytes);
    } finally {
      workspace.cleanup();
      expect(sha256File(canonical.descriptor)).toBe(descriptorHashBefore);
      expect(sha256File(canonical.svg)).toBe(svgHashBefore);
    }
  });
});
