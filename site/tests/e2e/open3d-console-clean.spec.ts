/**
 * Benchmark quality — after open3d load, known catalog preview SVGs must not 404.
 * Tracks Playwright requestfinished + console errors for:
 *   - proof-chair.svg
 *   - placeholder-cabinet.svg
 *
 * Evidence: results/planner/benchmark-quality/tw2/
 */
import { expect, test, type Page, type ConsoleMessage } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import {
  clearPlannerStorageInPage,
  enterGuestPlannerWorkspace,
} from "./guestProjectSetup";
import { waitForPlannerCanvas } from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "benchmark-quality",
  "tw2",
);

/** Controllable console 404s — demo/proof catalog thumbs referenced by open3d. */
const KNOWN_ASSET_PATHS = [
  "/proof-chair.svg",
  "/placeholder-cabinet.svg",
] as const;

function urlMatchesKnownAsset(url: string): string | null {
  for (const assetPath of KNOWN_ASSET_PATHS) {
    if (url.includes(assetPath)) return assetPath;
  }
  return null;
}

type AssetHit = {
  url: string;
  assetPath: string;
  status: number;
};

async function attachKnownAssetMonitors(page: Page): Promise<{
  hits: AssetHit[];
  notFound: AssetHit[];
  consoleErrorsForAssets: string[];
  consoleErrors: string[];
}> {
  const hits: AssetHit[] = [];
  const notFound: AssetHit[] = [];
  const consoleErrorsForAssets: string[] = [];
  const consoleErrors: string[] = [];

  page.on("requestfinished", async (request) => {
    const url = request.url();
    const assetPath = urlMatchesKnownAsset(url);
    if (!assetPath) return;
    try {
      const response = await request.response();
      const status = response?.status() ?? 0;
      const hit: AssetHit = { url, assetPath, status };
      hits.push(hit);
      if (status === 404) notFound.push(hit);
    } catch {
      // Response may be unavailable after navigation; ignore.
    }
  });

  page.on("response", (response) => {
    const url = response.url();
    const assetPath = urlMatchesKnownAsset(url);
    if (!assetPath) return;
    const status = response.status();
    // Dedupe with requestfinished; still catch any missed path.
    if (status === 404 && !notFound.some((h) => h.url === url && h.status === 404)) {
      notFound.push({ url, assetPath, status });
    }
  });

  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    consoleErrors.push(text);
    if (KNOWN_ASSET_PATHS.some((p) => text.includes(p.replace(/^\//, "")))) {
      consoleErrorsForAssets.push(text);
    }
  });

  return { hits, notFound, consoleErrorsForAssets, consoleErrors };
}

function writeEvidence(
  name: string,
  payload: Record<string, unknown>,
): void {
  fs.mkdirSync(EVIDENCE, { recursive: true });
  fs.writeFileSync(
    path.join(EVIDENCE, name),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  );
}

test.describe("open3d console clean — known preview SVG 404s", () => {
  test("after open3d load, proof-chair.svg and placeholder-cabinet.svg are not 404", async ({
    page,
  }) => {
    fs.mkdirSync(EVIDENCE, { recursive: true });

    const monitors = await attachKnownAssetMonitors(page);

    // Open3d stack via guest host (same FeasibilityCanvas + demo catalog previews).
    // Also warm /planner/open3d so both entrypoints are exercised in network log.
    await page.goto("/planner/open3d/?plannerDevTools=1", {
      waitUntil: "domcontentloaded",
    });
    await clearPlannerStorageInPage(page);
    await page.goto("/planner/guest/?plannerDevTools=1", {
      waitUntil: "domcontentloaded",
    });
    await enterGuestPlannerWorkspace(page, {
      projectName: "TW2 console-clean",
      preservePlannerState: true,
      navigate: false,
    });

    await waitForPlannerCanvas(page);
    const topbar = page.locator(".pw-topbar");
    await expect(topbar).toBeVisible({ timeout: 25_000 });

    // Catalog region loads demo thumbs that reference the known SVGs.
    const search = page.getByLabel("Search catalog elements");
    await expect(search).toBeVisible({ timeout: 15_000 });
    // Nudge catalog to materialize preview images (proof chair / cabinet).
    await search.fill("chair");
    await page.waitForTimeout(800);
    await search.fill("cabinet");
    await page.waitForTimeout(800);

    // Explicit fetch proof: if page never requested them, still assert HTTP status.
    for (const assetPath of KNOWN_ASSET_PATHS) {
      const res = await page.request.get(assetPath);
      expect(
        res.status(),
        `direct GET ${assetPath} must not be 404`,
      ).not.toBe(404);
      expect(res.ok(), `direct GET ${assetPath} should be ok`).toBe(true);
    }

    // Settle network for any late img loads.
    await page.waitForTimeout(1_000);

    await page.screenshot({
      path: path.join(EVIDENCE, "01-open3d-loaded.png"),
      fullPage: false,
    });

    const report = {
      capturedAt: new Date().toISOString(),
      route: page.url(),
      knownAssetPaths: [...KNOWN_ASSET_PATHS],
      networkHits: monitors.hits,
      notFound404: monitors.notFound,
      consoleErrorsForAssets: monitors.consoleErrorsForAssets,
      consoleErrorCount: monitors.consoleErrors.length,
      consoleErrorsSample: monitors.consoleErrors.slice(0, 20),
    };
    writeEvidence("console-clean-report.json", report);

    expect(
      monitors.notFound,
      `known assets must not 404 via requestfinished/response: ${JSON.stringify(monitors.notFound)}`,
    ).toEqual([]);

    expect(
      monitors.consoleErrorsForAssets,
      `console must not report 404 for known assets: ${JSON.stringify(monitors.consoleErrorsForAssets)}`,
    ).toEqual([]);

    writeEvidence("run.json", {
      test: "open3d-console-clean",
      result: "pass",
      notFound404Count: monitors.notFound.length,
      consoleErrorsForAssetsCount: monitors.consoleErrorsForAssets.length,
      networkHitCount: monitors.hits.length,
      capturedAt: report.capturedAt,
    });
  });
});
