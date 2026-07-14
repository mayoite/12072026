import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePlannerCatalogHydration } from "@/features/planner/catalog-api/usePlannerCatalogHydration";
import { usePlannerCatalogStore } from "@/features/planner/catalog-api/catalogStore";

vi.mock("@/features/planner/catalog-api/catalogStore", () => ({
  usePlannerCatalogStore: vi.fn(),
}));

describe("usePlannerCatalogHydration", () => {
  const mockHydrate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getMockStore = (overrides = {}) => ({
    hydrateCatalog: mockHydrate,
    catalogSource: "api",
    managedCount: 5,
    catalogHydrating: false,
    ...overrides,
  });

  it("calls hydrateCatalog on mount when enabled", () => {
    vi.mocked(usePlannerCatalogStore).mockImplementation((selector: any) =>
      selector(getMockStore())
    );

    renderHook(() => usePlannerCatalogHydration());

    expect(mockHydrate).toHaveBeenCalled();
  });

  it("does not call hydrateCatalog on mount when disabled", () => {
    vi.mocked(usePlannerCatalogStore).mockImplementation((selector: any) =>
      selector(getMockStore())
    );

    renderHook(() => usePlannerCatalogHydration({ enabled: false }));

    expect(mockHydrate).not.toHaveBeenCalled();
  });
});
