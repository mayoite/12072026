import { describe, expect, it } from "vitest";
import { normalizePlannerManagedProductRow, plannerManagedProductRowToCatalogProduct } from "@/features/planner/store/plannerManagedProductsShared";

describe("plannerManagedProductsShared", () => {
  it("should have function normalizePlannerManagedProductRow defined", () => {
    expect(normalizePlannerManagedProductRow).toBeTypeOf("function");
  });
  it("should have function plannerManagedProductRowToCatalogProduct defined", () => {
    expect(plannerManagedProductRowToCatalogProduct).toBeTypeOf("function");
  });
});