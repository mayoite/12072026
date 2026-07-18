/**
 * Capture main product pages at exactly 1920×1080 (viewport screenshots).
 *
 * Usage (repo root):
 *   node scripts/screenshot-all-pages-1920.mjs
 *
 * Requires: Playwright Chromium (`pnpm --filter oando-site run test:browsers:install`)
 * Dev server: http://localhost:3000 (start with `pnpm run dev` if down)
 * Admin: DEV_AUTH_BYPASS in .env.local when present
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { forceLocalhostOrigin } from "./lib/forceLocalhostOrigin.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/** Always localhost — never 127.0.0.1 (you and agents must share one origin). */
const BASE = forceLocalhostOrigin(
  process.env.SCREENSHOT_BASE_URL || process.env.PLAYWRIGHT_BASE_URL,
);
const OUT_DIR = path.join(ROOT, "results", "screenshots", "1920x1080");
const MANIFEST_PATH = path.join(OUT_DIR, "manifest.json");
const VIEWPORT = { width: 1920, height: 1080 };
const PAGE_TIMEOUT_MS = 45_000;
const SETTLE_MS = 1_200;
const NETWORK_IDLE_MS = 4_000;
const MAX_SITE = 15;
const MAX_ADMIN = 12;

/** Seed site routes (marketing main pages). Crawl may add product/category paths. */
const SITE_SEEDS = [
  "/",
  "/products",
  "/products/seating",
  "/products/workstations",
  "/products/tables",
  "/solutions",
  "/solutions/seating",
  "/planning",
  "/about",
  "/contact",
  "/portfolio",
  "/projects",
  "/showrooms",
  "/compare",
  "/planner",
];

/** Admin shell nav (from site/features/admin/ui/adminNav.ts) + parametric. Cap MAX_ADMIN. */
const ADMIN_SEEDS = [
  "/admin",
  "/admin/svg-editor",
  "/admin/svg-editor/parametric",
  "/admin/plans",
  "/admin/features",
  "/admin/analytics",
  "/admin/catalog",
  "/admin/planner-catalog",
  "/admin/workspace-catalog",
  "/admin/price-books",
  "/admin/crm",
  "/admin/crm/clients",
  "/admin/crm/projects",
  "/admin/crm/quotes",
  "/admin/customer-queries",
  "/admin/settings",
  "/admin/themes",
  "/admin/inventory",
];

const PLANNER_SEEDS = ["/planner/guest/"];

const SKIP_PATH_RE =
  /\/(api|logout|login|PROTECTED|auth)(\/|$)|[?#].*utm_|javascript:/i;

function normalizePath(href, base = BASE) {
  try {
    const u = new URL(href, base);
    if (u.origin !== new URL(base).origin) return null;
    let p = u.pathname;
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    if (SKIP_PATH_RE.test(p) || SKIP_PATH_RE.test(u.href)) return null;
    return p || "/";
  } catch {
    return null;
  }
}

function safeFilename(routePath) {
  const raw = routePath === "/" ? "home" : routePath.replace(/^\//, "");
  return (
    raw
      .replace(/[^a-zA-Z0-9._-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 120) || "page"
  );
}

function uniqueRoutes(paths, max) {
  const seen = new Set();
  const out = [];
  for (const p of paths) {
    const n = normalizePath(p) ?? (p.startsWith("/") ? p.replace(/\/$/, "") || "/" : null);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    out.push(n);
    if (out.length >= max) break;
  }
  return out;
}

async function ensureServer() {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(8_000) });
    if (!res.ok && res.status >= 500) {
      throw new Error(`Server returned ${res.status}`);
    }
  } catch (err) {
    throw new Error(
      `Dev server not reachable at ${BASE}. Start with: pnpm run dev\n${err?.message ?? err}`,
    );
  }
}

async function crawlSiteLinks(page, seeds) {
  const discovered = [...seeds];
  const crawlTargets = ["/", "/products"].map((p) =>
    p === "/" ? BASE + "/" : `${BASE}${p}`,
  );

  for (const url of crawlTargets) {
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: PAGE_TIMEOUT_MS,
      });
      await page.waitForTimeout(800);
      const hrefs = await page.evaluate(() => {
        const out = [];
        const selectors = [
          "header a[href]",
          "nav a[href]",
          "[role=navigation] a[href]",
          "main a[href]",
          "footer a[href]",
        ];
        for (const sel of selectors) {
          for (const a of document.querySelectorAll(sel)) {
            const h = a.getAttribute("href");
            if (h) out.push(h);
          }
        }
        return out;
      });
      for (const h of hrefs) {
        const n = normalizePath(h, page.url());
        if (!n) continue;
        // Prefer main product / category / marketing paths
        if (
          n === "/" ||
          n.startsWith("/products") ||
          n.startsWith("/solutions") ||
          n.startsWith("/planning") ||
          n.startsWith("/about") ||
          n.startsWith("/contact") ||
          n.startsWith("/portfolio") ||
          n.startsWith("/projects") ||
          n.startsWith("/showrooms") ||
          n.startsWith("/compare") ||
          n.startsWith("/planner") ||
          n.startsWith("/catalog") ||
          n.startsWith("/gallery") ||
          n.startsWith("/service") ||
          n.startsWith("/templates")
        ) {
          discovered.push(n);
        }
      }
    } catch (err) {
      console.warn(`crawl failed for ${url}:`, err?.message ?? err);
    }
  }
  return uniqueRoutes(discovered, MAX_SITE);
}

async function capturePage(page, routePath, group) {
  const url = routePath === "/" ? `${BASE}/` : `${BASE}${routePath}`;
  const fileBase = `${group}_${safeFilename(routePath)}`;
  const fileName = `${fileBase}.png`;
  const filePath = path.join(OUT_DIR, fileName);
  const relativePath = path
    .relative(ROOT, filePath)
    .split(path.sep)
    .join("/");

  const consoleErrors = [];
  const onConsole = (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 500));
  };
  const onPageError = (err) => {
    consoleErrors.push(String(err?.message ?? err).slice(0, 500));
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  const entry = {
    group,
    url,
    path: routePath,
    file: relativePath,
    status: null,
    finalUrl: null,
    ok: false,
    error: null,
    consoleErrors: 0,
    consoleErrorSamples: [],
    durationMs: 0,
  };

  const t0 = Date.now();
  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_TIMEOUT_MS,
    });
    entry.status = response?.status() ?? null;
    entry.finalUrl = page.url();

    // Prefer networkidle when fast; fall back after short wait
    try {
      await page.waitForLoadState("networkidle", { timeout: NETWORK_IDLE_MS });
    } catch {
      /* settle anyway */
    }
    await page.waitForTimeout(SETTLE_MS);

    await page.screenshot({
      path: filePath,
      fullPage: false,
      type: "png",
    });

    entry.ok = true;
    entry.consoleErrors = consoleErrors.length;
    entry.consoleErrorSamples = consoleErrors.slice(0, 5);
  } catch (err) {
    entry.ok = false;
    entry.error = String(err?.message ?? err).slice(0, 800);
    entry.consoleErrors = consoleErrors.length;
    entry.consoleErrorSamples = consoleErrors.slice(0, 5);
    // Best-effort screenshot on failure
    try {
      if (!fs.existsSync(filePath)) {
        await page.screenshot({
          path: filePath,
          fullPage: false,
          type: "png",
        });
      }
    } catch {
      /* ignore */
    }
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    entry.durationMs = Date.now() - t0;
  }

  const mark = entry.ok ? "OK" : "FAIL";
  console.log(
    `[${mark}] ${routePath} → ${fileName} status=${entry.status} consoleErrors=${entry.consoleErrors}${entry.error ? ` err=${entry.error}` : ""}`,
  );
  return entry;
}

async function main() {
  await ensureServer();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Clear previous PNGs in this folder (keep dir)
  for (const name of fs.readdirSync(OUT_DIR)) {
    if (name.endsWith(".png") || name === "manifest.json") {
      fs.unlinkSync(path.join(OUT_DIR, name));
    }
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(PAGE_TIMEOUT_MS);

  const pages = [];

  console.log("--- crawl site nav ---");
  const siteRoutes = await crawlSiteLinks(page, SITE_SEEDS);
  console.log(`site routes (${siteRoutes.length}):`, siteRoutes.join(", "));

  console.log("--- capture site ---");
  for (const r of siteRoutes) {
    pages.push(await capturePage(page, r, "site"));
  }

  const adminRoutes = uniqueRoutes(ADMIN_SEEDS, MAX_ADMIN);
  // Ensure required admin routes are present even if over cap order
  for (const required of [
    "/admin",
    "/admin/svg-editor",
    "/admin/svg-editor/parametric",
  ]) {
    if (!adminRoutes.includes(required)) {
      if (adminRoutes.length >= MAX_ADMIN) adminRoutes.pop();
      adminRoutes.unshift(required);
    }
  }
  const adminFinal = uniqueRoutes(adminRoutes, MAX_ADMIN);
  console.log(`--- capture admin (${adminFinal.length}) ---`);
  for (const r of adminFinal) {
    pages.push(await capturePage(page, r, "admin"));
  }

  console.log("--- capture planner ---");
  for (const r of PLANNER_SEEDS) {
    const n = normalizePath(r) || r.replace(/\/$/, "") || r;
    pages.push(await capturePage(page, n, "planner"));
  }

  await browser.close();

  const ok = pages.filter((p) => p.ok).length;
  const fail = pages.filter((p) => !p.ok).length;
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE,
    viewport: VIEWPORT,
    fullPage: false,
    outDir: path.relative(ROOT, OUT_DIR).split(path.sep).join("/"),
    summary: {
      total: pages.length,
      ok,
      fail,
      byGroup: {
        site: pages.filter((p) => p.group === "site").length,
        admin: pages.filter((p) => p.group === "admin").length,
        planner: pages.filter((p) => p.group === "planner").length,
      },
    },
    pages,
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("\n=== summary ===");
  console.log(JSON.stringify(manifest.summary, null, 2));
  console.log(`manifest: ${path.relative(ROOT, MANIFEST_PATH)}`);
  console.log(`screenshots: ${OUT_DIR}`);

  if (fail > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
