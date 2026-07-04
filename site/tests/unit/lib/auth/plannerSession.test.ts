import { describe, it, expect, vi, beforeEach } from "vitest";
import { requirePlannerUser } from "@/lib/auth/plannerSession";
import { getOptionalUser } from "@/lib/auth/session";
import { hasPublicSupabaseEnv } from "@/platform/supabase/env";
import { cookies } from "next/headers";
import { PLANNER_GUEST_COOKIE } from "@/lib/auth/constants";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/headers", () => {
  const mockCookies = {
    has: vi.fn(() => false),
  };
  return {
    cookies: vi.fn(() => Promise.resolve(mockCookies)),
  };
});

vi.mock("@/lib/auth/session", () => ({
  getOptionalUser: vi.fn(),
}));

vi.mock("@/lib/auth/plannerRedirect", () => ({
  buildAccessRedirect: vi.fn(() => "/redirect-url"),
}));

vi.mock("@/platform/supabase/env", () => ({
  hasPublicSupabaseEnv: vi.fn(() => true),
}));

describe("plannerSession requirePlannerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns guest user if guest cookie is present and path is guest-allowed", async () => {
    const mockStore = {
      has: vi.fn((name) => name === PLANNER_GUEST_COOKIE),
    };
    vi.mocked(cookies).mockResolvedValueOnce(mockStore as any);

    const user = await requirePlannerUser("/planner/guest");
    expect(user).toEqual({
      id: "guest",
      email: "guest@example.com",
      name: "Guest User",
    });
  });

  it("returns ANONYMOUS_USER if supabase env is missing", async () => {
    vi.mocked(hasPublicSupabaseEnv).mockReturnValueOnce(false);
    const user = await requirePlannerUser("/dashboard");
    expect(user.id).toBe("anonymous");
  });

  it("returns user if session is valid", async () => {
    const mockUser = { id: "user-123", email: "user@test.com" };
    vi.mocked(getOptionalUser).mockResolvedValueOnce(mockUser as any);

    const user = await requirePlannerUser("/dashboard");
    expect(user).toEqual(mockUser);
  });
});
