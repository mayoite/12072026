// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminSvgEditorV2 } from "@/features/admin/svg-editor-v2/ui/AdminSvgEditorV2";

const manifest = {
  version: 2,
  assetId: "018f47ca-8131-7e40-9f1d-6b90f37b1290",
  productId: null,
  slug: "phase-two-editor",
  name: "Phase two editor",
  assetKind: "fixed",
  dimensionsMm: { width: 1200.5, depth: 650.25, height: 740 },
  sourceChecksum: "a".repeat(64),
  lifecycle: "draft",
  currentVersion: 2,
  capabilities: ["geometry", "text", "gradients"],
  createdAt: "2026-07-15T08:00:00.000Z",
  updatedAt: "2026-07-15T09:00:00.000Z",
} as const;

describe("AdminSvgEditorV2", () => {
  it("renders a focused host shell with metadata, dimensions, iframe, validation, revisions, publish controls, and collapsed AI rail", () => {
    render(<AdminSvgEditorV2 manifest={manifest} initialSvg="<svg />" />);

    expect(screen.getByRole("heading", { name: /phase two editor/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/svg-edit iframe/i)).toHaveAttribute("src", "/vendor/svgedit/index.html");
    expect(screen.getByRole("button", { name: /save draft/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /publish v2/i })).toBeInTheDocument();
    expect(screen.getByText(/validation/i)).toBeInTheDocument();
    expect(screen.getByText(/revision 2/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open ai assist/i })).toHaveAttribute("aria-expanded", "false");
  });
});
