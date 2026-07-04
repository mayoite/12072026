import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAiAdvisor } from "@/lib/ai/useAiAdvisor";

describe("useAiAdvisor", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends message and updates state on success", async () => {
    const mockResponse = { response: "Hello there!" };
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as any);

    const { result } = renderHook(() => useAiAdvisor());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);

    let promise: any;
    act(() => {
      promise = result.current.sendMessage("Hi");
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.messages[0].content).toBe("Hi");
    expect(result.current.messages[0].role).toBe("user");

    await act(async () => {
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.messages.length).toBe(2);
    expect(result.current.messages[1].content).toBe("Hello there!");
    expect(result.current.messages[1].role).toBe("assistant");
    expect(result.current.error).toBeNull();
  });

  it("handles error response correctly", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Failed to connect" }),
    } as any);

    const { result } = renderHook(() => useAiAdvisor());

    await act(async () => {
      await result.current.sendMessage("Hi");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Failed to connect");
  });
});
