import "server-only";

import { and, eq } from "drizzle-orm";

import { productsDb } from "@/platform/drizzle/productsDb";
import {
  svgAssetArtifactsV2,
  svgAssetsV2,
  svgAssetVersionsV2,
} from "@/platform/drizzle/schema/catalog";
import type { SvgAssetManifestV2 } from "../model/svgAssetManifestV2";
import { parseSvgAssetManifestV2 } from "../model/svgAssetSchemasV2";
import type {
  SvgObjectStorageV2,
  SvgStorageCandidateV2,
  SvgStoredObjectV2,
} from "./svgDraftStorage";

export interface SvgAssetManifestCompareAndSwapV2 {
  readonly assetId: string;
  readonly expectedVersion: number;
  readonly expectedChecksum: string;
  readonly next: SvgAssetManifestV2;
}

export interface SvgAssetRepositoryV2Persistence {
  loadManifest(assetId: string): Promise<SvgAssetManifestV2 | null>;
  compareAndSwapManifest(input: SvgAssetManifestCompareAndSwapV2): Promise<boolean>;
}

export interface SvgAssetArtifactCandidateV2 extends SvgStorageCandidateV2 {
  readonly scope: "draft" | "release";
}

export interface SvgAssetPublishPersistenceV2 {
  commitPublishedVersion(input: {
    readonly manifest: SvgAssetManifestV2;
    readonly expectedVersion: number;
    readonly expectedChecksum: string;
    readonly actorId: string;
    readonly artifacts: readonly SvgStoredObjectV2[];
  }): Promise<"committed" | "already-committed">;
}

interface SvgAssetPublishDependenciesV2 {
  readonly draftStorage: SvgObjectStorageV2;
  readonly releaseStorage: SvgObjectStorageV2;
  readonly publishPersistence: SvgAssetPublishPersistenceV2;
}

export class SvgAssetConcurrencyError extends Error {
  constructor(assetId: string) {
    super(`SVG asset ${assetId} changed since it was loaded`);
    this.name = "SvgAssetConcurrencyError";
  }
}

export class SvgAssetRepositoryV2 {
  constructor(
    private readonly persistence: SvgAssetRepositoryV2Persistence,
    private readonly publishDependencies?: SvgAssetPublishDependenciesV2,
  ) {}

  async updateManifest(input: {
    readonly next: SvgAssetManifestV2;
    readonly expectedVersion: number;
    readonly expectedChecksum: string;
  }): Promise<SvgAssetManifestV2> {
    const next = parseSvgAssetManifestV2(input.next);
    if (next.currentVersion !== input.expectedVersion + 1) {
      throw new RangeError("SVG asset version must advance by exactly one");
    }
    const updated = await this.persistence.compareAndSwapManifest({
      assetId: next.assetId,
      expectedVersion: input.expectedVersion,
      expectedChecksum: input.expectedChecksum,
      next,
    });
    if (!updated) throw new SvgAssetConcurrencyError(next.assetId);
    return next;
  }

  async publishVersion(input: {
    readonly next: SvgAssetManifestV2;
    readonly expectedVersion: number;
    readonly expectedChecksum: string;
    readonly actorId: string;
    readonly artifacts: readonly SvgAssetArtifactCandidateV2[];
  }): Promise<"committed" | "already-committed"> {
    const dependencies = this.publishDependencies;
    if (!dependencies) throw new Error("SVG asset publish dependencies are not configured");
    const manifest = parseSvgAssetManifestV2(input.next);
    if (manifest.currentVersion !== input.expectedVersion + 1) {
      throw new RangeError("SVG asset version must advance by exactly one");
    }
    if (input.artifacts.length === 0) throw new Error("SVG asset publish requires artifacts");

    const seen = new Set<string>();
    for (const artifact of input.artifacts) {
      const identity = `${artifact.scope}:${artifact.key}`;
      if (seen.has(identity)) throw new Error(`duplicate SVG artifact candidate: ${identity}`);
      seen.add(identity);
    }

    const uploaded: Array<{ storage: SvgObjectStorageV2; key: string }> = [];
    const stored: SvgStoredObjectV2[] = [];
    try {
      for (const artifact of input.artifacts) {
        const storage = artifact.scope === "draft"
          ? dependencies.draftStorage
          : dependencies.releaseStorage;
        const record = await storage.put(artifact);
        if (record.created) uploaded.push({ storage, key: artifact.key });
        stored.push(record);
      }
      return await dependencies.publishPersistence.commitPublishedVersion({
        manifest,
        expectedVersion: input.expectedVersion,
        expectedChecksum: input.expectedChecksum,
        actorId: input.actorId,
        artifacts: stored,
      });
    } catch (error) {
      await Promise.allSettled(
        uploaded.reverse().map(({ storage, key }) => storage.deleteByExplicitKey(key)),
      );
      throw error;
    }
  }
}

export class DrizzleSvgAssetPersistenceV2
implements SvgAssetRepositoryV2Persistence, SvgAssetPublishPersistenceV2 {
  async loadManifest(assetId: string): Promise<SvgAssetManifestV2 | null> {
    const rows = await productsDb.select().from(svgAssetsV2)
      .where(eq(svgAssetsV2.id, assetId)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return parseSvgAssetManifestV2({
      version: 2,
      assetId: row.id,
      productId: row.productId,
      slug: row.slug,
      name: row.name,
      assetKind: row.assetKind,
      dimensionsMm: row.dimensionsMm,
      sourceChecksum: row.currentSourceChecksum,
      lifecycle: row.lifecycle,
      currentVersion: row.currentVersion,
      capabilities: row.capabilities,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  async compareAndSwapManifest(input: SvgAssetManifestCompareAndSwapV2): Promise<boolean> {
    const updated = await productsDb.update(svgAssetsV2).set({
      productId: input.next.productId,
      slug: input.next.slug,
      name: input.next.name,
      assetKind: input.next.assetKind,
      dimensionsMm: input.next.dimensionsMm,
      lifecycle: input.next.lifecycle,
      currentVersion: input.next.currentVersion,
      currentSourceChecksum: input.next.sourceChecksum,
      capabilities: [...input.next.capabilities],
      updatedAt: new Date(input.next.updatedAt),
    }).where(and(
      eq(svgAssetsV2.id, input.assetId),
      eq(svgAssetsV2.currentVersion, input.expectedVersion),
      eq(svgAssetsV2.currentSourceChecksum, input.expectedChecksum),
    )).returning({ id: svgAssetsV2.id });
    return updated.length === 1;
  }

  async commitPublishedVersion(input: {
    readonly manifest: SvgAssetManifestV2;
    readonly expectedVersion: number;
    readonly expectedChecksum: string;
    readonly actorId: string;
    readonly artifacts: readonly SvgStoredObjectV2[];
  }): Promise<"committed" | "already-committed"> {
    return productsDb.transaction(async (transaction) => {
      const existing = await transaction.select({
        id: svgAssetVersionsV2.id,
        sourceChecksum: svgAssetVersionsV2.sourceChecksum,
      }).from(svgAssetVersionsV2).where(and(
        eq(svgAssetVersionsV2.assetId, input.manifest.assetId),
        eq(svgAssetVersionsV2.version, input.manifest.currentVersion),
      )).limit(1);
      if (existing[0]) {
        if (existing[0].sourceChecksum !== input.manifest.sourceChecksum) {
          throw new Error("immutable SVG asset version checksum conflict");
        }
        const artifactRows = await transaction.select({
          provider: svgAssetArtifactsV2.provider,
          bucket: svgAssetArtifactsV2.bucket,
          key: svgAssetArtifactsV2.objectKey,
          mimeType: svgAssetArtifactsV2.mimeType,
          contentLength: svgAssetArtifactsV2.sizeBytes,
          checksum: svgAssetArtifactsV2.checksum,
        }).from(svgAssetArtifactsV2).where(eq(svgAssetArtifactsV2.versionId, existing[0].id));
        const normalizeArtifact = (artifact: {
          provider: string;
          bucket: string;
          key: string;
          mimeType: string;
          contentLength: number;
          checksum: string;
        }) => JSON.stringify(artifact);
        const persisted = artifactRows.map(normalizeArtifact).sort();
        const requested = input.artifacts.map(normalizeArtifact).sort();
        if (persisted.length !== requested.length || persisted.some((value, index) => value !== requested[index])) {
          throw new Error("immutable SVG asset version artifact conflict");
        }
        return "already-committed" as const;
      }

      const inserted = await transaction.insert(svgAssetVersionsV2).values({
        assetId: input.manifest.assetId,
        version: input.manifest.currentVersion,
        manifest: input.manifest,
        sourceChecksum: input.manifest.sourceChecksum,
        createdBy: input.actorId,
        createdAt: new Date(input.manifest.updatedAt),
      }).returning({ id: svgAssetVersionsV2.id });
      const versionId = inserted[0]?.id;
      if (!versionId) throw new Error("SVG asset version insert returned no id");

      if (input.artifacts.length > 0) {
        await transaction.insert(svgAssetArtifactsV2).values(input.artifacts.map((artifact) => ({
          versionId,
          provider: artifact.provider,
          bucket: artifact.bucket,
          objectKey: artifact.key,
          mimeType: artifact.mimeType,
          sizeBytes: artifact.contentLength,
          checksum: artifact.checksum,
        })));
      }

      const updated = await transaction.update(svgAssetsV2).set({
        productId: input.manifest.productId,
        slug: input.manifest.slug,
        name: input.manifest.name,
        assetKind: input.manifest.assetKind,
        dimensionsMm: input.manifest.dimensionsMm,
        lifecycle: input.manifest.lifecycle,
        currentVersion: input.manifest.currentVersion,
        currentVersionId: versionId,
        currentSourceChecksum: input.manifest.sourceChecksum,
        capabilities: [...input.manifest.capabilities],
        updatedAt: new Date(input.manifest.updatedAt),
      }).where(and(
        eq(svgAssetsV2.id, input.manifest.assetId),
        eq(svgAssetsV2.currentVersion, input.expectedVersion),
        eq(svgAssetsV2.currentSourceChecksum, input.expectedChecksum),
      )).returning({ id: svgAssetsV2.id });
      if (updated.length !== 1) throw new SvgAssetConcurrencyError(input.manifest.assetId);
      return "committed" as const;
    });
  }
}
