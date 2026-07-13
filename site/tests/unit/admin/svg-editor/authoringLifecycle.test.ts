import { describe, expect, it } from "vitest";

import {
  authoringLifecycleBadgeClass,
  authoringLifecycleLabel,
  changedFormKeys,
  deriveAuthoringLifecycle,
  describeChangedFields,
} from "@/features/planner/admin/svg-editor/authoringLifecycle";
import type { SvgEditorFormState } from "@/features/planner/admin/svg-editor/svgEditorFormState";

const baseInput = {
  submitting: false,
  errorMessage: null as string | null,
  successMessage: null as string | null,
  previewPending: false,
  previewOk: true as boolean | null,
  formDirty: false,
};

describe("deriveAuthoringLifecycle (ADM-STATE-01)", () => {
  it("covers the authoring lifecycle priorities", () => {
    expect(deriveAuthoringLifecycle({ ...baseInput, submitting: true })).toBe("publishing");
    expect(
      deriveAuthoringLifecycle({ ...baseInput, errorMessage: "boom", formDirty: true }),
    ).toBe("error");
    expect(deriveAuthoringLifecycle({ ...baseInput, previewPending: true })).toBe("validating");
    expect(deriveAuthoringLifecycle({ ...baseInput, previewOk: false })).toBe("invalid");
    expect(deriveAuthoringLifecycle({ ...baseInput, formDirty: true })).toBe("dirty");
    expect(
      deriveAuthoringLifecycle({ ...baseInput, successMessage: "done" }),
    ).toBe("published");
    expect(deriveAuthoringLifecycle(baseInput)).toBe("clean");
  });

  it("labels and badge classes stay explicit", () => {
    expect(authoringLifecycleLabel("dirty")).toBe("Unpublished changes");
    expect(authoringLifecycleLabel("invalid")).toBe("Publication blocked");
    expect(authoringLifecycleBadgeClass("dirty")).toContain("admin-badge--warn");
    expect(authoringLifecycleBadgeClass("clean")).toContain("admin-badge--active");
  });
});

describe("describeChangedFields (ADM-SVG-14)", () => {
  it("names field and studio differences against the published baseline", () => {
    const published = {
      sku: "SKU-1",
      sceneParts: [{ id: "a" }],
    } as unknown as SvgEditorFormState;
    const draft = {
      sku: "SKU-2",
      sceneParts: [{ id: "a" }, { id: "b" }],
    } as unknown as SvgEditorFormState;

    expect(changedFormKeys(draft, published)).toEqual(
      expect.arrayContaining(["sku", "sceneParts"]),
    );
    const described = describeChangedFields(draft, published);
    expect(described.some((entry) => entry.key === "sku" && entry.label === "SKU")).toBe(true);
    expect(
      described.some(
        (entry) => entry.key === "sceneParts" && entry.label === "Visual studio geometry",
      ),
    ).toBe(true);
  });
});
