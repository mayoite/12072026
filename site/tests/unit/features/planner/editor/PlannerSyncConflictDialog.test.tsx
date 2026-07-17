import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlannerSyncConflictDialog } from "@/features/planner/editor/PlannerSyncConflictDialog";

describe("PlannerSyncConflictDialog", () => {
  it("offers keep local and keep cloud", async () => {
    const user = userEvent.setup();
    const onKeepLocal = vi.fn();
    const onKeepCloud = vi.fn();
    render(
      <PlannerSyncConflictDialog
        open
        onKeepLocal={onKeepLocal}
        onKeepCloud={onKeepCloud}
      />,
    );
    await user.click(screen.getByRole("button", { name: /keep local/i }));
    expect(onKeepLocal).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /keep cloud/i }));
    expect(onKeepCloud).toHaveBeenCalled();
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <PlannerSyncConflictDialog
        open={false}
        onKeepLocal={vi.fn()}
        onKeepCloud={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("dismisses on Escape when onDismiss is provided", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <PlannerSyncConflictDialog
        open
        onKeepLocal={vi.fn()}
        onKeepCloud={vi.fn()}
        onDismiss={onDismiss}
      />,
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("moves initial focus into the dialog", async () => {
    render(
      <PlannerSyncConflictDialog
        open
        onKeepLocal={vi.fn()}
        onKeepCloud={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );
    const dialog = screen.getByRole("alertdialog");
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });
});
