import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
config({ path: path.join(root, ".env.local") });

const { productsDb } = await import(
  pathToFileURL(path.join(root, "site/platform/drizzle/productsDb.ts")).href
).catch(() => ({ productsDb: null }));

function pathToFileURL(p) {
  return new URL(`file:///${p.replace(/\\/g, "/")}`);
}

// Prefer HTTP probe (same as site)
const base = "http://localhost:3000";
const r = await fetch(`${base}/api/products/?limit=500`);
const j = await r.json();
const byCat = {};
for (const p of j.products || []) {
  const c = p.category || "unknown";
  byCat[c] = (byCat[c] || 0) + 1;
}
console.log(JSON.stringify({ total: j.total, byCat }, null, 2));

for (const cat of ["workstations", "seating", "tables", "storages", "soft-seating"]) {
  const fr = await fetch(
    `${base}/api/products/filter/?category=${encodeURIComponent(cat)}`,
  );
  const fj = await fr.json();
  console.log(
    JSON.stringify({
      category: cat,
      status: fr.status,
      total: fj.total,
      catalogTotal: fj.meta?.catalogTotal,
    }),
  );
}
