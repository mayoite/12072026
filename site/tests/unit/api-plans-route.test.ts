import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/plans/route";

describe("api/plans route", () => {
  it("should be importable", () => {
    expect(typeof GET).toBe("function");
  });
});
