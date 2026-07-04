import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";
import { useFloorplan } from "@/features/planner/canvas-fabric/context/FloorplanContext";
import {
  buildSketchPlanFabricDraft,
  getSketchRecoveryMessage,
  type SketchRecoveryState,
  type SketchToPlanResponse,
} from "@/features/planner/ai/sketchToPlan";
import { readFloorPlanImageFile } from "@/features/planner/lib/floorPlanImageImport";
import {
  readPlannerToolVisibilityMode,
  writePlannerToolVisibilityMode,
  type PlannerToolVisibilityMode,
} from "./plannerToolVisibility";
import {
  SketchToPlanRouteErrorSchema,
  SketchToPlanRouteResponseSchema,
  type SketchRecoveryReason,
} from "@/lib/api/schemas";
import type { PlannerToolBinding } from "./plannerKeyboardShortcuts";

const subscribeToPlannerToolVisibility = () => () => {};

export function usePlannerViewMode() {
  const [viewMode, setViewMode] = useState<"2d" | "3d" | "split">("2d");

  const handleViewModeChange = useCallback((mode: "2d" | "3d" | "split") => {
    setViewMode(mode);
  }, []);

  return { viewMode, handleViewModeChange, setViewMode };
}

export function usePlannerWorkspaceUiState() {
  const { viewMode, setViewMode } = usePlannerViewMode();
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const storedToolVisibilityMode = useSyncExternalStore(
    subscribeToPlannerToolVisibility,
    readPlannerToolVisibilityMode,
    (): PlannerToolVisibilityMode => "all",
  );
  const [toolVisibilityOverride, setToolVisibilityOverride] =
    useState<PlannerToolVisibilityMode | null>(null);
  const toolVisibilityMode = toolVisibilityOverride ?? storedToolVisibilityMode;

  const handleToolVisibilityModeChange = useCallback((mode: PlannerToolVisibilityMode) => {
    writePlannerToolVisibilityMode(mode);
    setToolVisibilityOverride(mode);
  }, []);

  return {
    viewMode,
    setViewMode,
    isTemplateOpen,
    setIsTemplateOpen,
    isExportOpen,
    setIsExportOpen,
    isSessionOpen,
    setIsSessionOpen,
    toolVisibilityMode,
    handleToolVisibilityModeChange,
  };
}

export function usePlannerCatalogDrop(_canvasSurfaceRef: React.RefObject<HTMLDivElement>) {
  const [dragItem, setDragItem] = useState<CatalogItem | null>(null);
  const [isCatalogOverCanvas, setIsCatalogOverCanvas] = useState(false);
  const { insertObject } = useFloorplan();

  const handleCanvasDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const item = (e.dataTransfer as DataTransfer & { catalogItem?: CatalogItem }).catalogItem;
    if (item) {
      setIsCatalogOverCanvas(true);
      setDragItem(item);
    }
  }, []);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsCatalogOverCanvas(false);
      const item = (e.dataTransfer as DataTransfer & { catalogItem?: CatalogItem }).catalogItem;
      if (item) {
        insertObject({
          type: "CATALOG",
          object: { catalogItemId: item.id },
        });
      }
      setDragItem(null);
    },
    [insertObject]
  );

  return {
    dragItem,
    isCatalogOverCanvas,
    handleCanvasDragOver,
    handleCanvasDrop,
    setDragItem,
    setIsCatalogOverCanvas,
  };
}

export function usePlannerDocument() {
  const { exportDraft, importDraft } = useFloorplan();

  const saveDocument = useCallback(async (name: string) => {
    const state = exportDraft();
    if (!state) return null;
    return { name, data: state, timestamp: Date.now() };
  }, [exportDraft]);

  const loadDocument = useCallback(
    async (data: string) => {
      await importDraft(data);
    },
    [importDraft]
  );

  return { saveDocument, loadDocument };
}

export function usePlannerKeyboardHandlers(applyToolBinding: (binding: PlannerToolBinding) => void) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const bindings: Record<string, PlannerToolBinding> = {
        w: { toolId: "planner-wall", plannerTool: "wall" },
        v: { toolId: "select", plannerTool: "select" },
      };
      const binding = bindings[e.key.toLowerCase()];
      if (binding) {
        e.preventDefault();
        applyToolBinding(binding);
      }
    },
    [applyToolBinding]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

type PlannerSketchRecoveryPayload = {
  dataUrl: string;
  fileName: string;
  prompt: string;
  includeRooms: boolean;
};

type UsePlannerSketchRecoveryOptions = {
  applyToolBinding: (binding: PlannerToolBinding) => void;
  exportDraft: () => string | null;
  importDraft: (json: string) => Promise<void>;
  setFloorPlanUnderlay: (dataUrl: string, options: { fileName: string }) => Promise<void>;
  setSessionStatusMessage: (message: string | null) => void;
  setSessionErrorMessage: (message: string | null) => void;
};

export function usePlannerSketchRecovery({
  applyToolBinding,
  exportDraft,
  importDraft,
  setFloorPlanUnderlay,
  setSessionStatusMessage,
  setSessionErrorMessage,
}: UsePlannerSketchRecoveryOptions) {
  const [sketchRecovery, setSketchRecovery] = useState<SketchRecoveryState>({ status: "idle" });
  const sketchUploadPayloadRef = useRef<PlannerSketchRecoveryPayload | null>(null);

  const applySketchUnderlay = useCallback(
    async (payload: PlannerSketchRecoveryPayload) => {
      await setFloorPlanUnderlay(payload.dataUrl, { fileName: payload.fileName });
    },
    [setFloorPlanUnderlay],
  );

  const setSketchRecoveryFallback = useCallback(
    (fileName: string, reason: SketchRecoveryReason) => {
      const message = getSketchRecoveryMessage(reason);
      setSketchRecovery({ status: "fallback", fileName, reason, message });
      setSessionStatusMessage(message);
      setSessionErrorMessage(message);
    },
    [setSessionErrorMessage, setSessionStatusMessage],
  );

  const startSketchConversion = useCallback(
    async (payload: PlannerSketchRecoveryPayload) => {
      const previousDraftJson = exportDraft() ?? JSON.stringify({ objects: [] });
      sketchUploadPayloadRef.current = payload;
      setSketchRecovery({ status: "converting", fileName: payload.fileName });
      setSessionErrorMessage(null);
      setSessionStatusMessage("Converting sketch into an editable plan...");

      try {
        await applySketchUnderlay(payload);
      } catch (err) {
        const reason =
          err instanceof Error && /decode|unsupported|mime|image/i.test(err.message)
            ? "unsupported_input"
            : "server_error";
        setSketchRecoveryFallback(payload.fileName, reason);
        return;
      }

      try {
        const response = await fetch("/api/planner/sketch-to-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDataUrl: payload.dataUrl,
            fileName: payload.fileName,
            prompt: payload.prompt,
            includeRooms: payload.includeRooms,
          }),
        });
        const rawBody = await response.json().catch(() => null);

        if (response.ok) {
          const parsed = SketchToPlanRouteResponseSchema.safeParse(rawBody);
          if (!parsed.success) {
            setSketchRecoveryFallback(payload.fileName, "invalid_response");
            return;
          }
          if (parsed.data.status === "fallback") {
            setSketchRecovery({
              status: "fallback",
              fileName: parsed.data.fileName,
              reason: parsed.data.reason,
              message: parsed.data.message,
            });
            setSessionStatusMessage(parsed.data.message);
            setSessionErrorMessage(parsed.data.message);
            return;
          }

          const generatedDraftJson = buildSketchPlanFabricDraft({
            objects: parsed.data.objects as SketchToPlanResponse["objects"],
            warnings: Array.isArray(parsed.data.warnings)
              ? parsed.data.warnings.filter((warning): warning is string => typeof warning === "string")
              : [],
          });
          try {
            await applySketchUnderlay(payload);
          } catch (previewUnderlayErr) {
            const reason =
              previewUnderlayErr instanceof Error && /decode|unsupported|mime|image/i.test(previewUnderlayErr.message)
                ? "unsupported_input"
                : "server_error";
            setSketchRecoveryFallback(payload.fileName, reason);
            return;
          }
          setSketchRecovery({
            status: "preview",
            fileName: parsed.data.fileName,
            generatedDraftJson,
            previousDraftJson,
            warnings: parsed.data.warnings,
          });
          setSessionErrorMessage(null);
          setSessionStatusMessage(`Preview ready: ${parsed.data.fileName}`);
          return;
        }

        const parsedError = SketchToPlanRouteErrorSchema.safeParse(rawBody);
        if (parsedError.success) {
          const reason = parsedError.data.error.details?.reason ?? "server_error";
          if (reason === "server_error") {
            setSketchRecoveryFallback(payload.fileName, reason);
            return;
          }
          setSketchRecovery({
            status: "fallback",
            fileName: parsedError.data.error.details?.fileName ?? payload.fileName,
            reason,
            message: getSketchRecoveryMessage(reason),
          });
          setSessionStatusMessage(getSketchRecoveryMessage(reason));
          setSessionErrorMessage(getSketchRecoveryMessage(reason));
          return;
        }

        const reason = response.status >= 500 ? "server_error" : "invalid_response";
        setSketchRecoveryFallback(payload.fileName, reason);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not convert the sketch image.";
        const reason =
          /timeout|timed out|aborted/i.test(message)
            ? "timeout"
            : /decode|unsupported|mime|image/i.test(message)
              ? "unsupported_input"
              : "server_error";
        setSketchRecovery({
          status: "fallback",
          fileName: payload.fileName,
          reason,
          message: getSketchRecoveryMessage(reason),
        });
        setSessionStatusMessage(getSketchRecoveryMessage(reason));
        setSessionErrorMessage(getSketchRecoveryMessage(reason));
      }
    },
    [
      applySketchUnderlay,
      exportDraft,
      setSessionErrorMessage,
      setSessionStatusMessage,
      setSketchRecoveryFallback,
    ],
  );

  const handleSketchRetry = useCallback(() => {
    const payload = sketchUploadPayloadRef.current;
    if (!payload) return;
    void startSketchConversion(payload);
  }, [startSketchConversion]);

  const handleSketchAccept = useCallback(async () => {
    if (sketchRecovery.status !== "preview") return;
    const generatedDraftJson = "generatedDraftJson" in sketchRecovery ? sketchRecovery.generatedDraftJson : null;
    const fileName = "fileName" in sketchRecovery ? sketchRecovery.fileName : "unknown";
    const payload = sketchUploadPayloadRef.current;
    if (!generatedDraftJson) return;

    try {
      await importDraft(generatedDraftJson);
      if (payload) {
        await applySketchUnderlay(payload);
      }
    } catch (acceptErr) {
      const reason =
        acceptErr instanceof Error && /decode|unsupported|mime|image/i.test(acceptErr.message)
          ? "unsupported_input"
          : "server_error";
      setSketchRecoveryFallback(fileName, reason);
      return;
    }

    sketchUploadPayloadRef.current = null;
    setSketchRecovery({ status: "accepted", fileName });
    setSessionErrorMessage(null);
    setSessionStatusMessage(`Sketch conversion accepted: ${fileName}`);
  }, [
    applySketchUnderlay,
    importDraft,
    setSessionErrorMessage,
    setSessionStatusMessage,
    setSketchRecoveryFallback,
    sketchRecovery,
  ]);

  const handleSketchReject = useCallback(async () => {
    if (sketchRecovery.status !== "preview") return;
    const payload = sketchUploadPayloadRef.current;

    try {
      await importDraft(sketchRecovery.previousDraftJson);
      if (payload) {
        await applySketchUnderlay(payload);
      }
    } catch (underlayErr) {
      const reason =
        underlayErr instanceof Error && /decode|unsupported|mime|image/i.test(underlayErr.message)
          ? "unsupported_input"
          : "server_error";
      setSketchRecoveryFallback(sketchRecovery.fileName, reason);
      return;
    }

    setSketchRecovery({ status: "rejected", fileName: sketchRecovery.fileName });
    setSessionErrorMessage(null);
    setSessionStatusMessage(`Sketch kept as reference: ${sketchRecovery.fileName}`);
  }, [
    applySketchUnderlay,
    importDraft,
    setSessionErrorMessage,
    setSessionStatusMessage,
    setSketchRecoveryFallback,
    sketchRecovery,
  ]);

  const handleSketchTraceManual = useCallback(() => {
    applyToolBinding({ toolId: "planner-wall", plannerTool: "wall" });
    setSessionErrorMessage(null);
    if (sketchRecovery.status === "fallback") {
      setSessionStatusMessage(`Trace manually from the sketch reference: ${sketchRecovery.fileName}`);
    } else if (sketchRecovery.status === "rejected") {
      setSessionStatusMessage(`Continue tracing the sketch reference: ${sketchRecovery.fileName}`);
    }
  }, [applyToolBinding, setSessionErrorMessage, setSessionStatusMessage, sketchRecovery]);

  const handleSketchDismiss = useCallback(() => {
    setSketchRecovery({ status: "idle" });
    setSessionErrorMessage(null);
    setSessionStatusMessage(null);
  }, [setSessionErrorMessage, setSessionStatusMessage]);

  const handleFloorPlanFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.currentTarget.value = "";
      if (!file) return;

      try {
        const payload = await readFloorPlanImageFile(file);
        await setFloorPlanUnderlay(payload.dataUrl, { fileName: payload.fileName });
        sketchUploadPayloadRef.current = null;
        setSketchRecovery({ status: "idle" });
        setSessionErrorMessage(null);
        setSessionStatusMessage(`Reference image ready: ${payload.fileName}`);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not import the reference image.";
        setSketchRecovery({
          status: "fallback",
          fileName: file.name,
          reason: "unsupported_input",
          message: getSketchRecoveryMessage("unsupported_input"),
        });
        setSessionStatusMessage(message);
        setSessionErrorMessage(getSketchRecoveryMessage("unsupported_input"));
      }
    },
    [setFloorPlanUnderlay, setSessionErrorMessage, setSessionStatusMessage],
  );

  return {
    sketchRecovery,
    handleSketchRetry,
    handleSketchAccept,
    handleSketchReject,
    handleSketchTraceManual,
    handleSketchDismiss,
    handleFloorPlanFileChange,
  };
}
