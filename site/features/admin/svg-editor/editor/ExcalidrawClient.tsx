"use client";

import { useState, useRef, useMemo } from "react";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  Sidebar,
  exportToSvg,
  restoreElements,
} from "@excalidraw/excalidraw";
import type {
  ExcalidrawInitialDataState,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import { DimensionPanel } from "./DimensionPanel";
import { DimensionLabels } from "./DimensionLabels";
import type { ExcalidrawAPI } from "./elementUtils";
import type { UnitSystem } from "./units";

export default function ExcalidrawClient({
  initialSvg,
  initialExcalidrawElements,
  checksum,
  readRequest,
  onDocument,
  onError,
  renderCustomSidebar,
  unitSystem = "metric",
}: {
  readonly initialSvg: string;
  readonly initialExcalidrawElements?: unknown;
  readonly checksum: string;
  readonly readRequest: number;
  readonly onDocument: (svg: string, excalidrawElements: unknown) => void;
  readonly onError: (message: string) => void;
  readonly renderCustomSidebar?: () => React.ReactNode;
  readonly unitSystem?: UnitSystem;
}) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPI | null>(null);

  const debouncer = useRef<NodeJS.Timeout | null>(null);

  const handleChange: NonNullable<ExcalidrawProps["onChange"]> = (
    elements,
    appState,
    files,
  ) => {
    if (debouncer.current) clearTimeout(debouncer.current);
    debouncer.current = setTimeout(async () => {
      try {
        const svgElement = await exportToSvg({ elements, appState, files });
        onDocument(svgElement.outerHTML, elements);
      } catch (err) {
        onError(err instanceof Error ? err.message : String(err));
      }
    }, 300);
  };

  const initialData = useMemo((): ExcalidrawInitialDataState | undefined => {
    if (Array.isArray(initialExcalidrawElements)) {
      return {
        elements: restoreElements(initialExcalidrawElements, null, {
          normalizeIndices: true,
          repairBindings: true,
          refreshDimensions: false,
        }),
        scrollToContent: true,
      };
    }
    if (initialSvg) {
      const fileId = "legacy-svg-bg";
      let b64 = "";
      try {
        b64 = btoa(unescape(encodeURIComponent(initialSvg)));
      } catch {
        return undefined;
      }
      return {
        elements: [
          {
            type: "image",
            version: 1,
            versionNonce: Date.now(),
            isDeleted: false,
            id: "legacy-bg-element",
            fillStyle: "hachure",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            angle: 0,
            x: 0,
            y: 0,
            strokeColor: "#000000",
            backgroundColor: "transparent",
            width: 1000,
            height: 1000,
            seed: 1,
            groupIds: [],
            strokeSharpness: "sharp",
            boundElements: [],
            updated: Date.now(),
            fileId,
            status: "saved",
            locked: true,
          },
        ],
        files: {
          [fileId]: {
            id: fileId,
            dataURL: `data:image/svg+xml;base64,${b64}`,
            mimeType: "image/svg+xml",
            created: Date.now(),
            lastRetrieved: Date.now(),
          },
        } as ExcalidrawInitialDataState["files"],
        scrollToContent: true,
      };
    }
    return undefined;
  }, [initialExcalidrawElements, initialSvg]);

  return (
    <div className="admin-svg-excalidraw-host">
      <DimensionPanel excalidrawAPI={excalidrawAPI} />
      <div className="admin-svg-excalidraw-canvas">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api as ExcalidrawAPI)}
          initialData={initialData}
          onChange={handleChange}
          UIOptions={{
            canvasActions: {
              export: false,
              loadScene: false,
              saveToActiveFile: false,
              saveAsImage: false,
            },
          }}
        >
          {renderCustomSidebar && (
            <Sidebar name="admin-sidebar" docked={true}>
              <Sidebar.Header />
              {renderCustomSidebar()}
            </Sidebar>
          )}
          <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.HelpHint />
          </WelcomeScreen>
        </Excalidraw>
        <DimensionLabels excalidrawAPI={excalidrawAPI} unitSystem={unitSystem} />
      </div>
    </div>
  );
}
