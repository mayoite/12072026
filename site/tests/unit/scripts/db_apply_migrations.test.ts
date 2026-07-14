// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type SqlFn = ((strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>) & {
  unsafe: (body: string) => Promise<void>;
  end: (opts?: { timeout?: number }) => Promise<void>;
};

const unsafe = vi.fn(async (_body: string) => undefined);
const end = vi.fn(async () => undefined);
const sqlFn = Object.assign(
  async (strings: TemplateStringsArray, ...values: unknown[]) => {
    void values;
    const text = strings.join("?");
    if (text.includes("_local_migration_history") && text.includes("select")) {
      return [] as Array<{ filename: string }>;
    }
    return undefined;
  },
  { unsafe, end },
) as SqlFn;
const postgres = vi.fn(() => sqlFn);
const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

vi.mock("postgres", () => ({
  default: (...args: unknown[]) => postgres(...args),
}));

describe("db_apply_migrations (name-mirror)", () => {
  const prevCwd = process.cwd();
  const prevUrl = process.env.PRODUCTS_DATABASE_URL;
  const prevArgv = process.argv.slice();
  let tmp: string;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "db-apply-"));
    const migDir = path.join(tmp, "platform", "supabase", "migrations");
    fs.mkdirSync(migDir, { recursive: true });
    fs.writeFileSync(
      path.join(migDir, "20260601_test.sql"),
      "create table if not exists public.t (id int);\n",
      "utf8",
    );
    process.chdir(tmp);
    process.env.PRODUCTS_DATABASE_URL = "postgres://user:pass@localhost:5432/products";
    process.argv = [process.argv[0], "db_apply_migrations.ts", "--dry"];
    unsafe.mockResolvedValue(undefined);
    end.mockResolvedValue(undefined);
    postgres.mockReturnValue(sqlFn);
  });

  afterEach(() => {
    process.chdir(prevCwd);
    if (typeof prevUrl === "string") process.env.PRODUCTS_DATABASE_URL = prevUrl;
    else delete process.env.PRODUCTS_DATABASE_URL;
    process.argv = prevArgv;
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("plans pending migrations without applying when --dry", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await import("../../../scripts/db_apply_migrations.ts");
    await vi.waitFor(() => {
      expect(end).toHaveBeenCalled();
    });
    expect(postgres).toHaveBeenCalled();
    expect(unsafe).not.toHaveBeenCalled();
    expect(log.mock.calls.flat().join("\n")).toContain("20260601_test.sql");
    log.mockRestore();
  });

  it("exits when connection URL is blank after trim", async () => {
    process.env.PRODUCTS_DATABASE_URL = "   ";
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await import("../../../scripts/db_apply_migrations.ts");
    await vi.waitFor(() => {
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
    expect(err.mock.calls.flat().join("\n")).toContain("Missing connection URL");
    err.mockRestore();
  });
});
