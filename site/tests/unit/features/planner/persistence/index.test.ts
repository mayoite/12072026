import { describe, expect, it } from "vitest";
import * as persistence from "@/features/planner/persistence";

describe("persistence barrel", () => {
  it("re-exports draft, session, import, saves, and autosave helpers", () => {
    expect(typeof persistence.parsePlannerDocumentImportText).toBe("function");
    expect(typeof persistence.createAutoSaver).toBe("function");
    expect(typeof persistence.getPlannerProjectId).toBe("function");
    const keys = Object.keys(persistence);
    expect(keys.length).toBeGreaterThan(5);
    expect(keys).toEqual(
      expect.arrayContaining([
        "parsePlannerDocumentImportText",
        "createAutoSaver",
      ]),
    );
  });
});
