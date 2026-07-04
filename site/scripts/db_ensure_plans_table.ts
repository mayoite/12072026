/**
 * Verify `oando_plans` exists on admin Supabase. Create via migrations, not ad-hoc DDL.
 */
import * as dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });

async function main() {
  const url = process.env.SUPABASE_AUTH_DATABASE_URL?.trim();
  if (!url) {
    console.error("❌ SUPABASE_AUTH_DATABASE_URL missing from .env.local");
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
