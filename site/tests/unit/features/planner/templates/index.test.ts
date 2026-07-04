import { describe, expect, it } from "vitest";
import * as Module from "@/features/planner/templates/index";

describe("index", () => {
  it("should import successfully", () => {
    expect(Module).toBeDefined();
  });
});