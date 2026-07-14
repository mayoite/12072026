import "server-only";

import { eq, sql } from "drizzle-orm";
import { productsDb } from "@/platform/drizzle/productsDb";
import {
  svgRevisions,
  svgRevisionArtifacts,
  blockDescriptors,
} from "@/platform/drizzle/schema/catalog";
import type {
  SupabaseSvgRevisionPersistence,
  SvgArtifactRecord,
} from "./svgRevisionRepository.server";

export class DrizzleSvgRevisionPersistence
  implements SupabaseSvgRevisionPersistence
{
  async insertRevision(
    revision: Parameters<SupabaseSvgRevisionPersistence["insertRevision"]>[0],
    definition: Parameters<SupabaseSvgRevisionPersistence["insertRevision"]>[1],
  ): Promise<void> {
    await productsDb.insert(svgRevisions).values({
      revisionId: revision.revisionId,
      schemaVersion: revision.schemaVersion as 1,
      definitionTypeId: revision.definitionTypeId,
      definitionVersion: revision.definitionVersion,
      compilerVersion: revision.compilerVersion,
      sourceRevision: revision.sourceRevision,
      artifactChecksums: revision.artifactChecksums,
      validation: revision.validation,
      actorId: revision.actorId,
      publishedAt: new Date(revision.publishedAt),
      reason: revision.reason,
      slug: definition.typeId,
      version: definition.lifecycle.status === "published" ? 1 : 0,
      definition,
      releasedProduct: null,
    });

    // Sync block_descriptors with the latest published descriptor
    const checksum =
      typeof revision.artifactChecksums === "object" &&
      revision.artifactChecksums !== null
        ? ((revision.artifactChecksums as unknown as Record<string, string>)
            .descriptor ?? "")
        : "";
    await productsDb
      .insert(blockDescriptors)
      .values({
        slug: definition.typeId,
        currentVersion: 1,
        currentChecksum: checksum,
        descriptor: definition,
        updatedAt: new Date(),
        updatedBy: revision.actorId,
      })
      .onConflictDoUpdate({
        target: blockDescriptors.slug,
        set: {
          currentVersion: sql`${blockDescriptors.currentVersion} + 1`,
          currentChecksum: checksum,
          descriptor: definition,
          updatedAt: new Date(),
          updatedBy: revision.actorId,
        },
      });
  }

  async insertArtifacts(
    artifacts: readonly SvgArtifactRecord[],
  ): Promise<void> {
    if (artifacts.length === 0) return;
    await productsDb.insert(svgRevisionArtifacts).values(
      artifacts.map((a) => ({
        revisionId: a.revisionId,
        kind: a.kind,
        checksum: a.checksum,
        storageKey: a.storageKey,
        width: a.width ?? null,
      })),
    );
  }

  async loadRevision(
    revisionId: string,
  ): Promise<{
    revision: Parameters<SupabaseSvgRevisionPersistence["insertRevision"]>[0];
    definition: Parameters<SupabaseSvgRevisionPersistence["insertRevision"]>[1];
    artifacts: readonly SvgArtifactRecord[];
  } | null> {
    const rows = await productsDb
      .select()
      .from(svgRevisions)
      .where(eq(svgRevisions.revisionId, revisionId))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    const artifactRows = await productsDb
      .select()
      .from(svgRevisionArtifacts)
      .where(eq(svgRevisionArtifacts.revisionId, revisionId));

    return {
      revision: {
        schemaVersion: row.schemaVersion as 1,
        revisionId: row.revisionId,
        definitionTypeId: row.definitionTypeId,
        definitionVersion: row.definitionVersion,
        compilerVersion: row.compilerVersion ?? "",
        sourceRevision: row.sourceRevision ?? 0,
        artifactChecksums: row.artifactChecksums as Parameters<
          SupabaseSvgRevisionPersistence["insertRevision"]
        >[0]["artifactChecksums"],
        validation: row.validation as Parameters<
          SupabaseSvgRevisionPersistence["insertRevision"]
        >[0]["validation"],
        actorId: row.actorId,
        publishedAt:
          row.publishedAt instanceof Date
            ? row.publishedAt.toISOString()
            : String(row.publishedAt),
        reason: row.reason ?? "",
      },
      definition: row.definition as Parameters<
        SupabaseSvgRevisionPersistence["insertRevision"]
      >[1],
      artifacts: artifactRows.map((a) => ({
        revisionId: a.revisionId,
        kind: a.kind as SvgArtifactRecord["kind"],
        checksum: a.checksum,
        storageKey: a.storageKey,
        width: a.width ?? undefined,
      })),
    };
  }
}
