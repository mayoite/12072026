import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AdminCatalogManager } from "@/features/admin/AdminCatalogManager";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

vi.mock("@/features/admin/AdminCatalogTable", () => ({
  AdminCatalogTable: () => <div data-testid="catalog-table" />,
}));

vi.mock("@/features/admin/AdminCatalogEditorDrawer", () => ({
  AdminCatalogEditorDrawer: () => null,
}));

describe("AdminCatalogManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, items: [], total: 0 }),
    } as Response);
  });

  it("renders title and table region", async () => {
    render(
      <AdminCatalogManager
        title="Standard catalog"
        description="desc"
        catalogType="standard"
      />,
    );
    expect(screen.getByText("Standard catalog")).toBeInTheDocument();
    await waitFor(() => {
      expect(browserApiFetch).toHaveBeenCalled();
    });
  });
});
