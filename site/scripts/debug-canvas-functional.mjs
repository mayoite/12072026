import { chromium as defaultChromium } from "@playwright/test";

export const PLANNER_GUEST_URL = "http://localhost:3000/planner/guest/";
export const VIEWPORT = { width: 1440, height: 900 };

export function shouldCaptureConsoleType(type) {
  return ["error", "warning"].includes(type);
}

export function formatConsoleLine(type, text, max = 500) {
  return `${type}: ${String(text).slice(0, max)}`;
}

export async function runCanvasFunctionalDebug(deps = {}) {
  const chromium = deps.chromium ?? defaultChromium;
  const log = deps.log ?? console.log;
  const url = deps.url ?? PLANNER_GUEST_URL;
  const viewport = deps.viewport ?? VIEWPORT;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  const logs = [];
  page.on("console", (m) => {
    if (shouldCaptureConsoleType(m.type())) {
      logs.push(formatConsoleLine(m.type(), m.text()));
    }
  });
  page.on("pageerror", (e) => logs.push(`PAGE: ${e.message}`));

  await page.goto(url, { timeout: 90000 });
  const start = page.getByRole("button", { name: /start placing furniture/i });
  if ((await start.count()) > 0) {
    await start.click();
    await page.waitForSelector(".pw-workspace", { timeout: 60000 });
  }
  await page.waitForTimeout(3000);

  const layout = await page.evaluate(() => {
    const canvas = document.querySelector("#main");
    const wrap = document.querySelector(".canvas-wrap");
    const stage = document.querySelector(".fcw-stage-card");
    const pane2d = document.querySelector(".pw-view-stack__pane--2d");
    const chrome = document.querySelector(".pw-canvas-chrome-layer");
    const rect = canvas?.getBoundingClientRect();
    const centerEl = rect
      ? document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
      : null;
    return {
      canvas: rect
        ? {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          }
        : null,
      elementAtCenter: centerEl
        ? { tag: centerEl.tagName, id: centerEl.id, cls: centerEl.className?.slice?.(0, 80) }
        : null,
      wrap: wrap ? { w: wrap.clientWidth, h: wrap.clientHeight } : null,
      stage: stage ? { w: stage.clientWidth, h: stage.clientWidth } : null,
      pane2d: pane2d
        ? {
            active: pane2d.getAttribute("data-active"),
            pe: getComputedStyle(pane2d).pointerEvents,
            vis: getComputedStyle(pane2d).visibility,
          }
        : null,
      chromePE: chrome ? getComputedStyle(chrome).pointerEvents : null,
      zoom: document.querySelector(".zoom-control span")?.textContent?.trim(),
      hasApi: typeof window.__fabricExportDraft === "function",
      objects: (() => {
        try {
          return JSON.parse(window.__fabricExportDraft?.() || "{}").objects?.length ?? 0;
        } catch {
          return null;
        }
      })(),
    };
  });
  log("LAYOUT", JSON.stringify(layout, null, 2));

  const lineBtn = page.locator('button[title="Line"]');
  if ((await lineBtn.count()) > 0) {
    await lineBtn.first().click();
  }
  const box = await page.locator("#main").boundingBox();
  let afterObjects = layout.objects;
  if (box && box.width > 10 && box.height > 10) {
    await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.35);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.55);
    await page.mouse.up();
    await page.waitForTimeout(800);
    afterObjects = await page.evaluate(() => {
      try {
        return JSON.parse(window.__fabricExportDraft?.() || "{}").objects?.length;
      } catch {
        return "err";
      }
    });
  }

  log("OBJECTS", { before: layout.objects, after: afterObjects });
  if (logs.length) log("CONSOLE", logs);
  await browser.close();
  return { layout, afterObjects, logs };
}

function isMain() {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return entry.endsWith("debug-canvas-functional.mjs");
}

if (isMain()) {
  runCanvasFunctionalDebug().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
