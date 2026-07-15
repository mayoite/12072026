import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { AdminCatalogManager } from "@/features/admin/catalog/AdminCatalogManager";
import {
  fetchAdminCatalog,
  _createAdminCatalogItem,
  patchAdminCatalogItem,
  deleteAdminCatalogItem,
} from "@/features/admin/api/adminCatalogClient";

vi.mock("@/features/admin/api/adminCatalogClient", () => ({
  fetchAdminCatalog: vi.fn(),
  createAdminCatalogItem: vi.fn(),
  patchAdminCatalogItem: vi.fn(),
  deleteAdminCatalogItem: vi.fn(),
}));

vi.mock("@/features/planner/catalog-api/catalogStore", () => ({
  usePlannerCatalogStore: {
    getState: () => ({
      hydrateCatalog: vi.fn(),
    }),
  },
}));

describe("AdminCatalogManager", () => {
  const mockStandardItems = [
    {
      id: "item-1",
      name: "Table Alpha",
      category: "table",
      width_mm: 1200,
      depth_mm: 800,
      height_mm: 750,
      visible: true,
    },
    {
      id: "item-2",
      name: "Chair Beta",
      category: "seating",
      width_mm: 600,
      depth_mm: 600,
      height_mm: 900,
      visible: false,
    },
  ];

  const mockConfiguratorItems = [
    {
      id: "cfg-1",
      name: "Modular Desk",
      slug: "modular-desk",
      category: "desks",
      sizing_type: "parametric",
      active: true,
      workstation: { shape: "straight" },
    },
  ];

  let confirmSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    confirmSpy = vi.fn(() => true);
    vi.stubGlobal("confirm", confirmSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function renderStandardCatalog() {
    render(
      <AdminCatalogManager
        title="Standard Products"
        description="Manage all standard items"
        catalogType="standard"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Table Alpha")).toBeInTheDocument();
    });
  }

  async function renderConfiguratorCatalog() {
    render(
      <AdminCatalogManager
        title="Configurator Products"
        description="Manage all configurator items"
        catalogType="configurator"
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Modular Desk")).toBeInTheDocument();
    });
  }

  describe("Standard Catalog CRUD", () => {
    beforeEach(() => {
      vi.mocked(fetchAdminCatalog).mockResolvedValue({
        success: true,
        items: mockStandardItems,
        total: 2,
        source: "supabase",
      });
    });

    it("fetches and displays standard items", async () => {
      await renderStandardCatalog();

      expect(fetchAdminCatalog).toHaveBeenCalledWith("standard", { page: 1, limit: 50 });
      expect(screen.getByText("Chair Beta")).toBeInTheDocument();
      expect(document.querySelectorAll(".admin-badge--active")).toHaveLength(1);
      expect(document.querySelectorAll(".admin-badge--hidden")).toHaveLength(1);
    });

    it("opens edit drawer and updates standard item", async () => {
      vi.mocked(patchAdminCatalogItem).mockResolvedValue({ success: true });

      await renderStandardCatalog();

      const editButtons = screen.getAllByTestId(/admin-catalog-edit-/);
      fireEvent.click(editButtons[0]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      const nameInput = screen.getByLabelText("Name *");
      expect(nameInput).toHaveValue("Table Alpha");

      fireEvent.change(nameInput, { target: { value: "Table Alpha Updated" } });
      fireEvent.click(screen.getByRole("button", { name: /Save changes/i }));

      await waitFor(() => {
        expect(patchAdminCatalogItem).toHaveBeenCalledWith(
          "standard",
          "item-1",
          expect.objectContaining({ name: "Table Alpha Updated" }),
        );
      });
    });

    it("blocks saving and displays validation error for standard item", async () => {
      await renderStandardCatalog();

      fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

      const nameInput = screen.getByLabelText("Name *");
      fireEvent.change(nameInput, { target: { value: " " } });

      fireEvent.click(screen.getByRole("button", { name: /Create/i }));

      expect(screen.getByRole("alert")).toHaveTextContent("Name is required");
    });

    it("toggles item visibility status", async () => {
      vi.mocked(patchAdminCatalogItem).mockResolvedValue({ success: true });

      await renderStandardCatalog();

      const hideButtons = screen.getAllByTestId(/admin-catalog-toggle-/);
      fireEvent.click(hideButtons[0]);

      await waitFor(() => {
        expect(patchAdminCatalogItem).toHaveBeenCalledWith("standard", "item-1", { visible: false });
      });
    });

    it("deletes standard item on trash button click after confirmation", async () => {
      vi.mocked(deleteAdminCatalogItem).mockResolvedValue();

      await renderStandardCatalog();

      const deleteButtons = screen.getAllByTestId(/admin-catalog-delete-/);
      fireEvent.click(deleteButtons[0]);

      expect(confirmSpy).toHaveBeenCalledWith(
        'Delete "Table Alpha"? This cannot be undone for standard catalog items.',
      );
      await waitFor(() => {
        expect(deleteAdminCatalogItem).toHaveBeenCalledWith("standard", "item-1");
      });
    });
  });

  describe("Configurator Catalog CRUD", () => {
    beforeEach(() => {
      vi.mocked(fetchAdminCatalog).mockResolvedValue({
        success: true,
        items: mockConfiguratorItems,
        total: 1,
        source: "supabase",
      });
    });

    it("loads and displays configurator items", async () => {
      await renderConfiguratorCatalog();

      expect(screen.getByText("modular-desk")).toBeInTheDocument();
    });

    it("handles discrete/fixed JSON sizing model swaps and handles save JSON validation error", async () => {
      await renderConfiguratorCatalog();

      fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

      const sizingSelect = screen.getByLabelText("Sizing type *");
      fireEvent.change(sizingSelect, { target: { value: "fixed" } });
      fireEvent.click(screen.getByRole("button", { name: /Show JSON/i }));

      const footprintTextarea = screen.getByLabelText(/Default footprint JSON \*/);
      expect(footprintTextarea).toBeInTheDocument();

      fireEvent.change(footprintTextarea, { target: { value: "{" } });

      const nameInput = screen.getByLabelText("Name *");
      fireEvent.change(nameInput, { target: { value: "Fixed Desk" } });

      fireEvent.click(screen.getByRole("button", { name: /Create/i }));

      expect(screen.getByText("Invalid JSON in default_footprint")).toBeInTheDocument();
    });
  });
});
