/**
 * Verify planner Drizzle tables on admin Supabase Postgres.
 * Schema changes belong in platform/supabase/migrations.admin/ — apply with db:apply:admin.
 */
import * as dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });

export const EXPECTED_TABLES = ["oando_plans", "audit_events"] as const;

export type SyncDrizzleResult =
  | { ok: true; present: string[] }
  | { ok: false; missing?: string[]; message: string; exitCode: number };

export async function checkDrizzleSchema(
  deps: {
    env?: NodeJS.ProcessEnv;
    sqlFactory?: typeof postgres;
    log?: typeof console.log;
    error?: typeof console.error;
  } = {},
): Promise<SyncDrizzleResult> {
  const env = deps.env ?? process.env;
  const sqlFactory = deps.sqlFactory ?? postgres;
  const log = deps.log ?? console.log;
  const error = deps.error ?? console.error;

  const url = env.SUPABASE_AUTH_DATABASE_URL?.trim();
  if (!url) {
    const message = "❌ SUPABASE_AUTH_DATABASE_URL missing from .env.local";
    error(message);
    return { ok: false, message, exitCode: 1 };
  }

  const sql = sqlFactory(url, { max: 1 });

  try {
    const rows = await sql<{ table_name: string }[]>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY(${[...EXPECTED_TABLES]})
      ORDER BY table_name
    `;
    const present = rows.map((row) => row.table_name);
    const presentSet = new Set(present);
    log(`Present: ${present.join(", ") || "(none)"}`);

    const missing = EXPECTED_TABLES.filter((name) => !presentSet.has(name));
    if (missing.length > 0) {
      error(`❌ Missing tables: ${missing.join(", ")}`);
      error("Run: pnpm --filter oando-site run db:apply:admin");
      return {
        ok: false,
        missing: [...missing],
        message: `Missing tables: ${missing.join(", ")}`,
        exitCode: 1,
      };
    }

    log("✅ Admin planner Drizzle tables present. Use db:apply:admin for schema changes.");
    return { ok: true, present };
  } catch (err) {
    error("❌ Drizzle schema check failed:");
    error(err);
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
      exitCode: 1,
    };
  } finally {
    await sql.end({ timeout: 5 });
  }
}

export async function main(): Promise<void> {
  const result = await checkDrizzleSchema();
  if (!result.ok) {
    process.exit(result.exitCode);
  }
  process.exit(0);
}

function isMain(): boolean {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return (
    entry.endsWith("db_sync_drizzle_schema.ts") ||
    entry.endsWith("db_sync_drizzle_schema.js")
  );
}

if (isMain()) {
  void main();
}
