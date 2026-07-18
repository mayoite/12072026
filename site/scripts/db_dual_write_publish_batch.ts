/**
 * Dual-write publish the 22 buyer hero slugs (see plan/Admin/CHECKLIST.md + plan/TechStack/CHECKLIST.md).
 * Does NOT set SVG_RELEASE_AUTHORITY=db.
 *
 * Usage: pnpm --filter oando-site exec tsx scripts/db_dual_write_publish_batch.ts
 */
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

const packageRoot = process.cwd();
const dir = path.join(packageRoot, "inventory", "descriptors");

/** Canonical buyer hero set — keep in sync with brand inventory in plan checklists. */
const BUYER_HERO_SLUGS = [
  "oando-fluid-desk-1400",
  "oando-fluid-desk-1600",
  "oando-flex-desk-1200",
  "oando-omnia-desk-1800",
  "oando-phoenix-l-desk-1600",
  "oando-fluid-ws-linear-1200",
  "oando-fluid-ws-linear-1400",
  "oando-fluid-ws-lshape-1600",
  "oando-sway-ws-bench-2400",
  "oando-mozio-ws-cluster-1800",
  "oando-classy-meeting-1800",
  "oando-eclipse-meeting-2400",
  "oando-halo-meeting-3000",
  "oando-spino-low-cabinet-800",
  "oando-spino-tall-cabinet-900",
  "oando-omnia-storage-1200",
  "oando-xmesh-locker-900",
  "oando-fluid-pedestal-400",
  "oando-breeze-task-chair",
  "oando-casca-guest-chair",
  "oando-mellow-sofa-2200",
  "oando-cafe-discussion-table-900",
] as const;

function resolveTsxCli(): string {
  try {
    return require.resolve("tsx/cli", {
      paths: [packageRoot, path.join(packageRoot, "..")],
    });
  } catch {
    const win = path.join(packageRoot, "..", "node_modules", "tsx", "dist", "cli.mjs");
    const posix = path.join(packageRoot, "node_modules", "tsx", "dist", "cli.mjs");
    if (existsSync(win)) return win;
    if (existsSync(posix)) return posix;
    throw new Error("tsx CLI not found — run pnpm install from repo root");
  }
}

const missing = BUYER_HERO_SLUGS.filter(
  (slug) => !existsSync(path.join(dir, `${slug}.json`)),
);
if (missing.length > 0) {
  console.error(
    `Missing descriptors (${missing.length}): ${missing.join(", ")}`,
  );
  process.exit(1);
}

// Fail fast if dual-write is not ready (same gate as db_dual_write_readiness.ts).
const readiness = spawnSync(
  process.execPath,
  [resolveTsxCli(), "scripts/db_dual_write_readiness.ts"],
  {
    cwd: packageRoot,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 4 * 1024 * 1024,
  },
);
const readinessOut = `${readiness.stdout ?? ""}${readiness.stderr ?? ""}`.trim();
if (readiness.status !== 0) {
  console.error("BLOCKED: dual-write readiness not enabled");
  console.error(readinessOut || "(no readiness output)");
  process.exit(1);
}
console.log("readiness:", readinessOut || '{"mode":"enabled"}');

const tsxCli = resolveTsxCli();
const slugs = [...BUYER_HERO_SLUGS];
console.log(`Batch dual-write ${slugs.length} buyer hero slugs…`);

let ok = 0;
let fail = 0;
const failedSlugs: string[] = [];
const passed: Array<{ slug: string; revisionId?: string }> = [];

for (const slug of slugs) {
  const r = spawnSync(
    process.execPath,
    [tsxCli, "scripts/db_dual_write_publish_proof.ts", `--slug=${slug}`],
    {
      cwd: packageRoot,
      encoding: "utf8",
      env: process.env,
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  const out = `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
  if (r.status === 0) {
    ok += 1;
    const rev = out.match(/revision_id=([^\s]+)/)?.[1];
    const stepPass = out.includes("STEP 1 PASS");
    passed.push({ slug, revisionId: rev });
    console.log(
      `OK ${slug}${rev ? ` revision_id=${rev}` : ""}${stepPass ? " STEP1_PASS" : ""}`,
    );
  } else {
    fail += 1;
    failedSlugs.push(slug);
    console.error(`FAIL ${slug}\n${out}`);
  }
}

console.log(
  JSON.stringify({
    batch: "done",
    target: slugs.length,
    ok,
    fail,
    failedSlugs,
    samplePointers: passed.slice(0, 5),
  }),
);
console.log(`batch done ok=${ok} fail=${fail}`);
if (fail > 0) process.exitCode = 1;
