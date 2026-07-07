/**
 * Phase 08 — persistence probe wrapper (runs targeted vitest + writes evidence).
 *
 * Usage:
 *   node scripts/phase08-persistence-probe.mjs
 */

import { execSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const siteRoot = resolve(process.cwd());
const vitestCmd =
  "pnpm exec vitest run tests/unit/features/planner/open3d/phase08-persistence.test.ts tests/unit/admin/svg-editor/persistBlockDescriptor.test.ts --config vitest.config.ts";

async function main() {
  const capturedAt = new Date().toISOString();
  let exitCode = 0;
  let output = "";
  try {
    output = execSync(vitestCmd, {
      cwd: siteRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const err = error;
    exitCode = typeof err.status === "number" ? err.status : 1;
    output = `${err.stdout ?? ""}\n${err.stderr ?? ""}`;
  }

  const pass = exitCode === 0 && /Tests\s+\d+ passed/.test(output);
  const evidence = {
    capturedAt,
    checkIds: ["08-PERS-04", "08-PERS-10", "08-PERS-09", "dual-read"],
    vitest: {
      command: vitestCmd,
      exitCode,
      pass,
    },
    note: "Disk-only dual-read; Supabase mirror deferred under PLAN-FAIL-0409.",
  };

  const outDir = resolve(siteRoot, "..", "results", "site", "phase-08", "http-probe");
  const dualReadDir = resolve(siteRoot, "..", "results", "site", "phase-08", "dual-read");
  await mkdir(outDir, { recursive: true });
  await mkdir(dualReadDir, { recursive: true });
  const dualReadPath = resolve(dualReadDir, "disk-only-dual-read.json");
  await writeFile(
    dualReadPath,
    JSON.stringify(
      {
        capturedAt,
        checkIds: ["08-PERS-09", "dual-read"],
        pass,
        disk: { enabled: true, source: "site/block-descriptors" },
        mirror: { enabled: false, deferred: "PLAN-FAIL-0409" },
        note: "Vitest-backed disk dual-read; Supabase mirror not promoted.",
      },
      null,
      2,
    ),
    "utf8",
  );
  const jsonPath = resolve(outDir, "http-probe-evidence.json");
  const logPath = resolve(outDir, "http-probe-console.log");
  const lines = [
    `=== Phase 08 persistence probe @ ${capturedAt} ===`,
    `exitCode=${exitCode}`,
    `pass=${pass}`,
    output.trim(),
  ];
  await writeFile(jsonPath, JSON.stringify(evidence, null, 2), "utf8");
  await writeFile(logPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`Phase 08 probe pass=${pass} exitCode=${exitCode}`);
  console.log(`Wrote ${jsonPath}`);
  if (!pass) process.exit(exitCode || 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
