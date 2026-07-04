import { describe, expect, it } from "vitest";
import {
  productToCatalogItem,
  catalogItemToProduct,
  canPlaceProduct,
  getProductAreaMm,
  getProductAreaSqM,
  filterProductsByCategory,
  filterVisibleProducts,
  sortProductsByName,
  getProductCategories,
  plannerManagedProductRowSchema,
  plannerManagedProductWriteSchema,
  PlannerManagedProductSchema,
} from "@/features/planner/model/plannerManagedProduct";

describe("plannerManagedProduct", () => {
  it("exposes PlannerManagedProductSchema", () => {
    expect(PlannerManagedProductSchema).toBeDefined();
  });
  it("should have function productToCatalogItem defined", () => {
    expect(productToCatalogItem).toBeTypeOf("function");
  });
  it("should have function catalogItemToProduct defined", () => {
    expect(catalogItemToProduct).toBeTypeOf("function");
  });
  it("should have function canPlaceProduct defined", () => {
    expect(canPlaceProduct).toBeTypeOf("function");
  });
  it("should have function getProductAreaMm defined", () => {
    expect(getProductAreaMm).toBeTypeOf("function");
  });
  it("should have function getProductAreaSqM defined", () => {
    expect(getProductAreaSqM).toBeTypeOf("function");
  });
  it("should have function filterProductsByCategory defined", () => {
    expect(filterProductsByCategory).toBeTypeOf("function");
  });
  it("should have function filterVisibleProducts defined", () => {
    expect(filterVisibleProducts).toBeTypeOf("function");
  });
  it("should have function sortProductsByName defined", () => {
    expect(sortProductsByName).toBeTypeOf("function");
  });
  it("should have function getProductCategories defined", () => {
    expect(getProductCategories).toBeTypeOf("function");
  });
  it("should have constant plannerManagedProductRowSchema defined", () => {
    expect(plannerManagedProductRowSchema).toBeDefined();
  });
  it("should have constant plannerManagedProductWriteSchema defined", () => {
    expect(plannerManagedProductWriteSchema).toBeDefined();
  });
});
