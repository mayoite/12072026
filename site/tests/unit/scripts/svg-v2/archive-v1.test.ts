// @vitest-environment node
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import os from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import {
  createR2V1ArchiveStore,
  createV1Archive,
  createV1ArchiveFileSource,
  restoreV1ArchiveDryRun,
} from "@/scripts/svg-v2/archive-v1";
import { createV1Inventory } from "@/scripts/svg-v2/inventory-v1";

const roots: string[] = [];

function tempRoot(): string {
  const root = mkdtempSync(path.join(os.tmpdir(), "oando-svg-v1-archive-"));
  roots.push(root);
  return root;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function writeText(filePath: string, body: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, body, "utf8");
}

class MemoryArchiveStore {
  readonly objects = new Map<string, string>();
  corruptReadKey: string | null = null;

  async putText(key: string, body: string): Promise<void> {
    this.objects.set(key, body);
  }

  async getText(key: string): Promise<string | null> {
    if (key === this.corruptReadKey) return "corrupt";
    return this.objects.get(key) ?? null;
  }
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("svg v2 V1 inventory and archive", () => {
  it("writes a deterministic dry-run inventory under results/admin/catalog-ops only", async () => {
    const workspace = tempRoot();
    const siteRoot = path.join(workspace, "site");
    const resultsRoot = path.join(workspace, "results");
    await writeText(
      path.join(siteRoot, "inventory/descriptors/chair.json"),
      JSON.stringify({ slug: "chair", version: 3 }),
    );
    await writeText(path.join(siteRoot, "public/svg-catalog/chair.svg"), "<svg><rect /></svg>");

    const inventory = await createV1Inventory({
      siteRoot,
      resultsRoot,
      generatedAt: "2026-07-15T00:00:00.000Z",
      revisionRows: [
        {
          revisionId: "chair-r3",
          slug: "chair",
          version: 3,
          checksum: "c".repeat(64),
        },
      ],
      artifactRows: [
        {
          revisionId: "chair-r3",
          kind: "svg",
          storageKey: "svg-catalog/chair.svg",
          checksum: "d".repeat(64),
          sizeBytes: 19,
        },
      ],
    });

    expect(inventory.outputPath).toBe(
      path.join(resultsRoot, "admin/catalog-ops/svg-v1-inventory.json"),
    );
    expect(readFileSync(inventory.outputPath, "utf8")).toBe(`${JSON.stringify(inventory.manifest, null, 2)}\n`);
    expect(inventory.manifest.descriptors).toEqual([
      {
        path: "site/inventory/descriptors/chair.json",
        slug: "chair",
        version: 3,
        sizeBytes: 28,
        sha256: sha256(JSON.stringify({ slug: "chair", version: 3 })),
      },
    ]);
    expect(inventory.manifest.releasedSvgs).toEqual([
      {
        path: "site/public/svg-catalog/chair.svg",
        slug: "chair",
        sizeBytes: 19,
        sha256: sha256("<svg><rect /></svg>"),
      },
    ]);
    expect(inventory.manifest.revisionRows).toHaveLength(1);
    expect(inventory.manifest.artifactRows).toHaveLength(1);
  });

  it("uploads every descriptor and released SVG under a timestamped prefix and verifies read-back checksums", async () => {
    const workspace = tempRoot();
    const siteRoot = path.join(workspace, "site");
    const resultsRoot = path.join(workspace, "results");
    const descriptor = JSON.stringify({ slug: "desk", version: 1 });
    const svg = "<svg />";
    await writeText(
      path.join(siteRoot, "inventory/descriptors/desk.json"),
      descriptor,
    );
    await writeText(path.join(siteRoot, "public/svg-catalog/desk.svg"), svg);

    const inventory = await createV1Inventory({
      siteRoot,
      resultsRoot,
      generatedAt: "2026-07-15T00:00:00.000Z",
      revisionRows: [],
      artifactRows: [],
    });
    const store = new MemoryArchiveStore();

    const archive = await createV1Archive({
      inventory: inventory.manifest,
      timestamp: "20260715T000000Z",
      store,
      source: createV1ArchiveFileSource(siteRoot),
      apply: true,
    });

    expect(archive.prefix).toBe("svg-v1-archive/20260715T000000Z/");
    expect(archive.verified).toBe(true);
    expect(archive.uploadedObjects).toEqual([
      {
        key: "svg-v1-archive/20260715T000000Z/site/inventory/descriptors/desk.json",
        path: "site/inventory/descriptors/desk.json",
        sha256: sha256(descriptor),
        sizeBytes: descriptor.length,
      },
      {
        key: "svg-v1-archive/20260715T000000Z/site/public/svg-catalog/desk.svg",
        path: "site/public/svg-catalog/desk.svg",
        sha256: sha256(svg),
        sizeBytes: svg.length,
      },
    ]);
    expect(archive.manifestChecksum).toMatch(/^[a-f0-9]{64}$/);
    expect(store.objects.has("svg-v1-archive/20260715T000000Z/manifest.json")).toBe(true);
    expect(store.objects.get("svg-v1-archive/20260715T000000Z/site/inventory/descriptors/desk.json")).toBe(descriptor);
    expect(store.objects.get("svg-v1-archive/20260715T000000Z/site/public/svg-catalog/desk.svg")).toBe(svg);
    expect(store.objects.get("svg-v1-archive/20260715T000000Z/manifest.sha256")).toBe(
      archive.manifestChecksum,
    );
  });

  it("rejects archive success when any uploaded object fails read-back checksum verification", async () => {
    const workspace = tempRoot();
    const siteRoot = path.join(workspace, "site");
    const resultsRoot = path.join(workspace, "results");
    await writeText(
      path.join(siteRoot, "inventory/descriptors/bad-read.json"),
      JSON.stringify({ slug: "bad-read", version: 1 }),
    );
    const inventory = await createV1Inventory({
      siteRoot,
      resultsRoot,
      generatedAt: "2026-07-15T00:00:00.000Z",
      revisionRows: [],
      artifactRows: [],
    });
    const store = new MemoryArchiveStore();
    store.corruptReadKey = "svg-v1-archive/20260715T000000Z/site/inventory/descriptors/bad-read.json";

    await expect(createV1Archive({
      inventory: inventory.manifest,
      timestamp: "20260715T000000Z",
      store,
      source: createV1ArchiveFileSource(siteRoot),
      apply: true,
    })).rejects.toThrow(/read-back checksum/i);
  });

  it("compares restore checksums without writing product files", async () => {
    const workspace = tempRoot();
    const siteRoot = path.join(workspace, "site");
    const resultsRoot = path.join(workspace, "results");
    const descriptor = JSON.stringify({ slug: "table", version: 2 });
    await writeText(path.join(siteRoot, "inventory/descriptors/table.json"), descriptor);
    await writeText(path.join(siteRoot, "public/svg-catalog/table.svg"), "<svg />");

    const inventory = await createV1Inventory({
      siteRoot,
      resultsRoot,
      generatedAt: "2026-07-15T00:00:00.000Z",
      revisionRows: [],
      artifactRows: [],
    });
    const store = new MemoryArchiveStore();
    const archive = await createV1Archive({
      inventory: inventory.manifest,
      timestamp: "20260715T000000Z",
      store,
      source: createV1ArchiveFileSource(siteRoot),
      apply: true,
    });

    const restore = await restoreV1ArchiveDryRun({
      inventory: inventory.manifest,
      prefix: archive.prefix,
      store,
    });

    expect(restore.ok).toBe(true);
    expect(restore.compared).toBe(2);
    expect(restore.mismatches).toEqual([]);
    expect(readFileSync(path.join(siteRoot, "inventory/descriptors/table.json"), "utf8")).toBe(descriptor);
  });

  it("restore dry-run reports archived body and row checksum mismatches without writes", async () => {
    const workspace = tempRoot();
    const siteRoot = path.join(workspace, "site");
    const resultsRoot = path.join(workspace, "results");
    const descriptor = JSON.stringify({ slug: "row-proof", version: 2 });
    await writeText(path.join(siteRoot, "inventory/descriptors/row-proof.json"), descriptor);
    await writeText(path.join(siteRoot, "public/svg-catalog/row-proof.svg"), "<svg />");

    const inventory = await createV1Inventory({
      siteRoot,
      resultsRoot,
      generatedAt: "2026-07-15T00:00:00.000Z",
      revisionRows: [{
        revisionId: "row-proof-r2",
        slug: "row-proof",
        version: 2,
        checksum: "a".repeat(64),
      }],
      artifactRows: [{
        revisionId: "row-proof-r2",
        kind: "svg",
        storageKey: "svg-catalog/row-proof.svg",
        checksum: "b".repeat(64),
        sizeBytes: 7,
      }],
    });
    const store = new MemoryArchiveStore();
    const archive = await createV1Archive({
      inventory: inventory.manifest,
      timestamp: "20260715T000000Z",
      store,
      source: createV1ArchiveFileSource(siteRoot),
      apply: true,
    });
    await store.putText(`${archive.prefix}site/public/svg-catalog/row-proof.svg`, "corrupt");

    const restore = await restoreV1ArchiveDryRun({
      inventory: {
        ...inventory.manifest,
        revisionRows: [{ ...inventory.manifest.revisionRows[0], checksum: "c".repeat(64) }],
        artifactRows: [{ ...inventory.manifest.artifactRows[0], checksum: "d".repeat(64) }],
      },
      prefix: archive.prefix,
      store,
    });

    expect(restore.ok).toBe(false);
    expect(restore.mismatches).toEqual([
      "site/public/svg-catalog/row-proof.svg",
      "revision:row-proof-r2",
      "artifact:row-proof-r2:svg:svg-catalog/row-proof.svg",
    ]);
    expect(readFileSync(path.join(siteRoot, "public/svg-catalog/row-proof.svg"), "utf8")).toBe("<svg />");
  });

  it("creates an R2-backed archive store from the existing catalog R2 client helpers", async () => {
    const sent: Array<{ input: { Bucket: string; Key: string; Body?: string } }> = [];
    const client = {
      async send(command: { input: { Bucket: string; Key: string; Body?: string } }) {
        sent.push(command);
        if (command.input.Body !== undefined) return {};
        return { Body: { transformToString: async () => "stored" } };
      },
    };
    const store = createR2V1ArchiveStore({
      createClient: () => client,
      bucket: "archive-bucket",
    });

    await store.putText("prefix/object.txt", "stored");
    await expect(store.getText("prefix/object.txt")).resolves.toBe("stored");
    expect(sent.map((command) => command.input)).toEqual([
      { Bucket: "archive-bucket", Key: "prefix/object.txt", Body: "stored", ContentType: "application/octet-stream" },
      { Bucket: "archive-bucket", Key: "prefix/object.txt" },
    ]);
  });
});
