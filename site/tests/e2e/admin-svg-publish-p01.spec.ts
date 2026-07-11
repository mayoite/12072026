/**
 * P0.1 — Admin SVG publish E2E (dev auth bypass).
 *
 * Requires server env:
 *   DEV_AUTH_BYPASS=1
 *   Playwright dev server
 *
 * Proves: open admin svg-editor → POST publish → success + SVG on disk.
 * Screenshots under results/planner/p0-1-admin-svg-publish/
 */
import { expect, test } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
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

  test("opens svg-editor without access redirect when bypass is on", async ({
    page,
  }) => {
    await page.goto("/admin/svg-editor", { waitUntil: "domcontentloaded" });
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "01-list.png"),
      fullPage: true,
    });

    // Must not bounce to /access/
    await expect(page).not.toHaveURL(/\/access\//);
    await expect(page).toHaveURL(/\/admin\/svg-editor/);
  });

  test("opens side-table editor and publishes via API POST", async ({
    page,
    request,
  }) => {
    test.skip(
      !existsSync(DESCRIPTOR_PATH),
      "side-table-001.json missing from block-descriptors",
    );

    await page.goto("/admin/svg-editor/side-table-001", {
      waitUntil: "domcontentloaded",
    });
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "02-editor-before-publish.png"),
      fullPage: true,
    });
    await expect(page).not.toHaveURL(/\/access\//);

    const descriptor = JSON.parse(
      readFileSync(DESCRIPTOR_PATH, "utf8"),
    ) as Record<string, unknown>;

    const beforeBytes = existsSync(SVG_OUT) ? statSync(SVG_OUT).size : 0;

    const response = await request.post("/api/admin/svg-editor", {
      data: descriptor,
      headers: { "content-type": "application/json" },
    });

    const body = (await response.json().catch(() => null)) as {
      success?: boolean;
      error?: { message?: string; code?: string };
      descriptor?: { slug?: string };
    } | null;

    const evidence = {
      status: response.status(),
      success: body?.success,
      error: body?.error ?? null,
      slug: body?.descriptor?.slug ?? null,
      beforeBytes,
    };
    // write evidence json via page.evaluate not needed — use fs in node
    const { writeFileSync } = await import("node:fs");
    writeFileSync(
      path.join(EVIDENCE_DIR, "03-api-publish.json"),
      `${JSON.stringify(evidence, null, 2)}\n`,
      "utf8",
    );

    expect(
      response.ok(),
      `publish failed: ${response.status()} ${JSON.stringify(body?.error)}`,
    ).toBe(true);
    expect(body?.success).toBe(true);
    expect(body?.descriptor?.slug).toBe("side-table-001");

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
    });
  });
});
