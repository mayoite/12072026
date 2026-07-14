// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type SqlFn = ((...args: unknown[]) => Promise<unknown[]>) & {
  unsafe: (query: string) => Promise<unknown[]>;
  end: (opts?: { timeout?: number }) => Promise<void>;
};

const unsafe = vi.fn(async (_query: string) => [] as unknown[]);
const end = vi.fn(async () => undefined);
const sqlFn = Object.assign(
  vi.fn(async () => [] as unknown[]),
  { unsafe, end },
) as SqlFn;
const postgres = vi.fn(() => sqlFn);
const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

vi.mock("postgres", () => ({
  default: (...args: unknown[]) => postgres(...args),
}));

describe("db_advisors (name-mirror)", () => {
  const prevUrl = process.env.PRODUCTS_DATABASE_URL;
  const prevSupabase = process.env.SUPABASE_DB_URL;
  const prevArgv = process.argv.slice();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.PRODUCTS_DATABASE_URL = "postgres://user:pass@localhost:5432/products";
    delete process.env.SUPABASE_DB_URL;
    process.argv = [process.argv[0], "db_advisors.ts"];
    unsafe.mockResolvedValue([]);
    end.mockResolvedValue(undefined);
    postgres.mockReturnValue(sqlFn);
  });

  afterEach(() => {
    if (typeof prevUrl === "string") process.env.PRODUCTS_DATABASE_URL = prevUrl;
    else delete process.env.PRODUCTS_DATABASE_URL;
    if (typeof prevSupabase === "string") process.env.SUPABASE_DB_URL = prevSupabase;
    else delete process.env.SUPABASE_DB_URL;
    process.argv = prevArgv;
  });

  it("runs advisor queries against mocked postgres and reports clean", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    await import("../../../scripts/db_advisors.ts");
    await vi.waitFor(() => {
      expect(end).toHaveBeenCalled();
    });
    expect(postgres).toHaveBeenCalledWith(
      "postgres://user:pass@localhost:5432/products",
      expect.objectContaining({ prepare: false, max: 1 }),
    );
    expect(unsafe.mock.calls.length).toBeGreaterThan(0);
    expect(log.mock.calls.flat().join("\n")).toMatch(/No issues detected|Supabase Advisors/);
    log.mockRestore();
  });

  it("exits when database URL is blank after trim", async () => {
    // loadEnvLocal uses override:false — pre-set blankish values to block file fill-in
    process.env.PRODUCTS_DATABASE_URL = "   ";
    process.env.SUPABASE_DB_URL = "   ";
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await import("../../../scripts/db_advisors.ts");
    await vi.waitFor(() => {
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
    expect(err.mock.calls.flat().join("\n")).toContain("Missing PRODUCTS_DATABASE_URL");
    err.mockRestore();
  });
});
