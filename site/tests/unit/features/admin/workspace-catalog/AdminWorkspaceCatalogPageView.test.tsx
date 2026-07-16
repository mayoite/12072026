import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminWorkspaceCatalogPageView, {
  AdminCanvasConfigSection,
} from "@/features/admin/workspace-catalog/AdminWorkspaceCatalogPageView";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    "data-testid"?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("AdminWorkspaceCatalogPageView", () => {
  it("exports canvas config section and page", () => {
    expect(typeof AdminCanvasConfigSection).toBe("function");
    render(<AdminCanvasConfigSection />);
    expect(document.body.textContent?.length).toBeGreaterThan(0);
  });

  it("states read-only workspace element library purpose clearly", () => {
    render(<AdminWorkspaceCatalogPageView />);
    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(
      /read-only workspace element library/i,
    );
    expect(screen.getByTestId("admin-workspace-catalog-copy")).toHaveTextContent(
      /read-only workspace element library/i,
    );
    expect(screen.getByTestId("admin-workspace-readonly-banner")).toHaveTextContent(
      /browse only/i,
    );
    expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(/not editable/i);
  });

  it("exposes filters and inventory when static items exist", async () => {
    const user = userEvent.setup();
    render(<AdminWorkspaceCatalogPageView />);
    const search = screen.getByTestId("admin-workspace-search");
    expect(search).toBeInTheDocument();
    await user.type(search, "___no-such-workspace-sku-zzz___");
    expect(await screen.findByTestId("admin-workspace-empty")).toBeInTheDocument();
    expect(screen.getByTestId("admin-workspace-clear-filters")).toBeInTheDocument();
    expect(screen.getByTestId("admin-workspace-goto-standard")).toHaveAttribute(
      "href",
      "/admin/catalog",
    );
  });
});
