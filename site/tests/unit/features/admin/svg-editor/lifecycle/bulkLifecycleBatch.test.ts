import { describe, expect, it, vi } from "vitest";
import {
  applyBulkLifecycle,
  previewBulkLifecycle,
} from "@/features/admin/svg-editor/lifecycle/bulkLifecycleBatch";

describe("bulkLifecycleBatch", () => {
  it("previews and applies retire when all rows valid", () => {
    const preview = previewBulkLifecycle([{ slug: "a", lifecycle: "live" }], "retire");
    expect(preview.canApply).toBe(true);
    const applyOne = vi.fn();
    const result = applyBulkLifecycle(preview, applyOne);
    expect(result.ok).toBe(true);
    expect(applyOne).toHaveBeenCalledWith("a", "retired");
    const blocked = previewBulkLifecycle([{ slug: "a", lifecycle: "retired" }], "retire");
    expect(blocked.canApply).toBe(false);
    expect(applyBulkLifecycle(blocked, applyOne).ok).toBe(false);
  });
});
