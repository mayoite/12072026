/**
 * C4: guest inventory lists parametric desk; place click at 1280 + 390.
 * Usage: node scripts/c4-guest-place-proof.mjs [slug]
 */
import { chromium } from "playwright";
import { forceLocalhostOrigin } from "./lib/forceLocalhostOrigin.mjs";

/** Always localhost — never 127.0.0.1 */
const BASE = forceLocalhostOrigin(
  process.env.C4_BASE_URL || process.env.PLAYWRIGHT_BASE_URL,
);

async function openInventory(page) {
  // Guest chrome: step 2 Place opens inventory dock
  const placeStep = page.getByText("Place", { exact: true }).first();
  if (await placeStep.count()) {
    await placeStep.click().catch(() => undefined);
  }
  await page.locator("[data-testid=canvas-tool-placement]").click().catch(() => undefined);
  await page
    .getByText("Search inventory", { exact: false })
    .waitFor({ timeout: 30_000 })
    .catch(() => undefined);
  await page.waitForTimeout(1500);
}

async function main() {
  const api = await fetch(`${BASE}/api/planner/catalog/svg-blocks/`);
  const body = await api.json();
  const items = body.items ?? [];
  const preferred = process.argv[2];
  const proof =
    items.find((i) => i.slug === preferred) ||
    items.find((i) => i.slug?.startsWith("oando-param-proof-")) ||
    items.find((i) => i.slug === "oando-linear-desk-1600");

  if (!proof) {
    console.log(
      JSON.stringify({
        ok: false,
        error: "no parametric desk in guest catalog",
        total: items.length,
      }),
    );
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const failed = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("requestfailed", (req) => {
    failed.push({ url: req.url(), error: req.failure()?.errorText });
  });

  const slug = proof.slug;
  const name = proof.name ?? slug;

  async function checkViewport(width, height) {
    await page.setViewportSize({ width, height });
    await page.goto(`${BASE}/planner/guest/`, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page.waitForTimeout(2500);
    await openInventory(page);

    // Search by SKU or name
    const search = page.getByPlaceholder(/search inventory/i).or(
      page.locator('input[type="search"]'),
    );
    if (await search.count()) {
      await search.first().fill(slug.includes("param") ? "Param Proof" : "Linear desk");
      await page.waitForTimeout(800);
    }

    const bodyText = await page.locator("body").innerText();
    const listed =
      bodyText.includes(slug) ||
      bodyText.includes(name) ||
      bodyText.includes("Param Proof") ||
      bodyText.includes("Linear Desk 1600") ||
      bodyText.includes("OANDO-LINEAR-DSK");

    let placeClicked = false;
    // Prefer Place button near the product name
    const nameLoc = page.getByText(name, { exact: false }).first();
    if (await nameLoc.count()) {
      const row = nameLoc.locator("xpath=ancestor::*[contains(@class,'item') or self::li or self::article][1]");
      const placeBtn = row.getByRole("button", { name: /^Place$/i });
      if (await placeBtn.count()) {
        await placeBtn.click().catch(() => undefined);
        placeClicked = true;
      } else {
        await nameLoc.click().catch(() => undefined);
        placeClicked = true;
      }
    } else {
      const anyPlace = page.getByRole("button", { name: /^Place$/i }).first();
      if (await anyPlace.count()) {
        await anyPlace.click().catch(() => undefined);
        placeClicked = true;
      }
    }
    await page.waitForTimeout(1200);

    // Click canvas center to drop if in place mode
    const canvas = page.locator("[data-testid=planner-fabric-stage], [data-testid=planner-canvas-stage]").first();
    if (await canvas.count()) {
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(800);
      }
    }

    return { listed, placeClicked, bodyHasQuote: bodyText.toLowerCase().includes("quote") };
  }

  const r1280 = await checkViewport(1280, 800);
  const r390 = await checkViewport(390, 844);

  const svgFailed = failed.filter(
    (f) =>
      f.url.includes(slug) ||
      f.url.includes("svg-catalog") ||
      f.url.includes("/api/planner/catalog/svg"),
  );

  const report = {
    slug,
    name,
    catalogTotal: items.length,
    preview: proof.assets?.previewImageUrl ?? null,
    at1280: r1280,
    at390: r390,
    consoleErrorCount: consoleErrors.length,
    consoleErrors: consoleErrors.slice(0, 8),
    failedSvgRequests: svgFailed.slice(0, 8),
  };
  console.log(JSON.stringify(report, null, 2));
  await browser.close().catch(() => undefined);

  const ok =
    r1280.listed &&
    r390.listed &&
    svgFailed.length === 0 &&
    consoleErrors.filter((e) => !/favicon|Download the React DevTools/i.test(e))
      .length === 0;
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
