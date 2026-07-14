import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommandPalette } from "@/features/planner/editor/CommandPalette";

describe("CommandPalette", () => {
  it("renders when open with search field", () => {
    render(
      <CommandPalette
        open
        onOpenChange={vi.fn()}
        handlers={{
          setTool: vi.fn(),
          toggleView: vi.fn(),
          openPalette: vi.fn(),
          undo: vi.fn(),
          redo: vi.fn(),
          cancel: vi.fn(),
          zoomReset: vi.fn(),
        }}
      />,
    );
    const input =
      screen.queryByRole("searchbox") ||
      screen.queryByRole("textbox") ||
      screen.queryByRole("combobox");
    expect(input).not.toBeNull();
  });
});
