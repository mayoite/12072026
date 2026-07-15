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

describe("ImmutableSvgRevisionRepository", () => {
  it("writes revision then artifacts through persistence", async () => {
    const insertRevision = vi.fn(async () => undefined);
    const insertArtifacts = vi.fn(async () => undefined);
    const loadRevision = vi.fn(async () => null);

    const persistence: SupabaseSvgRevisionPersistence = {
      insertRevision,
      insertArtifacts,
      loadRevision,
    };

    const repo = new ImmutableSvgRevisionRepository(persistence);
    await repo.publish(revision, definition, artifacts);

    expect(insertRevision).toHaveBeenCalledWith(revision, definition);
    expect(insertArtifacts).toHaveBeenCalledWith(artifacts);
  });

  it("delegates load to persistence", async () => {
    const payload = { revision, definition, artifacts };
    const persistence: SupabaseSvgRevisionPersistence = {
      insertRevision: vi.fn(),
      insertArtifacts: vi.fn(),
      loadRevision: vi.fn(async () => payload),
    };

    const repo = new ImmutableSvgRevisionRepository(persistence);
    await expect(repo.load(revision.revisionId)).resolves.toEqual(payload);
  });
});