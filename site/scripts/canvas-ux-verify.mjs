/**
 * One-off browser verification for canvas UX fixes.
 * Output: results/planner/canvas-ux-fix/{width}x{height}/*.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(REPO_ROOT, "results", "planner", "canvas-ux-fix");

const VIEWPORTS = [
  { width: 1280, height: 800, label: "1280x800" },
  { width: 700, height: 800, label: "700x800" },
  { width: 375, height: 812, label: "375x812" },
];

async function dismissOnboarding(page) {
  const skip = page.getByRole("button", { name: /skip onboarding/i });
  if (await skip.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skip.click();
  }
}

async function waitForWorkspaceReady(page) {
  const preparing = page.getByText(/Preparing your editor/i);
  if (await preparing.isVisible({ timeout: 3000 }).catch(() => false)) {
    await preparing.waitFor({ state: "hidden", timeout: 120_000 });
  }
  await page
    .locator('[data-testid="planner-fabric-stage"] canvas')
    .waitFor({ state: "visible", timeout: 120_000 });
}

async function enterGuestCanvas(page) {
  await page.addInitScript(() => {
    localStorage.setItem("oando-onboarding-complete-planner-guest", "true");
  });

  await page.goto("http://localhost:3000/planner/guest/?plannerDevTools=1", {
    waitUntil: "domcontentloaded",
  });

  await page.evaluate(async () => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("planner-") || key.startsWith("cad-suite:planner:")) {
        localStorage.removeItem(key);
      }
    }
    localStorage.setItem("oando-onboarding-complete-planner-guest", "true");
    await new Promise((resolve) => {
      const req = indexedDB.deleteDatabase("planner-workspace-db");
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
  });

  await page.reload({ waitUntil: "domcontentloaded" });

  const setupHeading = page.getByRole("heading", { name: /Set up your space/i });
  if (await setupHeading.isVisible({ timeout: 15_000 }).catch(() => false)) {
    await page.getByLabel("Project name").fill("Canvas UX verify");
    await page
      .getByRole("button", { name: /Open planner/i })
      .click();
  }

  await page.locator(".pw-topbar").waitFor({ timeout: 60_000 }).catch(() => {});
  await waitForWorkspaceReady(page);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await enterGuestCanvas(page);
  } catch (error) {
    await page.screenshot({
      path: path.join(OUT_DIR, "debug-entry-failure.png"),
      fullPage: true,
    });
    throw error;
  }

  for (const vp of VIEWPORTS) {
    const dir = path.join(OUT_DIR, vp.label);
    fs.mkdirSync(dir, { recursive: true });
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(400);

    await page.screenshot({
      path: path.join(dir, "canvas-default.png"),
      fullPage: false,
    });

    const gridOverlay = page.getByTestId("planner-grid-overlay");
    const gridVisible = await gridOverlay.isVisible().catch(() => false);
    if (!gridVisible) {
      const gridBtn = page.getByRole("button", { name: /Enable grid/i });
      if (await gridBtn.isVisible().catch(() => false)) {
        await gridBtn.click();
      } else {
        await page.getByRole("button", { name: /Prefs/i }).click();
        await page.getByRole("menuitem", { name: /Enable Grid/i }).click();
      }
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: path.join(dir, "grid-enabled.png"),
      fullPage: false,
    });

    const layersBtn = page.getByRole("button", { name: /Toggle layers panel/i });
    if (await layersBtn.isVisible().catch(() => false)) {
      await layersBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(dir, "layers-open.png"),
        fullPage: false,
      });
      await layersBtn.click();
    }

    const inventoryTab = page.getByRole("tab", { name: /library/i });
    if (await inventoryTab.isVisible().catch(() => false)) {
      await inventoryTab.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(dir, "inventory-panel.png"),
        fullPage: false,
      });
    }
  }

  const stage = page.getByTestId("planner-fabric-stage");
  const gridOn = await stage.getAttribute("data-grid-enabled");
  const overlayCount = await page.getByTestId("planner-grid-overlay").count();

  const summary = {
    capturedAt: new Date().toISOString(),
    gridEnabledAttr: gridOn,
    gridOverlayCount: overlayCount,
    outputDir: OUT_DIR,
    viewports: VIEWPORTS.map((v) => v.label),
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );

  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
