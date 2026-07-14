import { chromium as defaultChromium } from "@playwright/test";

export const DEFAULT_PLANNER_URL =
  "http://localhost:3000/planner/guest/?plannerDevTools=1";
export const VIEWPORT = { width: 1440, height: 900 };

export function plannerLocalStorageKeys(keys) {
  return keys.filter(
    (k) => k.includes("planner") || k.includes("guest") || k.includes("project-setup"),
  );
}

export async function runContextMenuDebug(deps = {}) {
  const chromium = deps.chromium ?? defaultChromium;
  const log = deps.log ?? console.log;
  const url = deps.url ?? process.env.PLANNER_URL ?? DEFAULT_PLANNER_URL;
  const viewport = deps.viewport ?? VIEWPORT;

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport });
  await context.addInitScript(() => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.includes("planner") || k.includes("guest") || k.includes("project-setup"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  });

  const page = await context.newPage();
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  log("status", resp?.status());

  const projectNameInput = page.locator("#project-setup-name");
  const workspace = page.locator(".pw-workspace");
  await Promise.race([
    projectNameInput.waitFor({ state: "visible", timeout: 60000 }),
    workspace.waitFor({ state: "visible", timeout: 60000 }),
  ]).catch(() => {});

  if (await projectNameInput.isVisible().catch(() => false)) {
    await projectNameInput.fill("Context menu test");
    await page.getByRole("button", { name: /Start placing furniture/i }).click();
    await page.waitForTimeout(1000);
  }

  await page.waitForSelector(".pw-workspace", { timeout: 60000 });
  await page.waitForSelector("#main", { timeout: 30000 });

  const presetBtn = page.getByRole("button", { name: /rectangular|square|l-shaped|skip/i }).first();
  if ((await presetBtn.count()) > 0) {
    await presetBtn.click().catch(() => {});
    await page.waitForTimeout(1500);
  }

  const btn2d = page.locator(".pw-segment-btn", { hasText: "2D" });
  if ((await btn2d.count()) > 0) {
    await btn2d.click().catch(() => {});
    await page.waitForTimeout(500);
  }

  const canvas = page.locator("#main");
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5, { button: "right" });
    await page.waitForTimeout(500);
  }

  const menuVisible = await page.locator(".context-menu, [data-testid='context-menu']").count();
  log("contextMenuCount", menuVisible);
  await browser.close();
  return { status: resp?.status() ?? null, menuVisible, box };
}

function isMain() {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return entry.endsWith("debug-context-menu.mjs");
}

if (isMain()) {
  runContextMenuDebug().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
