import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SvgEditorForm } from "@/features/admin/svg-editor/form/SvgEditorForm";
import { descriptorToFormState } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { fieldsForVariant } from "@/features/admin/svg-editor/form/svgEditorFormModel";

describe("SvgEditorForm", () => {
  it("renders form from descriptor state", () => {
    const stub = makeNewBlockDescriptorStub();
    const state = descriptorToFormState(stub);
    const fields = fieldsForVariant(state.variant);
    render(
      <SvgEditorForm
        fields={fields}
        state={state}
        variant={state.variant}
        issues={[]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByTestId("admin-svg-form")).toBeInTheDocument();
    expect(screen.getByTestId("admin-form-group-identity")).toBeInTheDocument();
    expect(document.querySelector('[data-field="slug"]')).toHaveAttribute(
      "data-field-kind",
      "text",
    );
    expect(
      document.querySelector('[data-field="geometry.widthMm"]'),
    ).toHaveAttribute("data-field-kind", "number");
    expect(document.querySelector('[data-field="mounting"]')).toHaveAttribute(
      "data-field-kind",
      "multiselect",
    );
  });
});
