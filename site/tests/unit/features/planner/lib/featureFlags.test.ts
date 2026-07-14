import { describe, expect, it, vi } from "vitest";
import { getFeatureFlags, setFeatureFlags, resetFeatureFlags, isFeatureEnabled, getFlagsInGroup, isAnyFlagInGroupEnabled, areAllFlagsInGroupEnabled, fetchFeatureFlagsFromSupabase, updateFeatureFlagInSupabase, updateMultipleFeatureFlagsInSupabase, getAllFlagNames, getFlagMetadata, getAllFlagsGrouped, DEFAULT_FLAGS, FLAG_GROUPS } from "@/features/planner/lib/featureFlags";

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

describe("featureFlags", () => {
  it("exposes DEFAULT_FLAGS", () => {
    expect(DEFAULT_FLAGS).toBeTypeOf("object");
    expect(Object.keys(DEFAULT_FLAGS).length).toBeGreaterThan(0);
  });
  it("exposes FLAG_GROUPS", () => {
    expect(FLAG_GROUPS).toBeTypeOf("object");
    expect(Object.keys(FLAG_GROUPS).length).toBeGreaterThan(0);
  });
  it("should have function getFeatureFlags defined", () => {
    expect(getFeatureFlags).toBeTypeOf("function");
  });
  it("should have function setFeatureFlags defined", () => {
    expect(setFeatureFlags).toBeTypeOf("function");
  });
  it("should have function resetFeatureFlags defined", () => {
    expect(resetFeatureFlags).toBeTypeOf("function");
  });
  it("should have function isFeatureEnabled defined", () => {
    expect(isFeatureEnabled).toBeTypeOf("function");
  });
  it("should have function getFlagsInGroup defined", () => {
    expect(getFlagsInGroup).toBeTypeOf("function");
  });
  it("should have function isAnyFlagInGroupEnabled defined", () => {
    expect(isAnyFlagInGroupEnabled).toBeTypeOf("function");
  });
  it("should have function areAllFlagsInGroupEnabled defined", () => {
    expect(areAllFlagsInGroupEnabled).toBeTypeOf("function");
  });
  it("should have function fetchFeatureFlagsFromSupabase defined", () => {
    expect(fetchFeatureFlagsFromSupabase).toBeTypeOf("function");
  });
  it("should have function updateFeatureFlagInSupabase defined", () => {
    expect(updateFeatureFlagInSupabase).toBeTypeOf("function");
  });
  it("should have function updateMultipleFeatureFlagsInSupabase defined", () => {
    expect(updateMultipleFeatureFlagsInSupabase).toBeTypeOf("function");
  });
  it("should have function getAllFlagNames defined", () => {
    expect(getAllFlagNames).toBeTypeOf("function");
  });
  it("should have function getFlagMetadata defined", () => {
    expect(getFlagMetadata).toBeTypeOf("function");
  });
  it("should have function getAllFlagsGrouped defined", () => {
    expect(getAllFlagsGrouped).toBeTypeOf("function");
  });
});