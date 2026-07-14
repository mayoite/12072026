import { describe, expect, it } from "vitest";
import {
  confirmDeleteLayer,
  confirmDiscardUnsavedNavigation,
  confirmResetToPublished,
  confirmRollbackRevision,
} from "@/features/admin/svg-editor/destructiveConfirmMessages";

describe("destructiveConfirmMessages", () => {
  it("names impact for each destructive action", () => {
    expect(confirmResetToPublished("s").toLowerCase()).toMatch(/impact/);
    expect(confirmDiscardUnsavedNavigation("s")).toContain("s");
    expect(confirmDeleteLayer("Layer").toLowerCase()).toMatch(/undo/);
    expect(confirmRollbackRevision("s", 2)).toContain("v2");
  });
});
