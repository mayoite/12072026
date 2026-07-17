// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const selectMock = vi.fn();

vi.mock("server-only", () => ({}));

vi.mock("@/platform/drizzle/productsDb", () => ({
  productsDb: {
    select: (...args: unknown[]) => selectMock(...args),
  },
}));

vi.mock("@/platform/drizzle/schema/catalog", () => ({
  svgRevisionArtifacts: {
    checksum: "checksum",
    storageKey: "storageKey",
    revisionId: "revisionId",
    kind: "kind",
  },
  plannerManagedProducts: {
    publishedSvgRevisionId: "publishedSvgRevisionId",
    active: "active",
  },
}));

vi.mock("drizzle-orm", () => ({
  and: (...args: unknown[]) => ({ and: args }),
  eq: (a: unknown, b: unknown) => ({ eq: [a, b] }),
}));

describe("publishedSvgArtifact.server (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function chain(rows: unknown[]) {
    const limit = vi.fn(async () => rows);
    const where = vi.fn(() => ({ limit }));
    const innerJoin = vi.fn(() => ({ where }));
    const from = vi.fn(() => ({ innerJoin }));
    selectMock.mockReturnValue({ from });
    return { from, innerJoin, where, limit };
  }

  it("returns the single active published SVG artifact for a revision", async () => {
    const rows = [
      {
        checksum: "a".repeat(64),
        storageKey: "svg-revisions/desk-r1.svg",
      },
    ];
    chain(rows);

    const { loadCurrentPublishedSvgArtifact } = await import(
      "@/features/planner/catalog-api/publishedSvgArtifact.server"
    );
    await expect(loadCurrentPublishedSvgArtifact("desk-r1")).resolves.toEqual(rows[0]);
  });

  it("returns null when no active planner product points at the revision", async () => {
    chain([]);
    const { loadCurrentPublishedSvgArtifact } = await import(
      "@/features/planner/catalog-api/publishedSvgArtifact.server"
    );
    await expect(loadCurrentPublishedSvgArtifact("missing-r1")).resolves.toBeNull();
  });

  it("throws on duplicate published artifacts (fail closed)", async () => {
    chain([
      { checksum: "a".repeat(64), storageKey: "k1" },
      { checksum: "b".repeat(64), storageKey: "k2" },
    ]);
    const { loadCurrentPublishedSvgArtifact } = await import(
      "@/features/planner/catalog-api/publishedSvgArtifact.server"
    );
    await expect(loadCurrentPublishedSvgArtifact("dup-r1")).rejects.toThrow(
      /Duplicate published SVG artifacts/,
    );
  });
});
