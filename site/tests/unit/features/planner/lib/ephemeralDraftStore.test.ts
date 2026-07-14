import { afterEach, describe, expect, it, vi } from "vitest";

describe("ephemeralDraftStore", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("no-ops save/get without window/indexedDB", async () => {
    vi.stubGlobal("window", undefined);
    const mod = await import("@/features/planner/lib/ephemeralDraftStore");
    await expect(mod.saveDraft("k", { a: 1 })).resolves.toBeUndefined();
    await expect(mod.getDraft("k")).resolves.toBeNull();
    await expect(mod.clearExpiredDrafts()).resolves.toBeUndefined();
  });
});
