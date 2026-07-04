import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/theme/active/route";
import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { getPresetById, getDefaultPreset } from "@/lib/theme/presets";

vi.mock("@/app/api/_lib/public", () => ({
  enforcePublicApiRateLimit: vi.fn(),
}));

vi.mock("@/lib/theme/presets", () => ({
  getPresetById: vi.fn(),
  getDefaultPreset: vi.fn(() => ({
    id: "default-preset",
    tokens: { "--bg": "var(--color-white-50)", "--block-seat": "ignored" },
  })),
}));

vi.mock("@/lib/theme/catalogTokenKeys", () => ({
  stripCatalogTokens: vi.fn((tokens) => {
    const stripped = { ...tokens };
    delete stripped["--block-seat"];
    return stripped;
  }),
}));

describe("Active Theme API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return rate error if rate limit is exceeded", async () => {
    const mockRateError = Response.json({ error: "Too many requests" }, { status: 429 });
    (enforcePublicApiRateLimit as any).mockResolvedValue(mockRateError);

    const req = new Request("http://localhost/api/theme/active");
    const res = await GET(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe("Too many requests");
  });

  it("should return active preset data successfully", async () => {
    (enforcePublicApiRateLimit as any).mockResolvedValue(null);
    (getPresetById as any).mockReturnValue({
      id: "premium-light",
      tokens: { "--primary": "var(--color-black)", "--block-seat": "ignored" },
    });

    const req = new Request("http://localhost/api/theme/active");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe("premium-light");
    expect(data.payload_jsonb).toEqual({ "--primary": "var(--color-black)" });
    expect(data.is_active).toBe(true);
    expect(getPresetById).toHaveBeenCalledWith("premium-light");
  });

  it("should fallback to default preset if ACTIVE_THEME_ID preset is not found", async () => {
    (enforcePublicApiRateLimit as any).mockResolvedValue(null);
    (getPresetById as any).mockReturnValue(null);

    const req = new Request("http://localhost/api/theme/active");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe("default-preset");
    expect(data.payload_jsonb).toEqual({ "--bg": "var(--color-white-50)" });
    expect(getDefaultPreset).toHaveBeenCalled();
  });
});
