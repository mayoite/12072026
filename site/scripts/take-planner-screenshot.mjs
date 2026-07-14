import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { baseUrl } from "./lib/scriptEnv.mjs";
import { resolveRepoRootFromCwd } from "./lib/repoRoot.mjs";

export const PLANNER_SCREENSHOT_VIEWPORT = { width: 1440, height: 900 };
export const PLANNER_GUEST_PATH = "/planner/guest";
export const PLANNER_SCREENSHOT_FILENAME = "planner-guest-left-panel.png";
export const WORKSPACE_SELECTOR = ".pw-workspace, .fcw-workspace";
export const START_PLACING_RE = /start placing furniture/i;
export const OPEN_LIBRARY_RE = /open library panel/i;

export function resolveScreenshotOutDir(repoRoot = resolveRepoRootFromCwd()) {
  return path.join(repoRoot, "results", "screenshots");
}

export function resolveScreenshotOutPath(repoRoot = resolveRepoRootFromCwd()) {
  return path.join(resolveScreenshotOutDir(repoRoot), PLANNER_SCREENSHOT_FILENAME);
}

export function plannerGuestUrl(urlBase = baseUrl()) {
  return `${urlBase}${PLANNER_GUEST_PATH}`;
}

export async function takePlannerScreenshot(options = {}) {
  const {
    outDir = resolveScreenshotOutDir(),
    base = baseUrl(),
    browserFactory = () => chromium.launch(),
  } = options;

  fs.mkdirSync(outDir, { recursive: true });
  const browser = await browserFactory();
  const page = await browser.newPage({ viewport: PLANNER_SCREENSHOT_VIEWPORT });

  await page.goto(plannerGuestUrl(base), {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page.waitForTimeout(3000);

  const startBtn = page.getByRole("button", { name: START_PLACING_RE }).first();
  if ((await startBtn.count()) > 0) {
    await startBtn.click();
    await page.waitForTimeout(4000);
  }

  await page.waitForSelector(WORKSPACE_SELECTOR, { timeout: 60000 }).catch(() => {});

  const leftBtn = page.getByRole("button", { name: OPEN_LIBRARY_RE }).first();
  if ((await leftBtn.count()) > 0) {
    await leftBtn.click();
    await page.waitForTimeout(1500);
  }

  const outPath = path.join(outDir, PLANNER_SCREENSHOT_FILENAME);
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();

  console.log(`saved ${outPath}`);
  return outPath;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return path.resolve(entry) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isDirectRun()) {
  takePlannerScreenshot().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
