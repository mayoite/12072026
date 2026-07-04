import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveProviderChain } from "@/lib/ai/providerChain";
import {
  getSketchRecoveryMessage,
  classifySketchConversionError,
  buildSketchPlanFabricDraft,
  requestSketchToPlan,
  SketchConversionError,
} from "@/features/planner/ai/sketchToPlan";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api/schemas", () => ({
  SketchToPlanResponseSchema: {
    parse: (val: unknown) => val,
  },
}));

vi.mock("@/lib/ai/providerChain", () => ({
  resolveProviderChain: vi.fn(),
}));

vi.mock("openai", () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
  },
}));

describe("sketchToPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSketchRecoveryMessage", () => {
    it("returns correct messages for error reasons", () => {
      expect(getSketchRecoveryMessage("missing_provider")).toContain("AI conversion is unavailable");
      expect(getSketchRecoveryMessage("timeout")).toContain("Conversion did not finish");
    });
  });

  describe("classifySketchConversionError", () => {
    it("keeps existing SketchConversionError", () => {
      const err = new SketchConversionError("timeout", "file.png", "Custom timeout message");
      const classified = classifySketchConversionError(err, "file.png");
      expect(classified).toBe(err);
    });

    it("classifies general Error to correct recovery error", () => {
      const err1 = new Error("timeout during connection");
      const classified1 = classifySketchConversionError(err1, "file.png");
      expect(classified1.reason).toBe("timeout");

      const err2 = new Error("unknown provider credentials issue");
      const classified2 = classifySketchConversionError(err2, "file.png");
      expect(classified2.reason).toBe("missing_provider");
    });
  });

  describe("buildSketchPlanFabricDraft", () => {
    it("converts walls and rooms into fabric JSON", () => {
      const mockResponse = {
        objects: [
          { type: "wall" as const, x1: 0, y1: 0, x2: 100, y2: 100 },
          { type: "room" as const, left: 10, top: 10, width: 80, height: 80, label: "Office" },
        ],
        warnings: [],
      };

      const draftJson = buildSketchPlanFabricDraft(mockResponse);
      const draft = JSON.parse(draftJson);

      expect(draft.objects.length).toBe(2);
      expect(draft.objects[0].type).toBe("line");
      expect(draft.objects[1].type).toBe("rect");
      expect(draft.objects[1].name).toBe("ROOM:Office");
    });
  });

  describe("requestSketchToPlan", () => {
    it("throws missing_provider error if no providers available", async () => {
      vi.mocked(resolveProviderChain).mockReturnValue([]);

      await expect(
        requestSketchToPlan({
          imageDataUrl: "data:image/png;base64,...",
          fileName: "sketch.png",
          prompt: "Convert to layout",
          includeRooms: true,
        })
      ).rejects.toThrow("AI conversion is unavailable");
    });

    it("calls OpenAI client and parses correct response", async () => {
      vi.mocked(resolveProviderChain).mockReturnValue([
        { apiKey: "key", baseURL: "url", model: "gpt-4", defaultHeaders: {} },
      ]);

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                objects: [{ type: "wall", x1: 0, y1: 0, x2: 100, y2: 0 }],
                warnings: [],
              }),
            },
          },
        ],
      });

      const result = await requestSketchToPlan({
        imageDataUrl: "data:image/png;base64,...",
        fileName: "sketch.png",
        prompt: "Convert to layout",
        includeRooms: true,
      });

      expect(result.objects.length).toBe(1);
      expect(result.objects[0].type).toBe("wall");
    });

    it("throws low_confidence error when warnings indicate low confidence", async () => {
      vi.mocked(resolveProviderChain).mockReturnValue([
        { apiKey: "key", baseURL: "url", model: "gpt-4", defaultHeaders: {} },
      ]);

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                objects: [{ type: "wall", x1: 0, y1: 0, x2: 100, y2: 0 }],
                warnings: ["low confidence layout conversion"],
              }),
            },
          },
        ],
      });

      await expect(
        requestSketchToPlan({
          imageDataUrl: "data:image/png;base64,...",
          fileName: "sketch.png",
          prompt: "Convert to layout",
          includeRooms: true,
        })
      ).rejects.toThrow("low confidence layout conversion");
    });
  });
});
