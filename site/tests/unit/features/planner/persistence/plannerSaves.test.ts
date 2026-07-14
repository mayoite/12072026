import { describe, expect, it, vi } from "vitest";
import { savePlannerDocumentToSupabase, loadPlannerDocumentFromSupabase, listPlannerDocumentsFromSupabase, deletePlannerDocumentFromSupabase } from "@/features/planner/persistence/plannerSaves";

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

describe("plannerSaves", () => {
  it("should have function savePlannerDocumentToSupabase defined", () => {
    expect(savePlannerDocumentToSupabase).toBeTypeOf("function"); expect(String(savePlannerDocumentToSupabase)).toContain('function');
  });
  it("should have function loadPlannerDocumentFromSupabase defined", () => {
    expect(loadPlannerDocumentFromSupabase).toBeTypeOf("function"); expect(String(loadPlannerDocumentFromSupabase)).toContain('function');
  });
  it("should have function listPlannerDocumentsFromSupabase defined", () => {
    expect(listPlannerDocumentsFromSupabase).toBeTypeOf("function"); expect(String(listPlannerDocumentsFromSupabase)).toContain('function');
  });
  it("should have function deletePlannerDocumentFromSupabase defined", () => {
    expect(deletePlannerDocumentFromSupabase).toBeTypeOf("function"); expect(String(deletePlannerDocumentFromSupabase)).toContain('function');
  });
});