import { defineConfig, devices } from "@playwright/test";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { loadEnvLocal } = require("../../scripts/loadEnvLocal.cjs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { forcePlaywrightBaseURLEnv } = require("./playwrightBaseURL.cjs");

loadEnvLocal();

// Capture before force — force always writes PLAYWRIGHT_BASE_URL=http://localhost:PORT
const userProvidedBaseURL = Boolean(process.env.PLAYWRIGHT_BASE_URL?.trim());

// MUST run after loadEnvLocal so .env / shell 127.0.0.1 becomes localhost.
const baseURL = forcePlaywrightBaseURLEnv();
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "../../tests",
  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],
  testIgnore: ["**/*.test.ts", "**/*.test.tsx"],
  outputDir: "../../../results/test-results",
  fullyParallel: true,
  workers: isCI ? 2 : 2,
  timeout: 60_000,

  retries: isCI ? 2 : 0,

  reporter: [
    ["list"],
    ["html", { outputFolder: "../../../results/playwright-report", open: "never" }],
    ["json", { outputFile: "../../../results/audits/raw-playwright.json" }],
  ],

  use: {
    // Always http://localhost:PORT — never 127.0.0.1 (Next origin / HMR / certs)
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
  // If user set PLAYWRIGHT_BASE_URL (even as 127.0.0.1), reuse their server after normalize.
  // If unset, start/reuse via webServer with localhost url only.
  webServer: userProvidedBaseURL
    ? undefined
    : {
        command: "pnpm run build && pnpm run start",
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: !isCI,
        env: {
          ...process.env,
          PLAYWRIGHT_BASE_URL: baseURL,
          NEXT_PUBLIC_PLANNER_DEV_TOOLS: "true",
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
