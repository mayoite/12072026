import { describe, expect, it, vi } from "vitest";
import {
  applyBulkLifecycle,
  previewBulkLifecycle,
} from "@/features/admin/svg-editor/lifecycle/bulkLifecycleBatch";

describe("bulkLifecycleBatch", () => {
  it("previews retire when all rows valid and applies each slug", () => {
    const preview = previewBulkLifecycle(
      [
        { slug: "a", lifecycle: "live" },
        { slug: "b", lifecycle: "draft" },
      ],
      "retire",
    );
    expect(preview.canApply).toBe(true);
    expect(preview.action).toBe("retire");
    expect(preview.summary).toMatch(/All rows valid/);
    expect(preview.rows.map((r) => r.to)).toEqual(["retired", "retired"]);

    const applyOne = vi.fn();
    const result = applyBulkLifecycle(preview, applyOne);
    expect(result).toEqual({ ok: true, applied: ["a", "b"] });
    expect(applyOne).toHaveBeenNthCalledWith(1, "a", "retired");
    expect(applyOne).toHaveBeenNthCalledWith(2, "b", "retired");
  });

  it("previews restore for retired rows", () => {
    const preview = previewBulkLifecycle(
      [{ slug: "a", lifecycle: "retired" }],
      "restore",
    );
    expect(preview.canApply).toBe(true);
    expect(preview.rows[0]).toMatchObject({
      slug: "a",
      from: "retired",
      to: "live",
      ok: true,
    });
  });

  it("blocks preview when any row cannot transition", () => {
    const blocked = previewBulkLifecycle(
      [
        { slug: "ok", lifecycle: "live" },
        { slug: "already", lifecycle: "retired" },
      ],
      "retire",
    );
    expect(blocked.canApply).toBe(false);
    expect(blocked.summary).toMatch(/Blocked: 1 of 2/);
    expect(blocked.rows.find((r) => r.slug === "already")?.ok).toBe(false);
    expect(applyBulkLifecycle(blocked, vi.fn()).ok).toBe(false);
  });

  it("blocks empty target list", () => {
    const empty = previewBulkLifecycle([], "retire");
    expect(empty.canApply).toBe(false);
    expect(empty.rows).toEqual([]);
    expect(applyBulkLifecycle(empty, vi.fn())).toEqual({
      ok: false,
      error: empty.summary,
    });
  });

  it("returns apply failure when applyOne throws", () => {
    const preview = previewBulkLifecycle([{ slug: "a", lifecycle: "live" }], "retire");
    const result = applyBulkLifecycle(preview, () => {
      throw new Error("disk full");
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error).toMatch(/disk full/);
  });

  it("returns apply failure for non-Error throws", () => {
    const preview = previewBulkLifecycle([{ slug: "a", lifecycle: "live" }], "retire");
    const result = applyBulkLifecycle(preview, () => {
      throw "boom";
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error).toMatch(/boom/);
  });
});
