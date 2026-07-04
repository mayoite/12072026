import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import PortalPlanPageView from "@/features/planner/portal/PortalPlanPageView";

vi.mock("fabric", () => {
  const mockCanvas = {
    add: vi.fn(),
    remove: vi.fn(),
    renderAll: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getWidth: vi.fn(() => 800),
    getHeight: vi.fn(() => 600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getZoom: vi.fn(() => 1),
    setZoom: vi.fn(),
    getObjects: vi.fn(() => []),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
  };
  return {
    fabric: {
      Canvas: vi.fn(() => mockCanvas),
      Rect: vi.fn(() => ({})),
      Circle: vi.fn(() => ({})),
      Path: vi.fn(() => ({})),
      Group: vi.fn(() => ({})),
    }
  };
});

describe("PortalPlanPageView", () => {
  it("should render default component PortalPlanPageView", () => {
    const { container } = render(React.createElement(PortalPlanPageView, {} as any));
    expect(container).toBeDefined();
  });
});