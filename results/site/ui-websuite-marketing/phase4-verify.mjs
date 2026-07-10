/**
 * Phase 4 — marketing suite align proof (headless, isolated from shared Chrome).
 * Captures after screenshots + design-base class/isolation metrics.
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const playwrightPath = path.resolve(
  "D:/OandO07072026/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs",
);
const { chromium } = await import(pathToFileURL(playwrightPath).href);

const out = "D:/OandO07072026/results/site/ui-websuite-marketing";
const afterDir = path.join(out, "after");
fs.mkdirSync(afterDir, { recursive: true });

const routes = [
  { slug: "projects", url: "http://localhost:3000/projects/" },
  { slug: "trusted-by", url: "http://localhost:3000/trusted-by/" },
  { slug: "portfolio", url: "http://localhost:3000/portfolio/" },
];

async function dismissCookies(page) {
  try {
    const btn = page.getByRole("button", { name: /accept all/i });
    if (await btn.isVisible({ timeout: 1200 })) await btn.click();
  } catch {
    /* none */
  }
}

async function metrics(page) {
  return page.evaluate(() => {
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const badges = [...document.querySelectorAll(".client-badge")];
    const badgeWs = badges.map((b) => Math.round(b.getBoundingClientRect().width));
    const logos = [...document.querySelectorAll(".client-badge__logo")];
    const brokenLogos = logos.filter((i) => i.complete && i.naturalWidth === 0).length;
    const mediaBoxes = [...document.querySelectorAll(".portfolio-case__media")];
    const mediaIso = mediaBoxes.map((el) => ({
      isolation: cs(el)?.isolation,
      overflow: cs(el)?.overflow,
      position: cs(el)?.position,
      w: Math.round(el.getBoundingClientRect().width),
      h: Math.round(el.getBoundingClientRect().height),
      imgs: el.querySelectorAll("img").length,
    }));
    const mark = document.querySelector(".client-badge__mark");
    const trustKpis = document.querySelectorAll(".home-trust-kpi").length;
    const typLabels = document.querySelectorAll("main .typ-label").length;
    const typStats = document.querySelectorAll("main .typ-stat").length;
    const homeHeadings = document.querySelectorAll("main .home-heading").length;
    const pageCopy = document.querySelectorAll("main .page-copy").length;
    const homeShell = document.querySelectorAll(".home-shell-xl").length;
    const btnPrimary = document.querySelectorAll("main .btn-primary").length;
    const group = document.querySelector(".client-badge-group");
    const groupDense = document.querySelector(".client-badge-group--dense");

    return {
      href: location.href,
      title: document.title,
      badgeCount: badges.length,
      logoCount: logos.length,
      monogramCount: document.querySelectorAll(".client-badge__monogram").length,
      brokenLogos,
      badgeMinW: badgeWs.length ? Math.min(...badgeWs) : null,
      badgeMaxW: badgeWs.length ? Math.max(...badgeWs) : null,
      featuredCols: group ? cs(group).gridTemplateColumns : null,
      denseCols: groupDense ? cs(groupDense).gridTemplateColumns : null,
      trustKpis,
      typLabels,
      typStats,
      homeHeadings,
      pageCopy,
      homeShell,
      btnPrimary,
      markIsolation: mark ? cs(mark).isolation : null,
      mediaIso,
      portfolioCases: document.querySelectorAll(".portfolio-case").length,
      statsBlockLegacy: document.querySelectorAll("main .stats-block").length,
    };
  });
}

const browser = await chromium.launch({ headless: true });
const summary = {};

for (const route of routes) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(route.url, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookies(page);
  await page.waitForTimeout(800);

  const desktopPath = path.join(afterDir, `${route.slug}-desktop.png`);
  await page.screenshot({ path: desktopPath, fullPage: true });
  const viewportPath = path.join(out, `phase4-after-${route.slug}-viewport.png`);
  await page.screenshot({ path: viewportPath, fullPage: false });

  summary[route.slug] = {
    desktop: await metrics(page),
  };

  // Mid scroll for media/grid proof
  await page.evaluate(() => window.scrollTo(0, Math.min(900, document.body.scrollHeight * 0.25)));
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(afterDir, `${route.slug}-mid.png`),
    fullPage: false,
  });

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route.url, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookies(page);
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(afterDir, `${route.slug}-mobile.png`),
    fullPage: false,
  });
  summary[route.slug].mobile = await metrics(page);

  await context.close();
  console.log("ok", route.slug, JSON.stringify(summary[route.slug].desktop, null, 0).slice(0, 200));
}

fs.writeFileSync(path.join(out, "phase4-audit.json"), JSON.stringify(summary, null, 2));
await browser.close();
console.log("wrote", path.join(out, "phase4-audit.json"));
