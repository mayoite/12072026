import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/svg/svgSymbols";

describe("catalog/svg/svgSymbols.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["registerSymbolGenerator","resolveSymbolGenerator","generateSymbol","renderSvgSymbol","getCachedSvgSymbol","getSvgSymbolDimensionAgreement","clearSvgCache"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
