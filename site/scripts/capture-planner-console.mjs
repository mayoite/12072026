/**
 * Capture console errors/warnings on open3d planner routes.
 * Usage: node scripts/capture-planner-console.mjs
 * Requires: PLAYWRIGHT_BASE_URL or http://localhost:3000
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const outDir = path.resolve(__dirname, "../../results/planner/benchmark-quality");
fs.mkdirSync(outDir, { recursive: true });

const errors = [];
const warnings = [];
const failed = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on("console", (m) => {
  const t = m.type();
  const text = m.text();
  if (t === "error") errors.push(text.slice(0, 600));
  if (t === "warning") warnings.push(text.slice(0, 400));
});
page.on("pageerror", (e) => {
  errors.push(`PAGEERROR: ${String(e.message).slice(0, 600)}`);
});
page.on("requestfailed", (r) => {
  const u = r.url();
  if (u.includes("favicon") || u.includes("hot-update")) return;
  failed.push(`${u.slice(0, 200)} | ${r.failure()?.errorText || ""}`);
});

async function settle(ms = 2500) {
  await page.waitForTimeout(ms);
}

// --- live canvas host ---
await page.goto(`${baseURL}/planner/canvas/?plannerDevTools=1`, {
  waitUntil: "domcontentloaded",
  timeout: 90_000,
});
await settle(4000);
try {
  await page.getByRole("radio", { name: "3D", exact: true }).click({ timeout: 5000 });
  await settle(2500);
} catch {
  /* optional */
}
try {
  const place = page.getByRole("button", { name: "Place 4 seats" });
  if (await place.isVisible({ timeout: 3000 })) {
    await place.click();
    await settle(2000);
  }
} catch {
  /* optional */
}
await page.screenshot({
  path: path.join(outDir, "01-open3d-console-capture.png"),
  fullPage: false,
});

// --- guest ---
await page.goto(`${baseURL}/planner/guest/?plannerDevTools=1`, {
  waitUntil: "domcontentloaded",
  timeout: 90_000,
});
await settle(2000);
const nameInput = page.locator('input:not([type="file"])').filter({ hasNot: page.locator('[type="hidden"]') }).first();
try {
  if (await nameInput.isVisible({ timeout: 2000 })) {
    await nameInput.fill("Benchmark quality");
  }
} catch {
  /* setup may already be done */
}
for (const label of [/Continue/i, /Start/i, /Enter workspace/i, /Begin/i, /Create/i]) {
  try {
    const b = page.getByRole("button", { name: label }).first();
    if (await b.isVisible({ timeout: 800 })) {
      await b.click();
      await settle(1500);
    }
  } catch {
    /* next */
  }
}
await settle(3000);
await page.screenshot({
  path: path.join(outDir, "02-guest-console-capture.png"),
  fullPage: false,
});

const unique = (arr) => [...new Set(arr)];
const payload = {
  capturedAt: new Date().toISOString(),
  baseURL,
  errorCount: unique(errors).length,
  warningCount: unique(warnings).length,
  failedRequestCount: unique(failed).length,
  errors: unique(errors).slice(0, 80),
  warnings: unique(warnings).slice(0, 40),
  failedRequests: unique(failed).slice(0, 40),
  zeroConsoleErrors: unique(errors).length === 0,
};

fs.writeFileSync(
  path.join(outDir, "console-capture.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(payload, null, 2));
await browser.close();
process.exit(payload.zeroConsoleErrors ? 0 : 2);
