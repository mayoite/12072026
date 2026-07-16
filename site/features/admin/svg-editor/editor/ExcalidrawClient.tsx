"use client";

import { useState, useRef, useMemo } from "react";
import type { ReactNode } from "react";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  Sidebar,
  exportToSvg,
  restoreElements,
} from "@excalidraw/excalidraw";
import type {
  BinaryFiles,
  DataURL,
  ExcalidrawInitialDataState,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types";
import type { FileId } from "@excalidraw/excalidraw/element/types";
import "@excalidraw/excalidraw/index.css";
import { DimensionPanel } from "./DimensionPanel";
import { DimensionLabels } from "./DimensionLabels";
import type { ExcalidrawAPI } from "./elementUtils";
import type { UnitSystem } from "./units";

const LEGACY_SVG_FILE_ID = "legacy-svg-bg" as FileId;
const LEGACY_SVG_TIMESTAMP = 1;

export interface ExcalidrawClientProps {
  readonly initialSvg: string;
  readonly initialExcalidrawElements?: unknown;
  readonly checksum: string;
  readonly readRequest: number;
  readonly onDocument: (svg: string, excalidrawElements: unknown) => void;
  readonly onError: (message: string) => void;
  readonly renderCustomSidebar?: () => ReactNode;
  readonly unitSystem?: UnitSystem;
}

export default function ExcalidrawClient({
  initialSvg,
  initialExcalidrawElements,
  checksum: _checksum,
  readRequest: _readRequest,
  onDocument,
  onError,
  renderCustomSidebar,
  unitSystem = "metric",
}: ExcalidrawClientProps) {
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
        elements: restoreElements(
          initialExcalidrawElements as ExcalidrawInitialDataState["elements"],
          null,
          {
          repairBindings: true,
          refreshDimensions: false,
          },
        ),
        scrollToContent: true,
      };
    }
    if (initialSvg) {
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
            versionNonce: LEGACY_SVG_TIMESTAMP,
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
            updated: LEGACY_SVG_TIMESTAMP,
            fileId: LEGACY_SVG_FILE_ID,
            status: "saved",
            locked: true,
          },
        ] as unknown as ExcalidrawInitialDataState["elements"],
        files: {
          [LEGACY_SVG_FILE_ID]: {
            id: LEGACY_SVG_FILE_ID,
            dataURL: `data:image/svg+xml;base64,${b64}` as DataURL,
            mimeType: "image/svg+xml",
            created: LEGACY_SVG_TIMESTAMP,
            lastRetrieved: LEGACY_SVG_TIMESTAMP,
          },
        } as unknown as BinaryFiles,
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
