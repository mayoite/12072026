import { describe, expect, it } from "vitest";
import {
  nextLifecycleAfterAction,
  placementPolicyForLifecycle,
  preservesRetiredIdentityInExistingDesigns,
  retirementConfirmMessage,
} from "@/features/admin/svg-editor/lifecycle/catalogRetirement";

describe("catalogRetirement", () => {
  it("placement policy blocks draft and retired, allows live", () => {
    expect(placementPolicyForLifecycle("live")).toEqual({
      allowed: true,
      reason: "Product is live — placement allowed.",
    });
    expect(placementPolicyForLifecycle("draft").allowed).toBe(false);
    expect(placementPolicyForLifecycle("draft").reason).toMatch(/draft/i);
    expect(placementPolicyForLifecycle("retired").allowed).toBe(false);
    expect(placementPolicyForLifecycle("retired").reason).toMatch(/retired/i);
  });

  it("preserves retired identity in existing designs", () => {
    expect(preservesRetiredIdentityInExistingDesigns()).toBe(true);
  });

  it("retire and restore transitions with errors for illegal moves", () => {
    expect(nextLifecycleAfterAction("live", "retire")).toEqual({ ok: true, next: "retired" });
    expect(nextLifecycleAfterAction("draft", "retire")).toEqual({ ok: true, next: "retired" });
    expect(nextLifecycleAfterAction("retired", "retire")).toEqual({
      ok: false,
      error: "Product is already retired.",
    });

    expect(nextLifecycleAfterAction("retired", "restore")).toEqual({ ok: true, next: "live" });
    expect(nextLifecycleAfterAction("live", "restore")).toEqual({
      ok: false,
      error: "Only retired products can be restored to live.",
    });
    expect(nextLifecycleAfterAction("draft", "restore").ok).toBe(false);
  });

  it("confirm messages name slug and impact", () => {
    const retire = retirementConfirmMessage("desk-a", "retire");
    expect(retire).toContain("desk-a");
    expect(retire.toLowerCase()).toMatch(/impact/);
    expect(retire.toLowerCase()).toMatch(/restore/);

    const restore = retirementConfirmMessage("desk-a", "restore");
    expect(restore).toContain("desk-a");
    expect(restore.toLowerCase()).toMatch(/live/);
    expect(restore.toLowerCase()).toMatch(/impact/);
  });
});
