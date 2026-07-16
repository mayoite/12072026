import { describe, expect, it } from "vitest";

import {
  authoringLifecycleBadgeClass,
  authoringLifecycleLabel,
  changedFormKeys,
  deriveAuthoringLifecycle,
  describeChangedFields,
} from "@/features/admin/svg-editor/lifecycle/authoringLifecycle";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/form/svgEditorFormState";
import type { AuthoringLifecycle } from "@/features/admin/svg-editor/lifecycle/authoringLifecycle";

const baseInput = {
  submitting: false,
  errorMessage: null as string | null,
  successMessage: null as string | null,
  previewPending: false,
  previewOk: true as boolean | null,
  formDirty: false,
};

describe("deriveAuthoringLifecycle (ADM-STATE-01)", () => {
  it("covers the authoring lifecycle priorities in order", () => {
    expect(deriveAuthoringLifecycle({ ...baseInput, submitting: true })).toBe("publishing");
    expect(
      deriveAuthoringLifecycle({
        ...baseInput,
        submitting: true,
        errorMessage: "ignored while submitting",
        formDirty: true,
      }),
    ).toBe("publishing");
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
    expect(deriveAuthoringLifecycle({ ...baseInput, previewOk: null })).toBe("clean");
  });

  it("labels and badge classes cover every lifecycle state", () => {
    const states: AuthoringLifecycle[] = [
      "publishing",
      "validating",
      "invalid",
      "dirty",
      "clean",
      "error",
      "published",
    ];
    const labels: Record<AuthoringLifecycle, string> = {
      publishing: "Publishing",
      validating: "Validating",
      invalid: "Publication blocked",
      dirty: "Unpublished changes",
      clean: "In sync with published",
      error: "Publish error",
      published: "Just published",
    };
    for (const state of states) {
      expect(authoringLifecycleLabel(state)).toBe(labels[state]);
      expect(authoringLifecycleBadgeClass(state)).toMatch(/^admin-badge/);
    }
    expect(authoringLifecycleBadgeClass("publishing")).toBe("admin-badge");
    expect(authoringLifecycleBadgeClass("validating")).toBe("admin-badge");
    expect(authoringLifecycleBadgeClass("invalid")).toContain("admin-badge--warn");
    expect(authoringLifecycleBadgeClass("error")).toContain("admin-badge--warn");
    expect(authoringLifecycleBadgeClass("dirty")).toContain("admin-badge--warn");
    expect(authoringLifecycleBadgeClass("clean")).toContain("admin-badge--active");
    expect(authoringLifecycleBadgeClass("published")).toContain("admin-badge--active");
  });
});

describe("describeChangedFields (ADM-SVG-14)", () => {
  it("names field and studio differences against the published baseline", () => {
    const published = {
      sku: "SKU-1",
      sceneParts: [{ id: "a" }],
      sceneViewBox: { x: 0, y: 0, width: 100, height: 100 },
    } as unknown as SvgEditorFormState;
    const draft = {
      sku: "SKU-2",
      sceneParts: [{ id: "a" }, { id: "b" }],
      sceneViewBox: { x: 0, y: 0, width: 200, height: 100 },
    } as unknown as SvgEditorFormState;

    expect(changedFormKeys(draft, published)).toEqual(
      expect.arrayContaining(["sku", "sceneParts", "sceneViewBox"]),
    );
    const described = describeChangedFields(draft, published);
    expect(described.some((entry) => entry.key === "sku" && entry.label === "SKU")).toBe(true);
    expect(
      described.some(
        (entry) =>
          entry.key === "sceneParts" &&
          entry.label === "Visual studio geometry" &&
          entry.targetId === null,
      ),
    ).toBe(true);
    expect(
      described.some(
        (entry) =>
          entry.key === "sceneViewBox" && entry.label === "Visual studio geometry",
      ),
    ).toBe(true);
  });

  it("falls back to raw key when field cartography has no match", () => {
    const published = { mysteryField: 1 } as unknown as SvgEditorFormState;
    const draft = { mysteryField: 2 } as unknown as SvgEditorFormState;
    const described = describeChangedFields(draft, published);
    expect(described).toEqual([
      { key: "mysteryField", label: "mysteryField", targetId: null },
    ]);
  });

  it("returns empty when draft matches published", () => {
    const state = { sku: "SAME" } as unknown as SvgEditorFormState;
    expect(changedFormKeys(state, state)).toEqual([]);
    expect(describeChangedFields(state, state)).toEqual([]);
  });
});
