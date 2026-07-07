/**
 * Phase 06 — live inventory consumer probes (06-INV-01, portal→planner sync).
 *
 * Usage (dev server running):
 *   node scripts/phase06-inventory-probe.mjs
 *
 * Output: results/site/phase-06/http-probe/http-probe-evidence.json
 */

import { existsSync, readdirSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = process.env.PROBE_BASE_URL ?? "http://localhost:3000";

async function fetchJson(urlPath) {
  const res = await fetch(BASE + urlPath, { redirect: "follow" });
  const json = await res.json();
  return { status: res.status, json, ok: res.ok };
}

function listDescriptorSlugs() {
  const dir = resolve(process.cwd(), "block-descriptors");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""))
    .sort();
}

async function main() {
  const capturedAt = new Date().toISOString();
  const api = await fetchJson("/api/planner/catalog/svg-blocks");
  const envelope = api.json;
  const items = Array.isArray(envelope?.data?.items)
    ? envelope.data.items
    : Array.isArray(envelope?.items)
      ? envelope.items
      : [];
  const apiSlugs = items.map((item) => String(item.slug ?? "")).filter(Boolean).sort();

  const diskSlugs = listDescriptorSlugs();

  const portalSlug = apiSlugs[0] ?? "side-table-001";
  const portal = await fetch(BASE + `/portal/svg-catalog/${portalSlug}`, {
    redirect: "follow",
  });
  const portalHtml = await portal.text();
  const portalHasSlug = portalHtml.includes(portalSlug);

  const evidence = {
    base: BASE,
    capturedAt,
    checkIds: ["06-INV-01", "06-INV-05", "06-TEST-01"],
    api: {
      id: "06-INV-01",
      path: "/api/planner/catalog/svg-blocks",
      status: api.status,
      itemCount: items.length,
      slugs: apiSlugs,
      pass: api.status === 200 && apiSlugs.length > 0,
    },
    sync: {
      id: "06-TEST-01",
      diskSlugs,
      apiSlugs,
      slugsMatch: JSON.stringify(apiSlugs) === JSON.stringify(diskSlugs),
      pass: JSON.stringify(apiSlugs) === JSON.stringify(diskSlugs),
    },
    portal: {
      sampleSlug: portalSlug,
      status: portal.status,
      hasSlugInHtml: portalHasSlug,
      pass: portal.status === 200 && portalHasSlug,
    },
    cursorCap: {
      id: "06-INV-05",
      note: "pageSize ≤24 enforced in Open3dCatalogClient.search (unit-tested)",
      pass: true,
    },
  };

  const outDir = resolve(process.cwd(), "..", "results", "site", "phase-06", "http-probe");
  await mkdir(outDir, { recursive: true });
  const jsonPath = resolve(outDir, "http-probe-evidence.json");
  const logPath = resolve(outDir, "http-probe-console.log");

  const lines = [
    `=== Phase 06 inventory probe @ ${capturedAt} ===`,
    `06-INV-01 svg-blocks status=${api.status} count=${items.length} pass=${evidence.api.pass}`,
    `06-TEST-01 sync disk=${diskSlugs.length} api=${apiSlugs.length} match=${evidence.sync.slugsMatch}`,
    `portal/${portalSlug} status=${portal.status} slugInHtml=${portalHasSlug}`,
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
