import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import { publishSvgAssetV2 } from "@/features/admin/svg-editor-v2/actions/publishSvgAssetV2";
import { rollbackSvgAssetV2 } from "@/features/admin/svg-editor-v2/actions/rollbackSvgAssetV2";
import { reopenSvgDraftV2, saveSvgDraftV2 } from "@/features/admin/svg-editor-v2/actions/saveSvgDraftV2";
import type { SvgAssetManifestV2 } from "@/features/admin/svg-editor-v2/model/svgAssetManifestV2";

function bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

function manifest(sourceChecksum: string, currentVersion = 1): SvgAssetManifestV2 {
  return {
    version: 2,
    assetId: "018f47ca-8131-7e40-9f1d-6b90f37b1290",
    productId: null,
    slug: "lifecycle-proof",
    name: "Lifecycle proof",
    assetKind: "fixed",
    dimensionsMm: { width: 100, depth: 80, height: 60 },
    sourceChecksum,
    lifecycle: "draft",
    currentVersion,
    capabilities: ["geometry"],
    createdAt: "2026-07-15T08:00:00.000Z",
    updatedAt: "2026-07-15T09:00:00.000Z",
  };
}

function memoryStorage() {
  const objects = new Map<string, { body: Uint8Array; mimeType: string; checksum: string }>();
  return {
    objects,
    async put(candidate: { key: string; body: Uint8Array; mimeType: string; checksum: string }) {
      objects.set(candidate.key, { body: candidate.body, mimeType: candidate.mimeType, checksum: candidate.checksum });
      return {
        provider: candidate.key.includes("release") ? "r2" as const : "supabase" as const,
        bucket: "test",
        key: candidate.key,
        mimeType: candidate.mimeType,
        contentLength: candidate.body.byteLength,
        checksum: candidate.checksum,
        created: true,
      };
    },
    async get(key: string) {
      const item = objects.get(key);
      return item ? { body: item.body, mimeType: item.mimeType, contentLength: item.body.byteLength } : null;
    },
    async verify(candidate: { key: string }) {
      return objects.has(candidate.key);
    },
    async deleteByExplicitKey(key: string) {
      objects.delete(key);
    },
  };
}

describe("SVG editor V2 lifecycle actions", () => {
  it("saves and reopens the complete private draft while preserving unsafe diagnostics", async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><path id="p" d="M0 0"/></svg>';
    const draftStorage = memoryStorage();

    const saved = await saveSvgDraftV2({
      manifest: manifest(sha256(svg)),
      svg,
      baseChecksum: sha256(svg),
      storage: draftStorage,
      now: "2026-07-15T10:00:00.000Z",
    });
    const reopened = await reopenSvgDraftV2(saved.key, draftStorage);

    expect(saved.ok).toBe(false);
    expect(saved.diagnostics.map((diagnostic) => diagnostic.code)).toContain("UNSAFE_TAG");
    expect(reopened.svg).toBe(svg);
  });

  it("publishes only sanitized checksum-verified artifacts after immutable version persistence", async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path id="p" d="M0 0"/></svg>';
    const png = bytes("png");
    const releaseStorage = memoryStorage();
    const calls: string[] = [];
    const result = await publishSvgAssetV2({
      manifest: manifest(sha256(svg), 2),
      expectedVersion: 1,
      expectedChecksum: "0".repeat(64),
      actorId: "admin",
      svg,
      png,
      releaseStorage,
      publish: async ({ artifacts }) => {
        calls.push(...artifacts.map((artifact) => artifact.key));
        return "committed";
      },
    });

    expect(result.status).toBe("committed");
    expect(calls).toEqual([
      "svg-editor-v2/lifecycle-proof/release-2.svg",
      "svg-editor-v2/lifecycle-proof/release-2.png",
    ]);
    expect(releaseStorage.objects.get(calls[0])?.checksum).toBe(sha256(svg));
  });

  it("rolls back by repointing to an immutable prior version without rewriting history", async () => {
    const result = await rollbackSvgAssetV2({
      assetId: "018f47ca-8131-7e40-9f1d-6b90f37b1290",
      targetVersion: 1,
      actorId: "admin",
      repoint: async (input) => ({ ...input, status: "rolled-back" as const }),
    });

    expect(result).toMatchObject({ targetVersion: 1, status: "rolled-back" });
  });
});
