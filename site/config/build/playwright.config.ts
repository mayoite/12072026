import { defineConfig, devices } from "@playwright/test";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { loadEnvLocal } = require("../../scripts/loadEnvLocal.cjs");

loadEnvLocal();

/**
 * Always hit the dev server as `localhost`, not `127.0.0.1`.
 * Next.js treats those as different origins for HMR/websocket; 127.0.0.1 often
 * stalls "Loading planner…" / disables cross-origin bits without matching certs.
 */
function resolvePlaywrightBaseURL(): string {
  const raw = (process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000").trim();
  try {
    const u = new URL(raw);
    if (u.hostname === "127.0.0.1" || u.hostname === "[::1]") {
      u.hostname = "localhost";
    }
    return u.toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

const baseURL = resolvePlaywrightBaseURL();
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "../../tests",
  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],
  testIgnore: ["**/*.test.ts", "**/*.test.tsx"],
  outputDir: "../../../results/test-results",
  fullyParallel: true,
  workers: isCI ? 2 : 2,
  timeout: 60_000,

  // DYNAMIC CI FIX: 0 retries locally for fast feedback, 2 retries in CI to prevent flaky pipeline failures.
  retries: isCI ? 2 : 0,

  // DYNAMIC REPORTER: 'list' for terminals, 'html' for CI UI, and ALWAYS 'json' for the Ops Portal telemetry.
  reporter: [
    ["list"],
    ["html", { outputFolder: "../../../results/playwright-report", open: "never" }],
    ["json", { outputFile: "../../../results/audits/raw-playwright.json" }]
  ],

  use: {
    baseURL,
    trace: "on-first-retry",
    navigationTimeout: 60_000,
    actionTimeout: 15_000,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    },
  },
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
      // NEXT.JS FIX: Test against the production build to prevent JIT compilation timeouts.
      command: "pnpm run build && pnpm run start",
      url: baseURL,
      timeout: 120000,
      // Only reuse the server locally. In CI, we always want a fresh build.
      reuseExistingServer: !isCI,
      env: {
        ...process.env,
        NEXT_PUBLIC_PLANNER_DEV_TOOLS: "true",
        // Pass through only if set (e.g. .env.local or test:e2e:p0-admin-svg).
        // Do not force bypass for all e2e — admin-smoke unauth gates need real redirects.
        ...(process.env.DEV_AUTH_BYPASS
          ? { DEV_AUTH_BYPASS: process.env.DEV_AUTH_BYPASS }
          : {}),
        ...(process.env.DEV_AUTH_BYPASS_ALLOW_PRODUCTION
          ? {
              DEV_AUTH_BYPASS_ALLOW_PRODUCTION:
                process.env.DEV_AUTH_BYPASS_ALLOW_PRODUCTION,
            }
          : {}),
      },
    },
});
