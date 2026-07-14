// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const advisorsMain = vi.fn(async () => undefined);

vi.mock("../../../scripts/db_advisors.ts", () => {
  advisorsMain();
  return {};
});

describe("db_advisors_admin (name-mirror)", () => {
  const prevProducts = process.env.PRODUCTS_DATABASE_URL;
  const prevAuth = process.env.SUPABASE_AUTH_DATABASE_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.SUPABASE_AUTH_DATABASE_URL = "postgres://admin@localhost:5432/admin";
    // pre-set so loadEnvLocal will not overwrite (override: false)
    process.env.PRODUCTS_DATABASE_URL = "postgres://products@localhost:5432/products";
  });

  afterEach(() => {
    if (typeof prevProducts === "string") process.env.PRODUCTS_DATABASE_URL = prevProducts;
    else delete process.env.PRODUCTS_DATABASE_URL;
    if (typeof prevAuth === "string") process.env.SUPABASE_AUTH_DATABASE_URL = prevAuth;
    else delete process.env.SUPABASE_AUTH_DATABASE_URL;
  });

  it("rewires products URL to the admin DB then loads advisors", async () => {
    await import("../../../scripts/db_advisors_admin.ts");
    expect(process.env.PRODUCTS_DATABASE_URL).toBe(
      "postgres://admin@localhost:5432/admin",
    );
    await vi.waitFor(() => {
      expect(advisorsMain).toHaveBeenCalled();
    });
  });
});
