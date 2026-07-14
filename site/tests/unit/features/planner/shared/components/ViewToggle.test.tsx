import { describe, expect, it, vi } from "vitest";
import type * as lucidereactType0 from "@phosphor-icons/react";
import { render } from "@testing-library/react";
import React from "react";
import { ViewToggle, useViewToggle } from "@/features/planner/shared/components/ViewToggle";

vi.mock("@phosphor-icons/react", async (importOriginal) => {
  const actual = await importOriginal<typeof lucidereactType0>();
  const icon = (name: string) => (props: any) => React.createElement("span", { "data-testid": `icon-${name}`, ...props });
  return { ...actual, PenTool: icon("PenTool"), Box: icon("Box") };
});

describe("ViewToggle", () => {
  it("should render component ViewToggle", () => {
    // Basic test
    const { container } = render(React.createElement(ViewToggle, {} as any));
    expect(container).toBeDefined();
  });
  it("should have function ViewToggle defined", () => {
    expect(ViewToggle).toBeTypeOf("function"); expect(String(ViewToggle)).toContain('function');
  });
  it("should have function useViewToggle defined", () => {
    expect(useViewToggle).toBeTypeOf("function"); expect(String(useViewToggle)).toContain('function');
  });
  it("should have hook useViewToggle defined", () => {
    expect(useViewToggle).toBeTypeOf("function"); expect(String(useViewToggle)).toContain('function');
  });
});