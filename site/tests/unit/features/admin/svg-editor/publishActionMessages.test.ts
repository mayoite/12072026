import { describe, expect, it } from "vitest";
import {
  PLANNER_VERIFY_HREF,
  publishConfirmMessage,
  publishFailureMessage,
  publishImpactSummary,
  publishSuccessMessage,
  releasedSvgHref,
} from "@/features/admin/svg-editor/publishActionMessages";

const impact = {
  targetSlug: "desk-1",
  draftSchemaVersion: "2026-07-04.v2",
  liveArtifactState: "published",
  liveRevisionShort: "abc",
};

describe("publishActionMessages", () => {
  it("builds impact, confirm, failure, success, and hrefs", () => {
    expect(publishImpactSummary(impact)).toContain("desk-1");
    expect(publishConfirmMessage(impact)).toMatch(/Impact/);
    expect(publishFailureMessage("desk-1", "err")).toMatch(/not replaced/i);
    expect(publishSuccessMessage("desk-1", "now")).toMatch(/Published/);
    expect(releasedSvgHref("desk-1")).toBe("/svg-catalog/desk-1.svg");
    expect(PLANNER_VERIFY_HREF).toBe("/planner/guest");
  });
});
