/**
 * C3 browser proof: Playwright Chromium (preferred) or Chrome Beta CDP :9222.
 * Usage (repo root): node scripts/c3-parametric-browser-proof.mjs
 * Requires: `pnpm --filter oando-site run test:browsers:install` once; dev on :3000
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitePublic = path.join(root, "site", "public", "svg-catalog");

async function openBrowser() {
  // Prefer bundled Playwright Chromium (installed via test:browsers:install)
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    return { browser, page, mode: "playwright-chromium" };
  } catch (err) {
    console.warn("playwright launch failed, trying CDP :9222", err?.message ?? err);
  }
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
  const context = browser.contexts()[0] ?? (await browser.newContext());
  const page = context.pages()[0] ?? (await context.newPage());
  return { browser, page, mode: "cdp-9222" };
}

async function main() {
  const { browser, page, mode } = await openBrowser();
  console.log(JSON.stringify({ browserMode: mode }));

  await page.goto("http://localhost:3000/admin/svg-editor/parametric", {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.waitForSelector("[data-testid=admin-linear-desk-parametric]", {
    timeout: 60_000,
  });

  const title = await page.title();
  const hasForm = await page
    .locator("[data-testid=admin-linear-desk-parametric]")
    .count();

  // Prefer cm + 160 width
  const cmRadio = page.locator('input[name="unit"][value="cm"], input[name="unit"]').nth(1);
  if ((await cmRadio.count()) > 0) {
    await cmRadio.check({ force: true }).catch(() => undefined);
  }
  await page.locator("[data-testid=linear-desk-width]").fill("160");

  const slug = `oando-param-proof-${Date.now().toString(36).slice(-6)}`;
  await page.locator("[data-testid=linear-desk-slug]").fill(slug);

  await page.waitForTimeout(800);
  const previewHtml = await page
    .locator("[data-testid=linear-desk-preview]")
    .innerHTML()
    .catch(() => "");
  const previewOk =
    previewHtml.includes("desk-top") || previewHtml.includes("pedestal");

  await page.locator("[data-testid=linear-desk-publish]").click();
  await page
    .locator("[data-testid=linear-desk-message]")
    .waitFor({ timeout: 60_000 })
    .catch(() => undefined);
  await page.waitForTimeout(1500);
  const publishMessage = await page
    .locator("[data-testid=linear-desk-message]")
    .textContent()
    .catch(() => null);

  const svgPath = path.join(sitePublic, `${slug}.svg`);
  const exists = fs.existsSync(svgPath);
  let svgChecks = null;
  if (exists) {
    const svg = fs.readFileSync(svgPath, "utf8");
    svgChecks = {
      hasDeskTop: svg.includes('id="desk-top"'),
      hasPedestal: svg.includes("pedestal-l"),
      noCurrentColor: !/currentColor/i.test(svg),
      bytes: svg.length,
    };
  }

  const apiRes = await fetch("http://localhost:3000/api/planner/catalog/svg-blocks/");
  const apiBody = await apiRes.json();
  const items = apiBody.items ?? apiBody.data?.items ?? [];
  const hit = items.find((i) => i.slug === slug);

  const report = {
    title,
    hasForm,
    slug,
    previewOk,
    publishMessage,
    disk: { svgPath, exists, svgChecks },
    guest: {
      visible: Boolean(hit),
      preview: hit?.assets?.previewImageUrl ?? null,
      total: items.length,
    },
  };
  console.log(JSON.stringify(report, null, 2));

  const ok =
    hasForm > 0 &&
    previewOk &&
    exists &&
    svgChecks?.hasDeskTop &&
    svgChecks?.noCurrentColor;

  // Disconnect without killing Beta if shared
  await browser.close().catch(() => undefined);
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
