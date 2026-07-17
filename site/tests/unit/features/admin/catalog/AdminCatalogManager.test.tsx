import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AdminCatalogManager } from "@/features/admin/catalog/AdminCatalogManager";
import { browserApiFetch } from "@/lib/api/browserApi";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: vi.fn((p: string) => p),
  browserApiFetch: vi.fn(),
}));

vi.mock("@/features/admin/catalog/AdminCatalogTable", () => ({
  AdminCatalogTable: () => <div data-testid="catalog-table" />,
}));

vi.mock("@/features/admin/catalog/AdminCatalogEditorDrawer", () => ({
  AdminCatalogEditorDrawer: () => null,
}));

describe("AdminCatalogManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        items: [],
        total: 0,
        source: "products-db",
      }),
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

  it("shows empty state with primary add CTA when catalog is empty", async () => {
    render(
      <AdminCatalogManager
        title="Standard catalog"
        description="Editable managed products"
        catalogType="standard"
      />,
    );
    expect(await screen.findByTestId("admin-catalog-empty")).toBeInTheDocument();
    expect(screen.getByTestId("admin-catalog-empty-add")).toHaveTextContent(/Add item/i);
    expect(screen.getByTestId("admin-catalog-empty")).toHaveTextContent(
      /read-only workspace element library/i,
    );
  });

  it("shows retry empty state when load fails", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: "Database unavailable" }),
    } as Response);

    render(
      <AdminCatalogManager
        title="Configurator catalog"
        description="Editable configurator SKUs"
        catalogType="configurator"
      />,
    );
    expect(await screen.findByTestId("admin-catalog-error-empty")).toBeInTheDocument();
    expect(screen.getByTestId("admin-catalog-retry")).toBeInTheDocument();
    expect(screen.getByTestId("admin-catalog-error-empty")).toHaveTextContent(
      /configurator SKUs/i,
    );
  });

  it("standard local-catalog source is read-only with honest fallback copy", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        items: [
          {
            id: "std-local-1",
            name: "Local desk",
            category: "desks",
            is_visible: true,
          },
        ],
        total: 1,
        source: "local-catalog",
      }),
    } as Response);

    render(
      <AdminCatalogManager
        title="Standard catalog"
        description="Managed products"
        catalogType="standard"
      />,
    );

    expect(await screen.findByTestId("admin-shell-source")).toHaveTextContent(
      /local-catalog/i,
    );
    expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(
      /read-only \(local fallback/i,
    );
    expect(screen.getByTestId("admin-shell-state")).toHaveTextContent(/read-only/i);
    expect(screen.getByTestId("admin-shell-primary-action")).toBeDisabled();
    expect(
      screen.getByText(/Read-only local catalog\. Writes are disabled/i),
    ).toBeInTheDocument();
  });

  it("products-db source stays editable for standard catalog", async () => {
    vi.mocked(browserApiFetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        items: [
          {
            id: "std-db-1",
            name: "Managed desk",
            category: "desks",
            is_visible: true,
          },
        ],
        total: 1,
        source: "products-db",
      }),
    } as Response);

    render(
      <AdminCatalogManager
        title="Standard catalog"
        description="Managed products"
        catalogType="standard"
      />,
    );

    expect(await screen.findByTestId("admin-shell-source")).toHaveTextContent(
      /products-db/i,
    );
    expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(/· editable/i);
    expect(screen.getByTestId("admin-shell-primary-action")).not.toBeDisabled();
  });
});
