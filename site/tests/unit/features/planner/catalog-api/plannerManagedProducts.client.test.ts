import { describe, it, expect, vi } from "vitest";
import {
  listPlannerManagedProductsFromSupabase,
  upsertPlannerManagedProduct,
  _deletePlannerManagedProduct,
} from "@/features/planner/catalog-api/plannerManagedProducts.client";

vi.mock("@/features/planner/model", () => ({
  plannerManagedProductWriteSchema: {
    parse: vi.fn().mockImplementation((val) => val),
  },
}));

vi.mock("@/features/planner/catalog-api/plannerManagedProductsShared", () => ({
  normalizePlannerManagedProductRow: vi.fn().mockImplementation((row) => row),
}));

describe("plannerManagedProducts client supabase operations", () => {
  const mockFrom = vi.fn();
  const mockClient = {
    from: mockFrom,
  } as any;

  it("lists planner managed products successfully", async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockResolvedValue({
      data: [{ id: "prod-1", active: true }],
      error: null,
    });
    mockFrom.mockReturnValue({
      select: mockSelect,
      order: mockOrder,
    });

    const products = await listPlannerManagedProductsFromSupabase(mockClient);
    expect(products.length).toBe(1);
    expect(mockFrom).toHaveBeenCalledWith("planner_managed_products");
  });

  it("throws error when list fails", async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "DB Error" },
    });
    mockFrom.mockReturnValue({
      select: mockSelect,
      order: mockOrder,
    });

    await expect(listPlannerManagedProductsFromSupabase(mockClient)).rejects.toThrow("DB Error");
  });

  it("upserts product successfully", async () => {
    const mockUpsert = vi.fn().mockReturnThis();
    const mockSelect = vi.fn().mockReturnThis();
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: "new-prod", active: true },
      error: null,
    });
    mockFrom.mockReturnValue({
      upsert: mockUpsert,
      select: mockSelect,
      single: mockSingle,
    });

    const result = await upsertPlannerManagedProduct(mockClient, { name: "New Prod" } as any);
    expect(result.id).toBe("new-prod");
  });
});
