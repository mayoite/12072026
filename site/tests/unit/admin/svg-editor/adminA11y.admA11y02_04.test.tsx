/**
 * ADM-A11Y-02 — SVG author→publish path is keyboard-completable.
 * ADM-A11Y-03 — every drag action has a non-drag alternative.
 * ADM-A11Y-04 — focus stays visible; state changes are announced.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import {
  STUDIO_DRAG_ACTIONS,
  STUDIO_NON_DRAG_ALTERNATIVES,
  STUDIO_NUDGE_STEP,
  STUDIO_ZOOM_STEP,
} from "@/features/planner/admin/svg-editor/studioA11yContract";
import { nudgeSceneNodePatch } from "@/features/planner/admin/svg-editor/scene/nudgeSceneNode";
import { SvgStudioCanvas } from "@/features/planner/admin/svg-editor/SvgStudioCanvas";
import type {
  SvgSceneDocument,
  SvgSceneNode,
} from "@/features/planner/admin/svg-editor/scene/svgSceneDocument";
import type { SvgEngineAdapter } from "@/features/planner/admin/svg-editor/scene/svgEngineAdapter";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

const mockSetViewport = vi.fn();
const mockZoomToFit = vi.fn();
const mockResetViewport = vi.fn();
let viewport = { panX: 0, panY: 0, zoom: 1 };

function makeAdapter(): SvgEngineAdapter {
  return {
    render: vi.fn(),
    getViewport: () => viewport,
    setViewport: (partial) => {
      viewport = { ...viewport, ...partial };
      mockSetViewport(partial);
    },
    zoomToFit: mockZoomToFit,
    resetViewport: () => {
      viewport = { panX: 0, panY: 0, zoom: 1 };
      mockResetViewport();
    },
    serialize: vi.fn(),
    on: () => () => {},
    destroy: vi.fn(),
  };
}

vi.mock("@/features/planner/admin/svg-editor/scene/svgJsEngineAdapter", () => ({
  createSvgJsEngineAdapter: () => makeAdapter(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/features/planner/admin/svg-editor/useDebouncedCompile", () => ({
  useDebouncedCompile: () => ({
    result: { ok: true, svg: "<svg></svg>", issues: [], phase: "ok" },
    pending: false,
  }),
}));
vi.mock("@/features/planner/admin/svg-editor/SvgEditorForm", () => ({
  SvgEditorForm: () => null,
}));
vi.mock("@/features/planner/admin/svg-editor/LiveCompiledSvgPreview", () => ({
  LiveCompiledSvgPreview: () => null,
}));
vi.mock("@/features/planner/admin/svg-editor/PublishedSvgPreview", () => ({
  PublishedSvgPreview: () => null,
}));
vi.mock("@/features/planner/admin/svg-editor/DescriptorRevisionPanel", () => ({
  DescriptorRevisionPanel: () => null,
}));
vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { AdminSvgEditorEditView } from "@/features/planner/admin/svg-editor/AdminSvgEditorEditView";

function rectNode(over: Partial<SvgSceneNode> = {}): SvgSceneNode {
  return {
    kind: "rect",
    id: "desk-top",
    name: "Desk",
    locked: false,
    hidden: false,
    style: { fillToken: "currentColor", strokeToken: "currentColor", lineWeight: 1 },
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    ...over,
  } as SvgSceneNode;
}

function baseDoc(nodes: SvgSceneNode[]): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    metadata: {
      typeId: "desk-basic",
      name: "Basic Desk",
      category: "desk",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "owner-1",
      physicalDimensionsMm: { width: 600, depth: 600, height: 480 },
      accessibilityTitle: "Basic desk",
    },
    nodes,
  };
}

function readSiteCss(...parts: string[]): string {
  return fs.readFileSync(path.join(process.cwd(), ...parts), "utf8");
}

/** Layer row select control (not Hide/Lock, which also include the layer name). */
function selectLayerNamed(name: string) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${name}\\s`, "i") }));
}

const editDescriptor = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "block-descriptors/side-table-001.json"),
    "utf8",
  ),
) as BlockDescriptor;

const artifactStatus = {
  state: "published" as const,
  bytes: 1,
  updatedAt: 1,
  hash: "abcdef0123456789deadbeef",
  publicUrl: "/symbol.svg",
  markup: "<svg></svg>",
};

beforeEach(() => {
  viewport = { panX: 0, panY: 0, zoom: 1 };
  mockSetViewport.mockClear();
  mockZoomToFit.mockClear();
  mockResetViewport.mockClear();
});

describe("ADM-A11Y-03 nudge pure geometry (non-drag move)", () => {
  it("translates rect and circle; refuses path", () => {
    const rect = rectNode();
    expect(nudgeSceneNodePatch(rect, STUDIO_NUDGE_STEP, 0)).toEqual({
      x: 11,
      y: 20,
    });
    const circle = {
      kind: "circle" as const,
      id: "c",
      name: "C",
      locked: false,
      hidden: false,
      style: {},
      cx: 50,
      cy: 50,
      r: 10,
    };
    expect(nudgeSceneNodePatch(circle, 0, -STUDIO_NUDGE_STEP)).toEqual({
      cx: 50,
      cy: 49,
    });
    const pathNode = {
      kind: "path" as const,
      id: "p",
      name: "P",
      locked: false,
      hidden: false,
      style: {},
      d: "M0 0 L10 10",
    };
    expect(nudgeSceneNodePatch(pathNode, 1, 1)).toBeNull();
  });
});

describe("ADM-A11Y-02 keyboard-completable studio controls", () => {
  it("exposes focusable tools, layer selection, and keyboard stage surface", async () => {
    render(<SvgStudioCanvas initialDocument={baseDoc([rectNode()])} />);

    // Toolbar command region — native buttons are keyboard reachable
    expect(screen.getByRole("toolbar", { name: /Canvas tools/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add rectangle/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Add circle/i })).toBeEnabled();
    expect(screen.getByTestId("admin-studio-zoom-in")).toBeEnabled();
    expect(screen.getByTestId("admin-studio-zoom-out")).toBeEnabled();
    expect(screen.getByTestId("admin-studio-zoom-fit")).toBeEnabled();
    expect(screen.getByTestId("admin-studio-zoom-reset")).toBeEnabled();

    // Layer select without pointer on canvas
    selectLayerNamed("Desk");
    expect(screen.getByTestId("admin-status-selection")).toHaveTextContent(
      /Selected: Desk/,
    );

    // Stage is a keyboard application surface
    const stage = screen.getByTestId("admin-studio-region-stage");
    expect(stage).toHaveAttribute("tabindex", "0");
    expect(stage).toHaveAttribute("role", "application");
    expect(stage.getAttribute("aria-keyshortcuts") ?? "").toMatch(/Arrow/);

    // After selection, numeric inspector (keyboard geometry path)
    expect(screen.getByTestId("admin-studio-geom-x")).toBeInTheDocument();
    expect(screen.getByTestId("admin-studio-geom-y")).toBeInTheDocument();
    expect(screen.getByTestId("admin-studio-geom-w")).toBeInTheDocument();
    expect(screen.getByTestId("admin-studio-geom-h")).toBeInTheDocument();
  });

  it("nudge selected rect with Arrow keys on the stage (keyboard move)", async () => {
    const onChange = vi.fn();
    render(
      <SvgStudioCanvas
        initialDocument={baseDoc([rectNode()])}
        onDocumentChange={onChange}
      />,
    );
    selectLayerNamed("Desk");
    const stage = screen.getByTestId("admin-studio-region-stage");
    stage.focus();
    fireEvent.keyDown(stage, { key: "ArrowRight" });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
    const last = onChange.mock.calls.at(-1)?.[0] as SvgSceneDocument;
    const node = last.nodes.find((n) => n.id === "desk-top");
    expect(node).toMatchObject({ kind: "rect", x: 11, y: 20 });
  });

  it("edit page keeps Publish keyboard-reachable as the primary action", () => {
    render(
      <AdminSvgEditorEditView
        slug={editDescriptor.slug}
        descriptor={editDescriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );
    const publish = screen.getByTestId("admin-shell-primary-action");
    expect(publish.tagName.toLowerCase()).toBe("button");
    expect(publish).not.toHaveAttribute("tabindex", "-1");
    expect(publish).toHaveTextContent(/Publish/i);
  });
});

describe("ADM-A11Y-03 every drag has non-drag alternative", () => {
  it("declares all drag actions and exposes alternative controls", () => {
    render(<SvgStudioCanvas initialDocument={baseDoc([rectNode()])} />);
    const studio = screen.getByTestId("admin-svg-studio");
    for (const action of STUDIO_DRAG_ACTIONS) {
      expect(studio.getAttribute("data-drag-actions") ?? "").toContain(action);
    }

    // Pan/zoom alts always visible in toolbar
    for (const id of [
      "admin-studio-zoom-fit",
      "admin-studio-zoom-reset",
      "admin-studio-zoom-in",
      "admin-studio-zoom-out",
    ]) {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    }
    expect(screen.getByTestId("admin-studio-nudge-hint")).toBeInTheDocument();

    selectLayerNamed("Desk");
    // Move/resize alts via inspector numbers
    for (const id of STUDIO_NON_DRAG_ALTERNATIVES.move) {
      if (id === "admin-studio-nudge-hint") continue;
      if (id.includes("cx") || id.includes("cy")) continue; // rect selection
      if (id.includes("x1") || id.includes("y1") || id.includes("x2") || id.includes("y2")) continue; // rect selection
      expect(screen.getByTestId(id)).toBeInTheDocument();
    }
    for (const id of ["admin-studio-geom-w", "admin-studio-geom-h"]) {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    }
  });

  it("zoom in/out buttons change viewport without wheel", async () => {
    render(<SvgStudioCanvas initialDocument={baseDoc([rectNode()])} />);
    await waitFor(() => {
      // adapter mounted asynchronously
      expect(screen.getByTestId("admin-studio-zoom-in")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("admin-studio-zoom-in"));
    await waitFor(() => {
      expect(mockSetViewport).toHaveBeenCalled();
    });
    const zoomCall = mockSetViewport.mock.calls.find(
      (c) => typeof c[0]?.zoom === "number",
    );
    expect(zoomCall?.[0].zoom).toBeCloseTo(STUDIO_ZOOM_STEP, 5);
  });
});

describe("ADM-A11Y-04 focus visible and state announced", () => {
  it("stage status is a polite live region and announces selection", () => {
    render(<SvgStudioCanvas initialDocument={baseDoc([rectNode()])} />);
    const status = screen.getByTestId("admin-stage-status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "false");
    selectLayerNamed("Desk");
    expect(screen.getByTestId("admin-status-selection")).toHaveTextContent(
      /Selected: Desk/,
    );
  });

  it("edit page announces publish feedback via aria-live", () => {
    render(
      <AdminSvgEditorEditView
        slug={editDescriptor.slug}
        descriptor={editDescriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );
    const live = screen.getByTestId("admin-svg-a11y-live-feedback");
    expect(live).toHaveAttribute("aria-live", "polite");
    expect(live).toHaveAttribute("aria-atomic", "true");
  });

  it("admin shell state is announced for lifecycle changes", () => {
    render(
      <AdminSvgEditorEditView
        slug={editDescriptor.slug}
        descriptor={editDescriptor}
        updatedAtLabel="today"
        artifactStatus={artifactStatus}
        catalogLifecycle="draft"
        onPublishAction={vi.fn()}
      />,
    );
    const state = screen.getByTestId("admin-shell-state");
    expect(state).toHaveAttribute("aria-live", "polite");
  });

  it("CSS keeps focus-visible outlines on studio interactive surfaces", () => {
    const studioCss = readSiteCss(
      "app/css/core/locked/admin/svg-studio.css",
    );
    const engineCss = readSiteCss("app/css/admin-svg-engine.css");
    expect(studioCss + engineCss).toMatch(/:focus-visible/);
    expect(studioCss).toMatch(/svg-studio__toolbar button:focus-visible|svg-studio__layer/);
    expect(studioCss).toMatch(/svg-studio__stage:focus-visible|svg-studio__inspector input:focus-visible/);
  });
});
