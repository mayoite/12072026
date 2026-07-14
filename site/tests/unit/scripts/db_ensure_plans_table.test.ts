// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import { ensurePlansTable } from "@/scripts/db_ensure_plans_table";

function mockSql(result: { exists: boolean } | Error) {
  const end = vi.fn(async () => undefined);
  const sql = Object.assign(
    async () => {
      if (result instanceof Error) throw result;
      return [result];
    },
    { end },
  );
  return { sql, end };
}

describe("db_ensure_plans_table (name-mirror)", () => {
  it("fails when planner URL is missing", async () => {
    const error = vi.fn();
    const result = await ensurePlansTable({
      resolveUrl: () => null,
      error,
      log: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.exitCode).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("Planner DB URL missing"));
  });

  it("reports present when oando_plans exists", async () => {
    const { sql, end } = mockSql({ exists: true });
    const log = vi.fn();
    const result = await ensurePlansTable({
      resolveUrl: () => "postgres://mock",
      sqlFactory: (() => sql) as never,
      log,
      error: vi.fn(),
    });
    expect(result).toEqual({ ok: true, message: "✅ oando_plans table present." });
    expect(end).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("✅ oando_plans table present.");
  });

  it("fails when oando_plans is missing", async () => {
    const { sql } = mockSql({ exists: false });
    const result = await ensurePlansTable({
      resolveUrl: () => "postgres://mock",
      sqlFactory: (() => sql) as never,
      log: vi.fn(),
      error: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("oando_plans missing");
      expect(result.exitCode).toBe(1);
    }
  });

  it("surfaces query errors without real network", async () => {
    const { sql } = mockSql(new Error("ECONNREFUSED"));
    const result = await ensurePlansTable({
      resolveUrl: () => "postgres://mock",
      sqlFactory: (() => sql) as never,
      log: vi.fn(),
      error: vi.fn(),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("ECONNREFUSED");
  });
});
