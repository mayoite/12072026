import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { SVG_PUCK_FIELDS } from "@/features/planner/admin/svg-editor/svgFieldMetadata";
import { compileSvgArtifacts } from "@/features/planner/admin/svg-editor/svgArtifactCompiler.server";
import {
  ImmutableSvgRevisionRepository,
  type SupabaseSvgRevisionPersistence,
} from "@/features/planner/admin/svg-editor/svgRevisionRepository.server";
import {
  SVG_REFERENCE_DEFINITIONS,
  CONFIGURABLE_REFERENCE_DEFINITION,
} from "@/features/planner/admin/svg-editor/svgReferenceDefinitions";
import {
  PublishedRevisionV1Schema,
  SvgBlockDefinitionV1Schema,
  type PublishedRevisionV1,
} from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import {
  compileSvgBlockV1,
  SvgCompileError,
} from "@/features/planner/open3d/catalog/svg/svgCompiler.server";

const checksum = "a".repeat(64);

function revision(): PublishedRevisionV1 {
  return PublishedRevisionV1Schema.parse({
    schemaVersion: 1,
    revisionId: "fixed-table-r1",
    definitionTypeId: "fixed-table",
    definitionVersion: 1,
    compilerVersion: "svg-block-v1",
    sourceRevision: 1,
    artifactChecksums: {
      descriptor: checksum,
      svg: checksum,
      png: checksum,
      thumbnails: { "128": checksum },
    },
    validation: { valid: true, diagnostics: [] },
    actorId: "admin-1",
    publishedAt: "2026-07-05T00:00:00.000Z",
    reason: "Phase 1 reference publication",
  });
}

describe("Phase 1 SVG completion", () => {
  it("generates stable Puck field definitions from validated metadata", () => {
    expect(Object.keys(SVG_PUCK_FIELDS)).toEqual([
      "name",
      "category",
      "physicalDimensionsMm.width",
      "physicalDimensionsMm.depth",
      "physicalDimensionsMm.height",
      "lifecycle.status",
    ]);
    expect(SVG_PUCK_FIELDS["lifecycle.status"]?.options?.[0]).toEqual({
      label: "draft",
      value: "draft",
    });
  });

  it("validates fixed, configurable, and parametric reference definitions", () => {
    expect(SVG_REFERENCE_DEFINITIONS.map((definition) =>
      SvgBlockDefinitionV1Schema.parse(definition).typeId)).toEqual([
      "fixed-table",
      "configurable-door",
      "parametric-cabinet",
    ]);
  });

  it("returns sorted deterministic diagnostics for broken references", () => {
    const invalid = structuredClone(CONFIGURABLE_REFERENCE_DEFINITION);
    invalid.actions[0]!.parameterIds = ["missing"];
    const capture = () => {
      try {
        compileSvgBlockV1(invalid);
      } catch (error) {
        return error;
      }
    };
    const first = capture();
    const second = capture();
    expect(first).toBeInstanceOf(SvgCompileError);
    expect((first as SvgCompileError).diagnostics).toEqual((second as SvgCompileError).diagnostics);
    expect((first as SvgCompileError).diagnostics[0]?.path).toBe("actions.0.parameterIds");
  });

  it("renders canonical PNG and deterministic Sharp derivatives", async () => {
    const first = await compileSvgArtifacts(SVG_REFERENCE_DEFINITIONS[0], [256, 128, 128]);
    const second = await compileSvgArtifacts(SVG_REFERENCE_DEFINITIONS[0], [128, 256]);
    expect(first.png.subarray(1, 4).toString()).toBe("PNG");
    expect(first.pngChecksum).toBe(second.pngChecksum);
    expect(first.thumbnails.map(({ width }) => width)).toEqual([128, 256]);
    expect(first.thumbnails.map(({ checksum: value }) => value))
      .toEqual(second.thumbnails.map(({ checksum: value }) => value));
  });

  it("publishes once, rejects mutation, and reloads the existing version", async () => {
    let stored: Awaited<ReturnType<SupabaseSvgRevisionPersistence["loadRevision"]>> = null;
    const persistence: SupabaseSvgRevisionPersistence = {
      insertRevision: vi.fn(async (published, definition) => {
        stored = { revision: published, definition, artifacts: [] };
      }),
      insertArtifacts: vi.fn(async (artifacts) => {
        if (!stored) throw new Error("revision missing");
        stored = { ...stored, artifacts };
      }),
      loadRevision: vi.fn(async () => stored),
    };
    const repository = new ImmutableSvgRevisionRepository(persistence);
    const published = revision();
    const definition = SvgBlockDefinitionV1Schema.parse(SVG_REFERENCE_DEFINITIONS[0]);
    const artifacts = [{ revisionId: published.revisionId, kind: "svg" as const, checksum, storageKey: "svg/fixed-table-r1.svg" }];
    await repository.publish(published, definition, artifacts);
    await expect(repository.publish(published, definition, artifacts)).rejects.toThrow(/immutable/);
    expect(await repository.reload(published.revisionId)).toEqual({
      revision: published,
      definition,
      artifacts,
    });
  });
});
