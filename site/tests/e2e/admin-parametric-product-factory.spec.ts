import { createHash } from "node:crypto";

import { expect, test } from "@playwright/test";

import { publishDeskAssemblyFromAdmin } from "./helpers/parametricFactoryJourney";

test.describe("Admin parametric product factory", () => {
  test.describe.configure({ timeout: 120_000 });

  test("desktop 1280 publishes an isolated exact assembly", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    const pageErrors: string[] = [];
    const requestFailures: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => {
      const reason = request.failure()?.errorText ?? "failed";
      if (reason !== "net::ERR_ABORTED") {
        requestFailures.push(`${reason} ${request.url()}`);
      }
    });

    await page.goto("/admin/svg-editor?new=desk-assembly", {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveURL(/\/admin\/svg-editor\?new=desk-assembly/);
    const tools = page.getByTestId("admin-svg-dock-panel-tools");
    const properties = page.getByTestId("admin-svg-dock-panel-properties");
    const canvas = page.getByTestId("admin-svg-dock-panel-canvas");
    await expect(tools).toBeVisible();
    await expect(properties).toBeVisible();
    await expect(canvas).toBeVisible();
    const [toolsBox, propertiesBox, canvasBox] = await Promise.all([
      tools.boundingBox(),
      properties.boundingBox(),
      canvas.boundingBox(),
    ]);
    expect(toolsBox?.width).toBeGreaterThanOrEqual(200);
    expect(toolsBox?.width).toBeLessThanOrEqual(220);
    expect(propertiesBox?.width).toBeGreaterThanOrEqual(235);
    expect(propertiesBox?.width).toBeLessThanOrEqual(270);
    expect(canvasBox?.width).toBeGreaterThan(700);
    expect(toolsBox!.x).toBeLessThan(propertiesBox!.x);
    expect(propertiesBox!.x).toBeLessThan(canvasBox!.x);
    for (const tile of await page.locator('[data-testid^="canvas-tool-"]').all()) {
      const box = await tile.boundingBox();
      if (box?.width === toolsBox?.width) continue;
      expect(box?.width).toBe(56);
      expect(box?.height).toBe(56);
    }
    for (const control of await page
      .getByRole("button", { name: /Zoom out|Zoom in|Fit plan|Grid|Publish/ })
      .all()) {
      const box = await control.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    }

    await page.getByTestId("canvas-tool-grid").click();
    await expect(page.getByTestId("parametric-plan-svg")).toHaveAttribute(
      "data-grid",
      "true",
    );
    await page.getByRole("button", { name: "Zoom in" }).click();
    await expect(page.getByTestId("parametric-zoom-status")).toHaveText("110%");
    await page.getByTestId("canvas-tool-fit").click();
    await expect(page.getByTestId("parametric-zoom-status")).toHaveText("100%");

    const artifact = await publishDeskAssemblyFromAdmin(page);
    const catalogResponse = await page.request.get(
      "/api/planner/catalog/svg-blocks/",
    );
    expect(catalogResponse.ok()).toBe(true);
    const catalog = (await catalogResponse.json()) as {
      items?: Array<{
        slug: string;
        sku?: string;
        assets?: { previewImageUrl?: string };
      }>;
    };
    expect(catalog.items).toContainEqual(
      expect.objectContaining({
        slug: artifact.slug,
        sku: artifact.sku,
        assets: expect.objectContaining({ previewImageUrl: artifact.previewUrl }),
      }),
    );
    const previewResponse = await page.request.get(artifact.previewUrl);
    expect(previewResponse.ok()).toBe(true);
    expect(
      createHash("sha256")
        .update(Buffer.from(await previewResponse.body()))
        .digest("hex"),
    ).toBe(artifact.svgChecksum);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(requestFailures).toEqual([]);
  });

  test("phone authoring blocked at 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/svg-editor?new=desk-assembly", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByText(/SVG studio authoring is unsupported on phone/i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Publish", exact: true })).toBeHidden();
    await expect(page.getByLabel("SVG studio dock")).toBeHidden();
  });
});
