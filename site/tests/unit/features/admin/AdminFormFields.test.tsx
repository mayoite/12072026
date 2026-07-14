import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  AdminCheckbox,
  AdminField,
  AdminFieldGroup,
  AdminNumberInput,
  AdminSelect,
  AdminTextInput,
  AdminTextarea,
} from "@/features/admin/AdminFormFields";

describe("AdminFormFields (name-mirror)", () => {
  it("renders group, field, inputs, and checkbox", () => {
    const onChange = vi.fn();
    render(
      <AdminFieldGroup title="General">
        <AdminField label="Name" hint="hint">
          <AdminTextInput defaultValue="hello" />
        </AdminField>
        <AdminNumberInput defaultValue={3} aria-label="qty" />
        <AdminTextarea defaultValue="note" aria-label="notes" />
        <AdminSelect defaultValue="a" aria-label="pick">
          <option value="a">A</option>
        </AdminSelect>
        <AdminCheckbox label="Visible" checked={false} onChange={onChange} />
      </AdminFieldGroup>,
    );
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
