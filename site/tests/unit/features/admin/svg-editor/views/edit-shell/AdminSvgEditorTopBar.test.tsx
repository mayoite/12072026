import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminSvgEditorTopBar } from "@/features/admin/svg-editor/views/edit-shell/AdminSvgEditorTopBar";

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

const baseProps = {
  slug: "side-table-001",
  updatedAtLabel: "2026-07-01",
  sku: "OFL-TBL-001",
  authoringLifecycle: "clean" as const,
  lifecycle: "draft" as const,
  artifactState: "published" as const,
  approving: false,
  submitting: false,
  formDirty: false,
  canPublish: true,
  onReset: vi.fn(),
  onApprove: vi.fn(),
  onPublish: vi.fn(),
};

describe("AdminSvgEditorTopBar", () => {
  it("renders identity, SKU, and shell landmarks", () => {
    render(<AdminSvgEditorTopBar {...baseProps} />);

    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(
      "side-table-001",
    );
    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent(
      "SKU OFL-TBL-001",
    );
    expect(screen.getByTestId("admin-shell-scope")).toHaveTextContent(
      /SVG studio/i,
    );
    expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(
      "2026-07-01",
    );
    expect(screen.getByTestId("admin-shell-state")).toHaveTextContent(
      /Symbol released/i,
    );
    expect(screen.getByTestId("admin-shell-state")).toHaveTextContent(
      /Not yet approved for buyers/i,
    );
    expect(screen.getByTestId("admin-shell-secondary-back")).toHaveAttribute(
      "href",
      "/admin/svg-editor",
    );
    expect(screen.getByTestId("admin-shell-secondary-back")).toHaveAttribute(
      "aria-label",
      "Back to SVG inventory",
    );
  });

  it("hides SKU span when sku is empty and falls back slug to new", () => {
    render(<AdminSvgEditorTopBar {...baseProps} slug="" sku="" />);
    expect(screen.getByTestId("admin-shell-title")).toHaveTextContent("new");
    expect(screen.getByTestId("admin-shell-title")).not.toHaveTextContent("SKU");
  });

  it("shows live badge and unsaved draft copy when lifecycle is live and dirty", () => {
    render(
      <AdminSvgEditorTopBar
        {...baseProps}
        lifecycle="live"
        formDirty
        authoringLifecycle="dirty"
      />,
    );
    expect(screen.getByText("Live for buyers")).toBeInTheDocument();
    expect(screen.getByTestId("admin-shell-state")).toHaveTextContent(
      /Approved for buyers/i,
    );
    expect(screen.getByTestId("admin-shell-state")).toHaveTextContent(
      /Unsaved draft changes/i,
    );
    expect(screen.getByTestId("admin-shell-dirty-badge")).toHaveTextContent(
      /Unsaved changes/i,
    );
  });

  it("keeps one primary Publish; reset and approve stay non-primary", () => {
    render(<AdminSvgEditorTopBar {...baseProps} formDirty canPublish />);
    const actions = screen.getByTestId("admin-shell-actions");
    expect(actions.querySelectorAll(".admin-btn--primary")).toHaveLength(1);
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveClass(
      "admin-btn--primary",
    );
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveTextContent(
      /^Publish$/,
    );
    expect(screen.getByTestId("admin-shell-destructive-reset")).toHaveTextContent(
      /Reset draft/i,
    );
    expect(screen.getByTestId("admin-shell-destructive-reset")).not.toHaveClass(
      "admin-btn--primary",
    );
    expect(screen.getByTestId("admin-shell-secondary-approve")).toHaveTextContent(
      /Approve for buyers/i,
    );
    expect(screen.getByTestId("admin-shell-secondary-approve")).not.toHaveClass(
      "admin-btn--primary",
    );
  });

  it("shows Never published when artifact is missing", () => {
    render(
      <AdminSvgEditorTopBar {...baseProps} artifactState="missing" />,
    );
    expect(screen.getByTestId("admin-shell-source")).toHaveTextContent(
      /^Never published$/,
    );
    expect(screen.getByTestId("admin-shell-source")).not.toHaveTextContent(
      /Last published/i,
    );
  });

  it("disables reset when clean; enables when dirty", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    const { rerender } = render(
      <AdminSvgEditorTopBar {...baseProps} onReset={onReset} formDirty={false} />,
    );
    expect(screen.getByTestId("admin-shell-destructive-reset")).toBeDisabled();

    rerender(
      <AdminSvgEditorTopBar {...baseProps} onReset={onReset} formDirty />,
    );
    const reset = screen.getByTestId("admin-shell-destructive-reset");
    expect(reset).not.toBeDisabled();
    await user.click(reset);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("disables approve when live or artifact not published", () => {
    const { rerender } = render(
      <AdminSvgEditorTopBar
        {...baseProps}
        lifecycle="live"
        artifactState="published"
      />,
    );
    expect(screen.getByTestId("admin-shell-secondary-approve")).toBeDisabled();

    rerender(
      <AdminSvgEditorTopBar
        {...baseProps}
        lifecycle="draft"
        artifactState="missing"
      />,
    );
    expect(screen.getByTestId("admin-shell-secondary-approve")).toBeDisabled();
  });

  it("invokes approve and publish handlers when enabled", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    const onPublish = vi.fn();
    render(
      <AdminSvgEditorTopBar
        {...baseProps}
        onApprove={onApprove}
        onPublish={onPublish}
        canPublish
      />,
    );

    await user.click(screen.getByTestId("admin-shell-secondary-approve"));
    await user.click(screen.getByTestId("admin-shell-primary-action"));
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it("disables publish when canPublish is false and describes impact", () => {
    render(<AdminSvgEditorTopBar {...baseProps} canPublish={false} />);
    const publish = screen.getByTestId("admin-shell-primary-action");
    expect(publish).toBeDisabled();
    expect(publish).toHaveAttribute(
      "aria-describedby",
      "admin-svg-publication-impact",
    );
    expect(publish).toHaveAttribute("title", expect.stringMatching(/blocked/i));
  });

  it("shows Publishing label while submitting", () => {
    render(
      <AdminSvgEditorTopBar
        {...baseProps}
        submitting
        canPublish={false}
      />,
    );
    expect(screen.getByTestId("admin-shell-primary-action")).toHaveTextContent(
      /Publishing/i,
    );
  });
});
