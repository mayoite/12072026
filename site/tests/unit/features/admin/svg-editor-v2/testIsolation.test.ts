import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { SvgAssetManifestV2 } from "@/features/admin/svg-editor-v2/model/svgAssetManifestV2";
import {
  CANONICAL_DESCRIPTOR_DIR,
  CANONICAL_SVG_CATALOG_DIR,
  withSvgEditorV2TestWorkspace,
} from "@/tests/helpers/svgEditorV2TestWorkspace";

function checksum(body: Uint8Array): string {
  return createHash("sha256").update(body).digest("hex");
}

describe("SVG editor V2 test isolation", () => {
  it("persists V2 state only in a temporary workspace with injected repositories", async () => {
    const manifests = new Map<string, SvgAssetManifestV2>();
    const publishedVersions = new Map<string, SvgAssetManifestV2>();
    let root = "";

    await withSvgEditorV2TestWorkspace({ manifests, publishedVersions }, async (workspace) => {
      root = workspace.root;
      const source = new TextEncoder().encode(readFileSync(
        path.resolve(__dirname, "../../../../fixtures/svg-editor-v2/minimal-safe.svg"),
        "utf8",
      ));
      const sourceChecksum = checksum(source);
      const initial: SvgAssetManifestV2 = {
        version: 2,
        assetId: "018f47ca-8131-7e40-9f1d-6b90f37b1290",
        productId: null,
        slug: "isolated-v2-asset",
        name: "Isolated V2 asset",
        assetKind: "fixed",
        dimensionsMm: { width: 100, depth: 60, height: 40 },
        sourceChecksum,
        lifecycle: "draft",
        currentVersion: 0,
        capabilities: ["geometry"],
        createdAt: "2026-07-15T00:00:00.000Z",
        updatedAt: "2026-07-15T00:00:00.000Z",
      };
      manifests.set(initial.assetId, initial);
      const published = {
        ...initial,
        lifecycle: "live" as const,
        currentVersion: 1,
        updatedAt: "2026-07-15T01:00:00.000Z",
      };

      await expect(workspace.assetRepository.publishVersion({
        next: published,
        expectedVersion: 0,
        expectedChecksum: sourceChecksum,
        actorId: "test-admin",
        artifacts: [
          { scope: "draft", key: "isolated/source.svg", body: source, mimeType: "image/svg+xml", checksum: sourceChecksum },
          { scope: "release", key: "isolated/release.svg", body: source, mimeType: "image/svg+xml", checksum: sourceChecksum },
        ],
      })).resolves.toBe("committed");
      expect(publishedVersions.get(`${initial.assetId}:1`)).toEqual(published);
      expect(manifests.get(initial.assetId)).toEqual(published);
      expect(existsSync(path.join(workspace.draftDir, "isolated/source.svg"))).toBe(true);
      expect(existsSync(path.join(workspace.releaseDir, "isolated/release.svg"))).toBe(true);

      expect(() => workspace.resolvePath(CANONICAL_DESCRIPTOR_DIR)).toThrow(/outside isolated SVG editor V2 workspace/);
      expect(() => workspace.resolvePath(CANONICAL_SVG_CATALOG_DIR)).toThrow(/outside isolated SVG editor V2 workspace/);
    });

    expect(existsSync(root)).toBe(false);
    expect(existsSync(path.join(CANONICAL_SVG_CATALOG_DIR, "isolated/release.svg"))).toBe(false);
  });
});
