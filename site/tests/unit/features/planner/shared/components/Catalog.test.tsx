import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Catalog } from "@/features/planner/shared/components/Catalog";
import type { CatalogItem } from "@/features/planner/shared/catalog/types";

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} />
  ),
}));

const items: CatalogItem[] = [
  {
    id: "desk-1",
    name: "Task Desk",
    category: "desks",
    dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    thumbnail: "/desk.png",
  },
  {
    id: "chair-1",
    name: "Task Chair",
    category: "seating",
    dimensions: { widthMm: 600, depthMm: 600, heightMm: 1100 },
  },
];

describe("shared Catalog", () => {
  it("renders item names and dimensions", () => {
    render(<Catalog items={items} />);
    expect(screen.getByText("Task Desk")).toBeInTheDocument();
    expect(screen.getByText("Task Chair")).toBeInTheDocument();
    expect(screen.getByText("desks")).toBeInTheDocument();
    expect(screen.getByText("1200")).toBeInTheDocument();
    expect(screen.getByText("No Image")).toBeInTheDocument();
  });

  it("invokes onSelect when card clicked", () => {
    const onSelect = vi.fn();
    render(<Catalog items={items} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Task Desk"));
    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });
});
