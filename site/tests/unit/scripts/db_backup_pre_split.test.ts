// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  ADMIN_TABLES_TO_BACKUP,
  PRODUCTS_TABLES_TO_BACKUP,
  dumpTables,
  quoteIdent,
  quoteValue,
} from "@/scripts/db_backup_pre_split";

describe("db_backup_pre_split (name-mirror)", () => {
  it("quotes SQL identifiers and values", () => {
    expect(quoteIdent('a"b')).toBe('"a""b"');
    expect(quoteValue(null)).toBe("NULL");
    expect(quoteValue(12)).toBe("12");
    expect(quoteValue(true)).toBe("true");
    expect(quoteValue("O'Hara")).toBe("'O''Hara'");
    expect(quoteValue({ a: 1 })).toContain("::jsonb");
    expect(quoteValue(new Date("2024-01-01T00:00:00.000Z"))).toBe(
      "'2024-01-01T00:00:00.000Z'",
    );
  });

  it("lists non-empty product and admin backup table sets", () => {
    expect(PRODUCTS_TABLES_TO_BACKUP).toContain("plans");
    expect(PRODUCTS_TABLES_TO_BACKUP.length).toBeGreaterThan(5);
    expect(ADMIN_TABLES_TO_BACKUP).toContain("catalog_products");
    expect(ADMIN_TABLES_TO_BACKUP).toContain("auth_user");
  });

  it("dumps rows via mocked sql factory and writes a sql file", async () => {
    const rows = [{ id: 1, name: "alpha" }];
    const end = vi.fn(async () => undefined);
    const unsafe = vi.fn(async () => rows);
    const sqlFactory = vi.fn(() => ({ unsafe, end }));
    const writeFile = vi.fn();
    const mkdir = vi.fn();
    const exists = vi.fn(() => false);
    const log = vi.fn();
    const fixed = new Date("2024-06-01T12:34:56.000Z");

    const out = await dumpTables("postgres://mock/db", "products", ["plans"], {
      sqlFactory: sqlFactory as never,
      writeFile: writeFile as never,
      mkdir: mkdir as never,
      exists: exists as never,
      now: () => fixed,
      log,
    });

    expect(sqlFactory).toHaveBeenCalledWith("postgres://mock/db", {
      prepare: false,
      max: 1,
    });
    expect(unsafe).toHaveBeenCalled();
    expect(out).toBe("backups/pre-split-products-20240601123456.sql");
    expect(writeFile).toHaveBeenCalledOnce();
    const written = writeFile.mock.calls[0]?.[1] as string;
    expect(written).toContain("INSERT INTO public.\"plans\"");
    expect(written).toContain("'alpha'");
    expect(end).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("Wrote backups/"));
  });

  it("records per-table errors without throwing", async () => {
    const end = vi.fn(async () => undefined);
    const unsafe = vi.fn(async () => {
      throw new Error("relation missing");
    });
    const writeFile = vi.fn();
    await dumpTables("postgres://mock/db", "admin", ["ghost"], {
      sqlFactory: (() => ({ unsafe, end })) as never,
      writeFile: writeFile as never,
      exists: (() => true) as never,
      now: () => new Date("2024-01-01T00:00:00.000Z"),
      log: vi.fn(),
    });
    const written = writeFile.mock.calls[0]?.[1] as string;
    expect(written).toContain("ERROR relation missing");
  });
});
