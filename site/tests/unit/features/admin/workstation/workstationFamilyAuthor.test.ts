import { describe, expect, it } from "vitest";

import {
  defaultWorkstationAuthorDraft,
  releaseWorkstationAuthorDraft,
  workstationAuthorFromJson,
  workstationJsonFromAuthor,
} from "@/features/admin/workstation/workstationFamilyAuthor";

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

  it("defaults seaters to 2 when no topology flags and uses l-shape when only L", () => {
    const onlyL = workstationJsonFromAuthor({
      ...defaultWorkstationAuthorDraft(),
      linear2Seat: false,
      lShape4Seat: true,
      panelOption: false,
      pedestalOption: false,
      familySlug: "  ",
      versionId: "  ",
    });
    const parsed = JSON.parse(onlyL) as {
      shape: string;
      seaterOptions: number[];
      oandoWorkstationFamily: { familySlug: string; activeVersionId: string | null };
    };
    expect(parsed.shape).toBe("l-shape");
    expect(parsed.seaterOptions).toEqual([4]);
    expect(parsed.oandoWorkstationFamily.familySlug).toBe("premium-linear");
    expect(parsed.oandoWorkstationFamily.activeVersionId).toBe("v1");

    const none = workstationJsonFromAuthor({
      ...defaultWorkstationAuthorDraft(),
      linear2Seat: false,
      lShape4Seat: false,
    });
    expect(JSON.parse(none).seaterOptions).toEqual([2]);
  });

  it("parses legacy seaters when contract is absent and falls back on invalid JSON", () => {
    const legacy = JSON.stringify({
      shape: "straight",
      system: "leg",
      wireManagement: [],
      sharing: "non-sharing",
      seaterOptions: [2, 4],
      lengthOptions: [1200],
      depthOptions: [600],
      heightMm: 740,
    });
    const fromLegacy = workstationAuthorFromJson(legacy);
    expect(fromLegacy.linear2Seat).toBe(true);
    expect(fromLegacy.lShape4Seat).toBe(true);
    expect(fromLegacy.lengthOptions).toEqual([1200]);
    expect(fromLegacy.heightMm).toBe(740);

    const fallback = workstationAuthorFromJson("not-json{");
    expect(fallback.familySlug).toBe(defaultWorkstationAuthorDraft().familySlug);

    const emptyObject = workstationAuthorFromJson("{}");
    expect(emptyObject.linear2Seat).toBe(false);
    expect(emptyObject.lShape4Seat).toBe(false);
  });

  it("releaseWorkstationAuthorDraft updates contract or reports errors", () => {
    const base = workstationJsonFromAuthor(defaultWorkstationAuthorDraft());
    const released = releaseWorkstationAuthorDraft(
      {
        ...defaultWorkstationAuthorDraft(),
        versionId: "v2",
        migrationChoice: "append",
        linear2Seat: true,
        lShape4Seat: false,
        panelOption: true,
        pedestalOption: false,
      },
      base,
    );
    expect(released.ok).toBe(true);
    if (released.ok) {
      const parsed = JSON.parse(released.json) as {
        oandoWorkstationFamily: { versions: { versionId: string }[] };
      };
      expect(
        parsed.oandoWorkstationFamily.versions.some((v) => v.versionId === "v2"),
      ).toBe(true);
    }

    expect(releaseWorkstationAuthorDraft(defaultWorkstationAuthorDraft(), "nope").ok).toBe(
      false,
    );
    expect(
      releaseWorkstationAuthorDraft(
        defaultWorkstationAuthorDraft(),
        JSON.stringify({ shape: "straight" }),
      ).ok,
    ).toBe(false);
  });
});
