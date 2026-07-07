/**
 * Phase 04 — live route/API probes (04-ADMIN-01, 04-ADMIN-02, 04-ADMIN-09 boundary).
 * Lightweight HTTP evidence without Playwright. Auth-gated routes expect redirect or 401/403.
 *
 * Usage (dev server running):
 *   node scripts/phase04-admin-route-probe.mjs
 *
 * Output: results/site/phase-04/http-probe/http-probe-run.json + http-probe-raw.log (via wrapper)
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const BASE = process.env.PROBE_BASE_URL ?? "http://localhost:3000";

const ROUTES = [
  { id: "04-ADMIN-01", method: "GET", path: "/admin/svg-editor" },
  { id: "04-ADMIN-02", method: "GET", path: "/admin/svg-editor/new" },
  { id: "04-ADMIN-02", method: "GET", path: "/admin/svg-editor/chaise" },
];

async function fetchProbe({ method, path, body, followRedirects = true }) {
  const url = BASE + path;
  const init = {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    redirect: followRedirects ? "follow" : "manual",
  };
  const res = await fetch(url, init);
  const location = res.headers.get("location");
  let snippet = "";
  try {
    const text = await res.text();
    snippet = text.slice(0, 200).replace(/\s+/g, " ");
  } catch {
    snippet = "";
  }
  return {
    url,
    status: res.status,
    location,
    snippet,
    ok: res.status !== 404,
    authGated: [401, 403, 307, 308].includes(res.status) || /login|access|sign-in/i.test(location ?? snippet),
  };
}

async function main() {
  const capturedAt = new Date().toISOString();
  const routeResults = [];
  for (const route of ROUTES) {
    routeResults.push({ ...route, ...(await fetchProbe(route)) });
  }

  const apiUnauth = await fetchProbe({
    method: "POST",
    path: "/api/admin/svg-editor",
    body: { schemaVersion: "2026-07-04.v2" },
  });

  const evidence = {
    base: BASE,
    capturedAt,
    checkIds: ["04-ADMIN-01", "04-ADMIN-02", "04-ADMIN-09"],
    routes: routeResults,
    api: {
      id: "04-ADMIN-09",
      note: "Unauthenticated POST with invalid descriptor; expect auth block before persist (not 404).",
      ...apiUnauth,
      authBlocked: [401, 403, 307, 308].includes(apiUnauth.status),
    },
    summary: {
      listRouteNot404: routeResults.find((r) => r.path === "/admin/svg-editor")?.status !== 404,
      editNewNot404: routeResults.find((r) => r.path === "/admin/svg-editor/new")?.status !== 404,
      apiNot404: apiUnauth.status !== 404,
    },
  };

  const outDir = resolve(process.cwd(), "..", "results", "site", "phase-04", "http-probe");
  await mkdir(outDir, { recursive: true });
  const jsonPath = resolve(outDir, "http-probe-evidence.json");
  const logPath = resolve(outDir, "http-probe-console.log");

  const lines = [
    `=== Phase 04 admin route probe @ ${capturedAt} ===`,
    `base=${BASE}`,
    ...routeResults.map(
      (r) => `${r.id} ${r.method} ${r.path} status=${r.status} location=${r.location ?? ""}`,
    ),
    `04-ADMIN-09 POST /api/admin/svg-editor status=${apiUnauth.status} location=${apiUnauth.location ?? ""}`,
    `summary=${JSON.stringify(evidence.summary)}`,
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
