/**
 * Side-by-side: 32.jpg (lock) | live parametric screenshot
 * node scripts/compare-32-live.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const BASE = process.env.CAPTURE_BASE ?? "http://localhost:3000";
const OUT = join(process.cwd(), "results", "admin", "parametric-res");
const LOCK = join(
  process.cwd(),
  "docs",
  "ui-benchmarks",
  "parametric-lock",
  "32.jpg",
);

mkdirSync(OUT, { recursive: true });

if (!existsSync(LOCK)) {
  console.error("Missing lock image:", LOCK);
  process.exit(1);
}

const livePath = join(OUT, "COMPARE-live-now.png");
const sidePath = join(OUT, "COMPARE-32-vs-live-sidebyside.png");

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  });
  await page.goto(`${BASE}/admin/svg-editor/parametric/`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForSelector('[data-testid="admin-linear-desk-parametric"]', {
    timeout: 45_000,
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: livePath, fullPage: false });
} finally {
  await browser.close();
}

const TARGET_H = 900;
const GAP = 16;
const LABEL_H = 36;

const lockMeta = await sharp(LOCK).metadata();
const liveMeta = await sharp(livePath).metadata();

const lockW = Math.round((TARGET_H * (lockMeta.width ?? 1600)) / (lockMeta.height ?? 900));
const liveW = Math.round((TARGET_H * (liveMeta.width ?? 1600)) / (liveMeta.height ?? 900));

const lockBuf = await sharp(LOCK)
  .resize(lockW, TARGET_H, { fit: "contain", background: { r: 30, g: 30, b: 36, alpha: 1 } })
  .png()
  .toBuffer();
const liveBuf = await sharp(livePath)
  .resize(liveW, TARGET_H, { fit: "contain", background: { r: 30, g: 30, b: 36, alpha: 1 } })
  .png()
  .toBuffer();

const totalW = lockW + GAP + liveW;
const totalH = LABEL_H + TARGET_H;

// simple label bars via SVG overlays
const leftLabel = Buffer.from(
  `<svg width="${lockW}" height="${LABEL_H}">
    <rect width="100%" height="100%" fill="#1b2940"/>
    <text x="16" y="24" fill="#fff" font-family="Segoe UI, system-ui, sans-serif" font-size="16" font-weight="600">32.jpg LOCK (target)</text>
  </svg>`,
);
const rightLabel = Buffer.from(
  `<svg width="${liveW}" height="${LABEL_H}">
    <rect width="100%" height="100%" fill="#1b2940"/>
    <text x="16" y="24" fill="#fff" font-family="Segoe UI, system-ui, sans-serif" font-size="16" font-weight="600">LIVE /admin/svg-editor/parametric/</text>
  </svg>`,
);

await sharp({
  create: {
    width: totalW,
    height: totalH,
    channels: 3,
    background: { r: 24, g: 28, b: 34 },
  },
})
  .composite([
    { input: leftLabel, left: 0, top: 0 },
    { input: rightLabel, left: lockW + GAP, top: 0 },
    { input: lockBuf, left: 0, top: LABEL_H },
    { input: liveBuf, left: lockW + GAP, top: LABEL_H },
  ])
  .png()
  .toFile(sidePath);

// facts for honesty
const facts = {
  lock: LOCK,
  live: livePath,
  sideBySide: sidePath,
  note: "Left = owner lock 32.jpg. Right = live localhost:3000 parametric.",
};
writeFileSync(join(OUT, "COMPARE-32-vs-live-facts.json"), JSON.stringify(facts, null, 2));
console.log(JSON.stringify(facts, null, 2));
