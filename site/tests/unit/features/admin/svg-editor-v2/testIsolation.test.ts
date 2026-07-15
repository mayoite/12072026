import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/newBlockDescriptorStub";
import type {
  PublishedRevisionV1,
  SvgBlockDefinitionV1,
} from "@/features/admin/svg-editor/svgBlockSchemas";
import { FIXED_REFERENCE_DEFINITION } from "@/features/admin/svg-editor/svgReferenceDefinitions";
import type { SvgArtifactRecord } from "@/features/admin/svg-editor/svgRevisionRepository.server";
import {
  CANONICAL_DESCRIPTOR_DIR,
  CANONICAL_SVG_CATALOG_DIR,
  type InMemorySvgRevisionRecord,
  withSvgEditorV2TestWorkspace,
} from "@/tests/helpers/svgEditorV2TestWorkspace";

describe("SVG editor V2 test isolation", () => {
  it("persists only in a temporary workspace with injected in-memory repositories", async () => {
    const revisions = new Map<string, InMemorySvgRevisionRecord>();
    const artifacts = new Map<string, readonly SvgArtifactRecord[]>();
    let root = "";

    await withSvgEditorV2TestWorkspace({ revisions, artifacts }, async (workspace) => {
      root = workspace.root;
      const descriptor = makeNewBlockDescriptorStub();
      const persisted = workspace.persistDescriptor(descriptor);
      expect(persisted.ok).toBe(true);
      if (!persisted.ok) throw new Error(persisted.error.message);
      expect(path.isAbsolute(persisted.path)).toBe(true);
      expect(persisted.path.startsWith(workspace.descriptorDir)).toBe(true);

      const svg = readFileSync(
        path.resolve(__dirname, "../../../../fixtures/svg-editor-v2/minimal-safe.svg"),
        "utf8",
      );
      const svgPath = workspace.writeSvg("new-block.svg", svg);
      expect(readFileSync(svgPath, "utf8")).toBe(svg);

      const checksum = "a".repeat(64);
      const revision: PublishedRevisionV1 = {
        schemaVersion: 1,
        revisionId: "new-block-r1",
        definitionTypeId: "fixed-table",
        definitionVersion: 1,
        compilerVersion: "test",
        sourceRevision: 0,
        artifactChecksums: {
          descriptor: checksum,
          svg: checksum,
          png: checksum,
          thumbnails: {},
        },
        validation: { valid: true, diagnostics: [] },
        actorId: "test",
        publishedAt: "2026-07-15T00:00:00.000Z",
        reason: "isolation test",
      };
      const revisionArtifacts: readonly SvgArtifactRecord[] = [
        {
          revisionId: revision.revisionId,
          kind: "svg",
          checksum,
          storageKey: "svg-catalog/new-block.svg",
        },
      ];
      await workspace.revisionRepository.publish(
        revision,
        FIXED_REFERENCE_DEFINITION as SvgBlockDefinitionV1,
        revisionArtifacts,
      );
      expect(revisions.get(revision.revisionId)?.revision).toEqual(revision);
      expect(artifacts.get(revision.revisionId)).toEqual(revisionArtifacts);

      expect(() => workspace.resolvePath(CANONICAL_DESCRIPTOR_DIR)).toThrow(
        /outside isolated SVG editor V2 workspace/,
      );
      expect(() =>
        workspace.writeFile(
          path.join(CANONICAL_SVG_CATALOG_DIR, "must-not-write.svg"),
          svg,
        ),
      ).toThrow(/outside isolated SVG editor V2 workspace/);
      expect(existsSync(path.join(CANONICAL_SVG_CATALOG_DIR, "must-not-write.svg"))).toBe(false);
    });

    expect(existsSync(root)).toBe(false);
  });
});
