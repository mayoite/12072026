import { describe, expect, it, vi } from "vitest";
import type * as lucidereactType0 from "@phosphor-icons/react";
import { render } from "@testing-library/react";
import { Toolbar } from "@/features/planner/shared/components/editor/Toolbar";

vi.mock("@phosphor-icons/react", async (importOriginal) => {
  const actual = await importOriginal<typeof lucidereactType0>();
  const icon = (name: string) => (props: Record<string, unknown>) => (
    <span data-testid={`icon-${name}`} {...props} />
  );
  return {
    ...actual,
    MousePointer2: icon("MousePointer2"),
    Hand: icon("Hand"),
    Square: icon("Square"),
    BoxSelect: icon("BoxSelect"),
    DoorOpen: icon("DoorOpen"),
    AppWindow: icon("AppWindow"),
    Armchair: icon("Armchair"),
    Map: icon("Map"),
    Eraser: icon("Eraser"),
    Ruler: icon("Ruler"),
    LayoutTemplate: icon("LayoutTemplate"),
    Save: icon("Save"),
    Trash2: icon("Trash2"),
  };
});

vi.mock("@/components/ui/Logo", () => ({
  OneAndOnlyLogo: () => <div data-testid="logo" />,
}));

vi.mock("@/features/planner/store/toastStore", () => ({
  useToastStore: (selector: (state: { addToast: () => void }) => unknown) =>
    selector({ addToast: vi.fn() }),
}));

vi.mock("@/features/planner/store/plannerStore", () => ({
  usePlannerStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      activeTool: "select",
      snapDistance: "medium",
      setActiveTool: vi.fn(),
      setSnapDistance: vi.fn(),
      document: {
        walls: [],
        furniture: [],
        roomWidth: 800,
        roomHeight: 600,
      },
      addFurnitureItem: vi.fn(),
      removeFurnitureItem: vi.fn(),
      updateFurnitureItem: vi.fn(),
      history: { undo: vi.fn(), redo: vi.fn() },
    }),
}));

describe("Toolbar", () => {
  it("should render component Toolbar", () => {
    const { container } = render(<Toolbar />);
    expect(container).toBeDefined();
  });
  it("should have function Toolbar defined", () => {
    expect(Toolbar).toBeTypeOf("function");
  });
});