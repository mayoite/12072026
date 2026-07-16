/**
 * Probe Products + Auth Postgres for expected tables (no secret output).
 * Run: pnpm --filter oando-site exec node scripts/db_probe_tables.mjs
 */
import { createRequire } from "node:module";
import postgres from "postgres";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

async function probe(label, url, tables) {
  if (!url) {
    console.log(`${label}: NO_URL`);
    return { ok: false, missing: tables };
  }
  const sql = postgres(url, {
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
    prepare: false,
  });
  try {
    await sql`select 1 as ok`;
    const rows = await sql`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name = any(${tables})
      order by table_name
    `;
    const present = rows.map((r) => r.table_name);
    const presentSet = new Set(present);
    const missing = tables.filter((t) => !presentSet.has(t));
    const all = await sql`
      select count(*)::int as n
      from information_schema.tables
      where table_schema = 'public'
    `;
    console.log(
      `${label}: OK public_tables=${all[0].n} present=${present.join(",") || "(none)"}`,
    );
    if (missing.length) {
      console.log(`${label}: MISSING ${missing.join(",")}`);
    }
    return { ok: missing.length === 0, present, missing };
  } catch (e) {
    console.log(`${label}: ERR ${e instanceof Error ? e.message : String(e)}`);
    return { ok: false, missing: tables };
  } finally {
    await sql.end({ timeout: 5 });
  }
}

const products = await probe("PRODUCTS", process.env.PRODUCTS_DATABASE_URL, [
  "catalog_products",
  "catalog_categories",
  "planner_managed_products",
  "configurator_products",
  "block_descriptors",
  "svg_revisions",
  "svg_revision_artifacts",
  "_local_migration_history",
]);

const auth = await probe("AUTH", process.env.SUPABASE_AUTH_DATABASE_URL, [
  "oando_plans",
  "audit_events",
  "price_books",
  "price_book_versions",
  "_local_migration_history",
]);

const httpOk = Boolean(
  process.env.SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
);
console.log(`SUPABASE_HTTP: ${httpOk ? "OK keys present" : "MISSING keys"}`);

if (!products.ok || !auth.ok || !httpOk) {
  process.exit(1);
}
process.exit(0);
