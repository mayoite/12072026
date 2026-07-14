import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/shared/index";

describe("project/shared/index.ts barrel", () => {
  it("exports callable or object values", () => {
    const keys = Object.keys(mod).filter((k) => k !== "default");
    expect(keys.length).toBeGreaterThan(0);
    const sample = keys.slice(0, 5).map((k) => typeof (mod as Record<string, unknown>)[k]);
    expect(sample.every((t) => t !== "undefined")).toBe(true);
  });
});
