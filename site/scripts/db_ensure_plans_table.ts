/**
 * Verify `oando_plans` exists on admin Supabase. Create via migrations, not ad-hoc DDL.
 * Env: repo-root `.env.local` via loadEnvLocal (same as db:test / db:apply).
 */
import { createRequire } from "node:module";
import postgres from "postgres";
import { resolvePlannerDatabaseUrl } from "../platform/drizzle/databaseUrls";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

async function main() {
  const url = resolvePlannerDatabaseUrl();
  if (!url) {
    console.error(
      "❌ Planner DB URL missing (set SUPABASE_AUTH_DATABASE_URL in repo-root .env.local)",
    );
    process.exit(1);
  }

  const sql = postgres(url, { max: 1 });

  try {
    const [{ exists }] = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'oando_plans'
      ) AS exists
    `;

    if (exists) {
      console.log("✅ oando_plans table present.");
      return;
    }

    console.error("❌ oando_plans missing — run: pnpm --filter oando-site run db:apply:admin");
    process.exit(1);
  } catch (error) {
    console.error("❌ Failed to check oando_plans:");
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();
