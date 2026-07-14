import { describe, expect, it, vi } from "vitest";
import { ImmutableSvgRevisionRepository } from "@/features/admin/svg-editor/svgRevisionRepository.server";
import type {
  PublishedRevisionV1,
  SvgBlockDefinitionV1,
} from "@/features/admin/svg-editor/svgBlockSchemas";
import { FIXED_REFERENCE_DEFINITION } from "@/features/admin/svg-editor/svgReferenceDefinitions";

describe("ImmutableSvgRevisionRepository", () => {
  it("publishes once and rejects re-publish of same revisionId", async () => {
    const store = new Map<string, unknown>();
    const persistence = {
      insertRevision: vi.fn(async (rev: PublishedRevisionV1) => {
        store.set(rev.revisionId, rev);
      }),
      insertArtifacts: vi.fn(async () => undefined),
      loadRevision: vi.fn(async (id: string) => {
        const rev = store.get(id);
        if (!rev) return null;
        return {
          revision: rev as PublishedRevisionV1,
          definition: FIXED_REFERENCE_DEFINITION as SvgBlockDefinitionV1,
          artifacts: [],
        };
      }),
    };
    const repo = new ImmutableSvgRevisionRepository(persistence);
    const revision = {
      schemaVersion: 1 as const,
      revisionId: "rev-1",
      definitionTypeId: "fixed-table",
      definitionVersion: 1,
      compilerVersion: "1",
      sourceRevision: null,
      artifactChecksums: {},
      validation: { ok: true },
      actorId: "tester",
      publishedAt: new Date().toISOString(),
      reason: "test",
    } as unknown as PublishedRevisionV1;

    await repo.publish(revision, FIXED_REFERENCE_DEFINITION, []);
    await expect(
      repo.publish(revision, FIXED_REFERENCE_DEFINITION, []),
    ).rejects.toThrow(/immutable/);
    const loaded = await repo.reload("rev-1");
    expect(loaded?.revision).toBeDefined();
  });
});
