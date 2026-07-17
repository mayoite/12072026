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
 * - `enabled` — DB + R2 ready; inject repository + R2 putText.
 *
 * Honesty:
 * - `enabled` is not cutover. Disk remains live release authority until Failures.md cutover closes.
 * - Dual-write uploads real descriptor + SVG + PNG (checksum-matched); product pointer when product exists.
 * - Do not treat DB rows as sole release authority while disk gate still wins.
 * - `r2Probe` is diagnostic only; never invent ok without a real probe result.
 */

import { ImmutableSvgRevisionRepository } from "@/features/admin/svg-editor/svgRevisionRepository.server";
import { DrizzleSvgRevisionPersistence } from "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server";
import { isProductsDatabaseConfigured } from "@/platform/drizzle/databaseUrls";
import {
  probeR2CatalogAccess,
  writeR2ObjectBytes,
  writeR2ObjectText,
  type R2CatalogProbeResult,
} from "@/lib/storage/r2Catalog";

export type SvgPublishDualWriteMode =
  | "enabled"
  | "skipped_no_db"
  | "skipped_r2_unavailable";

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

export async function resolveSvgPublishDualWriteDeps(options?: {
  forceR2Probe?: boolean;
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
