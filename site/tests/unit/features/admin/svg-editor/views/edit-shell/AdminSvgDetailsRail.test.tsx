import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { descriptorToFormState } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { AdminSvgDetailsRail } from "@/features/admin/svg-editor/views/edit-shell/AdminSvgDetailsRail";

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

vi.mock("@/features/admin/svg-editor/form/SvgEditorForm", () => ({
  SvgEditorForm: () => <div data-testid="mock-svg-editor-form" />,
}));

vi.mock("@/features/admin/svg-editor/lifecycle/DescriptorRevisionPanel", () => ({
  DescriptorRevisionPanel: ({ slug }: { slug: string }) => (
    <div data-testid="mock-revision-panel">{slug}</div>
  ),
}));

function fixedForm() {
  return descriptorToFormState(makeNewBlockDescriptorStub());
}

describe("AdminSvgDetailsRail", () => {
  it("renders product details open when advancedOpen is true", () => {
    render(
      <AdminSvgDetailsRail
        slug="new-block"
        form={fixedForm()}
        advancedOpen
        formIssues={[]}
        canConvertToGlb={false}
        glbSourceSvg={null}
        glbUrl=""
        glbUploading={false}
        glbUploadError={null}
        onFormChange={vi.fn()}
        onStartGlbConversion={vi.fn()}
        onGlbGenerated={vi.fn()}
      />,
    );

    expect(
      screen.getByLabelText("Product details and history"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-revision-panel")).toHaveTextContent(
      "new-block",
    );
    expect(screen.getByText("Product details").closest("details")).toHaveAttribute(
      "open",
    );
    expect(screen.getByTestId("mock-svg-editor-form")).toBeInTheDocument();
    expect(screen.getByText("3D model (optional)")).toBeInTheDocument();
  });

  it("shows issue count badge when form has issues", () => {
    render(
      <AdminSvgDetailsRail
        slug="new-block"
        form={fixedForm()}
        advancedOpen
        formIssues={[{ path: "sku", message: "Required" }]}
        canConvertToGlb={false}
        glbSourceSvg={null}
        glbUrl=""
        glbUploading={false}
        glbUploadError={null}
        onFormChange={vi.fn()}
        onStartGlbConversion={vi.fn()}
        onGlbGenerated={vi.fn()}
      />,
    );
    expect(screen.getByText(/1 issue/i)).toBeInTheDocument();
  });

  it("enables convert for fixed variant when canConvertToGlb", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(
      <AdminSvgDetailsRail
        slug="new-block"
        form={fixedForm()}
        advancedOpen={false}
        formIssues={[]}
        canConvertToGlb
        glbSourceSvg={null}
        glbUrl=""
        glbUploading={false}
        glbUploadError={null}
        onFormChange={vi.fn()}
        onStartGlbConversion={onStart}
        onGlbGenerated={vi.fn()}
      />,
    );

    const convert = screen.getByRole("button", { name: /Convert draft to 3D/i });
    expect(convert).not.toBeDisabled();
    await user.click(convert);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("disables convert and shows helper when cannot convert", () => {
    render(
      <AdminSvgDetailsRail
        slug="new-block"
        form={fixedForm()}
        advancedOpen={false}
        formIssues={[]}
        canConvertToGlb={false}
        glbSourceSvg={null}
        glbUrl=""
        glbUploading={false}
        glbUploadError={null}
        onFormChange={vi.fn()}
        onStartGlbConversion={vi.fn()}
        onGlbGenerated={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Convert draft to 3D/i }),
    ).toBeDisabled();
    expect(
      screen.getByText(/Generate a valid draft preview first/i),
    ).toBeInTheDocument();
  });

  it("shows uploading and upload error states", () => {
    render(
      <AdminSvgDetailsRail
        slug="new-block"
        form={fixedForm()}
        advancedOpen={false}
        formIssues={[]}
        canConvertToGlb
        glbSourceSvg="<svg></svg>"
        glbUrl=""
        glbUploading
        glbUploadError="Upload failed hard"
        onFormChange={vi.fn()}
        onStartGlbConversion={vi.fn()}
        onGlbGenerated={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      /Uploading generated 3D model/i,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Upload failed hard");
  });

  it("shows fixed-only message for non-fixed variants", () => {
    const form = { ...fixedForm(), variant: "parametric" as const };
    render(
      <AdminSvgDetailsRail
        slug="new-block"
        form={form}
        advancedOpen={false}
        formIssues={[]}
        canConvertToGlb={false}
        glbSourceSvg={null}
        glbUrl=""
        glbUploading={false}
        glbUploadError={null}
        onFormChange={vi.fn()}
        onStartGlbConversion={vi.fn()}
        onGlbGenerated={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/3D generation is available for fixed-size products/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Convert draft to 3D/i }),
    ).not.toBeInTheDocument();
  });
});
