import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { StringListControl } from "@/features/admin/svg-editor/form-controls/StringListControl";

describe("StringListControl", () => {
  it("renders entries and supports add", () => {
    const onChange = vi.fn();
    render(
      <StringListControl id="field-tags" value={["a"]} onChange={onChange} />,
    );
    expect(screen.getByDisplayValue("a")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(onChange).toHaveBeenCalled();
  });
});
