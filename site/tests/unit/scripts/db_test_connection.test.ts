// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { checkDatabaseConnection } from "@/scripts/db_test_connection";

describe("db_test_connection (name-mirror)", () => {
  it("fails when planner URL is missing", async () => {
    const result = await checkDatabaseConnection({
      resolveUrl: () => null,
      error: vi.fn(),
      log: vi.fn(),
      warn: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("Planner DB URL missing");
  });

  it("succeeds on mocked ping + table presence", async () => {
    const end = vi.fn(async () => undefined);
    let call = 0;
    const sql = Object.assign(
      async () => {
        call += 1;
        if (call === 1) return [{ connected: 1 }];
        if (call === 2)
          return [{ table_name: "audit_events" }, { table_name: "oando_plans" }];
        return [{ n: 3 }];
      },
      { end },
    );
    const log = vi.fn();
    const result = await checkDatabaseConnection({
      resolveUrl: () => "postgres://mock",
      sqlFactory: (() => sql) as never,
      env: {
        NEXT_ADMIN_SUPABASE_URL: "https://admin.example",
        SUPABASE_ADMIN_SERVICE_ROLE_KEY: "key",
      },
      log,
      error: vi.fn(),
      warn: vi.fn(),
    });
    expect(result).toEqual({
      ok: true,
      planCount: 3,
      tables: ["audit_events", "oando_plans"],
    });
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Admin Supabase HTTP env vars present"),
    );
    expect(end).toHaveBeenCalled();
  });

  it("fails when expected planner tables are missing", async () => {
    const end = vi.fn(async () => undefined);
    let call = 0;
    const sql = Object.assign(
      async () => {
        call += 1;
        if (call === 1) return [{ connected: 1 }];
        return [];
      },
      { end },
    );
    const result = await checkDatabaseConnection({
      resolveUrl: () => "postgres://mock",
      sqlFactory: (() => sql) as never,
      env: {},
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("Missing planner tables");
  });
});
