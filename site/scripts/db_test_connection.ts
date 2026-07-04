import { createRequire } from "node:module";
import postgres from "postgres";
import { resolvePlannerDatabaseUrl } from "../platform/drizzle/plannerDatabaseUrl";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

async function checkDatabaseConnection() {
  console.log("Starting planner database connection check...");

  const url = resolvePlannerDatabaseUrl();
  if (!url) {
    console.error(
      "❌ ERROR: Planner DB URL missing (set SUPABASE_AUTH_DATABASE_URL in repo-root .env.local)",
    );
    process.exit(1);
  }

  console.log("Target: admin Supabase (SUPABASE_AUTH_DATABASE_URL)");

  const sql = postgres(url, { max: 1, idle_timeout: 5, connect_timeout: 10 });

  try {
    const ping = await sql`SELECT 1 AS connected`;
    if (ping[0]?.connected !== 1) {
      console.error("❌ ERROR: Unexpected ping result", ping);
      process.exit(1);
    }
    console.log("✅ SUCCESS: Database connection established.");

    const expected = ["oando_plans", "audit_events"] as const;
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY(${[...expected]})
      ORDER BY table_name
    `;
    const names = tables.map((row) => row.table_name as string);
    console.log(`Planner tables present: ${names.join(", ") || "(none)"}`);

    const missing = expected.filter((name) => !names.includes(name));
    if (missing.length > 0) {
      console.error(
        `❌ ERROR: Missing planner tables: ${missing.join(", ")} — run pnpm run db:apply:admin`,
      );
      process.exit(1);
    }

    const [{ n }] = await sql`SELECT count(*)::int AS n FROM oando_plans`;
    console.log(`✅ oando_plans table reachable (${n} rows).`);
  } catch (error) {
    console.error("❌ DB CONNECTION ERROR:");
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }

  const adminHttp = process.env.NEXT_ADMIN_SUPABASE_URL?.trim();
  const adminKey = process.env.SUPABASE_ADMIN_SERVICE_ROLE_KEY?.trim();
  if (adminHttp && adminKey) {
    console.log("✅ Admin Supabase HTTP env vars present.");
  } else {
    console.warn("⚠️ Admin Supabase HTTP env vars missing.");
  }

  process.exit(0);
}

checkDatabaseConnection();
