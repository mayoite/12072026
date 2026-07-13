/**
 * ADM-SVG-06 — identity, footprint, viewBox, zoom, selection, draft, validation,
 * and revision are visible on the live studio stage strip (real SvgStudioCanvas).
 */

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { SvgStudioCanvas } from "@/features/planner/admin/svg-editor/SvgStudioCanvas";
import type {
  SvgSceneDocument,
  SvgSceneNode,
} from "@/features/planner/admin/svg-editor/scene/svgSceneDocument";
import type { SvgEngineAdapter } from "@/features/planner/admin/svg-editor/scene/svgEngineAdapter";

vi.mock("@/features/planner/admin/svg-editor/scene/svgJsEngineAdapter", () => ({
  createSvgJsEngineAdapter: (): SvgEngineAdapter => ({
    render: vi.fn(),
    getViewport: () => ({ panX: 0, panY: 0, zoom: 1.25 }),
    setViewport: vi.fn(),
    zoomToFit: vi.fn(),
    resetViewport: vi.fn(),
    serialize: vi.fn(),
    on: () => () => {},
    destroy: vi.fn(),
  }),
}));

function rect(id: string): SvgSceneNode {
  return {
    kind: "rect",
    id,
    name: "Desk",
    locked: false,
    hidden: false,
    style: { fillToken: "currentColor", strokeToken: "currentColor", lineWeight: 1 },
    x: 10,
    y: 20,
    width: 100,
    height: 50,
  } as SvgSceneNode;
}

function doc(nodes: SvgSceneNode[]): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 600, height: 400 },
    metadata: {
      typeId: "desk",
      name: "Desk",
      category: "desk",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "t",
      physicalDimensionsMm: { width: 600, depth: 400, height: 100 },
      accessibilityTitle: "Desk",
    },
    nodes,
  };
}

const stageMeta = {
  identity: "Identity side-table-001 · id abcdef01… · SKU OFL-1",
  footprint: "Footprint 600×400 mm",
  draft: "Draft Unpublished changes",
  validation: "Validation ok",
  revision: "Revision schema 2026-07-04.v2 · today · deadbeef01234567…",
};

describe("ADM-SVG-06 stage status strip (real canvas)", () => {
  it("shows identity, footprint, view box, zoom, selection, draft, validation, revision", () => {
    render(
      <SvgStudioCanvas initialDocument={doc([rect("desk-top")])} stageMeta={stageMeta} />,
    );

    const strip = screen.getByTestId("admin-stage-status");
    expect(strip).toBeInTheDocument();

    expect(screen.getByTestId("admin-status-identity")).toHaveTextContent(
      /Identity side-table-001/,
    );
    expect(screen.getByTestId("admin-status-identity")).toHaveTextContent(/SKU OFL-1/);
    expect(screen.getByTestId("admin-status-footprint")).toHaveTextContent(
      /Footprint 600×400 mm/,
    );
    expect(screen.getByTestId("admin-status-viewbox")).toHaveTextContent(
      /View box 600 × 400/,
    );
    expect(screen.getByTestId("admin-status-zoom")).toHaveTextContent(/Zoom \d+%/);
    expect(screen.getByTestId("admin-status-selection")).toHaveTextContent(
      /No selection/,
    );
    expect(screen.getByTestId("admin-status-draft")).toHaveTextContent(
      /Draft Unpublished changes/,
    );
    expect(screen.getByTestId("admin-status-validation")).toHaveTextContent(
      /Validation ok/,
    );
    expect(screen.getByTestId("admin-status-revision")).toHaveTextContent(
      /Revision schema 2026-07-04/,
    );
    expect(screen.getByTestId("admin-status-revision")).toHaveTextContent(/today/);
  });

  it("updates selection text when a layer is selected without drag", () => {
    render(
      <SvgStudioCanvas initialDocument={doc([rect("desk-top")])} stageMeta={stageMeta} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /^Desk\s/i }));
    expect(screen.getByTestId("admin-status-selection")).toHaveTextContent(
      /Selected: Desk/,
    );
  });
});
