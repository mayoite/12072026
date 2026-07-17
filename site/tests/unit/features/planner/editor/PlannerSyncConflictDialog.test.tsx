import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlannerSyncConflictDialog } from "@/features/planner/editor/PlannerSyncConflictDialog";
import {
  buildPlanConflictDetails,
  conflictDetailsForDialog,
} from "@/features/planner/persistence/cloudPlanHydration";

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
    expect(onKeepLocal).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: /keep cloud/i }));
    expect(onKeepCloud).toHaveBeenCalledTimes(1);
  });

  it("wires keep-local / keep-cloud test ids for host automation", () => {
    render(
      <PlannerSyncConflictDialog
        open
        onKeepLocal={vi.fn()}
        onKeepCloud={vi.fn()}
      />,
    );
    expect(screen.getByTestId("conflict-keep-local")).toHaveTextContent(/keep local/i);
    expect(screen.getByTestId("conflict-keep-cloud")).toHaveTextContent(/keep cloud/i);
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

  it("shows timestamps and content hashes from pure conflict details", () => {
    const pure = buildPlanConflictDetails(
      {
        contentHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        updatedAt: "2026-01-02T10:00:00.000Z",
      },
      {
        contentHash: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        updatedAt: "2026-01-03T11:00:00.000Z",
      },
    );
    render(
      <PlannerSyncConflictDialog
        open
        details={conflictDetailsForDialog(pure)}
        onKeepLocal={vi.fn()}
        onKeepCloud={vi.fn()}
      />,
    );
    expect(screen.getByTestId("conflict-local-updated")).toHaveTextContent(
      "2026-01-02T10:00:00.000Z",
    );
    expect(screen.getByTestId("conflict-remote-updated")).toHaveTextContent(
      "2026-01-03T11:00:00.000Z",
    );
    expect(screen.getByTestId("conflict-local-hash")).toHaveAttribute(
      "title",
      pure.localHash,
    );
    expect(screen.getByTestId("conflict-remote-hash")).toHaveAttribute(
      "title",
      pure.remoteHash,
    );
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

  it("does not dismiss or resolve while busy", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onKeepLocal = vi.fn();
    const onKeepCloud = vi.fn();
    render(
      <PlannerSyncConflictDialog
        open
        busy
        onKeepLocal={onKeepLocal}
        onKeepCloud={onKeepCloud}
        onDismiss={onDismiss}
      />,
    );
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent(/applying your choice/i);

    expect(screen.getByRole("button", { name: /keep local/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /keep cloud/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /close conflict dialog/i })).toBeDisabled();

    await user.keyboard("{Escape}");
    expect(onDismiss).not.toHaveBeenCalled();
    expect(onKeepLocal).not.toHaveBeenCalled();
    expect(onKeepCloud).not.toHaveBeenCalled();
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
