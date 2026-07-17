/**
 * Page tests for /admin/svg-editor (list).
 * RSC await pattern + ListView props.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SvgEditorListPage, {
  dynamic,
  metadata,
} from "@/app/admin/svg-editor/page";
import * as loader from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

vi.mock("@/features/planner/catalog/svg/svgBlockDescriptorLoader", () => ({
  loadAll: vi.fn(),
  BLOCK_DESCRIPTORS_DIR_DEFAULT: "mock-dir",
}));

vi.mock("@/features/admin/svg-editor/publish/svgArtifactStatus.server", () => ({
  readSvgArtifactStatuses: vi.fn(() => ({})),
}));

vi.mock("@/features/admin/svg-editor/lifecycle/catalogLifecycle", () => ({
  readLifecycleManifest: vi.fn(() => ({})),
}));

vi.mock("@/features/admin/svg-editor/views/AdminSvgEditorListView", () => ({
  default: ({
    descriptors,
    refreshedAtLabel,
  }: {
    descriptors: BlockDescriptor[];
    refreshedAtLabel: string;
  }) => (
    <div
      data-testid="list-view"
      data-count={String(descriptors.length)}
      data-label={refreshedAtLabel}
    />
  ),
}));

describe("app/admin/svg-editor/page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loader.loadAll).mockReturnValue([]);
  });

  it("exports force-dynamic and list metadata", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.title).toBe("SVG block editor | Oando Admin");
  });

  it("loads descriptors via loader and renders ListView (RSC)", async () => {
    const mockDescs = [
      { slug: "chaise", variant: "fixed" },
    ] as unknown as BlockDescriptor[];
    vi.mocked(loader.loadAll).mockReturnValue(mockDescs);

    const Page = await SvgEditorListPage();
    render(Page);

    expect(loader.loadAll).toHaveBeenCalledWith({ forceReload: true });
    const view = screen.getByTestId("list-view");
    expect(view).toHaveAttribute("data-count", "1");
    expect(view.getAttribute("data-label")).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
