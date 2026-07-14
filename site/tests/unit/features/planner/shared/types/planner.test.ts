import { describe, expect, it } from "vitest";
import type {
  BoqItem,
  CatalogProduct,
  PlannerDrawingTool,
  PlannerStep,
  RoomPreset,
} from "@/features/planner/shared/types/planner";

describe("shared/types/planner", () => {
  it("accepts planner step and drawing tool unions", () => {
    const steps: PlannerStep[] = ["room", "catalog", "measure", "review"];
    const tools: PlannerDrawingTool[] = ["select", "hand", "draw", "text"];
    expect(steps).toContain("catalog");
    expect(tools).toContain("draw");
  });

  it("accepts CatalogProduct and BoqItem shapes", () => {
    const product: CatalogProduct = {
      name: "Desk",
      category: "desks",
      price: 10000,
      plannerSourceSlug: "desk-1",
    };
    const boq: BoqItem = {
      name: "Desk",
      category: "desks",
      quantity: 2,
      unitPrice: 10000,
      sku: "DSK",
    };
    expect(product.category).toBe("desks");
    expect((boq.quantity ?? 0) * (boq.unitPrice ?? 0)).toBe(20000);
  });

  it("accepts RoomPreset with zone widths", () => {
    const preset: RoomPreset = {
      id: "cabin",
      name: "Cabin",
      widthMm: 3000,
      heightMm: 3000,
      zones: [{ label: "Cabin", widthMm: 3000 }],
    };
    expect(preset.zones?.[0]?.widthMm).toBe(preset.widthMm);
  });
});
