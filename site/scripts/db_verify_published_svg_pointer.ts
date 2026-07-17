/**
 * Verify DB-SVG-05 column exists on Products DB.
 * Run: pnpm --filter oando-site exec tsx scripts/db_verify_published_svg_pointer.ts
 */
import { createRequire } from "node:module";
import postgres from "postgres";
import { resolveProductsDatabaseUrl } from "../platform/drizzle/databaseUrls";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

async function main(): Promise<void> {
  const url = resolveProductsDatabaseUrl();
  if (!url) {
    console.error("PRODUCTS_DATABASE_URL missing");
    process.exit(1);
  }
  const sql = postgres(url, { prepare: false, max: 1 });
  try {
    const cols = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'planner_managed_products'
        AND column_name = 'published_svg_revision_id'
    `;
    if (cols.length === 0) {
      console.error(
        "FAIL: planner_managed_products.published_svg_revision_id missing — run db:apply",
      );
      process.exit(1);
    }
    console.log("OK: column present", cols[0]);

    const history = await sql`
      SELECT filename, applied_at
      FROM public._local_migration_history
      WHERE filename = '20260716100000_add_published_svg_revision_id.sql'
    `;
    console.log(
      history.length > 0
        ? `OK: migration history ${JSON.stringify(history[0])}`
        : "WARN: migration file not in _local_migration_history (column exists anyway)",
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

void main();
