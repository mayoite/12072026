/**
 * Verify planner Drizzle tables on admin Supabase Postgres.
 * Schema changes belong in platform/supabase/migrations.admin/ — apply with db:apply:admin.
 */
import * as dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });

const EXPECTED_TABLES = ["oando_plans", "audit_events"] as const;

async function main() {
  const url = process.env.SUPABASE_AUTH_DATABASE_URL?.trim();
  if (!url) {
    console.error("❌ SUPABASE_AUTH_DATABASE_URL missing from .env.local");
    process.exit(1);
  }

  const sql = postgres(url, { max: 1 });

  try {
    const rows = await sql<{ table_name: string }[]>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY(${[...EXPECTED_TABLES]})
      ORDER BY table_name
    `;
    const present = new Set(rows.map((row) => row.table_name));
    console.log(`Present: ${[...present].join(", ") || "(none)"}`);

    const missing = EXPECTED_TABLES.filter((name) => !present.has(name));
    if (missing.length > 0) {
      console.error(`❌ Missing tables: ${missing.join(", ")}`);
      console.error("Run: pnpm --filter oando-site run db:apply:admin");
      process.exit(1);
    }

    console.log("✅ Admin planner Drizzle tables present. Use db:apply:admin for schema changes.");
  } catch (error) {
    console.error("❌ Drizzle schema check failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();
