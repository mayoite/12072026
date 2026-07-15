import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TokenRowsControl } from "@/features/admin/svg-editor/form/controls/TokenRowsControl";

describe("TokenRowsControl", () => {
  it("renders token rows and emits edits", () => {
    const onChange = vi.fn();
    render(
      <TokenRowsControl
        id="field-tokens"
        meta={{
          tokenKeyOptions: [
            { label: "currentColor", value: "currentColor" },
            { label: "fill", value: "fill" },
          ],
          tokenValueOptions: [
            { label: "currentColor", value: "currentColor" },
            { label: "var surface", value: "var(--color-surface-raised)" },
          ],
        }}
        value={[{ key: "currentColor", value: "currentColor" }]}
        onChange={onChange}
      />,
    );
    const keySelect = screen.getByLabelText("Token key");
    fireEvent.change(keySelect, { target: { value: "fill" } });
    expect(onChange).toHaveBeenCalledWith([{ key: "fill", value: "currentColor" }]);
  });
});
