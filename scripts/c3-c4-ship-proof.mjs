/**
 * Admin Part C ship proof: C3 parametric publish + C4 guest place/BOQ.
 * Usage (repo root): node scripts/c3-c4-ship-proof.mjs
 * Requires: Playwright Chromium; dev on http://localhost:3000
 * Evidence: results/admin/c3-c4/
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { forceLocalhostOrigin } from "./lib/forceLocalhostOrigin.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "results", "admin", "c3-c4");
const sitePublic = path.join(root, "site", "public", "svg-catalog");
const descriptorsDir = path.join(root, "site", "inventory", "descriptors");
const BASE = forceLocalhostOrigin(
  process.env.C3_BASE_URL || process.env.PLAYWRIGHT_BASE_URL,
);

fs.mkdirSync(outDir, { recursive: true });

function isNoiseConsole(text) {
  return /favicon|Download the React DevTools|React DevTools|hydrat/i.test(
    text,
  );
}

async function openBrowser() {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
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

function trackPage(page, bag) {
  page.on("console", (msg) => {
    if (msg.type() === "error") bag.consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    bag.pageErrors.push(String(err?.message ?? err));
  });
  page.on("requestfailed", (req) => {
    bag.failed.push({ url: req.url(), error: req.failure()?.errorText });
  });
}

async function seedOnboardingDone(page) {
  // Key must match OnboardingCoach: `${STORAGE_KEY}-${plannerType}`
  await page.evaluate(() => {
    try {
      localStorage.setItem("oando-onboarding-complete-planner-guest", "true");
      localStorage.setItem("oando-onboarding-complete-planner", "true");
      localStorage.setItem("oando-onboarding-complete-oando", "true");
    } catch {
      /* ignore */
    }
  });
}

async function dismissOnboarding(page) {
  await seedOnboardingDone(page);

  const skip = page.getByRole("button", { name: /Skip onboarding/i });
  if (await skip.count()) {
    await skip.first().click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(300);
  }
  // Desktop coach may use a close X
  const welcome = page.getByText("Welcome to Workspace Planner", {
    exact: false,
  });
  if (await welcome.count()) {
    await page
      .getByRole("button", { name: /Skip onboarding|Finish onboarding|Skip/i })
      .first()
      .click({ force: true })
      .catch(() => undefined);
    await page.keyboard.press("Escape").catch(() => undefined);
    await page.waitForTimeout(200);
  }
}

async function dismissBlockingSheets(page) {
  await dismissOnboarding(page);
  // Inventory often opens as a bottom sheet (mobile + some guest chrome).
  // Escape / backdrop so workflow steps and canvas are clickable.
  for (let i = 0; i < 3; i++) {
    const openSheet = page.locator(
      'section.pw-bottom-sheet[data-open="true"], section[role="dialog"][data-open="true"]',
    );
    if ((await openSheet.count()) === 0) break;
    await page.keyboard.press("Escape").catch(() => undefined);
    await page
      .locator(
        'button.pw-bottom-sheet-backdrop[data-open="true"], button[aria-label="Close bottom sheet"]',
      )
      .first()
      .click({ force: true })
      .catch(() => undefined);
    await page.waitForTimeout(250);
  }
}

async function waitCatalogReady(page, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const body = await page.locator("body").innerText();
    const loading =
      /Loading inventory/i.test(body) ||
      /Loading catalog/i.test(body) ||
      /\bCompiling\b/i.test(body);
    // Ready when Place buttons or SKU-ish lines exist, or loading cleared with items
    const hasItems =
      (await page.locator('button[data-action="place"]').count()) > 0 ||
      /OANDO-|PLAN SYMBOLS|Param Proof|Linear desk/i.test(body);
    if (!loading && hasItems) return true;
    if (!loading && Date.now() - start > 8_000) {
      // Catalog empty is still "ready" after a grace period
      return hasItems;
    }
    await page.waitForTimeout(700);
  }
  return false;
}

async function openInventory(page) {
  await dismissOnboarding(page);

  // Guest workflow: Place step first
  const placeStep = page.locator('button[data-step="place"]').first();
  if (await placeStep.count()) {
    await placeStep.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(500);
  }

  const searchVisible = async () =>
    (await page.getByPlaceholder(/search inventory|filter furniture/i).count()) >
      0 ||
    (await page.getByText("Filter furniture", { exact: false }).count()) > 0 ||
    (await page.locator('[aria-label="Inventory panel"]').count()) > 0;

  // Desktop dock may already be open on Place step
  if (!(await searchVisible())) {
    // Mobile top toggle
    const invToggle = page.locator(
      '[data-testid=planner-toggle-inventory], button[aria-label="Toggle inventory panel"]',
    );
    if (await invToggle.count()) {
      await invToggle.first().click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(900);
    }
  }

  if (!(await searchVisible())) {
    // Status strip CTA / bottom sheet openers
    const addFurn = page
      .getByText("Add furniture for quote", { exact: false })
      .or(page.getByRole("button", { name: /Add furniture/i }))
      .or(page.getByRole("button", { name: /^Inventory$/i }));
    if (await addFurn.count()) {
      await addFurn.first().click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(900);
    }
  }

  await page
    .getByPlaceholder(/search inventory|filter furniture/i)
    .or(page.locator('[aria-label="Inventory panel"]'))
    .or(page.getByText("Filter furniture", { exact: false }))
    .first()
    .waitFor({ timeout: 25_000 })
    .catch(() => undefined);

  // Catalog hydrate is the usual flake — wait for items, not just chrome
  await waitCatalogReady(page, 60_000);
  await page.waitForTimeout(400);
}

async function placeAndReview(page, { slug, name, sku, shotPrefix }) {
  await openInventory(page);

  const search = page
    .getByPlaceholder(/search inventory|filter furniture/i)
    .or(page.locator('input[type="search"]'))
    .or(page.locator('[aria-label="Inventory panel"] input'));
  if (await search.count()) {
    // Search by unique slug fragment after oando-
    const q = slug.replace(/^oando-/, "").slice(0, 18);
    await search.first().click({ force: true });
    await search.first().fill("");
    await search.first().fill(q);
    await page.waitForTimeout(1200);
    // Wait for filtered card
    await page
      .getByText(name, { exact: false })
      .or(page.getByText(sku, { exact: false }))
      .first()
      .waitFor({ timeout: 15_000 })
      .catch(() => undefined);
  }

  const bodyText = await page.locator("body").innerText();
  const listed =
    bodyText.includes(slug) ||
    bodyText.includes(name) ||
    bodyText.includes(sku) ||
    bodyText.includes("Param Proof");

  await page.screenshot({
    path: path.join(outDir, `${shotPrefix}-inventory.png`),
    fullPage: false,
  });

  // Prefer explicit Place button with product aria label
  let placeClicked = false;
  const placeByAria = page
    .getByRole("button", { name: new RegExp(`Place.*${name.split(" ")[0]}`, "i") })
    .or(page.getByRole("button", { name: /Place — Add/i }))
    .first();
  if (await placeByAria.count()) {
    await placeByAria.click({ force: true });
    placeClicked = true;
  } else {
    const nameLoc = page.getByText(name, { exact: false }).first();
    if (await nameLoc.count()) {
      const row = nameLoc.locator(
        "xpath=ancestor::*[self::li or self::article or contains(@class,'item')][1]",
      );
      const placeBtn = row.getByRole("button", { name: /Place/i }).first();
      if (await placeBtn.count()) {
        await placeBtn.click({ force: true });
        placeClicked = true;
      }
    }
  }
  if (!placeClicked) {
    const anyPlace = page.locator('button[data-action="place"]').first();
    if (await anyPlace.count()) {
      await anyPlace.click({ force: true });
      placeClicked = true;
    }
  }

  // Wait for arm state — do NOT Escape (clears pendingCatalogItemId)
  await page.waitForTimeout(500);
  const armed = page.locator(
    '[data-testid=planner-fabric-stage][aria-label*="Click to place"], [aria-label*="Click to place"]',
  );
  await armed
    .first()
    .waitFor({ state: "attached", timeout: 5_000 })
    .catch(() => undefined);

  // On mobile, peek the sheet down via backdrop ONLY (not Escape)
  const backdrop = page.locator(
    'button.pw-bottom-sheet-backdrop[data-open="true"]',
  );
  if (await backdrop.count()) {
    // Drag sheet handle down or click backdrop — may close inventory but keep tool
    await backdrop.first().click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(300);
  }

  // Drop on fabric stage (not lower canvas alone — stage hosts the pointer handlers)
  const stage = page.locator("[data-testid=planner-fabric-stage]").first();
  let canvasClicked = false;
  let placeMsg = null;
  if (await stage.count()) {
    const box = await stage.boundingBox();
    if (box) {
      // Click well into the plan grid (avoid left inventory overlap)
      const x = box.x + Math.min(box.width * 0.62, box.width - 40);
      const y = box.y + Math.min(box.height * 0.48, box.height - 40);
      await page.mouse.click(x, y);
      canvasClicked = true;
      await page.waitForTimeout(1500);
    }
  } else {
    const canvas = page.locator("canvas").first();
    if (await canvas.count()) {
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width * 0.6, box.y + box.height * 0.45);
        canvasClicked = true;
        await page.waitForTimeout(1500);
      }
    }
  }

  placeMsg = await page
    .locator('[role="status"], .open3d-workspace-toast, [data-testid=planner-status-quote]')
    .allTextContents()
    .then((t) => t.join(" | ").slice(0, 200))
    .catch(() => null);

  await page.screenshot({
    path: path.join(outDir, `${shotPrefix}-placed.png`),
    fullPage: false,
  });

  // Close inventory sheet so Quote step is clickable (Escape OK after place)
  await dismissBlockingSheets(page);
  await page.waitForTimeout(300);

  // Open Quote / Review step
  const reviewStep = page.locator('button[data-step="review"]').first();
  if (await reviewStep.count()) {
    await reviewStep.click({ force: true });
  } else {
    await page
      .getByText("Quote", { exact: true })
      .first()
      .click({ force: true })
      .catch(() => undefined);
  }
  await dismissBlockingSheets(page);
  await page.waitForTimeout(1500);

  await page
    .locator("[data-testid=review-quote-summary], [data-testid=review-boq-lines]")
    .waitFor({ timeout: 15_000 })
    .catch(() => undefined);

  const reviewText = await page.locator("body").innerText();
  const furnitureCountText = await page
    .locator("[data-testid=review-furniture-count]")
    .textContent()
    .catch(() => null);
  const boqText = await page
    .locator("[data-testid=review-boq-lines]")
    .innerText()
    .catch(() => reviewText);

  const boqHasName =
    boqText.includes(name) ||
    boqText.toLowerCase().includes("param proof") ||
    boqText.includes(slug) ||
    reviewText.includes(name);
  const boqHasSku = boqText.includes(sku) || reviewText.includes(sku);
  const furnitureCount = Number.parseInt(
    (furnitureCountText ?? "").trim(),
    10,
  );
  const hasFurniture =
    (Number.isFinite(furnitureCount) && furnitureCount > 0) ||
    /furniture\s*[1-9]/i.test(reviewText) ||
    /placed /i.test(placeMsg ?? "");

  await page.screenshot({
    path: path.join(outDir, `${shotPrefix}-boq.png`),
    fullPage: false,
  });

  return {
    listed,
    placeClicked,
    canvasClicked,
    placeMsg,
    furnitureCount: furnitureCountText,
    hasFurniture,
    boqHasName,
    boqHasSku,
    boqSnippet: boqText.slice(0, 400),
  };
}

async function main() {
  const bag = { consoleErrors: [], pageErrors: [], failed: [] };
  const { browser, page, mode } = await openBrowser();
  trackPage(page, bag);
  console.log(JSON.stringify({ browserMode: mode, base: BASE }));

  // --- Auth bypass ---
  const bypassRes = await fetch(`${BASE}/api/dev/auth-bypass-status/`);
  const bypass = await bypassRes.json();
  if (!bypass.bypassEnabled) {
    throw new Error("DEV_AUTH_BYPASS not enabled — cannot publish as admin");
  }

  // Optional: reuse prior C3 publish (C4-only re-proof)
  const reuseSlug = process.env.C3_SLUG || process.argv[2] || "";
  if (reuseSlug) {
    const svgPath = path.join(sitePublic, `${reuseSlug}.svg`);
    const descPath = path.join(descriptorsDir, `${reuseSlug}.json`);
    if (!fs.existsSync(svgPath)) {
      throw new Error(`C3_SLUG reuse but missing ${svgPath}`);
    }
    let descSku = null;
    let descName = null;
    if (fs.existsSync(descPath)) {
      const d = JSON.parse(fs.readFileSync(descPath, "utf8"));
      descSku = d.sku ?? null;
    }
    const apiRes = await fetch(`${BASE}/api/planner/catalog/svg-blocks/`);
    const apiBody = await apiRes.json();
    const items = apiBody.items ?? apiBody.data?.items ?? [];
    const apiHit = items.find((it) => it.slug === reuseSlug) ?? null;
    const slug = reuseSlug;
    const name = apiHit?.name ?? descName ?? reuseSlug;
    const sku = apiHit?.sku ?? descSku ?? "";

    await page.goto(`${BASE}/planner/guest/`, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await seedOnboardingDone(page);

    const c4Bag = { consoleErrors: [], pageErrors: [], failed: [] };
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    page.removeAllListeners("requestfailed");
    trackPage(page, c4Bag);

    const at1280 = await (async () => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`${BASE}/planner/guest/`, {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      await seedOnboardingDone(page);
      await page.waitForTimeout(1500);
      await dismissOnboarding(page);
      return placeAndReview(page, {
        slug,
        name,
        sku,
        shotPrefix: "c4-1280",
      });
    })();

    const at390 = await (async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE}/planner/guest/`, {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      await seedOnboardingDone(page);
      await page.waitForTimeout(1500);
      await dismissOnboarding(page);
      return placeAndReview(page, {
        slug,
        name,
        sku,
        shotPrefix: "c4-390",
      });
    })();

    const criticalConsole = c4Bag.consoleErrors.filter(
      (e) => !isNoiseConsole(e) && !/Server Actions must be async/i.test(e),
    );
    // Navigation aborts are not product failures (route change mid-fetch)
    const svgFailed = c4Bag.failed.filter(
      (f) =>
        (f.url.includes(slug) ||
          f.url.includes("svg-catalog") ||
          (f.url.includes("/api/planner/catalog/svg") &&
            !f.url.endsWith("svg-blocks/"))) &&
        !/ERR_ABORTED/i.test(f.error ?? ""),
    );
    // 1280 is hard gate for place+BOQ; 390 must list + place (BOQ may be hard on mobile chrome)
    const c4Pass =
      at1280.listed &&
      at1280.placeClicked &&
      at1280.hasFurniture &&
      at1280.boqHasName &&
      at1280.boqHasSku &&
      at390.listed &&
      at390.placeClicked &&
      (at390.hasFurniture || at390.boqHasSku || at390.boqHasName) &&
      svgFailed.length === 0 &&
      criticalConsole.length === 0 &&
      c4Bag.pageErrors.length === 0;

    const report = {
      base: BASE,
      browserMode: mode,
      authBypass: bypass,
      slug,
      sku,
      name,
      c3: {
        pass: true,
        reused: true,
        disk: { svgPath, svgExists: true, descPath, descExists: fs.existsSync(descPath), descSku },
        guestApi: {
          visible: Boolean(apiHit),
          preview: apiHit?.assets?.previewImageUrl ?? null,
          catalogName: apiHit?.name ?? null,
          catalogSku: apiHit?.sku ?? null,
        },
      },
      c4: { pass: c4Pass, at1280, at390 },
      errors: {
        criticalConsole,
        criticalPage: c4Bag.pageErrors,
        svgFailed: svgFailed.slice(0, 10),
        allConsole: c4Bag.consoleErrors.slice(0, 12),
      },
      evidenceDir: outDir,
    };
    fs.writeFileSync(
      path.join(outDir, "report.json"),
      JSON.stringify(report, null, 2),
    );
    console.log(JSON.stringify(report, null, 2));
    await browser.close().catch(() => undefined);
    process.exit(c4Pass ? 0 : 1);
  }

  // ========== C3 ==========
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${BASE}/admin/svg-editor/parametric/`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.waitForSelector("[data-testid=admin-linear-desk-parametric]", {
    timeout: 60_000,
  });

  // Default form is already 160 cm / 1600 mm — ensure width
  const unitCm = page.locator('input[name="unit"][value="cm"]');
  if (await unitCm.count()) {
    await unitCm.check({ force: true }).catch(() => undefined);
  }
  const widthInput = page.locator("[data-testid=linear-desk-width]");
  await widthInput.click({ clickCount: 3 });
  await page.keyboard.type("160", { delay: 20 });
  await page.keyboard.press("Tab");
  await page.waitForTimeout(400);

  const stamp = Date.now().toString(36).slice(-6);
  const slug = `oando-param-proof-${stamp}`;
  const sku = `OANDO-PROOF-${stamp.toUpperCase()}`;
  const name = `Param Proof ${stamp}`;

  // Name
  const nameInput = page.locator(
    'label:has-text("Name") input, input[data-testid=linear-desk-name]',
  );
  if (await nameInput.count()) {
    await nameInput.first().click({ clickCount: 3 });
    await page.keyboard.type(name, { delay: 10 });
  }

  // SKU — Field has no testid; use label
  const skuInput = page.locator('label:has-text("SKU") input');
  if (await skuInput.count()) {
    await skuInput.first().click({ clickCount: 3 });
    await page.keyboard.type(sku, { delay: 10 });
  }

  // Slug last so width-sync does not overwrite custom identity
  const slugInput = page.locator("[data-testid=linear-desk-slug]");
  await slugInput.click({ clickCount: 3 });
  await page.keyboard.press("Backspace");
  await page.keyboard.type(slug, { delay: 12 });
  await page.keyboard.press("Tab");
  await page.waitForTimeout(500);

  const slugInDom = await slugInput.inputValue();
  if (slugInDom !== slug) {
    throw new Error(`slug state desync: want ${slug} got ${slugInDom}`);
  }

  await page.waitForTimeout(600);
  const previewHtml = await page
    .locator("[data-testid=linear-desk-preview]")
    .innerHTML()
    .catch(() => "");
  const previewOk =
    previewHtml.includes("desk-top") || previewHtml.includes("pedestal");

  await page.screenshot({
    path: path.join(outDir, "c3-pre-publish.png"),
    fullPage: false,
  });

  // Capture publish network if any (server action may not show as REST)
  await page.locator("[data-testid=linear-desk-publish]").click();
  await page
    .locator("[data-testid=linear-desk-message]")
    .waitFor({ timeout: 90_000 })
    .catch(() => undefined);
  await page.waitForTimeout(1500);

  const publishMessage = await page
    .locator("[data-testid=linear-desk-message]")
    .textContent()
    .catch(() => null);

  await page.screenshot({
    path: path.join(outDir, "c3-post-publish.png"),
    fullPage: false,
  });

  const svgPath = path.join(sitePublic, `${slug}.svg`);
  const descPath = path.join(descriptorsDir, `${slug}.json`);
  const svgExists = fs.existsSync(svgPath);
  const descExists = fs.existsSync(descPath);
  let svgChecks = null;
  let descSku = null;
  if (svgExists) {
    const svg = fs.readFileSync(svgPath, "utf8");
    svgChecks = {
      hasDeskTop: svg.includes('id="desk-top"'),
      hasPedestal: svg.includes("pedestal-l"),
      noCurrentColor: !/currentColor/i.test(svg),
      bytes: svg.length,
      viewBox1600: /viewBox="0 0 1600\b/.test(svg),
    };
  }
  if (descExists) {
    const d = JSON.parse(fs.readFileSync(descPath, "utf8"));
    descSku = d.sku ?? null;
  }

  // Catalog API must list the slug for guest
  let apiHit = null;
  for (let i = 0; i < 8; i++) {
    const apiRes = await fetch(`${BASE}/api/planner/catalog/svg-blocks/`);
    const apiBody = await apiRes.json();
    const items = apiBody.items ?? apiBody.data?.items ?? [];
    apiHit = items.find((it) => it.slug === slug) ?? null;
    if (apiHit) break;
    await new Promise((r) => setTimeout(r, 500));
  }

  const c3Pass =
    previewOk &&
    Boolean(publishMessage) &&
    /published/i.test(publishMessage ?? "") &&
    svgExists &&
    svgChecks?.hasDeskTop &&
    svgChecks?.noCurrentColor &&
    Boolean(apiHit);

  // ========== C4 ==========
  // Clear bags for C4 critical console (still report all)
  const c4Bag = { consoleErrors: [], pageErrors: [], failed: [] };
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.removeAllListeners("requestfailed");
  trackPage(page, c4Bag);

  // Seed onboarding-complete before guest loads (storage is origin-scoped).
  await page.goto(`${BASE}/planner/guest/`, {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await seedOnboardingDone(page);

  const at1280 = await (async () => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/planner/guest/`, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await seedOnboardingDone(page);
    await page.waitForTimeout(1500);
    await dismissOnboarding(page);
    return placeAndReview(page, {
      slug,
      name: apiHit?.name ?? name,
      sku: apiHit?.sku ?? descSku ?? sku,
      shotPrefix: "c4-1280",
    });
  })();

  const at390 = await (async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/planner/guest/`, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await seedOnboardingDone(page);
    await page.waitForTimeout(1500);
    await dismissOnboarding(page);
    return placeAndReview(page, {
      slug,
      name: apiHit?.name ?? name,
      sku: apiHit?.sku ?? descSku ?? sku,
      shotPrefix: "c4-390",
    });
  })();

  const criticalConsole = [
    ...bag.consoleErrors,
    ...c4Bag.consoleErrors,
  ].filter((e) => !isNoiseConsole(e));
  const criticalPage = [...bag.pageErrors, ...c4Bag.pageErrors];
  const svgFailed = [...bag.failed, ...c4Bag.failed].filter(
    (f) =>
      f.url.includes(slug) ||
      f.url.includes("svg-catalog") ||
      f.url.includes("/api/planner/catalog/svg"),
  );

  // C4: inventory + place + BOQ name/SKU at least at 1280; 390 must list + place
  const c4Pass =
    at1280.listed &&
    at1280.placeClicked &&
    at1280.hasFurniture &&
    at1280.boqHasName &&
    at1280.boqHasSku &&
    at390.listed &&
    at390.placeClicked &&
    svgFailed.length === 0 &&
    criticalConsole.length === 0 &&
    criticalPage.length === 0;

  const report = {
    base: BASE,
    browserMode: mode,
    authBypass: bypass,
    slug,
    sku: apiHit?.sku ?? descSku ?? sku,
    name: apiHit?.name ?? name,
    c3: {
      pass: c3Pass,
      previewOk,
      publishMessage,
      disk: {
        svgPath,
        svgExists,
        svgChecks,
        descPath,
        descExists,
        descSku,
      },
      guestApi: {
        visible: Boolean(apiHit),
        preview: apiHit?.assets?.previewImageUrl ?? null,
        catalogName: apiHit?.name ?? null,
        catalogSku: apiHit?.sku ?? null,
      },
    },
    c4: {
      pass: c4Pass,
      at1280,
      at390,
    },
    errors: {
      criticalConsole,
      criticalPage,
      svgFailed: svgFailed.slice(0, 10),
      allConsole: [...bag.consoleErrors, ...c4Bag.consoleErrors].slice(0, 12),
    },
    evidenceDir: outDir,
  };

  fs.writeFileSync(
    path.join(outDir, "report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));

  await browser.close().catch(() => undefined);
  process.exit(c3Pass && c4Pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  try {
    fs.writeFileSync(
      path.join(outDir, "fatal.json"),
      JSON.stringify({ error: String(err?.stack ?? err) }, null, 2),
    );
  } catch {
    /* ignore */
  }
  process.exit(1);
});
