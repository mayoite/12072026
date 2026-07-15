import { createHash } from "node:crypto";
import type { Dirent } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type SvgV1RevisionInventoryRow = {
  readonly revisionId: string;
  readonly slug: string;
  readonly version: number;
  readonly checksum: string;
};

export type SvgV1ArtifactInventoryRow = {
  readonly revisionId: string;
  readonly kind: string;
  readonly storageKey: string;
  readonly checksum: string;
  readonly sizeBytes: number;
};

export type SvgV1FileInventoryEntry = {
  readonly path: string;
  readonly slug: string;
  readonly version?: number;
  readonly sizeBytes: number;
  readonly sha256: string;
};

export type SvgV1InventoryManifest = {
  readonly schemaVersion: 1;
  readonly generatedAt: string;
  readonly descriptors: readonly SvgV1FileInventoryEntry[];
  readonly releasedSvgs: readonly SvgV1FileInventoryEntry[];
  readonly revisionRows: readonly SvgV1RevisionInventoryRow[];
  readonly artifactRows: readonly SvgV1ArtifactInventoryRow[];
};

export type CreateV1InventoryOptions = {
  readonly siteRoot: string;
  readonly resultsRoot: string;
  readonly generatedAt?: string;
  readonly revisionRows: readonly SvgV1RevisionInventoryRow[];
  readonly artifactRows: readonly SvgV1ArtifactInventoryRow[];
};

export type CreateV1InventoryResult = {
  readonly manifest: SvgV1InventoryManifest;
  readonly outputPath: string;
};

function checksum(body: Buffer | string): string {
  return createHash("sha256").update(body).digest("hex");
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, stableValue(child)]),
  );
}

export function stableJson(value: unknown): string {
  return JSON.stringify(stableValue(value), null, 2);
}

function toRelativeSitePath(siteRoot: string, filePath: string): string {
  return `site/${path.relative(siteRoot, filePath).replaceAll(path.sep, "/")}`;
}

function parseDescriptorIdentity(body: Buffer, fallbackSlug: string): { slug: string; version?: number } {
  try {
    const parsed = JSON.parse(body.toString("utf8")) as Record<string, unknown>;
    const slugValue = parsed.slug ?? parsed.typeId;
    const versionValue = parsed.version ?? parsed.definitionVersion;
    return {
      slug: typeof slugValue === "string" && slugValue.trim() ? slugValue : fallbackSlug,
      version: typeof versionValue === "number" && Number.isFinite(versionValue) ? versionValue : undefined,
    };
  } catch {
    return { slug: fallbackSlug };
  }
}

async function listFiles(root: string, suffix: string): Promise<string[]> {
  const found: string[] = [];
  async function visit(dir: string): Promise<void> {
    let entries: Dirent[];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(suffix)) {
        found.push(fullPath);
      }
    }
  }
  await visit(root);
  return found.sort((left, right) => left.localeCompare(right));
}

async function fileEntry(siteRoot: string, filePath: string, slug: string, version?: number): Promise<SvgV1FileInventoryEntry> {
  const body = await readFile(filePath);
  return {
    path: toRelativeSitePath(siteRoot, filePath),
    slug,
    ...(version === undefined ? {} : { version }),
    sizeBytes: body.byteLength,
    sha256: checksum(body),
  };
}

function assertResultsOutputPath(resultsRoot: string, outputPath: string): void {
  const allowedRoot = path.resolve(resultsRoot, "admin", "catalog-ops");
  const resolved = path.resolve(outputPath);
  const relative = path.relative(allowedRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("SVG V1 inventory output must stay under results/admin/catalog-ops");
  }
}

export async function createV1Inventory(options: CreateV1InventoryOptions): Promise<CreateV1InventoryResult> {
  const descriptorDir = path.join(options.siteRoot, "inventory", "descriptors");
  const svgDir = path.join(options.siteRoot, "public", "svg-catalog");

  const descriptors = await Promise.all(
    (await listFiles(descriptorDir, ".json")).map(async (filePath) => {
      const body = await readFile(filePath);
      const fallbackSlug = path.basename(filePath, ".json").replace(/(?:\.latest|\.\d+)$/, "");
      const identity = parseDescriptorIdentity(body, fallbackSlug);
      return fileEntry(options.siteRoot, filePath, identity.slug, identity.version);
    }),
  );

  const releasedSvgs = await Promise.all(
    (await listFiles(svgDir, ".svg")).map((filePath) =>
      fileEntry(options.siteRoot, filePath, path.basename(filePath, ".svg")),
    ),
  );

  const manifest: SvgV1InventoryManifest = {
    schemaVersion: 1,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    descriptors: descriptors.sort((left, right) => left.path.localeCompare(right.path)),
    releasedSvgs: releasedSvgs.sort((left, right) => left.path.localeCompare(right.path)),
    revisionRows: [...options.revisionRows].sort((left, right) =>
      left.slug.localeCompare(right.slug) ||
      left.version - right.version ||
      left.revisionId.localeCompare(right.revisionId),
    ),
    artifactRows: [...options.artifactRows].sort((left, right) =>
      left.revisionId.localeCompare(right.revisionId) ||
      left.kind.localeCompare(right.kind) ||
      left.storageKey.localeCompare(right.storageKey),
    ),
  };

  const outputPath = path.join(options.resultsRoot, "admin", "catalog-ops", "svg-v1-inventory.json");
  assertResultsOutputPath(options.resultsRoot, outputPath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return { manifest, outputPath };
}
