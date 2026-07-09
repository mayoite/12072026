/**
 * Run curated open3d world-standard Playwright pack from
 * config/build/playwright-open3d-world-specs.json.
 * Writes evidence under repo-root results/planner/world-standard-wave/gate-e2e/
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

fs.mkdirSync(evidenceDir, { recursive: true });

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

console.log(`[open3d-world-e2e] running ${manifest.specs.length} specs (workers=${workers})`);
const result = spawnSync("npx", args, {
  cwd: siteRoot,
  encoding: "utf8",
  env: {
    ...process.env,
    NEXT_PUBLIC_PLANNER_DEV_TOOLS: process.env.NEXT_PUBLIC_PLANNER_DEV_TOOLS ?? "true",
  },
  shell: true,
  maxBuffer: 20 * 1024 * 1024,
});

const combined = `${result.stdout ?? ""}${result.stderr ?? ""}`;
fs.writeFileSync(logPath, combined, "utf8");

const exitCode = result.status ?? 1;
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
process.exit(exitCode);
