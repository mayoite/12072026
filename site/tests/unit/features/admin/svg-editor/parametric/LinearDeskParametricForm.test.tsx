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

vi.mock("@/features/planner/editor/CanvasToolRail", () => ({
  CanvasToolRail: ({ pinned }: { pinned?: boolean }) => (
    <div
      data-testid="canvas-tool-rail"
      data-pinned={String(Boolean(pinned))}
      role="toolbar"
      aria-label="Canvas tools"
    />
  ),
}));

const { publishLinearDeskAction } = vi.hoisted(() => ({
  publishLinearDeskAction: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/parametric/publishLinearDeskAction", () => ({
  publishLinearDeskAction,
}));

describe("LinearDeskParametricForm lock-32 (Agents-10)", () => {
  beforeEach(() => {
    publishLinearDeskAction.mockReset();
  });

  it("exposes form sections Units Size Pedestals Identity", () => {
    render(<LinearDeskParametricForm />);
    const formCol = screen.getByTestId("admin-svg-engine-stage");
    const legends = within(formCol)
      .queryAllByRole("group")
      .flatMap((g) => {
        const legend = g.querySelector("legend");
        return legend?.textContent?.trim() ? [legend.textContent.trim()] : [];
      });
    expect(legends).toEqual(
      expect.arrayContaining(["Units", "Size", "Pedestals", "Identity"]),
    );
    expect(screen.getByTestId("linear-desk-width")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-slug")).toBeInTheDocument();
    expect(
      within(formCol).getByRole("radiogroup", { name: /Display unit/i }),
    ).toBeInTheDocument();
  });

  it("lock-32: rail | desk properties | plan canvas", () => {
    render(<LinearDeskParametricForm />);
    const root = screen.getByTestId("admin-linear-desk-parametric");
    expect(root).toHaveAttribute("data-admin-shell", "parametric");
    expect(root).toHaveAttribute("data-chrome", "lock-32");
    expect(root).toHaveAttribute("data-lock-image", "32");
    expect(root).toHaveClass("admin-cad");
    expect(screen.queryByTestId("admin-svg-dock-host")).not.toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-engine-shell")).toHaveAttribute(
      "data-stage-layout",
      "lock-32",
    );
    const body = screen.getByTestId("admin-svg-engine-shell");
    const kids = [...body.children].map((c) => c.className);
    expect(kids[0]).toMatch(/admin-cad__rail/);
    expect(kids[1]).toMatch(/admin-cad__form/);
    expect(kids[2]).toMatch(/admin-cad__plan/);
    expect(screen.getByTestId("canvas-tool-rail")).toHaveAttribute(
      "data-pinned",
      "true",
    );
    expect(screen.getByText(/Desk properties/i)).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-preview")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-studio-status")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-publish")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-details-slug")).toBeInTheDocument();
    expect(screen.getByTestId("linear-desk-details-footprint")).toHaveTextContent(
      "1600×800 mm",
    );
  });

  it("shows ready when default form validates", () => {
    render(<LinearDeskParametricForm />);
    expect(screen.getByText(/^Ready$/i)).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-studio-status-validation")).toHaveTextContent(
      /Draft ready|Ready/i,
    );
  });

  it("live Maker multipath preview desk-top + pedestals", () => {
    render(<LinearDeskParametricForm />);
    const html = screen.getByTestId("linear-desk-preview").innerHTML;
    expect(html).toMatch(/^<svg[\s>]/i);
    expect(html).toContain('id="desk-top"');
    expect(html).toContain('id="pedestal-l"');
    expect(html).toContain('id="pedestal-r"');
    expect(screen.getByTestId("linear-desk-details-slug")).toHaveTextContent(
      defaultLinearDeskSlug(1600),
    );
  });

  it("Publish opens confirm then calls action", async () => {
    const slug = defaultLinearDeskSlug(1600);
    const sku = defaultLinearDeskSku(1600);
    publishLinearDeskAction.mockResolvedValue({
      success: true,
      descriptor: { slug, sku },
    });
    render(<LinearDeskParametricForm />);
    fireEvent.click(screen.getByTestId("linear-desk-publish"));
    const dialog = await screen.findByTestId("linear-desk-publish-confirm");
    expect(dialog).toBeInTheDocument();
    expect(publishLinearDeskAction).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("linear-desk-publish-confirm-submit"));
    await waitFor(() => {
      expect(publishLinearDeskAction).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("linear-desk-message")).toHaveTextContent(/Published/i);
    });
  });
});
