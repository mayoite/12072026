import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const loadModelViewer = vi.fn(async () => {});

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

  it("shows admin-friendly empty state when src is blank", async () => {
    const { ModelViewerPreview } = await import(
      "@/features/planner/admin/svg-editor/ModelViewerPreview"
    );

    render(<ModelViewerPreview src="   " />);

    expect(screen.getByTestId("model-viewer-preview-empty")).toBeInTheDocument();
    expect(screen.getByText(/No GLB to preview/i)).toBeInTheDocument();
    expect(screen.queryByTestId("model-viewer-element")).not.toBeInTheDocument();
  });

  it("loads model-viewer in the browser and mounts the custom element", async () => {
    const { ModelViewerPreview } = await import(
      "@/features/planner/admin/svg-editor/ModelViewerPreview"
    );

    render(<ModelViewerPreview src="/catalog-assets/generated/demo.glb" alt="Demo" />);

    expect(screen.getByTestId("model-viewer-preview-loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(loadModelViewer).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("model-viewer-preview")).toHaveAttribute(
        "data-ready",
        "true",
      );
    });
  });

  it("shows admin error when the viewer library fails to load", async () => {
    loadModelViewer.mockRejectedValueOnce(new Error("network down"));

    const { ModelViewerPreview } = await import(
      "@/features/planner/admin/svg-editor/ModelViewerPreview"
    );

    render(<ModelViewerPreview src="/catalog-assets/generated/demo.glb" />);

    await waitFor(() => {
      expect(screen.getByTestId("model-viewer-preview-error")).toBeInTheDocument();
    });

    expect(screen.getByText(/3D preview unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/Could not load the 3D viewer library/i)).toBeInTheDocument();
  });

  it("does not statically import @google/model-viewer (SSR-safe module graph)", async () => {
    // Re-read source contract: loadModelViewer only — no package import string.
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.resolve(
      process.cwd(),
      "features/planner/admin/svg-editor/ModelViewerPreview.tsx",
    );
    // vitest cwd may be repo root or site/ — try both.
    let source: string;
    try {
      source = await fs.readFile(file, "utf8");
    } catch {
      source = await fs.readFile(
        path.resolve(process.cwd(), "site/features/planner/admin/svg-editor/ModelViewerPreview.tsx"),
        "utf8",
      );
    }

    expect(source).not.toMatch(/from\s+["']@google\/model-viewer["']/);
    expect(source).not.toMatch(/import\(["']@google\/model-viewer["']\)/);
    expect(source).toMatch(/loadModelViewer/);
  });
});
