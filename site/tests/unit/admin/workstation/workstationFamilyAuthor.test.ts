import { describe, expect, it } from "vitest";

import {
  defaultWorkstationAuthorDraft,
  workstationAuthorFromJson,
  workstationJsonFromAuthor,
} from "@/features/planner/admin/workstation/workstationFamilyAuthor";

describe("workstationFamilyAuthor", () => {
  it("round-trips through structured authoring", () => {
    const json = workstationJsonFromAuthor(defaultWorkstationAuthorDraft());
    const parsed = JSON.parse(json) as {
      oandoWorkstationFamily?: { type: string };
      seaterOptions: number[];
    };
    expect(parsed.oandoWorkstationFamily?.type).toBe("oando-workstation-family");
    expect(parsed.seaterOptions).toContain(2);
    expect(workstationAuthorFromJson(json).linear2Seat).toBe(true);
  });

  it("embeds contract on emit", () => {
    const json = workstationJsonFromAuthor({
      ...defaultWorkstationAuthorDraft(),
      familySlug: "exec-linear",
      versionId: "v2",
    });
    const parsed = JSON.parse(json) as {
      oandoWorkstationFamily: { familySlug: string; activeVersionId: string | null };
    };
    expect(parsed.oandoWorkstationFamily.familySlug).toBe("exec-linear");
    expect(parsed.oandoWorkstationFamily.activeVersionId).toBe("v2");
  });
});