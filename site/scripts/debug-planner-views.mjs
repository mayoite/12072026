import { chromium as defaultChromium } from "@playwright/test";
import fs from "node:fs";

export const PLANNER_GUEST_URL = "http://localhost:3000/planner/guest/";
export const VIEWPORT = { width: 1440, height: 900 };
export const SCREENSHOT_DIR = "screenshots";

export function shouldCaptureConsoleType(type) {
  return ["error", "warning"].includes(type);
}

export function formatConsoleLine(type, text, max = 400) {
  return `${type}: ${String(text).slice(0, max)}`;
}

export async function runPlannerViewsDebug(deps = {}) {
  const chromium = deps.chromium ?? defaultChromium;
  const log = deps.log ?? console.log;
  const mkdir = deps.mkdir ?? fs.mkdirSync;
  const url = deps.url ?? PLANNER_GUEST_URL;
  const viewport = deps.viewport ?? VIEWPORT;
  const screenshotDir = deps.screenshotDir ?? SCREENSHOT_DIR;

  mkdir(screenshotDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const logs = [];
  page.on("console", (m) => {
    if (shouldCaptureConsoleType(m.type())) {
      logs.push(formatConsoleLine(m.type(), m.text()));
    }
  });
  page.on("pageerror", (e) => logs.push(`PAGEERROR: ${e.message.slice(0, 400)}`));

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page.waitForTimeout(2000);

  const start = page.getByRole("button", { name: /start placing furniture/i });
  await start.waitFor({ state: "visible", timeout: 60000 });
  await start.click();
  await page.waitForSelector(".pw-workspace", { timeout: 60000 });

  const presetBtn = page.getByRole("button", { name: /rectangular|square|l-shaped|skip/i }).first();
  if ((await presetBtn.count()) > 0) {
    await presetBtn.click();
    await page.waitForTimeout(1500);
  }

  const coachNext = page.getByRole("button", { name: /^next$/i }).first();
  if ((await coachNext.count()) > 0) {
    await coachNext.click().catch(() => {});
    await page.waitForTimeout(500);
  }

  await page.waitForTimeout(3000);

  const state = await page.evaluate(() => {
    const active = document.querySelector(".pw-segment-btn[aria-pressed='true'], .pw-segment-btn.is-active");
    return {
      activeView: active?.textContent?.trim() ?? null,
      has2d: !!document.querySelector(".pw-view-stack__pane--2d"),
      has3d: !!document.querySelector(".pw-view-stack__pane--3d"),
    };
  });
  log("VIEW_STATE", state);
  if (logs.length) log("CONSOLE", logs);
  await browser.close();
  return { state, logs };
}

function isMain() {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return entry.endsWith("debug-planner-views.mjs");
}

if (isMain()) {
  runPlannerViewsDebug().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
