/**
 * TDD page tests for /admin/svg-editor (list)
 * 04-ADMIN-01 + integration.
 * Uses RSC await pattern + ListView props.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SvgEditorListPage from "@/app/admin/svg-editor/page";
import * as loader from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

vi.mock("@/features/planner/project/catalog/svg/svgBlockDescriptorLoader", () => ({
  loadAll: vi.fn(),
  BLOCK_DESCRIPTORS_DIR_DEFAULT: "mock-dir",
}));

vi.mock("@/features/planner/admin/svg-editor/AdminSvgEditorListView", () => ({
  default: ({ descriptors, refreshedAtLabel }: { descriptors: any[]; refreshedAtLabel: string }) => (
    <div data-testid="list-view" data-count={descriptors.length} data-label={refreshedAtLabel} />
  ),
}));

describe("app/admin/svg-editor/page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (loader.loadAll as any).mockReturnValue([]);
  });

  it("loads descriptors via loader and renders ListView (RSC)", async () => {
    const mockDescs = [{ slug: "chaise", variant: "fixed" }];
    (loader.loadAll as any).mockReturnValue(mockDescs);

    const Page = await SvgEditorListPage();
    render(Page);

    expect(loader.loadAll).toHaveBeenCalled();
    const view = screen.getByTestId("list-view");
    expect(view).toHaveAttribute("data-count", "1");
  });
});
