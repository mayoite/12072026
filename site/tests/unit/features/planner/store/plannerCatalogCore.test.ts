import { describe, expect, it } from "vitest";
import { normalizePlannerCatalogProduct, normalizePlannerCatalogProducts, mergePlannerCatalogProducts, buildPlannerCatalogIndex, resolvePlannerCatalogProductByReference, resolvePlannerCatalogProductById, resolvePlannerCatalogProductBySlug } from "@/features/planner/store/plannerCatalogCore";

describe("plannerCatalogCore", () => {
  it("should have function normalizePlannerCatalogProduct defined", () => {
    expect(normalizePlannerCatalogProduct).toBeTypeOf("function");
  });
  it("should have function normalizePlannerCatalogProducts defined", () => {
    expect(normalizePlannerCatalogProducts).toBeTypeOf("function");
  });
  it("should have function mergePlannerCatalogProducts defined", () => {
    expect(mergePlannerCatalogProducts).toBeTypeOf("function");
  });
  it("should have function buildPlannerCatalogIndex defined", () => {
    expect(buildPlannerCatalogIndex).toBeTypeOf("function");
  });
  it("should have function resolvePlannerCatalogProductByReference defined", () => {
    expect(resolvePlannerCatalogProductByReference).toBeTypeOf("function");
  });
  it("should have function resolvePlannerCatalogProductById defined", () => {
    expect(resolvePlannerCatalogProductById).toBeTypeOf("function");
  });
  it("should have function resolvePlannerCatalogProductBySlug defined", () => {
    expect(resolvePlannerCatalogProductBySlug).toBeTypeOf("function");
  });
});