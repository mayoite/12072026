import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CATALOG_SVG_GUEST_URL = "http://localhost:3000/planner/guest/";
export const START_PLACING_RE = /open planner/i;
export const CATALOG_SELECTOR = ".pw-catalog";
export const PREVIEW_SVG_SELECTOR = ".pw-catalog-block-preview svg";

export function analyzeCatalogSvgHtml(html) {
  return {
    hasPath: html.includes("<path"),
    hasPolyline: html.includes("<polyline"),
    hasVar: html.includes("var(--block"),
    hasHex: /fill="#[0-9a-f]{3,8}"/i.test(html),
  };
}

export function evaluateCatalogSvgInfo() {
  const svg = document.querySelector(".pw-catalog-block-preview svg");
  if (!svg) return { error: "no svg" };
  const html = svg.outerHTML;
  return {
    hasPath: html.includes("<path"),
    hasPolyline: html.includes("<polyline"),
    hasVar: html.includes("var(--block"),
    hasHex: /fill="#[0-9a-f]{3,8}"/i.test(html),
    childTags: [...new Set([...svg.querySelectorAll("*")].map((el) => el.tagName.toLowerCase()))],
    previews: document.querySelectorAll(".pw-catalog-block-preview svg").length,
  };
}

export async function verifyCatalogSvg(options = {}) {
  const {
    url = CATALOG_SVG_GUEST_URL,
    browserFactory = () => chromium.launch(),
  } = options;

  const browser = await browserFactory();
  const page = await browser.newPage();
  await page.goto(url, { timeout: 60000 });
  await page.getByRole("button", { name: START_PLACING_RE }).click();
  await page.waitForSelector(CATALOG_SELECTOR, { timeout: 60000 });
  await page.waitForTimeout(2000);

  const info = await page.evaluate(evaluateCatalogSvgInfo);
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
  return info;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return path.resolve(entry) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isDirectRun()) {
  verifyCatalogSvg().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
