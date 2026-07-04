import { describe, expect, it, vi } from "vitest";
import type * as lucidereactType0 from "lucide-react";
import { render } from "@testing-library/react";
import React from "react";
import { ProjectSetupStep } from "@/features/planner/onboarding/ProjectSetupStep";

vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof lucidereactType0>();
  const icon = (name: string) => (props: any) => React.createElement("span", { "data-testid": `icon-${name}`, ...props });
  return { ...actual, ArrowRight: icon("ArrowRight"), Building2: icon("Building2"), MapPin: icon("MapPin"), Ruler: icon("Ruler"), Users: icon("Users") };
});

vi.mock("@/features/planner/ai/spaceSuggest", () => ({ estimateRoomMm: vi.fn(() => ({ width: 6000, depth: 4000 })) }));
vi.mock("@/features/planner/lib/canvas", () => ({ PLANNER_MAX_CANVAS_MM: 20000, PLANNER_MAX_CANVAS_METERS: 20 }));

describe("ProjectSetupStep", () => {
  it("should render component ProjectSetupStep", () => {
    // Basic test
    const { container } = render(React.createElement(ProjectSetupStep, {} as any));
    expect(container).toBeDefined();
  });
  it("should have function ProjectSetupStep defined", () => {
    expect(ProjectSetupStep).toBeTypeOf("function");
  });
});