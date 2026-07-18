import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { LinearDeskParametricForm } from "@/features/admin/svg-editor/parametric/LinearDeskParametricForm";

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
    "aria-label"?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

/** Dockview needs a real layout engine; unit tests stub chrome host. */
vi.mock("@/features/admin/svg-editor/views/edit-shell/AdminSvgDockHost", () => ({
  AdminSvgDockHost: ({
    slots,
    titles,
    stageScrollable,
  }: {
    slots: {
      preview: React.ReactNode;
      stage: React.ReactNode;
      details: React.ReactNode;
    };
    titles?: { preview?: string; stage?: string; details?: string };
    stageScrollable?: boolean;
  }) => (
    <div
      data-testid="admin-svg-dock-host"
      data-chrome="dockview-react"
      data-stage-scrollable={String(Boolean(stageScrollable))}
      data-titles={`${titles?.preview ?? "Preview"}|${titles?.stage ?? "Studio"}|${titles?.details ?? "Details"}`}
    >
      <div data-testid="admin-svg-dock-panel-preview">{slots.preview}</div>
      <div data-testid="admin-svg-dock-panel-stage">{slots.stage}</div>
      <div data-testid="admin-svg-dock-panel-details">{slots.details}</div>
    </div>
  ),
}));

vi.mock("@/features/planner/asset-engine/svg/parametric", () => ({
  renderLinearDeskSvg: () =>
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect width="100" height="50"/></svg>',
}));

vi.mock("@/features/admin/svg-editor/parametric/publishLinearDeskAction", () => ({
  publishLinearDeskAction: vi.fn(),
}));

describe("LinearDeskParametricForm dock chrome", () => {
  it("uses shared dock shell language (topbar, status, dock host, form stage)", () => {
    render(<LinearDeskParametricForm />);

    const root = screen.getByTestId("admin-linear-desk-parametric");
    expect(root).toHaveAttribute("data-admin-shell", "parametric");
    expect(root.getAttribute("data-chrome")).toMatch(/dockview-react/);
    expect(root.getAttribute("data-chrome")).toMatch(/aria/);
    expect(root.getAttribute("data-chrome")).toMatch(/phosphor/);
    expect(root).toHaveClass("admin-svg-editor-workspace--dock");

    expect(screen.getByTestId("admin-shell-header")).toBeInTheDocument();
    expect(screen.getByTestId("admin-shell-secondary-back")).toHaveAttribute(
      "href",
      "/admin/svg-editor",
    );
    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(/Linear desk/i);
    expect(screen.getByTestId("admin-svg-chrome-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-studio-status-engine")).toHaveTextContent(
      /form \+ Maker/i,
    );

    const dock = screen.getByTestId("admin-svg-dock-host");
    expect(dock).toHaveAttribute("data-stage-scrollable", "true");
    expect(dock).toHaveAttribute("data-titles", "Preview|Form|Details");

    expect(screen.getByTestId("admin-svg-engine-shell")).toHaveAttribute(
      "data-stage-layout",
      "dockview",
    );
    expect(screen.getByTestId("admin-svg-engine-stage")).toHaveAttribute(
      "data-stage-engine",
      "form-maker",
    );
    expect(screen.getByTestId("linear-desk-width")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-preview")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-publish")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-publish-top")).toBeInTheDocument();
  });

  it("shows ready badge when default form validates", () => {
    render(<LinearDeskParametricForm />);
    expect(screen.getByText(/Ready to publish/i)).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-studio-status-validation")).toHaveTextContent(
      /Draft ready/i,
    );
  });
});
