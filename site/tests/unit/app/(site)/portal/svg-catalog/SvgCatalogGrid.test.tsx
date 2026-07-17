/**
 * Name-mirror: app/(site)/portal/svg-catalog/SvgCatalogGrid.tsx
 * Roving-focus grid for portal SVG catalog index (05-PORT-01 a11y).
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import {
  SvgCatalogGrid,
  type SvgCatalogCard,
} from "@/app/(site)/portal/svg-catalog/SvgCatalogGrid";

vi.mock("@/features/planner/catalog/svg/svgPreviewAssets", () => ({
  buildBlockThumbSrcSet: (slug: string) =>
    `https://cdn/${slug}@1x.png 1x, https://cdn/${slug}@2x.png 2x`,
}));

const cards: ReadonlyArray<SvgCatalogCard> = [
  {
    slug: "a",
    variant: "fixed",
    schemaVersion: "1",
    thumbUrl: "https://cdn/a.png",
  },
  {
    slug: "b",
    variant: "fixed",
    schemaVersion: "1",
    thumbUrl: "https://cdn/b.png",
  },
  {
    slug: "c",
    variant: "fixed",
    schemaVersion: "1",
    thumbUrl: "https://cdn/c.png",
    svgUrl: "https://cdn/c.svg",
  },
];

describe("app/(site)/portal/svg-catalog/SvgCatalogGrid.tsx", () => {
  it("renders an accessible list with one card per entry", () => {
    render(<SvgCatalogGrid cards={cards} />);

    expect(
      screen.getByRole("list", { name: /svg catalog blocks/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getAllByText("v1").length).toBeGreaterThan(0);
    // role="listitem" replaces the implicit link role on the anchor.
    expect(screen.getAllByRole("listitem")[0]).toHaveAttribute(
      "href",
      "/portal/svg-catalog/a",
    );
  });

  it("only one card is tabbable at a time, starting at index 0", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "0");
    expect(links[1]).toHaveAttribute("tabindex", "-1");
    expect(links[2]).toHaveAttribute("tabindex", "-1");
  });

  it("ArrowRight/ArrowDown moves roving focus forward", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const list = screen.getByRole("list", { name: /svg catalog blocks/i });
    fireEvent.keyDown(list, { key: "ArrowRight" });

    const links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "-1");
    expect(links[1]).toHaveAttribute("tabindex", "0");
  });

  it("ArrowLeft/ArrowUp clamps roving focus at 0", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const list = screen.getByRole("list", { name: /svg catalog blocks/i });
    fireEvent.keyDown(list, { key: "ArrowLeft" });

    const links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "0");
  });

  it("End moves to last item; Home returns to first", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const list = screen.getByRole("list", { name: /svg catalog blocks/i });

    fireEvent.keyDown(list, { key: "End" });
    let links = screen.getAllByRole("listitem");
    expect(links[2]).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(list, { key: "Home" });
    links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "0");
  });

  it("updates roving tabindex when a card receives focus", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const links = screen.getAllByRole("listitem");
    fireEvent.focus(links[2]!);

    expect(links[0]).toHaveAttribute("tabindex", "-1");
    expect(links[2]).toHaveAttribute("tabindex", "0");
  });

  it("prefers vector svgUrl preview when present", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const vector = screen.getByAltText("c vector preview");
    expect(vector).toHaveAttribute("src", "https://cdn/c.svg");
    expect(vector).toHaveClass("svg-catalog-thumb--vector");
  });

  it("renders raster thumb with srcSet when svgUrl is absent", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const thumb = screen.getByAltText("a thumbnail");
    expect(thumb).toHaveAttribute("src", "https://cdn/a.png");
    expect(thumb).toHaveAttribute(
      "data-srcset",
      "https://cdn/a@1x.png 1x, https://cdn/a@2x.png 2x",
    );
  });

  it("renders an empty list when cards is empty", () => {
    render(<SvgCatalogGrid cards={[]} />);
    const list = screen.getByRole("list", { name: /svg catalog blocks/i });
    expect(list.querySelectorAll('[role="listitem"]')).toHaveLength(0);
  });

  it("ignores unrelated keys without changing tabindex", () => {
    render(<SvgCatalogGrid cards={cards} />);
    const list = screen.getByRole("list", { name: /svg catalog blocks/i });
    fireEvent.keyDown(list, { key: "Enter" });
    const links = screen.getAllByRole("listitem");
    expect(links[0]).toHaveAttribute("tabindex", "0");
    expect(links[1]).toHaveAttribute("tabindex", "-1");
  });
});
