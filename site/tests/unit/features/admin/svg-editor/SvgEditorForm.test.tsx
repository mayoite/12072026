import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SvgEditorForm } from "@/features/admin/svg-editor/SvgEditorForm";
import { descriptorToFormState } from "@/features/admin/svg-editor/svgEditorFormAdapters";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/newBlockDescriptorStub";
import { fieldsForVariant } from "@/features/admin/svg-editor/svgEditorFormModel";

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
  });
});
