import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MultiSelectControl } from "@/features/admin/svg-editor/form/controls/MultiSelectControl";

describe("MultiSelectControl", () => {
  it("toggles options preserving order", () => {
    const onChange = vi.fn();
    render(
      <MultiSelectControl
        id="field-mount"
        options={[
          { label: "Floor", value: "floor" },
          { label: "Wall", value: "wall" },
        ]}
        value={["wall"]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]!);
    expect(onChange).toHaveBeenCalledWith(["floor", "wall"]);
  });
});
