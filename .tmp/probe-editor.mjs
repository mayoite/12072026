import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3200";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 } });
const p = await ctx.newPage();
await p.goto(BASE + "/admin/svg-editor/", { waitUntil: "networkidle", timeout: 120000 });
await p.waitForTimeout(2000);
console.log("TITLE:", await p.title());
// headings
const heads = await p.locator("h1,h2,h3").allInnerTexts().catch(() => []);
console.log("HEADINGS:", JSON.stringify(heads.slice(0, 25)));
// buttons
const btns = await p.locator("button").allInnerTexts().catch(() => []);
console.log("BUTTONS:", JSON.stringify(btns.map((t) => t.trim()).filter(Boolean).slice(0, 40)));
// tabs / roles
const tabs = await p.locator("[role=tab]").allInnerTexts().catch(() => []);
console.log("TABS:", JSON.stringify(tabs));
// list items that look like descriptors/slugs
const listText = await p.locator("[data-testid], li, [role=listitem]").allInnerTexts().catch(() => []);
console.log("LIST-SAMPLE:", JSON.stringify(listText.map((t) => t.trim()).filter(Boolean).slice(0, 20)));
// any svg elements rendered
const svgCount = await p.locator("svg").count();
console.log("INLINE SVG COUNT:", svgCount);
// data-testids
const testids = await p.evaluate(() => Array.from(document.querySelectorAll("[data-testid]")).map((e) => e.getAttribute("data-testid")).slice(0, 40));
console.log("TESTIDS:", JSON.stringify(testids));
await ctx.close();
await b.close();
