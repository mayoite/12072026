import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:3000/planner/guest/?plannerDevTools=1", {
  waitUntil: "domcontentloaded",
  timeout: 60_000,
});
await page.waitForTimeout(2000);

const setup = page.getByRole("heading", { name: /Set up your space/i });
if (await setup.isVisible().catch(() => false)) {
  await page.getByLabel("Project name").fill("Wall debug");
  await page.getByRole("button", { name: /Start placing furniture/i }).click();
}
const scratch = page.getByRole("button", { name: /Start from Scratch/i });
if (await scratch.isVisible({ timeout: 5000 }).catch(() => false)) {
  await scratch.click();
}
await page.locator(".pw-topbar").waitFor({ timeout: 25_000 });
await page
  .locator('[data-testid="planner-2d-canvas"] canvas')
  .waitFor({ timeout: 25_000 });

const wallsBefore = await page.evaluate(() => {
  const t = document.body.innerText;
  const m = t.match(/(\d+)\s+walls/i);
  return m ? Number(m[1]) : -1;
});
const wallBtn = page
  .getByRole("group", { name: "Drawing tools" })
  .getByRole("button", { name: /^Wall/ });
await wallBtn.click();
const pressed = await wallBtn.getAttribute("aria-pressed");
const canvas = page.locator('[data-testid="planner-2d-canvas"] canvas');
const box = await canvas.boundingBox();
console.log(JSON.stringify({ wallsBefore, pressed, box }));

const p1 = { x: box.x + box.width * 0.32, y: box.y + box.height * 0.4 };
const p2 = { x: box.x + box.width * 0.68, y: box.y + box.height * 0.4 };

const hit = await page.evaluate(({ x, y }) => {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  return {
    tag: el.tagName,
    cls: el.className?.toString?.()?.slice?.(0, 80),
    testid:
      el.getAttribute("data-testid") ||
      el.parentElement?.getAttribute("data-testid"),
    label: el.getAttribute("aria-label"),
  };
}, p1);
console.log(JSON.stringify({ hit, p1, p2 }));

await page.mouse.move(p1.x, p1.y);
await page.mouse.down();
await page.waitForTimeout(150);
await page.mouse.up();
await page.waitForTimeout(300);
await page.mouse.move(p2.x, p2.y);
await page.mouse.down();
await page.waitForTimeout(150);
await page.mouse.up();
await page.waitForTimeout(1000);

const wallsAfter = await page.evaluate(() => {
  const t = document.body.innerText;
  const m = t.match(/(\d+)\s+walls/i);
  return m ? Number(m[1]) : -1;
});
const outcome = await page.evaluate(() => {
  const region = document.querySelector('[data-testid="planner-2d-canvas"]');
  return {
    wallsAfterText: document.body.innerText.match(/(\d+)\s+walls/i)?.[0],
    canvasText: region?.textContent?.slice(0, 120),
  };
});
console.log(JSON.stringify({ wallsAfter, outcome }));
await browser.close();
process.exit(wallsAfter > wallsBefore ? 0 : 2);
