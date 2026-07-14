import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminWorkspaceCatalogPageView, {
  AdminCanvasConfigSection,
} from "@/features/admin/AdminWorkspaceCatalogPageView";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe("AdminWorkspaceCatalogPageView", () => {
  it("exports canvas config section and page", () => {
    expect(typeof AdminCanvasConfigSection).toBe("function");
    render(<AdminCanvasConfigSection />);
    expect(document.body.textContent?.length).toBeGreaterThan(0);
    render(<AdminWorkspaceCatalogPageView />);
    expect(document.body.textContent?.length).toBeGreaterThan(0);
  });
});
