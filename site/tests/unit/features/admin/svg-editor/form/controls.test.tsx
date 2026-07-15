/**
 * Unit tests for no-code SVG editor form-controls (A4).
 * RTL render + fireEvent; pure client controls, no catalog I/O.
 */

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { TextControl } from "@/features/admin/svg-editor/form/controls/TextControl";
import { SelectControl } from "@/features/admin/svg-editor/form/controls/SelectControl";
import { NumberStepperControl } from "@/features/admin/svg-editor/form/controls/NumberStepperControl";
import { MultiSelectControl } from "@/features/admin/svg-editor/form/controls/MultiSelectControl";
import { StringListControl } from "@/features/admin/svg-editor/form/controls/StringListControl";
import { ObjectArrayControl } from "@/features/admin/svg-editor/form/controls/ObjectArrayControl";
import { TokenRowsControl } from "@/features/admin/svg-editor/form/controls/TokenRowsControl";
import type { SvgEditorFieldMeta, SvgEditorItemField } from "@/features/admin/svg-editor/form/svgEditorFormModel";
import type { FormTokenRow } from "@/features/admin/svg-editor/form/svgEditorFormState";

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
    const input = screen.getByDisplayValue("OFL-001");
    expect(input).toHaveAttribute("placeholder", "SKU code");
    fireEvent.change(input, { target: { value: "OFL-002" } });
    expect(onChange).toHaveBeenCalledWith("OFL-002");
  });
});

describe("SelectControl", () => {
  it("renders options and emits selected value", () => {
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
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "configurable" } });
    expect(onChange).toHaveBeenCalledWith("configurable");
  });
});

describe("NumberStepperControl", () => {
  const meta = { min: 100, max: 200, step: 10, unit: "mm" };

  it("decreases and increases by step within clamp", () => {
    const onChange = vi.fn();
    render(
      <NumberStepperControl id="field-width" meta={meta} value={150} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onChange).toHaveBeenCalledWith(140);
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(onChange).toHaveBeenCalledWith(160);
    expect(screen.getByText("mm")).toBeInTheDocument();
  });

  it("clamps typed input to min/max", () => {
    const onChange = vi.fn();
    render(
      <NumberStepperControl id="field-width" meta={meta} value={150} onChange={onChange} />,
    );
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "50" } });
    expect(onChange).toHaveBeenCalledWith(100);
    fireEvent.change(input, { target: { value: "999" } });
    expect(onChange).toHaveBeenCalledWith(200);
  });

  it("clamps decrease below min and increase above max", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <NumberStepperControl id="field-width" meta={meta} value={100} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onChange).toHaveBeenCalledWith(100);

    rerender(
      <NumberStepperControl id="field-width" meta={meta} value={200} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(onChange).toHaveBeenCalledWith(200);
  });
});

describe("MultiSelectControl", () => {
  it("toggles options and preserves option order", () => {
    const onChange = vi.fn();
    render(
      <MultiSelectControl
        id="field-mount"
        options={[
          { label: "Floor", value: "floor" },
          { label: "Wall", value: "wall" },
          { label: "Ceiling", value: "ceiling" },
        ]}
        value={["wall"]}
        onChange={onChange}
      />,
    );
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]!);
    expect(onChange).toHaveBeenCalledWith(["floor", "wall"]);
    fireEvent.click(checkboxes[1]!);
    expect(onChange).toHaveBeenCalledWith([]);
  });
});

describe("StringListControl", () => {
  it("adds, edits, and removes items", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <StringListControl
        id="field-sizes"
        value={["S"]}
        placeholder="size"
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByDisplayValue("S"), { target: { value: "M" } });
    expect(onChange).toHaveBeenCalledWith(["M"]);

    fireEvent.click(screen.getByRole("button", { name: "Add option" }));
    expect(onChange).toHaveBeenCalledWith(["S", ""]);

    rerender(
      <StringListControl
        id="field-sizes"
        value={["S", "L"]}
        placeholder="size"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[0]!);
    expect(onChange).toHaveBeenCalledWith(["L"]);
  });
});

describe("ObjectArrayControl", () => {
  type FocusRow = { key: string; focusSelector: string; label: string; offset?: { x: number; y: number } };

  const itemFields: readonly SvgEditorItemField[] = [
    { key: "key", label: "Key", kind: "text", placeholder: "frame" },
    { key: "offset.x", label: "Offset X", kind: "number", min: 0, step: 1 },
    {
      key: "plane",
      label: "Plane",
      kind: "select",
      options: [
        { label: "Floor", value: "floor" },
        { label: "Wall", value: "wall" },
      ],
    },
  ];

  it("edits nested paths, reorders, adds, and removes rows", () => {
    const onChange = vi.fn();
    const value: FocusRow[] = [
      { key: "a", focusSelector: "[data-focus=a]", label: "A", offset: { x: 1, y: 2 } },
      { key: "b", focusSelector: "[data-focus=b]", label: "B", offset: { x: 3, y: 4 } },
    ];
    const { rerender } = render(
      <ObjectArrayControl id="field-focus" itemFields={itemFields} value={value} onChange={onChange} />,
    );

    fireEvent.change(screen.getByDisplayValue("a"), { target: { value: "frame" } });
    expect(onChange).toHaveBeenCalledWith([
      { key: "frame", focusSelector: "[data-focus=a]", label: "A", offset: { x: 1, y: 2 } },
      value[1],
    ]);

    fireEvent.change(screen.getByDisplayValue("1"), { target: { value: "9" } });
    expect(onChange.mock.calls.at(-1)?.[0]?.[0]).toMatchObject({
      offset: { x: 9, y: 2 },
    });

    fireEvent.change(screen.getAllByRole("combobox")[0]!, { target: { value: "wall" } });
    expect(onChange.mock.calls.at(-1)?.[0]?.[0]).toMatchObject({ plane: "wall" });

    fireEvent.click(screen.getAllByRole("button", { name: "Move down" })[0]!);
    expect(onChange.mock.calls.at(-1)?.[0]?.map((r: FocusRow) => r.key)).toEqual(["b", "a"]);

    fireEvent.click(screen.getAllByRole("button", { name: "Move up" })[1]!);
    expect(onChange.mock.calls.at(-1)?.[0]?.map((r: FocusRow) => r.key)).toEqual(["b", "a"]);

    fireEvent.click(screen.getByRole("button", { name: "Add row" }));
    const added = onChange.mock.calls.at(-1)?.[0] as FocusRow[];
    expect(added).toHaveLength(3);
    expect(added[2]).toMatchObject({ key: "", plane: "floor" });
    expect(added[2]).toMatchObject({ offset: { x: 0 } });

    rerender(
      <ObjectArrayControl id="field-focus" itemFields={itemFields} value={value} onChange={onChange} />,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[0]!);
    expect(onChange.mock.calls.at(-1)?.[0]).toEqual([value[1]]);
  });

  it("ignores move past edges", () => {
    const onChange = vi.fn();
    const value: FocusRow[] = [{ key: "only", focusSelector: "[data-focus=o]", label: "Only" }];
    render(
      <ObjectArrayControl id="field-one" itemFields={itemFields} value={value} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Move up" }));
    fireEvent.click(screen.getByRole("button", { name: "Move down" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("TokenRowsControl", () => {
  const meta = {
    tokenKeyOptions: [
      { label: "currentColor", value: "currentColor" },
      { label: "Fill", value: "--color-fill" },
    ],
    tokenValueOptions: [
      { label: "currentColor", value: "currentColor" },
      { label: "Surface", value: "var(--color-surface-raised)" },
    ],
  };

  it("edits, adds, and removes curated token rows", () => {
    const onChange = vi.fn();
    const value: FormTokenRow[] = [{ key: "currentColor", value: "currentColor" }];
    const { rerender } = render(
      <TokenRowsControl id="field-tokens" meta={meta} value={value} onChange={onChange} />,
    );

    fireEvent.change(screen.getByLabelText("Token key"), {
      target: { value: "--color-fill" },
    });
    expect(onChange).toHaveBeenCalledWith([{ key: "--color-fill", value: "currentColor" }]);

    fireEvent.change(screen.getByLabelText("Token value"), {
      target: { value: "var(--color-surface-raised)" },
    });
    expect(onChange).toHaveBeenCalledWith([
      { key: "currentColor", value: "var(--color-surface-raised)" },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Add token" }));
    expect(onChange).toHaveBeenCalledWith([
      value[0],
      { key: "currentColor", value: "currentColor" },
    ]);

    rerender(
      <TokenRowsControl
        id="field-tokens"
        meta={meta}
        value={[value[0]!, { key: "--color-fill", value: "currentColor" }]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[1]!);
    expect(onChange.mock.calls.at(-1)?.[0]).toEqual([value[0]]);
  });
});
