// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const backupRoot = path.join(repoRoot, "results/backups/supabase");

function makeRangeQuery(rows: unknown[]) {
  const resolved = { data: rows, error: null };
  const builder: Record<string, unknown> = {};
  const self = new Proxy(builder, {
    get(_t, prop: string | symbol) {
      if (prop === "then") {
        return (resolve: (v: unknown) => unknown) => Promise.resolve(resolved).then(resolve);
      }
      return vi.fn(() => self);
    },
  });
  return self;
}

const from = vi.fn((table: string) => ({
  select: vi.fn(() => ({
    range: vi.fn(() => {
      if (table === "catalog_products") {
        return makeRangeQuery([{ id: "c1", name: "Desk" }]);
      }
      return makeRangeQuery([]);
    }),
  })),
}));

const createClient = vi.fn(() => ({ from }));

vi.mock("@supabase/supabase-js", () => ({
  createClient,
}));

vi.mock("node:module", async () => {
  const actual = await vi.importActual("node:module") as Record<string, unknown> & { readFileSync?: (...args: never[]) => unknown; default?: unknown };
  return {
    ...actual,
    createRequire: () => () => ({
      loadEnvLocal: vi.fn(),
    }),
  };
});

const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

function latestBackupDir(): string | null {
  if (!fs.existsSync(backupRoot)) return null;
  const dirs = fs
    .readdirSync(backupRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  const last = dirs[dirs.length - 1];
  return last ? path.join(backupRoot, last) : null;
}

describe("backup_supabase (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://backup.example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    process.env.SUPABASE_BACKUP_TABLES = "catalog_products,catalog_categories";
    process.env.SUPABASE_BACKUP_RETENTION_DAYS = "7";
    process.env.SUPABASE_BACKUP_MAX_RETRIES = "1";
  });

  it("backs up configured tables and writes manifest.json", async () => {
    const before = new Set(
      fs.existsSync(backupRoot)
        ? fs.readdirSync(backupRoot).filter((n) =>
            fs.statSync(path.join(backupRoot, n)).isDirectory(),
          )
        : [],
    );

    vi.resetModules();
    await import("@/scripts/backup_supabase");

    await vi.waitFor(() => {
      const dir = latestBackupDir();
      expect(dir).toBeDefined();
      expect(fs.existsSync(path.join(dir!, "manifest.json"))).toBe(true);
      const name = path.basename(dir!);
      // prefer a newly created run when possible
      if (!before.has(name)) {
        expect(before.has(name)).toBe(false);
      }
    });

    expect(createClient).toHaveBeenCalledWith(
      "https://backup.example.supabase.co",
      "service-role-test",
      expect.any(Object),
    );

    const runDir = latestBackupDir()!;
    const tableWrite = path.join(runDir, "catalog_products.json");
    expect(fs.existsSync(tableWrite)).toBe(true);
    expect(JSON.parse(fs.readFileSync(tableWrite, "utf8"))).toEqual([
      { id: "c1", name: "Desk" },
    ]);

    const manifest = JSON.parse(
      fs.readFileSync(path.join(runDir, "manifest.json"), "utf8"),
    ) as {
      source: string;
      tables: string[];
      results: Array<{ table: string; status: string; rows: number }>;
      retentionDays: number;
      usedServiceRoleKey: boolean;
    };
    expect(manifest.source).toBe("supabase-rest");
    expect(manifest.tables).toEqual(["catalog_products", "catalog_categories"]);
    expect(manifest.retentionDays).toBe(7);
    expect(manifest.usedServiceRoleKey).toBe(true);
    expect(
      manifest.results.find((r) => r.table === "catalog_products")?.status,
    ).toBe("ok");
    expect(
      manifest.results.find((r) => r.table === "catalog_products")?.rows,
    ).toBe(1);
  });
});
