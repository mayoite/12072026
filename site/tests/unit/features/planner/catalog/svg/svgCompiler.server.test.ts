import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/svg/svgCompiler.server";

describe("catalog/svg/svgCompiler.server.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["compileAuthority","SVG_COMPILER_VERSION","SvgCompileError","compileSvgBlockV1"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
