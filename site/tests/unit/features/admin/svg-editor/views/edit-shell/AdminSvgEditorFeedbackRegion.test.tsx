import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminSvgEditorFeedbackRegion } from "@/features/admin/svg-editor/views/edit-shell/AdminSvgEditorFeedbackRegion";
import { INITIAL_FEEDBACK } from "@/features/admin/svg-editor/views/edit-shell/useAdminSvgEditorPublish";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    "data-testid"?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const base = {
  slug: "side-table-001",
  plannerVerifyHref: "/planner/guest",
  publishArtifactHref: (productSlug: string) => `/svg-catalog/${productSlug}.svg`,
  onDismiss: vi.fn(),
};

describe("AdminSvgEditorFeedbackRegion", () => {
  it("renders empty live region when feedback is neutral", () => {
    render(
      <AdminSvgEditorFeedbackRegion {...base} feedback={INITIAL_FEEDBACK} />,
    );
    const region = screen.getByTestId("admin-svg-a11y-live-feedback");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows submitting status with slug and keep-open guidance", () => {
    render(
      <AdminSvgEditorFeedbackRegion
        {...base}
        feedback={{ ...INITIAL_FEEDBACK, submitting: true }}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(/Publishing/);
    expect(screen.getByRole("status")).toHaveTextContent("side-table-001");
    expect(screen.getByRole("status")).toHaveTextContent(/Keep this page open/i);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("shows error alert and dismisses via button", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <AdminSvgEditorFeedbackRegion
        {...base}
        onDismiss={onDismiss}
        feedback={{
          ...INITIAL_FEEDBACK,
          errorMessage: "Publish blocked by validation.",
        }}
      />,
    );
    expect(screen.getByTestId("admin-svg-publish-failure")).toHaveTextContent(
      "Publish blocked by validation.",
    );
    await user.click(screen.getByRole("button", { name: /Dismiss error/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("shows success with artifact and planner links when publishedSlug set", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <AdminSvgEditorFeedbackRegion
        {...base}
        onDismiss={onDismiss}
        feedback={{
          ...INITIAL_FEEDBACK,
          successMessage: "Published side-table-001.",
          publishedSlug: "side-table-001",
        }}
      />,
    );
    expect(screen.getByTestId("admin-svg-publish-success")).toHaveTextContent(
      "Published side-table-001.",
    );
    expect(screen.getByTestId("admin-svg-publish-success")).toHaveClass(
      "admin-alert--success",
    );
    expect(screen.getByTestId("admin-svg-publish-success-artifact")).toHaveAttribute(
      "href",
      "/svg-catalog/side-table-001.svg",
    );
    expect(screen.getByTestId("admin-svg-publish-success-planner")).toHaveAttribute(
      "href",
      "/planner/guest",
    );
    await user.click(
      screen.getByRole("button", { name: /Dismiss success message/i }),
    );
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("omits success links when publishedSlug is null", () => {
    render(
      <AdminSvgEditorFeedbackRegion
        {...base}
        feedback={{
          ...INITIAL_FEEDBACK,
          successMessage: "Done.",
          publishedSlug: null,
        }}
      />,
    );
    expect(
      screen.queryByTestId("admin-svg-publish-success-artifact"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("admin-svg-publish-success-planner"),
    ).not.toBeInTheDocument();
  });
});
