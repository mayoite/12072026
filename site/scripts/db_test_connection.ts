import { createRequire } from "node:module";
import postgres from "postgres";
import { resolvePlannerDatabaseUrl } from "../platform/drizzle/databaseUrls";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

export type DbTestConnectionResult =
  | { ok: true; planCount: number; tables: string[] }
  | { ok: false; message: string; exitCode: number };

export async function checkDatabaseConnection(
  deps: {
    resolveUrl?: typeof resolvePlannerDatabaseUrl;
    sqlFactory?: typeof postgres;
    env?: NodeJS.ProcessEnv;
    log?: typeof console.log;
    error?: typeof console.error;
    warn?: typeof console.warn;
  } = {},
): Promise<DbTestConnectionResult> {
  const resolveUrl = deps.resolveUrl ?? resolvePlannerDatabaseUrl;
  const sqlFactory = deps.sqlFactory ?? postgres;
  const env = deps.env ?? process.env;
  const log = deps.log ?? console.log;
  const error = deps.error ?? console.error;
  const warn = deps.warn ?? console.warn;

  log("Starting planner database connection check...");

  const url = resolveUrl();
  if (!url) {
    const message =
      "❌ ERROR: Planner DB URL missing (set SUPABASE_AUTH_DATABASE_URL in repo-root .env.local)";
    error(message);
    return { ok: false, message, exitCode: 1 };
  }

  log("Target: admin Supabase (SUPABASE_AUTH_DATABASE_URL)");

  const sql = sqlFactory(url, { max: 1, idle_timeout: 5, connect_timeout: 10 });

  try {
    const ping = await sql`SELECT 1 AS connected`;
    if (ping[0]?.connected !== 1) {
      const message = "❌ ERROR: Unexpected ping result";
      error(message, ping);
      return { ok: false, message, exitCode: 1 };
    }
    log("✅ SUCCESS: Database connection established.");

    const expected = ["oando_plans", "audit_events"] as const;
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY(${[...expected]})
      ORDER BY table_name
    `;
    const names = tables.map((row) => row.table_name as string);
    log(`Planner tables present: ${names.join(", ") || "(none)"}`);

    const missing = expected.filter((name) => !names.includes(name));
    if (missing.length > 0) {
      const message = `❌ ERROR: Missing planner tables: ${missing.join(", ")} — run pnpm run db:apply:admin`;
      error(message);
      return { ok: false, message, exitCode: 1 };
    }

    const [{ n }] = await sql`SELECT count(*)::int AS n FROM oando_plans`;
    log(`✅ oando_plans table reachable (${n} rows).`);

    const adminHttp = env.NEXT_ADMIN_SUPABASE_URL?.trim();
    const adminKey = env.SUPABASE_ADMIN_SERVICE_ROLE_KEY?.trim();
    if (adminHttp && adminKey) {
      log("✅ Admin Supabase HTTP env vars present.");
    } else {
      warn("⚠️ Admin Supabase HTTP env vars missing.");
    }

    return { ok: true, planCount: n as number, tables: names };
  } catch (err) {
    error("❌ DB CONNECTION ERROR:");
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
  const result = await checkDatabaseConnection();
  if (!result.ok) {
    process.exit(result.exitCode);
  }
  process.exit(0);
}

function isMain(): boolean {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return entry.endsWith("db_test_connection.ts") || entry.endsWith("db_test_connection.js");
}

if (isMain()) {
  void main();
}
