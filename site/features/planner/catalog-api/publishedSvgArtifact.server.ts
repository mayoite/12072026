import "server-only";

import { and, eq } from "drizzle-orm";

import { productsDb } from "@/platform/drizzle/productsDb";
import {
  plannerManagedProducts,
  svgRevisionArtifacts,
} from "@/platform/drizzle/schema/catalog";

export type PublishedSvgArtifact = {
  readonly checksum: string;
  readonly storageKey: string;
};

/**
 * Resolve only the SVG revision currently pointed to by one active Planner
 * product. Historical or inactive revisions are intentionally not public.
 */
export async function loadCurrentPublishedSvgArtifact(
  revisionId: string,
): Promise<PublishedSvgArtifact | null> {
  const rows = await productsDb
    .select({
      checksum: svgRevisionArtifacts.checksum,
      storageKey: svgRevisionArtifacts.storageKey,
    })
    .from(svgRevisionArtifacts)
    .innerJoin(
      plannerManagedProducts,
      and(
        eq(
          plannerManagedProducts.publishedSvgRevisionId,
          svgRevisionArtifacts.revisionId,
        ),
        eq(plannerManagedProducts.active, true),
      ),
    )
    .where(
      and(
        eq(svgRevisionArtifacts.revisionId, revisionId),
        eq(svgRevisionArtifacts.kind, "svg"),
      ),
    )
    .limit(2);

  if (rows.length === 0) return null;
  if (rows.length !== 1) {
    throw new Error(`Duplicate published SVG artifacts for ${revisionId}.`);
  }
  return rows[0];
}
