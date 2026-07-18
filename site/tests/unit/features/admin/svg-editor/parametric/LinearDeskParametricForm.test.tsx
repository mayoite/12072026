import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

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

/** Planner rail is mounted live; unit tests only need presence + a11y shell. */
vi.mock("@/features/planner/editor/CanvasToolRail", () => ({
  CanvasToolRail: ({
    pinned,
    activeTool,
  }: {
    pinned?: boolean;
    activeTool?: string;
  }) => (
    <div
      data-testid="canvas-tool-rail"
      data-pinned={String(Boolean(pinned))}
      data-active-tool={activeTool ?? "select"}
      role="toolbar"
      aria-label="Canvas tools"
    />
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

describe("LinearDeskParametricForm dual-pane (32+35+37 lock)", () => {
  beforeEach(() => {
    publishLinearDeskAction.mockReset();
  });

  it("exposes form sections: Units · Size · Pedestals · Identity", () => {
    render(<LinearDeskParametricForm />);

    const formCol = screen.getByTestId("admin-svg-engine-stage");
    const legends = within(formCol)
      .queryAllByRole("group")
      .flatMap((group) => {
        const legend = group.querySelector("legend");
        return legend?.textContent?.trim() ? [legend.textContent.trim()] : [];
      });
    const sectionTitles =
      legends.length > 0
        ? legends
        : Array.from(
            formCol.querySelectorAll(".admin-parametric-form__section-title"),
          ).map((el) => el.textContent?.trim() ?? "");

    expect(sectionTitles).toEqual(
      expect.arrayContaining(["Units", "Size", "Pedestals", "Identity"]),
    );

    expect(screen.getByTestId("linear-desk-width")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-depth")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-height")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-pedestal-top-gap")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-slug")).toBeInTheDocument();
    expect(screen.getByLabelText(/Display unit/i)).toBeInTheDocument();
  });

  it("uses plan-left dual pane, status strip, planner rail, summary chips", () => {
    render(<LinearDeskParametricForm />);

    const root = screen.getByTestId("admin-linear-desk-parametric");
    expect(root).toHaveAttribute("data-admin-shell", "parametric");
    expect(root).toHaveAttribute("data-chrome", "planner-canvas-tool-rail");
    expect(root).toHaveAttribute("data-layout", "plan-left-form-right");
    expect(root).toHaveAttribute("data-layout-mix", "32-35-37");
    expect(root).toHaveClass("admin-svg-editor-workspace--dual-pane");

    expect(screen.getByTestId("admin-shell-header")).toBeInTheDocument();
    expect(screen.getByTestId("admin-shell-secondary-back")).toHaveAttribute(
      "href",
      "/admin/svg-editor",
    );
    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(/Linear desk/i);

    // No dock invent, no decorative chrome toolbar
    expect(screen.queryByTestId("admin-svg-dock-host")).not.toBeInTheDocument();
    expect(screen.queryByTestId("admin-svg-chrome-toolbar")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Dock layout/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("admin-svg-studio-status-engine")).not.toBeInTheDocument();
    expect(screen.queryByText(/form \+ Maker/i)).not.toBeInTheDocument();

    // Dual pane shell
    expect(screen.getByTestId("admin-svg-engine-shell")).toHaveAttribute(
      "data-stage-layout",
      "dual-pane-plan-left",
    );
    expect(screen.getByTestId("admin-parametric-dual")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-engine-stage")).toHaveAttribute(
      "data-stage-engine",
      "form-maker",
    );

    // Planner tool rail (real component path)
    const rail = screen.getByTestId("canvas-tool-rail");
    expect(rail).toHaveAttribute("data-pinned", "true");
    expect(rail).toHaveAttribute("aria-label", "Canvas tools");

    // Plan + form
    expect(screen.getByTestId("linear-desk-width")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-preview")).toBeInTheDocument();

    // Status strip (scenario 37)
    expect(screen.getByTestId("admin-svg-studio-status")).toBeInTheDocument();

    // One primary Publish
    expect(screen.getByTestId("linear-desk-publish")).toBeInTheDocument();
    expect(screen.queryByTestId("linear-desk-publish-top")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("linear-desk-publish")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /^Publish$/i })).toHaveLength(1);

    // Summary chips in form column (not third dock panel with inputs)
    const summary = screen.getByTestId("admin-svg-details-rail");
    expect(within(summary).getByTestId("linear-desk-details-slug")).toBeInTheDocument();
    expect(within(summary).getByTestId("linear-desk-details-footprint")).toBeInTheDocument();
    expect(within(summary).queryAllByRole("textbox")).toHaveLength(0);
    expect(within(summary).queryAllByRole("spinbutton")).toHaveLength(0);
    expect(within(summary).queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Publish to disk/i })).not.toBeInTheDocument();
  });

  it("shows ready status when default form validates", () => {
    render(<LinearDeskParametricForm />);
    expect(screen.getByText(/Ready to publish/i)).toBeInTheDocument();
    const validation = screen.getByTestId("admin-svg-studio-status-validation");
    expect(validation).toHaveTextContent(/Ready/i);
  });

  it("live Maker preview for default 1600 mm desk is multipath (desk-top + pedestals)", () => {
    render(<LinearDeskParametricForm />);

    const preview = screen.getByTestId("linear-desk-preview");
    const html = preview.innerHTML;
    expect(html).toMatch(/^<svg[\s>]/i);
    expect(html).toContain('id="desk-top"');
    expect(html).toContain('id="pedestal-l"');
    expect(html).toContain('id="pedestal-r"');
    expect(html).not.toContain('id="frame"');
    expect(html).not.toMatch(/currentColor|var\s*\(/i);
    expect(screen.getByTestId("linear-desk-details-footprint")).toHaveTextContent(
      "1600×800 mm",
    );
    expect(screen.getByTestId("linear-desk-details-slug")).toHaveTextContent(
      defaultLinearDeskSlug(1600),
    );
  });

  it("Publish opens confirm; confirm does not call action until Publish for guests", async () => {
    const slug = defaultLinearDeskSlug(1600);
    const sku = defaultLinearDeskSku(1600);
    publishLinearDeskAction.mockResolvedValue({
      success: true,
      descriptor: { slug, sku },
    });

    render(<LinearDeskParametricForm />);

    fireEvent.click(screen.getByTestId("linear-desk-publish"));

    const dialog = await screen.findByTestId("linear-desk-publish-confirm");
    expect(dialog).toHaveAttribute("role", "dialog");
    expect(publishLinearDeskAction).not.toHaveBeenCalled();

    expect(screen.getByTestId("linear-desk-confirm-name")).toHaveTextContent(
      /Linear desk/i,
    );
    expect(screen.getByTestId("linear-desk-confirm-sku")).toHaveTextContent(sku);
    expect(screen.getByTestId("linear-desk-confirm-slug")).toHaveTextContent(
      slug,
    );
    expect(screen.getByTestId("linear-desk-confirm-footprint")).toHaveTextContent(
      "1600×800 mm",
    );
    expect(dialog).toHaveTextContent(/guests can place/i);

    fireEvent.click(screen.getByTestId("linear-desk-publish-confirm-submit"));

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
        slug,
        sku,
      }),
    );
    expect(String(raw.slug)).toMatch(/^oando-/);

    await waitFor(() => {
      const msg = screen.getByTestId("linear-desk-message");
      expect(msg).toHaveTextContent(
        new RegExp(slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );
      expect(msg).toHaveTextContent(/Published/i);
      expect(msg).toHaveTextContent(sku);
    });

    const lifecycle = screen.getByTestId("admin-svg-studio-status-draft");
    expect(lifecycle).toHaveTextContent(/Published/i);
    expect(lifecycle).toHaveTextContent(/live for guests/i);
    expect(lifecycle).toHaveAttribute("data-lifecycle", "published");
    expect(screen.getByTestId("admin-linear-desk-parametric")).toHaveAttribute(
      "data-publish-state",
      "published",
    );

    const inventory = screen.getByTestId("linear-desk-open-inventory");
    expect(inventory).toHaveAttribute("href", "/admin/svg-editor");
    const planner = screen.getByTestId("linear-desk-verify-planner");
    expect(planner).toHaveAttribute("href", "/planner/guest/");

    expect(
      screen.queryByTestId("linear-desk-publish-confirm"),
    ).not.toBeInTheDocument();
  });
});
