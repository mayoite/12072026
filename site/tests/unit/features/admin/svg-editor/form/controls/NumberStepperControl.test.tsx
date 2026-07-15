import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NumberStepperControl } from "@/features/admin/svg-editor/form/controls/NumberStepperControl";

describe("NumberStepperControl", () => {
  it("decreases by step", () => {
    const onChange = vi.fn();
    render(
      <NumberStepperControl
        id="field-width"
        meta={{ min: 100, max: 200, step: 10, unit: "mm" }}
        value={150}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onChange).toHaveBeenCalledWith(140);
    expect(screen.getByText("mm")).toBeInTheDocument();
  });
});
