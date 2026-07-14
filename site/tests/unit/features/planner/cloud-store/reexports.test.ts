import { describe, expect, it } from "vitest";

import { floorTemplates, instantiateTemplate } from "@/features/planner/cloud-store/floorTemplates";
import { appendSnapshot, MAX_VERSIONS } from "@/features/planner/cloud-store/versionStore";

describe("planner store canonical modules", () => {
  it("exports floor templates from floorTemplates.ts", () => {
    expect(floorTemplates.length).toBeGreaterThan(0);
    const blank = floorTemplates.find((template) => template.id === "blank");
    expect(blank, "blank floor template required").toBeDefined();
    const instantiated = instantiateTemplate(blank!);
    expect(instantiated.walls).toEqual([]);
  });

  it("exports versioning helpers from versionStore.ts", () => {
    expect(MAX_VERSIONS).toBeGreaterThan(0);
    const key = "project-1";
    appendSnapshot(key, { label: "v1", data: { walls: [] } });
    appendSnapshot(key, { label: "v2", data: { walls: [{ id: "w1" }] } });
    expect(appendSnapshot).toBeDefined();
  });
});
