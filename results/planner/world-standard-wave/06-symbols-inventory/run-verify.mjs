/**
 * P06 Symbols inventory slice — guest planner browser verification.
 * Evidence: results/planner/world-standard-wave/06-symbols-inventory/
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVIDENCE = __dirname;
const BASE = "http://127.0.0.1:3000";
const URL = `${BASE}/planner/guest/?plannerDevTools=1`;

async function furnitureCount(page) {
  const text = await page
    .locator(".pw-status-bar > span")
    .filter({ hasText: /^\d+ furniture$/ })
    .textContent()
    .catch(() => null);
  const match = text?.match(/^(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

async function clickOnCanvas(page, relX, relY) {
  const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
  await canvas.waitFor({ state: "visible", timeout: 25_000 });
  const box = await canvas.boundingBox();
  if (!box) throw new Error("canvas box missing");
  const x = box.x + box.width * relX;
  const y = box.y + box.height * relY;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 2, y + 2, { steps: 2 });
  await page.mouse.up();
}

async function placeCatalogItem(page, buttonName, relX, relY) {
  const catalog = page.getByRole("region", { name: "Catalog browser" });
  const btn = catalog.getByRole("button", { name: buttonName }).first();
  await btn.waitFor({ state: "visible", timeout: 15_000 });
  await btn.scrollIntoViewIfNeeded();
  await btn.evaluate((el) => el.click());
  await page.waitForTimeout(200);
  await clickOnCanvas(page, relX, relY);
}

async function enterGuestWorkspace(page) {
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const setup = page.getByRole("heading", { name: /Set up your space/i });
  try {
    if (await setup.isVisible({ timeout: 8_000 })) {
      await page.getByLabel("Project name").fill("P06 symbols inventory");
      await page.getByRole("button", { name: /Start placing furniture/i }).click();
    }
  } catch {
    /* workspace ready */
  }
  const scratch = page.getByRole("button", { name: /Start from Scratch/i });
  if (await scratch.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await scratch.click();
  }
  await page.locator(".pw-topbar").waitFor({ state: "visible", timeout: 25_000 });
}

async function ensureInventoryVisible(page) {
  const search = page.getByLabel("Search catalog elements");
  if (await search.isVisible({ timeout: 3_000 }).catch(() => false)) return;
  const toggle = page.getByRole("button", { name: "Toggle inventory panel" });
  if (await toggle.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await toggle.click();
  }
  await search.waitFor({ state: "visible", timeout: 15_000 });
}

async function main() {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  const checks = {
    devServer: false,
    apiFiveDescriptors: false,
    apiHasChaise: false,
    apiHasDesk: false,
    symbolsCategoryVisible: false,
    svgCatalogSubcategoryVisible: false,
    inventoryNotEmpty: false,
    chaiseVisible: false,
    deskVisible: false,
    chaisePlaced: false,
    deskPlaced: false,
  };
  const notes = [];

  // API probe (no browser)
  try {
    const res = await fetch(`${BASE}/api/planner/catalog/svg-blocks/`);
    checks.devServer = res.ok;
    if (res.ok) {
      const data = await res.json();
      const items = data.items ?? [];
      checks.apiFiveDescriptors = items.length === 5;
      checks.apiHasChaise = items.some((i) => i.slug === "chaise-lounge-001");
      checks.apiHasDesk = items.some((i) => i.slug === "desk-linear-1200-001");
      fs.writeFileSync(
        path.join(EVIDENCE, "api-svg-blocks.json"),
        `${JSON.stringify({ total: items.length, slugs: items.map((i) => i.slug) }, null, 2)}\n`,
      );
    }
  } catch (err) {
    notes.push(`API fetch failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    const prefixes = [
      "cad-suite:planner:",
      "oando-project-setup-complete-",
      "planner-",
    ];
    try {
      for (const key of Object.keys(localStorage)) {
        if (prefixes.some((p) => key.startsWith(p))) localStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
    try {
      indexedDB.deleteDatabase("planner-workspace-db");
      indexedDB.deleteDatabase("buddy-planner-db");
    } catch {
      /* ignore */
    }
  });
  const page = await context.newPage();

  try {
    await enterGuestWorkspace(page);
    await page.getByRole("radio", { name: "2D", exact: true }).click();
    await page.locator('[data-testid="planner-2d-canvas"] canvas').waitFor({
      state: "visible",
      timeout: 25_000,
    });

    await ensureInventoryVisible(page);
    await page.screenshot({
      path: path.join(EVIDENCE, "01-workspace-ready.png"),
      fullPage: false,
    });

    const categoriesNav = page.getByRole("navigation", { name: "Inventory categories" });
    const symbolsBtn = categoriesNav.getByRole("button", { name: "Symbols" });
    checks.symbolsCategoryVisible = await symbolsBtn.isVisible({ timeout: 10_000 });
    if (!checks.symbolsCategoryVisible) {
      notes.push("Symbols category button not visible in inventory nav");
    } else {
      await symbolsBtn.click();
      await page.waitForTimeout(300);
      const svgCatalogBtn = categoriesNav.getByRole("button", { name: "SVG catalog" });
      checks.svgCatalogSubcategoryVisible = await svgCatalogBtn.isVisible({ timeout: 5_000 });
      if (!checks.svgCatalogSubcategoryVisible) {
        notes.push("SVG catalog subcategory not visible after expanding Symbols");
      } else {
        await svgCatalogBtn.click();
        await page.waitForTimeout(500);
      }
    }

    await page.screenshot({
      path: path.join(EVIDENCE, "02-symbols-svg-catalog.png"),
      fullPage: false,
    });

    const emptyText = page.getByText("No elements found");
    const catalog = page.getByRole("region", { name: "Catalog browser" });
    const hasEmpty = await emptyText.isVisible({ timeout: 2_000 }).catch(() => false);
    const addButtons = catalog.getByRole("button", { name: /Add .* to canvas/i });
    const buttonCount = await addButtons.count();
    checks.inventoryNotEmpty = !hasEmpty && buttonCount > 0;

    const bodyText = await catalog.innerText().catch(() => "");
    checks.chaiseVisible =
      bodyText.includes("Chaise Lounge") ||
      (await catalog.getByText("Chaise Lounge").count()) > 0;
    checks.deskVisible =
      bodyText.includes("Desk Linear 1200") ||
      (await catalog.getByText("Desk Linear 1200").count()) > 0;

    if (!checks.inventoryNotEmpty) {
      notes.push(
        hasEmpty
          ? "Inventory shows 'No elements found' under Symbols > SVG catalog"
          : `No Add-to-canvas buttons (count=${buttonCount})`,
      );
      const resultsCount = await page
        .locator('[class*="resultsCount"]')
        .first()
        .innerText()
        .catch(() => "unknown");
      notes.push(`Results count label: ${resultsCount}`);
    }

    await page.screenshot({
      path: path.join(EVIDENCE, "03-inventory-items.png"),
      fullPage: false,
    });

    if (checks.chaiseVisible) {
      const before = await furnitureCount(page);
      try {
        await placeCatalogItem(
          page,
          /Add Chaise Lounge to canvas/i,
          0.45,
          0.42,
        );
        await page.waitForFunction(
          (prev) => {
            const el = document.querySelector(".pw-status-bar > span");
            const m = el?.textContent?.match(/^(\d+)\s+furniture/i);
            return m ? Number.parseInt(m[1], 10) > prev : false;
          },
          before,
          { timeout: 25_000 },
        );
        checks.chaisePlaced = true;
      } catch (err) {
        notes.push(`Chaise place failed: ${err instanceof Error ? err.message : String(err)}`);
      }
      await page.screenshot({
        path: path.join(EVIDENCE, "04-chaise-placed.png"),
        fullPage: false,
      });
    }

    if (checks.deskVisible) {
      const before = await furnitureCount(page);
      try {
        await placeCatalogItem(
          page,
          /Add Desk Linear 1200 to canvas/i,
          0.58,
          0.52,
        );
        await page.waitForFunction(
          (prev) => {
            const el = document.querySelector(".pw-status-bar > span");
            const m = el?.textContent?.match(/^(\d+)\s+furniture/i);
            return m ? Number.parseInt(m[1], 10) > prev : false;
          },
          before,
          { timeout: 25_000 },
        );
        checks.deskPlaced = true;
      } catch (err) {
        notes.push(`Desk place failed: ${err instanceof Error ? err.message : String(err)}`);
      }
      await page.screenshot({
        path: path.join(EVIDENCE, "05-desk-placed.png"),
        fullPage: false,
      });
      const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
      await canvas.screenshot({ path: path.join(EVIDENCE, "06-canvas-both.png") });
    }
  } catch (err) {
    notes.push(`Browser flow error: ${err instanceof Error ? err.message : String(err)}`);
    await page.screenshot({
      path: path.join(EVIDENCE, "error-state.png"),
      fullPage: false,
    }).catch(() => {});
  } finally {
    await browser.close();
  }

  const furnitureAfter = checks.chaisePlaced || checks.deskPlaced;
  const overallPass =
    checks.devServer &&
    checks.apiFiveDescriptors &&
    checks.apiHasChaise &&
    checks.apiHasDesk &&
    checks.symbolsCategoryVisible &&
    checks.svgCatalogSubcategoryVisible &&
    checks.inventoryNotEmpty &&
    checks.chaiseVisible &&
    checks.deskVisible &&
    checks.chaisePlaced &&
    checks.deskPlaced;

  const run = {
    phase: "P06-symbols-inventory",
    date: new Date().toISOString(),
    checks,
    notes,
    status: overallPass ? "pass" : "fail",
  };
  fs.writeFileSync(path.join(EVIDENCE, "run.json"), `${JSON.stringify(run, null, 2)}\n`);
  console.log(JSON.stringify(run, null, 2));
  process.exit(overallPass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
