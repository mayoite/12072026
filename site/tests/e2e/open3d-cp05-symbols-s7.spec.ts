/**
 * CP-05 browser: cabinet-v0 Block2D place (W2) + S7 inventory published SVG consume.
 * Evidence: results/planner/world-standard-wave/05-symbols-svg/browser/
 */
import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  placeCatalogOnCanvas,
  waitForPlannerCanvas,
  PLANNER_PRIMARY_CANVAS,
} from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 180_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "05-symbols-svg",
  "browser",
);

async function furnitureCount(page: Page): Promise<number> {
  const body = await page.locator("body").innerText();
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

test.describe("CP-05 W2 cabinet-v0 + S7 SVG inventory place", () => {
  test("place cabinet-v0 (Block2D) and place published SVG catalog item", async ({
    page,
  }) => {
    fs.mkdirSync(EVIDENCE, { recursive: true });

    // S7 API: live catalog returns /svg-catalog/*.svg previews
    const api = await page.request.get("/api/planner/catalog/svg-blocks/");
    expect(api.ok()).toBeTruthy();
    const envelope = (await api.json()) as {
      items?: Array<{ slug?: string; assets?: { previewImageUrl?: string } }>;
    };
    const items = envelope.items ?? [];
    expect(items.length).toBeGreaterThan(0);
    const withSvg = items.filter((i) =>
      (i.assets?.previewImageUrl ?? "").includes("/svg-catalog/"),
    );
    expect(withSvg.length).toBeGreaterThan(0);
    fs.writeFileSync(
      path.join(EVIDENCE, "s7-api-svg-blocks.json"),
      `${JSON.stringify({ count: items.length, withSvg: withSvg.length, sample: withSvg[0] }, null, 2)}\n`,
    );

    await enterGuestPlannerWorkspace(page, {
      projectName: "CP-05 symbols S7",
    });
    await waitForPlannerCanvas(page);
    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await waitForPlannerCanvas(page);

    const before = await furnitureCount(page);
    expect(before).toBeGreaterThanOrEqual(0);

    // --- W2: cabinet-v0 Block2D place ---
    const search = page.getByLabel("Search catalog elements");
    await expect(search).toBeVisible({ timeout: 15_000 });
    await search.fill("cabinet");
    const catalog = page.getByRole("region", { name: "Catalog browser" });
    await expect
      .poll(
        async () =>
          catalog.getByRole("button", { name: /Add Modular Cabinet to canvas/i }).count(),
        { timeout: 12_000 },
      )
      .toBeGreaterThan(0);

    await placeCatalogOnCanvas(page, 0.48, 0.42, /Add Modular Cabinet to canvas/i);
    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(before + 1);

    await page.screenshot({
      path: path.join(EVIDENCE, "01-cabinet-v0-placed.png"),
      fullPage: false,
    });
    const canvas = page.locator(PLANNER_PRIMARY_CANVAS);
    await canvas.screenshot({
      path: path.join(EVIDENCE, "02-cabinet-v0-canvas.png"),
    });

    // --- S7: inventory published SVG preview + place ---
    await search.fill("chaise");
    await expect
      .poll(
        async () => {
          const imgs = catalog.locator('img[src*="/svg-catalog/"]');
          return imgs.count();
        },
        { timeout: 15_000 },
      )
      .toBeGreaterThan(0);

    const svgThumb = catalog.locator('img[src*="/svg-catalog/"]').first();
    await expect(svgThumb).toBeVisible({ timeout: 10_000 });
    const thumbSrc = await svgThumb.getAttribute("src");
    expect(thumbSrc).toMatch(/\/svg-catalog\/.+\.svg/i);

    await page.screenshot({
      path: path.join(EVIDENCE, "03-inventory-svg-preview.png"),
      fullPage: false,
    });

    const mid = await furnitureCount(page);
    // Prefer explicit chaise add button if present
    const chaiseAdd = catalog.getByRole("button", {
      name: /Add .*[Cc]haise.* to canvas|Add Chaise Lounge to canvas/i,
    });
    if ((await chaiseAdd.count()) > 0) {
      await placeCatalogOnCanvas(page, 0.58, 0.52, /Add .*[Cc]haise|Add Chaise Lounge/i);
    } else {
      // Fallback: first Add to canvas in filtered list
      await placeCatalogOnCanvas(page, 0.58, 0.52, /Add .* to canvas/i);
    }

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBeGreaterThan(mid);

    await page.screenshot({
      path: path.join(EVIDENCE, "04-svg-catalog-item-placed.png"),
      fullPage: false,
    });

    fs.writeFileSync(
      path.join(EVIDENCE, "run.json"),
      `${JSON.stringify(
        {
          phase: "P05",
          gate: "CP-05-browser",
          date: new Date().toISOString(),
          s7ApiSvgItems: withSvg.length,
          inventoryThumbSrc: thumbSrc,
          furnitureBefore: before,
          furnitureAfter: await furnitureCount(page),
          status: "pass",
        },
        null,
        2,
      )}\n`,
    );
  });
});
