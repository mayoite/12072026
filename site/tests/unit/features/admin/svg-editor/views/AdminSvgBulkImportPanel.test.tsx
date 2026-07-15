import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { AdminSvgBulkImportPanel } from "@/features/admin/svg-editor/views/AdminSvgBulkImportPanel";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
  browserApiFetch: vi.fn(),
}));

describe("AdminSvgBulkImportPanel", () => {
  it("renders bulk import chrome", () => {
    const { container } = render(<AdminSvgBulkImportPanel />);
    expect(document.body.textContent?.toLowerCase()).toMatch(/import|csv|bulk/);
    expect(container.querySelector("[data-testid='admin-svg-bulk-import'] [style]")).toBeNull();
  });
});
