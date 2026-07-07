/**
 * Phase 07 — live auth boundary probes (07-AUTH-04 / admin gate).
 *
 * Usage (dev server running):
 *   node scripts/phase07-auth-probe.mjs
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolve } from "node:path";

const BASE = process.env.PROBE_BASE_URL ?? "http://localhost:3000";

async function postJson(urlPath, body) {
  const res = await fetch(BASE + urlPath, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    redirect: "follow",
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json };
}

function adminRouteAuthGuardPass() {
  const adminRoot = resolve(process.cwd(), "app/api/admin");
  if (!existsSync(adminRoot)) return false;

  function walk(dir) {
    const files = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) files.push(...walk(full));
      else if (entry.name === "route.ts") files.push(full);
    }
    return files;
  }

  return walk(adminRoot).every((file) => {
    const text = readFileSync(file, "utf8");
    return text.includes("withAuth") || text.includes("requireAdminSession");
  });
}

async function main() {
  const capturedAt = new Date().toISOString();
  const svgEditor = await postJson("/api/admin/svg-editor", {
    schemaVersion: "2026-07-04.v2",
  });
  const apiCode =
    svgEditor.json?.error?.code ??
    svgEditor.json?.error?.error?.code ??
    null;

  const evidence = {
    base: BASE,
    capturedAt,
    checkIds: ["07-AUTH-04", "07-AUTH-09"],
    adminApi: {
      path: "/api/admin/svg-editor",
      status: svgEditor.status,
      errorCode: apiCode,
      authBlocked: [401, 403].includes(svgEditor.status),
      pass: [401, 403].includes(svgEditor.status),
    },
    taxonomy: {
      id: "07-AUTH-09",
      note: "Unauthenticated admin POST must not return 422.invalid",
      notDescriptor422: apiCode !== "422.invalid",
      pass: apiCode !== "422.invalid",
    },
    staticGuard: {
      id: "07-AUTH-01",
      adminRoutesUseAuthHelper: adminRouteAuthGuardPass(),
      pass: adminRouteAuthGuardPass(),
    },
  };

  const outDir = resolve(process.cwd(), "..", "results", "site", "phase-07", "http-probe");
  await mkdir(outDir, { recursive: true });
  const jsonPath = resolve(outDir, "http-probe-evidence.json");
  const logPath = resolve(outDir, "http-probe-console.log");

  const lines = [
    `=== Phase 07 auth probe @ ${capturedAt} ===`,
    `admin POST status=${svgEditor.status} code=${apiCode ?? "(none)"}`,
    `authBlocked=${evidence.adminApi.authBlocked}`,
    `notDescriptor422=${evidence.taxonomy.notDescriptor422}`,
    `staticGuard=${evidence.staticGuard.adminRoutesUseAuthHelper}`,
  ];

  await writeFile(jsonPath, JSON.stringify(evidence, null, 2), "utf8");
  await writeFile(logPath, lines.join("\n") + "\n", "utf8");
  console.log(lines.join("\n"));
  console.log(`\nWrote ${jsonPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
