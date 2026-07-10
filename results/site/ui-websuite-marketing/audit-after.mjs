import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const require = createRequire(import.meta.url);
const playwrightPath = path.resolve(
  "D:/OandO07072026/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs",
);
const { chromium } = await import(pathToFileURL(playwrightPath).href);

const out = "D:/OandO07072026/results/site/ui-websuite-marketing";
fs.mkdirSync(path.join(out, "after"), { recursive: true });
fs.mkdirSync(path.join(out, "after"), { recursive: true });

const pages = [
  { slug: "projects", url: "http://localhost:3000/projects/" },
  { slug: "portfolio", url: "http://localhost:3000/portfolio/" },
  { slug: "trusted-by", url: "http://localhost:3000/trusted-by/" },
  { slug: "contact", url: "http://localhost:3000/contact/" },
];

async function dismissCookies(page) {
  try {
    const btn = page.getByRole("button", { name: /accept all/i });
    if (await btn.isVisible({ timeout: 1500 })) await btn.click();
  } catch {
    /* no banner */
  }
}

async function audit(page) {
  return page.evaluate(() => {
    const badges = [...document.querySelectorAll(".client-badge")];
    const logos = [...document.querySelectorAll(".client-badge__logo")];
    const monograms = [...document.querySelectorAll(".client-badge__monogram")];
    const logoInfo = logos.map((img) => {
      const r = img.getBoundingClientRect();
      return {
        name:
          img.closest(".client-badge")?.querySelector(".client-badge__name")
            ?.textContent || "",
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
        w: Math.round(r.width),
        h: Math.round(r.height),
        broken: img.complete && img.naturalWidth === 0,
        opacity: getComputedStyle(img).opacity,
      };
    });
    const media = [...document.querySelectorAll("main img, main video")].map(
      (el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          cls: (el.className || "").toString().slice(0, 80),
          w: Math.round(r.width),
          h: Math.round(r.height),
          naturalW: el.naturalWidth || 0,
          naturalH: el.naturalHeight || 0,
          broken:
            el.tagName === "IMG" && el.complete && el.naturalWidth === 0,
        };
      },
    );
    const zeroMedia = media.filter((m) => m.w === 0 || m.h === 0);
    const badgeSizes = badges.map((b) => {
      const r = b.getBoundingClientRect();
      return {
        name: b.querySelector(".client-badge__name")?.textContent || "",
        w: Math.round(r.width),
        h: Math.round(r.height),
        hasLogo: !!b.querySelector(".client-badge__logo"),
        hasMono: !!b.querySelector(".client-badge__monogram"),
      };
    });
    let overlaps = 0;
    for (let i = 0; i < badges.length; i++) {
      const a = badges[i].getBoundingClientRect();
      for (let j = i + 1; j < Math.min(badges.length, i + 8); j++) {
        const b = badges[j].getBoundingClientRect();
        const o = !(
          a.right <= b.left + 1 ||
          a.left >= b.right - 1 ||
          a.bottom <= b.top + 1 ||
          a.top >= b.bottom - 1
        );
        if (o && a.width > 0 && b.width > 0) overlaps++;
      }
    }
    const grids = [...document.querySelectorAll("main .grid")].map((g) => {
      const r = g.getBoundingClientRect();
      const cs = getComputedStyle(g);
      const kids = [...g.children].map((c) => {
        const cr = c.getBoundingClientRect();
        return { w: Math.round(cr.width), h: Math.round(cr.height) };
      });
      return {
        className: g.className.toString().slice(0, 140),
        cols: cs.gridTemplateColumns,
        gap: cs.gap,
        w: Math.round(r.width),
        childCount: g.children.length,
        minChildW: kids.length ? Math.min(...kids.map((k) => k.w)) : null,
        minChildH: kids.length ? Math.min(...kids.map((k) => k.h)) : null,
      };
    });
    const nameOverflow = badges
      .map((b) => {
        const name = b.querySelector(".client-badge__name");
        if (!name) return null;
        return {
          name: name.textContent,
          overflows: name.scrollWidth > name.clientWidth + 1,
          sw: name.scrollWidth,
          cw: name.clientWidth,
        };
      })
      .filter((x) => x && x.overflows);

    // portfolio article image cells
    const articles = [...document.querySelectorAll("main article")].map(
      (art) => {
        const title = art.querySelector("h2")?.textContent || "";
        const cells = [...art.querySelectorAll(".relative")].map((el) => {
          const r = el.getBoundingClientRect();
          const img = el.querySelector("img");
          return {
            w: Math.round(r.width),
            h: Math.round(r.height),
            imgW: img ? Math.round(img.getBoundingClientRect().width) : 0,
            imgH: img ? Math.round(img.getBoundingClientRect().height) : 0,
            imgNatural: img ? img.naturalWidth : 0,
          };
        });
        return { title, cells };
      },
    );

    return {
      path: location.pathname,
      title: document.title,
      badgeCount: badges.length,
      logoCount: logos.length,
      monogramCount: monograms.length,
      brokenLogos: logoInfo.filter((l) => l.broken),
      zeroSizeLogos: logoInfo.filter((l) => l.w === 0 || l.h === 0),
      logoSample: logoInfo.slice(0, 8),
      monogramNames: badgeSizes
        .filter((b) => b.hasMono)
        .map((b) => b.name)
        .slice(0, 20),
      badgeW: badgeSizes.length
        ? {
            min: Math.min(...badgeSizes.map((b) => b.w)),
            max: Math.max(...badgeSizes.map((b) => b.w)),
          }
        : null,
      badgeH: badgeSizes.length
        ? {
            min: Math.min(...badgeSizes.map((b) => b.h)),
            max: Math.max(...badgeSizes.map((b) => b.h)),
          }
        : null,
      overlaps,
      nameOverflow,
      zeroMedia: zeroMedia.slice(0, 20),
      mediaCount: media.length,
      mediaSample: media.slice(0, 10),
      grids: grids.slice(0, 12),
      articles: articles.slice(0, 6),
      mainH: document.querySelector("main")?.getBoundingClientRect().height || 0,
    };
  });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
const report = {};

for (const p of pages) {
  await page.goto(p.url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(600);
  await dismissCookies(page);
  report[p.slug] = { desktop: await audit(page) };
  await page.screenshot({
    path: path.join(out, "after", `${p.slug}-desktop.png`),
    fullPage: false,
  });
  await page.evaluate(() =>
    window.scrollTo(0, Math.min(1000, document.body.scrollHeight / 3)),
  );
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(out, "after", `${p.slug}-mid.png`),
    fullPage: false,
  });
}

await page.setViewportSize({ width: 390, height: 844 });
for (const p of pages.slice(0, 3)) {
  await page.goto(p.url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);
  await dismissCookies(page);
  report[p.slug].mobile = await audit(page);
  await page.screenshot({
    path: path.join(out, "after", `${p.slug}-mobile.png`),
    fullPage: false,
  });
  await page.evaluate(() => {
    const b = document.querySelector(".client-badge, article, main h1");
    if (b) b.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(out, "after", `${p.slug}-mobile-mid.png`),
    fullPage: false,
  });
}

await page.setViewportSize({ width: 768, height: 1024 });
for (const p of pages.slice(0, 3)) {
  await page.goto(p.url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(400);
  await dismissCookies(page);
  report[p.slug].tablet = await audit(page);
  await page.screenshot({
    path: path.join(out, "after", `${p.slug}-tablet.png`),
    fullPage: false,
  });
}

fs.writeFileSync(
  path.join(out, "after", "audit.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
