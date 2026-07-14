// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  CDN_BASE_URL,
  collectPathsFromCatalogItems,
  downloadFile,
  filterLocalRelativePaths,
  run,
} from "@/scripts/downloadCdnAssets";

describe("downloadCdnAssets (name-mirror)", () => {
  it("exposes CDN base and collects catalog image paths", () => {
    expect(CDN_BASE_URL).toMatch(/^https:\/\//);
    const paths = collectPathsFromCatalogItems([
      {
        images: ["/images/a.png", "https://x/y.png"],
        flagship_image: "/images/flag.jpg",
        metadata: { threeDModelUrl: "/models/a.glb" },
      },
    ]);
    expect(paths).toEqual(
      expect.arrayContaining(["/images/a.png", "/images/flag.jpg", "/models/a.glb"]),
    );
    expect(filterLocalRelativePaths(paths)).toEqual([
      "/images/a.png",
      "/images/flag.jpg",
      "/models/a.glb",
    ]);
  });

  it("skips download when local asset exists", async () => {
    const fetchImpl = vi.fn();
    const ok = await downloadFile(
      `${CDN_BASE_URL}/images/a.png`,
      "/tmp/public/images/a.png",
      "/images/a.png",
      new Map(),
      {
        exists: () => true,
        mkdir: vi.fn() as never,
        localExists: () => true,
        fetchImpl: fetchImpl as never,
      },
    );
    expect(ok).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("downloads via mocked fetch and writes bytes", async () => {
    const writeFile = vi.fn();
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    }));
    const ok = await downloadFile(
      `${CDN_BASE_URL}/images/b.png`,
      "/tmp/public/images/b.png",
      "/images/b.png",
      new Map(),
      {
        exists: () => true,
        mkdir: vi.fn() as never,
        writeFile: writeFile as never,
        localExists: () => false,
        resolveMissing: () => ({ kind: "none" }) as never,
        fetchImpl: fetchImpl as never,
        log: vi.fn(),
      },
    );
    expect(ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith(`${CDN_BASE_URL}/images/b.png`);
    expect(writeFile).toHaveBeenCalledOnce();
    const buf = writeFile.mock.calls[0]?.[1] as Buffer;
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect([...buf]).toEqual([1, 2, 3]);
  });

  it("returns false on non-OK network response", async () => {
    const ok = await downloadFile(
      `${CDN_BASE_URL}/images/missing.png`,
      "/tmp/x",
      "/images/missing.png",
      new Map(),
      {
        exists: () => true,
        localExists: () => false,
        resolveMissing: () => ({ kind: "none" }) as never,
        fetchImpl: (async () => ({ ok: false, status: 404 })) as never,
        warn: vi.fn(),
      },
    );
    expect(ok).toBe(false);
  });

  it("run tallies successes with mocked collect/download", async () => {
    const result = await run({
      collect: async () => ["/images/a.png", "/images/b.png"],
      download: async (_u, _d, rel) => rel.endsWith("a.png"),
      buildIndex: () => new Map(),
      publicDir: "/tmp/public",
      log: vi.fn(),
    });
    expect(result).toEqual({ total: 2, successCount: 1 });
  });
});
