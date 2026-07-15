import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ObjectArrayControl } from "@/features/admin/svg-editor/form/controls/ObjectArrayControl";
import type { SvgEditorItemField } from "@/features/admin/svg-editor/form/svgEditorFormModel";

describe("ObjectArrayControl", () => {
  it("renders rows and supports add", () => {
    const onChange = vi.fn();
    const itemFields: readonly SvgEditorItemField[] = [
      { key: "key", label: "Key", kind: "text" },
      { key: "label", label: "Label", kind: "text" },
    ];
    render(
      <ObjectArrayControl
        id="field-roving"
        itemFields={itemFields}
        value={[{ key: "k1", label: "L1" }]}
        onChange={onChange}
      />,
    );
    expect(screen.getByDisplayValue("k1")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
