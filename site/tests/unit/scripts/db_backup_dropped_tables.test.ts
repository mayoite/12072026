// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type SqlFn = {
  unsafe: (query: string) => Promise<Record<string, unknown>[]>;
  end: (opts?: { timeout?: number }) => Promise<void>;
};

const unsafe = vi.fn(async (query: string) => {
  if (query.includes("auth_user")) {
    return [{ id: 1, email: "a@b.c" }];
  }
  return [] as Record<string, unknown>[];
});
const end = vi.fn(async () => undefined);
const postgres = vi.fn(() => ({ unsafe, end }) as SqlFn);
const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

vi.mock("dotenv", () => ({
  config: vi.fn(),
}));

vi.mock("postgres", () => ({
  default: (...args: unknown[]) => postgres(...args),
}));

describe("db_backup_dropped_tables (name-mirror)", () => {
  const prevCwd = process.cwd();
  const prevUrl = process.env.PRODUCTS_DATABASE_URL;
  let tmp: string;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "db-backup-dropped-"));
    process.chdir(tmp);
    process.env.PRODUCTS_DATABASE_URL = "postgres://user:pass@localhost:5432/products";
    unsafe.mockImplementation(async (query: string) => {
      if (query.includes("auth_user")) {
        return [{ id: 1, email: "a@b.c" }];
      }
      return [];
    });
    end.mockResolvedValue(undefined);
    postgres.mockReturnValue({ unsafe, end });
  });

  afterEach(() => {
    process.chdir(prevCwd);
    if (typeof prevUrl === "string") process.env.PRODUCTS_DATABASE_URL = prevUrl;
    else delete process.env.PRODUCTS_DATABASE_URL;
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("writes SQL inserts for mocked table rows under backups/", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await import("../../../scripts/db_backup_dropped_tables.ts");
    await vi.waitFor(() => {
      expect(end).toHaveBeenCalled();
    });
    expect(postgres).toHaveBeenCalled();
    expect(unsafe.mock.calls.length).toBeGreaterThan(0);
    const backups = fs.readdirSync(path.join(tmp, "backups"));
    expect(backups.some((name) => name.startsWith("pre-cleanup-") && name.endsWith(".sql"))).toBe(
      true,
    );
    const sql = fs.readFileSync(path.join(tmp, "backups", backups[0]), "utf8");
    expect(sql).toContain("INSERT INTO public.\"auth_user\"");
    expect(sql).toContain("a@b.c");
    expect(log.mock.calls.flat().join("\n")).toContain("Backup written:");
    log.mockRestore();
  });

  it("exits when PRODUCTS_DATABASE_URL is blank after trim", async () => {
    process.env.PRODUCTS_DATABASE_URL = "   ";
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await import("../../../scripts/db_backup_dropped_tables.ts");
    await vi.waitFor(() => {
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });
});
