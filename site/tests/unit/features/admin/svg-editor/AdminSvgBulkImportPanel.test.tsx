import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { AdminSvgBulkImportPanel } from "@/features/admin/svg-editor/AdminSvgBulkImportPanel";

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
  browserApiFetch: vi.fn(),
}));

describe("AdminSvgBulkImportPanel", () => {
  it("renders bulk import chrome", () => {
    render(<AdminSvgBulkImportPanel />);
    expect(document.body.textContent?.toLowerCase()).toMatch(/import|csv|bulk/);
  });
});
