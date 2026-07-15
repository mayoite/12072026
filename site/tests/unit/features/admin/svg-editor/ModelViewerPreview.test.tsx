import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

const loadModelViewer = vi.fn(async () => undefined);

vi.mock("@/lib/ui/loadModelViewer", () => ({
  loadModelViewer: (...args: unknown[]) => loadModelViewer(...args),
}));

describe("ModelViewerPreview", () => {
  beforeEach(() => {
    loadModelViewer.mockReset();
    loadModelViewer.mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders empty or model viewer host", async () => {
    const { ModelViewerPreview } = await import(
      "@/features/admin/svg-editor/ModelViewerPreview"
    );
    const { container } = render(<ModelViewerPreview src="   " />);
    expect(screen.getByTestId("model-viewer-preview-empty")).toBeInTheDocument();
    expect(container.querySelector("[data-testid='model-viewer-preview-empty'] [style], [data-testid='model-viewer-preview-empty'][style]")).toBeNull();
    cleanup();
    render(<ModelViewerPreview src="/models/demo.glb" />);
    await waitFor(() => expect(loadModelViewer).toHaveBeenCalled());
  });
});
