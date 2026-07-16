import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { DescriptorRevisionPanel } from "@/features/admin/svg-editor/lifecycle/DescriptorRevisionPanel";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
  browserApiFetch: vi.fn(async () => ({
    ok: true,
    json: async () => ({ revisions: [], audit: [] }),
  })),
}));

describe("DescriptorRevisionPanel", () => {
  it("mounts for a product slug and finishes loading", async () => {
    const { container } = render(<DescriptorRevisionPanel slug="side-table-001" />);
    await waitFor(() => {
      expect(
        screen.getByText("No versioned revisions on disk yet."),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Revision history")).toBeInTheDocument();
    expect(container.querySelector("[aria-label='Revision history'] [style]")).toBeNull();
  });
});
