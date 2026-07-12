import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/admin/themes/route";
import { createAdminServiceClient } from "@/platform/supabase/adminServer";

vi.mock("@/platform/supabase/adminServer", () => ({
  createAdminServiceClient: vi.fn(),
  isMissingTableError: vi.fn((message: string) => message.includes("does not exist")),
}));

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: () => Promise<Response>) => handler,
}));

describe("app/api/admin/themes/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty themes when admin client is unavailable", async () => {
    vi.mocked(createAdminServiceClient).mockReturnValue(null);
    const res = await GET({} as never);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.themes).toEqual([]);
    expect(body.source).toBe("none");
  });

  it("returns themes from block_themes table", async () => {
    const from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [{ id: "t1", name: "premium-light", is_active: true }],
          error: null,
        }),
      }),
    });
    vi.mocked(createAdminServiceClient).mockReturnValue({ from } as never);

    const res = await GET({} as never);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.themes).toHaveLength(1);
    expect(body.themes[0].name).toBe("premium-light");
  });
});