import { describe, expect, it } from "vitest";
import {
  nextLifecycleAfterAction,
  placementPolicyForLifecycle,
  preservesRetiredIdentityInExistingDesigns,
  retirementConfirmMessage,
} from "@/features/admin/svg-editor/lifecycle/catalogRetirement";

describe("catalogRetirement", () => {
  it("placement policy and transitions", () => {
    expect(placementPolicyForLifecycle("live").allowed).toBe(true);
    expect(placementPolicyForLifecycle("retired").allowed).toBe(false);
    expect(preservesRetiredIdentityInExistingDesigns()).toBe(true);
    expect(nextLifecycleAfterAction("live", "retire")).toEqual({ ok: true, next: "retired" });
    expect(nextLifecycleAfterAction("retired", "restore")).toEqual({ ok: true, next: "live" });
    expect(retirementConfirmMessage("desk", "retire")).toMatch(/desk/);
  });
});
