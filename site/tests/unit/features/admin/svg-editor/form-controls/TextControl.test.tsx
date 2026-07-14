import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TextControl } from "@/features/admin/svg-editor/form-controls/TextControl";
import type { SvgEditorFieldMeta } from "@/features/admin/svg-editor/svgEditorFormModel";

describe("TextControl", () => {
  it("renders value and emits onChange", () => {
    const onChange = vi.fn();
    const meta: SvgEditorFieldMeta = {
      path: "sku",
      label: "SKU",
      kind: "text",
      group: "identity",
      placeholder: "SKU code",
    };
    render(
      <TextControl id="field-sku" meta={meta} value="OFL-001" onChange={onChange} />,
    );
    fireEvent.change(screen.getByDisplayValue("OFL-001"), {
      target: { value: "OFL-002" },
    });
    expect(onChange).toHaveBeenCalledWith("OFL-002");
  });
});
