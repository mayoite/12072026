import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LinearDeskParametricForm } from "@/features/admin/svg-editor/parametric/LinearDeskParametricForm";
import {
  defaultLinearDeskSku,
  defaultLinearDeskSlug,
} from "@/features/admin/svg-editor/parametric/linearDeskGuestIdentity";

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

/** Dockview needs a real layout engine; unit tests stub chrome host only. */
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

/**
 * Live Maker path — do NOT stub renderLinearDeskSvg to a grey rect.
 * Preview multipath claims must fail if Maker draw regresses.
 */

const { publishLinearDeskAction } = vi.hoisted(() => ({
  publishLinearDeskAction: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/parametric/publishLinearDeskAction", () => ({
  publishLinearDeskAction,
}));

describe("LinearDeskParametricForm dock chrome", () => {
  beforeEach(() => {
    publishLinearDeskAction.mockReset();
  });

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

  it("live Maker preview for default 1600 mm desk is multipath (desk-top + pedestals)", () => {
    render(<LinearDeskParametricForm />);

    const preview = screen.getByTestId("linear-desk-preview");
    const html = preview.innerHTML;
    // Live pen — not a grey rect stub
    expect(html).toMatch(/^<svg[\s>]/i);
    expect(html).toContain('id="desk-top"');
    expect(html).toContain('id="pedestal-l"');
    expect(html).toContain('id="pedestal-r"');
    expect(html).not.toContain('id="frame"');
    expect(html).not.toMatch(/currentColor|var\s*\(/i);
    // Footprint identity: default cm form = 160 cm → 1600 mm
    expect(screen.getByTestId("linear-desk-details-footprint")).toHaveTextContent(
      "1600×800 mm",
    );
    expect(screen.getByTestId("linear-desk-details-slug")).toHaveTextContent(
      defaultLinearDeskSlug(1600),
    );
  });

  it("Publish passes form → action args: widthMm 1600, guest slug, commercial SKU", async () => {
    publishLinearDeskAction.mockResolvedValue({
      success: true,
      descriptor: {
        slug: defaultLinearDeskSlug(1600),
        sku: defaultLinearDeskSku(1600),
      },
    });

    render(<LinearDeskParametricForm />);

    fireEvent.click(screen.getByTestId("linear-desk-publish"));

    await waitFor(() => {
      expect(publishLinearDeskAction).toHaveBeenCalledTimes(1);
    });

    const raw = publishLinearDeskAction.mock.calls[0]?.[0] as Record<
      string,
      unknown
    >;
    expect(raw).toEqual(
      expect.objectContaining({
        type: "linear-desk",
        widthMm: 1600,
        depthMm: 800,
        heightMm: 750,
        pedestalCount: 2,
        slug: defaultLinearDeskSlug(1600),
        sku: defaultLinearDeskSku(1600),
      }),
    );
    expect(String(raw.slug)).toMatch(/^oando-/);

    await waitFor(() => {
      expect(screen.getByTestId("linear-desk-message")).toHaveTextContent(
        /Published oando-linear-desk-1600/i,
      );
    });
  });
});
