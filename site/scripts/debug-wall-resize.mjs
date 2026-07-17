import { chromium as defaultChromium } from "@playwright/test";

export const DEFAULT_PLANNER_URL = "http://localhost:3000/planner/guest/";
export const VIEWPORT = { width: 1440, height: 900 };

export function wallDragPoints(box) {
  if (!box || box.width < 10 || box.height < 10) return null;
  const x1 = box.x + box.width * 0.5;
  const y1 = box.y + box.height * 0.12;
  return { x1, y1, x2: x1, y2: y1 + 40 };
}

export async function runWallResizeDebug(deps = {}) {
  const chromium = deps.chromium ?? defaultChromium;
  const log = deps.log ?? console.log;
  const url = deps.url ?? (process.env.PLANNER_URL || DEFAULT_PLANNER_URL);
  const viewport = deps.viewport ?? VIEWPORT;
  const exit = deps.exit ?? ((code) => process.exit(code));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });

  await page.goto(url, { timeout: 90000 });
  const start = page.getByRole("button", { name: /open planner/i });
  if ((await start.count()) > 0) {
    await start.click();
    await page.waitForSelector(".pw-workspace", { timeout: 60000 });
  }
  await page.waitForTimeout(2000);

  const editBtn = page.locator('button:has-text("Edit room")');
  if ((await editBtn.count()) > 0) {
    await editBtn.first().click();
    await page.waitForTimeout(500);
  } else {
    log("note: Edit room button not visible — will click wall to enter edit mode");
  }

  const before = await page.evaluate(() => {
    const draft = JSON.parse(window.__fabricExportDraft?.() || "{}");
    const corners = (draft.objects || []).filter((o) => o.name === "CORNER");
    return corners.map((c) => ({ top: c.top, left: c.left }));
  });
  log("corners before", JSON.stringify(before));

  const box = await page.locator("#main").boundingBox();
  if (!box || box.width < 10) {
    log("FAIL: canvas not found");
    await browser.close();
    exit(1);
    return { ok: false, before, after: null };
  }

  const drag = wallDragPoints(box);
  await page.mouse.move(drag.x1, drag.y1);
  await page.mouse.down();
  await page.mouse.move(drag.x2, drag.y2, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(800);

  const after = await page.evaluate(() => {
    const draft = JSON.parse(window.__fabricExportDraft?.() || "{}");
    const corners = (draft.objects || []).filter((o) => o.name === "CORNER");
    return corners.map((c) => ({ top: c.top, left: c.left }));
  });
  log("corners after", JSON.stringify(after));
  await browser.close();
  return { ok: true, before, after, box, drag };
}

function isMain() {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return entry.endsWith("debug-wall-resize.mjs");
}

if (isMain()) {
  runWallResizeDebug().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
