import { describe, expect, it } from "vitest";
import { sha256Hex } from "@/features/planner/project/catalog/svg/sha256";
import { createHash } from "node:crypto";

describe("sha256Hex", () => {
  it("matches node crypto for empty and sample strings", () => {
    const samples = ["", "abc", "descriptor-payload-v1"];
    for (const s of samples) {
      const expected = createHash("sha256").update(s, "utf8").digest("hex");
      expect(sha256Hex(s)).toBe(expected);
    }
  });

  it("returns 64 hex chars", () => {
    expect(sha256Hex("x")).toMatch(/^[0-9a-f]{64}$/);
  });
});
