import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ZoomControl } from "@/features/planner/canvas-fabric/components/ZoomControl";

describe("ZoomControl", () => {
  it("renders zoom percentage and handles zoom in/out changes", () => {
    const mockOnZoomChange = vi.fn();
    render(<ZoomControl zoom={100} onZoomChange={mockOnZoomChange} />);

    expect(screen.getByText("100%")).toBeInTheDocument();

    const zoomInBtn = screen.getByLabelText("Zoom in");
    fireEvent.click(zoomInBtn);
    expect(mockOnZoomChange).toHaveBeenCalledWith(110);

    const zoomOutBtn = screen.getByLabelText("Zoom out");
    fireEvent.click(zoomOutBtn);
    expect(mockOnZoomChange).toHaveBeenCalledWith(90);
  });

  it("prevents zooming out below 20%", () => {
    const mockOnZoomChange = vi.fn();
    render(<ZoomControl zoom={20} onZoomChange={mockOnZoomChange} />);

    const zoomOutBtn = screen.getByLabelText("Zoom out");
    fireEvent.click(zoomOutBtn);
    expect(mockOnZoomChange).not.toHaveBeenCalled();
  });

  it("prevents zooming in above 150%", () => {
    const mockOnZoomChange = vi.fn();
    render(<ZoomControl zoom={150} onZoomChange={mockOnZoomChange} />);

    const zoomInBtn = screen.getByLabelText("Zoom in");
    fireEvent.click(zoomInBtn);
    expect(mockOnZoomChange).not.toHaveBeenCalled();
  });
});
