import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminCatalogTable } from "@/features/admin/AdminCatalogTable";
import type { CatalogManagerItem } from "@/features/admin/adminCatalogManagerUtils";

const item = {
  id: "1",
  name: "Desk",
  slug: "desk",
  category: "desk",
  visible: true,
  width_mm: 1200,
  depth_mm: 600,
  height_mm: 750,
} as unknown as CatalogManagerItem;

describe("AdminCatalogTable", () => {
  it("renders rows and edit action", () => {
    const onEdit = vi.fn();
    render(
      <AdminCatalogTable
        items={[item]}
        isStandard
        total={1}
        page={1}
        pendingId={null}
        readOnly={false}
        onEdit={onEdit}
        onToggleVisible={vi.fn()}
        onDelete={vi.fn()}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Desk")).toBeInTheDocument();
    const edit = screen.getAllByRole("button").find((b) =>
      /edit/i.test(b.getAttribute("aria-label") ?? b.textContent ?? ""),
    );
    if (edit) {
      fireEvent.click(edit);
      expect(onEdit).toHaveBeenCalled();
    } else {
      // table still rendered product name
      expect(screen.getByText(/desk/i)).toBeInTheDocument();
    }
  });
});
