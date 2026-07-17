import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminSvgBulkImportPanel } from "@/features/admin/svg-editor/views/AdminSvgBulkImportPanel";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
  browserApiFetch: vi.fn(),
}));

describe("AdminSvgBulkImportPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders bulk import chrome", () => {
    const { container } = render(<AdminSvgBulkImportPanel />);
    expect(document.body.textContent?.toLowerCase()).toMatch(/import|csv|bulk/);
    expect(container.querySelector("[data-testid='admin-svg-bulk-import'] [style]")).toBeNull();
  });

  it("renders preview details and enables apply when the dry run can proceed", async () => {
    const user = userEvent.setup();
    vi.mocked(browserApiFetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        summary: "2 descriptors ready",
        additions: [{ slug: "desk-a", sku: "SKU-1" }, { slug: "desk-b", sku: "SKU-2" }],
        conflicts: [{ row: 4, field: "sku", message: "duplicate sku" }],
        canApply: true,
      }),
    } as Response);

    render(<AdminSvgBulkImportPanel />);
    await user.click(screen.getByTestId("admin-svg-bulk-import-preview"));

    await waitFor(() => {
      expect(screen.getByTestId("admin-svg-bulk-import-preview-result")).toHaveTextContent(
        "2 descriptors ready",
      );
    });
    expect(screen.getByTestId("admin-svg-bulk-import-preview-result")).toHaveTextContent(
      "Additions (2): desk-a, desk-b",
    );
    expect(screen.getByTestId("admin-svg-bulk-import-preview-result")).toHaveTextContent(
      "Conflicts: Row 4 field sku: duplicate sku",
    );
    expect(screen.getByTestId("admin-svg-bulk-import-submit")).toBeEnabled();
  });

  it("shows preview validation errors when the dry run is blocked", async () => {
    const user = userEvent.setup();
    vi.mocked(browserApiFetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        summary: "Batch blocked",
        rejects: [{ row: 2, field: "slug", message: "missing slug" }],
        errors: [{ row: 5, message: "broken row" }],
        canApply: false,
      }),
    } as Response);

    render(<AdminSvgBulkImportPanel />);
    await user.click(screen.getByTestId("admin-svg-bulk-import-preview"));

    await waitFor(() => {
      expect(screen.getByTestId("admin-svg-bulk-import-error")).toHaveTextContent(
        "Row 2 field slug: missing slug",
      );
    });
    expect(screen.getByTestId("admin-svg-bulk-import-preview-result")).toHaveTextContent(
      "Rejects: Row 2 field slug: missing slug",
    );
    expect(screen.getByTestId("admin-svg-bulk-import-submit")).toBeDisabled();
  });

  it("surfaces non-200 preview failures with reject details", async () => {
    const user = userEvent.setup();
    vi.mocked(browserApiFetch).mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => ({
        success: false,
        rejects: [{ row: 3, field: "variant", message: "unsupported variant" }],
      }),
    } as Response);

    render(<AdminSvgBulkImportPanel />);
    await user.click(screen.getByTestId("admin-svg-bulk-import-preview"));

    await waitFor(() => {
      expect(screen.getByTestId("admin-svg-bulk-import-error")).toHaveTextContent(
        "Row 3 field variant: unsupported variant",
      );
    });
  });

  it("applies a validated batch and shows operator-safe success copy", async () => {
    const user = userEvent.setup();
    vi.mocked(browserApiFetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          summary: "Ready to import",
          additions: [{ slug: "desk-a", sku: "SKU-1" }],
          canApply: true,
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          imported: ["desk-a"],
          provenance: {
            source: "bulk-csv-import",
            importedAt: "2026-07-16T10:00:00Z",
            createdBy: "admin",
          },
        }),
      } as Response);

    render(<AdminSvgBulkImportPanel />);
    await user.click(screen.getByTestId("admin-svg-bulk-import-preview"));
    await waitFor(() => {
      expect(screen.getByTestId("admin-svg-bulk-import-submit")).toBeEnabled();
    });

    await user.click(screen.getByTestId("admin-svg-bulk-import-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("admin-svg-bulk-import-success")).toHaveTextContent(
        "Imported 1 product symbol",
      );
    });
    expect(screen.getByTestId("admin-svg-bulk-import-success")).toHaveTextContent(
      "bulk-csv-import",
    );
    expect(screen.getByTestId("admin-svg-bulk-import-success")).not.toHaveTextContent(
      /descriptor|provenance/i,
    );
    expect(screen.queryByTestId("admin-svg-bulk-import-preview-result")).toBeNull();
  });
});
