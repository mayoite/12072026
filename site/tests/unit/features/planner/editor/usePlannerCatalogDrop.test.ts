import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlannerCatalogDrop } from "@/features/planner/editor/usePlannerCatalogDrop";
import { acceptsCatalogDrag, readCatalogDragPayload } from "@/features/planner/catalog/shapeTypeRegistry";

vi.mock("@/features/planner/catalog/shapeTypeRegistry", () => ({
  acceptsCatalogDrag: vi.fn(),
  readCatalogDragPayload: vi.fn(),
}));

describe("usePlannerCatalogDrop", () => {
  it("manages drag item state and callbacks", () => {
    const mockPlace = vi.fn();
    const mockRecord = vi.fn();
    const mockRef = { current: document.createElement("div") };

    const { result } = renderHook(() =>
      usePlannerCatalogDrop({
        canvasSurfaceRef: mockRef,
        placeCatalogIntoFabric: mockPlace,
        recordRecentPlacement: mockRecord,
      })
    );

    const mockItem = { id: "item-1" } as any;

    act(() => {
      result.current.handleCatalogDragStart(mockItem);
    });
    expect(result.current.dragItem).toBe(mockItem);

    vi.mocked(acceptsCatalogDrag).mockReturnValue(true);
    const mockDragOverEvent = {
      preventDefault: vi.fn(),
      clientX: 100,
      clientY: 200,
      dataTransfer: {} as any,
    } as any;

    act(() => {
      result.current.handleCanvasDragOver(mockDragOverEvent);
    });
    expect(result.current.ghostPos).toEqual({ x: 100, y: 200 });
    expect(result.current.isCatalogOverCanvas).toBe(true);

    vi.mocked(readCatalogDragPayload).mockReturnValue(JSON.stringify(mockItem));
    const mockDropEvent = {
      preventDefault: vi.fn(),
      clientX: 150,
      clientY: 250,
      dataTransfer: {} as any,
    } as any;

    act(() => {
      result.current.handleCanvasDrop(mockDropEvent);
    });

    expect(mockPlace).toHaveBeenCalledWith(mockItem);
    expect(mockRecord).toHaveBeenCalledWith("item-1");
    expect(result.current.dragItem).toBeNull();
    expect(result.current.dropFlash).toEqual({ x: 150, y: 250 });
  });
});
