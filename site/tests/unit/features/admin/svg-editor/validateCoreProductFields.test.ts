import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { descriptorToFormState } from "@/features/admin/svg-editor/svgEditorFormAdapters";
import { validateCoreProductFields } from "@/features/admin/svg-editor/validateCoreProductFields";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

/** Read-only load — never writes catalog files. */
function loadSideTableForm() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "inventory/descriptors/side-table-001.json"),
    "utf8",
  );
  return descriptorToFormState(JSON.parse(raw) as BlockDescriptor);
}

describe("validateCoreProductFields", () => {
  it("accepts a valid catalog-backed form (read-only fixture)", () => {
    const form = loadSideTableForm();
    expect(validateCoreProductFields(form)).toEqual([]);
  });

  it("rejects empty and invalid slug", () => {
    const form = loadSideTableForm();
    expect(validateCoreProductFields({ ...form, slug: "" })).toEqual([
      { path: "slug", message: "Slug is required." },
    ]);
    expect(
      validateCoreProductFields({ ...form, slug: "Bad_Slug" })[0]?.path,
    ).toBe("slug");
  });

  it("rejects non-positive geometry and empty mounting", () => {
    const form = loadSideTableForm();
    const issues = validateCoreProductFields({
      ...form,
      geometry: { ...form.geometry, widthMm: 0, depthMm: -1, heightMm: 0 },
      mounting: [],
    });
    expect(issues.map((issue) => issue.path).sort()).toEqual([
      "geometry.depthMm",
      "geometry.heightMm",
      "geometry.widthMm",
      "mounting",
    ]);
  });

  it("rejects empty live-announcement categories and bad view box", () => {
    const form = loadSideTableForm();
    const issues = validateCoreProductFields({
      ...form,
      liveAnnouncementCategories: [],
      viewBox: { ...form.viewBox, width: 0, height: -2 },
    });
    expect(issues.map((issue) => issue.path).sort()).toEqual([
      "liveAnnouncementCategories",
      "viewBox.height",
      "viewBox.width",
    ]);
  });
});
