import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { PlannerSaveIndicator } from "@/features/planner/ui/PlannerSaveIndicator";

describe("PlannerSaveIndicator", () => {
  it("renders local saving state", () => {
    render(<PlannerSaveIndicator status="saving" lastSavedAt={null} />);
    expect(screen.getByText("Saving locally…")).toBeDefined();
  });

  it("renders saved state with relative time formatting", () => {
    const pastDate = new Date(Date.now() - 30 * 1000).toISOString();
    render(<PlannerSaveIndicator status="saved" lastSavedAt={pastDate} />);
    expect(screen.getByText(/Saved locally (30s|29s|31s) ago/)).toBeDefined();
  });

  it("renders guest-local wording when guestMode", () => {
    const pastDate = new Date(Date.now() - 30 * 1000).toISOString();
    render(
      <PlannerSaveIndicator status="saved" lastSavedAt={pastDate} guestMode />,
    );
    expect(screen.getByText(/Draft saved locally/)).toBeDefined();
  });

  it("renders error state with retry button", () => {
    const onRetry = vi.fn();
    render(
      <PlannerSaveIndicator status="error" lastSavedAt={null} onRetry={onRetry} />,
    );
    expect(screen.getByText("Local save failed")).toBeDefined();

    const btn = screen.getByRole("button", { name: /Retry/i });
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders sync failed state when not guest", () => {
    const envelopeStatus = {
      localSaveState: "saved_local" as const,
      syncState: "sync_failed" as const,
    };
    render(
      <PlannerSaveIndicator
        status="saved"
        lastSavedAt={null}
        envelopeStatus={envelopeStatus}
      />,
    );
    expect(screen.getByText("Sync failed")).toBeDefined();
  });
});
