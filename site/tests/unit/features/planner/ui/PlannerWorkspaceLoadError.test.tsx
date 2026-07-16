import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlannerWorkspaceLoadError } from "@/features/planner/ui/PlannerWorkspaceLoadError";

describe("PlannerWorkspaceLoadError", () => {
  it("renders alert and retry", () => {
    const onRetry = vi.fn();
    render(
      <PlannerWorkspaceLoadError message="Chunk failed" onRetry={onRetry} />,
    );
    expect(screen.getByTestId("planner-workspace-load-error")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Workspace unavailable/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));
    expect(onRetry).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /Back to planner home/i })).toHaveAttribute(
      "href",
      "/planner/",
    );
  });
});
