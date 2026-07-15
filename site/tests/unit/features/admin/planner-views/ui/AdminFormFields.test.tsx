import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import {
  AdminFieldGroup,
  AdminField,
  AdminTextInput,
  AdminNumberInput,
  AdminTextarea,
  AdminSelect,
  AdminCheckbox,
} from "@/features/admin/ui/AdminFormFields";

describe("AdminFormFields Components", () => {
  it("renders AdminFieldGroup with title and children", () => {
    render(
      <AdminFieldGroup title="General Settings">
        <div data-testid="child">Field</div>
      </AdminFieldGroup>
    );

    expect(screen.getByText("General Settings")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders AdminField with label, hint, and children", () => {
    render(
      <AdminField label="Username" hint="Enter unique username" className="custom-class">
        <input data-testid="input" />
      </AdminField>
    );

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Enter unique username")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
    
    const label = screen.getByText("Username").closest("label");
    expect(label).toHaveClass("custom-class");
  });

  it("renders AdminTextInput and forwards attributes", () => {
    render(<AdminTextInput placeholder="Type here..." className="my-input" defaultValue="hello" />);
    const input = screen.getByPlaceholderText("Type here...");
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("admin-field__input");
    expect(input).toHaveClass("my-input");
    expect(input).toHaveValue("hello");
  });

  it("renders AdminNumberInput with number type and attributes", () => {
    render(<AdminNumberInput placeholder="Enter quantity" defaultValue={10} />);
    const input = screen.getByPlaceholderText("Enter quantity");
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveValue(10);
  });

  it("renders AdminTextarea and forwards attributes", () => {
    render(<AdminTextarea placeholder="Describe..." className="my-textarea" defaultValue="line 1" />);
    const textarea = screen.getByPlaceholderText("Describe...");
    
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass("min-h-[5.5rem]");
    expect(textarea).toHaveClass("font-mono");
    expect(textarea).toHaveClass("text-xs");
    expect(textarea).toHaveClass("my-textarea");
    expect(textarea).toHaveValue("line 1");
  });

  it("renders AdminSelect and forwards children and attributes", () => {
    render(
      <AdminSelect defaultValue="b" className="my-select">
        <option value="a">A</option>
        <option value="b">B</option>
      </AdminSelect>
    );
    const select = screen.getByRole("combobox");
    
    expect(select).toBeInTheDocument();
    expect(select).toHaveClass("my-select");
    expect(select).toHaveValue("b");
  });

  it("renders AdminCheckbox and handles change events", () => {
    const handleChange = vi.fn();
    render(<AdminCheckbox label="Enabled" checked={false} onChange={handleChange} />);
    
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("renders disabled AdminCheckbox", () => {
    render(<AdminCheckbox label="Enabled" checked={true} onChange={() => {}} disabled />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });
});
