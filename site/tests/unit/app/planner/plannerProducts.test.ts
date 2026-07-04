import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPlannerCatalogProductsSafe } from "@/app/planner/plannerProducts";
import { getPlannerCatalogProducts } from "@/features/planner/catalog/plannerCatalog";

vi.mock("@/features/planner/catalog/plannerCatalog", () => ({
  getPlannerCatalogProducts: vi.fn(),
}));

describe("plannerProducts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should return catalog products when getPlannerCatalogProducts resolves quickly", async () => {
    const mockProducts = [{ id: "1", name: "Product 1" }];
    vi.mocked(getPlannerCatalogProducts).mockResolvedValueOnce(mockProducts as any);

    const result = await getPlannerCatalogProductsSafe();
    expect(result).toEqual(mockProducts);
  });

  it("should fallback and return empty array when getPlannerCatalogProducts throws an error", async () => {
    vi.mocked(getPlannerCatalogProducts).mockRejectedValueOnce(new Error("Database connection error"));

    const result = await getPlannerCatalogProductsSafe();
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("catalog preload fallback: Database connection error")
    );
  });

  it("should timeout if getPlannerCatalogProducts takes longer than 3000ms", async () => {
    let resolvePromise: any;
    const pendingPromise = new Promise<any>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(getPlannerCatalogProducts).mockReturnValueOnce(pendingPromise);

    const safePromise = getPlannerCatalogProductsSafe();
    
    // Advance timers by 3000ms to trigger the timeout race condition
    await vi.advanceTimersByTimeAsync(3000);
    
    const result = await safePromise;
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("catalog preload fallback: planner-catalog-timeout>3000ms")
    );
    
    // Cleanup pending promise
    resolvePromise([]);
  });
});
