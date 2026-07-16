/**
 * Name-mirror: components/ui/Button
 */
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders a button with children and default primary styles", () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveClass("btn-primary");
    expect(button).toHaveClass("inline-flex");
  });

  it("applies outline, ghost, and link variants", () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("btn-outline");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button", { name: "Ghost" })).toHaveClass("bg-hover-soft");

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole("button", { name: "Link" })).toHaveClass("underline-offset-4");
  });

  it("applies size classes including icon", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button", { name: "Small" }).className).toContain(
      "min-h-[var(--control-height-sm)]",
    );

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button", { name: "Large" }).className).toContain(
      "min-h-[var(--control-height-lg)]",
    );

    rerender(
      <Button size="icon" aria-label="Icon action">
        +
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Icon action" })).toHaveClass("h-11");
    expect(screen.getByRole("button", { name: "Icon action" })).toHaveClass("w-11");
  });

  it("merges custom className and forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="extra-class">
        Ref
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Ref" });
    expect(button).toHaveClass("extra-class");
    expect(ref.current).toBe(button);
  });

  it("invokes onClick and respects disabled", () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(1);

    onClick.mockClear();
    rerender(
      <Button onClick={onClick} disabled>
        Click
      </Button>,
    );
    const disabled = screen.getByRole("button", { name: "Click" });
    expect(disabled).toBeDisabled();
    fireEvent.click(disabled);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders asChild by merging props onto the child element", () => {
    render(
      <Button asChild variant="outline" className="from-button">
        <a href="/planner">Open planner</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Open planner" });
    expect(link).toHaveAttribute("href", "/planner");
    expect(link).toHaveClass("btn-outline");
    expect(link).toHaveClass("from-button");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
