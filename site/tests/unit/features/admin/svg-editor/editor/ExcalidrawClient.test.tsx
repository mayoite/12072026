import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import type { ReactNode } from "react";
import type { ExcalidrawProps } from "@excalidraw/excalidraw/types";
import ExcalidrawClient from "@/features/admin/svg-editor/editor/ExcalidrawClient";

const {
  exportToSvgMock,
  lastExcalidrawPropsRef,
  restoreElementsMock,
} = vi.hoisted(() => ({
  exportToSvgMock: vi.fn(),
  lastExcalidrawPropsRef: {
    current: null as ExcalidrawProps | null,
  },
  restoreElementsMock: vi.fn((elements: unknown) => elements),
}));

vi.mock("@excalidraw/excalidraw/index.css", () => ({}));

vi.mock("@excalidraw/excalidraw", () => {
  const SidebarRoot = ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-sidebar">{children}</div>
  );
  const WelcomeScreenRoot = ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-welcome">{children}</div>
  );
  const MainMenuRoot = ({ children }: { children?: ReactNode }) => (
    <div data-testid="mock-main-menu">{children}</div>
  );

  const Sidebar = Object.assign(SidebarRoot, {
    Header: () => <div data-testid="mock-sidebar-header" />,
  });
  const WelcomeScreen = Object.assign(WelcomeScreenRoot, {
    Hints: {
      MenuHint: () => <div data-testid="mock-menu-hint" />,
      ToolbarHint: () => <div data-testid="mock-toolbar-hint" />,
      HelpHint: () => <div data-testid="mock-help-hint" />,
    },
  });
  const MainMenu = Object.assign(MainMenuRoot, {
    Separator: () => <div data-testid="mock-menu-separator" />,
    DefaultItems: {
      LoadScene: () => <div data-testid="mock-load-scene" />,
      Export: () => <div data-testid="mock-export" />,
      ClearCanvas: () => <div data-testid="mock-clear-canvas" />,
      CommandPalette: () => <div data-testid="mock-command-palette" />,
    },
  });
  return {
    Excalidraw: (props: ExcalidrawProps) => {
      lastExcalidrawPropsRef.current = props;
      return <div data-testid="mock-excalidraw">{props.children}</div>;
    },
    MainMenu,
    WelcomeScreen,
    Sidebar,
    exportToSvg: exportToSvgMock,
    restoreElements: restoreElementsMock,
  };
});

describe("ExcalidrawClient", () => {
  beforeEach(() => {
    exportToSvgMock.mockReset();
    restoreElementsMock.mockClear();
    lastExcalidrawPropsRef.current = null;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("restores provided Excalidraw elements and renders the custom sidebar", () => {
    const elements = [{ id: "shape-1", type: "rectangle" }];

    render(
      <ExcalidrawClient
        initialSvg=""
        initialExcalidrawElements={elements}
        checksum="abc"
        readRequest={1}
        onDocument={vi.fn()}
        onError={vi.fn()}
        renderCustomSidebar={() => <div data-testid="sidebar-content">Inspector</div>}
      />,
    );

    expect(restoreElementsMock).toHaveBeenCalledWith(elements, null, {
      repairBindings: true,
      refreshDimensions: false,
    });
    expect(lastExcalidrawPropsRef.current?.initialData).toMatchObject({
      elements,
      scrollToContent: true,
    });
    expect(document.body.textContent).toContain("Inspector");
    expect(lastExcalidrawPropsRef.current?.theme).toBe("light");
    expect(lastExcalidrawPropsRef.current?.objectsSnapModeEnabled).toBe(true);
    expect(lastExcalidrawPropsRef.current?.UIOptions).toMatchObject({
      canvasActions: {
        loadScene: true,
        saveAsImage: true,
        toggleTheme: false,
      },
    });
  });

  it("builds legacy SVG image initial data when only svg is provided", () => {
    render(
      <ExcalidrawClient
        initialSvg="<svg><rect width='10' height='10' /></svg>"
        checksum="abc"
        readRequest={1}
        onDocument={vi.fn()}
        onError={vi.fn()}
      />,
    );

    const initialData = lastExcalidrawPropsRef.current?.initialData;
    expect(initialData).toBeDefined();
    expect(initialData?.scrollToContent).toBe(true);
    expect(initialData?.files).toBeDefined();
    expect(Object.keys(initialData?.files ?? {})).toContain("legacy-svg-bg");
  });

  it("returns no initial data when svg base64 encoding fails", () => {
    vi.stubGlobal(
      "btoa",
      vi.fn(() => {
        throw new Error("encode failed");
      }),
    );

    render(
      <ExcalidrawClient
        initialSvg="<svg />"
        checksum="abc"
        readRequest={1}
        onDocument={vi.fn()}
        onError={vi.fn()}
      />,
    );

    expect(lastExcalidrawPropsRef.current?.initialData).toBeUndefined();
  });

  it("exports svg changes after the debounce window", async () => {
    const onDocument = vi.fn();
    exportToSvgMock.mockResolvedValue({ outerHTML: "<svg>rendered</svg>" });

    render(
      <ExcalidrawClient
        initialSvg=""
        checksum="abc"
        readRequest={1}
        onDocument={onDocument}
        onError={vi.fn()}
      />,
    );

    const onChange = lastExcalidrawPropsRef.current?.onChange;
    expect(onChange).toBeTypeOf("function");

    onChange?.([{ id: "shape-1" }] as never, { zoom: 1 } as never, {} as never);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(onDocument).toHaveBeenCalledWith("<svg>rendered</svg>", [
      { id: "shape-1" },
    ]);
  });

  it("forwards export failures to the error callback", async () => {
    const onError = vi.fn();
    exportToSvgMock.mockRejectedValue(new Error("export failed"));

    render(
      <ExcalidrawClient
        initialSvg=""
        checksum="abc"
        readRequest={1}
        onDocument={vi.fn()}
        onError={onError}
      />,
    );

    lastExcalidrawPropsRef.current?.onChange?.([] as never, {} as never, {} as never);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(onError).toHaveBeenCalledWith("export failed");
  });
});
