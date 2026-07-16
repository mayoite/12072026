// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn(async () => ({}));
const logs: string[] = [];

vi.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: class PutObjectCommand {
    input: Record<string, unknown>;
    constructor(input: Record<string, unknown>) {
      this.input = input;
    }
  },
}));

vi.mock("drizzle-orm", () => ({
  asc: (col: unknown) => col,
}));

vi.mock("@/platform/drizzle/createPostgresDrizzle", () => ({
  createPostgresDrizzle: vi.fn(() => ({
    select: () => ({
      from: () => ({
        orderBy: async () => [
          {
            id: "11111111-1111-1111-1111-111111111111",
            name: "Desk",
            slug: "desk",
            category_id: "workstations",
            model_3d: null,
          },
        ],
      }),
    }),
  })),
}));

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  resolveProductsDatabaseUrl: vi.fn(() => "postgres://test-db"),
}));

vi.mock("@/platform/drizzle/schema/catalog", () => ({
  catalogProducts: { name: "name" },
}));

vi.mock("@/lib/catalog/adapters", () => ({
  normalizeProducts: vi.fn((rows: unknown[]) => rows),
}));

vi.mock("@/lib/catalog/catalogSnapshotConstants", () => ({
  CATALOG_SNAPSHOT_R2_KEY: "catalog/snapshot/latest.json",
}));

vi.mock("@/lib/uuid/normalizeUuid", () => ({
  normalizeUuid: vi.fn((id: string) => id),
}));

vi.mock("@/lib/storage/r2Catalog", () => ({
  contentTypeForKey: vi.fn(() => "application/json"),
  createR2CatalogClient: vi.fn(() => ({ send })),
  resolveCatalogBucketName: vi.fn(() => "test-catalog-bucket"),
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
const logSpy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
  logs.push(args.map(String).join(" "));
});

describe("catalog_snapshot_upload_r2 (name-mirror)", () => {
  beforeEach(() => {
    logs.length = 0;
    send.mockClear();
    vi.clearAllMocks();
    exitSpy.mockClear();
    logSpy.mockClear();
  });

  it("exports catalog_products and uploads latest + dated R2 snapshots", async () => {
    vi.resetModules();
    await import("@/scripts/catalog_snapshot_upload_r2");

    await vi.waitFor(() => {
      expect(send).toHaveBeenCalled();
    });

    expect(send).toHaveBeenCalledTimes(2);
    const keys = send.mock.calls.map((call) => {
      const cmd = call[0] as { input: { Key: string; Bucket: string; Body: string } };
      return cmd.input;
    });
    expect(keys.every((k) => k.Bucket === "test-catalog-bucket")).toBe(true);
    expect(keys.some((k) => k.Key === "catalog/snapshot/latest.json")).toBe(true);
    expect(keys.some((k) => k.Key.startsWith("backups/catalog/catalog-"))).toBe(true);

    const latest = keys.find((k) => k.Key === "catalog/snapshot/latest.json");
    const payload = JSON.parse(String(latest?.Body)) as {
      version: number;
      products: unknown[];
      categoryIds: string[];
    };
    expect(payload.version).toBe(1);
    expect(payload.products).toHaveLength(1);
    expect(payload.categoryIds).toContain("workstations");

    expect(logs.some((line) => line.includes("catalog_products rows=1"))).toBe(true);
    expect(logs.some((line) => line.includes("Uploaded s3://test-catalog-bucket/"))).toBe(
      true,
    );
  });
});
