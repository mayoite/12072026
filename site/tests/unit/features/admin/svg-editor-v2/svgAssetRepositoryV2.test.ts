import { describe, expect, it } from "vitest";

import type { SvgAssetManifestV2 } from "@/features/admin/svg-editor-v2/model/svgAssetManifestV2";
import {
  SvgAssetConcurrencyError,
  SvgAssetRepositoryV2,
  type SvgAssetRepositoryV2Persistence,
} from "@/features/admin/svg-editor-v2/persistence/svgAssetRepositoryV2.server";

const ASSET_ID = "018f47ca-8131-7e40-9f1d-6b90f37b1290";
const FIRST_CHECKSUM = "a".repeat(64);
const SECOND_CHECKSUM = "b".repeat(64);

function manifest(overrides: Partial<SvgAssetManifestV2> = {}): SvgAssetManifestV2 {
  return {
    version: 2,
    assetId: ASSET_ID,
    productId: null,
    slug: "unlinked-draft",
    name: "Unlinked draft",
    assetKind: "fixed",
    dimensionsMm: { width: 100, depth: 80, height: 60 },
    sourceChecksum: FIRST_CHECKSUM,
    lifecycle: "draft",
    currentVersion: 0,
    capabilities: ["geometry"],
    createdAt: "2026-07-15T08:00:00.000Z",
    updatedAt: "2026-07-15T08:00:00.000Z",
    ...overrides,
  };
}

function inMemoryPersistence(initial: SvgAssetManifestV2): {
  persistence: SvgAssetRepositoryV2Persistence;
  read(): SvgAssetManifestV2;
} {
  let current = structuredClone(initial);
  return {
    persistence: {
      async loadManifest(assetId) {
        return assetId === current.assetId ? structuredClone(current) : null;
      },
      async compareAndSwapManifest(input) {
        if (
          input.assetId !== current.assetId ||
          input.expectedVersion !== current.currentVersion ||
          input.expectedChecksum !== current.sourceChecksum
        ) {
          return false;
        }
        current = structuredClone(input.next);
        return true;
      },
    },
    read: () => structuredClone(current),
  };
}

describe("SvgAssetRepositoryV2 optimistic concurrency", () => {
  it("updates when version and checksum both match", async () => {
    const memory = inMemoryPersistence(manifest());
    const repository = new SvgAssetRepositoryV2(memory.persistence);
    const next = manifest({
      currentVersion: 1,
      sourceChecksum: SECOND_CHECKSUM,
      updatedAt: "2026-07-15T09:00:00.000Z",
    });

    await expect(repository.updateManifest({
      next,
      expectedVersion: 0,
      expectedChecksum: FIRST_CHECKSUM,
    })).resolves.toEqual(next);
    expect(memory.read()).toEqual(next);
  });

  it.each([
    ["version", 1, FIRST_CHECKSUM, 2],
    ["checksum", 0, SECOND_CHECKSUM, 1],
  ] as const)("rejects a stale %s condition without modifying the asset", async (_, expectedVersion, expectedChecksum, nextVersion) => {
    const initial = manifest();
    const memory = inMemoryPersistence(initial);
    const repository = new SvgAssetRepositoryV2(memory.persistence);

    await expect(repository.updateManifest({
      next: manifest({ currentVersion: nextVersion, sourceChecksum: SECOND_CHECKSUM }),
      expectedVersion,
      expectedChecksum,
    })).rejects.toBeInstanceOf(SvgAssetConcurrencyError);
    expect(memory.read()).toEqual(initial);
  });

  it("rejects a skipped version before persistence", async () => {
    const initial = manifest();
    const memory = inMemoryPersistence(initial);
    const repository = new SvgAssetRepositoryV2(memory.persistence);

    await expect(repository.updateManifest({
      next: manifest({ currentVersion: 2, sourceChecksum: SECOND_CHECKSUM }),
      expectedVersion: 0,
      expectedChecksum: FIRST_CHECKSUM,
    })).rejects.toThrow(/exactly one/);
    expect(memory.read()).toEqual(initial);
  });
});
