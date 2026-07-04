import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { PlannerSaveIndicator } from "@/features/planner/ui/PlannerSaveIndicator";

describe("PlannerSaveIndicator", () => {
  it("renders saving state", () => {
    render(<PlannerSaveIndicator status="saving" lastSavedAt={null} />);
    expect(screen.getByText("Saving…")).toBeDefined();
  });

  it("renders saved state with relative time formatting", () => {
    const pastDate = new Date(Date.now() - 30 * 1000).toISOString(); // 30s ago
    render(<PlannerSaveIndicator status="saved" lastSavedAt={pastDate} />);
    expect(screen.getByText(/Saved (30s|29s|31s) ago/)).toBeDefined();
  });

  it("renders error state with retry button", () => {
    const onRetry = vi.fn();
    render(<PlannerSaveIndicator status="error" lastSavedAt={null} onRetry={onRetry} />);
    expect(screen.getByText("Save failed")).toBeDefined();
    
    const btn = screen.getByRole("button", { name: /Save failed/ });
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders sync failed state", () => {
    const envelopeStatus = {
      localSaveState: "saved_local" as const,
      syncState: "sync_failed" as const,
    };
    render(<PlannerSaveIndicator status="saved" lastSavedAt={null} envelopeStatus={envelopeStatus} />);
    expect(screen.getByText("Sync failed")).toBeDefined();
  });
});
