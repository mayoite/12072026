/**
 * TDD for portal svg-catalog index (05-PORT-01, 05-TEST).
 * Also covers 05-PORT-01 a11y follow-up: roving-focus keyboard nav on the
 * card grid (SvgCatalogGrid client component).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import SvgCatalogIndex from "@/app/(site)/portal/svg-catalog/page";
import { SvgCatalogGrid } from "@/app/(site)/portal/svg-catalog/SvgCatalogGrid";
import * as loader from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

vi.mock("@/features/planner/project/catalog/svg/svgBlockDescriptorLoader", () => ({
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

describe("app/(site)/portal/svg-catalog/SvgCatalogGrid.tsx (05-PORT-01 a11y roving-focus)", () => {
  const cards = [
    { slug: "a", variant: "fixed", schemaVersion: "v1", thumbUrl: "https://cdn/a.png" },
    { slug: "b", variant: "fixed", schemaVersion: "v1", thumbUrl: "https://cdn/b.png" },
    { slug: "c", variant: "fixed", schemaVersion: "v1", thumbUrl: "https://cdn/c.png" },
  ];

  it("only one card is tabbable at a time (roving tabindex), starting at index 0", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "0");
    expect(links[1]).toHaveAttribute("tabindex", "-1");
    expect(links[2]).toHaveAttribute("tabindex", "-1");
  });

  it("ArrowRight/ArrowDown moves roving focus forward and updates tabindex", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const list = screen.getByRole("list", { name: /svg catalog blocks/i });
    fireEvent.keyDown(list, { key: "ArrowRight" });
    const links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "-1");
    expect(links[1]).toHaveAttribute("tabindex", "0");
    expect(links[1]).toHaveFocus();
  });

  it("ArrowLeft/ArrowUp moves roving focus backward and clamps at 0", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const list = screen.getByRole("list", { name: /svg catalog blocks/i });
    fireEvent.keyDown(list, { key: "ArrowLeft" });
    const links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "0");
    expect(links[0]).toHaveFocus();
  });

  it("End moves roving focus to the last item; Home moves it back to the first", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const list = screen.getByRole("list", { name: /svg catalog blocks/i });
    fireEvent.keyDown(list, { key: "End" });
    let links = screen.getAllByRole("listitem");
    expect(links[2]).toHaveAttribute("tabindex", "0");
    expect(links[2]).toHaveFocus();

    fireEvent.keyDown(list, { key: "Home" });
    links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "0");
    expect(links[0]).toHaveFocus();
  });
});
