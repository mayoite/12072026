import { describe, expect, it } from "vitest";

import { WORKSTATION_FAMILY_V0_FIXTURE } from "@/features/planner/admin/workstation/workstationFamilyContract";
import {
  releaseWorkstationFamilyVersion,
  requiresMigrationChoice,
} from "@/features/planner/admin/workstation/workstationFamilyRelease";

describe("workstationFamilyRelease", () => {
  it("requires migration when replacing a released active version", () => {
    const released = {
      ...WORKSTATION_FAMILY_V0_FIXTURE,
      versions: WORKSTATION_FAMILY_V0_FIXTURE.versions.map((v) => ({
        ...v,
        status: "released" as const,
      })),
    };
    expect(requiresMigrationChoice(released, "v2")).toBe(true);
  });

  it("releases a new version append-only", () => {
    const next = {
      ...WORKSTATION_FAMILY_V0_FIXTURE.versions[0],
      versionId: "v2",
      status: "draft" as const,
      effectiveFrom: "2026-08-01",
    };
    const result = releaseWorkstationFamilyVersion({
      contract: WORKSTATION_FAMILY_V0_FIXTURE,
      nextVersion: next,
      migration: "append",
    });
    expect("versions" in result).toBe(true);
    if (!("versions" in result)) return;
    expect(result.activeVersionId).toBe("v2");
    expect(result.versions.some((v) => v.versionId === "v1")).toBe(true);
    expect(result.versions.find((v) => v.versionId === "v2")?.status).toBe("released");
  });
});