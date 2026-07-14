import { describe, expect, it, vi } from "vitest";
import { listPlannerManagedProductsFromSupabase, upsertPlannerManagedProduct, deletePlannerManagedProduct } from "@/features/planner/cloud-store/plannerManagedProducts.client";

vi.mock("@/platform/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

describe("plannerManagedProducts.client", () => {
  it("should have function listPlannerManagedProductsFromSupabase defined", () => {
    expect(listPlannerManagedProductsFromSupabase).toBeTypeOf("function"); expect(String(listPlannerManagedProductsFromSupabase)).toContain('function');
  });
  it("should have function upsertPlannerManagedProduct defined", () => {
    expect(upsertPlannerManagedProduct).toBeTypeOf("function"); expect(String(upsertPlannerManagedProduct)).toContain('function');
  });
  it("should have function deletePlannerManagedProduct defined", () => {
    expect(deletePlannerManagedProduct).toBeTypeOf("function"); expect(String(deletePlannerManagedProduct)).toContain('function');
  });
});