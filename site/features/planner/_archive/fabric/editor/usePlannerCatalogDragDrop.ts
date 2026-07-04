import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type RefObject,
} from "react";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";
import {
  acceptsCatalogDrag,
  readCatalogDragPayload,
} from "@/features/planner/catalog/shapeTypeRegistry";
import { getPlannerFabricRuntime } from "@/features/planner/canvas-fabric";

type PlaceCatalogFn = (
  item: CatalogItem & { left?: number; top?: number },
  scene?: { x: number; y: number },
) => void;

type UsePlannerCatalogDragDropOptions = {
  canvasSurfaceRef: RefObject<HTMLDivElement | null>;
  placeCatalogIntoFabric: PlaceCatalogFn;
  recordRecentPlacement: (catalogItemId: string) => void;
};

export function usePlannerCatalogDragDrop({
  canvasSurfaceRef,
  placeCatalogIntoFabric,
  recordRecentPlacement,
}: UsePlannerCatalogDragDropOptions) {
  const [dragItem, setDragItem] = useState<CatalogItem | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [isCatalogOverCanvas, setIsCatalogOverCanvas] = useState(false);
  const [dropFlash, setDropFlash] = useState<{ x: number; y: number } | null>(null);

  const clearCatalogDrag = useCallback(() => {
    setDragItem(null);
    setGhostPos(null);
    setIsCatalogOverCanvas(false);
  }, []);

  const handleCatalogDragStart = useCallback((item: CatalogItem) => {
    setDragItem(item);
    setIsCatalogOverCanvas(false);
  }, []);

  const handleCatalogDragEnd = useCallback(() => {
    clearCatalogDrag();
  }, [clearCatalogDrag]);

  useEffect(() => {
    if (!dragItem) return;

    const onDragOver = (event: globalThis.DragEvent) => {
      if (!event.dataTransfer || !acceptsCatalogDrag(event.dataTransfer)) return;
      event.preventDefault();
      setGhostPos({ x: event.clientX, y: event.clientY });
      const overCanvas = canvasSurfaceRef.current?.contains(event.target as Node) ?? false;
      setIsCatalogOverCanvas(overCanvas);
      event.dataTransfer.dropEffect = overCanvas ? "copy" : "none";
    };

    const onDragEnd = () => {
      clearCatalogDrag();
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragend", onDragEnd);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragend", onDragEnd);
    };
  }, [canvasSurfaceRef, clearCatalogDrag, dragItem]);

  useEffect(() => {
    if (!dropFlash) return;
    const timer = window.setTimeout(() => setDropFlash(null), 520);
    return () => window.clearTimeout(timer);
  }, [dropFlash]);

  const handleCanvasDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (!acceptsCatalogDrag(e.dataTransfer)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setGhostPos({ x: e.clientX, y: e.clientY });
    setIsCatalogOverCanvas(true);
  }, []);

  const handleCanvasDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw = readCatalogDragPayload(e.dataTransfer);
    if (!raw) {
      clearCatalogDrag();
      return;
    }
    try {
      const item = JSON.parse(raw) as CatalogItem;
      const scene = getPlannerFabricRuntime()?.clientToSceneUnits(e.clientX, e.clientY) ?? undefined;
      placeCatalogIntoFabric(item, scene ?? undefined);
      recordRecentPlacement(item.id);
      setDropFlash({ x: e.clientX, y: e.clientY });
    } catch {
      // Invalid drag payload — ignore.
    } finally {
      clearCatalogDrag();
    }
  }, [clearCatalogDrag, placeCatalogIntoFabric, recordRecentPlacement]);

  const ghostFootprint = useMemo(() => {
    if (!dragItem) return null;
    return { w: 48, h: 32 };
  }, [dragItem]);

  return {
    dragItem,
    ghostPos,
    isCatalogOverCanvas,
    dropFlash,
    ghostFootprint,
    handleCatalogDragStart,
    handleCatalogDragEnd,
    handleCanvasDragOver,
    handleCanvasDrop,
  };
}
