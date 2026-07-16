import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/admin/themes/route";
import { createAdminServiceClient } from "@/platform/supabase/adminServer";
import { PLANNER_THEME_PACKS } from "@/lib/theme/plannerThemePacks";

vi.mock("@/platform/supabase/adminServer", () => ({
  createAdminServiceClient: vi.fn(),
  isMissingTableError: vi.fn((message: string) =>
    message.includes("does not exist"),
  ),
}));

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (handler: () => Promise<Response>) => handler,
}));

describe("app/api/admin/themes/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns starter packs when admin client is unavailable", async () => {
    vi.mocked(createAdminServiceClient).mockReturnValue(null);
    const res = await GET({} as never);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.source).toBe("starter");
    expect(body.themes.length).toBe(PLANNER_THEME_PACKS.length);
    expect(body.themes[0].name).toBe("premium-light");
    expect(body.themes[0].tokens).toBeTruthy();
    expect(body.themes[0].tokenCount).toBeGreaterThan(0);
  });

  it("returns starter packs when block_themes is empty", async () => {
    const from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    });
    vi.mocked(createAdminServiceClient).mockReturnValue({ from } as never);

    const res = await GET({} as never);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.source).toBe("starter");
    expect(body.themes.length).toBe(PLANNER_THEME_PACKS.length);
  });

  it("returns themes from block_themes table with tokens", async () => {
    const from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [
            {
              id: "t1",
              name: "premium-light",
              is_active: true,
              tokens: { "block-wood-ash-base": "var(--color-ecru-300)" },
            },
          ],
          error: null,
        }),
      }),
    });
    vi.mocked(createAdminServiceClient).mockReturnValue({ from } as never);

    const res = await GET({} as never);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.source).toBe("block_themes");
    expect(body.themes).toHaveLength(1);
    expect(body.themes[0].name).toBe("premium-light");
    expect(body.themes[0].tokens["block-wood-ash-base"]).toBe(
      "var(--color-ecru-300)",
    );
    expect(body.themes[0].tokenCount).toBe(1);
  });

  it("returns starter packs when table is missing", async () => {
    const from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'relation "block_themes" does not exist' },
        }),
      }),
    });
    vi.mocked(createAdminServiceClient).mockReturnValue({ from } as never);

    const res = await GET({} as never);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.source).toBe("starter");
    expect(body.themes.length).toBe(PLANNER_THEME_PACKS.length);
  });
});
