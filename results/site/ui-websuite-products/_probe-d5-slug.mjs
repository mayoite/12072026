/**
 * D5 probe: catalog flagship resolve with slug-folder fallback (server FS).
 * Run from site/: node ../results/site/ui-websuite-products/_probe-d5-slug.mjs
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath, pathToFileURL } from "url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../site");
process.chdir(siteRoot);

// Server-like env for assetPaths
delete globalThis.window;
globalThis.__non_webpack_require__ = createRequire(path.join(siteRoot, "package.json"));

const assetPathsUrl = pathToFileURL(path.join(siteRoot, "lib/assetPaths.ts")).href;
// Prefer compiled path via dynamic import of .ts may fail without tsx — inline mirror instead.

const publicRoot = path.join(siteRoot, "public");
const catalog = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "lib/site-data/localCatalogIndex.json"), "utf8"),
);

function exists(assetPath) {
  if (!assetPath || typeof assetPath !== "string") return false;
  const bare = assetPath.replace(/^https?:\/\/[^/]+/i, "");
  if (!bare.startsWith("/")) return false;
  const rel = bare.replace(/^\/+/, "").split("/").join(path.sep);
  return fs.existsSync(path.join(publicRoot, rel));
}

function expand(assetPath) {
  const candidates = [assetPath];
  const padded = assetPath.match(/^(.*\/image-)0+(\d+)(\.[a-z0-9]+)$/i);
  if (padded) {
    candidates.push(`${padded[1]}${Number.parseInt(padded[2], 10)}${padded[3]}`);
    return candidates;
  }
  const unpadded = assetPath.match(/^(.*\/image-)(\d)(\.[a-z0-9]+)$/i);
  if (unpadded) candidates.push(`${unpadded[1]}0${unpadded[2]}${unpadded[3]}`);
  return candidates;
}

function alts(assetPath) {
  const lower = assetPath.toLowerCase();
  const out = [assetPath];
  if (lower.endsWith(".webp")) {
    out.push(assetPath.replace(/\.webp$/i, ".jpg"), assetPath.replace(/\.webp$/i, ".jpeg"), assetPath.replace(/\.webp$/i, ".png"));
  } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    out.push(assetPath.replace(/\.(jpe?g)$/i, ".webp"), assetPath.replace(/\.(jpe?g)$/i, ".png"));
  } else if (lower.endsWith(".png")) {
    out.push(assetPath.replace(/\.png$/i, ".webp"), assetPath.replace(/\.png$/i, ".jpg"));
  }
  return out;
}

function nearestSibling(assetPath) {
  const match = assetPath.match(/^(.*\/)(image-)0*(\d+)(\.[a-z0-9]+)$/i);
  if (!match) return null;
  const dirWeb = match[1].replace(/\/+$/, "");
  const requested = Number.parseInt(match[3], 10);
  const dirFs = path.join(publicRoot, dirWeb.replace(/^\/+/, "").split("/").join(path.sep));
  if (!fs.existsSync(dirFs)) return null;
  const numbered = fs
    .readdirSync(dirFs)
    .map((file) => {
      const m = file.match(/^image-0*(\d+)\.[a-z0-9]+$/i);
      if (!m) return null;
      return { number: Number.parseInt(m[1], 10), webPath: `${dirWeb}/${file}` };
    })
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
  if (!numbered.length) return null;
  const exact = numbered.find((r) => r.number === requested);
  if (exact) return exact.webPath;
  const lower = [...numbered].reverse().find((r) => r.number <= requested);
  if (lower) return lower.webPath;
  return numbered[0].webPath;
}

function resolvePathOnly(assetPath) {
  if (!assetPath) return null;
  for (const base of expand(assetPath)) {
    for (const c of alts(base)) {
      if (exists(c)) return c;
    }
  }
  return nearestSibling(assetPath);
}

function catalogFolders() {
  const d = path.join(publicRoot, "images", "catalog");
  return fs.readdirSync(d).filter((f) => fs.statSync(path.join(d, f)).isDirectory());
}

const folders = catalogFolders();

function resolveSlugFolder(slug) {
  const s = String(slug || "").trim();
  if (!s) return null;
  if (folders.includes(s)) return s;
  const suffix = `--${s}`;
  const matches = folders.filter((f) => f === s || f.endsWith(suffix));
  return matches.length === 1 ? matches[0] : null;
}

function listSlugImages(slug) {
  const folder = resolveSlugFolder(slug);
  if (!folder) return [];
  const dir = path.join(publicRoot, "images", "catalog", folder);
  return fs
    .readdirSync(dir)
    .map((file) => {
      const m = file.match(/^image-0*(\d+)\.([a-z0-9]+)$/i);
      if (!m) return null;
      return { n: Number.parseInt(m[1], 10), p: `/images/catalog/${folder}/${file}` };
    })
    .filter(Boolean)
    .sort((a, b) => a.n - b.n)
    .map((r) => r.p)
    .filter(exists);
}

function resolveAfter(p) {
  const raw = p.flagship_image || (p.images || [])[0] || "";
  const pathHit = resolvePathOnly(raw);
  if (pathHit) return { path: pathHit, via: "path" };
  for (const img of p.images || []) {
    const h = resolvePathOnly(img);
    if (h) return { path: h, via: "images-path" };
  }
  const listed = listSlugImages(p.slug);
  if (listed[0]) return { path: listed[0], via: "slug-folder" };
  return { path: null, via: "miss" };
}

function resolveBefore(p) {
  const raw = p.flagship_image || (p.images || [])[0] || "";
  return resolvePathOnly(raw);
}

let beforeOk = 0;
let afterOk = 0;
const wins = [];
const residual = [];
const viaCounts = { path: 0, "images-path": 0, "slug-folder": 0, miss: 0 };

for (const p of catalog) {
  const b = resolveBefore(p);
  if (b) beforeOk++;
  const a = resolveAfter(p);
  viaCounts[a.via] = (viaCounts[a.via] || 0) + 1;
  if (a.path) {
    afterOk++;
    if (!b && a.via === "slug-folder") {
      wins.push({
        slug: p.slug,
        raw: (p.flagship_image || (p.images || [])[0] || "").slice(0, 90),
        resolved: a.path,
      });
    }
  } else {
    residual.push({
      slug: p.slug,
      raw: (p.flagship_image || (p.images || [])[0] || "").slice(0, 100),
    });
  }
}

console.log(
  JSON.stringify(
    {
      total: catalog.length,
      beforePathOnlyOk: beforeOk,
      afterWithSlugOk: afterOk,
      viaCounts,
      slugFolderWins: wins.length,
      winSamples: wins.slice(0, 15),
      residualCount: residual.length,
      residual,
    },
    null,
    2,
  ),
);
