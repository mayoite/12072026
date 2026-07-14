/**
 * PLAN-FAIL-0412 — runtime route verification (HTTP probes).
 *
 * Usage (dev server on :3000):
 *   node scripts/phase0412-runtime-probe.mjs
 */

import { existsSync, readdirSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { baseUrl } from "./lib/scriptEnv.mjs";

const BASE = baseUrl();

async function probeRoute(pathname, checks = {}) {
  const res = await fetch(BASE + pathname, { redirect: "follow" });
  const contentType = res.headers.get("content-type") ?? "";
  const body = await res.text();
  return {
    path: pathname,
    status: res.status,
    contentType,
    ok: res.ok,
    hasHtml: contentType.includes("text/html") || body.includes("<!DOCTYPE html"),
    bodyLength: body.length,
    ...checks,
  };
}

async function probeJson(pathname) {
  const res = await fetch(BASE + pathname, { redirect: "follow" });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { path: pathname, status: res.status, json };
}

function listDescriptorSlugs() {
  const dir = resolve(process.cwd(), "inventory", "descriptors");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => /^[a-z][a-z0-9-]+\.json$/.test(name))
    .map((name) => name.replace(/\.json$/, ""))
    .sort();
}

async function main() {
  const capturedAt = new Date().toISOString();
  const slugs = listDescriptorSlugs();
  const portalSlug = slugs[0] ?? "side-table-001";

  const routes = {
    adminEditor: await probeRoute("/admin/svg-editor", {
      checkId: "0412-admin",
      pass: (r) => [200, 302, 307, 308].includes(r.status),
    }),
    portalCatalog: await probeRoute("/portal/svg-catalog", {
      checkId: "0412-portal",
      pass: (r) => r.status === 200 && r.hasHtml,
    }),
    portalSlug: await probeRoute(`/portal/svg-catalog/${portalSlug}`, {
      checkId: "0412-portal-slug",
      pass: (r) => r.status === 200 && r.hasHtml,
    }),
    plannerGuest: await probeRoute("/planner/guest", {
      checkId: "0412-planner-guest",
      pass: (r) => r.status === 200 && r.hasHtml,
    }),
    plannerOpen3d: await probeRoute("/planner/open3d", {
      checkId: "0412-planner-open3d",
      pass: (r) => [200, 302, 307, 308].includes(r.status),
    }),
  };

  const adminApi = await fetch(BASE + "/api/admin/svg-editor", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schemaVersion: "2026-07-04.v2" }),
  });
  const adminApiJson = await adminApi.json().catch(() => null);
  const catalogApi = await probeJson("/api/planner/catalog/svg-blocks");

  const evidence = {
    base: BASE,
    capturedAt,
    checkIds: ["PLAN-FAIL-0412"],
    routes: Object.fromEntries(
      Object.entries(routes).map(([key, value]) => [
        key,
        {
          ...value,
          pass: typeof value.pass === "function" ? value.pass(value) : value.pass,
        },
      ]),
    ),
    apis: {
      adminSvgEditorPost: {
        status: adminApi.status,
        authBlocked: [401, 403].includes(adminApi.status),
        pass: [401, 403].includes(adminApi.status),
        code: adminApiJson?.error?.code ?? null,
      },
      catalogSvgBlocks: {
        status: catalogApi.status,
        pass: catalogApi.status === 200,
        itemCount: Array.isArray(catalogApi.json?.data?.items)
          ? catalogApi.json.data.items.length
          : 0,
      },
    },
    pass:
      Object.values(routes).every((route) =>
        typeof route.pass === "function" ? route.pass(route) : route.pass,
      ) &&
      [401, 403].includes(adminApi.status) &&
      catalogApi.status === 200,
    note:
      "HTTP/runtime probe for admin, portal, and planner surfaces. Full browser soak remains user-owned for Accepted.",
  };

  const outDir = resolve(process.cwd(), "..", "results", "site", "release-gates", "runtime-0412");
  await mkdir(outDir, { recursive: true });
  const jsonPath = resolve(outDir, "runtime-0412-evidence.json");
  const logPath = resolve(outDir, "runtime-0412-console.log");
  const lines = [
    `=== PLAN-FAIL-0412 runtime probe @ ${capturedAt} ===`,
    `pass=${evidence.pass}`,
    ...Object.entries(evidence.routes).map(
      ([key, route]) => `${key} status=${route.status} pass=${route.pass}`,
    ),
    `adminApi=${evidence.apis.adminSvgEditorPost.status}`,
    `catalogApi=${evidence.apis.catalogSvgBlocks.status}`,
  ];
  await writeFile(jsonPath, JSON.stringify(evidence, null, 2), "utf8");
  await writeFile(logPath, `${lines.join("\n")}\n`, "utf8");
  console.log(lines.join("\n"));
  console.log(`\nWrote ${jsonPath}`);
  if (!evidence.pass) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
