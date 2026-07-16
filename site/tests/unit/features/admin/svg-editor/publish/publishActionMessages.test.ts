import { describe, expect, it } from "vitest";
import {
  PLANNER_VERIFY_HREF,
  publishConfirmMessage,
  publishFailureMessage,
  publishImpactSummary,
  publishSuccessMessage,
  releasedSvgHref,
} from "@/features/admin/svg-editor/publish/publishActionMessages";

const impact = {
  targetSlug: "desk-1",
  draftSchemaVersion: "2026-07-04.v2",
  liveArtifactState: "published",
  liveRevisionShort: "abc",
};

describe("publishActionMessages", () => {
  it("builds impact, confirm, failure, success, and hrefs in operator language", () => {
    expect(publishImpactSummary(impact)).toContain("desk-1");
    expect(publishImpactSummary(impact)).toContain("current revision abc");
    expect(publishImpactSummary(impact)).toMatch(/Released symbol/i);
    expect(publishImpactSummary(impact)).not.toMatch(/schema|pipeline|Zod/i);
    expect(publishConfirmMessage(impact)).toMatch(/Impact/);
    expect(publishConfirmMessage(impact)).toContain("Draft version");
    expect(publishConfirmMessage(impact)).toContain("abc");
    expect(publishFailureMessage("desk-1", "err")).toMatch(/not replaced/i);
    expect(publishSuccessMessage("desk-1", "now")).toMatch(/Published/);
    expect(releasedSvgHref("desk-1")).toBe("/svg-catalog/desk-1.svg");
    expect(PLANNER_VERIFY_HREF).toBe("/planner/guest");
  });

  it("describes missing release when liveRevisionShort is null", () => {
    const noRev = {
      ...impact,
      liveArtifactState: "missing",
      liveRevisionShort: null,
    };
    expect(publishImpactSummary(noRev)).toContain("no released revision yet");
    expect(publishConfirmMessage(noRev)).toMatch(/not released yet/i);
    expect(publishConfirmMessage(noRev)).not.toContain(" · ");
  });
});

