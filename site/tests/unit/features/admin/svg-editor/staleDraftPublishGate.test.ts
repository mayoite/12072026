import { describe, expect, it } from "vitest";
import { assertDraftNotStale } from "@/features/admin/svg-editor/staleDraftPublishGate";

describe("assertDraftNotStale", () => {
  it("allows match and blocks mismatch / non-finite", () => {
    expect(
      assertDraftNotStale({
        clientBaselineGeneratedAt: 1,
        serverBaselineGeneratedAt: 1,
        slug: "d",
      }),
    ).toEqual({ ok: true });
    const stale = assertDraftNotStale({
      clientBaselineGeneratedAt: 1,
      serverBaselineGeneratedAt: 2,
      slug: "d",
    });
    expect(stale.ok).toBe(false);
    expect(
      assertDraftNotStale({
        clientBaselineGeneratedAt: Number.NaN,
        serverBaselineGeneratedAt: 1,
        slug: "d",
      }).ok,
    ).toBe(false);
  });
});
