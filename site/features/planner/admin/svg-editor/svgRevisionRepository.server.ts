import "server-only";

import type { SvgBlockDefinitionV1, PublishedRevisionV1 } from "./svgBlockSchemas";

export interface SvgArtifactRecord {
  readonly revisionId: string;
  readonly kind: "descriptor" | "svg" | "png" | "thumbnail";
  readonly checksum: string;
  readonly storageKey: string;
  readonly width?: number;
}

/** Server adapter contract implemented by the Supabase/Drizzle persistence layer. */
export interface SupabaseSvgRevisionPersistence {
  insertRevision(revision: PublishedRevisionV1, definition: SvgBlockDefinitionV1): Promise<void>;
  insertArtifacts(artifacts: readonly SvgArtifactRecord[]): Promise<void>;
  loadRevision(revisionId: string): Promise<{
    readonly revision: PublishedRevisionV1;
    readonly definition: SvgBlockDefinitionV1;
    readonly artifacts: readonly SvgArtifactRecord[];
  } | null>;
}

export class ImmutableSvgRevisionRepository {
  constructor(private readonly persistence: SupabaseSvgRevisionPersistence) {}

  async publish(
    revision: PublishedRevisionV1,
    definition: SvgBlockDefinitionV1,
    artifacts: readonly SvgArtifactRecord[],
  ): Promise<void> {
    const existing = await this.persistence.loadRevision(revision.revisionId);
    if (existing) throw new Error(`published revision "${revision.revisionId}" is immutable`);
    if (artifacts.some((artifact) => artifact.revisionId !== revision.revisionId)) {
      throw new Error("artifact revisionId must match the published revision");
    }
    await this.persistence.insertRevision(revision, definition);
    await this.persistence.insertArtifacts(artifacts);
  }

  async reload(revisionId: string) {
    return this.persistence.loadRevision(revisionId);
  }
}
