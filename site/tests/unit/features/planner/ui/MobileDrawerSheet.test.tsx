import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { MobileDrawerSheet } from "@/features/planner/ui/MobileDrawerSheet";

vi.mock("vaul", () => {
  return {
    Drawer: {
      Root: ({ children, open }: any) => <div data-testid="drawer-root" data-open={open}>{children}</div>,
      Trigger: ({ children }: any) => <div data-testid="drawer-trigger">{children}</div>,
      Portal: ({ children }: any) => <div data-testid="drawer-portal">{children}</div>,
      Overlay: ({ className }: any) => <div className={className} data-testid="drawer-overlay" />,
      Content: ({ children, "aria-label": ariaLabel }: any) => (
        <div data-testid="drawer-content" aria-label={ariaLabel}>
          {children}
        </div>
      ),
      Title: ({ children }: any) => <div data-testid="drawer-title">{children}</div>,
    },
  };
});

describe("MobileDrawerSheet", () => {
  it("renders trigger and content when open", () => {
    const onOpenChange = vi.fn();
    render(
      <MobileDrawerSheet
        open={true}
        onOpenChange={onOpenChange}
        title="Test Drawer"
        trigger={<button>Trigger Btn</button>}
      >
        <div>Drawer Content</div>
      </MobileDrawerSheet>
    );

    expect(screen.getByText("Trigger Btn")).toBeDefined();
    expect(screen.getByText("Drawer Content")).toBeDefined();
    expect(screen.getByText("Test Drawer")).toBeDefined();
    expect(screen.getByTestId("drawer-root").getAttribute("data-open")).toBe("true");
  });
});
