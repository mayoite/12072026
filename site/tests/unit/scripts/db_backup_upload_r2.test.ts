// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  TARGETS,
  backupTarget,
  hasFlag,
  pickTargets,
  timestamp,
  uploadFile,
  uploadLatestJsonBackup,
} from "@/scripts/db_backup_upload_r2";

describe("db_backup_upload_r2 (name-mirror)", () => {
  it("parses CLI flags and targets", () => {
    expect(hasFlag("--keep-local", ["node", "x", "--keep-local"])).toBe(true);
    expect(hasFlag("--with-json", ["node", "x"])).toBe(false);
    expect(pickTargets(["node", "x"])).toEqual(["products", "admin"]);
    expect(pickTargets(["node", "x", "--target", "admin", "--target", "admin"])).toEqual([
      "admin",
    ]);
    expect(TARGETS.products).toBe("PRODUCTS_DATABASE_URL");
  });

  it("formats a compact UTC timestamp", () => {
    expect(timestamp(() => new Date("2024-02-03T04:05:06.000Z"))).toBe("20240203040506");
  });

  it("uploads a file through mocked R2 client (no network)", async () => {
    const send = vi.fn(async () => ({}));
    const log = vi.fn();
    await uploadFile("/tmp/a.dump", "backups/products/a.dump", {
      createClient: (() => ({ send })) as never,
      resolveBucket: () => "test-bucket",
      readStream: (() => "BODY") as never,
      log,
    });
    expect(send).toHaveBeenCalledOnce();
    const cmd = send.mock.calls[0]?.[0] as { input?: { Bucket?: string; Key?: string } };
    expect(cmd?.input?.Bucket ?? (cmd as { Bucket?: string }).Bucket).toBeDefined();
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Uploaded s3://test-bucket/backups/products/a.dump"),
    );
  });

  it("skips backup when env URL missing", async () => {
    const warn = vi.fn();
    const result = await backupTarget("products", false, "pg_dump", {
      env: {},
      warn,
      log: vi.fn(),
    });
    expect(result).toBe("skipped");
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("missing PRODUCTS_DATABASE_URL"),
    );
  });

  it("runs pg_dump then uploads and deletes local when not keepLocal", async () => {
    const upload = vi.fn(async () => undefined);
    const unlink = vi.fn();
    const spawn = vi.fn(() => ({ status: 0, error: undefined }));
    const result = await backupTarget("admin", false, "pg_dump.exe", {
      env: { SUPABASE_AUTH_DATABASE_URL: "postgres://admin" },
      spawn: spawn as never,
      upload: upload as never,
      exists: (() => true) as never,
      mkdir: vi.fn() as never,
      unlink: unlink as never,
      resolvePath: ((...parts: string[]) => parts.join("/")) as never,
      cwd: () => "/repo",
      now: () => new Date("2024-01-01T00:00:00.000Z"),
      log: vi.fn(),
    });
    expect(result).toBe("uploaded");
    expect(spawn).toHaveBeenCalledWith(
      "pg_dump.exe",
      expect.arrayContaining(["-Fc", "postgres://admin"]),
      expect.any(Object),
    );
    expect(upload).toHaveBeenCalledOnce();
    expect(unlink).toHaveBeenCalledOnce();
  });

  it("uploads latest json backup folder via mocked client", async () => {
    const send = vi.fn(async () => ({}));
    const count = await uploadLatestJsonBackup({
      repoRoot: "/repo",
      exists: ((p: string) => p.includes("supabase")) as never,
      readdir: ((p: string) =>
        p.endsWith("supabase") ? ["run-1"] : ["tables.json"]) as never,
      stat: ((p: string) => ({
        mtimeMs: 100,
        isDirectory: () => p.endsWith("run-1"),
        isFile: () => p.endsWith("tables.json"),
      })) as never,
      resolvePath: ((...parts: string[]) => parts.join("/")) as never,
      createClient: (() => ({ send })) as never,
      resolveBucket: () => "bucket",
      readStream: (() => "stream") as never,
      log: vi.fn(),
    });
    expect(count).toBe(1);
    expect(send).toHaveBeenCalledOnce();
  });
});
