import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ExactRoomPanel } from "@/features/planner/editor/ExactRoomPanel";

describe("ExactRoomPanel", () => {
  it("creates a room from exact display-unit values", () => {
    const onCreate = vi.fn();
    render(<ExactRoomPanel displayUnit="cm" onCreate={onCreate} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Width (cm)"), { target: { value: "625" } });
    fireEvent.change(screen.getByLabelText("Depth (cm)"), { target: { value: "450" } });
    fireEvent.change(screen.getByLabelText("Wall (cm)"), { target: { value: "20" } });
    fireEvent.click(screen.getByRole("button", { name: "Create room" }));

    expect(onCreate).toHaveBeenCalledWith({
      widthMm: 6250,
      depthMm: 4500,
      wallThicknessMm: 200,
    });
  });

  it("rejects unsafe dimensions and supports cancel", () => {
    const onCreate = vi.fn();
    const onCancel = vi.fn();
    render(<ExactRoomPanel displayUnit="m" onCreate={onCreate} onCancel={onCancel} />);

    fireEvent.change(screen.getByLabelText("Width (m)"), { target: { value: "0.2" } });
    fireEvent.click(screen.getByRole("button", { name: "Create room" }));
    expect(screen.getByRole("alert")).toHaveTextContent("at least 1 m");
    expect(onCreate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
