import { describe, it, expect, vi } from "vitest";
vi.mock("@/features/planner/catalog-api/shapeTypeRegistry", () => ({
  PlannerCatalogShapeType: {
    desk: "desk",
    bench: "bench",
    chair: "chair",
    storage: "storage",
    conference: "conference",
    phoneBooth: "phoneBooth",
  },
}));

import {
  CHAT_ADVISOR_SYSTEM_PROMPT,
  SPACE_SUGGEST_SYSTEM_PROMPT,
  buildSpaceSuggestUserPrompt,
} from "@/features/planner/ai/prompts";

describe("prompts", () => {
  it("defines system prompts correctly", () => {
    expect(CHAT_ADVISOR_SYSTEM_PROMPT).toContain("oando.co.in");
    expect(CHAT_ADVISOR_SYSTEM_PROMPT).toContain("desk, bench, chair, storage, conference, phoneBooth");
    expect(SPACE_SUGGEST_SYSTEM_PROMPT).toContain("Indian corporate facilities teams");
  });

  it("builds user prompt with floor area", () => {
    const prompt = buildSpaceSuggestUserPrompt({
      seatCount: 10,
      purpose: "Call center support office",
      floorAreaSqFt: 500,
    });
    expect(prompt).toContain("Plan a layout for 10 seats.");
    expect(prompt).toContain("Primary purpose: Call center support office.");
    expect(prompt).toContain("Floor area: 500 sq ft.");
  });

  it("builds user prompt without floor area", () => {
    const prompt = buildSpaceSuggestUserPrompt({
      seatCount: 20,
      purpose: "Hybrid boardroom",
    });
    expect(prompt).toContain("Plan a layout for 20 seats.");
    expect(prompt).toContain("Primary purpose: Hybrid boardroom.");
    expect(prompt).toContain("estimate ~50 sq ft per seat");
  });
});
