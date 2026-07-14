import { describe, it, expect, vi, beforeEach } from "vitest";
import { createServerClient } from "@/platform/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseEnv } from "@/platform/supabase/env";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("next/headers", () => {
  const mockGetAll = vi.fn();
  const mockSet = vi.fn();
  return {
    cookies: vi.fn(async () => ({
      getAll: mockGetAll,
      set: mockSet,
    })),
  };
});

vi.mock("@/platform/supabase/env", () => ({
  getPublicSupabaseEnv: vi.fn(() => ({
    url: "https://mock-server.supabase.co",
    anonKey: "mock-anon-key",
  })),
}));

describe("supabase server client creator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a server client and configure cookie operations", async () => {
    const mockCookieStore = await cookies();
    vi.mocked(mockCookieStore.getAll).mockReturnValue([{ name: "session", value: "xyz" }] as any);

    await createServerClient();

    expect(getPublicSupabaseEnv).toHaveBeenCalled();
    expect(createSSRClient).toHaveBeenCalledWith(
      "https://mock-server.supabase.co",
      "mock-anon-key",
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    );

    // Test cookies config callbacks
    const configCall = vi.mocked(createSSRClient).mock.calls[0];
    const cookiesConfig = configCall[2].cookies;

    // test getAll
    const getResult = cookiesConfig.getAll();
    expect(getResult).toEqual([{ name: "session", value: "xyz" }]);

    // test setAll
    cookiesConfig.setAll([{ name: "new-cookie", value: "val", options: { path: "/" } }]);
    expect(mockCookieStore.set).toHaveBeenCalledWith("new-cookie", "val", { path: "/" });
  });

  it("should safely ignore errors if cookieStore.set throws in server component context", async () => {
    const mockCookieStore = await cookies();
    vi.mocked(mockCookieStore.set).mockImplementation(() => {
      throw new Error("Cannot set headers");
    });

    await createServerClient();

    const configCall = vi.mocked(createSSRClient).mock.calls[0];
    const cookiesConfig = configCall[2].cookies;

    expect(() => {
      cookiesConfig.setAll([{ name: "new-cookie", value: "val" }]);
    }).not.toThrow();
  });
});
