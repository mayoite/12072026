import "server-only";

import type {
  PublishedRevisionV1,
  SvgBlockDefinitionV1,
} from "./contracts/svgBlockSchemas";

export type SvgArtifactKind = "descriptor" | "svg" | "png" | "thumbnail";

export interface SvgArtifactRecord {
  readonly revisionId: string;
  readonly kind: SvgArtifactKind | string;
  readonly checksum: string;
  readonly storageKey: string;
  readonly width?: number;
}

export interface SupabaseSvgRevisionPersistence {
  insertRevision(
    revision: PublishedRevisionV1,
    definition: SvgBlockDefinitionV1,
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
  ): Promise<void> {
    await this.persistence.insertRevision(revision, definition);
    await this.persistence.insertArtifacts(artifacts);
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