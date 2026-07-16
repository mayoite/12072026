// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const spawnSync = vi.fn(() => ({ status: 0, error: undefined }));
const resolvePgDumpExecutable = vi.fn(() => "pg_dump");
const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

vi.mock("node:child_process", () => ({
  spawnSync: (...args: unknown[]) => spawnSync(...args),
}));

vi.mock("../../../scripts/lib/resolvePgDump.ts", () => ({
  resolvePgDumpExecutable: () => resolvePgDumpExecutable(),
}));

vi.mock("../../../scripts/lib/resolvePgDump", () => ({
  resolvePgDumpExecutable: () => resolvePgDumpExecutable(),
}));

describe("db_backup_pg_dump (name-mirror)", () => {
  const prevCwd = process.cwd();
  const prevUrl = process.env.PRODUCTS_DATABASE_URL;
  const prevArgv = process.argv.slice();
  let tmp: string;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "db-pg-dump-"));
    process.chdir(tmp);
    process.env.PRODUCTS_DATABASE_URL = "postgres://user:pass@localhost:5432/products";
    process.argv = [process.argv[0], "db_backup_pg_dump.ts", "--target", "products"];
    spawnSync.mockReturnValue({ status: 0, error: undefined });
    resolvePgDumpExecutable.mockReturnValue("pg_dump");
  });

  afterEach(() => {
    process.chdir(prevCwd);
    if (typeof prevUrl === "string") process.env.PRODUCTS_DATABASE_URL = prevUrl;
    else delete process.env.PRODUCTS_DATABASE_URL;
    process.argv = prevArgv;
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("invokes mocked pg_dump for the products target", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await import("../../../scripts/db_backup_pg_dump.ts");
    expect(resolvePgDumpExecutable).toHaveBeenCalled();
    expect(spawnSync).toHaveBeenCalled();
    const [bin, args] = spawnSync.mock.calls[0] as [string, string[], { shell?: boolean }];
    expect(bin).toBe("pg_dump");
    expect(args[0]).toBe("-Fc");
    expect(args[1]).toBe("-f");
    expect(String(args[2])).toMatch(/pgdump-products-.*\.dump$/);
    expect(args[3]).toBe("postgres://user:pass@localhost:5432/products");
    expect(fs.existsSync(path.join(tmp, "backups"))).toBe(true);
    expect(log.mock.calls.flat().join("\n")).toMatch(/OK:|Backing up products/);
    log.mockRestore();
  });

  it("exits on unknown target", async () => {
    process.argv = [process.argv[0], "db_backup_pg_dump.ts", "--target", "nope"];
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await import("../../../scripts/db_backup_pg_dump.ts");
    await vi.waitFor(() => {
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
    expect(err.mock.calls.flat().join("\n")).toContain("Unknown --target");
    err.mockRestore();
  });
});
