import { describe, expect, it } from "vitest";
import { normalizePlannerManagedProductRow, plannerManagedProductRowToCatalogProduct } from "@/features/planner/cloud-store/plannerManagedProductsShared";

describe("plannerManagedProductsShared", () => {
  it("should have function normalizePlannerManagedProductRow defined", () => {
    expect(normalizePlannerManagedProductRow).toBeTypeOf("function"); expect(String(normalizePlannerManagedProductRow)).toContain('function');
  });
  it("should have function plannerManagedProductRowToCatalogProduct defined", () => {
    expect(plannerManagedProductRowToCatalogProduct).toBeTypeOf("function"); expect(String(plannerManagedProductRowToCatalogProduct)).toContain('function');
  });
});