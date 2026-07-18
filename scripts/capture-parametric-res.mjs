/**
 * Multi-resolution capture for parametric admin-cad (no Tailwind).
 * node scripts/capture-parametric-res.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.CAPTURE_BASE ?? "http://localhost:3000";
const OUT = join(process.cwd(), "results", "admin", "parametric-res");
const VIEWPORTS = [
  { w: 1980, h: 1080 },
  { w: 1680, h: 1050 },
  { w: 1440, h: 900 },
  { w: 1280, h: 800 },
  { w: 1024, h: 768 },
  { w: 390, h: 844 },
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];

try {
  for (let i = 0; i < VIEWPORTS.length; i++) {
    const { w, h } = VIEWPORTS[i];
    const page = await browser.newPage({
      viewport: { width: w, height: h },
      deviceScaleFactor: 1,
    });
    await page.goto(`${BASE}/admin/svg-editor/parametric/`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await page.waitForSelector('[data-testid="admin-linear-desk-parametric"]', {
      timeout: 45_000,
    });
    await page.waitForTimeout(500);

    const rel = `${String(i + 1).padStart(2, "0")}-${w}x${h}.png`;
    await page.screenshot({ path: join(OUT, rel), fullPage: false });

    const m = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const box = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          x: Math.round(b.x),
          y: Math.round(b.y),
          w: Math.round(b.width),
          h: Math.round(b.height),
        };
      };
      const root = q('[data-testid="admin-linear-desk-parametric"]');
      const plan = q(".admin-cad__plan");
      const form = q(".admin-cad__form");
      const railEl = q(".admin-cad__rail");
      const body = q(".admin-cad__body");
      const main = q(".shell-admin-main");
      const railBox = box(railEl);
      const formBox = box(form);
      const planBox = box(plan);
      // 32.jpg order: rail.x < form.x < plan.x
      const order32 =
        railBox && formBox && planBox
          ? railBox.x < formBox.x && formBox.x < planBox.x
          : false;
      return {
        chrome: root?.getAttribute("data-chrome"),
        lockImage: root?.getAttribute("data-lock-image"),
        classes: root?.className,
        hasRail: !!q('[data-testid="canvas-tool-rail"]'),
        preview: !!q('[data-testid="linear-desk-preview"]'),
        publish: !!q('[data-testid="linear-desk-publish"]'),
        chips: !!q('[data-testid="linear-desk-summary-chips"]'),
        rail: railBox,
        form: formBox,
        plan: planBox,
        bodyCols: body ? getComputedStyle(body).gridTemplateColumns : null,
        bodyAreas: body ? getComputedStyle(body).gridTemplateAreas : null,
        mainPad: main ? getComputedStyle(main).padding : null,
        rootBg: root ? getComputedStyle(root).backgroundColor : null,
        order32,
        planLeftOfForm:
          plan && form
            ? plan.getBoundingClientRect().x < form.getBoundingClientRect().x
            : null,
        sideBySide:
          plan && form
            ? Math.abs(
                plan.getBoundingClientRect().top - form.getBoundingClientRect().top,
              ) < 40
            : null,
      };
    });

    report.push({ index: i + 1, requested: `${w}x${h}`, file: `results/admin/parametric-res/${rel}`, ...m });
    await page.close();
    console.log(`OK ${i + 1}/6 ${w}x${h}`);
  }
} finally {
  await browser.close();
}

writeFileSync(join(OUT, "metrics.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
