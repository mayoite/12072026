/**
 * R1 — dual-write readiness check (read-only; does not publish or flip SVG_RELEASE_AUTHORITY).
 *
 * Resolves the same mode as resolveSvgPublishDualWriteDeps({ forceR2Probe: true }).
 * Prefer the shared resolver; if server-only imports block script load, probe the three
 * gates separately with identical mode logic.
 *
 * Run: pnpm --filter oando-site exec tsx scripts/db_dual_write_readiness.ts
 * Exit: 0 iff mode === "enabled"; else 1.
 */
import { createRequire } from "node:module";
import postgres from "postgres";

import {
  isProductsDatabaseConfigured,
  resolveProductsDatabaseUrl,
} from "../platform/drizzle/databaseUrls";
import {
  probeR2CatalogAccess,
  type R2CatalogProbeResult,
} from "../lib/storage/r2Catalog";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

type SvgPublishDualWriteMode =
  | "enabled"
  | "skipped_no_db"
  | "skipped_r2_unavailable"
  | "skipped_schema_missing";

type ReadinessResult = {
  mode: SvgPublishDualWriteMode;
  r2Probe?: R2CatalogProbeResult;
  dualWriteReady: boolean;
};

/**
 * Same SQL as probeProductsSvgPointerColumn in resolveSvgPublishDualWrite.ts.
 * Inlined so this script does not need to import server-only publish modules.
 */
async function probeProductsSvgPointerColumnStandalone(): Promise<
  { ok: true } | { ok: false; reason: string }
> {
  const url = resolveProductsDatabaseUrl();
  if (!url) {
    return { ok: false, reason: "products_database_url_missing" };
  }
  const sql = postgres(url, { prepare: false, max: 1 });
  try {
    const rows = await sql`
      SELECT 1 AS present
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'planner_managed_products'
        AND column_name = 'published_svg_revision_id'
      LIMIT 1
    `;
    if (rows.length === 0) {
      return { ok: false, reason: "published_svg_revision_id_missing" };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error
          ? `schema_probe_error:${error.message}`
          : "schema_probe_error",
    };
  } finally {
    await sql.end({ timeout: 5 }).catch(() => undefined);
  }
}

/** Mode logic mirrors resolveSvgPublishDualWriteDeps (deps objects omitted). */
async function resolveModeViaProbes(): Promise<ReadinessResult> {
  if (!isProductsDatabaseConfigured()) {
    return { mode: "skipped_no_db", dualWriteReady: false };
  }

  const r2Probe = await probeR2CatalogAccess({ force: true });
  if (!r2Probe.ok) {
    return {
      mode: "skipped_r2_unavailable",
      r2Probe,
      dualWriteReady: false,
    };
  }

  const schema = await probeProductsSvgPointerColumnStandalone();
  if (!schema.ok) {
    return {
      mode: "skipped_schema_missing",
      r2Probe,
      dualWriteReady: false,
    };
  }

  return { mode: "enabled", r2Probe, dualWriteReady: true };
}

async function resolveViaSharedModule(): Promise<ReadinessResult | null> {
  try {
    const mod = await import(
      "../features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const dualWrite = await mod.resolveSvgPublishDualWriteDeps({
      forceR2Probe: true,
    });
    return {
      mode: dualWrite.mode,
      r2Probe: dualWrite.r2Probe,
      dualWriteReady: dualWrite.mode === "enabled",
    };
  } catch {
    // server-only (or other Next-only) graph cannot load under plain tsx.
    return null;
  }
}

export async function main(): Promise<void> {
  const fromShared = await resolveViaSharedModule();
  const result = fromShared ?? (await resolveModeViaProbes());

  console.log(JSON.stringify(result));
  process.exit(result.mode === "enabled" ? 0 : 1);
}

function isMain(): boolean {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return (
    entry.endsWith("db_dual_write_readiness.ts") ||
    entry.endsWith("db_dual_write_readiness.js")
  );
}

if (isMain()) {
  void main().catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  });
}
