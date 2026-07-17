/**
 * Dual-write injection for Admin SVG publish.
 *
 * Live authority is still disk until DB-SVG cutover is complete.
 * Only attach Products DB + R2 artifact store when R2 is actually reachable
 * (ListObjects probe via `probeR2CatalogAccess`). That keeps fail-closed
 * dual-write when enabled, and avoids rolling back disk publishes when R2
 * returns Unauthorized / is misconfigured.
 *
 * Modes:
 * - `skipped_no_db` — Products DB not configured; no dual-write deps.
 * - `skipped_r2_unavailable` — DB configured but R2 probe not ok; disk-only.
 * - `skipped_schema_missing` — DB configured but DB-SVG-05 pointer column absent; disk-only.
 * - `enabled` — DB + R2 ready + pointer column present; inject repository + R2 putText.
 *
 * Honesty:
 * - `enabled` is not cutover. Disk remains live release authority until Failures.md cutover closes.
 * - Dual-write uploads real descriptor + SVG + PNG (checksum-matched).
 * - Product pointer updates when a matching `planner_managed_products` row exists (0 ok; >1 fail-closed).
 * - When mode is `enabled`, publish is fail-closed on DB/R2 errors (rolls back disk).
 *   Dead R2 at this gate yields `skipped_r2_unavailable` so disk-only publish can succeed.
 * - Do not treat DB rows as sole release authority while disk gate still wins.
 * - `r2Probe` is diagnostic only; never invent ok without a real probe result.
 */

import { ImmutableSvgRevisionRepository } from "@/features/admin/svg-editor/svgRevisionRepository.server";
import { DrizzleSvgRevisionPersistence } from "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server";
import {
  isProductsDatabaseConfigured,
  resolveProductsDatabaseUrl,
} from "@/platform/drizzle/databaseUrls";
import {
  probeR2CatalogAccess,
  writeR2ObjectBytes,
  writeR2ObjectText,
  type R2CatalogProbeResult,
} from "@/lib/storage/r2Catalog";
import postgres from "postgres";

export type SvgPublishDualWriteMode =
  | "enabled"
  | "skipped_no_db"
  | "skipped_r2_unavailable"
  | "skipped_schema_missing";

export type SvgPublishArtifactStore = {
  putText: typeof writeR2ObjectText;
  putBytes: typeof writeR2ObjectBytes;
};

export type SvgPublishDualWriteDeps = {
  dbRepository: ImmutableSvgRevisionRepository | undefined;
  artifactStore: SvgPublishArtifactStore | undefined;
  mode: SvgPublishDualWriteMode;
  /** Present when Products DB is configured and an R2 probe ran. */
  r2Probe?: R2CatalogProbeResult;
};

/**
 * DB-SVG-05 readiness: planner_managed_products.published_svg_revision_id.
 * Missing column caused production dual-write publish to fail hard (Failures.md).
 * Prefer disk-only when the column is absent so publish does not roll back disk.
 */
export async function probeProductsSvgPointerColumn(options?: {
  sqlFactory?: typeof postgres;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const url = resolveProductsDatabaseUrl();
  if (!url) {
    return { ok: false, reason: "products_database_url_missing" };
  }
  const factory = options?.sqlFactory ?? postgres;
  const sql = factory(url, { prepare: false, max: 1 });
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
      return {
        ok: false,
        reason: "published_svg_revision_id_missing",
      };
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

export async function resolveSvgPublishDualWriteDeps(options?: {
  forceR2Probe?: boolean;
  /** Test injection — skip live schema probe when provided. */
  schemaProbe?: () => Promise<{ ok: true } | { ok: false; reason: string }>;
}): Promise<SvgPublishDualWriteDeps> {
  if (!isProductsDatabaseConfigured()) {
    return {
      dbRepository: undefined,
      artifactStore: undefined,
      mode: "skipped_no_db",
    };
  }

  const r2Probe = await probeR2CatalogAccess({ force: options?.forceR2Probe });
  if (!r2Probe.ok) {
    // Disk remains authority; do not inject dual-write on dead R2.
    return {
      dbRepository: undefined,
      artifactStore: undefined,
      mode: "skipped_r2_unavailable",
      r2Probe,
    };
  }

  const schema =
    options?.schemaProbe != null
      ? await options.schemaProbe()
      : await probeProductsSvgPointerColumn();
  if (!schema.ok) {
    return {
      dbRepository: undefined,
      artifactStore: undefined,
      mode: "skipped_schema_missing",
      r2Probe,
    };
  }

  const dbRepository = new ImmutableSvgRevisionRepository(
    new DrizzleSvgRevisionPersistence(),
  );
  return {
    dbRepository,
    artifactStore: {
      putText: writeR2ObjectText,
      putBytes: writeR2ObjectBytes,
    },
    mode: "enabled",
    r2Probe,
  };
}
