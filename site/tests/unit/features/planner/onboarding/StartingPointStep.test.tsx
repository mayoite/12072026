import { describe, expect, it, vi } from "vitest";
import type * as lucidereactType0 from "lucide-react";
import { render } from "@testing-library/react";
import React from "react";
import { StartingPointStep } from "@/features/planner/onboarding/StartingPointStep";

vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof lucidereactType0>();
  const icon = (name: string) => (props: any) => React.createElement("span", { "data-testid": `icon-${name}`, ...props });
  return { ...actual, PencilLine: icon("PencilLine") };
});

vi.mock("@/features/planner/ai/spaceSuggest", () => ({ buildShellOnlyLayout: vi.fn(() => []) }));
vi.mock("@/features/planner/store/workspaceStore", () => ({ usePlannerWorkspaceStore: vi.fn(() => ({ applyLayout: vi.fn() })) }));
vi.mock("./projectSetup", () => ({ markProjectSetupCompleteInStorage: vi.fn() }));

describe("StartingPointStep", () => {
  it("should render component StartingPointStep", () => {
    // Basic test
    const { container } = render(React.createElement(StartingPointStep, {} as any));
    expect(container).toBeDefined();
  });
  it("should have function StartingPointStep defined", () => {
    expect(StartingPointStep).toBeTypeOf("function");
  });
});