// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  EXPECTED_PLANNER_TABLES,
  EXPECTED_PRODUCTS_TABLES,
  EXPECTED_TABLES,
  checkDrizzleSchema,
} from "@/scripts/db_sync_drizzle_schema";

describe("db_sync_drizzle_schema (name-mirror)", () => {
  it("expects planner + products drizzle tables", () => {
    expect(EXPECTED_PLANNER_TABLES).toEqual([
      "oando_plans",
      "audit_events",
      "price_books",
      "price_book_versions",
    ]);
    expect(EXPECTED_PRODUCTS_TABLES).toContain("svg_revisions");
    expect(EXPECTED_TABLES).toEqual(EXPECTED_PLANNER_TABLES);
  });

  it("fails without SUPABASE_AUTH_DATABASE_URL", async () => {
    const result = await checkDrizzleSchema({
      env: {},
      error: vi.fn(),
      log: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/Planner\/Auth|Products/);
    }
  });

  it("passes when both targets present (mocked sql)", async () => {
    const end = vi.fn(async () => undefined);
    const sqlFactory = ((url: string) => {
      const isProducts = url.includes("products");
      return Object.assign(
        async () =>
          isProducts
            ? [
                { table_name: "block_descriptors" },
                { table_name: "catalog_products" },
                { table_name: "svg_revision_artifacts" },
                { table_name: "svg_revisions" },
              ]
            : [
                { table_name: "audit_events" },
                { table_name: "oando_plans" },
                { table_name: "price_book_versions" },
                { table_name: "price_books" },
              ],
        { end },
      );
    }) as never;

    const result = await checkDrizzleSchema({
      env: {
        SUPABASE_AUTH_DATABASE_URL: "postgres://planner",
        PRODUCTS_DATABASE_URL: "postgres://products",
      },
      sqlFactory,
      log: vi.fn(),
      error: vi.fn(),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.planner).toContain("price_books");
      expect(result.products).toContain("svg_revisions");
    }
    expect(end).toHaveBeenCalled();
  });

  it("reports missing tables", async () => {
    const end = vi.fn(async () => undefined);
    const sqlFactory = ((url: string) => {
      const isProducts = url.includes("products");
      return Object.assign(
        async () =>
          isProducts
            ? [
                { table_name: "block_descriptors" },
                { table_name: "catalog_products" },
                { table_name: "svg_revision_artifacts" },
                { table_name: "svg_revisions" },
              ]
            : [{ table_name: "oando_plans" }],
        { end },
      );
    }) as never;

    const result = await checkDrizzleSchema({
      env: {
        SUPABASE_AUTH_DATABASE_URL: "postgres://planner",
        PRODUCTS_DATABASE_URL: "postgres://products",
      },
      sqlFactory,
      log: vi.fn(),
      error: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toEqual(
        expect.arrayContaining(["audit_events", "price_books"]),
      );
      expect(result.exitCode).toBe(1);
    }
  });
});
