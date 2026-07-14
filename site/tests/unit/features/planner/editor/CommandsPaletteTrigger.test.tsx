import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommandsPaletteTrigger } from "@/features/planner/editor/CommandsPaletteTrigger";

describe("CommandsPaletteTrigger", () => {
  it("renders a button that opens the palette", () => {
    const onOpen = vi.fn();
    render(<CommandsPaletteTrigger onOpen={onOpen} />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(onOpen).toHaveBeenCalled();
  });
});
