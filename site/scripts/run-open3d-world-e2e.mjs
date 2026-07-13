/**
 * Run curated open3d world-standard Playwright pack from
 * config/build/playwright-open3d-world-specs.json.
 * Writes evidence under repo-root results/planner/world-standard-wave/gate-e2e/
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  acquirePlaywrightDevLock,
  releasePlaywrightDevLock,
} from "./playwright-dev-lock.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(siteRoot, "..");
const specsPath = path.join(
  siteRoot,
  "config",
  "build",
  "playwright-open3d-world-specs.json",
);
const evidenceDir = path.join(
  repoRoot,
  "results",
  "planner",
  "world-standard-wave",
  "gate-e2e",
);
function fail(message) {
  console.error(`[open3d-world-e2e] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(specsPath)) {
  fail(`missing specs file: ${specsPath}`);
}

/** @type {{ version: number; specs: string[]; workers?: number }} */
const manifest = JSON.parse(fs.readFileSync(specsPath, "utf8"));
if (!Array.isArray(manifest.specs) || manifest.specs.length === 0) {
  fail("manifest.specs must be a non-empty array");
}

const missing = [];
for (const rel of manifest.specs) {
  const abs = path.join(siteRoot, rel);
  if (!fs.existsSync(abs)) missing.push(rel);
}
if (missing.length > 0) {
  fail(`spec files missing on disk:\n${missing.map((m) => `  - ${m}`).join("\n")}`);
}

try {
  acquirePlaywrightDevLock("open3d-world-gate");
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}

const workers = String(manifest.workers ?? 1);
const args = [
  "playwright",
  "test",
  "-c",
  "config/build/playwright.config.ts",
  ...manifest.specs,
  `--workers=${workers}`,
  "--reporter=list",
];

const startedAt = new Date().toISOString();
const logPath = path.join(evidenceDir, "playwright-raw.log");
const runPath = path.join(evidenceDir, "run.json");

const gateEnv = {
  ...process.env,
  // Match curated admin/planner e2e: turbopack dev + auth bypass (not stale prod build).
  DEV_AUTH_BYPASS: process.env.DEV_AUTH_BYPASS ?? "1",
  NEXT_PUBLIC_PLANNER_DEV_TOOLS: process.env.NEXT_PUBLIC_PLANNER_DEV_TOOLS ?? "true",
  // Fresh dev server for gate — avoids stale reuse on port 3000.
  OPEN3D_WORLD_GATE: "1",
  // Parent holds the shared dev lock; Playwright globalSetup must not re-acquire.
  PLAYWRIGHT_DEV_LOCK_SKIP: "1",
};

/** One retry only for dead/stale dev server — not workspace assertion failures. */
const TRANSIENT_GATE =
  /ERR_CONNECTION_REFUSED|net::ERR_|Port 3000 is in use|Another next dev server is already running/i;

function pause(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // short spin — gate runner only
  }
}

function runPack() {
  return spawnSync("npx", args, {
    cwd: siteRoot,
    encoding: "utf8",
    env: gateEnv,
    shell: true,
    maxBuffer: 20 * 1024 * 1024,
  });
}

let exitCode = 1;
let combined = "";

try {
  console.log(`[open3d-world-e2e] running ${manifest.specs.length} specs (workers=${workers})`);
  let result = runPack();
  combined = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  exitCode = result.status ?? 1;

  if (exitCode !== 0 && TRANSIENT_GATE.test(combined)) {
    console.log("[open3d-world-e2e] transient infra flake — retrying once after 8s");
    pause(8_000);
    const retry = runPack();
    const retryOut = `${retry.stdout ?? ""}${retry.stderr ?? ""}`;
    combined = `${combined}\n\n--- RETRY ---\n\n${retryOut}`;
    exitCode = retry.status ?? 1;
    result = retry;
  }

  fs.writeFileSync(logPath, combined, "utf8");
  const endedAt = new Date().toISOString();
  const run = {
    phase: "open3d-world-e2e-gate",
    startedAt,
    endedAt,
    exitCode,
    workers: Number(workers),
    specs: manifest.specs,
    log: "playwright-raw.log",
    status: exitCode === 0 ? "PASS" : "FAIL",
    cwd: siteRoot,
  };
  fs.writeFileSync(runPath, `${JSON.stringify(run, null, 2)}\n`, "utf8");

  console.log(`[open3d-world-e2e] exit=${exitCode} log=${logPath}`);
} finally {
  releasePlaywrightDevLock();
}

process.exit(exitCode);
