// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { EXPECTED_TABLES, checkDrizzleSchema } from "@/scripts/db_sync_drizzle_schema";

describe("db_sync_drizzle_schema (name-mirror)", () => {
  it("expects planner drizzle tables", () => {
    expect(EXPECTED_TABLES).toEqual(["oando_plans", "audit_events"]);
  });

  it("fails without SUPABASE_AUTH_DATABASE_URL", async () => {
    const result = await checkDrizzleSchema({
      env: {},
      error: vi.fn(),
      log: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("SUPABASE_AUTH_DATABASE_URL");
  });

  it("passes when both expected tables are present (mocked sql)", async () => {
    const end = vi.fn(async () => undefined);
    const sql = Object.assign(
      async () => [{ table_name: "audit_events" }, { table_name: "oando_plans" }],
      { end },
    );
    const result = await checkDrizzleSchema({
      env: { SUPABASE_AUTH_DATABASE_URL: "postgres://mock" },
      sqlFactory: (() => sql) as never,
      log: vi.fn(),
      error: vi.fn(),
    });
    expect(result).toEqual({
      ok: true,
      present: ["audit_events", "oando_plans"],
    });
    expect(end).toHaveBeenCalled();
  });

  it("reports missing tables", async () => {
    const end = vi.fn(async () => undefined);
    const sql = Object.assign(async () => [{ table_name: "oando_plans" }], { end });
    const result = await checkDrizzleSchema({
      env: { SUPABASE_AUTH_DATABASE_URL: "postgres://mock" },
      sqlFactory: (() => sql) as never,
      log: vi.fn(),
      error: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missing).toEqual(["audit_events"]);
      expect(result.exitCode).toBe(1);
    }
  });
});
