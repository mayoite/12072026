require("./loadEnvLocal.cjs").loadEnvLocal();

import postgres from "postgres";

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

async function fix() {
  try {
    // Insert missing category
    await sql`
      INSERT INTO catalog_categories (id, name) VALUES ('oando-workstations', 'Workstations')
      ON CONFLICT (id) DO NOTHING
    `;
    console.log('✅ Added oando-workstations category');

    // Now re-run seed_data.sql for the failed workstation products
    // We know failures were workstation products — re-run the whole seed, idempotent
    const fs = await import('fs');
    const path = await import('path');
    const seedSql = fs.readFileSync(
      path.resolve(__dirname, '../scripts/seed_data.sql'),
      'utf8'
    );
    const statements = seedSql
      .split(/;\s*\n/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0 && !s.startsWith('--'));

    let ok = 0, fail = 0;
    for (const stmt of statements) {
      try {
        await sql.unsafe(stmt + ';');
        ok++;
      } catch (e: unknown) {
        console.error(`  → Error: ${(e as any).message?.split('\n')[0]}`);
        fail++;
      }
    }
    console.log(`\n✅ Re-seed done: ${ok} succeeded, ${fail} failed.`);

    // Verify count
    const count = await sql`SELECT COUNT(*) as cnt FROM catalog_products`;
    console.log(`📦 Total products in DB: ${count[0].cnt}`);
  } catch (e) {
    console.error('Fatal error:', e);
  } finally {
    await sql.end();
  }
}

fix();
