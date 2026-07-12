import { afterEach, describe, expect, it, vi } from "vitest";
import { version as uuidVersion } from "uuid";
import {
  isEntityUuid,
  isPlannerEntityUuidV7,
  newEntityId,
  PLANNER_ENTITY_UUID_VERSION,
} from "@/features/planner/lib/newEntityId";

describe("newEntityId — UUID v7 mint policy", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mints UUID v7 accepted by isEntityUuid and isPlannerEntityUuidV7", () => {
    const id = newEntityId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(isEntityUuid(id)).toBe(true);
    expect(uuidVersion(id)).toBe(PLANNER_ENTITY_UUID_VERSION);
    expect(isPlannerEntityUuidV7(id)).toBe(true);
  });

  it("returns unique ids across successive calls", () => {
    const a = newEntityId();
    const b = newEntityId();
    const c = newEntityId();
    expect(new Set([a, b, c]).size).toBe(3);
  });

  it("does not emit legacy plc- / timestamp-style prefixes", () => {
    const id = newEntityId();
    expect(id.startsWith("plc-")).toBe(false);
    expect(id).not.toMatch(/^\d{10,}-/);
    expect(id.includes("_")).toBe(false);
  });

  it("throws when crypto.getRandomValues is unavailable (uuid v7 entropy)", () => {
    // Policy mints via `uuid` v7 (getRandomValues), not crypto.randomUUID.
    vi.stubGlobal("crypto", {});
    expect(() => newEntityId()).toThrow(/getRandomValues/i);
  });

  it("throws when crypto itself is missing", () => {
    vi.stubGlobal("crypto", undefined);
    expect(() => newEntityId()).toThrow();
  });
});

describe("isEntityUuid — read policy (legacy v4 + current v7)", () => {
  it("accepts canonical lowercase and uppercase UUID v4 shapes", () => {
    expect(isEntityUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isEntityUuid("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
    // version nibble 1–8 allowed by RFC UUID validate
    expect(isEntityUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isEntityUuid("123e4567-e89b-82d3-a456-426614174000")).toBe(true);
  });

  it("accepts v4 on read but not as planner mint (v7)", () => {
    const v4 = "f81e3a1b-16f4-4c2a-9e6b-8e1f3b7e1a44";
    expect(isEntityUuid(v4)).toBe(true);
    expect(isPlannerEntityUuidV7(v4)).toBe(false);
  });

  it("rejects empty, whitespace, and non-hyphenated forms", () => {
    expect(isEntityUuid("")).toBe(false);
    expect(isEntityUuid("   ")).toBe(false);
    expect(isEntityUuid("550e8400e29b41d4a716446655440000")).toBe(false);
    expect(isEntityUuid("550e8400_e29b_41d4_a716_446655440000")).toBe(false);
  });

  it("rejects legacy planner prefixes and partial ids", () => {
    expect(isEntityUuid("plc-550e8400-e29b-41d4-a716-446655440000")).toBe(
      false,
    );
    expect(isEntityUuid("furniture-uuid-1")).toBe(false);
    expect(isEntityUuid("mock-uuid")).toBe(false);
    expect(isEntityUuid("550e8400-e29b-41d4-a716")).toBe(false);
  });

  it("rejects wrong variant nibble (must be 8|9|a|b)", () => {
    // variant nibble 'c' is invalid for RFC 4122
    expect(isEntityUuid("550e8400-e29b-41d4-c716-446655440000")).toBe(false);
    expect(isEntityUuid("550e8400-e29b-41d4-0716-446655440000")).toBe(false);
  });

  it("rejects version nibble outside 1–8", () => {
    expect(isEntityUuid("550e8400-e29b-01d4-a716-446655440000")).toBe(false);
    expect(isEntityUuid("550e8400-e29b-91d4-a716-446655440000")).toBe(false);
  });

  it("rejects surrounding junk / extra characters", () => {
    expect(isEntityUuid(" 550e8400-e29b-41d4-a716-446655440000")).toBe(false);
    expect(isEntityUuid("550e8400-e29b-41d4-a716-446655440000 ")).toBe(false);
    expect(isEntityUuid("id:550e8400-e29b-41d4-a716-446655440000")).toBe(
      false,
    );
  });
});
