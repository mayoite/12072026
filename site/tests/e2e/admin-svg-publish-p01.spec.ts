/**
 * P0.1 — Admin SVG publish E2E (dev auth bypass).
 *
 * Requires server env:
 *   DEV_AUTH_BYPASS=1
 *   Playwright dev server
 *
 * Proves: list → editor → click Publish → HTTP 200 → visible success → SVG on disk.
 * Screenshots under results/planner/p0-1-admin-svg-publish/
 */
import { expect, test } from "@playwright/test";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const SITE_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const EVIDENCE_DIR = path.join(
  REPO_ROOT,
  "results",
  "planner",
  "p0-1-admin-svg-publish",
);
const DESCRIPTOR_PATH = path.join(
  SITE_ROOT,
  "block-descriptors",
  "side-table-001.json",
);
const SVG_OUT = path.join(
  SITE_ROOT,
  "public",
  "svg-catalog",
  "side-table-001.svg",
);

test.describe("P0.1 admin SVG publish (dev auth bypass)", () => {
  test.beforeAll(() => {
    mkdirSync(EVIDENCE_DIR, { recursive: true });
  });

  test("publishes from the list through the real admin UI", async ({
    page,
  }) => {
    test.skip(
      !existsSync(DESCRIPTOR_PATH),
      "side-table-001.json missing from block-descriptors",
    );

    await page.goto("/admin/svg-editor", {
      waitUntil: "domcontentloaded",
    });
    await expect(page).not.toHaveURL(/\/access\//);
    await expect(page).toHaveURL(/\/admin\/svg-editor/);
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "01-list.png"),
      fullPage: true,
      caret: "initial",
    });
    await page
      .getByRole("link", { name: "side-table-001", exact: true })
      .click();
    await expect(page).toHaveURL(/\/admin\/svg-editor\/side-table-001/);
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "02-editor-before-publish.png"),
      fullPage: true,
      caret: "initial",
    });
    await expect(page).not.toHaveURL(/\/access\//);

    const beforeBytes = existsSync(SVG_OUT) ? statSync(SVG_OUT).size : 0;

    const [response] = await Promise.all([
      page.waitForResponse(
        (candidate) =>
          candidate.request().method() === "POST" &&
          candidate.url().includes("/admin/svg-editor/side-table-001"),
      ),
      page.getByRole("button", { name: "Publish", exact: true }).click(),
    ]);

    await expect(page.getByRole("status")).toContainText(
      "Published “side-table-001” → /svg-catalog/side-table-001.svg",
    );

    const evidence = {
      journey: "list -> editor -> Publish button -> server action -> artifact",
      status: response.status(),
      success: response.ok(),
      slug: "side-table-001",
      beforeBytes,
    };
    writeFileSync(
      path.join(EVIDENCE_DIR, "03-api-publish.json"),
      `${JSON.stringify(evidence, null, 2)}\n`,
      "utf8",
    );

    expect(response.ok(), `publish failed: ${response.status()}`).toBe(true);

    expect(existsSync(SVG_OUT)).toBe(true);
    const afterBytes = statSync(SVG_OUT).size;
    expect(afterBytes).toBeGreaterThan(100);

    writeFileSync(
      path.join(EVIDENCE_DIR, "04-svg-bytes.json"),
      `${JSON.stringify({ beforeBytes, afterBytes, path: SVG_OUT }, null, 2)}\n`,
      "utf8",
    );

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "05-editor-after-publish.png"),
      fullPage: true,
      caret: "initial",
    });
  });
});
