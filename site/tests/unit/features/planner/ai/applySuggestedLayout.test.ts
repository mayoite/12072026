import { describe, expect, it } from "vitest";
import {
  applySuggestedLayout,
  buildShapesFromSuggestedLayout,
} from "@/features/planner/ai/applySuggestedLayout";
import type { SuggestedLayoutJson } from "@/features/planner/ai/types";

const validLayout = {
  version: 1 as const,
  furniture: [] as SuggestedLayoutJson["furniture"],
  room: { label: "Room", widthMm: 5000, depthMm: 4000 },
  walls: [] as SuggestedLayoutJson["walls"],
  zones: [] as SuggestedLayoutJson["zones"],
  source: "grid-pack" as const,
  summary: "test",
} satisfies SuggestedLayoutJson;

describe("applySuggestedLayout", () => {
  it("throws when no layout is provided", () => {
    expect(() => applySuggestedLayout(null)).toThrow(/No layout provided/);
  });

  it("throws when schema validation fails", () => {
    expect(() =>
      applySuggestedLayout(null, { ...validLayout, version: 2 as 1 }),
    ).toThrow(/Schema validation failed/);
  });

  it("throws when layout is valid but apply is not wired", () => {
    expect(() => applySuggestedLayout(null, validLayout)).toThrow(
      /not wired to the live workspace/,
    );
  });

  it("buildShapesFromSuggestedLayout returns empty until host apply exists", () => {
    expect(buildShapesFromSuggestedLayout(validLayout)).toEqual([]);
  });
});
