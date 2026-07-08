import { describe, it, expect, vi } from "vitest";
import type * as lucidereactType0 from "@phosphor-icons/react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { ExportModal } from "@/features/planner/editor/ExportModal";
import { downloadPlannerBoqPdf } from "@/features/planner/editor/exportActions";

vi.mock("next-intl", () => ({
  useTranslations: () => vi.fn().mockImplementation((key) => key),
}));

vi.mock("@phosphor-icons/react", async (importOriginal) => {
  const actual = await importOriginal<typeof lucidereactType0>();
  const icon = (name: string) => (props: Record<string, unknown>) =>
    React.createElement("span", { "data-testid": `icon-${name}`, ...props });
  return {
    ...actual,
    X: icon("X"),
    FileText: icon("FileText"),
    Ruler: icon("Ruler"),
    Presentation: icon("Presentation"),
    Check: icon("Check"),
    Loader2: icon("Loader2"),
    Link2: icon("Link2"),
    Download: icon("Download"),
    Image: icon("Image"),
    FileCode: icon("FileCode"),
    AlertCircle: icon("AlertCircle"),
  };
});

vi.mock("@/features/planner/editor/exportActions", () => ({
  PlannerExportError: class extends Error {},
  describeExportScope: vi.fn().mockReturnValue("Whole Floorplan"),
  downloadPlannerBoqPdf: vi.fn(),
  downloadPlannerJson: vi.fn(),
  downloadPlannerPng: vi.fn(),
  downloadPlannerSvg: vi.fn(),
  getVectorExportShapeIds: vi.fn().mockReturnValue(["shape-1"]),
}));

describe("ExportModal", () => {
  it("renders presets and triggers download action", async () => {
    render(<ExportModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("Whole Floorplan")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /PDF/i })[0]).toBeInTheDocument();

    const downloadBtn = screen.getByRole("button", { name: /Download PDF/i });
    await act(async () => {
      fireEvent.click(downloadBtn);
    });

    expect(downloadPlannerBoqPdf).toHaveBeenCalled();
  });
});
