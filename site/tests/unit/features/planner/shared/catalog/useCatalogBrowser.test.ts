import { describe, expect, it } from "vitest";
import { useCatalogBrowser } from "@/features/planner/shared/catalog/useCatalogBrowser";

describe("useCatalogBrowser", () => {
  it("should have function useCatalogBrowser defined", () => {
    expect(useCatalogBrowser).toBeTypeOf("function"); expect(String(useCatalogBrowser)).toContain('function');
  });
  it("should have hook useCatalogBrowser defined", () => {
    expect(useCatalogBrowser).toBeTypeOf("function"); expect(String(useCatalogBrowser)).toContain('function');
  });
});
