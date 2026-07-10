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

describe("help save honesty (W6)", () => {
  const FORBIDDEN_ACCOUNT_SLOTS = /named save slots in their account/i;

  it("saving section does not claim account named slots while open3d is local-only", () => {
    const section = PLANNER_HELP_SECTIONS.find((s) => s.id === "saving-and-autosave");
    expect(section).toBeDefined();
    const text = `${section!.title} ${section!.summary}`.toLowerCase();
    expect(text).toMatch(/browser|local/);
    expect(text).not.toMatch(FORBIDDEN_ACCOUNT_SLOTS);
    expect(section!.summary.toLowerCase()).toMatch(/local storage|autosave/);
    expect(section!.summary.toLowerCase()).toMatch(/not enabled|until cloud|local-first|browser/);
  });

  it("FAQ how plans saved is local-honest", () => {
    const faq = PLANNER_HELP_FAQ_ITEMS.find((f) => /how are plans saved/i.test(f.question));
    expect(faq).toBeDefined();
    const answer = faq!.answer.toLowerCase();
    expect(answer).toMatch(/browser|local/);
    expect(answer).not.toMatch(FORBIDDEN_ACCOUNT_SLOTS);
    expect(answer).toMatch(/local storage|local flush|autosave/);
    expect(answer).not.toMatch(/named save slots/);
  });

  it("guest vs member does not imply account named save slots", () => {
    const section = PLANNER_HELP_SECTIONS.find((s) => s.id === "guest-vs-member");
    expect(section).toBeDefined();
    const text = `${section!.title} ${section!.summary}`.toLowerCase();
    expect(text).not.toMatch(FORBIDDEN_ACCOUNT_SLOTS);
    expect(text).not.toMatch(/named save slots/);
    expect(text).toMatch(/local/);
    expect(text).toMatch(/guest|member/);
  });

  it("all help section summaries and FAQ answers omit forbidden account-slot claim", () => {
    for (const section of PLANNER_HELP_SECTIONS) {
      expect(section.summary).not.toMatch(FORBIDDEN_ACCOUNT_SLOTS);
      expect(section.summary).not.toMatch(/named save slots/);
    }
    for (const item of PLANNER_HELP_FAQ_ITEMS) {
      expect(item.answer).not.toMatch(FORBIDDEN_ACCOUNT_SLOTS);
      expect(item.answer).not.toMatch(/named save slots/);
    }
  });
});
