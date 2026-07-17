import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRecommendations } from "@/lib/hooks/useRecommendations";
import { useQuery } from "@tanstack/react-query";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("useRecommendations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should configure useQuery with correct queryKey and enabled parameters", () => {
    vi.mocked(useQuery).mockReturnValue({} as never);

    renderHook(() => useRecommendations(true));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["recommendations", true],
        enabled: true,
      }),
    );
  });

  it("posts with credentials and no client-invented userId", async () => {
    vi.mocked(useQuery).mockImplementation((options: { queryFn?: () => Promise<unknown> }) => {
      return {
        queryFn: options.queryFn,
      } as never;
    });

    const globalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mode: "personalized", recommendations: [] }),
    });
    global.fetch = fetchMock;

    const { result } = renderHook(() => useRecommendations(true));
    const queryFn = (result.current as { queryFn: () => Promise<{ mode: string }> }).queryFn;

    const data = await queryFn();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/recommendations",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ limit: 4 }),
      }),
    );
    expect(data.mode).toBe("personalized");

    global.fetch = globalFetch;
  });

  it("should throw error if fetch response is not ok", async () => {
    vi.mocked(useQuery).mockImplementation((options: { queryFn?: () => Promise<unknown> }) => {
      return { queryFn: options.queryFn } as never;
    });

    const globalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
    });
    global.fetch = fetchMock;

    const { result } = renderHook(() => useRecommendations(true));
    const queryFn = (result.current as { queryFn: () => Promise<unknown> }).queryFn;

    await expect(queryFn()).rejects.toThrow("Failed to fetch recommendations");

    global.fetch = globalFetch;
  });
});
