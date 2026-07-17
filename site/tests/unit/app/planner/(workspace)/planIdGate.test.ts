import { describe, it, expect } from "vitest";
import { parsePlanIdSearchParam } from "@/app/planner/(workspace)/planIdGate";
import { TEST_PLAN_ID_1 } from "@/tests/fixtures/plannerTestUuids";

describe("parsePlanIdSearchParam", () => {
  it("accepts missing id as undefined plan", () => {
    expect(parsePlanIdSearchParam(undefined)).toEqual({
      ok: true,
      planId: undefined,
    });
  });

  it("accepts a valid UUID and lowercases it", () => {
    const upper = TEST_PLAN_ID_1.toUpperCase();
    expect(parsePlanIdSearchParam(upper)).toEqual({
      ok: true,
      planId: TEST_PLAN_ID_1.toLowerCase(),
    });
  });

  it("trims surrounding whitespace before validating", () => {
    expect(parsePlanIdSearchParam(`  ${TEST_PLAN_ID_1}  `)).toEqual({
      ok: true,
      planId: TEST_PLAN_ID_1.toLowerCase(),
    });
  });

  it("rejects empty, whitespace-only, arrays, and non-UUIDs", () => {
    expect(parsePlanIdSearchParam("")).toEqual({ ok: false });
    expect(parsePlanIdSearchParam("   ")).toEqual({ ok: false });
    expect(parsePlanIdSearchParam([TEST_PLAN_ID_1, TEST_PLAN_ID_1])).toEqual({
      ok: false,
    });
    expect(parsePlanIdSearchParam("not-a-uuid")).toEqual({ ok: false });
    expect(parsePlanIdSearchParam("a".repeat(256))).toEqual({ ok: false });
    expect(
      parsePlanIdSearchParam(`{${TEST_PLAN_ID_1}}`),
    ).toEqual({ ok: false });
    expect(
      parsePlanIdSearchParam(`urn:uuid:${TEST_PLAN_ID_1}`),
    ).toEqual({ ok: false });
  });
});
