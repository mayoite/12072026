import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/csrf/route";
import { generateCsrfToken, setCsrfTokenCookie } from "@/lib/security/csrf";

vi.mock("@/lib/security/csrf", () => ({
  generateCsrfToken: vi.fn(() => "test-csrf-token"),
  setCsrfTokenCookie: vi.fn(),
}));

describe("app/api/csrf/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns generated token and sets cookie", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.token).toBe("test-csrf-token");
    expect(generateCsrfToken).toHaveBeenCalled();
    expect(setCsrfTokenCookie).toHaveBeenCalledWith("test-csrf-token");
  });
});
