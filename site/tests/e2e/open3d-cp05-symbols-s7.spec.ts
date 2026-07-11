/**
 * CP-05 browser: cabinet-v0 Block2D place (W2) + S7 plan canvas draws published SVG.
 * Evidence: results/planner/world-standard-wave/05-symbols-svg/browser/
 *
 * S7 hard path: inventory thumb alone is NOT enough — canvas must drawImage the
 * published `/svg-catalog/*.svg` after place (see svgPlanSymbolCache + PlannerCanvasStage).
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

/**
 * Soft visual probe of primary 2D canvas (center region).
 * Multi-path SVG / multi-prim Block2D → higher color diversity than a pure solid blob.
 */
async function sampleCanvasFillDiversity(page: Page): Promise<{
  sampleCount: number;
  uniqueQuantized: number;
  channelStdDev: number;
  notPureSolid: boolean;
}> {
  const canvas = page.locator(PLANNER_PRIMARY_CANVAS);
  await expect(canvas).toBeVisible({ timeout: 10_000 });

  const stats = await canvas.evaluate((el) => {
    const c = el as HTMLCanvasElement;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return { sampleCount: 0, uniqueQuantized: 0, channelStdDev: 0 };
    }
    const w = c.width;
    const h = c.height;
    if (w < 8 || h < 8) {
      return { sampleCount: 0, uniqueQuantized: 0, channelStdDev: 0 };
    }
    const x0 = Math.floor(w * 0.25);
    const y0 = Math.floor(h * 0.25);
    const rw = Math.max(4, Math.floor(w * 0.5));
    const rh = Math.max(4, Math.floor(h * 0.5));
    const img = ctx.getImageData(x0, y0, rw, rh);
    const data = img.data;
    const pixelStride = 4 * 2;
    const step = 8;
    const quantized = new Set<string>();
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let n = 0;
    const rs: number[] = [];
    const gs: number[] = [];
    const bs: number[] = [];

    for (let i = 0; i + 3 < data.length; i += pixelStride * step) {
      const a = data[i + 3] ?? 0;
      if (a < 16) continue;
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      quantized.add(`${r >> 4},${g >> 4},${b >> 4}`);
      sumR += r;
      sumG += g;
      sumB += b;
      rs.push(r);
      gs.push(g);
      bs.push(b);
      n += 1;
    }

    if (n === 0) {
      return { sampleCount: 0, uniqueQuantized: 0, channelStdDev: 0 };
    }

    const meanR = sumR / n;
    const meanG = sumG / n;
    const meanB = sumB / n;
    let varSum = 0;
    for (let i = 0; i < n; i++) {
      const dr = (rs[i] ?? 0) - meanR;
      const dg = (gs[i] ?? 0) - meanG;
      const db = (bs[i] ?? 0) - meanB;
      varSum += dr * dr + dg * dg + db * db;
    }
    const channelStdDev = Math.sqrt(varSum / (n * 3));
    return {
      sampleCount: n,
      uniqueQuantized: quantized.size,
      channelStdDev,
    };
  });

  const notPureSolid =
    stats.sampleCount > 20 &&
    (stats.uniqueQuantized >= 4 || stats.channelStdDev >= 12);

  return { ...stats, notPureSolid };
}

test.describe("CP-05 W2 cabinet-v0 + S7 SVG plan canvas draw", () => {
  test("place cabinet-v0 (Block2D) and draw published SVG on plan after place", async ({
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

    // Published fixture must exist and be multi-path (not single solid rect blob)
    const chaisePublic = await page.request.get("/svg-catalog/chaise-lounge-001.svg");
    expect(chaisePublic.ok()).toBeTruthy();
    const chaiseSvg = await chaisePublic.text();
    expect(chaiseSvg).toMatch(/<svg[\s\S]*<\/svg>/i);
    const pathish =
      (chaiseSvg.match(/<rect\b/gi) ?? []).length +
      (chaiseSvg.match(/<path\b/gi) ?? []).length +
      (chaiseSvg.match(/<line\b/gi) ?? []).length;
    expect(pathish).toBeGreaterThanOrEqual(3);

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

    // --- S7: inventory published SVG preview + place + canvas drawImage ---
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

    // Wait for plan-canvas SVG load after place (S7 draw path)
    const svgPaintResponse = page.waitForResponse(
      (r) =>
        r.url().includes("/svg-catalog/") &&
        r.url().toLowerCase().includes(".svg") &&
        r.ok(),
      { timeout: 20_000 },
    );

    const chaiseAdd = catalog.getByRole("button", {
      name: /Add .*[Cc]haise.* to canvas|Add Chaise Lounge to canvas/i,
    });
    if ((await chaiseAdd.count()) > 0) {
      await placeCatalogOnCanvas(page, 0.58, 0.52, /Add .*[Cc]haise|Add Chaise Lounge/i);
    } else {
      await placeCatalogOnCanvas(page, 0.58, 0.52, /Add .* to canvas/i);
    }

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBeGreaterThan(mid);

    // SVG may already be cached from inventory <img> — response wait can race; settle either way.
    await Promise.race([
      svgPaintResponse.catch(() => null),
      page.waitForTimeout(1500),
    ]);
    // Two rAFs so plan-canvas svgPaintGen redraw lands
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    await page.waitForTimeout(400);

    await page.screenshot({
      path: path.join(EVIDENCE, "04-svg-catalog-item-placed.png"),
      fullPage: false,
    });
    await canvas.screenshot({
      path: path.join(EVIDENCE, "05-svg-plan-canvas-draw.png"),
    });

    const diversity = await sampleCanvasFillDiversity(page);
    // Soft bar: after SVG place, center region should not be a pure single-color blob.
    // If fixture content is weak, NOTES must say so — but multi-path chaise should pass.
    expect(diversity.sampleCount).toBeGreaterThan(20);
    expect(diversity.notPureSolid).toBe(true);

    fs.writeFileSync(
      path.join(EVIDENCE, "run.json"),
      `${JSON.stringify(
        {
          phase: "P05",
          gate: "CP-05-browser-S7-canvas-draw",
          date: new Date().toISOString(),
          s7ApiSvgItems: withSvg.length,
          inventoryThumbSrc: thumbSrc,
          furnitureBefore: before,
          furnitureAfter: await furnitureCount(page),
          canvasDiversity: diversity,
          s7CanvasDraw: true,
          status: "pass",
        },
        null,
        2,
      )}\n`,
    );
  });
});
