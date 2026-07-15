import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import type { SvgAssetManifestV2 } from "@/features/admin/svg-editor-v2/model/svgAssetManifestV2";
import {
  SupabaseSvgDraftStorage,
  type SupabaseSvgStorageDriver,
} from "@/features/admin/svg-editor-v2/persistence/svgDraftStorage";
import {
  SvgAssetRepositoryV2,
  type SvgAssetPublishPersistenceV2,
} from "@/features/admin/svg-editor-v2/persistence/svgAssetRepositoryV2.server";
import {
  R2SvgReleaseStorage,
  type R2SvgStorageDriver,
} from "@/features/admin/svg-editor-v2/persistence/svgReleaseStorage";

const ASSET_ID = "018f47ca-8131-7e40-9f1d-6b90f37b1290";

function sha256(body: Uint8Array): string {
  return createHash("sha256").update(body).digest("hex");
}

function bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function manifest(sourceChecksum: string): SvgAssetManifestV2 {
  return {
    version: 2,
    assetId: ASSET_ID,
    productId: null,
    slug: "storage-proof",
    name: "Storage proof",
    assetKind: "fixed",
    dimensionsMm: { width: 100, depth: 80, height: 60 },
    sourceChecksum,
    lifecycle: "live",
    currentVersion: 1,
    capabilities: ["geometry"],
    createdAt: "2026-07-15T08:00:00.000Z",
    updatedAt: "2026-07-15T09:00:00.000Z",
  };
}

function memoryDriver(options: { corruptReads?: boolean; failKey?: string } = {}) {
  const objects = new Map<string, { body: Uint8Array; mimeType: string }>();
  const put = async (key: string, body: Uint8Array, mimeType: string) => {
    if (key === options.failKey) throw new Error("upload failed");
    objects.set(key, { body: body.slice(), mimeType });
  };
  const get = async (key: string) => {
    const object = objects.get(key);
    if (!object) return null;
    return {
      body: options.corruptReads ? bytes("corrupt") : object.body.slice(),
      mimeType: object.mimeType,
      contentLength: object.body.byteLength,
    };
  };
  const remove = async (key: string) => {
    objects.delete(key);
  };
  return { objects, put, get, remove };
}

function artifact(scope: "draft" | "release", key: string, value: string, mimeType: string) {
  const body = bytes(value);
  return { scope, key, body, mimeType, checksum: sha256(body) } as const;
}

describe("SVG editor V2 storage boundaries", () => {
  it.each(["supabase", "r2"] as const)("verifies content after a %s upload", async (provider) => {
    const driver = memoryDriver();
    const storage = provider === "supabase"
      ? new SupabaseSvgDraftStorage(driver as SupabaseSvgStorageDriver, "private-drafts")
      : new R2SvgReleaseStorage(driver as R2SvgStorageDriver, "public-releases");
    const candidate = artifact(provider === "supabase" ? "draft" : "release", "asset/source.svg", "<svg/>", "image/svg+xml");

    await expect(storage.put(candidate)).resolves.toMatchObject({
      key: candidate.key,
      checksum: candidate.checksum,
      contentLength: candidate.body.byteLength,
      mimeType: candidate.mimeType,
    });
    await expect(storage.verify(candidate)).resolves.toBe(true);
  });

  it("removes a candidate whose read-back checksum does not match", async () => {
    const driver = memoryDriver({ corruptReads: true });
    const storage = new SupabaseSvgDraftStorage(driver, "private-drafts");
    const candidate = artifact("draft", "asset/corrupt.svg", "<svg/>", "image/svg+xml");

    await expect(storage.put(candidate)).rejects.toThrow(/verification failed/);
    expect(driver.objects.has(candidate.key)).toBe(false);
  });

  it("never overwrites an existing object with different bytes", async () => {
    const driver = memoryDriver();
    const storage = new R2SvgReleaseStorage(driver, "public-releases");
    const existing = artifact("release", "asset/release.svg", "<svg id=\"old\"/>", "image/svg+xml");
    const candidate = artifact("release", existing.key, "<svg id=\"new\"/>", "image/svg+xml");
    await storage.put(existing);

    await expect(storage.put(candidate)).rejects.toThrow(/conflict/);
    expect(sha256(driver.objects.get(existing.key)?.body ?? new Uint8Array())).toBe(existing.checksum);
  });

  it("cleans uploaded candidates when a later upload fails", async () => {
    const draftDriver = memoryDriver();
    const releaseDriver = memoryDriver({ failKey: "asset/release.svg" });
    const repository = new SvgAssetRepositoryV2({
      async loadManifest() { return null; },
      async compareAndSwapManifest() { return false; },
    }, {
      draftStorage: new SupabaseSvgDraftStorage(draftDriver, "private-drafts"),
      releaseStorage: new R2SvgReleaseStorage(releaseDriver, "public-releases"),
      publishPersistence: { async commitPublishedVersion() { return "committed"; } },
    });
    const source = artifact("draft", "asset/source.svg", "<svg/>", "image/svg+xml");

    await expect(repository.publishVersion({
      next: manifest(source.checksum),
      expectedVersion: 0,
      expectedChecksum: "0".repeat(64),
      actorId: "admin-1",
      artifacts: [source, artifact("release", "asset/release.svg", "<svg/>", "image/svg+xml")],
    })).rejects.toThrow("upload failed");
    expect(draftDriver.objects.size).toBe(0);
    expect(releaseDriver.objects.size).toBe(0);
  });

  it("cleans candidates when the database transaction fails", async () => {
    const draftDriver = memoryDriver();
    const releaseDriver = memoryDriver();
    const publishPersistence: SvgAssetPublishPersistenceV2 = {
      async commitPublishedVersion() { throw new Error("database failed"); },
    };
    const repository = new SvgAssetRepositoryV2({
      async loadManifest() { return null; },
      async compareAndSwapManifest() { return false; },
    }, {
      draftStorage: new SupabaseSvgDraftStorage(draftDriver, "private-drafts"),
      releaseStorage: new R2SvgReleaseStorage(releaseDriver, "public-releases"),
      publishPersistence,
    });
    const source = artifact("draft", "asset/source.svg", "<svg/>", "image/svg+xml");

    await expect(repository.publishVersion({
      next: manifest(source.checksum),
      expectedVersion: 0,
      expectedChecksum: "0".repeat(64),
      actorId: "admin-1",
      artifacts: [source, artifact("release", "asset/release.svg", "<svg/>", "image/svg+xml")],
    })).rejects.toThrow("database failed");
    expect(draftDriver.objects.size).toBe(0);
    expect(releaseDriver.objects.size).toBe(0);
  });

  it("does not delete a verified pre-existing object when a retry transaction fails", async () => {
    const draftDriver = memoryDriver();
    const releaseDriver = memoryDriver();
    const releaseStorage = new R2SvgReleaseStorage(releaseDriver, "public-releases");
    const released = artifact("release", "asset/release.svg", "<svg/>", "image/svg+xml");
    await releaseStorage.put(released);
    const repository = new SvgAssetRepositoryV2({
      async loadManifest() { return null; },
      async compareAndSwapManifest() { return false; },
    }, {
      draftStorage: new SupabaseSvgDraftStorage(draftDriver, "private-drafts"),
      releaseStorage,
      publishPersistence: { async commitPublishedVersion() { throw new Error("database failed"); } },
    });

    await expect(repository.publishVersion({
      next: manifest(released.checksum),
      expectedVersion: 0,
      expectedChecksum: "0".repeat(64),
      actorId: "admin-1",
      artifacts: [released],
    })).rejects.toThrow("database failed");
    expect(releaseDriver.objects.has(released.key)).toBe(true);
  });

  it("accepts an identical retry without deleting committed artifacts", async () => {
    const draftDriver = memoryDriver();
    const releaseDriver = memoryDriver();
    let commits = 0;
    const repository = new SvgAssetRepositoryV2({
      async loadManifest() { return null; },
      async compareAndSwapManifest() { return false; },
    }, {
      draftStorage: new SupabaseSvgDraftStorage(draftDriver, "private-drafts"),
      releaseStorage: new R2SvgReleaseStorage(releaseDriver, "public-releases"),
      publishPersistence: {
        async commitPublishedVersion() {
          commits += 1;
          return commits === 1 ? "committed" : "already-committed";
        },
      },
    });
    const source = artifact("draft", "asset/source.svg", "<svg/>", "image/svg+xml");
    const input = {
      next: manifest(source.checksum),
      expectedVersion: 0,
      expectedChecksum: "0".repeat(64),
      actorId: "admin-1",
      artifacts: [source, artifact("release", "asset/release.svg", "<svg/>", "image/svg+xml")],
    } as const;

    await expect(repository.publishVersion(input)).resolves.toBe("committed");
    await expect(repository.publishVersion(input)).resolves.toBe("already-committed");
    expect(draftDriver.objects.size).toBe(1);
    expect(releaseDriver.objects.size).toBe(1);
  });
});
