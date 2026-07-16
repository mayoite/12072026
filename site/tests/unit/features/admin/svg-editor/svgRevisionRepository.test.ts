import { describe, expect, it, vi } from "vitest";

import {
  ImmutableSvgRevisionRepository,
  type SupabaseSvgRevisionPersistence,
  type SvgArtifactRecord,
} from "@/features/admin/svg-editor/svgRevisionRepository.server";
import type {
  PublishedRevisionV1,
  SvgBlockDefinitionV1,
} from "@/features/admin/svg-editor/contracts/svgBlockSchemas";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import type { ReleasedCatalogProductV1 } from "@/features/admin/catalog/releasedCatalogContract";

const revision: PublishedRevisionV1 = {
  schemaVersion: 1,
  revisionId: "desk-linear-1200-001-r1",
  definitionTypeId: "desk-linear-1200-001",
  definitionVersion: 1,
  compilerVersion: "oando-asset-engine-v1",
  sourceRevision: 0,
  artifactChecksums: {
    descriptor: "a".repeat(64),
    svg: "b".repeat(64),
    png: "c".repeat(64),
    thumbnails: {},
  },
  validation: { valid: true, diagnostics: [] },
  actorId: "test-actor",
  publishedAt: "2026-07-15T12:00:00.000Z",
  reason: "publish",
};

const definition: SvgBlockDefinitionV1 = {
  schemaVersion: 1,
  typeId: "desk-linear-1200-001",
  name: "Desk Linear 1200",
  category: "workstations",
  tags: [],
  lifecycle: { status: "published", ownerId: "test-actor" },
  viewBox: { x: 0, y: 0, width: 1200, height: 600 },
  physicalDimensionsMm: { width: 1200, depth: 600, height: 750 },
  parts: [],
  parameters: [],
  actions: [],
  constraints: [],
  variants: [],
  mounting: [{ plane: "floor", anchor: { x: 0, y: 0 }, rotationDegrees: 0 }],
  accessibility: { title: "Desk Linear 1200" },
};

const artifacts: SvgArtifactRecord[] = [
  {
    revisionId: revision.revisionId,
    kind: "descriptor",
    checksum: revision.artifactChecksums.descriptor,
    storageKey: "descriptors/desk-linear-1200-001/desk-linear-1200-001.json",
  },
];

const liveDescriptor = {
  ...makeNewBlockDescriptorStub(),
  slug: definition.typeId,
};

const releasedProduct = {
  schemaVersion: 1,
  productId: liveDescriptor.id,
  slug: definition.typeId,
  name: definition.name,
  boqIdentity: definition.typeId,
  availability: "available",
  dimensionsMm: { width: 1200, depth: 600, height: 750 },
  svg: {
    revisionId: revision.revisionId,
    checksum: revision.artifactChecksums.svg,
    resourceUrl: `/api/planner/catalog/svg/${revision.revisionId}`,
  },
  definitionTypeId: definition.typeId,
  definitionVersion: 1,
  publishedAt: revision.publishedAt,
} satisfies ReleasedCatalogProductV1;

describe("ImmutableSvgRevisionRepository", () => {
  it("writes revision then artifacts through persistence", async () => {
    const publishRelease = vi.fn(async () => undefined);
    const insertRevision = vi.fn(async () => undefined);
    const insertArtifacts = vi.fn(async () => undefined);
    const loadRevision = vi.fn(async () => null);

    const persistence: SupabaseSvgRevisionPersistence = {
      publishRelease,
      insertRevision,
      insertArtifacts,
      loadRevision,
      updateProductPointer: vi.fn(),
    };

    const repo = new ImmutableSvgRevisionRepository(persistence);
    await repo.publish(revision, definition, artifacts, liveDescriptor, releasedProduct);

    expect(publishRelease).toHaveBeenCalledWith(
      revision,
      definition,
      artifacts,
      liveDescriptor,
      releasedProduct,
      definition.typeId,
    );
    expect(insertRevision).not.toHaveBeenCalled();
    expect(insertArtifacts).not.toHaveBeenCalled();
  });

  it("delegates load to persistence", async () => {
    const payload = { revision, definition, artifacts };
    const persistence: SupabaseSvgRevisionPersistence = {
      publishRelease: vi.fn(),
      insertRevision: vi.fn(),
      insertArtifacts: vi.fn(),
      loadRevision: vi.fn(async () => payload),
      updateProductPointer: vi.fn(),
    };

    const repo = new ImmutableSvgRevisionRepository(persistence);
    await expect(repo.load(revision.revisionId)).resolves.toEqual(payload);
  });
});
