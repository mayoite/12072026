import { describe, expect, it } from "vitest";

import {
  advancePublishedDraft,
  createEditorDraft,
  resetEditorDraft,
} from "@/features/admin/svg-editor/lifecycle/svgEditorDraftState";

describe("SVG editor published draft baseline", () => {
  it("creates draft equal to published baseline", () => {
    const opened = createEditorDraft({ title: "Original", rev: 1 });
    expect(opened).toEqual({
      baseline: { title: "Original", rev: 1 },
      draft: { title: "Original", rev: 1 },
    });
  });

  it("resets to the latest successful publication", () => {
    const opened = createEditorDraft({ title: "Original" });
    const published = advancePublishedDraft(opened, { title: "Published edit" });
    expect(published).toEqual({
      baseline: { title: "Published edit" },
      draft: { title: "Published edit" },
    });
    const editedAgain = { ...published, draft: { title: "Unpublished edit" } };

    expect(resetEditorDraft(editedAgain)).toEqual({
      baseline: { title: "Published edit" },
      draft: { title: "Published edit" },
    });
  });

  it("does not mutate the prior state", () => {
    const opened = createEditorDraft({ title: "Original" });
    const snapshot = structuredClone(opened);
    advancePublishedDraft(opened, { title: "Published" });
    resetEditorDraft(opened);
    expect(opened).toEqual(snapshot);
  });

  it("reset without advance restores original baseline", () => {
    const opened = createEditorDraft({ title: "Original" });
    const dirty = { ...opened, draft: { title: "Dirty" } };
    expect(resetEditorDraft(dirty).draft).toEqual({ title: "Original" });
  });
});
