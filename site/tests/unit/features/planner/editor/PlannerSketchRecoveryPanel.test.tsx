import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PlannerSketchRecoveryPanel } from "@/features/planner/editor/PlannerSketchRecoveryPanel";

describe("PlannerSketchRecoveryPanel", () => {
  it("invokes accept and reject handlers from preview state", () => {
    const onTraceManual = vi.fn();
    const onRetry = vi.fn();
    const onAccept = vi.fn();
    const onReject = vi.fn();
    const onDismiss = vi.fn();

    render(
      <PlannerSketchRecoveryPanel
        recovery={{
          status: "preview",
          fileName: "sketch.png",
          generatedDraftJson: "{}",
          previousDraftJson: "{}",
          warnings: ["Check the wall length."],
        }}
        onTraceManual={onTraceManual}
        onRetry={onRetry}
        onAccept={onAccept}
        onReject={onReject}
        onDismiss={onDismiss}
      />,
    );

    expect(screen.getByRole("heading", { name: "Preview ready: sketch.png" })).toBeInTheDocument();
    expect(screen.getByText("Check the wall length.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Accept preview" }));
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onReject).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Reject preview" }));
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onTraceManual).not.toHaveBeenCalled();
    expect(onRetry).not.toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("invokes trace and retry handlers from fallback state", () => {
    const onTraceManual = vi.fn();
    const onRetry = vi.fn();

    render(
      <PlannerSketchRecoveryPanel
        recovery={{
          status: "fallback",
          fileName: "scan.jpg",
          message: "Automatic conversion failed.",
        }}
        onTraceManual={onTraceManual}
        onRetry={onRetry}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );

    expect(screen.getByText("Automatic conversion failed.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Trace manually" }));
    fireEvent.click(screen.getByRole("button", { name: "Retry conversion" }));

    expect(onTraceManual).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("invokes dismiss from accepted state", () => {
    const onDismiss = vi.fn();

    render(
      <PlannerSketchRecoveryPanel
        recovery={{ status: "accepted", fileName: "sketch.png" }}
        onTraceManual={vi.fn()}
        onRetry={vi.fn()}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onDismiss={onDismiss}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when idle", () => {
    render(
      <PlannerSketchRecoveryPanel
        recovery={{ status: "idle" }}
        onTraceManual={vi.fn()}
        onRetry={vi.fn()}
        onAccept={vi.fn()}
        onReject={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );

    expect(screen.queryByText(/Sketch recovery/i)).not.toBeInTheDocument();
  });
});
