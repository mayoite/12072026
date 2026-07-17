import "server-only";

import { eq } from "drizzle-orm";
import { productsDb } from "@/platform/drizzle/productsDb";
import {
  svgRevisions,
  svgRevisionArtifacts,
  blockDescriptors,
  plannerManagedProducts,
} from "@/platform/drizzle/schema/catalog";
import type {
  SupabaseSvgRevisionPersistence,
  SvgArtifactRecord,
} from "../svgRevisionRepository.server";

export class DrizzleSvgRevisionPersistence
  implements SupabaseSvgRevisionPersistence
{
  async publishRelease(
    revision: Parameters<SupabaseSvgRevisionPersistence["publishRelease"]>[0],
    definition: Parameters<SupabaseSvgRevisionPersistence["publishRelease"]>[1],
    artifacts: Parameters<SupabaseSvgRevisionPersistence["publishRelease"]>[2],
    liveDescriptor: Parameters<SupabaseSvgRevisionPersistence["publishRelease"]>[3],
    releasedProduct: Parameters<SupabaseSvgRevisionPersistence["publishRelease"]>[4],
    plannerSourceSlug: Parameters<SupabaseSvgRevisionPersistence["publishRelease"]>[5],
  ): Promise<void> {
    const checksum = revision.artifactChecksums.descriptor;

    await productsDb.transaction(async (transaction) => {
      await transaction.insert(svgRevisions).values({
        revisionId: revision.revisionId,
        schemaVersion: revision.schemaVersion,
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
        version: revision.definitionVersion,
        definition,
        releasedProduct,
      });

      await transaction
        .insert(blockDescriptors)
        .values({
          slug: definition.typeId,
          currentVersion: revision.definitionVersion,
          currentChecksum: checksum,
          descriptor: liveDescriptor,
          updatedAt: new Date(),
          updatedBy: revision.actorId,
        })
        .onConflictDoUpdate({
          target: blockDescriptors.slug,
          set: {
            currentVersion: revision.definitionVersion,
            currentChecksum: checksum,
            descriptor: liveDescriptor,
            updatedAt: new Date(),
            updatedBy: revision.actorId,
          },
        });

      if (artifacts.length > 0) {
        await transaction.insert(svgRevisionArtifacts).values(
          artifacts.map((artifact) => ({
            revisionId: artifact.revisionId,
            kind: artifact.kind,
            checksum: artifact.checksum,
            storageKey: artifact.storageKey,
            width: artifact.width ?? null,
          })),
        );
      }

      // DB-SVG-05: point matching managed product(s) at this revision.
      // 0 rows is valid for pure SVG inventory not yet linked to a product.
      // >1 is ambiguous identity and fails closed.
      const pointedProducts = await transaction
        .update(plannerManagedProducts)
        .set({
          publishedSvgRevisionId: revision.revisionId,
          updatedAt: new Date(),
        })
        .where(eq(plannerManagedProducts.plannerSourceSlug, plannerSourceSlug))
        .returning({ id: plannerManagedProducts.id });

      if (pointedProducts.length > 1) {
        throw new Error(
          `Expected at most one product for planner source "${plannerSourceSlug}", found ${pointedProducts.length}.`,
        );
      }
    });
  }

  async insertRevision(
    revision: Parameters<SupabaseSvgRevisionPersistence["insertRevision"]>[0],
    definition: Parameters<SupabaseSvgRevisionPersistence["insertRevision"]>[1],
    liveDescriptor: Parameters<SupabaseSvgRevisionPersistence["insertRevision"]>[2],
    releasedProduct: Parameters<SupabaseSvgRevisionPersistence["insertRevision"]>[3],
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
      version: revision.definitionVersion,
      definition,
      releasedProduct,
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
        currentVersion: revision.definitionVersion,
        currentChecksum: checksum,
        descriptor: liveDescriptor,
        updatedAt: new Date(),
        updatedBy: revision.actorId,
      })
      .onConflictDoUpdate({
        target: blockDescriptors.slug,
        set: {
          currentVersion: revision.definitionVersion,
          currentChecksum: checksum,
          descriptor: liveDescriptor,
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

  /** DB-SVG-05: update the published_svg_revision_id pointer on the matching product row. */
  async updateProductPointer(plannerSourceSlug: string, revisionId: string): Promise<void> {
    // Same cardinality rule as publishRelease: 0 rows ok (unlinked inventory);
    // >1 is ambiguous identity and fails closed.
    const pointedProducts = await productsDb
      .update(plannerManagedProducts)
      .set({ publishedSvgRevisionId: revisionId, updatedAt: new Date() })
      .where(eq(plannerManagedProducts.plannerSourceSlug, plannerSourceSlug))
      .returning({ id: plannerManagedProducts.id });

    if (pointedProducts.length > 1) {
      throw new Error(
        `Expected at most one product for planner source "${plannerSourceSlug}", found ${pointedProducts.length}.`,
      );
    }
  }
}
