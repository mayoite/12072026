/**
 * ADM-SVG-11 — reset, discard, delete, rollback name impact before confirm.
 */

import { describe, expect, it } from "vitest";

import {
  confirmDeleteLayer,
  confirmDiscardUnsavedNavigation,
  confirmResetToPublished,
  confirmRollbackRevision,
} from "@/features/planner/admin/svg-editor/destructiveConfirmMessages";

describe("ADM-SVG-11 destructive confirmation impact", () => {
  it("reset explains draft discard and that the released SVG is not deleted", () => {
    const message = confirmResetToPublished("side-table-001");
    expect(message).toContain("side-table-001");
    expect(message.toLowerCase()).toMatch(/discard|unpublished/);
    expect(message.toLowerCase()).toMatch(/published|released/);
    expect(message.toLowerCase()).toMatch(/impact/);
  });

  it("navigation discard explains irreversible loss of unpublished work", () => {
    const message = confirmDiscardUnsavedNavigation("side-table-001");
    expect(message).toContain("side-table-001");
    expect(message.toLowerCase()).toMatch(/discard/);
    expect(message.toLowerCase()).toMatch(/cannot be recovered|impact/);
  });

  it("layer delete explains draft-only impact and undo window", () => {
    const message = confirmDeleteLayer("Rectangle");
    expect(message).toContain("Rectangle");
    expect(message.toLowerCase()).toMatch(/draft/);
    expect(message.toLowerCase()).toMatch(/undo/);
    expect(message.toLowerCase()).toMatch(/published/);
  });

  it("rollback explains republish and history preservation", () => {
    const message = confirmRollbackRevision("side-table-001", 3);
    expect(message).toContain("side-table-001");
    expect(message).toContain("v3");
    expect(message.toLowerCase()).toMatch(/re-published|republish|publish/);
    expect(message.toLowerCase()).toMatch(/history/);
    expect(message.toLowerCase()).toMatch(/impact/);
  });
});
