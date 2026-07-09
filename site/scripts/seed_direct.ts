require("./loadEnvLocal.cjs").loadEnvLocal();

import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

const rawUrl = (process.env.PRODUCTS_DATABASE_URL ?? "").replace(/^["']|["']$/g, "");
if (!rawUrl) {
  throw new Error("Missing PRODUCTS_DATABASE_URL");
}

const match = rawUrl.match(/^postgresql:\/\/([^:]+):(.+)@([^@]+):(\d+)\/(.+)$/);
if (!match) {
  throw new Error("Could not parse PRODUCTS_DATABASE_URL");
}

const [, username, passwordPart, host, portText, database] = match;
const sql = postgres({
  host,
  port: Number(portText),
  database,
  username,
  password: decodeURIComponent(passwordPart),
  ssl: "require",
  max: 1,
  prepare: false,
});

async function seed() {
  try {
    console.log('📋 Re-applying fixed catalog functions...');
    // Re-apply the fixed migration to update functions with ELSE NULL
    const migrationSql = fs.readFileSync(
      path.resolve(__dirname, '../platform/supabase/migrations/20260309113000_add_canonical_catalog_fields.sql'),
      'utf8'
    );
    // Run the whole migration again (idempotent due to CREATE OR REPLACE)
    await sql.unsafe(migrationSql);
    console.log('✅ Functions updated.');

    console.log('🌱 Running seed_data.sql...');
    let seedSql = fs.readFileSync(
      path.resolve(__dirname, '../scripts/seed_data.sql'),
      'utf8'
    );
    // Route inserts directly to catalog_products/catalog_categories instead of views
    seedSql = seedSql
      .replace(/INSERT INTO products /g, 'INSERT INTO catalog_products ')
      .replace(/INSERT INTO categories /g, 'INSERT INTO catalog_categories ');
    // Split on semicolons and run each statement
    const statements = seedSql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let ok = 0, fail = 0;
    for (const stmt of statements) {
      try {
        await sql.unsafe(stmt + ';');
        ok++;
      } catch (e: unknown) {
        // narrow unknown to Error shape for .message (runtime from sql); reason: postgres/sql error objects are unknown at catch; owner: Resolve Failures Agent (PLAN-FAIL-0411); removal: central typed error util in platform or scripts/lib + update call sites
        const message = e instanceof Error ? e.message : String(e);
        console.error(`  → Error: ${message.split('\n')[0]}`);
        fail++;
      }
    }
    console.log(`\n✅ Done: ${ok} statements succeeded, ${fail} failed.`);
  } catch (e) {
    console.error('Fatal error:', e);
  } finally {
    await sql.end();
  }
}

seed();
