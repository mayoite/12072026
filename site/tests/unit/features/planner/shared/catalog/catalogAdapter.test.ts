import { describe, expect, it } from "vitest";
import { loadPlannerCatalog, normalizeCatalogItem, normalizeCatalogBatch, filterByCategory, searchCatalog } from "@/features/planner/shared/catalog/catalogAdapter";

describe("catalogAdapter", () => {
  it("should have function loadPlannerCatalog defined", () => {
    expect(loadPlannerCatalog).toBeTypeOf("function");
  });
  it("should have function normalizeCatalogItem defined", () => {
    expect(normalizeCatalogItem).toBeTypeOf("function");
  });
  it("should have function normalizeCatalogBatch defined", () => {
    expect(normalizeCatalogBatch).toBeTypeOf("function");
  });
  it("should have function filterByCategory defined", () => {
    expect(filterByCategory).toBeTypeOf("function");
  });
  it("should have function searchCatalog defined", () => {
    expect(searchCatalog).toBeTypeOf("function");
  });
});