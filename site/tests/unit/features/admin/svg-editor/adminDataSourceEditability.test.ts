import { describe, expect, it } from "vitest";
import {
  declareSvgEditSources,
  formatDataSourceBanner,
} from "@/features/admin/svg-editor/adminDataSourceEditability";

describe("adminDataSourceEditability", () => {
  it("editable when live with publish; read-only when retired", () => {
    const live = declareSvgEditSources({ catalogLifecycle: "live", hasOnPublishAction: true });
    expect(live.every((s) => s.mode === "editable")).toBe(true);
    const retired = declareSvgEditSources({ catalogLifecycle: "retired", hasOnPublishAction: true });
    expect(retired.every((s) => s.mode === "read-only")).toBe(true);
    expect(formatDataSourceBanner(live)).toMatch(/Editable/);
  });
});
