import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRecommendations } from "@/lib/hooks/useRecommendations";
import { useQuery } from "@tanstack/react-query";
import { createAnonymousUserId } from "@/lib/tracking/anonymousUserId";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/lib/tracking/anonymousUserId", () => ({
  createAnonymousUserId: vi.fn(() => "new-user-123"),
  normalizeAnonymousUserId: vi.fn((id) => id || ""),
}));

describe("useRecommendations", () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      clear: () => { store = {}; },
    };
  })();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  it("should configure useQuery with correct queryKey and enabled parameters", () => {
    vi.mocked(useQuery).mockReturnValue({} as any);

    renderHook(() => useRecommendations(true));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["recommendations", true],
        enabled: true,
      })
    );
  });

  it("should fetch recommendations using user ID from localStorage", async () => {
    localStorageMock.setItem("oando_user_id", "existing-user-abc");
    vi.mocked(useQuery).mockImplementation((options: any) => {
      // Simulate calling the queryFn
      return {
        queryFn: options.queryFn,
      } as any;
    });

    const globalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mode: "personalized", recommendations: [] }),
    });
    global.fetch = fetchMock;

    const { result } = renderHook(() => useRecommendations(true));
    const queryFn = (result.current as any).queryFn;

    const data = await queryFn();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/recommendations",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ userId: "existing-user-abc", limit: 4 }),
      })
    );
    expect(data.mode).toBe("personalized");

    global.fetch = globalFetch;
  });

  it("should generate a new user ID if none exists in localStorage", async () => {
    vi.mocked(useQuery).mockImplementation((options: any) => {
      return { queryFn: options.queryFn } as any;
    });

    const globalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ mode: "popular", recommendations: [] }),
    });
    global.fetch = fetchMock;

    const { result } = renderHook(() => useRecommendations(true));
    const queryFn = (result.current as any).queryFn;

    await queryFn();

    expect(createAnonymousUserId).toHaveBeenCalled();
    expect(localStorageMock.getItem("oando_user_id")).toBe("new-user-123");

    global.fetch = globalFetch;
  });

  it("should throw error if fetch response is not ok", async () => {
    vi.mocked(useQuery).mockImplementation((options: any) => {
      return { queryFn: options.queryFn } as any;
    });

    const globalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
    });
    global.fetch = fetchMock;

    const { result } = renderHook(() => useRecommendations(true));
    const queryFn = (result.current as any).queryFn;

    await expect(queryFn()).rejects.toThrow("Failed to fetch recommendations");

    global.fetch = globalFetch;
  });
});
