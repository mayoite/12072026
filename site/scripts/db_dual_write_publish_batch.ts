/**
 * Dual-write publish every buyer hero under inventory/descriptors (oando-* + keep).
 * Usage: pnpm --filter oando-site exec tsx scripts/db_dual_write_publish_batch.ts
 */
import { createRequire } from "node:module";
import { readdirSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

const packageRoot = process.cwd();
const dir = path.join(packageRoot, "inventory", "descriptors");

const slugs = readdirSync(dir)
  .filter((f) => f.endsWith(".json") && !f.includes(".latest.") && !/\.\d+\.json$/.test(f))
  .map((f) => f.slice(0, -".json".length))
  .filter((s) => s !== "missing-geom-fallback-001" && !s.startsWith("_"));

console.log(`Batch dual-write ${slugs.length} slugs…`);

let ok = 0;
let fail = 0;
for (const slug of slugs) {
  const r = spawnSync(
    "npx",
    ["tsx", "scripts/db_dual_write_publish_proof.ts", `--slug=${slug}`],
    {
      cwd: packageRoot,
      encoding: "utf8",
      env: process.env,
      shell: true,
    },
  );
  if (r.status === 0) {
    ok += 1;
    console.log(`OK ${slug}`);
  } else {
    fail += 1;
    console.error(`FAIL ${slug}\n${r.stdout ?? ""}\n${r.stderr ?? ""}`);
  }
}

console.log(`batch done ok=${ok} fail=${fail}`);
if (fail > 0) process.exitCode = 1;
