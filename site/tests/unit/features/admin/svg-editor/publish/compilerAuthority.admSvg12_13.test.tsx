/**
 * ADM-SVG-12 — preview and publish share compileSvgForPublish.
 * ADM-SVG-13 — live preview exposes identity, footprint, validation, fallback.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  SHARED_COMPILE_ENTRY,
  SHARED_COMPILE_MODULE_PATH,
} from "@/features/admin/svg-editor/publish/sharedCompilerAuthority";
import { LiveCompiledSvgPreview } from "@/features/admin/svg-editor/publish/LiveCompiledSvgPreview";
import type { SvgPreviewResult } from "@/features/admin/svg-editor/publish/previewSvgEditorAction";

function readSiteSource(...parts: string[]): string {
  return fs.readFileSync(path.join(process.cwd(), ...parts), "utf8");
}

describe("ADM-SVG-12 one compiler authority", () => {
  it("names compileSvgForPublish as the shared entry", () => {
    expect(SHARED_COMPILE_ENTRY).toBe("compileSvgForPublish");
    expect(SHARED_COMPILE_MODULE_PATH).toContain("compileSvgForPublish");
  });

  it("preview and publish source both import the same compile entry", () => {
    const previewSrc = readSiteSource(
      "features/admin/svg-editor/previewSvgEditorAction.ts",
    );
    const publishSrc = readSiteSource(
      "features/admin/svg-editor/publishDescriptorWithPipeline.ts",
    );
    expect(previewSrc).toContain('from "@/features/planner/asset-engine/svg/compileSvgForPublish"');
    expect(previewSrc).toContain("compileSvgForPublish");
    expect(publishSrc).toContain('from "@/features/planner/asset-engine/svg/compileSvgForPublish"');
    expect(publishSrc).toContain("compileSvg: compileSvgForPublish");
    // Preview must not persist disk.
    expect(previewSrc).toMatch(/NEVER writes disk|no disk I\/O/i);
  });
});

describe("ADM-SVG-13 live preview identity, footprint, validation, fallback", () => {
  const meta = {
    identity: "Identity side-table-001 · SKU OFL-1",
    footprint: "Footprint 600×600 mm",
    validation: "Validation ok",
  };

  it("shows identity, footprint, validation, and Planner symbol note with live SVG", () => {
    const result: SvgPreviewResult = {
      ok: true,
      phase: "ok",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>',
      issues: [],
    };
    render(
      <LiveCompiledSvgPreview result={result} pending={false} meta={meta} />,
    );
    expect(screen.getByTestId("admin-svg-livepreview")).toHaveAttribute(
      "data-compiler-authority",
      "compileSvgForPublish",
    );
    expect(screen.getByTestId("admin-svg-livepreview-identity")).toHaveTextContent(
      /side-table-001/,
    );
    expect(screen.getByTestId("admin-svg-livepreview-footprint")).toHaveTextContent(
      /600×600/,
    );
    expect(screen.getByTestId("admin-svg-livepreview-validation")).toHaveTextContent(
      /Validation ok/,
    );
    expect(screen.getByTestId("admin-svg-livepreview-planner-symbol")).toHaveTextContent(
      /Planner 2D symbol/,
    );
    expect(screen.getByTestId("admin-svg-livepreview-symbol")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-livepreview")).toHaveAttribute(
      "data-fallback-state",
      "live",
    );
  });

  it("falls back to last good SVG when validation/compile fails", () => {
    const good: SvgPreviewResult = {
      ok: true,
      phase: "ok",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" data-good="1"></svg>',
      issues: [],
    };
    const { rerender } = render(
      <LiveCompiledSvgPreview result={good} pending={false} meta={meta} />,
    );
    const bad: SvgPreviewResult = {
      ok: false,
      phase: "validate",
      issues: [{ path: "slug", message: "bad" }],
      error: "Descriptor failed validation",
    };
    rerender(<LiveCompiledSvgPreview result={bad} pending={false} meta={meta} />);
    expect(screen.getByTestId("admin-svg-livepreview-validation-error")).toHaveTextContent(
      /failed validation/i,
    );
    expect(screen.getByTestId("admin-svg-livepreview-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-livepreview-fallback-note")).toHaveTextContent(
      /Fallback/i,
    );
    expect(screen.getByTestId("admin-svg-livepreview")).toHaveAttribute(
      "data-fallback-state",
      "stale",
    );
  });
});
