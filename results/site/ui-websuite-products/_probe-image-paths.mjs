import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../site");
const publicRoot = path.join(siteRoot, "public");
const catalog = JSON.parse(
  fs.readFileSync(path.join(siteRoot, "lib/site-data/localCatalogIndex.json"), "utf8"),
);

function exists(assetPath) {
  if (!assetPath || !assetPath.startsWith("/")) return false;
  const rel = assetPath.replace(/^\/+/, "").split("/").join(path.sep);
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
  if (unpadded) {
    candidates.push(`${unpadded[1]}0${unpadded[2]}${unpadded[3]}`);
  }
  return candidates;
}

function alts(assetPath) {
  const lower = assetPath.toLowerCase();
  const out = [assetPath];
  if (lower.endsWith(".webp")) {
    out.push(assetPath.replace(/\.webp$/i, ".jpg"));
    out.push(assetPath.replace(/\.webp$/i, ".jpeg"));
    out.push(assetPath.replace(/\.webp$/i, ".png"));
  } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    out.push(assetPath.replace(/\.(jpe?g)$/i, ".webp"));
    out.push(assetPath.replace(/\.(jpe?g)$/i, ".png"));
  } else if (lower.endsWith(".png")) {
    out.push(assetPath.replace(/\.png$/i, ".webp"));
    out.push(assetPath.replace(/\.png$/i, ".jpg"));
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

/** After-fix server resolver (pad + ext + nearest sibling). */
function resolveServerAfter(assetPath) {
  for (const base of expand(assetPath)) {
    for (const c of alts(base)) {
      if (exists(c)) return { path: c, via: c === assetPath ? "exact" : "pad-or-ext" };
    }
  }
  const sib = nearestSibling(assetPath);
  if (sib) return { path: sib, via: "nearest-sibling" };
  return { path: null, via: "fallback" };
}

/** Before-fix server: pad + ext only. */
function resolveServerBefore(assetPath) {
  for (const base of expandBefore(assetPath)) {
    for (const c of alts(base)) {
      if (exists(c)) return c;
    }
  }
  return null;
}

function expandBefore(assetPath) {
  const candidates = [assetPath];
  const match = assetPath.match(/^(.*\/image-)0+(\d+)(\.[a-z0-9]+)$/i);
  if (match) candidates.push(`${match[1]}${Number.parseInt(match[2], 10)}${match[3]}`);
  return candidates;
}

function resolveClientBefore(assetPath) {
  const numbered = expandBefore(assetPath);
  return numbered[numbered.length - 1] ?? assetPath;
}

function resolveClientAfter(assetPath) {
  return assetPath;
}

function listDirFor(assetPath) {
  const m = (assetPath || "").match(/\/images\/catalog\/([^/]+)\//);
  if (!m) return null;
  const dir = path.join(publicRoot, "images", "catalog", m[1]);
  if (!fs.existsSync(dir)) return { dir: m[1], files: null };
  return { dir: m[1], files: fs.readdirSync(dir).sort() };
}

function pickByFolder(folder) {
  return catalog.find((x) => (x.flagship_image || "").includes(`/${folder}/`));
}

const fiveFolders = [
  "oando-seating--fluid-x",
  "oando-seating--canaret",
  "oando-seating--arvo",
  "oando-seating--casca",
  "oando-seating--phoenix",
];

const samples = fiveFolders.map((folder) => {
  const p = pickByFolder(folder);
  if (!p) return { folder, error: "no catalog entry" };
  const raw = p.flagship_image || (p.images || [])[0];
  const beforeServer = resolveServerBefore(raw);
  const afterServer = resolveServerAfter(raw);
  const beforeClient = resolveClientBefore(raw);
  const afterClient = resolveClientAfter(raw);
  return {
    slug: p.slug,
    folder,
    raw,
    rawExists: exists(raw),
    before: {
      server: beforeServer,
      serverOk: Boolean(beforeServer && exists(beforeServer)),
      client: beforeClient,
      clientOk: exists(beforeClient),
    },
    after: {
      server: afterServer.path,
      via: afterServer.via,
      serverOk: Boolean(afterServer.path && exists(afterServer.path)),
      client: afterClient,
      clientOk: exists(afterClient) || Boolean(afterServer.path), // client keeps SSR path
    },
    diskFiles: listDirFor(raw)?.files?.slice(0, 16) ?? null,
  };
});

const seating = catalog.filter(
  (p) =>
    (p.flagship_image || "").includes("/oando-seating--") ||
    String(p.slug || "").startsWith("oando-seating--"),
);

let beforeOk = 0;
let afterOk = 0;
const residual = [];
for (const p of seating) {
  const raw = p.flagship_image || (p.images || [])[0];
  if (resolveServerBefore(raw)) beforeOk++;
  const a = resolveServerAfter(raw);
  if (a.path) afterOk++;
  else residual.push({ slug: p.slug, raw, disk: listDirFor(raw) });
}

console.log(
  JSON.stringify(
    {
      samples,
      seatingStats: {
        count: seating.length,
        beforeFlagshipResolved: beforeOk,
        afterFlagshipResolved: afterOk,
        residualUnresolved: residual,
      },
    },
    null,
    2,
  ),
);
