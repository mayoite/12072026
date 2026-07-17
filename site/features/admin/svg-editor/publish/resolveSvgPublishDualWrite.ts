/**
 * Dual-write injection for Admin SVG publish.
 *
 * Live authority is still disk until DB-SVG cutover is complete.
 * Only attach Products DB + R2 artifact store when R2 is actually reachable.
 * That keeps fail-closed dual-write when enabled, and avoids rolling back disk
 * publishes when R2 returns Unauthorized / is misconfigured.
 */

import { ImmutableSvgRevisionRepository } from "@/features/admin/svg-editor/svgRevisionRepository.server";
import { DrizzleSvgRevisionPersistence } from "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server";
import { isProductsDatabaseConfigured } from "@/platform/drizzle/databaseUrls";
import {
  isR2CatalogReady,
  writeR2ObjectText,
  type R2CatalogProbeResult,
} from "@/lib/storage/r2Catalog";

export type SvgPublishDualWriteMode =
  | "enabled"
  | "skipped_no_db"
  | "skipped_r2_unavailable";

export type SvgPublishDualWriteDeps = {
  dbRepository: ImmutableSvgRevisionRepository | undefined;
  artifactStore: { putText: typeof writeR2ObjectText } | undefined;
  mode: SvgPublishDualWriteMode;
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

  const r2Ready = await isR2CatalogReady({ force: options?.forceR2Probe });
  if (!r2Ready) {
    // Disk remains authority; do not fail the publish path on dead R2 keys.
    return {
      dbRepository: undefined,
      artifactStore: undefined,
      mode: "skipped_r2_unavailable",
      r2Probe: undefined,
    };
  }

  const dbRepository = new ImmutableSvgRevisionRepository(
    new DrizzleSvgRevisionPersistence(),
  );
  return {
    dbRepository,
    artifactStore: { putText: writeR2ObjectText },
    mode: "enabled",
  };
}
