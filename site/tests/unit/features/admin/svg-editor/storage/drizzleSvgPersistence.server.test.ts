import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/drizzle/productsDb", () => ({
  productsDb: {
    insert: vi.fn(() => ({
      values: vi.fn(async () => undefined),
    })),
  },
}));

vi.mock("@/platform/drizzle/schema/catalog", () => ({
  svgRevisions: {},
  svgRevisionArtifacts: {},
  blockDescriptors: {},
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  sql: vi.fn(),
}));

describe("DrizzleSvgRevisionPersistence", () => {
  it("exports a class implementing insertRevision", async () => {
    const mod = await import(
      "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server"
    );
    expect(typeof mod.DrizzleSvgRevisionPersistence).toBe("function");
    const instance = new mod.DrizzleSvgRevisionPersistence();
    expect(typeof instance.insertRevision).toBe("function");
    expect(typeof instance.insertArtifacts).toBe("function");
    expect(typeof instance.loadRevision).toBe("function");
  });
});
