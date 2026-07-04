import { describe, expect, it } from "vitest";
import { getUnifiedCatalog, getCatalogCategories, getCatalogSeries, searchCatalog, getCatalogItemBySlug, mergeDatabaseProducts } from "@/features/planner/store/unifiedCatalog";

describe("unifiedCatalog", () => {
  it("should have function getUnifiedCatalog defined", () => {
    expect(getUnifiedCatalog).toBeTypeOf("function");
  });
  it("should have function getCatalogCategories defined", () => {
    expect(getCatalogCategories).toBeTypeOf("function");
  });
  it("should have function getCatalogSeries defined", () => {
    expect(getCatalogSeries).toBeTypeOf("function");
  });
  it("should have function searchCatalog defined", () => {
    expect(searchCatalog).toBeTypeOf("function");
  });
  it("should have function getCatalogItemBySlug defined", () => {
    expect(getCatalogItemBySlug).toBeTypeOf("function");
  });
  it("should have function mergeDatabaseProducts defined", () => {
    expect(mergeDatabaseProducts).toBeTypeOf("function");
  });
});