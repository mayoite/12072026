import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = __dirname;
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

function measure() {
  return page.evaluate(() => {
    const cta = Array.from(document.querySelectorAll("header button")).find((el) =>
      (el.getAttribute("aria-label") || el.textContent || "").includes("Guided"),
    );
    const r = cta?.getBoundingClientRect();
    const nav = Array.from(
      document.querySelectorAll(
        'nav[aria-label="Primary navigation"] a, nav[aria-label="Primary navigation"] button',
      ),
    ).map((el) => (el.textContent || "").trim().replace(/\s+/g, " "));
    return {
      title: document.title,
      url: location.pathname,
      nav,
      cta: r
        ? {
            right: Math.round(r.right),
            left: Math.round(r.left),
            w: Math.round(r.width),
            clipped: r.right > innerWidth + 1,
          }
        : null,
      vw: innerWidth,
      overflowX:
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      hasFooter: !!document.querySelector("footer"),
    };
  });
}

async function shot(url, name) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("header", { timeout: 30000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(out, name), fullPage: false });
  return measure();
}

const results = {};
results.home = await shot("http://localhost:3000/", "home-viewport.png");
results.solutions = await shot("http://localhost:3000/solutions/", "solutions-viewport.png");
results.contact = await shot("http://localhost:3000/contact/", "contact-viewport.png");

await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector('button[aria-controls="header-more-menu"]', { timeout: 30000 });
await page.locator('button[aria-controls="header-more-menu"]').hover();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(out, "home-more-menu.png") });
results.moreMenu = await page.evaluate(() => {
  const menu = document.getElementById("header-more-menu");
  return {
    open: !!menu,
    items: menu
      ? Array.from(menu.querySelectorAll("[role=menuitem]")).map((a) => ({
          t: (a.textContent || "").trim(),
          h: a.getAttribute("href"),
        }))
      : [],
  };
});

await page.setViewportSize({ width: 1280, height: 800 });
results.home1280 = await shot("http://localhost:3000/", "home-1280.png");

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector('button[aria-label="Open menu"]', { timeout: 30000 });
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(out, "home-mobile.png") });
await page.click('button[aria-label="Open menu"]');
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(out, "home-mobile-drawer.png") });
results.mobile = {
  drawerLinks: await page.evaluate(() =>
    Array.from(document.querySelectorAll("a"))
      .map((a) => (a.textContent || "").trim())
      .filter(Boolean)
      .slice(0, 40),
  ),
};

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector("footer", { timeout: 30000 });
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(out, "home-full.png"), fullPage: true });

fs.writeFileSync(path.join(out, "metrics.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
