import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { descriptorToFormState } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import {
  hasCoreProductFieldErrors,
  validateCoreProductFields,
} from "@/features/admin/svg-editor/form/validateCoreProductFields";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";

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
    expect(hasCoreProductFieldErrors(form)).toBe(false);
  });

  it("rejects empty and invalid slug", () => {
    const form = loadSideTableForm();
    expect(validateCoreProductFields({ ...form, slug: "" })).toEqual([
      { path: "slug", message: "Slug is required." },
    ]);
    expect(
      validateCoreProductFields({ ...form, slug: "Bad_Slug" })[0]?.path,
    ).toBe("slug");
    expect(hasCoreProductFieldErrors({ ...form, slug: " " })).toBe(true);
  });

  it("rejects SKU longer than 120 characters", () => {
    const form = loadSideTableForm();
    const issues = validateCoreProductFields({
      ...form,
      sku: "x".repeat(121),
    });
    expect(issues).toEqual([
      { path: "sku", message: "SKU must be at most 120 characters." },
    ]);
  });

  it("rejects invalid source provenance", () => {
    const form = loadSideTableForm();
    const issues = validateCoreProductFields({
      ...form,
      sourceProvenance: "imported" as typeof form.sourceProvenance,
    });
    expect(issues[0]?.path).toBe("sourceProvenance");
    expect(issues[0]?.message).toMatch(/donor, native, or migrated/);
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

  it("rejects invalid optional seat height and weight", () => {
    const form = loadSideTableForm();
    const issues = validateCoreProductFields({
      ...form,
      geometry: {
        ...form.geometry,
        seatHeightMm: 0,
        weightKg: -5,
      },
    });
    expect(issues.map((i) => i.path).sort()).toEqual([
      "geometry.seatHeightMm",
      "geometry.weightKg",
    ]);
  });

  it("allows omitted optional seat height and weight", () => {
    const form = loadSideTableForm();
    const issues = validateCoreProductFields({
      ...form,
      geometry: {
        widthMm: form.geometry.widthMm,
        depthMm: form.geometry.depthMm,
        heightMm: form.geometry.heightMm,
      },
    });
    expect(issues).toEqual([]);
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
