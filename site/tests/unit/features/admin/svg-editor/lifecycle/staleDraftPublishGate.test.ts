import { describe, expect, it } from "vitest";
import {
  assertDraftNotStale,
  readOpenedBaselineFromPayload,
  readOpenedBaselineStamp,
} from "@/features/admin/svg-editor/lifecycle/staleDraftPublishGate";

describe("assertDraftNotStale", () => {
  it("allows matching finite baselines", () => {
    expect(
      assertDraftNotStale({
        clientBaselineGeneratedAt: 1700000000,
        serverBaselineGeneratedAt: 1700000000,
        slug: "desk-a",
      }),
    ).toEqual({ ok: true });
  });

  it("blocks when server baseline moved since draft open", () => {
    const stale = assertDraftNotStale({
      clientBaselineGeneratedAt: 1,
      serverBaselineGeneratedAt: 2,
      slug: "desk-a",
    });
    expect(stale.ok).toBe(false);
    if (stale.ok) throw new Error("expected stale");
    expect(stale.code).toBe("stale_draft");
    expect(stale.error).toMatch(/desk-a/);
    expect(stale.error).toMatch(/baseline changed/i);
    expect(stale.error).toMatch(/not written/i);
  });

  it("blocks non-finite client or server stamps", () => {
    for (const client of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      const result = assertDraftNotStale({
        clientBaselineGeneratedAt: client,
        serverBaselineGeneratedAt: 1,
        slug: "desk-a",
      });
      expect(result.ok).toBe(false);
      if (result.ok) throw new Error("expected failure");
      expect(result.code).toBe("stale_draft");
      expect(result.error).toMatch(/missing baseline stamps/i);
    }

    const serverBad = assertDraftNotStale({
      clientBaselineGeneratedAt: 1,
      serverBaselineGeneratedAt: Number.NaN,
      slug: "desk-a",
    });
    expect(serverBad.ok).toBe(false);
  });

  it("blocks when client stamp is missing (undefined must not become 0)", () => {
    const result = assertDraftNotStale({
      clientBaselineGeneratedAt: Number.NaN,
      serverBaselineGeneratedAt: 1700000000,
      slug: "desk-a",
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error).toMatch(/missing baseline stamps/i);
  });
});

describe("readOpenedBaselineStamp", () => {
  it("returns finite numbers unchanged", () => {
    expect(readOpenedBaselineStamp({ openedBaselineGeneratedAt: 42 })).toBe(42);
    expect(readOpenedBaselineStamp({ openedBaselineGeneratedAt: 0 })).toBe(0);
  });

  it("returns NaN when stamp is absent or non-finite", () => {
    expect(readOpenedBaselineStamp({})).toBeNaN();
    expect(readOpenedBaselineStamp({ openedBaselineGeneratedAt: undefined })).toBeNaN();
    expect(readOpenedBaselineStamp({ openedBaselineGeneratedAt: Number.NaN })).toBeNaN();
  });
});

describe("readOpenedBaselineFromPayload", () => {
  it("reads stamp from publish JSON body", () => {
    expect(
      readOpenedBaselineFromPayload({ openedBaselineGeneratedAt: 99, slug: "desk-a" }),
    ).toBe(99);
  });

  it("returns NaN for invalid bodies", () => {
    expect(readOpenedBaselineFromPayload(null)).toBeNaN();
    expect(readOpenedBaselineFromPayload({ slug: "desk-a" })).toBeNaN();
  });
});
