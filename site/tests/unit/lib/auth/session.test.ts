import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOptionalUser, requireAuthUser } from "@/lib/auth/session";
import { createServerClient } from "@/platform/supabase/server";
import { hasPublicSupabaseEnv } from "@/platform/supabase/env";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/platform/supabase/server", () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  };
  return {
    createServerClient: vi.fn(() => Promise.resolve(mockSupabase)),
  };
});

vi.mock("@/platform/supabase/env", () => ({
  hasPublicSupabaseEnv: vi.fn(() => true),
}));

vi.mock("@/lib/auth/plannerRedirect", () => ({
  buildAccessRedirect: vi.fn(() => "/redirect-url"),
}));

describe("session auth helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null if hasPublicSupabaseEnv is false", async () => {
    vi.mocked(hasPublicSupabaseEnv).mockReturnValueOnce(false);
    const user = await getOptionalUser();
    expect(user).toBeNull();
  });

  it("returns user details when user is authenticated", async () => {
    const supabase = await createServerClient();
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: {
        user: {
          id: "123",
          email: "user@example.com",
          user_metadata: { name: "John Doe" },
          app_metadata: { role: "admin" },
        },
      },
    } as any);

    const user = await getOptionalUser();
    expect(user).toEqual({
      id: "123",
      email: "user@example.com",
      name: "John Doe",
      avatarUrl: undefined,
      role: "owner",
    });
  });

  it("rethrows Next dynamic server usage during static probing", async () => {
    const dynamicError = Object.assign(
      new Error("Dynamic server usage: Route /access couldn't be rendered statically"),
      { digest: "DYNAMIC_SERVER_USAGE" },
    );
    vi.mocked(createServerClient).mockRejectedValueOnce(dynamicError);

    await expect(getOptionalUser()).rejects.toBe(dynamicError);
  });

  it("returns null for auth client failures", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(createServerClient).mockRejectedValueOnce(new Error("invalid session"));

    await expect(getOptionalUser()).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalledWith("getOptionalUser error:", expect.any(Error));
    consoleError.mockRestore();
  });

  it("redirects when requireAuthUser is called without user", async () => {
    const supabase = await createServerClient();
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({ data: { user: null } } as any);

    await requireAuthUser("/dashboard");
    expect(redirect).toHaveBeenCalledWith("/redirect-url");
  });
});
