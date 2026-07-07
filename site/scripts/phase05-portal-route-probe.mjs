/**
 * Phase 05 — live portal SVG catalog probes (05-PORT-01, 05-PORT-02, 05-PORT-09).
 * Lightweight HTTP evidence without Playwright.
 *
 * Usage (dev server running):
 *   node scripts/phase05-portal-route-probe.mjs
 *
 * Output: results/site/phase-05/http-probe/http-probe-evidence.json
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = process.env.PROBE_BASE_URL ?? "http://localhost:3000";
const SAMPLE_SLUG = process.env.PHASE05_PROBE_SLUG ?? "side-table-001";

async function fetchHtml(path) {
  const url = BASE + path;
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  return { url, status: res.status, html, ok: res.status !== 404 };
}

function extractMeta(html, property) {
  const og = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i",
  ).exec(html);
  if (og) return og[1];
  const name = new RegExp(
    `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i",
  ).exec(html);
  return name?.[1] ?? null;
}

async function main() {
  const capturedAt = new Date().toISOString();
  const index = await fetchHtml("/portal/svg-catalog");
  const slug = await fetchHtml(`/portal/svg-catalog/${SAMPLE_SLUG}`);

  const indexChecks = {
    hasTitle: /SVG catalog/i.test(index.html),
    hasLiveRegion: /blocks available/i.test(index.html),
    noBase64Png: !/data:image\/png;base64,/i.test(index.html),
  };

  const slugChecks = {
    hasSlugHeading: index.ok && slug.html.includes(SAMPLE_SLUG),
    hasPuckSection: /Puck render|puck-render|portal-svg-detail/i.test(slug.html),
    hasThumbSection: /svg-catalog-thumb|PNG thumb/i.test(slug.html),
    noBase64Png: !/data:image\/png;base64,/i.test(slug.html),
    ogImage: extractMeta(slug.html, "og:image"),
    ogImageIsR2:
      Boolean(extractMeta(slug.html, "og:image")?.includes("site-block-thumbs")),
  };

  const evidence = {
    base: BASE,
    capturedAt,
    sampleSlug: SAMPLE_SLUG,
    checkIds: ["05-PORT-01", "05-PORT-02", "05-PORT-09"],
    index: {
      id: "05-PORT-01",
      path: "/portal/svg-catalog",
      status: index.status,
      checks: indexChecks,
      pass:
        index.status === 200 &&
        indexChecks.hasTitle &&
        indexChecks.noBase64Png,
    },
    slug: {
      id: "05-PORT-02",
      path: `/portal/svg-catalog/${SAMPLE_SLUG}`,
      status: slug.status,
      checks: slugChecks,
      pass:
        slug.status === 200 &&
        slugChecks.hasSlugHeading &&
        slugChecks.hasPuckSection &&
        slugChecks.noBase64Png,
    },
    metadata: {
      id: "05-PORT-09",
      ogImage: slugChecks.ogImage,
      ogImageIsR2: slugChecks.ogImageIsR2,
      pass: slugChecks.ogImageIsR2 && !slugChecks.ogImage?.includes("/svg-catalog/"),
    },
  };

  const outDir = resolve(process.cwd(), "..", "results", "site", "phase-05", "http-probe");
  await mkdir(outDir, { recursive: true });
  const jsonPath = resolve(outDir, "http-probe-evidence.json");
  const logPath = resolve(outDir, "http-probe-console.log");

  const lines = [
    `=== Phase 05 portal route probe @ ${capturedAt} ===`,
    `base=${BASE} slug=${SAMPLE_SLUG}`,
    `05-PORT-01 GET /portal/svg-catalog status=${index.status} pass=${evidence.index.pass}`,
    `05-PORT-02 GET /portal/svg-catalog/${SAMPLE_SLUG} status=${slug.status} pass=${evidence.slug.pass}`,
    `05-PORT-09 og:image=${slugChecks.ogImage ?? "(missing)"} pass=${evidence.metadata.pass}`,
    `indexChecks=${JSON.stringify(indexChecks)}`,
    `slugChecks=${JSON.stringify({ ...slugChecks, ogImage: slugChecks.ogImage ?? null })}`,
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
