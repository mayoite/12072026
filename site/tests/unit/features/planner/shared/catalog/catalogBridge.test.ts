import { describe, expect, it } from "vitest";
import { catalogToBuddyLibrary, catalogToOandoFurniture, filterCatalog } from "@/features/planner/shared/catalog/catalogBridge";

describe("catalogBridge", () => {
  it("should have function catalogToBuddyLibrary defined", () => {
    expect(catalogToBuddyLibrary).toBeTypeOf("function"); expect(String(catalogToBuddyLibrary)).toContain('function');
  });
  it("should have function catalogToOandoFurniture defined", () => {
    expect(catalogToOandoFurniture).toBeTypeOf("function"); expect(String(catalogToOandoFurniture)).toContain('function');
  });
  it("should have function filterCatalog defined", () => {
    expect(filterCatalog).toBeTypeOf("function"); expect(String(filterCatalog)).toContain('function');
  });
});