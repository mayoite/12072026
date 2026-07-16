import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BottomSheet } from "@/features/planner/ui/BottomSheet";

describe("BottomSheet", () => {
  afterEach(() => cleanup());

  it("renders dialog content when open", () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} title="Filters">
        <p>Sheet body</p>
      </BottomSheet>,
    );
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Filters")).toBeDefined();
    expect(screen.getByText("Sheet body")).toBeDefined();
  });

  it("closes on overlay click and Escape", () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} title="Sheet">
        body
      </BottomSheet>,
    );
    fireEvent.click(screen.getByLabelText("Close bottom sheet"));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
