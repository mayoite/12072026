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

  it("exposes form sections: Units · Size · Pedestals · Identity", () => {
    render(<LinearDeskParametricForm />);

    const stage = screen.getByTestId("admin-svg-dock-panel-stage");
    // Prefer legends (fieldset section titles); fall back to section-title text.
    const legends = within(stage)
      .queryAllByRole("group")
      .flatMap((group) => {
        const legend = group.querySelector("legend");
        return legend?.textContent?.trim() ? [legend.textContent.trim()] : [];
      });
    const sectionTitles =
      legends.length > 0
        ? legends
        : Array.from(
            stage.querySelectorAll(".admin-parametric-form__section-title"),
          ).map((el) => el.textContent?.trim() ?? "");

    expect(sectionTitles).toEqual(
      expect.arrayContaining(["Units", "Size", "Pedestals", "Identity"]),
    );

    // Size / pedestals controls present
    expect(screen.getByTestId("linear-desk-width")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-depth")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-height")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-pedestal-top-gap")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-slug")).toBeInTheDocument();
    expect(screen.getByLabelText(/Display unit/i)).toBeInTheDocument();
  });

  it("uses calm product chrome: one publish, read-only details, dock panels", () => {
    render(<LinearDeskParametricForm />);

    const root = screen.getByTestId("admin-linear-desk-parametric");
    expect(root).toHaveAttribute("data-admin-shell", "parametric");
    expect(root.getAttribute("data-chrome")).toMatch(/dockview-react/);
    expect(root).toHaveClass("admin-svg-editor-workspace--dock");

    expect(screen.getByTestId("admin-shell-header")).toBeInTheDocument();
    expect(screen.getByTestId("admin-shell-secondary-back")).toHaveAttribute(
      "href",
      "/admin/svg-editor",
    );
    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(/Linear desk/i);

    // No decorative Dock toggle / icon legend
    expect(screen.queryByTestId("admin-svg-chrome-toolbar")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Dock layout/i)).not.toBeInTheDocument();
    // No engineer slogans in status
    expect(screen.queryByTestId("admin-svg-studio-status-engine")).not.toBeInTheDocument();
    expect(screen.queryByText(/form \+ Maker/i)).not.toBeInTheDocument();

    const dock = screen.getByTestId("admin-svg-dock-host");
    expect(dock).toHaveAttribute("data-stage-scrollable", "true");
    // U titles: Preview | Form | Summary (details panel is product Summary)
    expect(dock.getAttribute("data-titles")).toMatch(
      /^Preview\|Form\|(Summary|Details)$/,
    );

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

    // One primary Publish (top bar only)
    expect(screen.getByTestId("linear-desk-publish")).toBeInTheDocument();
    expect(screen.queryByTestId("linear-desk-publish-top")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("linear-desk-publish")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /^Publish$/i })).toHaveLength(1);

    // Details = read-only mirror (no second Publish, no editable fields)
    const details = screen.getByTestId("admin-svg-dock-panel-details");
    expect(within(details).getByTestId("linear-desk-details-slug")).toBeInTheDocument();
    expect(within(details).queryAllByRole("textbox")).toHaveLength(0);
    expect(within(details).queryAllByRole("spinbutton")).toHaveLength(0);
    expect(within(details).queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Publish to disk/i })).not.toBeInTheDocument();
  });

  it("shows ready status when default form validates", () => {
    render(<LinearDeskParametricForm />);
    expect(screen.getByText(/Ready to publish/i)).toBeInTheDocument();
    const validation = screen.getByTestId("admin-svg-studio-status-validation");
    // U may say "Ready" or legacy "Draft ready"
    expect(validation).toHaveTextContent(/Ready/i);
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
    const slug = defaultLinearDeskSlug(1600);
    const sku = defaultLinearDeskSku(1600);
    publishLinearDeskAction.mockResolvedValue({
      success: true,
      descriptor: { slug, sku },
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
        slug,
        sku,
      }),
    );
    expect(String(raw.slug)).toMatch(/^oando-/);

    await waitFor(() => {
      const msg = screen.getByTestId("linear-desk-message");
      // Accept current U copy or formatLinearDeskPublishSuccess style
      expect(msg).toHaveTextContent(new RegExp(slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      expect(msg).toHaveTextContent(/Published/i);
    });
  });

  it("marks broken width with aria-invalid and blocks publish", () => {
    render(<LinearDeskParametricForm />);

    const width = screen.getByTestId("linear-desk-width");
    // Default unit is cm: 10 cm = 100 mm < min 600 mm → invalid
    fireEvent.change(width, { target: { value: "10" } });

    expect(width).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-publish")).toBeDisabled();
    expect(screen.getByTestId("linear-desk-preview-blocked")).toBeInTheDocument();
    expect(screen.queryByTestId("linear-desk-preview")).not.toBeInTheDocument();
    expect(screen.getByText(/Blocked/i)).toBeInTheDocument();
  });
});
