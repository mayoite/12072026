import { describe, expect, it } from "vitest";
import {
  confirmDeleteLayer,
  confirmDiscardUnsavedNavigation,
  confirmResetToPublished,
  confirmRollbackRevision,
} from "@/features/admin/svg-editor/contracts/destructiveConfirmMessages";

describe("destructiveConfirmMessages", () => {
  it("confirmResetToPublished names slug and impact", () => {
    const msg = confirmResetToPublished("desk-a");
    expect(msg).toContain("desk-a");
    expect(msg.toLowerCase()).toMatch(/impact/);
    expect(msg.toLowerCase()).toMatch(/reset|published|discard/);
  });

  it("confirmDiscardUnsavedNavigation names slug", () => {
    const msg = confirmDiscardUnsavedNavigation("desk-a");
    expect(msg).toContain("desk-a");
    expect(msg.toLowerCase()).toMatch(/unsaved|leave|discard|navigate/);
  });

  it("confirmDeleteLayer names layer and undo impact", () => {
    const msg = confirmDeleteLayer("Seat layer");
    expect(msg).toContain("Seat layer");
    expect(msg.toLowerCase()).toMatch(/undo|delete|remove/);
  });

  it("confirmRollbackRevision names slug and version", () => {
    const msg = confirmRollbackRevision("desk-a", 2);
    expect(msg).toContain("desk-a");
    expect(msg).toContain("v2");
    expect(msg.toLowerCase()).toMatch(/rollback|restore|revision|impact/);
  });
});
