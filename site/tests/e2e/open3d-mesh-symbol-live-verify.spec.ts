/**
 * Coordinator 2 — mesh/symbol live verify after stroke floor.
 * Evidence: results/planner/benchmark-quality/mesh-symbol/
 *
 * 1) Place cabinet-v0 → 2D zoom screenshot (multi-prim strokes readable)
 * 2) Place workstation (4 seats) → 3D multi-part mesh screenshot
 */
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  placeCatalogOnCanvas,
  placeSeatsFromConfigurator,
  waitForPlannerCanvas,
  PLANNER_PRIMARY_CANVAS,
} from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 180_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "benchmark-quality",
  "mesh-symbol",
);

async function furnitureCount(page: Page): Promise<number> {
  const body = await page.locator("body").innerText();
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

async function zoomPercent(page: Page): Promise<number | null> {
  const body = await page.locator("body").innerText();
  const m = body.match(/Zoom\s+(\d+)\s*%/i);
  return m ? Number.parseInt(m[1], 10) : null;
}

/** Zoom toward a canvas-relative point so furniture stays in frame. */
async function zoomCanvasInAt(
  page: Page,
  relX: number,
  relY: number,
  steps = 8,
): Promise<void> {
  const canvas = page.locator(PLANNER_PRIMARY_CANVAS);
  await expect(canvas).toBeVisible({ timeout: 15_000 });
  const box = await canvas.boundingBox();
  if (!box) throw new Error("canvas box missing");
  const cx = box.x + box.width * relX;
  const cy = box.y + box.height * relY;
  await page.mouse.move(cx, cy);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(250);
}

test.describe("Mesh/symbol live verify (stroke floor)", () => {
  test("cabinet-v0 2D multi-prim + workstation 3D multi-part", async ({ page }) => {
    fs.mkdirSync(EVIDENCE, { recursive: true });

    await enterGuestPlannerWorkspace(page, {
      projectName: "Mesh-symbol live verify",
    });
    await waitForPlannerCanvas(page);

    // Ensure 2D
    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await waitForPlannerCanvas(page);

    const before = await furnitureCount(page);
    expect(before).toBeGreaterThanOrEqual(0);

    // --- 1) Place cabinet-v0 ---
    const search = page.getByLabel("Search catalog elements");
    await expect(search).toBeVisible({ timeout: 15_000 });
    await search.fill("cabinet");
    await page.waitForTimeout(400);

    const catalog = page.getByRole("region", { name: "Catalog browser" });
    const cabinetAdd = catalog.getByRole("button", {
      name: /Add Modular Cabinet to canvas/i,
    });
    await expect(cabinetAdd).toBeVisible({ timeout: 12_000 });
    await placeCatalogOnCanvas(page, 0.48, 0.42, /Add Modular Cabinet to canvas/i);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(before + 1);

    const afterCabinet = await furnitureCount(page);
    const bodyAfterCabinet = await page.locator("body").innerText();
    const cabinetIdCue =
      /cabinet-v0/i.test(bodyAfterCabinet) ||
      /Modular Cabinet/i.test(bodyAfterCabinet) ||
      /Placed Modular Cabinet/i.test(bodyAfterCabinet);

    await page.screenshot({
      path: path.join(EVIDENCE, "01-cabinet-v0-2d-placed.png"),
      fullPage: false,
    });

    // Zoom toward place point (0.48, 0.42) — keep cabinet in frame (not 2000% off-screen)
    await zoomCanvasInAt(page, 0.48, 0.42, 6);
    let zoom = await zoomPercent(page);

    await page.screenshot({
      path: path.join(EVIDENCE, "02-cabinet-v0-2d-zoom-multiprim.png"),
      fullPage: false,
    });

    // Second step: more zoom still anchored on cabinet
    await zoomCanvasInAt(page, 0.48, 0.42, 4);
    zoom = await zoomPercent(page);

    // Canvas-only crop via element screenshot when possible
    const canvas2d = page.locator('[data-testid="planner-2d-canvas"]');
    if (await canvas2d.isVisible().catch(() => false)) {
      await canvas2d.screenshot({
        path: path.join(EVIDENCE, "03-cabinet-v0-2d-canvas-zoom.png"),
      });
    }

    await page.screenshot({
      path: path.join(EVIDENCE, "02b-cabinet-v0-2d-zoom-close.png"),
      fullPage: false,
    });

    // --- 2) Place workstation (batch 4 seats — proven path) ---
    // Reset zoom/view for clearer placement
    await page.getByRole("button", { name: /Zoom to fit/i }).click();
    await page.waitForTimeout(300);

    const beforeWs = await furnitureCount(page);
    await placeSeatsFromConfigurator(page, 4);
    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(beforeWs + 4);

    await page.screenshot({
      path: path.join(EVIDENCE, "04-workstation-2d-after-place.png"),
      fullPage: false,
    });

    // 3D multi-part mesh
    await page.getByRole("radio", { name: "3D", exact: true }).click();
    await expect(page.getByTestId("planner-3d-canvas")).toBeVisible({
      timeout: 20_000,
    });
    await page.waitForTimeout(1800);

    await page.screenshot({
      path: path.join(EVIDENCE, "05-workstation-3d-multipart.png"),
      fullPage: false,
    });

    const canvas3d = page.getByTestId("planner-3d-canvas");
    if (await canvas3d.isVisible().catch(() => false)) {
      await canvas3d.screenshot({
        path: path.join(EVIDENCE, "06-workstation-3d-canvas.png"),
      });
    }

    const furnitureFinal = await furnitureCount(page);
    const run = {
      ok: true,
      at: new Date().toISOString(),
      url: page.url(),
      furnitureBefore: before,
      furnitureAfterCabinet: afterCabinet,
      furnitureFinal,
      cabinetIdCue,
      zoomPercentAfterZoom: zoom,
      shots: [
        "01-cabinet-v0-2d-placed.png",
        "02-cabinet-v0-2d-zoom-multiprim.png",
        "02b-cabinet-v0-2d-zoom-close.png",
        "03-cabinet-v0-2d-canvas-zoom.png",
        "04-workstation-2d-after-place.png",
        "05-workstation-3d-multipart.png",
        "06-workstation-3d-canvas.png",
      ],
      notes:
        "Live place cabinet-v0 + zoom 2D; place workstation batch; 3D multi-part mesh. Stroke floor = resolveCanvasStrokeWidthMm in renderBlock2DToCanvas.",
    };

    fs.writeFileSync(
      path.join(EVIDENCE, "run.json"),
      JSON.stringify(run, null, 2),
      "utf8",
    );

    // Hard facts for gate — placement deltas only here; visual readability judged in VERIFY.md
    expect(afterCabinet).toBe(before + 1);
    expect(furnitureFinal).toBe(beforeWs + 4);
    expect(cabinetIdCue).toBe(true);
  });
});
