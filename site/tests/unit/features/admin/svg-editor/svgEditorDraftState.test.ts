import { describe, expect, it } from "vitest";

import {
  advancePublishedDraft,
  createEditorDraft,
  resetEditorDraft,
} from "@/features/admin/svg-editor/svgEditorDraftState";

describe("SVG editor published draft baseline", () => {
  it("resets to the latest successful publication", () => {
    const opened = createEditorDraft({ title: "Original" });
    const published = advancePublishedDraft(opened, { title: "Published edit" });
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
});
