import { chromium as defaultChromium } from "@playwright/test";

export const PLANNER_URL =
  "http://localhost:3000/planner/guest/?plannerDevTools=1";
export const VIEWPORT = { width: 1440, height: 900 };

export function zoomDelta(beforeLabel, afterLabel) {
  const parse = (label) => {
    const n = Number(String(label ?? "").replace(/%/g, "").trim());
    return Number.isFinite(n) ? n : null;
  };
  const a = parse(beforeLabel);
  const b = parse(afterLabel);
  if (a === null || b === null) return null;
  return b - a;
}

export async function runZoomDebug(deps = {}) {
  const chromium = deps.chromium ?? defaultChromium;
  const log = deps.log ?? console.log;
  const url = deps.url ?? PLANNER_URL;
  const viewport = deps.viewport ?? VIEWPORT;

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(() => {
    Object.keys(localStorage)
      .filter((k) => k.includes("planner") || k.includes("guest"))
      .forEach((k) => localStorage.removeItem(k));
  });
  const page = await ctx.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  const start = page.getByRole("button", { name: /start placing furniture/i });
  if (await start.isVisible().catch(() => false)) {
    await page.locator("#project-setup-name").fill("zoom test");
    await start.click();
    await page.waitForTimeout(800);
  }
  await page.waitForSelector("#main", { timeout: 30000 });
  const preset = page.getByRole("button", { name: /skip|rectangular/i }).first();
  if ((await preset.count()) > 0) {
    await preset.click();
    await page.waitForTimeout(1000);
  }

  const read = () =>
    page.evaluate(() => {
      const c = document.querySelector("#main");
      const r = c?.getBoundingClientRect();
      const label = document.querySelector(".zoom-control span")?.textContent?.trim();
      return { w: Math.round(r?.width ?? 0), h: Math.round(r?.height ?? 0), label };
    });

  const before = await read();
  await page.locator('.zoom-control button[aria-label="Zoom in"]').click();
  await page.waitForTimeout(400);
  const afterOne = await read();
  await page.locator('.zoom-control button[aria-label="Zoom in"]').click();
  await page.waitForTimeout(400);
  const afterTwo = await read();

  log({ before, afterOne, afterTwo, delta: zoomDelta(before.label, afterTwo.label) });
  await browser.close();
  return { before, afterOne, afterTwo };
}

function isMain() {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return entry.endsWith("debug-zoom.mjs");
}

if (isMain()) {
  runZoomDebug().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
