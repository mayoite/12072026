import "server-only";

import type {
  PublishedRevisionV1,
  SvgBlockDefinitionV1,
} from "./contracts/svgBlockSchemas";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { ReleasedCatalogProductV1 } from "@/features/admin/catalog/releasedCatalogContract";

export type SvgArtifactKind = "descriptor" | "svg" | "png" | "thumbnail";

export interface SvgArtifactRecord {
  readonly revisionId: string;
  readonly kind: SvgArtifactKind | string;
  readonly checksum: string;
  readonly storageKey: string;
  readonly width?: number;
}

export interface SupabaseSvgRevisionPersistence {
  publishRelease(
    revision: PublishedRevisionV1,
    definition: SvgBlockDefinitionV1,
    artifacts: readonly SvgArtifactRecord[],
    liveDescriptor: BlockDescriptor,
    releasedProduct: ReleasedCatalogProductV1,
    plannerSourceSlug: string,
  ): Promise<void>;
  insertRevision(
    revision: PublishedRevisionV1,
    definition: SvgBlockDefinitionV1,
    liveDescriptor: BlockDescriptor,
    releasedProduct: ReleasedCatalogProductV1,
  ): Promise<void>;
  insertArtifacts(artifacts: readonly SvgArtifactRecord[]): Promise<void>;
  loadRevision(
    revisionId: string,
  ): Promise<{
    revision: PublishedRevisionV1;
    definition: SvgBlockDefinitionV1;
    artifacts: readonly SvgArtifactRecord[];
  } | null>;
  /** DB-SVG-05: set published_svg_revision_id on planner_managed_products by planner_source_slug. */
  updateProductPointer(plannerSourceSlug: string, revisionId: string): Promise<void>;
}

/**
 * Immutable published revision writer. Disk publish remains authority until
 * DB-SVG cutover proof; this adapter is the Products DB dual-write boundary.
 */
export class ImmutableSvgRevisionRepository {
  constructor(private readonly persistence: SupabaseSvgRevisionPersistence) {}

  async publish(
    revision: PublishedRevisionV1,
    definition: SvgBlockDefinitionV1,
    artifacts: readonly SvgArtifactRecord[],
    liveDescriptor: BlockDescriptor,
    releasedProduct: ReleasedCatalogProductV1,
  ): Promise<void> {
    await this.persistence.publishRelease(
      revision,
      definition,
      artifacts,
      liveDescriptor,
      releasedProduct,
      definition.typeId,
    );
  }

  /** DB-SVG-05: update the product pointer after a successful publish. */
  async updateProductPointer(plannerSourceSlug: string, revisionId: string): Promise<void> {
    await this.persistence.updateProductPointer(plannerSourceSlug, revisionId);
  }

  async load(
    revisionId: string,
  ): Promise<{
    revision: PublishedRevisionV1;
    definition: SvgBlockDefinitionV1;
    artifacts: readonly SvgArtifactRecord[];
  } | null> {
    return this.persistence.loadRevision(revisionId);
  }
}
