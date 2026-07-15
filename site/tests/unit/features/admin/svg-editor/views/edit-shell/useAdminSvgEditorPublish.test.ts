import { describe, expect, it } from "vitest";

import {
  INITIAL_FEEDBACK,
} from "@/features/admin/svg-editor/views/edit-shell/useAdminSvgEditorPublish";

describe("useAdminSvgEditorPublish", () => {
  it("exposes a neutral initial feedback state", () => {
    expect(INITIAL_FEEDBACK).toEqual({
      submitting: false,
      errorMessage: null,
      successMessage: null,
      publishedSlug: null,
    });
  });
});