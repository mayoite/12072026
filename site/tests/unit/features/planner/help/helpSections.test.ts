import { describe, expect, it } from "vitest";
import { PLANNER_HELP_FAQ_ITEMS, PLANNER_HELP_SECTIONS } from "@/features/planner/help/helpSections";

describe("PLANNER_HELP_SECTIONS", () => {
  it("should be defined and contain sections", () => {
    expect(PLANNER_HELP_SECTIONS).toBeDefined();
    expect(PLANNER_HELP_SECTIONS.length).toBeGreaterThan(0);
  });

  it("should have correct properties on each section", () => {
    for (const section of PLANNER_HELP_SECTIONS) {
      expect(section.id).toBeDefined();
      expect(typeof section.id).toBe("string");
      expect(section.title).toBeDefined();
      expect(typeof section.title).toBe("string");
      expect(section.summary).toBeDefined();
      expect(typeof section.summary).toBe("string");
      expect(section.keywords).toBeInstanceOf(Array);
      for (const kw of section.keywords) {
        expect(typeof kw).toBe("string");
      }
      if (section.featureSlug !== undefined) {
        expect(typeof section.featureSlug).toBe("string");
      }
    }
  });

  it("should contain specific expected section ids", () => {
    const ids = PLANNER_HELP_SECTIONS.map((s) => s.id);
    expect(ids).toContain("getting-started");
    expect(ids).toContain("canvas-basics");
    expect(ids).toContain("catalog-and-blocks");
    expect(ids).toContain("saving-and-autosave");
  });

  it("should expose FAQ items for structured data", () => {
    expect(PLANNER_HELP_FAQ_ITEMS.length).toBeGreaterThan(0);
    for (const item of PLANNER_HELP_FAQ_ITEMS) {
      expect(item.question).toBeDefined();
      expect(item.answer).toBeDefined();
    }
  });
});
