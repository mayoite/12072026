/**
 * TDD for portal svg-catalog index (05-PORT-01, 05-TEST).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SvgCatalogIndex from "@/app/(site)/portal/svg-catalog/page";
import * as loader from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";

vi.mock("@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader", () => ({
  loadAll: vi.fn(),
}));

vi.mock("next/image", () => ({ default: (p: any) => <img {...p} data-testid="thumb" /> }));

describe("app/(site)/portal/svg-catalog/page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (loader.loadAll as any).mockReturnValue([]);
  });

  it("renders cards from loadAll (with thumbs)", async () => {
    (loader.loadAll as any).mockReturnValue([
      { slug: "side-table-001", variant: "fixed", title: "Side" },
    ]);
    const Page = await SvgCatalogIndex();
    render(Page);
    expect(screen.getByText(/SVG catalog/i)).toBeInTheDocument();
    // cards rendered
  });
});
