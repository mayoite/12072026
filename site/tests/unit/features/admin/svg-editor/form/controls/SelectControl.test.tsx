import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SelectControl } from "@/features/admin/svg-editor/form/controls/SelectControl";

describe("SelectControl", () => {
  it("emits selected value", () => {
    const onChange = vi.fn();
    render(
      <SelectControl
        id="field-variant"
        options={[
          { label: "Fixed", value: "fixed" },
          { label: "Configurable", value: "configurable" },
        ]}
        value="fixed"
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "configurable" },
    });
    expect(onChange).toHaveBeenCalledWith("configurable");
  });
});
