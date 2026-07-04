import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  estimateRoomMm,
  buildShellOnlyLayout,
  suggestLayoutGridPack,
  suggestLayout,
} from "@/features/planner/ai/spaceSuggest";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  browserApiFetch: vi.fn(),
}));

vi.mock("@/features/planner/ai/aiStatus", () => ({
  classifyAIResponse: vi.fn().mockReturnValue("success"),
  validateLayoutSchema: vi.fn().mockReturnValue(true),
}));

describe("spaceSuggest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("estimateRoomMm", () => {
    it("returns estimated room width and depth", () => {
      const room = estimateRoomMm(10, 500);
      expect(room.widthMm).toBeGreaterThan(0);
      expect(room.depthMm).toBeGreaterThan(0);
    });
  });

  describe("buildShellOnlyLayout", () => {
    it("builds a layout shell correctly", () => {
      const metadata = {
        projectName: "Test Project",
        floorAreaSqFt: 1000,
        seatCount: 15,
      };

      const shell = buildShellOnlyLayout(metadata as any);
      expect(shell.version).toBe(1);
      expect(shell.source).toBe("grid-pack");
      expect(shell.room.label).toBe("Test Project");
      expect(shell.walls.length).toBe(4);
    });
  });

  describe("suggestLayoutGridPack", () => {
    it("packs seat counts into workspace layout", () => {
      const layout = suggestLayoutGridPack({
        seatCount: 10,
        purpose: "workstations",
        floorAreaSqFt: 500,
      });

      expect(layout.version).toBe(1);
      expect(layout.source).toBe("grid-pack");
      expect(layout.room.widthMm).toBeGreaterThan(0);
      expect(layout.furniture.length).toBeGreaterThan(0);
    });
  });

  describe("suggestLayout", () => {
    it("successfully fetches layout from API and returns it", async () => {
      vi.mocked(browserApiFetch).mockResolvedValue({
        ok: true,
        json: async () => ({
          layout: {
            version: 1,
            room: { label: "AI Room", x: 0, y: 0, widthMm: 2000, depthMm: 2000 },
            walls: [],
            zones: [],
            furniture: [],
          },
          provider: "openai",
        }),
      } as any);

      const result = await suggestLayout({
        seatCount: 10,
        purpose: "workstations",
      });

      expect(result.usedFallback).toBe(false);
      expect(result.layout.room.label).toBe("AI Room");
      expect(browserApiFetch).toHaveBeenCalledTimes(1);
    });

    it("falls back to grid pack on API error", async () => {
      vi.mocked(browserApiFetch).mockRejectedValue(new Error("API Failure"));

      const result = await suggestLayout({
        seatCount: 10,
        purpose: "workstations",
      });

      expect(result.usedFallback).toBe(true);
      expect(result.layout.source).toBe("grid-pack");
    });
  });
});
