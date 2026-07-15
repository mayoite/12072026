import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { stableJson, type SvgV1InventoryManifest } from "./inventory-v1";
import {
  contentTypeForKey,
  createR2CatalogClient,
  resolveCatalogBucketName,
} from "../../lib/storage/r2Catalog";

export type SvgV1ArchiveStore = {
  putText(key: string, body: string): Promise<void>;
  getText(key: string): Promise<string | null>;
};

export type SvgV1ArchiveSource = {
  readText(siteRelativePath: string): Promise<string>;
};

export type CreateV1ArchiveOptions = {
  readonly inventory: SvgV1InventoryManifest;
  readonly timestamp: string;
  readonly store: SvgV1ArchiveStore;
  readonly source?: SvgV1ArchiveSource;
  readonly apply?: boolean;
};

export type SvgV1ArchivedObject = {
  readonly key: string;
  readonly path: string;
  readonly sha256: string;
  readonly sizeBytes: number;
};

export type CreateV1ArchiveResult = {
  readonly prefix: string;
  readonly manifestKey: string;
  readonly checksumKey: string;
  readonly manifestChecksum: string;
  readonly uploadedObjects: readonly SvgV1ArchivedObject[];
  readonly verified: boolean;
  readonly dryRun: boolean;
};

export type RestoreV1ArchiveDryRunOptions = {
  readonly inventory: SvgV1InventoryManifest;
  readonly prefix: string;
  readonly store: SvgV1ArchiveStore;
};

export type RestoreV1ArchiveDryRunResult = {
  readonly ok: boolean;
  readonly compared: number;
  readonly mismatches: readonly string[];
};

type ArchivedChecksumEntry = {
  readonly path: string;
  readonly sha256: string;
};

type ArchiveManifest = {
  readonly schemaVersion: 1;
  readonly archivedAt: string;
  readonly inventory: SvgV1InventoryManifest;
  readonly objects: readonly SvgV1ArchivedObject[];
  readonly fileChecksums: readonly ArchivedChecksumEntry[];
  readonly revisionRowChecksums: readonly ArchivedChecksumEntry[];
  readonly artifactRowChecksums: readonly ArchivedChecksumEntry[];
};

type R2ArchiveClient = {
  send(command: PutObjectCommand | GetObjectCommand): Promise<{
    Body?: {
      transformToString(encoding?: string): Promise<string>;
    };
  }>;
};

function sha256(body: string): string {
  return createHash("sha256").update(body).digest("hex");
}

function archivePrefix(timestamp: string): string {
  if (!/^\d{8}T\d{6}Z$/.test(timestamp)) {
    throw new Error("archive timestamp must use YYYYMMDDTHHMMSSZ");
  }
  return `svg-v1-archive/${timestamp}/`;
}

function checksumEntry(path: string, value: unknown): ArchivedChecksumEntry {
  return { path, sha256: sha256(stableJson(value)) };
}

function expectedFiles(inventory: SvgV1InventoryManifest) {
  return [...inventory.descriptors, ...inventory.releasedSvgs]
    .sort((left, right) => left.path.localeCompare(right.path));
}

function rowChecksums(inventory: SvgV1InventoryManifest): {
  readonly revisionRowChecksums: readonly ArchivedChecksumEntry[];
  readonly artifactRowChecksums: readonly ArchivedChecksumEntry[];
} {
  return {
    revisionRowChecksums: inventory.revisionRows
      .map((row) => checksumEntry(`revision:${row.revisionId}`, row))
      .sort((left, right) => left.path.localeCompare(right.path)),
    artifactRowChecksums: inventory.artifactRows
      .map((row) => checksumEntry(`artifact:${row.revisionId}:${row.kind}:${row.storageKey}`, row))
      .sort((left, right) => left.path.localeCompare(right.path)),
  };
}

function buildArchiveManifest(
  inventory: SvgV1InventoryManifest,
  timestamp: string,
  objects: readonly SvgV1ArchivedObject[],
): ArchiveManifest {
  const rows = rowChecksums(inventory);
  return {
    schemaVersion: 1,
    archivedAt: timestamp,
    inventory,
    objects,
    fileChecksums: expectedFiles(inventory)
      .map((entry) => ({ path: entry.path, sha256: entry.sha256 }))
      .sort((left, right) => left.path.localeCompare(right.path)),
    revisionRowChecksums: rows.revisionRowChecksums,
    artifactRowChecksums: rows.artifactRowChecksums,
  };
}

function ensureSiteRelative(siteRelativePath: string): string {
  if (!siteRelativePath.startsWith("site/")) {
    throw new Error(`archive source path must be site-relative: ${siteRelativePath}`);
  }
  return siteRelativePath.slice("site/".length);
}

export function createV1ArchiveFileSource(siteRoot: string): SvgV1ArchiveSource {
  const resolvedRoot = path.resolve(siteRoot);
  return {
    async readText(siteRelativePath) {
      const resolved = path.resolve(resolvedRoot, ensureSiteRelative(siteRelativePath));
      const relative = path.relative(resolvedRoot, resolved);
      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error(`archive source path escapes site root: ${siteRelativePath}`);
      }
      return readFile(resolved, "utf8");
    },
  };
}

export function createR2V1ArchiveStore(options: {
  readonly createClient?: () => R2ArchiveClient;
  readonly bucket?: string;
} = {}): SvgV1ArchiveStore {
  const client = options.createClient?.() ?? createR2CatalogClient();
  const bucket = options.bucket ?? resolveCatalogBucketName();
  return {
    async putText(key, body) {
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentTypeForKey(key),
      }));
    },
    async getText(key) {
      const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      return (await response.Body?.transformToString("utf-8")) ?? null;
    },
  };
}

async function uploadAndVerifyObject(
  store: SvgV1ArchiveStore,
  key: string,
  siteRelativePath: string,
  body: string,
  expectedSha256: string,
): Promise<SvgV1ArchivedObject> {
  const actualSha256 = sha256(body);
  if (actualSha256 !== expectedSha256) {
    throw new Error(`source checksum mismatch for ${siteRelativePath}`);
  }
  await store.putText(key, body);
  const readBack = await store.getText(key);
  if (readBack === null || sha256(readBack) !== expectedSha256) {
    throw new Error(`read-back checksum verification failed for ${siteRelativePath}`);
  }
  return {
    key,
    path: siteRelativePath,
    sha256: expectedSha256,
    sizeBytes: Buffer.byteLength(body, "utf8"),
  };
}

export async function createV1Archive(options: CreateV1ArchiveOptions): Promise<CreateV1ArchiveResult> {
  const prefix = archivePrefix(options.timestamp);
  const manifestKey = `${prefix}manifest.json`;
  const checksumKey = `${prefix}manifest.sha256`;

  if (!options.apply) {
    const archiveManifest = buildArchiveManifest(options.inventory, options.timestamp, []);
    const manifestBody = stableJson(archiveManifest);
    return {
      prefix,
      manifestKey,
      checksumKey,
      manifestChecksum: sha256(manifestBody),
      uploadedObjects: [],
      verified: false,
      dryRun: true,
    };
  }

  if (!options.source) {
    throw new Error("SVG V1 archive apply requires an injected source reader");
  }

  const uploadedObjects: SvgV1ArchivedObject[] = [];
  for (const entry of expectedFiles(options.inventory)) {
    const body = await options.source.readText(entry.path);
    uploadedObjects.push(
      await uploadAndVerifyObject(
        options.store,
        `${prefix}${entry.path}`,
        entry.path,
        body,
        entry.sha256,
      ),
    );
  }

  const archiveManifest = buildArchiveManifest(options.inventory, options.timestamp, uploadedObjects);
  const manifestBody = stableJson(archiveManifest);
  const manifestChecksum = sha256(manifestBody);
  await options.store.putText(manifestKey, manifestBody);
  await options.store.putText(checksumKey, manifestChecksum);

  const readBackManifest = await options.store.getText(manifestKey);
  const readBackChecksum = await options.store.getText(checksumKey);
  if (readBackManifest !== manifestBody || readBackChecksum !== manifestChecksum) {
    throw new Error("SVG V1 archive read-back verification failed");
  }

  return {
    prefix,
    manifestKey,
    checksumKey,
    manifestChecksum,
    uploadedObjects,
    verified: true,
    dryRun: false,
  };
}

function expectedFileChecksums(inventory: SvgV1InventoryManifest): readonly ArchivedChecksumEntry[] {
  return expectedFiles(inventory)
    .map((entry) => ({ path: entry.path, sha256: entry.sha256 }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function checksumMap(entries: readonly ArchivedChecksumEntry[]): Map<string, string> {
  return new Map(entries.map((entry) => [entry.path, entry.sha256]));
}

function rowMismatches(
  archivedRows: readonly ArchivedChecksumEntry[],
  expectedRows: readonly ArchivedChecksumEntry[],
): string[] {
  const archived = checksumMap(archivedRows);
  return expectedRows
    .filter((entry) => archived.get(entry.path) !== entry.sha256)
    .map((entry) => entry.path);
}

export async function restoreV1ArchiveDryRun(
  options: RestoreV1ArchiveDryRunOptions,
): Promise<RestoreV1ArchiveDryRunResult> {
  const manifestBody = await options.store.getText(`${options.prefix}manifest.json`);
  const checksumBody = await options.store.getText(`${options.prefix}manifest.sha256`);
  if (!manifestBody || !checksumBody) {
    return { ok: false, compared: 0, mismatches: ["archive manifest or checksum is missing"] };
  }
  if (sha256(manifestBody) !== checksumBody) {
    return { ok: false, compared: 0, mismatches: ["archive manifest checksum mismatch"] };
  }

  const parsed = JSON.parse(manifestBody) as ArchiveManifest;
  const expected = expectedFileChecksums(options.inventory);
  const mismatches: string[] = [];
  for (const entry of expected) {
    const archivedBody = await options.store.getText(`${options.prefix}${entry.path}`);
    if (archivedBody === null || sha256(archivedBody) !== entry.sha256) {
      mismatches.push(entry.path);
    }
  }

  const rows = rowChecksums(options.inventory);
  mismatches.push(...rowMismatches(parsed.revisionRowChecksums, rows.revisionRowChecksums));
  mismatches.push(...rowMismatches(parsed.artifactRowChecksums, rows.artifactRowChecksums));

  return {
    ok: mismatches.length === 0,
    compared: expected.length,
    mismatches,
  };
}
