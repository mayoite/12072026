/**
 * ADM-SVG-04 — stage ≥55% of content width at 1280px (locked admin theme).
 * ADM-SVG-05 — stable command / stage / layers / properties regions always mounted.
 *
 * Contract must lockstep with the live locked admin theme.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  AUTHORING_WIDTH_PX,
  STAGE_GAP_REM,
  STAGE_GRID_COLUMNS,
  STAGE_MIN_FRACTION,
  STUDIO_REGION_IDS,
  STUDIO_REGION_TEST_IDS,
  stageMeetsMinimumAt1280,
  stageWidthFractionAt,
} from "@/features/admin/svg-editor/stageLayoutContract";
import { SvgStudioCanvas } from "@/features/admin/svg-editor/SvgStudioCanvas";
import type {
  SvgSceneDocument,
  SvgSceneNode,
} from "@/features/admin/svg-editor/scene/svgSceneDocument";
import type { SvgEngineAdapter } from "@/features/admin/svg-editor/scene/svgEngineAdapter";

vi.mock("@/features/admin/svg-editor/scene/svgJsEngineAdapter", () => ({
  createSvgJsEngineAdapter: (): SvgEngineAdapter => ({
    render: vi.fn(),
    getViewport: () => ({ panX: 0, panY: 0, zoom: 1 }),
    setViewport: vi.fn(),
    zoomToFit: vi.fn(),
    resetViewport: vi.fn(),
    serialize: vi.fn(),
    on: () => () => {},
    destroy: vi.fn(),
  }),
}));

function emptyDoc(): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    metadata: {
      typeId: "fixture",
      name: "Fixture",
      category: "desk",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "test",
      physicalDimensionsMm: { width: 600, depth: 600, height: 100 },
      accessibilityTitle: "Fixture",
    },
    nodes: [] as SvgSceneNode[],
  };
}

function readLockedAdminPagesCss(): string {
  return fs.readFileSync(
    path.join(process.cwd(), "app/css/core/locked/admin/admin-pages.css"),
    "utf8",
  );
}

describe("ADM-SVG-04 stage share at 1280px", () => {
  it("locks STAGE_GRID_COLUMNS to the locked admin theme shell grid", () => {
    const css = readLockedAdminPagesCss();
    expect(css).toContain(
      `.admin-svg-engine-shell`,
    );
    expect(css).toContain(`grid-template-columns: ${STAGE_GRID_COLUMNS}`);
    expect(css).toContain(`gap: ${STAGE_GAP_REM}rem`);
    expect(STAGE_GRID_COLUMNS).toBe("minmax(0, 1fr) minmax(280px, 22rem)");
  });

  it("gives stage column ≥55% of content width at 1280px", () => {
    expect(AUTHORING_WIDTH_PX).toBe(1280);
    expect(STAGE_MIN_FRACTION).toBe(0.55);
    // 1280 − 12 gap − 352 rail (22rem) = 916 → 0.715625
    const fraction = stageWidthFractionAt(1280);
    expect(fraction).toBeGreaterThanOrEqual(0.55);
    expect(fraction).toBeCloseTo(916 / 1280, 5);
    expect(stageMeetsMinimumAt1280()).toBe(true);
  });
});

describe("ADM-SVG-05 stable studio regions", () => {
  it("contracts the four region ids and testids", () => {
    expect([...STUDIO_REGION_IDS]).toEqual([
      "command",
      "stage",
      "layers",
      "properties",
    ]);
    expect(STUDIO_REGION_TEST_IDS.command).toBe("admin-studio-region-command");
    expect(STUDIO_REGION_TEST_IDS.stage).toBe("admin-studio-region-stage");
    expect(STUDIO_REGION_TEST_IDS.layers).toBe("admin-studio-region-layers");
    expect(STUDIO_REGION_TEST_IDS.properties).toBe(
      "admin-studio-region-properties",
    );
  });

  it("always mounts command, stage, layers, and properties on the live canvas", () => {
    render(<SvgStudioCanvas initialDocument={emptyDoc()} />);

    for (const id of STUDIO_REGION_IDS) {
      const el = screen.getByTestId(STUDIO_REGION_TEST_IDS[id]);
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute("data-region", id);
    }

    // Properties region stays mounted with no selection (empty inspector).
    expect(screen.getByTestId("svg-studio-inspector-empty")).toHaveTextContent(
      /Select a shape on the canvas or choose a layer/i,
    );
  });

  it("shows useful selected-layer state instead of the internal layer id", () => {
    const document = emptyDoc();
    document.nodes = [
      {
        kind: "rect",
        id: "z0000-z0000-machine-tabletop",
        name: "Tabletop",
        locked: false,
        hidden: false,
        style: {},
        x: 0,
        y: 0,
        width: 600,
        height: 600,
      },
    ];
    render(<SvgStudioCanvas initialDocument={document} />);

    fireEvent.click(screen.getByRole("button", { name: /^Tabletop\s+rect$/i }));

    const inspector = screen.getByTestId("admin-studio-region-properties");
    expect(inspector).toHaveTextContent(/rect · Editable/i);
    expect(inspector).not.toHaveTextContent(/z0000-z0000-machine-tabletop/);
  });
});
