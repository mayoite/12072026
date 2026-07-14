import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminCatalogEditorDrawer } from "@/features/admin/AdminCatalogEditorDrawer";
import type {
  ConfiguratorDraft,
  StandardDraft,
} from "@/features/admin/adminCatalogManagerUtils";

const standardDraft = {
  name: "Desk",
  category: "desk",
  subcategory: "",
  description: "",
  width_mm: "1200",
  depth_mm: "600",
  height_mm: "750",
  mesh_type: "box",
  price: "100",
  currency: "INR",
  visible: true,
  series_id: "",
  series_name: "",
  planner_source_slug: "",
  tags: "",
  materials: "",
  finish: "",
  lead_time_days: "",
  notes: "",
} as unknown as StandardDraft;

const configuratorDraft = {
  name: "",
  slug: "",
  category: "desk",
} as unknown as ConfiguratorDraft;

describe("AdminCatalogEditorDrawer", () => {
  it("renders create mode shell for standard catalog", () => {
    render(
      <AdminCatalogEditorDrawer
        editorMode="create"
        isStandard
        readOnly={false}
        saving={false}
        standardDraft={standardDraft}
        configuratorDraft={configuratorDraft}
        configuratorJsonErrors={{}}
        showAdvancedJson={false}
        onToggleAdvancedJson={vi.fn()}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onStandardDraftChange={vi.fn()}
        onConfiguratorDraftChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("dialog", { name: /Create catalog item/i })).toBeInTheDocument();
    expect(screen.getByText("New catalog item")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Desk")).toBeInTheDocument();
  });
});
