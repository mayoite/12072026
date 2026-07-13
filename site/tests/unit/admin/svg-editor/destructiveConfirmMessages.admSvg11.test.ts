/**
 * ADM-SVG-11 — reset, discard, delete, rollback name impact before confirm.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  confirmDeleteLayer,
  confirmDiscardUnsavedNavigation,
  confirmResetToPublished,
  confirmRollbackRevision,
} from "@/features/planner/admin/svg-editor/destructiveConfirmMessages";

function readSiteSource(...parts: string[]): string {
  return fs.readFileSync(path.join(process.cwd(), ...parts), "utf8");
}

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

  it("call sites require window.confirm with impact helpers before acting", () => {
    const edit = readSiteSource(
      "features/planner/admin/svg-editor/AdminSvgEditorEditView.tsx",
    );
    const canvas = readSiteSource(
      "features/planner/admin/svg-editor/SvgStudioCanvas.tsx",
    );
    const revisions = readSiteSource(
      "features/planner/admin/svg-editor/DescriptorRevisionPanel.tsx",
    );

    // Reset to published (draft discard).
    expect(edit).toMatch(/confirmResetToPublished/);
    expect(edit).toMatch(
      /formDirty && !window\.confirm\(confirmResetToPublished\(slug\)\)/,
    );

    // Discard on leave / unsaved navigation.
    expect(edit).toMatch(/confirmDiscardUnsavedNavigation/);
    expect(edit).toMatch(
      /window\.confirm\(confirmDiscardUnsavedNavigation\(slug\)\)/,
    );

    // Layer delete (button + keyboard share deleteSelected).
    expect(canvas).toMatch(/confirmDeleteLayer/);
    expect(canvas).toMatch(
      /!window\.confirm\(confirmDeleteLayer\(selected\.name\)\)/,
    );
    expect(canvas).toMatch(/removeNode\(document,\s*selected\.id\)/);

    // Rollback revision.
    expect(revisions).toMatch(/confirmRollbackRevision/);
    expect(revisions).toMatch(
      /!window\.confirm\(confirmRollbackRevision\(slug,\s*version\)\)/,
    );
  });
});
